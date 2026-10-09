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

## 2026-10-09 · Border Online Map + Radar Sweep Update

### Delivered changes

- Reworked the existing `3D BORDER SURVEILLANCE & EARLY-WARNING PANEL` canvas to draw a real interactive OpenStreetMap raster basemap when visible tiles are available.
- Plots the bundled Bangladesh ADM0 GeoJSON outline on top of the basemap; the existing boundary source refresh still runs and the bundled outline remains the fallback.
- Added map pan (drag/touch), wheel zoom, Zoom +/- buttons, Reset view, and Fullscreen behavior without replacing existing control IDs.
- Preserved the public ADS-B overlay and the illustrative virtual gateway layer; existing marker inspection and layer toggles now work in map coordinates when tiles are loaded.
- Added an animated geographic radar-style sweep and range rings. The sweep is explicitly labeled **SIMULATED** and is not a real radar or sensor feed.
- Added visible OpenStreetMap and geoBoundaries attribution, current viewport tile status, bounded retry (maximum two retries per failed tile), a configurable `window.IGERS_MAP_TILE_URL` template, and a local canvas fallback when the map tile provider is unavailable.
- Fixed a performance issue in the existing border renderer by keeping one animation loop rather than spawning extra loops after repeated boundary refreshes.
- Bumped the service-worker revision to `igers-2026-10-09-border-online-map-01` so GitHub Pages deployments can advertise the new app version to existing clients.

### Validation performed

- `node --check`: 41 JavaScript/MJS files passed.
- Inline script syntax: 13 scripts passed; the inline border-monitor program exactly matches `border-monitor.js`.
- HTML IDs: 418 IDs, no duplicates.
- Local HTML references: 57 checked, no missing references.
- CSS parser: 19 inline/external stylesheets, no top-level parse errors.
- JSON/manifest and bundled GeoJSON parsing passed; bundled GeoJSON contains 93 features.
- Python compilation: 4 files passed; air-traffic relay self-test passed.
- `npm run build` passed via the repository's static fallback build (Vite dependencies are not installed in this build environment).
- Local HTTP smoke test returned HTTP 200 for `/index.html`, `/sw.js`, `/data/bangladesh-boundary-fallback.geojson`, and `/border-monitor.js`.

### Remaining verification limitation

This environment could not resolve external internet hosts, and browser-based rendering did not complete. Therefore the OpenStreetMap tile endpoint and public ADS-B provider were not verified from this session. The app reports tile/provider errors and falls back to the bundled geographic visualization if online services are unreachable. The map tiles remain an external best-effort service, not an offline map pack.


## Runtime audit follow-up (2026-10-09)

- Fixed the border panel's Last Sync display so boundary-map refreshes cannot rewrite the actual last aircraft-feed sync time.
- Added per-track observed-age text and an explicit `STALE OBS` label for public ADS-B observations older than 60 seconds.
- Bumped the service-worker revision so deployed clients can detect this update.
- Static validation: JavaScript and inline script syntax, CSS parsing, duplicate HTML IDs, local asset references, JSON/GeoJSON parsing, Python compilation, ADS-B relay self-test, build fallback, ZIP integrity and local HTTP endpoints.
- Browser limitation: headless Chromium could not open local HTTP URLs because the workspace browser policy returned `ERR_BLOCKED_BY_ADMINISTRATOR`; an interactive browser rendering test could not be completed.

### Final local verification results

- `npm run build`: **PASS** using the offline static build path (Vite is not installed in this workspace, so the Vite-specific branch was not executed).
- JavaScript/MJS syntax check: **PASS** for all checked `.js` and `.mjs` source files; all 13 inline scripts in `index.html` also pass Node syntax checks.
- CSS parser: **PASS** for 4 `.css` files and 15 inline style blocks.
- HTML IDs: **418 unique, 0 duplicates**. Local references: no missing referenced assets detected.
- JSON/manifest and GeoJSON: **PASS**; bundled GeoJSON has 93 features and valid parsed geometry.
- Python files: **4 compile successfully**. Air-traffic relay self-test: **PASS**. The file does not expose `unittest` cases, so unittest reported no tests.
- Border track-renderer unit harness: **PASS** for fresh observed age, stale observation label, and unknown/missing age.
- Local HTTP checks: all critical paths tested (index, border monitor script, CSS, bundled GeoJSON, manifest, service worker and PWA icon) returned **HTTP 200**.
- ZIP integrity and root `index.html`: **PASS**; final archive is kept under the 98-file limit.
- Browser rendering: **BLOCKED by the workspace browser policy** (`ERR_BLOCKED_BY_ADMINISTRATOR` for localhost/127.0.0.1). No visual screenshot or full interactive browser result is claimed.


## 2026-10-09 · Bangladesh Airport / Runway Simulation Update

### Delivered changes

