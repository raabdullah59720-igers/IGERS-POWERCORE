# IGERS POWERCORE · Upgrade and validation report

Release date: 2026-10-09

## Implemented

- Added `data/bangladesh-boundary-fallback.geojson`, generated from bundled low-resolution Basemap country-boundary/coastline and river data. The GeoJSON explicitly identifies it as an offline visualization fallback, not a survey-grade/legal boundary.
- Border monitor: added map zoom/reset/fullscreen; independent toggles for outline, river context, public ADS-B markers, virtual nodes and radar sweep; selectable marker details; fixed reported ADS-B observation-age presentation; source fallback now resolves because the requested local GeoJSON exists.
- 3D air traffic: added an ADS-B boundary overlay when local geography is available; interactive aircraft selection on the globe; filters for all positioned targets, the approximate Bangladesh region and identified callsigns; rotation/pan via drag, zoom, reset/fullscreen; observation timestamps/age and stale/offline labels; bounded request timeout and fallback request deduplication.
- Combined air/ground/maritime panel: added accessible layer toggles, zoom in/out, drag-to-pan, reset/fullscreen and public-track marker details. Simulation versus public-feed distinctions remain visible.
- NASA GIBS: added requested imagery date, bounded seven-day lookback from the selected date, per-tile load/failure accounting, partial/failure statuses, zoom, pan buttons and drag-pan, reset/fullscreen; window resize repositions loaded tiles without automatically refetching them.
- Preserved existing `index.html`, PWA manifest/service worker, runtime scripts, assets, calculations, navigation, admin modules and existing panel layout. The shared public ADS-B loader now deduplicates concurrent requests; the time/weather refresh utility reuses its restored CSS asset and no longer fires duplicate refresh clicks.
- Added `design-standard.css` as a presentation-only layer: cleaner two-row/scrollable navigation, consistent spacing and typography, a restrained navy/teal palette, standardized card/form treatment, improved focus visibility, responsive mobile layouts and reduced-motion support. Existing IDs, scripts, and interaction handlers were not edited for this design pass.
- Consolidated historical docs/text into `PROJECT-DOCUMENTATION-ARCHIVE.md`, source styles into `STYLES-SOURCE-ARCHIVE.css`, and removed the unreferenced nested ZIP to meet the file cap without deleting runtime functionality.

## Validation performed

- Baseline ZIP integrity: passed. Baseline contained 183 actual files before consolidation.
- Final package file count: **80 actual files**, below the strict 98-file maximum.
- JavaScript syntax: all 39 bundled `.js` modules and 2 `.mjs` files passed `node --check`; all executable inline script blocks in `index.html` were rechecked after the request-deduplication patch.
- Python: all project `.py` files compiled successfully; `python test_airtraffic_relay.py` passed its existing assert-based relay self-test. Pytest did not discover test functions in that script, so it was executed directly.
- HTML: no duplicate IDs found; no missing local assets referenced by `index.html`.
- JSON/manifest: all included JSON files parsed successfully; `manifest.webmanifest` and `sw.js` are retained.
- Runtime stylesheets: `igers-compact-bundle.css` and the additive `design-standard.css` parsed without CSS syntax errors.
- GeoJSON: parsed as a `FeatureCollection` with 93 features; the 154-vertex primary polygon passed Shapely validity checks and contains a point in Dhaka; 92 LineString features provide low-resolution river/delta context.
- The existing relay self-test passed. The ZIP integrity and entry count were checked again after export. `time-weather-update.css` is included as a standalone file because its utility module dynamically loads it.

## Checks blocked or not completed

