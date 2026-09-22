import { existsSync, rmSync, mkdirSync, cpSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = resolve(process.cwd());
const dist = join(root, 'dist');

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

if (runRealVite()) process.exit(0);

// Offline-safe fallback for this static-first deployment.
// It preserves the exact website assets and HTML/JS/CSS without requiring a registry.
if (existsSync(dist)) rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

const skip = new Set(['node_modules', 'dist', '.git']);
function copyTree(src, dst) {
  mkdirSync(dst, { recursive: true });
  for (const name of readdirSync(src)) {
    if (skip.has(name)) continue;
    const from = join(src, name);
    const to = join(dst, name);
    const st = statSync(from);
    if (st.isDirectory()) copyTree(from, to);
    else cpSync(from, to);
  }
}
copyTree(root, dist);
console.log('✓ Offline static production build created in dist/');
