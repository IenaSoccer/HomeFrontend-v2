#!/usr/bin/env bash
set -Eeuo pipefail

printf '{"commit":"%s","run_id":"%s"}\n' "$GITHUB_SHA" "$GITHUB_RUN_ID" \
  > public/deployment.json
trap 'rm -f -- public/deployment.json' EXIT
npm run build:ssr

mkdir -p dist/ssr/deploy
cp deploy/ecosystem.config.cjs dist/ssr/deploy/
cp deploy/ssr-package-lock.json dist/ssr/package-lock.json
test -s dist/ssr/client/deployment.json
npm --prefix dist/ssr ci --omit=dev --ignore-scripts --no-audit --no-fund
node scripts/audit-production.mjs dist/ssr
tar -C dist/ssr -czf "$RUNNER_TEMP/release.tgz" .
