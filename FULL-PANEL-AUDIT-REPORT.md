# IGERS POWERCORE · Full Panel Audit Report

**Release candidate:** GitHub Pages source ZIP, October 9, 2026

## What was audited

- Main HTML page, all 30 section targets, grouped navigation, mobile navigation controller, theme control, section/menu IDs, forms and button/control references.
- All loaded external JavaScript files and all executable inline scripts for syntax.
- All website JavaScript/MJS files, Python utilities, CSS files, inline style blocks, JSON, web manifest, PWA icon dimensions, and bundled Bangladesh GeoJSON.
- Main runtime asset references, CSS local URLs, static build output, service-worker revision, repository-root `index.html`, and local HTTP routes.
- Targeted interaction behavior for section navigation, administrator-gated master UI state, and airport/runway simulation.

## Bugs repaired in this pass

1. The `SYSTEM MASTER CONTROL` ON/OFF buttons were present but had no handler in the active page. They now require one of the existing IGERS admin-session flags, preserve state when unauthorized, persist the local UI status, and explicitly state that public-data feeds and physical hardware are not controlled.
2. Grouped navigation used a full-width row within a fixed 70px desktop header, creating a wrap/overlap risk at intermediate widths. Desktop now reserves a proper second row, while mobile menu placement remains 70px.
3. The footer now contains the `year` element used by the existing year initializer.
4. Cache-busting versions and the service-worker revision were updated so deployed clients can detect this version.
5. `build.mjs` now skips Python bytecode/cache and common temporary files when producing `dist/`.

## Automated checks

| Check | Result |
|---|---|
| Production build (`npm run build`) | PASS, offline static build |
| Standalone JS/MJS syntax | 44 files PASS |
| Inline JavaScript syntax | 13 scripts PASS |
| CSS parsing | 5 stylesheets + 15 inline style blocks PASS |
| HTML IDs | 445 unique IDs, zero duplicates |
| Panel navigation | 30 sections / 30 unique matching targets |
| Interactive ID wiring | 136 controls referenced by loaded code; no disconnected ID-bearing control found |
| Local HTML asset/anchor references | no missing targets or files |
| JSON/manifest/GeoJSON | 4 files parsed |
| GeoJSON coordinate validation | 93 features, 467 coordinate tuples, no out-of-range coordinates |
| Python scripts | 4 compile PASS |
| PWA icons | 192×192 and 512×512 verified |
| Required build assets | all present; no `__pycache__` / `.pyc` files |
| Local HTTP smoke test | 15/15 routes returned HTTP 200 |
| Interaction test: navigation controller | PASS |
| Interaction test: admin master controls | PASS |
| Interaction test: airport/runway simulation | PASS |

## Preserved project structure

All 84 paths present in the starting website ZIP were retained. The update adds `system-master-control.js` and this audit report. The archive keeps `index.html` directly at the root and contains 86 files, below the 98-file limit. The original public-feed modules, calculators, legal pages, assets, PWA files, GeoJSON and airport simulation remain included.

## What could not be fully verified

- Chromium navigation was blocked by the workspace policy for both `file://` and localhost URLs (`ERR_BLOCKED_BY_ADMINISTRATOR`). The project was built and served locally and its routes/resources were tested, but a real visual browser session across every panel could not be completed.
- External providers such as Airplanes.live, NASA GIBS, weather feeds and public GIS endpoints could not be guaranteed live from this environment. Their status must be checked once GitHub Pages finishes deployment on a normal internet connection.
- GitHub Pages publishing is triggered by the repository commit and host configuration; this local ZIP cannot publish itself.

## Upload notes

Extract the ZIP and upload the extracted files to the root of the existing `IGERS-POWERCORE` repository, overwriting existing files. Keep `index.html` at the root and retain `data/bangladesh-boundary-fallback.geojson`. Do not upload the ZIP as a single file. Commit the changes, then wait for the existing GitHub Pages deployment to finish.
