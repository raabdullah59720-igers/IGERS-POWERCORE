/**
 * IGERS POWERCORE static production build.
 * The deployed site is the existing plain-HTML/CSS/JS application, not a Vite bundle.
 * Keep runtime URLs stable and never publish backend secrets, tests or source reports.
 */
import { existsSync, rmSync, mkdirSync, cpSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(process.cwd());
const dist = join(root, 'dist');
const skipDirectories = new Set([
  'node_modules', 'dist', '.git', '__pycache__', '.pytest_cache', '.mypy_cache',
  'backend', 'tests', '.github', 'var'
]);
const skipFiles = new Set([
  '.gitignore', 'LICENSE', 'TEMPLATE', 'package.json', 'vercel.json',
  'STYLES-SOURCE-ARCHIVE.css', 'README', 'README.md', 'README_BN.txt',
  'border-status-integration-snippet.html', 'integration-snippet.html'
]);
const skipExtensions = new Set(['.md', '.txt', '.py', '.pyc', '.pyo', '.bat', '.mjs', '.jsx', '.sqlite3', '.db', '.log', '.tmp']);

function shouldSkipFile(name) {
  if (skipFiles.has(name) || name === '.DS_Store') return true;
  const ext = name.includes('.') ? name.slice(name.lastIndexOf('.')).toLowerCase() : '';
  return skipExtensions.has(ext);
}

function copyRuntimeTree(source, target) {
  mkdirSync(target, { recursive: true });
  for (const name of readdirSync(source)) {
    if (skipDirectories.has(name) || shouldSkipFile(name)) continue;
    const from = join(source, name);
    const to = join(target, name);
    const stat = statSync(from);
    if (stat.isDirectory()) copyRuntimeTree(from, to);
    else cpSync(from, to);
  }
}

if (!existsSync(join(root, 'index.html'))) {
  throw new Error('index.html must exist at the repository root before building.');
}
if (existsSync(dist)) rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });
copyRuntimeTree(root, dist);

for (const required of [
  'index.html', 'sw.js', 'manifest.webmanifest', 'company-operations.js',
  'company-operations.css', 'data/bangladesh-boundary-fallback.geojson'
]) {
  if (!existsSync(join(dist, required))) throw new Error(`Required public runtime asset missing from dist/: ${required}`);
}
for (const forbidden of ['backend', 'tests', '.github', 'README.md', 'backend/server.py']) {
  if (existsSync(join(dist, forbidden))) throw new Error(`Development-only path must not be published: ${forbidden}`);
}
console.log('✓ Static production build complete: public UI/assets included; backend, secrets configuration, tests and docs excluded.');
