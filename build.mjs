import { existsSync, rmSync, mkdirSync, cpSync, readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

// Deterministic static release builder for GitHub Pages.
// Keep the complete app (index.html contains the legacy inline modules) plus only
// the local resources referenced by the runtime. Development scripts, duplicate
// GeoJSON copies, source archives and historical QA documents are not deployed.
const root = resolve(process.cwd());
const dist = join(root, 'dist');
const runtimeFiles = [
  '.nojekyll', '404.html', 'LICENSE', 'index.html',
  'copyright.html', 'privacy.html', 'terms.html',
  'manifest.webmanifest', 'sw.js', 'bangladesh-boundary-fallback.geojson',
  'bangladesh-flag-overlay.svg', 'icon.svg', 'icon-192.png', 'icon-512.png',
  'feas-footstep-overview.webp', 'feas-footstep-installation.webp',
  'thesis-concept-bridge-toll.svg', 'thesis-concept-footstep.svg',
  'thesis-concept-hydro.svg', 'thesis-concept-integrated.svg',
  'thesis-concept-resilience-station.svg', 'thesis-concept-road-harvester.jpg',
  'thesis-concept-road.svg', 'thesis-concept-sluice-gate.jpg',
  'thesis-concept-solar.svg', 'thesis-concept-thermal-canopy.svg',
  'thesis-concept-vibration.svg',
  'igers-compact-bundle.css', 'design-standard.css', 'airport-runway-sim.css',
  'powercore-command-center.css', 'thesis-concept-lab.css',
  'company-operations-suite.css', 'app-shell.css',
  'toll-national-pro.js', 'nasa-gibs-bd.js', 'airport-runway-sim.js',
  'section-navigation.js', 'system-master-control.js', 'powercore-command-center.js',
  'thesis-concept-lab.js', 'company-operations-suite.js', 'i18n.js', 'app-shell.js'
];
const magazineCandidates = ['magazine/IGERS-BD-01_Professional_Engineering_Magazine.pdf', 'IGERS-BD-01_Professional_Engineering_Magazine.pdf'];
const magazineSource = magazineCandidates.find((file) => existsSync(join(root, file)));
const magazineOutput = 'IGERS-BD-01_Professional_Engineering_Magazine.pdf';

if (existsSync(dist)) rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

const missing = runtimeFiles.filter((file) => !existsSync(join(root, file)));
if (!magazineSource) missing.push('magazine/IGERS-BD-01_Professional_Engineering_Magazine.pdf (or flat-root PDF)');
if (missing.length) {
  console.error(`Build failed: required release resources missing: ${missing.join(', ')}`);
  process.exit(1);
}
for (const file of runtimeFiles) cpSync(join(root, file), join(dist, file));
// Keep the engineering magazine available in the single-level GitHub upload set.
cpSync(join(root, magazineSource), join(dist, magazineOutput));

const localTargets = new Set();
const collectLocal = (raw) => {
  if (!raw || raw.startsWith('#') || /^(?:[a-z]+:|\/\/|data:|javascript:)/i.test(raw)) return;
  let path = raw.split(/[?#]/, 1)[0];
  try { path = decodeURIComponent(path); } catch (_) {}
  if (path && path !== '/') localTargets.add(path.replace(/^\.\//, ''));
};
const html = readFileSync(join(dist, 'index.html'), 'utf8');
for (const tag of html.match(/<[^>]+>/g) || []) {
  if (/^<script\b/i.test(tag) || /^<link\b/i.test(tag) || /^<img\b/i.test(tag) || /^<iframe\b/i.test(tag) || /^<a\b/i.test(tag)) {
    for (const match of tag.matchAll(/\s(?:src|href)\s*=\s*(["'])(.*?)\1/gi)) collectLocal(match[2]);
  }
}
const missingTargets = [...localTargets].filter((target) => !existsSync(join(dist, target)));
// Hash links, external providers and data attributes are skipped above. Legal pages,
// direct assets, stylesheet/script URLs and the manifest must all exist in the release.
if (missingTargets.length) {
  console.error(`Build failed: broken local index reference(s): ${missingTargets.join(', ')}`);
  process.exit(1);
}
const countFiles = (folder) => readdirSync(folder, { withFileTypes: true }).reduce((sum, entry) => sum + (entry.isDirectory() ? countFiles(join(folder, entry.name)) : 1), 0);
const count = countFiles(dist);
if (count >= 98) {
  console.error(`Build failed: release has ${count} files; GitHub upload target is fewer than 98.`);
  process.exit(1);
}
console.log(`✓ Static production release built in dist/: ${count} files, all at the root, fewer than 98; local index references validated.`);
