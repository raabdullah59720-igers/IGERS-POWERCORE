import { existsSync, rmSync, mkdirSync, cpSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, extname } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = resolve(process.cwd());
const dist = join(root, 'dist');
const skipDirs = new Set(['node_modules', 'dist', '.git', '.github', '__pycache__', '.pytest_cache', '.mypy_cache', '.venv', 'venv', 'tests']);
const skipFiles = new Set([
  '.DS_Store', 'build.mjs', 'server.mjs', 'package.json', 'package-lock.json',
  'company_backend.py', 'render.yaml', 'vercel.json', '.gitignore',
  'README.md', 'README_BN.txt', 'PROJECT-DOCUMENTATION-ARCHIVE.md',
  'UPGRADE-AND-VALIDATION-REPORT.md', 'POWERCORE-12-UPGRADE-REPORT.md',
  'FULL-PANEL-AUDIT-REPORT.md', 'BUGFIX-VERIFY-REPORT.md', 'SECTION-GROUPING-UPDATE.md',
  'COMPANY-OPERATIONS-SETUP.md', 'STYLES-SOURCE-ARCHIVE.css', 'TEMPLATE',
  'border-status-integration-snippet.html', 'integration-snippet.html'
]);
const skipExtensions = new Set(['.py', '.pyc', '.pyo', '.md', '.txt', '.bat', '.mjs', '.jsx', '.sqlite3', '.db', '.log', '.tmp', '.env']);

function shouldSkip(name) {
  return skipDirs.has(name) || skipFiles.has(name) || name.endsWith('.pyc') || name.endsWith('.pyo') || name.startsWith('.env') || skipExtensions.has(extname(name).toLowerCase());
}

function copyTree(src, dst, onlyMissing = false) {
  mkdirSync(dst, { recursive: true });
  for (const name of readdirSync(src)) {
    if (shouldSkip(name)) continue;
    const from = join(src, name);
    const to = join(dst, name);
    const st = statSync(from);
    if (st.isDirectory()) copyTree(from, to, onlyMissing);
    else if (!onlyMissing || !existsSync(to)) cpSync(from, to);
  }
}

function runRealVite() {
  const viteBin = process.platform === 'win32'
    ? join(root, 'node_modules', '.bin', 'vite.cmd')
    : join(root, 'node_modules', '.bin', 'vite');
  if (!existsSync(viteBin)) return false;
  const result = spawnSync(viteBin, ['build'], { stdio: 'inherit', shell: false });
  if (result.error || result.status !== 0) process.exit(result.status ?? 1);
  return true;
}

if (existsSync(dist)) rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });
const builtWithVite = runRealVite();
// Copy root-relative runtime assets (including GeoJSON and image files) while excluding
// source code, secrets, tests, documentation and deployment configuration from the public site.
copyTree(root, dist, builtWithVite);
const required = ['index.html', 'sw.js', 'manifest.webmanifest', 'company-operations-suite.js', 'company-operations-suite.css', 'data/bangladesh-boundary-fallback.geojson'];
const missing = required.filter((path) => !existsSync(join(dist, path)));
if (missing.length) {
  console.error(`Build failed: required runtime assets missing: ${missing.join(', ')}`);
  process.exit(1);
}
for (const forbidden of ['company_backend.py', 'tests', '.github', 'render.yaml', 'PROJECT-DOCUMENTATION-ARCHIVE.md', 'README.md', 'COMPANY-OPERATIONS-SETUP.md']) {
  if (existsSync(join(dist, forbidden))) {
    console.error(`Build failed: source-only file leaked to public output: ${forbidden}`);
    process.exit(1);
  }
}
console.log(`✓ ${builtWithVite ? 'Vite' : 'offline static'} production build created in dist/; required runtime assets exist and private/source files are excluded.`);