- `npm run build` could not execute because `node_modules` is absent and the `vite` executable is not installed (`vite: not found`). The delivered project is packaged as a static-first GitHub Pages site and retains `index.html` at the archive root.
- Chromium automation was attempted, but sandbox policy returned `ERR_BLOCKED_BY_ADMINISTRATOR` for both localhost and `file://` navigation. No browser rendering / interaction test could be completed, and **no screenshots are included**. Controls are syntax/static-checked, but this is not a substitute for a deployed browser smoke test.
- Direct public-network requests to geoBoundaries, Airplanes.live and NASA GIBS failed at DNS resolution in the packaging environment. Their live availability and returned content could not be verified from this session. The app should report provider offline/stale/partial states rather than imply these sources were confirmed working.

## Consolidation summary

- 70 Markdown/text records were consolidated into `PROJECT-DOCUMENTATION-ARCHIVE.md`, while `README.md` and `README_BN.txt` remain standalone.
- Source stylesheets remain preserved in `STYLES-SOURCE-ARCHIVE.css`; active styles are consolidated in `igers-compact-bundle.css` and the intentional inline styles. `time-weather-update.css` is retained separately for the utility module’s dynamic load path.
- The nested `IGERS-BD-01-App-Package.zip` was removed because no remaining project source refers to it; this avoids shipping a second full application archive inside the repository.
- Runtime JavaScript, PNG/SVG assets, Python utilities, config, legal pages, PWA manifest/service worker, calculations, navigation, admin modules and panel markup were retained.
## Blocked external verification

Direct request attempts to geoBoundaries, Airplanes.live and NASA GIBS failed at DNS resolution in the packaging environment. Therefore this session did not verify fresh live aircraft data, live boundary replacement, or actual satellite tile availability. Code paths report offline/partial/stale states rather than claiming those integrations succeeded. Retry those checks from the deployed GitHub Pages site or another network with public endpoint access.

## Follow-up deployment and PWA bug-fix pass (2026-10-09)

- Changed `npm run build` to call the included `build.mjs`, allowing the documented static fallback when Vite is not installed.
- Adjusted the Vite path to copy remaining static runtime assets into `dist/` without overwriting built output, including assets referenced through inline `fetch()` strings.
- Added 192x192 and 512x512 PNG PWA icons and explicit relative `id`/`scope`, compatible with repository-subpath hosting.
- Updated the service worker to use `waitUntil(skipWaiting())`, claim clients safely, request update checks on page load and every 60 seconds, and reload once after a worker-controller update. No stale Cache API shell is introduced.
- Added versioned URLs for the manifest, design stylesheet, toll script, and NASA GIBS script. Removed duplicate registration with mismatched options from earthquake notification setup.
- GitHub Pages publishing/CDN propagation remains controlled by GitHub; frontend code can detect a deployed update but cannot make deployment time zero.


## Final validation snapshot (2026-10-09)

- `npm run build`: PASS through the offline static-build fallback; `dist/` contains `index.html`, `sw.js`, the manifest, updated CSS/JS assets, PNG icons, and the bundled Bangladesh GeoJSON.
- The Vite-installed branch was exercised with a controlled test executable: existing built `dist/index.html` was preserved while missing runtime assets were copied into `dist/`. The actual Vite binary is not installed in this workspace, so a real Vite compilation was not claimed.
- Node syntax validation: all `.js`/`.mjs` files PASS; all 13 inline executable scripts PASS.
- HTML static audit: 417 IDs, zero duplicate IDs, 55 local references, zero missing local references.
- CSS parse: 4 CSS files PASS; package/manifest/GeoJSON JSON validation PASS; fallback GeoJSON contains 93 features.
- Python compilation and `test_airtraffic_relay.py`: PASS.
- Local HTTP smoke test: root page, service worker, versioned manifest/CSS/JS URLs, GeoJSON fallback and both PNG icons returned HTTP 200.
- Final archive will retain all 80 original files and stay within the 98-file limit; no original path is intentionally removed.
- Browser rendering/interaction screenshot: BLOCKED/UNVERIFIED. Chromium timed out in this workspace before the screenshot was produced. Live third-party provider availability is also not guaranteed by static tests.