- Added an isolated airport-network and runway-simulation module to the existing `LIVE AIR TRAFFIC · 3D FLIGHT MONITOR` panel. Existing traffic globe, flight list, filters, zoom/fullscreen/refresh controls, other panels and admin modules are retained.
- Added 16 listed Bangladesh airport/aerodrome site markers, classed as service-listed, limited/status-to-verify, or planned. Eight sites have a sourced runway reference; the remaining runways are intentionally schematic rather than invented. One proposed Bagerhat site marker is approximate.
- Added an interactive Bangladesh airport network plot, selectable departure/arrival for a clearly labelled simulated airport-to-airport route, route pause/resume/reset, and airport selection.
- Added animated runway taxi, landing and takeoff modes, direction reversal, pause/resume, runway references and source/reliability information. The runway drawing is schematic and not to scale.
- Passed through origin/destination fields only when supplied by the public aircraft provider. Where not supplied, the live list explicitly reports that the public ADS-B response does not include a route. Nearest-airport distance is clearly labelled as proximity, not route origin. Simulated route is kept separate from real public-feed observations.
- Added `airport-runway-sim.css` and `airport-runway-sim.js` as new isolated assets and bumped service-worker revision to `igers-2026-10-09-airport-runway-sim-01`.

### Data notes

- Runway references for Dhaka, Sylhet, Rajshahi, Jashore, Barishal and Cox's Bazar use CAAB AIP/AIP supplement references; Chattogram and Saidpur also use public airport/runway data where indicated in the module. Limited, unavailable, STOL or proposed sites do not receive fabricated runway dimensions.
- This is an educational/engineering visualization, not flight dispatch, air-traffic control, or operational runway guidance. The actual live feed may not expose origin/destination, and the panel will not infer it.

### Final validation snapshot · airport simulation package

- `npm run build`: PASS via the static-first build script; `dist/` contains the new airport simulator JS/CSS, service worker, manifest and Bangladesh boundary GeoJSON.
- JavaScript / MJS syntax: PASS for all project files; non-empty inline JavaScript blocks in `index.html` parse.
- CSS: all 5 active `.css` files parse without errors.
- HTML: 442 IDs, no duplicate IDs; all 20 direct element-ID references in the airport module match the HTML; 10 local source/link references checked, none missing.
- JSON / manifest / GeoJSON: 4 files parsed successfully.
- Node VM DOM/canvas mock: PASS for initialization, all 16 airport/aerodrome entries, selecting an airport, simulated route labeling, rendering provider-supplied origin/destination, not guessing missing routes, and displaying observation age.
- Local HTTP smoke test: 8/8 routes returned HTTP 200 (root HTML, airport CSS/JS, service worker, manifest, Bangladesh fallback GeoJSON and both PWA icons).
- Baseline comparison: all 80 original ZIP paths retained; two new airport simulator files added. Final root package count is 82 files, below the 98-file ceiling.
- Browser screenshot / full interaction testing was not available in this execution environment. The Node VM harness validates logic paths but is not a substitute for deployed-browser rendering. Public ADS-B providers may omit route origin/destination fields; when missing the panel reports that limitation instead of inferring a route. Runway and demo route animation are explicitly schematic simulations.

## 2026-10-09 · Final runtime bug-check pass (airport/runway panel)

### Fixes applied

- Stopped the airport network canvas from scheduling a continuous animation frame while the route animation is paused; resume restarts a single route loop.
- Hardened public ADS-B record validation: null, blank, non-finite, and out-of-range latitude/longitude values are excluded rather than accidentally treated as coordinates such as 0,0.
- Fixed observation-age display so missing/null age is shown as `Age n/a` instead of incorrectly appearing as `0 s old`.
- Fixed runway Pause/Resume so the simulation clock freezes while paused and resumes from the frozen frame rather than jumping forward in time.
- Bumped the airport JavaScript/CSS query version and service-worker revision to `airports02` / `airport-runway-sim-02` so deployed clients can discover the fix.

### Final validation results

- `npm run build`: **PASS**, using the project's offline-safe static production build path; the generated `dist/` contains `index.html`, airport simulator JS/CSS, service worker, manifest, bundled Bangladesh GeoJSON and both PWA icons.
- JavaScript/MJS: **42 files passed** `node --check`.
- Inline JavaScript: **13 scripts passed** syntax checking.
- CSS: **5 files passed** brace/syntax-structure checks.
- HTML: **442 IDs, zero duplicates**; 10 local relative references checked, none missing.
- JSON / manifest / GeoJSON: **4 files parsed**; Bangladesh fallback GeoJSON contains **93 features**.
- Python: **4 files parsed/compiled**; `python test_airtraffic_relay.py` self-test passed.
- Airport runtime mock harness: **14 assertions passed**, including the 16 listed sites, airport selection, simulated-route labeling, pause/resume loop count, frozen runway state, invalid coordinate filtering, provided route display, missing route fallback, and unknown observation age.
- Local HTTP smoke test: **12/12 routes returned HTTP 200**, including `index.html`, versioned airport JS/CSS, `sw.js`, manifest, GeoJSON, PWA icons, admin script and legal pages.
- Final package: **82 files**, root `index.html`, ZIP integrity passed; all 82 baseline paths retained and only `index.html`, `airport-runway-sim.js`, `sw.js`, and this report changed.

