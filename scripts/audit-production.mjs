import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import process from 'node:process';

const target = process.argv[2] ?? '.';
const targetDirectory = resolve(target);
const isWindows = process.platform === 'win32';
const allowedAdvisories = new Set([
  // No patched picomatch release exists yet. Remove this exception as soon as
  // https://github.com/advisories/GHSA-fc5q-39xc-vjpf has a fixed version.
  'https://github.com/advisories/GHSA-fc5q-39xc-vjpf',
]);

const result = isWindows
  ? spawnSync(process.env.ComSpec ?? 'cmd.exe', ['/d', '/s', '/c', 'npm audit --omit=dev --json'], {
      cwd: targetDirectory,
      encoding: 'utf8',
    })
  : spawnSync('npm', ['audit', '--omit=dev', '--json'], {
      cwd: targetDirectory,
      encoding: 'utf8',
    });

if (result.error) {
  throw result.error;
}

let report;
try {
  report = JSON.parse(result.stdout);
} catch {
  process.stderr.write(result.stderr || result.stdout);
  console.error(`Unable to parse npm audit output for ${target}.`);
  process.exit(1);
}

if (report.error) {
  console.error(`npm audit failed for ${target}: ${report.error.summary ?? report.error.code}`);
  process.exit(1);
}

const vulnerabilities = report.vulnerabilities ?? {};
const relevant = new Map(
  Object.entries(vulnerabilities).filter(([, vulnerability]) =>
    ['high', 'critical'].includes(vulnerability.severity),
  ),
);
const allowedPackages = new Set();

let changed = true;
while (changed) {
  changed = false;
  for (const [name, vulnerability] of relevant) {
    if (allowedPackages.has(name) || vulnerability.via.length === 0) continue;

    const isAllowed = vulnerability.via.every((cause) =>
      typeof cause === 'string'
        ? allowedPackages.has(cause)
        : allowedAdvisories.has(cause.url),
    );

    if (isAllowed) {
      allowedPackages.add(name);
      changed = true;
    }
  }
}

const blocked = [...relevant.keys()].filter((name) => !allowedPackages.has(name));
if (blocked.length > 0) {
  console.error(
    `npm audit found non-allowlisted high/critical vulnerabilities in ${target}: ${blocked.join(', ')}`,
  );
  process.exit(1);
}

if (allowedPackages.size > 0) {
  console.warn(
    `npm audit: temporarily allowing GHSA-fc5q-39xc-vjpf chain in ${target} (${allowedPackages.size} packages); no patched release is available.`,
  );
} else {
  console.log(`npm audit: no high/critical production vulnerabilities in ${target}.`);
}
