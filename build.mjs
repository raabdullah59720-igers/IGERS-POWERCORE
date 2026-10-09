import { existsSync, rmSync, mkdirSync, cpSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = resolve(process.cwd());
const dist = join(root, 'dist');
const skip = new Set(['node_modules', 'dist', '.git', '__pycache__', '.pytest_cache', '.mypy_cache']);

function copyTree(src, dst, onlyMissing = false) {
  mkdirSync(dst, { recursive: true });
  for (const name of readdirSync(src)) {
    if (skip.has(name) || name === '.DS_Store' || name.endsWith('.pyc') || name.endsWith('.pyo') || name.endsWith('.tmp') || name.endsWith('.log')) continue;
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
  if (result.error || result.status !== 0) {
    process.exit(result.status ?? 1);
  }
  return true;
}

if (runRealVite()) {
  // Keep runtime files accessed through inline fetch()/dynamic URL construction.
  // Vite cannot discover every such file from strings inside inline scripts.
  copyTree(root, dist, true);
  console.log('✓ Vite build complete; remaining static runtime assets copied into dist/.');
  process.exit(0);
}

// Offline-safe fallback for this static-first deployment.
// It preserves the exact website assets and HTML/JS/CSS without requiring a registry.
if (existsSync(dist)) rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

copyTree(root, dist);
console.log('✓ Offline static production build created in dist/');
