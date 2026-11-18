#!/usr/bin/env bash
set -Eeuo pipefail

deploy_path="$1"
release_id="$2"
checksum="$3"
environment="$4"
instances="$5"

[[ "$deploy_path" =~ ^/[A-Za-z0-9._/-]+$ && "$deploy_path" != *".."* && "$deploy_path" != / ]]
[[ "$release_id" =~ ^[0-9a-f]{40}-[0-9]+$ ]]
[[ "$instances" =~ ^[1-9][0-9]*$ ]]
case "$environment" in
  production)
    app_name=iena-homefrontend
    port=3000
    ;;
  staging)
    app_name=iena-homefrontend-staging
    port=3001
    export PM2_HOME="$deploy_path/.pm2"
    install -d -m 700 -- "$PM2_HOME"
    ;;
  *) exit 1 ;;
esac

archive="$deploy_path/incoming/$release_id.tgz"
releases="$deploy_path/releases"
release="$releases/$release_id"
current="$deploy_path/current"
previous="$deploy_path/previous"
old="$(readlink -f "$current" 2>/dev/null || true)"
ecosystem="$release/deploy/ecosystem.config.cjs"

# Verify the archive and entrypoints before changing the active release.
test -f "$archive"
test "$(sha256sum "$archive" | awk '{ print $1 }')" = "$checksum"
test ! -e "$release"
mkdir -p -- "$release/logs"
tar -xzf "$archive" -C "$release"
rm -f -- "$archive"
test -f "$release/index.js"
test -f "$ecosystem"
test -f "$release/client/deployment.json"

if [[ -n "$old" && -d "$old" ]]; then
  ln -sfn "$old" "$previous"
fi
next="$deploy_path/.current-$release_id"
rm -f -- "$next"
ln -s "$release" "$next"
mv -Tf -- "$next" "$current"

export DEPLOY_ENVIRONMENT="$environment" PM2_APP_NAME="$app_name" PM2_INSTANCES="$instances" SSR_PORT="$port"
export DEPLOY_ROOT_PATH="$deploy_path" DEPLOY_CURRENT_PATH="$release"

# Restore the previous release if PM2 fails during activation.
rollback() {
  if [[ -n "$old" && -d "$old" ]]; then
    rollback_link="$deploy_path/.rollback-$release_id"
    rm -f -- "$rollback_link"
    ln -s "$old" "$rollback_link"
    mv -Tf -- "$rollback_link" "$current"
    export DEPLOY_CURRENT_PATH="$old"
    pm2 startOrGracefulReload "$old/deploy/ecosystem.config.cjs" \
      --only "$app_name" --update-env || true
  fi
}
trap rollback ERR

if pm2 describe "$app_name" >/dev/null 2>&1; then
  pm2_cwd="$(pm2 jlist | node -e '
    const { readFileSync } = require("node:fs");
    const apps = JSON.parse(readFileSync(0, "utf8"));
    const app = apps.find(item => item.name === process.argv[1]);
    process.stdout.write(app?.pm2_env?.pm_cwd || "");
  ' "$app_name")"
  if test "$pm2_cwd" = "$deploy_path"; then
    pm2 startOrGracefulReload "$ecosystem" --only "$app_name" --update-env
  else
    echo "Migrating $app_name to the stable deployment entrypoint"
    pm2 delete "$app_name"
    pm2 start "$ecosystem" --only "$app_name"
  fi
else
  pm2 start "$ecosystem" --only "$app_name"
fi

trap - ERR
pm2 save

# Keep the five most recent releases and both symlink targets.
current_target="$(readlink -f "$current")"
previous_target="$(readlink -f "$previous" 2>/dev/null || true)"
find "$releases" -mindepth 1 -maxdepth 1 -type d -printf '%T@ %p\n' |
  sort -rn | tail -n +6 | cut -d' ' -f2- |
  while IFS= read -r stale; do
    stale="$(readlink -f "$stale")"
    test "$stale" = "$current_target" || test "$stale" = "$previous_target" || rm -rf -- "$stale"
  done || true