### Runtime verification limitation

- A real Chromium page-render/interaction test could not be completed because the workspace browser policy blocks local-site navigation (`ERR_BLOCKED_BY_ADMINISTRATOR`). The canvas/UI behavior was instead tested through a Node VM mock harness and the app was served locally for HTTP checks. Public ADS-B provider availability was not verified; live provider behavior remains dependent on external connectivity and returned fields.

## 2026-10-09 · Sectioned navigation / synchronized app layout

### Changes
- Reorganized the existing navigation into six expandable categories: Overview; Environment & Live Data; Air & Border Operations; Infrastructure & Network; Energy & System Control; Safety & Support.
- Kept all 26 pre-existing navigation destinations and their IDs. Additional links only point to already-present sections; optional modules that create their own sections append into the matching category if loaded.
- Added `section-navigation.js` for mobile open/close, Escape-to-close, single-open category handling, and closing a category after selecting a panel. The theme toggle remains in the navigation.
- Added responsive group-dropdown styles; no panel markup, calculation formulas, data-provider logic, admin controls or existing event handlers were deleted.
- Bumped the design stylesheet, manifest, runway simulator asset query strings and service-worker revision so a deployed page requests the updated presentation assets.

### Validation
- Standalone JavaScript modules: 82/82 `node --check` passed across the website source and Android bundle.
- Inline JavaScript: 13/13 passed `node --check`.
- CSS: 5 standalone stylesheets and 15 embedded style blocks parsed without errors.
- HTML: 444 IDs, zero duplicates; six navigation categories; all 31 static nav anchors have matching IDs.
- Manifest and Bangladesh fallback GeoJSON parsed; 11 inspected local HTML references had no missing files.
- Dependency-free static production build: passed. `dist/` contains all 84 website files, including `index.html`, grouped navigation controller, runway assets, service worker, manifest, GeoJSON and PWA icons.
- Local HTTP smoke test: 15/15 routes returned HTTP 200.
- The updated package retains all 82 original source ZIP paths; two new files (`section-navigation.js` and `SECTION-GROUPING-UPDATE.md`) were added.

### Limitations
- Chromium visual/browser-interaction test was unavailable in this workspace. Static, syntax, build-output and local HTTP tests passed, but they do not replace testing after actual GitHub Pages deployment.
- GitHub Pages must finish publishing after commit; cached browser/PWA content may require refresh. Frontend code cannot make host deployment instant.


## 2026-10-09 · Full-panel audit & disconnected-control repair (latest)

### Fixes
- Fixed desktop header layout so the grouped navigation occupies a real second row instead of competing with the brand inside a fixed-height header. Mobile keeps its 70px menu offset and collapsible category layout.
- Added `system-master-control.js` and wired the previously unhandled `ALL SYSTEMS ON/OFF` buttons. It requires an existing IGERS admin-session flag; unauthenticated clicks leave the state unchanged. The display clearly identifies this as a local prototype UI state and does not claim to stop external feeds or actuate hardware.
- Added a live `year` footer target for the existing year initializer.
- Bumped active navigation CSS/JS URLs and the service-worker revision for cache revalidation after GitHub Pages publishes the new commit.
- Updated `build.mjs` to exclude Python bytecode/cache and common temporary files from `dist/`.

### Latest validation
- `npm run build`: PASS using the included dependency-free static build path.
- 44 standalone `.js` / `.mjs` files and 13 inline scripts: syntax checks PASS.
- 5 CSS files and 15 inline style blocks: parse checks PASS.
- HTML: 445 IDs, no duplicates; all 30 section IDs are represented by 30 unique navigation targets; 136 ID-bearing interactive controls have script references; no missing local links/assets.
- JSON, web manifest, and GeoJSON: 4 files parsed; 93 GeoJSON features / 467 coordinate tuples; coordinate ranges valid.
- Python: 4 scripts compile. PWA icons validated at 192×192 and 512×512.
- Targeted interaction harnesses: section navigation PASS; master-control authorization and ON/OFF persistence PASS; airport/runway simulator selections, simulated route labeling, animation pause/resume, and invalid ADS-B coordinate filtering PASS.
- Local HTTP smoke test: 15/15 key routes returned HTTP 200. Build output includes all required runtime assets and no `__pycache__` / `.pyc` artifacts.
- Current source ZIP retained all original 84 file paths, added `system-master-control.js` and this audit report, and stays below the 98-file limit.

### Limitations
- The browser automation tool is blocked by workspace policy for both `file://` and localhost navigation (`ERR_BLOCKED_BY_ADMINISTRATOR`), so a real visual browser session could not be completed. The app was built and served locally, and page/resource routes plus targeted JavaScript interaction harnesses were tested.
- Public weather/ADS-B/NASA/GIS provider availability could not be confirmed from this environment; external feed health must be checked after deployment on an ordinary internet connection.
