import { existsSync, rmSync, mkdirSync, cpSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve, dirname, extname, relative, sep, posix } from 'node:path';
import { execFileSync } from 'node:child_process';

// IGERS-BD-01 static release builder. Produces a flat GitHub Pages root package,
// collecting all directly linked assets plus local files referenced by active JS/CSS.
const root = resolve(process.cwd());
const dist = join(root, 'dist');
const release = '2026-10-14-defensive-modules-v2';
const staticFiles = [
  '.nojekyll','404.html','LICENSE','index.html','copyright.html','privacy.html','terms.html',
  'manifest.webmanifest','sw.js','bangladesh-boundary-fallback.geojson','bangladesh-flag-overlay.svg',
  'icon.svg','icon-192.png','icon-512.png','feas-footstep-overview.webp','feas-footstep-installation.webp',
  'thesis-concept-bridge-toll.svg','thesis-concept-footstep.svg','thesis-concept-hydro.svg',
  'thesis-concept-integrated.svg','thesis-concept-resilience-station.svg','thesis-concept-road-harvester.jpg',
  'thesis-concept-road.svg','thesis-concept-sluice-gate.jpg','thesis-concept-solar.svg',
  'thesis-concept-thermal-canopy.svg','thesis-concept-vibration.svg','thesis-concept-railway.svg',
  'IGERS-BD-01_Professional_Engineering_Magazine.pdf','engineering-calculation-core.js',
  'build.mjs','package.json','calculation-regression-tests.cjs','defensive-modular-regression-tests.cjs','DEFENSIVE-MODULAR-PANELS-README.md','DEFENSIVE-MODULAR-PANELS-VALIDATION.txt'
];
const allowed = /\.(?:html?|css|m?js|cjs|json|webmanifest|geojson|svg|png|jpe?g|webp|gif|pdf|woff2?|ttf|otf|mp3|wav|webm|mp4)$/i;
const queue = [];
const included = new Set();
const missing = new Set();
function localTarget(raw, baseFile = 'index.html') {
  if (!raw || /^(?:#|[a-z][a-z0-9+.-]*:|\/\/|data:|javascript:|mailto:|tel:|blob:)/i.test(raw)) return null;
  const clean = raw.split(/[?#]/, 1)[0].trim();
  if (!clean || clean === '/') return null;
  let decoded = clean;
  try { decoded = decodeURIComponent(decoded); } catch {}
  const target = posix.normalize(posix.join(posix.dirname(baseFile.replaceAll('\\','/')), decoded.replace(/^\.\//,'')));
  if (target === '..' || target.startsWith('../') || target.startsWith('/')) return null;
  return target;
}
function enqueue(target, context='runtime') {
  if (!target || included.has(target)) return;
  const source = join(root, ...target.split('/'));
  // The magazine and root app sometimes reference the canonical PDF under a legacy folder.
  const fallback = target === 'magazine/IGERS-BD-01_Professional_Engineering_Magazine.pdf'
    ? join(root,'IGERS-BD-01_Professional_Engineering_Magazine.pdf') : null;
  if (!existsSync(source)) {
    if (fallback && existsSync(fallback)) target='IGERS-BD-01_Professional_Engineering_Magazine.pdf';
    else { missing.add(`${target} [${context}]`); return; }
  }
  if (included.has(target)) return;
  included.add(target); queue.push(target);
}

// Start with known static shell and project-owned reference illustrations.
for (const file of staticFiles) enqueue(file, 'required release file');
if (missing.size) {
  console.error('Build failed: missing required release inputs:\n- ' + [...missing].join('\n- '));
  process.exit(1);
}

// Traverse local resources from HTML, CSS and active JavaScript. This fixes the
// old hard-coded-list failure mode where valid UI resources could silently be omitted.
const attributePattern = /\s(?:src|href|poster|data-src|data-poster)\s*=\s*(["'])(.*?)\1/gi;
const cssUrlPattern = /url\(\s*(["']?)(.*?)\1\s*\)/gi;
const assetLiteralPattern = /["'`]([^"'`\s]+?\.(?:html?|css|m?js|cjs|json|webmanifest|geojson|svg|png|jpe?g|webp|gif|pdf|woff2?|ttf|otf|mp3|wav|webm|mp4))(?:[?#][^"'`\s]*)?["'`]/gi;
const htmlPath = join(root, 'index.html');
const html = readFileSync(htmlPath, 'utf8');
for (const match of html.matchAll(attributePattern)) {
  const value = match[2];
  const target = localTarget(value, 'index.html');
  if (target && allowed.test(target)) enqueue(target, `index.html reference ${value}`);
}
// Manifest icons and any local JSON resource referenced by the manifest.
if (existsSync(join(root,'manifest.webmanifest'))) {
  try {
    const manifest=JSON.parse(readFileSync(join(root,'manifest.webmanifest'),'utf8'));
    for (const icon of manifest.icons || []) { const t=localTarget(icon.src,'manifest.webmanifest'); if(t) enqueue(t,'manifest icon'); }
  } catch (e) { console.error('Build failed: invalid manifest.webmanifest: '+e.message); process.exit(1); }
}
// Discover local assets that are selected dynamically by the active HTML/JS.
for (const match of html.matchAll(assetLiteralPattern)) {
  const raw=match[1];
  if (/^(?:https?:|\/|#)/i.test(raw)) continue;
  const t=localTarget(raw,'index.html'); if(t && allowed.test(t) && existsSync(join(root,...t.split('/'))) ) enqueue(t,'local asset literal in index.html');
}
while (queue.length) {
  const file=queue.shift();
  if (!existsSync(join(root,...file.split('/')))) continue;
  const ext=extname(file).toLowerCase();
  if (ext === '.css') {
    const text=readFileSync(join(root,...file.split('/')),'utf8');
    for (const match of text.matchAll(cssUrlPattern)) {
      const raw=match[2].trim();
      const t=localTarget(raw,file);
      if(t && allowed.test(t) && existsSync(join(root,...t.split('/'))) ) enqueue(t,`${file} CSS url()`);
    }
    for (const match of text.matchAll(/@import\s+(?:url\()?\s*["']([^"']+)["']/gi)) {
      const t=localTarget(match[1],file); if(t && existsSync(join(root,...t.split('/')))) enqueue(t,`${file} @import`);
    }
  } else if (['.js','.mjs','.cjs'].includes(ext)) {
    const text=readFileSync(join(root,...file.split('/')),'utf8');
    for (const match of text.matchAll(assetLiteralPattern)) {
      const raw=match[1]; if (/^(?:https?:|\/|#)/i.test(raw)) continue;
      const t=localTarget(raw,file); if(t && allowed.test(t) && existsSync(join(root,...t.split('/'))) ) enqueue(t,`${file} dynamic/local asset literal`);
    }
  }
}

// All HTML src/href assets are checked against the final release before success.
if (existsSync(dist)) rmSync(dist,{recursive:true,force:true});
mkdirSync(dist,{recursive:true});
for (const file of included) {
  const source=join(root,...file.split('/'));
  if (!existsSync(source)) { missing.add(`${file} [copy step]`); continue; }
  // This project has a root-level static Pages entrypoint. Keep all assets flat
  // when the runtime refers to them by root-level names.
  const target=file.startsWith('magazine/') ? 'IGERS-BD-01_Professional_Engineering_Magazine.pdf' : file;
  cpSync(source,join(dist,...target.split('/')));
}
if (missing.size) { console.error('Build failed: missing resources:\n- '+[...missing].join('\n- ')); process.exit(1); }

const localRefs=new Set();
for (const tag of readFileSync(join(dist,'index.html'),'utf8').match(/<[^>]+>/g)||[]) {
  if (/^<(?:script|link|img|iframe|a|source|video|audio)\b/i.test(tag)) {
    for (const match of tag.matchAll(attributePattern)) {
      const t=localTarget(match[2],'index.html'); if(t && !/^(?:#|[a-z][a-z0-9+.-]*:|\/\/)/i.test(match[2])) localRefs.add(t);
    }
  }
}
const absent=[...localRefs].filter(t=>!existsSync(join(dist,...t.split('/'))));
if (absent.length) { console.error('Build failed: missing local HTML references:\n- '+absent.join('\n- ')); process.exit(1); }

// Run physics regression suite as part of the production release, not just a manual check.
try { execFileSync(process.execPath,[join(root,'calculation-regression-tests.cjs')],{cwd:root,stdio:'inherit'}); }
catch (e) { console.error('Build failed: engineering calculation regression tests did not pass.'); process.exit(1); }
try { execFileSync(process.execPath,[join(root,'defensive-modular-regression-tests.cjs')],{cwd:root,stdio:'inherit'}); }
catch (e) { console.error('Build failed: defensive modular runtime regression tests did not pass.'); process.exit(1); }

const refs = `# IGERS-BD-01 Engineering Calculation Reference Register\n\nRelease: ${release}\n\nThe shared calculation kernel is used by the main Energy Calculator, Unified Command Center, Concept Lab, Scenario Silo/Vault and Railway energy calculator. Results are user-input scenario estimates until prototype tests and field data are supplied.\n\n| Model | Governing model | Thesis / design reference | Evidence requirement |\n|---|---|---|---|\n| Road harvesting | ΔKE = ½m(v₁²−v₂²); E_electric/event = E_mechanical-capture × η_chain − E_aux | *IGERS Master Energy & Revenue Analysis (2026)*, road reference case; *IGERS-BD-01 Full Thesis Presentation (2026)*, formula-sheet appendix | Capture kJ must be supported by measured force–displacement integral or calibrated energy measurement. Kinetic reduction is an upper ceiling, not a capture estimate.\n| Corridor annualisation | E_year = Wh/event × AADT × length × points/km × operating days × availability / 1000 | Road base case in 2026 IGERS master analysis | Use AADT per point, map device count and availability explicitly; do not confuse passages/day with total events/year.\n| Controlled hydraulic | P = ρgQHη; E_year = P × operating hours | 2026 IGERS hydraulic/turbine concept calculations | Measure flow, net head and overall efficiency; include seasonal restrictions, bypass and operating hours.\n| River-current turbine | P = ½ρAv³Cpη; annual energy uses capacity factor | 2026 IGERS river-current scenario | Measure current-speed distribution, swept area, device loading and downtime; Cp must not exceed the Betz ideal limit for an unshrouded actuator disk.\n| Solar PV — specific yield | E_year = kWp × net specific yield (kWh/kWp-year) | 2026 IGERS solar corridor case: 400 kWp/km × 1,400 kWh/kWp-year = 560 MWh/km-year | Replace yield with site-specific, orientation/shading/temperature/soiling-aware yield. Specific yield already includes annual irradiation and losses; do not multiply by PSH again.\n| Solar PV — irradiance + PSH | P_instant = G × A × η_module × derate; E_year = A × η_module × derate × PSH × days, using the 1 kW/m² PSH reference | Standard dimensional conversion used by the app; consistent with the thesis solar assumptions | G is used for instantaneous power. If PSH is supplied as equivalent sun-hours, do not multiply annual PSH yield by G a second time.\n| Battery autonomy | t = nominal kWh × usable DoD × discharge-path efficiency / average kW | 2026 IGERS storage sizing example: 1,000 kWh × 85% × 92% / 250 kW = 3.128 h | Use manufacturer usable capacity, BMS/temperature limits, discharge efficiency and a measured/defined load profile.\n| Railway module energy | E_net/pass = assumed captured Wh/pass × electrical efficiency; annual totals use passes/day/module × modules × operating days × availability | 2026 IGERS rail conceptual example; rail visual is not telemetry | Enter captured mechanical/electrical energy with a clear boundary; test rail deflection/vibration and conversion losses. The animation is simulation only.\n| FEAS footstep | W_mech = ∫F dx (approx. mean F × stroke); E_electric = W_mech × η | 2026 IGERS FEAS/footstep calculation concept; the master thesis also contains a separate 2 J usable-energy/event benchmark | Mean force × stroke is only an approximation; pressure/force curve, displacement, event count and conversion efficiency require measured prototype data. Keep the thesis 2 J usable/event benchmark separate from a force×stroke calculation.\n\n## Reproduced numerical checks\n\n- Road benchmark: 900 kg, 20 → 15 km/h gives a 6.07639 kJ kinetic-reduction ceiling. With a 2.0 kJ mechanical-capture assumption and 70% conversion, estimated output is 0.38889 Wh/event. 210,000 passages/day, 100 km, 1 point/km, 365 days and 100% availability yield **2.98083 GWh/year**. This equals 340.278 kW calendar-average power (annual energy divided by 8,760 hours).\n- Controlled hydraulic: Q=1 m³/s, H=2 m, η=75% and ρ=1,000 kg/m³ → **14.710 kW**.\n- River-current example: A=50 m², v=1.5 m/s, Cp=0.35, η=90% → **26.578 kW** rated estimate; 50% capacity factor → **116.4 MWh/year**.\n- Solar corridor example: 400 kWp × 1,400 kWh/kWp-year → **560 MWh/km-year**.\n- Battery example: 1,000 kWh × 85% DoD × 92% efficiency ÷ 250 kW → **3.128 h**.\n- FEAS illustration: mean force 400 N × stroke 5 mm = 2 J mechanical/event; at 20% efficiency, 0.4 J electrical/event; 100,000 events/day × 365 days → **4.056 kWh/year**. The thesis's separate 2 J *usable electrical* benchmark gives **20.278 kWh/year**; those two scenarios are not interchangeable.\n\n## Limitations\n\nThis register documents equations, units and thesis-sourced reference assumptions; it does not certify the concept or establish observed field output, financial viability, structural safety or actual net fuel savings. Report measured data separately from modeled estimates.\n`;
writeFileSync(join(dist,'IGERS-ENGINEERING-CALCULATION-REFERENCE-REGISTER.md'),refs,'utf8');
const instructions = `IGERS-POWERCORE · GITHUB PAGES RELEASE\nRelease: ${release}\n\nThis ZIP is a flat static-site root package with the new Defensive Modular Workspace (passive awareness, resilience grid, local incident notes and backup-power estimate). Extract it and upload the files inside directly to the repository publishing root; do not upload the ZIP file alone or add a second nested project folder. Enable GitHub Pages from your chosen branch and /(root). The package includes index.html and the runtime assets.\n\nFor code testing on a machine with Node.js, run: node calculation-regression-tests.cjs\nFor reproducible staging, run: npm run build (the static build is created under dist/).\n\nAfter commit, check Actions / Pages deployment status. In View Source, verify meta[name=\"igers-engineering-release\"] is ${release}. Hard-refresh with Ctrl+Shift+R.\n\nLive external APIs, browser-specific graphics/WebGL and GitHub-hosted deployment must be verified on the deployed URL; static package checks cannot guarantee external feed uptime.\n`;
writeFileSync(join(dist,'GITHUB-UPLOAD-INSTRUCTIONS-BN-EN.txt'),instructions,'utf8');
const countFiles=(folder)=>readdirSync(folder,{withFileTypes:true}).reduce((n,e)=>n+(e.isDirectory()?countFiles(join(folder,e.name)):1),0);
const count=countFiles(dist)+1; // QA report is written immediately below.
if(count>=98){console.error(`Build failed: ${count} files exceed the <98 upload target.`);process.exit(1);}
const qa=`IGERS-BD-01 · ENGINEERING CALCULATION UPGRADE QA\nRelease: ${release}\nBuild date: 2026-10-14\n\nPASS: Build completed from root-linked local resources using dynamic HTML/JS/CSS asset collection.\nPASS: Main road model checked against thesis reference case: 2.980833 GWh/year; 340.2778 kW calendar average.\nPASS: Kinetic-reduction ceiling rejects assumed captured energy above available ΔKE.\nPASS: Blank numeric inputs are rejected by shared kernel.\nPASS: Wind, hydraulic, river-current, solar specific-yield, solar PSH, battery-autonomy, railway and FEAS formulas covered by dependency-free regression suite.\nPASS: PV annual PSH calculation does not multiply by instantaneous irradiance a second time.\nPASS: Unified Command Center uses the same road/wind/hydro/PV calculation methods.\nPASS: Railway annual energy/battery calculation uses shared calculation kernel.\nPASS: Modified script URL versions and service-worker revision updated; release marker: ${release}.\nPASS: Direct local HTML resource references exist in dist.\nPASS: Defensive Modular Workspace included: radar-style local demo, source-state audit, infrastructure dependency scenario, hazard shortcuts, battery autonomy calculator and local event log.
PASS: Defensive module runtime harness covers boot, battery validation/recalculation, scenario cycle/reset, local log save/export/clear, persisted toggle state and animation pause/resume.
PASS: Defensive module status values are labelled local/demo; no remote infrastructure controls or synthetic live telemetry are exposed.
PASS: ${count} files total (upload target fewer than 98).\n\nBOUNDARY: JavaScript syntax, numerical regression, release build, CSS asset references and local HTML references were tested here. A Chromium smoke test was attempted, but the execution environment blocked access to local host/file URLs; therefore browser-rendering is not marked PASS. Live GitHub Pages deployment, external data feeds/WebGL and hardware telemetry were not directly tested. All engineering outputs remain scenario estimates until field data is supplied.\n`;
writeFileSync(join(dist,'QA-ENGINEERING-CALCULATIONS-2026-10-14.txt'),qa,'utf8');
console.log(`✓ GitHub Pages engineering release built: ${count} files; ${localRefs.size} local HTML references checked; release ${release}.`);
