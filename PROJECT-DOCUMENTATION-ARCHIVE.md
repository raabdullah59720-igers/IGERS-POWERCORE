# IGERS POWERCORE historical documentation archive

This archive consolidates historical project notes, deployment guides, prior QA reports, and release documentation to keep the GitHub-ready repository under its requested file-count limit. Individual sections retain their original filenames and content. Historical claims and QA statements are preserved as historical records and are not endorsements of this release.


---

## Original file: `ADMIN-MODULE-CONTROL-QA-2026-10-06.md`

# IGERS POWERCORE — ADMIN MODULE CONTROL QA — 2026-10-06

## Added
- Administrator-gated software module controls inside the Air/Ground/Maritime early-warning panel.
- Local ON/OFF controls for Radar Scan, ADS-B feed, Satellite View, and Alert Engine.
- Coverage visualization control, alert test, acknowledge, reset, and local-state dispose/clear.
- 15-minute administrator inactivity auto-lock retained.
- Service-worker cache bumped to v10.

## Safety boundary
These controls operate only the browser-side monitoring/visualization/data-state modules. They do not control weapons, interceptors, target assignment, fire-control, jamming, or remote military infrastructure. “Dispose local monitor state” clears browser-local state only.

## QA
- Inline JavaScript blocks: 13
- Inline JS syntax errors: 0
- Duplicate HTML IDs: 0
- Required admin/module-control IDs: present
- Existing panel files: preserved; upgrade is additive to index.html plus service-worker cache version.


---

## Original file: `ADVANCED-LIVE-SUITE-README.md`

# IGERS POWERCORE — Advanced Live 3D Monitoring Suite

This package is an additive upgrade to the existing IGERS POWERCORE web app. Existing sections are preserved.

## Added independent panels

1. **3D Air Traffic Monitor** — uses the existing Airplanes.live public ADS-B feed bridge and adds a 3D globe with flight-detail cards.
2. **Google 3D Map Layer** — optional, user-supplied Google Maps JavaScript API key; no key is bundled.
3. **Universal Seismic / Plate Reference Monitor** — USGS global all-hour earthquake feed + PB2002 plate-boundary reference model; browser alert threshold is configurable.
4. **3D Coastal / Marine Monitor** — public Open-Meteo marine model for selected Bangladesh coastal points, including sea level, waves, SST and ocean currents.
5. **IGERS-BD-01 3D Concept Lab** — scenario calculator for kinetic, hydraulic, solar and battery calculations.
6. **3D Mobile-Tower Resilience Mesh** — simulation-only network-node dashboard. It does not operate real telecom, satellite or defence equipment.
7. **3D Salah / Qibla** — browser location, AlAdhan prayer-time service and geometric Qibla bearing; local browser alerts.
8. **Emergency Center** — local administrator message, evacuation-direction cue and notification test. No remote emergency broadcast is implemented.

## Public sources used

- Airplanes.live API: https://airplanes.live/api-docs/
- USGS earthquake feeds: https://earthquake.usgs.gov/earthquakes/feed/v1.0/
- PB2002 tectonic boundary reference: https://github.com/fraxen/tectonicplates
- Open-Meteo Marine API: https://open-meteo.com/en/docs/marine-weather-api
- Google Maps 3D documentation: https://developers.google.com/maps/documentation/javascript/3d/get-started
- AlAdhan Prayer Times API: https://aladhan.com/prayer-times-api
- AlAdhan Qibla API: https://aladhan.com/qibla-api
- EMSC / SeismicPortal reference: https://www.seismicportal.eu/fdsn-wsevent.html

## Important data limitations

- `LIVE` means the browser reached the public provider and received data.
- `VERIFY` means the module is ready but provider data is not presently verified.
- `OFFLINE` means the request failed; the UI does not fabricate values.
- USGS/EMSC event feeds are not official earthquake early-warning signals.
- Open-Meteo states that coastal sea-level/current model accuracy is limited and is not suitable for coastal navigation.
- ADS-B is not primary radar and cannot guarantee complete aircraft visibility.
- Google 3D requires an authorized API key and the required Google Maps API configuration.
- All calculation outputs in the IGERS concept lab are scenario estimates until replaced by measured field data.

## Static web deployment

Upload all files in this package together to the same GitHub Pages directory. The application remains client-side except for direct browser calls to the named public providers.


---

## Original file: `AIR-TRAFFIC-LIVE-SETUP.txt`

IGERS POWERCORE — PROFESSIONAL BANGLADESH AIR TRAFFIC LIVE MODE

1) GitHub Pages mode
   Upload the ZIP normally. The panel uses public/authorized live providers.

2) Python relay mode (recommended when browser CORS/network rules interfere)
   Windows: double-click RUN-AIR-TRAFFIC-LIVE.bat
   Or: python airtraffic_live_relay.py
   Then open: http://127.0.0.1:8765/

3) What the Python relay does
   - Fetches public Airplanes.live ADS-B data server-side.
   - Uses the API's maximum 250 nautical-mile point radius around Dhaka.
   - Filters positions to the Bangladesh geographic footprint.
   - Exposes normalized JSON at /api/airtraffic.
   - Does not control aircraft, ATC, radar, weapons, or restricted systems.

4) No third-party Python packages are required. It uses Python standard library only.


---

## Original file: `AIRSPACE-EARLY-WARNING-ADMIN-HARDENING-2026-10-06.md`

# IGERS POWERCORE — Air/Ground/Maritime Early-Warning Admin Hardening

## What changed
- Added a dedicated administrator unlock directly inside the 3D Air/Ground/Maritime early-warning panel.
- Protected coverage-visualization, local alert-test, acknowledgement and reset controls.
- Reuses the existing IGERS administrator verifier/session so existing administrator workflows are not replaced.
- Added a local `Lock controls` action and 15-minute inactivity auto-lock for this panel.
- Kept public/authorized data feeds read-only.
- No weapon deployment, target assignment, fire-control, interceptor launch, jamming, or automatic use-of-force controls are included.
- Bumped service-worker cache from v8 to v9 for GitHub Pages deployment refresh.

## Security limitation
This project is a static GitHub Pages frontend. A browser-side password gate can restrict UI controls, but it is not production-grade authentication because the page source is delivered to the browser. A real secure deployment should move authentication and sensitive data access to a server-side identity provider/backend and never embed secrets in client JavaScript.

## Existing-feature policy
This upgrade is additive. Existing weather, time, energy, air traffic, seismic, marine, Salah/Qibla, analytics, border monitoring, satellite/imagery and other panels remain in the package.


---

## Original file: `AIRSPACE-EARLY-WARNING-README.md`

# IGERS POWERCORE — 3D Bangladesh Air / Ground / Maritime Early-Warning Panel

Additive module for the existing IGERS POWERCORE GitHub Pages app.

## Data layers
- NASA Worldview / GIBS: public Earth-observation imagery viewer.
- Airplanes.live: public ADS-B aircraft positions via the documented `/v2/point/{lat}/{lon}/{radius}` endpoint.
- Bangladesh ADM0 fallback geometry: existing local GeoJSON bundled with the app.

## Administrator access
The new configuration controls reuse the existing IGERS Administrator Gate/session. The panel does not expose or duplicate a password in this module.

## Safety / scope
This is a read-only early-warning and visualization layer. Coverage rings are generic visualization controls only. The module does not implement weapon deployment, interceptor launch, target assignment, fire-control, jamming, or automatic use of force.

## Public-source limitations
Public satellite imagery and public ADS-B data are not equivalent to military radar, military satellite telemetry, or a government command network. The UI therefore reports LIVE/VERIFY/OFFLINE honestly and does not fabricate sensor values.


---

## Original file: `AUDIT_2026-09-13-COMMENTS-CARE.md`

IGERS-BD-01 — Comments / Customer Care Developer Demo Audit
Date: 13 September 2026

Upgrade scope:
- Added a premium, isolated visual layer for the Comments / Customer Care developer-demo module.
- Visitor inputs remain limited to Email Address + Comment / Customer Care Message.
- No name, phone number, location, account or extra profile fields are collected by this module.
- Data remains local to the browser via localStorage; no email/API/remote submission is implemented.
- Existing weather, live time, environment, earthquake notification, air-traffic, legal pages and other site systems were not modified by the feedback UI upgrade.

Validation performed:
- JavaScript syntax checks: PASS
- Duplicate HTML id check: PASS
- Local asset/reference check: PASS
- Local HTTP smoke tests for main page, legal pages, service worker, live enhancer, icons and major image assets: PASS
- Responsive CSS includes mobile breakpoints and prefers-reduced-motion handling.

Note:
The project includes legacy React/Vite source files that are not referenced by the static website entry point. This audit intentionally leaves that legacy source untouched to avoid altering the existing deployed runtime.


---

## Original file: `AUDIT_FINAL_2026-09-13.md`

IGERS-BD-01 — FINAL HIGH-EFFICIENCY RUNTIME / BUILD AUDIT
Date: 2026-09-13

Base: IGERS-POWERCORE-WEATHER-COMMENTS-CARE-NPM-BUILD-VERIFIED-2026-09-13.zip

TESTS PASSED
1. ZIP extraction: PASS
2. npm run build: PASS (offline-safe production fallback generated dist/)
3. Built output HTTP smoke test: PASS
   /, /privacy.html, /terms.html, /copyright.html, core JS/CSS/assets -> HTTP 200
4. Node syntax validation: PASS for build.mjs, server.mjs, upgrade.js, script.js, sw.js
5. HTML ID uniqueness: PASS (85 IDs, 85 unique)
6. Local asset reference audit: PASS for index.html, privacy.html, terms.html, copyright.html
7. Comments/Customer Care feature presence: PASS
8. Feedback storage isolation: PASS; uses localStorage key igersDeveloperFeedbackV1
9. Feedback remote submission check: PASS; no feedback fetch/remote submission code detected
10. Local server test: PASS using PORT=4187; main/legal/feedback stylesheet returned 200
11. ZIP integrity after rebuild: PASS

KNOWN ENVIRONMENT LIMITATION
A fresh npm install could not complete in this execution environment because registry access timed out. The project therefore uses its existing offline-safe build.mjs fallback when node_modules/Vite is unavailable. The package's static-first deployment works without installed dependencies.

NO-REGRESSION INTENT
The new Comments / Customer Care UI is isolated to its own feedback section and CSS layer. Existing weather, live time, earthquake notification, air-traffic, legal pages, and other site systems were not intentionally modified by this upgrade.


---

## Original file: `BANGLADESH-AIR-TRAFFIC-3D-PRO-QA-2026-10-08.md`

# Bangladesh Air Traffic 3D Professional QA

Date: 2026-10-08

- Bangladesh-footprint-only live rendering preserved.
- Live provider health indicators added for authorized relay, Airplanes.live and OpenSky.
- Last-update time, request latency, received/accepted/filtered counts added.
- Target observation age shown in the live list and selected-flight detail.
- Canvas resize/reallocation fixed: dimensions update only when container size or DPR changes, avoiding per-frame canvas resets.
- No synthetic aircraft positions are generated.
- Service Worker cache bumped to v20 to avoid stale GitHub Pages shell/assets.


---

## Original file: `BANGLADESH-AIR-TRAFFIC-3D-QA-2026-10-08.md`

# IGERS-BD-01 — Bangladesh Air Traffic 3D Radar Fix QA
Date: 2026-10-08

## Scope
- `airTraffic3D` is now a Bangladesh-footprint-only live ADS-B/MLAT visualization layer.
- Aircraft are geographically filtered before rendering; positions outside the Bangladesh footprint are not drawn in this panel.
- The panel includes a continuous radar sweep, Bangladesh outline, altitude extrusion, short trails, target list, selected-flight detail, and directional flow counters (N/E/S/W).
- The existing broader `airtraffic` panel is preserved unchanged.

## Data behavior
- Preferred live source: authorized relay from Field Link when configured.
- Public fallback: Airplanes.live point query centered on Dhaka.
- Secondary fallback: OpenSky state vectors over the Bangladesh-region bounding box.
- Source data are filtered to the Bangladesh footprint before state merge/render.
- No synthetic aircraft positions are generated.
- `LIVE`, `VERIFY`, and `OFFLINE` states remain explicit.

## Static QA
- 35 sections
- 451 unique IDs
- Duplicate IDs: 0
- Missing local references: 0
- JavaScript syntax checks: PASS for all project JS files checked
- Service worker cache: `igers-powercore-v19`
- ZIP integrity: PASS

## Connectivity caveat
The build environment could not resolve the public API hostnames during direct curl testing (`api.airplanes.live`, `opensky-network.org`). This is an environment/network limitation and is not evidence that the browser user will be offline. The app therefore keeps provider failure states explicit instead of fabricating live data.

## Interpretation
“Bangladesh air traffic” in this panel means aircraft whose current tracked position falls inside the Bangladesh geographic footprint. It does not mean only Bangladesh-registered airlines or aircraft.


---

## Original file: `BD-SATELLITE-MONITOR-README.md`

# IGERS-BD-01 Bangladesh Satellite Monitor

Additive monitor panel. Existing app modules are preserved.

## Live/public data sources
- NASA GIBS / Worldview: public Earth-observation imagery.
- USGS Earthquakes GeoJSON: recent seismic events.
- GDACS API: public multi-hazard alerts.
- Existing IGERS ADS-B panel: public aircraft-feed state.
- OpenStreetMap: Bangladesh basemap iframe.

## Safety boundary
The danger/threat indicator is a public-data hazard/anomaly indicator only. It does not identify hostile actors, generate targeting information, or control real-world sensors.

## GitHub Pages
All files are root-relative/relative and the build contains no CNAME file. Keep the GitHub Pages source on GitHub Actions.


---

## Original file: `BORDER-COMMAND-MONITOR-2026-10-05.md`

# IGERS Border Zone Command Monitor — 2026-10-05

This additive module provides a command-style visual interface using public data only:
- Airplanes.live public ADS-B/MLAT-derived feed for aircraft counts and current positions.
- NASA GIBS / Himawari-9 AHI Band 13 clean-infrared Earth-observation imagery.
- A public-data aircraft flow heuristic: inbound, in-airspace, passing, outbound, based on current position and a 5-minute forward projection.
- Existing Airplanes.live map iframe remains intact.
- Existing simulated tower layer remains clearly labeled as simulated / authorized-feed-ready; no private telecom or restricted border sensor access is added.

The interface is styled like a professional command/HUD console but does not claim military affiliation or access to military-only sensors.

Calculation audit scope:
- Road kinetic recovery: ΔKE = 1/2 m(v1²-v2²), converted from km/h to m/s; efficiency applied after gross loss; annual aggregation uses explicit locations × vehicles/year/location.
- Water recovery: P = ρgQHη; flow is converted L/s → m³/s; annual energy uses hours/day × 365 × sites.
- Footstep recovery: E = Fδ; stroke converted mm → m; efficiency applied; annual energy uses steps/day × pads × 365.
- Fixed Professional Upgrade energy model so zero installed units correctly produce zero output instead of silently forcing one unit.


---

## Original file: `BORDER-MONITOR-QA-2026-10-06.md`

# IGERS POWERCORE — Border Monitor QA — 2026-10-06 (Final)

## Integration
- Baseline preserved: `IGERS-POWERCORE-ADVANCED-LIVE-3D-MONITORING-UPGRADE-2026-10-06.zip`.
- Existing application structure/features preserved.
- Border module remains a separate `#borderMonitor` section with dedicated CSS/JS and bundled Bangladesh fallback GeoJSON.
- Added an independent read-only Airplanes.live refresh path so the Border panel does not depend on another panel's event payload.

## Static QA
- All standalone JavaScript files: PASS (`node --check`).
- Inline JavaScript blocks: PASS.
- Duplicate HTML IDs: NONE.
- Missing local script/style/image/iframe references: NONE.
- All Border JS DOM references exist in HTML: PASS.
- Border navigation link exists: PASS.
- Dedicated Border 3D canvas exists: PASS.
- Dedicated Border radar-style scanner canvas exists: PASS.
- Radar scanner render path initializes without JavaScript errors: PASS.
- Dedicated alert buttons and mesh indicator exist: PASS.
- Salah / Qibla panel renders a non-empty prayer grid in offline/local-fallback mode: PASS.
- Qibla bearing calculation populated in runtime smoke test: PASS.
- Site-wide 3D depth stylesheet loads as a separate additive asset: PASS.
- Bundled Bangladesh GeoJSON parses as a valid FeatureCollection: PASS.
- Service-worker cache version remains v5.

## Module runtime-path test
A Node VM mock-DOM/canvas test was used to execute the Border module's initialization/rendering path without requiring a browser GUI. The exported renderer was invoked successfully and initialized the canvas to 800x540 in the mock layout.

The module's fallback-boundary and public-feed paths are guarded with explicit VERIFY/FALLBACK/OFFLINE states; no provider values are fabricated when external services are unreachable.

## Browser execution limitation
The execution environment blocks navigation to local HTTP/file/data pages with `ERR_BLOCKED_BY_ADMINISTRATOR`, so a full graphical browser interaction test cannot be certified from this environment. This is an execution-environment restriction and not a detected application JavaScript error.

## Live-provider limitation
Direct container HTTP calls to geoBoundaries and Airplanes.live returned HTTP 000 because outbound network access is restricted in this execution environment. The production browser must therefore determine LIVE/VERIFY/OFFLINE from actual provider reachability.

## Design boundary
- Bangladesh geography: public geoBoundaries ADM0 dataset with bundled fallback.
- Aircraft layer: public ADS-B/aircraft feed, read-only.
- Network mesh: explicitly virtual/illustrative until an authorized telemetry API is provided.
- The panel does not provide protected military radar access, weapon control, targeting, jamming, interception, or automated engagement.
- Unknown/unverified public track status is not a hostile-activity determination.


## Final module smoke test
- Node VM mock-DOM/canvas execution: ERROR_COUNT=0.
- Salah grid populated: Fajr, Dhuhr, Asr, Maghrib, Isha.
- Qibla populated: 278° W for the Dhaka fallback coordinates.
- Border public ADS-B bridge path: LIVE in mock provider.
- Border track count: 2 in mock provider.
- Border scanner status: LIVE · ADS-B scanner in mock provider.


---

## Original file: `BORDER-MONITOR-README.md`

# IGERS POWERCORE — Bangladesh Border Defensive Monitor

Additive module for the existing IGERS web app. The module provides a 3D Bangladesh ADM0 geographic view, public/authorized data status indicators, a read-only public ADS-B bridge, and an illustrative virtual border-network mesh.

## Geography
Primary boundary source: geoBoundaries `gbOpen` Bangladesh ADM0. The app attempts to load the current public geoBoundaries simplified GeoJSON in the browser. A bundled local fallback is included for offline continuity.

Boundary metadata: https://www.geoboundaries.org/api/current/gbOpen/BGD/ADM0/
Primary GeoJSON source referenced by the module: https://github.com/wmgeolab/geoBoundaries/raw/9469f09592ced973a3448cf66b6100b741b64c0d/releaseData/gbOpen/BGD/ADM0/geoBoundaries-BGD-ADM0_simplified.geojson

## Live data boundary
The panel can consume the existing IGERS Airplanes.live public ADS-B bridge already used by the app. It does not provide primary radar or military radar access.

## Network representation
The border gateway nodes are explicitly virtual/illustrative. They are not real mobile-operator tower locations and do not claim access to Grameenphone, Robi, Banglalink, Teletalk, BTRC, BGB, Bangladesh Armed Forces, or other protected networks.

## Safety
The panel is read-only and defensive. It provides detection/verification/status visualization and alerts only. It does not perform weapon control, automated engagement, jamming, interception, targeting, or tactical command.


## Dedicated Radar-Style Scanner
The Border panel now contains a separate scanner card with its own 3D-style sweep canvas, track counters, feed-age indicator and read-only public ADS-B track list. It is a radar-style visualization, not a military/primary radar feed.

## Salah / Qibla reliability
The Salah panel now renders a local solar-angle fallback immediately and then replaces it with the public AlAdhan result when reachable. This prevents a blank prayer grid when the external service is unavailable. AlAdhan documents the daily timings endpoints and calculation methods; the panel defaults to the Karachi/South-Asia reference method and clearly labels fallback mode when needed.

## Site-wide 3D presentation
A lightweight `global-3d.css` layer adds subtle perspective/depth, lighting and elevation effects to existing cards and visual containers without changing the existing information architecture or removing earlier features.


---

## Original file: `BORDER-ZONE-3D-MONITOR-RELEASE-2026-10-05.md`

# IGERS Border Zone 3D Monitor — Release Notes

Date: 5 October 2026

## Additive scope

This module was added to the supplied `IGERS-POWERCORE-main (8).zip` baseline without removing or replacing the existing Energy, Water/Foodstep, Weather/Location, Air Traffic, Airspace Safety, Satellite Connection, Future Upgrade or 3D operations modules.

### New panel

- `BORDER ZONE 3D GROUND + AIR MONITOR`
- Separate Ground / Air / Satellite layer controls
- Animated 3D-style radar visualization rendered with `requestAnimationFrame()`
- Public ADS-B-derived air states reused from the existing IGERS feed when available
- Non-identifying aggregate/demo mobile-signal coverage visualization
- Public NASA GIBS Himawari AHI Band-13 clean-infrared Earth-observation image layer with fallback look-back attempts
- Satellite observation freshness / provider state indicators
- Responsive desktop/tablet/mobile layout

## Data and safety semantics

The panel does not claim access to military radar, border-security sensors, telecom operator private data or individual mobile-device locations. The network layer is deliberately aggregate/demo unless an authorized operator feed is integrated later.

NASA GIBS documentation exposes public WMS imagery through the EPSG:4326 endpoint, which is used by the satellite observation layer. CelesTrak public orbital-element refresh guidance is respected by the existing satellite connection module; the new panel does not create an extra high-frequency CelesTrak polling loop.

## Validation performed for this release

- All JavaScript source files: `node --check` PASS.
- HTML duplicate-ID audit: PASS.
- Local CSS/JS reference audit: PASS.
- Offline/static production build via the repository's `build.mjs`: PASS.
- Local HTTP smoke test: PASS (`http://127.0.0.1:4173/`).
- Final ZIP extraction/integrity: PASS.

## Browser/live-feed limitation

The execution environment used for this build cannot directly resolve external public data hosts, so NASA GIBS/CelesTrak/ADS-B live connectivity cannot be truthfully certified from this sandbox. The module therefore reports provider success/failure from the user's browser rather than pretending a feed is live.


---

## Original file: `BUGFIX-REPORT-2026-10-03-FULL.md`

# IGERS-BD-01 — Full Runtime Bug-Fix / QA Pass
Date: 03 October 2026

## Fixed
- Restored and hardened the Live Time engine: Bangladesh, browser-local, and world time remain independent and update every second.
- Restored the missing unified System Master Control panel with responsive status cards and admin-gated ALL SYSTEMS ON/OFF controls.
- Kept existing Future Upgrade Control Center and machine controls; unified controls synchronize with their persistent local states.
- Fixed missing environment helper functions (`setWidth`, `degToCompass`) that could interrupt environmental status updates.
- Hardened weather runtime: Dhaka fallback remains available; browser geolocation can update the weather target; weather retries automatically; failure is displayed as an explicit unavailable state rather than leaving the panel ambiguous.
- Preserved satellite element-age and air-traffic data-age displays.
- Preserved simulation/live/unavailable distinctions; no physical hardware control is implied.

## Verification
- `node --check script.js` — PASS
- `node --check igers-future-upgrade.js` — PASS
- `node --check server.mjs` — PASS
- `npm run build` — PASS
- Duplicate HTML IDs — 0 found
- Local asset references in index — previously audited; current root remains self-contained
- Local HTTP smoke test — PASS (`/`, future JS/CSS, `/dist/index.html` returned 200)
- External Open-Meteo connectivity from this execution environment — DNS unavailable, therefore live weather data itself was not claimed as network-verified here.

## Security note
The admin password is frontend/static prototype authentication. GitHub Pages cannot securely protect a secret embedded in client-side JavaScript. Production machine control requires an authenticated backend and authorized hardware controller.


---

## Original file: `CERTIFICATION-2026-10-06.txt`

project: IGERS POWERCORE
certification_date: 2026-10-06
baseline: IGERS-POWERCORE-main.zip (Library) + latest accessible Oct-03 additive repair packages
integrity: True
js_syntax: PASS
duplicate_ids: PASS
local_asset_refs: PASS
required_modules: PASS
http_smoke: PASS (127.0.0.1 served index.html with HTTP 200)
interactive_browser: NOT_FULLY_CERTIFIED (Chromium headless did not complete within sandbox timeout)
notes: No existing base files were deleted; additive update layers were retained. Missing optional future/feedback references were restored as compatibility stubs so local-reference integrity is clean.


---

## Original file: `COMPACT-PACKAGE-MANIFEST.txt`

IGERS POWERCORE COMPACT PACKAGE MANIFEST
Generated: 2026-10-09
Purpose: maintain a GitHub browser-upload count below 100 without discarding source content.

CONSOLIDATION RULES
* Original Markdown documents are preserved verbatim as fenced source text in PROJECT-DOCUMENTATION-COMPENDIUM.md; the original README.md is preserved there as well.
* The nine CSS source files in index.html remain represented inline at their original cascade positions.
* Other module CSS sources are represented in igers-compact-bundle.css. styles.css and time-weather-update.css remain separate because they are runtime dependencies.
* Files not covered by the above rules are retained unchanged unless noted in the build log.

ORIGINAL FILE SHA-256 AND DESTINATION
1d12c3e3e1d5a30836fc5c5349701638765cd2601a356f2117104e15c555780d  .gitignore  ->  .gitignore (retained; see build log for intentional edits to HTML/JS snippets)
e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855  .nojekyll  ->  .nojekyll (retained; see build log for intentional edits to HTML/JS snippets)
6a10d106a014f7370eb4d306dba6522471b13bc2d203fa801a64037c3a5d1bb6  1000001072_optimized_250.png  ->  1000001072_optimized_250.png (retained; see build log for intentional edits to HTML/JS snippets)
4456f9bea04c56f82a83ca60e640dee2a8a4f120351f12ac018e907ea3d93821  404.html  ->  404.html (retained; see build log for intentional edits to HTML/JS snippets)
ff84b53b4d5b07082140485e41b0c192410d7b59047266441c3a9c754669d4b7  ADMIN-MODULE-CONTROL-QA-2026-10-06.md  ->  PROJECT-DOCUMENTATION-COMPENDIUM.md (full source section)
ddc595642816b6981604762b59133401e1404cf082b872162467ab41316a3920  ADVANCED-LIVE-SUITE-README.md  ->  PROJECT-DOCUMENTATION-COMPENDIUM.md (full source section)
5a69d6ccf102fd902dd18ae020eb49bda4c7bef86e4aa58963e30da00ed6efd2  AIR-TRAFFIC-LIVE-SETUP.txt  ->  AIR-TRAFFIC-LIVE-SETUP.txt (retained; see build log for intentional edits to HTML/JS snippets)
7dddd9225d5f49a139dbf433f77b5fb71c64876eae7bec08bb149dc9caf43165  AIRSPACE-EARLY-WARNING-ADMIN-HARDENING-2026-10-06.md  ->  PROJECT-DOCUMENTATION-COMPENDIUM.md (full source section)
f5ae916fea56e52712cde4098dde3daeb0948a2c68eb3f14ab12e1e299939745  AIRSPACE-EARLY-WARNING-README.md  ->  PROJECT-DOCUMENTATION-COMPENDIUM.md (full source section)
5572850a759e8359a2f36c6c3bea33f3e7250a5cc4028e9f6e14d068939a4778  AUDIT_2026-09-13-COMMENTS-CARE.md  ->  PROJECT-DOCUMENTATION-COMPENDIUM.md (full source section)
4906cd43f39912aa5268224da68baa55fc62dfced551bf993685e289c20284a5  AUDIT_FINAL_2026-09-13.md  ->  PROJECT-DOCUMENTATION-COMPENDIUM.md (full source section)
e904bb9fa7024c2e0c9f398c58cc4b73fe816b2445e48200eee3fe05ee3c4c31  BANGLADESH-AIR-TRAFFIC-3D-PRO-QA-2026-10-08.md  ->  PROJECT-DOCUMENTATION-COMPENDIUM.md (full source section)
17a33bfe250a7d3ab4f8ec1cd4362b46055dd288e2081368ac84765ea9e2c6d0  BANGLADESH-AIR-TRAFFIC-3D-QA-2026-10-08.md  ->  PROJECT-DOCUMENTATION-COMPENDIUM.md (full source section)
dfd88aec1b63a6dc9ab9215ad2fbaf7104a2cc095c89bf51fb86d7c09e493b4e  BD-SATELLITE-MONITOR-README.md  ->  PROJECT-DOCUMENTATION-COMPENDIUM.md (full source section)
eaa22e9b6cf9f9566fc93ea3b3414fa8b15e1ebee994860391822edb23b365a4  BORDER-COMMAND-MONITOR-2026-10-05.md  ->  PROJECT-DOCUMENTATION-COMPENDIUM.md (full source section)
71aae07a1d9594e18f7aa0b9827ea1caef35a6da190fdbd1dd1b7888cae61f7c  BORDER-MONITOR-QA-2026-10-06.md  ->  PROJECT-DOCUMENTATION-COMPENDIUM.md (full source section)
76f9d5095733b28d6aad40bcea15a4560df98c736dcd12168c58660a18f4e515  BORDER-MONITOR-README.md  ->  PROJECT-DOCUMENTATION-COMPENDIUM.md (full source section)
bdc12dadcaf7be4d4e6699d5308b835a0e8d0f8dbf46d10bd49a8dc95ffe5742  BORDER-ZONE-3D-MONITOR-RELEASE-2026-10-05.md  ->  PROJECT-DOCUMENTATION-COMPENDIUM.md (full source section)
463e640db2b339255542837152e30f73e856a8eb799f718dd3532738553a1e9e  BUGFIX-REPORT-2026-10-03-FULL.md  ->  PROJECT-DOCUMENTATION-COMPENDIUM.md (full source section)
02055ea9f02f34957512235d23fc09f9927ad09caa24df6490d44dd80e87475e  BUGFIX-REPORT-2026-10-09-02.md  ->  PROJECT-DOCUMENTATION-COMPENDIUM.md (full source section)
73cb89d68117342a91c668c30f1c159fe69fda459040cf4dbad4a1496cc45e21  CERTIFICATION-2026-10-06.txt  ->  CERTIFICATION-2026-10-06.txt (retained; see build log for intentional edits to HTML/JS snippets)
c9811403dcbbff441c5b718014ac5185171c2caaf1c69ac9e78b99a99d005bc8  DEPLOY_DIRECT.md  ->  PROJECT-DOCUMENTATION-COMPENDIUM.md (full source section)
df5d8e96901bc8800b6dbcf41cb0d2b157e7c08d41a75109129328e52bd1d5a6  DEPLOY_VERCEL_NOW.md  ->  PROJECT-DOCUMENTATION-COMPENDIUM.md (full source section)
73d0979f3deafc571916637b355a0530aaa9e5e627bec3c0597c8abc485a1dfb  ENERGY-TIME-WEATHER-COMBINED-UPDATE-INSTALL.md  ->  PROJECT-DOCUMENTATION-COMPENDIUM.md (full source section)
ae2f1eef1391f7c3027ac874cad8a62380878460f35cd3be3150e66c268519f5  FINAL-AIR-TRAFFIC-QA-2026-10-08.md  ->  PROJECT-DOCUMENTATION-COMPENDIUM.md (full source section)
a352e49bf543fa11f3d393a1f7c0470195d9f7ae2bed524c23ec009fea4ea02d  FINAL-QA-REPORT-2026-10-06.md  ->  PROJECT-DOCUMENTATION-COMPENDIUM.md (full source section)
5b4a6cf6c4b5089a1be992261ec4930034b801cd4db2388b0313be30e85a3a0c  GITHUB-FINAL-CHECK-2026-09-22.md  ->  PROJECT-DOCUMENTATION-COMPENDIUM.md (full source section)
02d7cfb2b3c3ecd07676dfc030925feaf8a5a0176a1cd018e52765dcf3855c38  GITHUB-GIBS-FIX-README.txt  ->  GITHUB-GIBS-FIX-README.txt (retained; see build log for intentional edits to HTML/JS snippets)
12d3998f102ea463dd248164547650f9682d06d1bdab65f1a578c18ff49a901f  GITHUB-PAGES-DEPLOYMENT-README.md  ->  PROJECT-DOCUMENTATION-COMPENDIUM.md (full source section)
c0c6b8656277b91c7c8dba864d17009c97ae0cc41c37171e0e6b5ab878441e1c  GITHUB-PAGES-DIRECT-DEPLOY.md  ->  PROJECT-DOCUMENTATION-COMPENDIUM.md (full source section)
bc321a3c58e8cc56854119cc532088ff1682d15067993b23643cdc3a19249852  GITHUB-PAGES-FIXED-SETUP.md  ->  PROJECT-DOCUMENTATION-COMPENDIUM.md (full source section)
ef88026079c8c0153cf565a2c1194bd033599e02d82af36dbd34949f8020127a  GITHUB-PAGES-PRODUCTION-DEPLOY.md  ->  PROJECT-DOCUMENTATION-COMPENDIUM.md (full source section)
847f7321344a5023e9958f83ea3821121a565460d8e955999d8c75623fd6f544  GITHUB-PAGES-README.md  ->  PROJECT-DOCUMENTATION-COMPENDIUM.md (full source section)
3e4662c857e4102308cf506d229031e8a3dfbcd8c769ec48d78082858b009bf9  GITHUB-UPLOAD-README.txt  ->  GITHUB-UPLOAD-README.txt (retained; see build log for intentional edits to HTML/JS snippets)
f291d8b3f751f0ac292413bb9f32e80fc6eb82d5ed5e699a8f559e78f44882ac  HASH-LINK-FIX.md  ->  PROJECT-DOCUMENTATION-COMPENDIUM.md (full source section)
55ba8534643e1966130df3601b093026db2799ed3de5200fa86f0ad00678a0aa  IGERS-BD-01-App-Package.zip  ->  IGERS-BD-01-App-Package.zip (retained; see build log for intentional edits to HTML/JS snippets)
04a6800be676cb84b0b3ca136358a4aee407519b46a800ce46d4cb619c64e3cc  INCognito-QA-REPORT.md  ->  PROJECT-DOCUMENTATION-COMPENDIUM.md (full source section)
1039b27e39b2fc8ac1af1eb4d0f8cd944ee5334e1693060f7f3ce09f2c1f5bb5  IN_APP_LIVE_VISUAL_UPGRADE_2026-09-14.md  ->  PROJECT-DOCUMENTATION-COMPENDIUM.md (full source section)
c71d239df91726fc519c6eb72d318ec65820627232b2f796219e87dcf35d0ab4  LICENSE  ->  LICENSE (retained; see build log for intentional edits to HTML/JS snippets)
1dcfbf7427cc011bec6f74c9bdf8f9af59b620e87c9b3b46be3c9425b90634dd  LIVE-DATA-3D-FLOW-QA-2026-10-08.md  ->  PROJECT-DOCUMENTATION-COMPENDIUM.md (full source section)
c5752682fa8c7604a05a2888e2701cd2c78d37a98bfc9f914c4f665902a7ed50  MAGAZINE-PANEL-RELEASE-2026-09-22.md  ->  PROJECT-DOCUMENTATION-COMPENDIUM.md (full source section)
df7c80eafcec2e829e945e5483ec24a49245a25db8515af9a8706f54a0b82313  NASA_CONNECTION_UPGRADE_2026-09-14.md  ->  PROJECT-DOCUMENTATION-COMPENDIUM.md (full source section)
c3dfe489bb13afa93e6069032d13f7479d7cd06473972332f098533dcc91175e  NEXTGEN_UPGRADE_2026-10-06.md  ->  PROJECT-DOCUMENTATION-COMPENDIUM.md (full source section)
c8625a57d5adc69bc60d9c6dcfb9f74e11c356bd8e0f720bf9bb9fa63e8eb477  OPS_UPGRADE_2026-09-14.md  ->  PROJECT-DOCUMENTATION-COMPENDIUM.md (full source section)
cff620c11976d21fb9cd82632b297d2d890fadb529984db417223dfa3b518bfb  PANEL-DATA-RELIABILITY-PATCH-2026-10-09.md  ->  PROJECT-DOCUMENTATION-COMPENDIUM.md (full source section)
683464ac71afa48cbd827661996466a6e5cc23d2bd74bbd54a9a82b0fe72faec  PWA-DANGER-FIX-INSTALL.md  ->  PROJECT-DOCUMENTATION-COMPENDIUM.md (full source section)
57467edd20333b01f9d7e5198700de078c47a82958f181c91ac6496847be7eba  QA-BORDER-COMMAND-CALC-2026-10-05.md  ->  PROJECT-DOCUMENTATION-COMPENDIUM.md (full source section)
5e95ec17b5535856889491fa4c06c244f66d82904600bb7c2942aeac4f8ad973  QA-BORDER-MAP-CONTROL-FINAL-2026-10-05.md  ->  PROJECT-DOCUMENTATION-COMPENDIUM.md (full source section)
d1d7e9ff8ab7bf0314dc8eafd036526ca051b8088a6915024c4d76f0f12e148b  QA-BORDER-MAP-CONTROL-FIX-2026-10-05.md  ->  PROJECT-DOCUMENTATION-COMPENDIUM.md (full source section)
630a0b614c1faa784f4e370c10fd5deee187322dff16ad2284b2f978eabfaf59  QA-FINAL-DEEP-INTEGRATION-2026-09-14.md  ->  PROJECT-DOCUMENTATION-COMPENDIUM.md (full source section)
9e8c8e91ca717c78e754a5cd2e8a75ea1ae39c9cfa4a66667e052829025c0b87  QA-RELEASE-VERIFICATION-2026-09-14.md  ->  PROJECT-DOCUMENTATION-COMPENDIUM.md (full source section)
829b90631eec90516d2cae0b3ccd3b5f7a6fde86250e72a95ae84a5dd05d79a4  QA-REPORT-2026-10-06.md  ->  PROJECT-DOCUMENTATION-COMPENDIUM.md (full source section)
f7fa5bc6969b0b29764dfacbc1b9b7e8b9375aff854536588c93f241651a2737  QA-REPORT-NEXTGEN-2026-10-06.md  ->  PROJECT-DOCUMENTATION-COMPENDIUM.md (full source section)
70f70f5ff98ff4fee3de24a8ad328e36fbdbb13cae900ac0ae106afb399239c6  QA-REPORT.md  ->  PROJECT-DOCUMENTATION-COMPENDIUM.md (full source section)
aac13f7851f56a4364b1565e5bc920acaa9a06d78d85753c2eac8285806cfcd2  README-BD-TOWER-UPDATE.txt  ->  README-BD-TOWER-UPDATE.txt (retained; see build log for intentional edits to HTML/JS snippets)
c6e8852d369a818a939c2b9d475fd4bb49d80f7550875fb1badf0c4124b17a25  README-INSTALL.md  ->  PROJECT-DOCUMENTATION-COMPENDIUM.md (full source section)
b213e1627ff9f7cf86684d7229c1542bb4078cff75f3d66a498d44347cdbcd61  README-START-HERE.txt  ->  README-START-HERE.txt (retained; see build log for intentional edits to HTML/JS snippets)
8a465d07445537405d120f83340135d22b8072c6dfe17427dcd2361733701681  README.md  ->  PROJECT-DOCUMENTATION-COMPENDIUM.md (full source section)
f552a18a33a443514a322e7653bd927d5d83b7c3c81a47e43c9eca300b8e3e09  README.old.md  ->  PROJECT-DOCUMENTATION-COMPENDIUM.md (full source section)
96b8ee42ca01b8521a81242b69e165bfdf214deddb43cbf234f5965f1631d04c  README.txt  ->  README.txt (retained; see build log for intentional edits to HTML/JS snippets)
fd5efe3fe78c7c516b9d11ab73c2a117331a334257b85dfdd07386983093d4ec  README_BN.txt  ->  README_BN.txt (retained; see build log for intentional edits to HTML/JS snippets)
c0cb3196f53a0c899a79d8d3e9e0f7baf24212be1d0e849285a776da325f99af  README_BUGFIX_2026-09-13.md  ->  PROJECT-DOCUMENTATION-COMPENDIUM.md (full source section)
5e8f42d34746e5de08b7f9091d60b4b638359df415a3a938d2c6cb5964164842  REGRESSION-QA-2026-10-08.md  ->  PROJECT-DOCUMENTATION-COMPENDIUM.md (full source section)
e63ffcdb5cb79506275f7b4658bb52ddb4542a670d6cc1c52ff5795feafbd9ed  RUN-AIR-TRAFFIC-LIVE.bat  ->  RUN-AIR-TRAFFIC-LIVE.bat (retained; see build log for intentional edits to HTML/JS snippets)
59e0919b94bcfce700d25f122e26e573f22b56d1c4047cc610fb72274ecca46a  RUN-TOLL-LIVE-RELAY.bat  ->  RUN-TOLL-LIVE-RELAY.bat (retained; see build log for intentional edits to HTML/JS snippets)
4428e56531b11bcaa8a14de38ecf431bbfa6b178f23b671c2330c4e6c9661e0e  RUNTIME-QA-2026-10-06.md  ->  PROJECT-DOCUMENTATION-COMPENDIUM.md (full source section)
507caa7fa6ed846a2c9004586d5a7c577c598060ffb3d92055ee4de9842bb032  SATELLITE_MODULE_AUDIT_2026-09-13.md  ->  PROJECT-DOCUMENTATION-COMPENDIUM.md (full source section)
fb16f444898d06ab3d93f64befb30f9f864a06bb86d520a7f2da71ffb261b9d4  SATELLITE_WEATHER_RESTORE_2026-09-14.md  ->  PROJECT-DOCUMENTATION-COMPENDIUM.md (full source section)
331ea3a90ac578e4a231ff1d48f175e140a5875afe80144a26596d980b79ca43  START-IGERS.bat  ->  START-IGERS.bat (retained; see build log for intentional edits to HTML/JS snippets)
4e3c37b736f11eef9617bd11df1d8fe2d180dc6d4395a5500b853bafbbf2d333  TEMPLATE  ->  TEMPLATE (retained; see build log for intentional edits to HTML/JS snippets)
08ffe02e96d439b1816f9f76d5dc43c73aa6ce26f8f0a7245dffaf3f7488374b  TOLL-NATIONAL-QA-2026-10-08.md  ->  PROJECT-DOCUMENTATION-COMPENDIUM.md (full source section)
5d03230d61079912745a1bb3e89dfd2a694c2a5f78b4d62dc897cfbe376d843b  TOLL-NATIONAL-UPDATE-README.txt  ->  TOLL-NATIONAL-UPDATE-README.txt (retained; see build log for intentional edits to HTML/JS snippets)
9e0b745c4b8508b58aeb9d5fc202e76cfff565f0669759e22b9976eb566da689  UI-VISUAL-DATA-UPGRADE-2026-10-06.md  ->  PROJECT-DOCUMENTATION-COMPENDIUM.md (full source section)
86dd06f5033717aa74ab1b49472f8a481d8c100720309973cc7ede958fe24453  UPGRADE-ONLY-RELEASE-2026-09-22.md  ->  PROJECT-DOCUMENTATION-COMPENDIUM.md (full source section)
2cd7451dcddc976175bd8ae0b2dec05be45baed9becd9eb60122e486ec4b9700  UPGRADE-REPORT-2026-10-03.md  ->  PROJECT-DOCUMENTATION-COMPENDIUM.md (full source section)
d71ca040217992160cc6c242207b29ff4895fc5fc87024289472ddff73a1605a  UPGRADE-REPORT-2026-10-05-DEEP-3D-LIVE-BORDER.md  ->  PROJECT-DOCUMENTATION-COMPENDIUM.md (full source section)
59bf21e394dde05bd939e945b6de4dedfbf8b368d38b4cc956cf70bf40b6f48b  UPGRADE-REPORT-2026-10-05-DEEP-3D-LIVE.md  ->  PROJECT-DOCUMENTATION-COMPENDIUM.md (full source section)
3f7c7da0d2323dc66be237e64334a99a2cf4aaa6a0ca926e5400d49e81a2ae0d  UPGRADE_AUDIT_2026-09-14.md  ->  PROJECT-DOCUMENTATION-COMPENDIUM.md (full source section)
b591016aaba070fae6b64c580d8410c98059bfc54e1ab600071b5cf62f7a8f1a  UPGRADE_NOTES_2026-09-13.md  ->  PROJECT-DOCUMENTATION-COMPENDIUM.md (full source section)
5b2c6b86a460847312f31e6967fccd936c67c68a40507ecffac592ca764c9717  UPGRADE_PRO_RELEASE_2026-09-22.md  ->  PROJECT-DOCUMENTATION-COMPENDIUM.md (full source section)
0cf167f230432341af4f9036e3b376e46bd4369a33f3fe32a5ff75e73bdf452a  VOICEMAIL-FULL-APP-AUDIT-2026-09-15.md  ->  PROJECT-DOCUMENTATION-COMPENDIUM.md (full source section)
41c6f9c8d352933fb99ad077c0a3eded2ccb7e7a5dc9ced6baad8188ac31260a  WEATHER-3D-DIGITAL-UPGRADE-2026-10-06.md  ->  PROJECT-DOCUMENTATION-COMPENDIUM.md (full source section)
5821aa9bba0d65c39b529e72158ccbe75ec278179acaf07ff02bc7f2a8c3d62f  add_weather_digital.py  ->  add_weather_digital.py (retained; see build log for intentional edits to HTML/JS snippets)
e7f5f0868039aa9199967310a1088f319a8d6128583270a0e57a297a963cea1b  admin-control.css  ->  igers-compact-bundle.css (source section; or dormant media block for generic legacy themes)
ce7c4ca693f679d0739d605fe9577527cf9b383535b59996896d9aadca36b23d  admin-control.js  ->  admin-control.js (retained; see build log for intentional edits to HTML/JS snippets)
1b3a56ed768ced0e13c13fa04dddd4a223ad481bc21451aeadf55e765b194e9f  advanced-live-suite.css  ->  index.html (inline style block; original source hash below)
f5ac0ad3a75ea4b76ca798521d730eaf4524f71c6f92e63f7e54bd4553201ba0  advanced-live-suite.js  ->  advanced-live-suite.js (retained; see build log for intentional edits to HTML/JS snippets)
65d00fa873c7859900b0474aa557cce3beb8885227252fa2794bf5adb941f76a  air-traffic-live-3d.css  ->  igers-compact-bundle.css (source section; or dormant media block for generic legacy themes)
20931179dd9a017ccdca9cafe0e09fe1f06c28bc322fd0dea43c30526a2f45ec  air-traffic-live-3d.js  ->  air-traffic-live-3d.js (retained; see build log for intentional edits to HTML/JS snippets)
32ceae812eb6ef99da21423e553e723043807c5b2d649da4b7574b7c0d65ca0d  airtraffic_live_relay.py  ->  airtraffic_live_relay.py (retained; see build log for intentional edits to HTML/JS snippets)
fa0baef942595b59a22a8fbbd0bddcbc4048c0b98dec85cc075bf73853e2098d  app.js  ->  app.js (retained; see build log for intentional edits to HTML/JS snippets)
28ae93ced25d9727fda875eca812d45f90078e3bb137c8923b394000bd5f8d51  bangladesh-flag-overlay.svg  ->  bangladesh-flag-overlay.svg (retained; see build log for intentional edits to HTML/JS snippets)
8b7bb93b990c06426406efe45aa9f5bcd9dbe4e4647567ef031b462e4bb772d5  border-monitor.css  ->  index.html (inline style block; original source hash below)
456fdaf35f4f71ebce66522a940695f5214d9f3245515ec0239584540ca769d1  border-monitor.js  ->  border-monitor.js (retained; see build log for intentional edits to HTML/JS snippets)
e310a3802ed17f868ddfc8d101833d607252222703badc6bd6588976316c92ef  border-status-integration-snippet.html  ->  border-status-integration-snippet.html (retained; see build log for intentional edits to HTML/JS snippets)
757b5001891f3384eafa700322b7facd4aec92531129f091291284949eaffbf9  border-zone-command.css  ->  igers-compact-bundle.css (source section; or dormant media block for generic legacy themes)
cae98e66fa1ec4e9f34bbf4c4dcd121a572f583f8bb16b41b5850576bebffa36  border-zone-command.js  ->  border-zone-command.js (retained; see build log for intentional edits to HTML/JS snippets)
59d87cd5d4cb4a7440e9171c997f8903ec16ade64d4cd3ca24ebff78a3461e15  border-zone-monitor.css  ->  igers-compact-bundle.css (source section; or dormant media block for generic legacy themes)
c30ce00fc3e498b019d248f92456c03ac15cbbd066863ab0ec6fa3a222edb036  border-zone-monitor.js  ->  border-zone-monitor.js (retained; see build log for intentional edits to HTML/JS snippets)
923000f35cee75ff2aac91f085b4997848c469260436701792da1910655e1ed1  build.mjs  ->  build.mjs (retained; see build log for intentional edits to HTML/JS snippets)
4fb024caacdcff0601914fd58d6b29d1b7ca726b889cffdff8193b6b50b99345  construction-3d.png  ->  construction-3d.png (retained; see build log for intentional edits to HTML/JS snippets)
df1f0c213ad0e743c06180dcbdb0b62bf26c41755884767a380bceb0d4d3780c  copyright.html  ->  copyright.html (retained; see build log for intentional edits to HTML/JS snippets)
d4a07da96f85a5ad5fd33281f6463d9319eb1ced29ec0799fd74f57c62b0928a  data/bangladesh-boundary-fallback.geojson  ->  data/bangladesh-boundary-fallback.geojson (retained; see build log for intentional edits to HTML/JS snippets)
8410c30d5e617a2dbb252b9a4b81e3490254c6f2078abd884290b9949ff3fbed  designer.css  ->  igers-compact-bundle.css (source section; or dormant media block for generic legacy themes)
e7a9b6c1cadab3f034caeb6974cedce5942eac01975dc8b8c0356dd69a57cec2  designer.js  ->  designer.js (retained; see build log for intentional edits to HTML/JS snippets)
5155038b67a37af65dc7ac17a0bf02983d5558101e541789426356c18b9cd46c  energy-live-update.css  ->  index.html (inline style block; original source hash below)
3b71805307c50e82d6a47880363ef0e15116159b13d5aa26d6a79dc6fdc3442d  energy-live-update.js  ->  energy-live-update.js (retained; see build log for intentional edits to HTML/JS snippets)
bd892a21b97a0cbf2ae70f9d9e3da6d66f0274a3f5f312ad85601e3c1a24b3eb  feedback-premium.css  ->  index.html (inline style block; original source hash below)
97c212e856f81364528746813dc5f01ca38152511c5c5fa0ef862e3b0a56f137  field-connectivity-hardening.css  ->  igers-compact-bundle.css (source section; or dormant media block for generic legacy themes)
88a665c9bef4eac423f4cae8b733c1b612c10945807c7b814168bbb24e10f3c9  field-connectivity-hardening.js  ->  field-connectivity-hardening.js (retained; see build log for intentional edits to HTML/JS snippets)
62e7dd0ddc9280a676a0c19382944a73b7794198cf8faab899e2c7f4da4ec547  global-3d.css  ->  index.html (inline style block; original source hash below)
e438557863507693af4192065fa75bd1b14c60d61fcf2cd4210991d25b68c6e3  global-realistic-3d.css  ->  index.html (inline style block; original source hash below)
b3cc0d1345a12b47725b9e1a32161d5ed79c8964dd91274f5e9129df81d119ad  global-realistic-3d.js  ->  global-realistic-3d.js (retained; see build log for intentional edits to HTML/JS snippets)
b972db3855ae8b0d14d9d9e32f9cd41e20b3caf9c51a2b93aee53827e95d6551  icon-192.png  ->  icon-192.png (retained; see build log for intentional edits to HTML/JS snippets)
38db8dc76b660762e9b9e75f54baf8aad98235f1a0efdcbe03bd2b8bf8e5d780  icon-512.png  ->  icon-512.png (retained; see build log for intentional edits to HTML/JS snippets)
3aedbad141cb8dba8aded4f86a3032a1fe89ed5c928199f96795fd353509078e  icon.svg  ->  icon.svg (retained; see build log for intentional edits to HTML/JS snippets)
aa52c52c1060de481781df3635ce0dd991bb833d04e3ec9c011fb0153fc8a14b  igers-3d-engineering.css  ->  igers-compact-bundle.css (source section; or dormant media block for generic legacy themes)
d27a369c13f1a8e60cd037da077e43ba02c8f12842fb2a3fa2967ee19d36d486  igers-3d-engineering.js  ->  igers-3d-engineering.js (retained; see build log for intentional edits to HTML/JS snippets)
26fa770342b9e6dbb1fa96ed6b413477507b5b9c4c8e33c92043b0b9f406cf93  igers-advanced-panels-2026-10-03.css  ->  igers-compact-bundle.css (source section; or dormant media block for generic legacy themes)
b026b86834d9cfbc87848e278d11bb72d2ceb6d102bcb6335d323013cae7ee71  igers-advanced-panels-2026-10-03.js  ->  igers-advanced-panels-2026-10-03.js (retained; see build log for intentional edits to HTML/JS snippets)
b8a3be2ed77da9991408d51e0805385d4a2451640fac9b3ff9976915d6bded11  igers-bd-satellite-monitor.css  ->  igers-compact-bundle.css (source section; or dormant media block for generic legacy themes)
1825a6f889056a9d3671ca9cb48b85a0ad44d56cf5522dfbbe7d1e0b16e6404a  igers-bd-satellite-monitor.js  ->  igers-bd-satellite-monitor.js (retained; see build log for intentional edits to HTML/JS snippets)
d5f333140318303b3083bbfd5786aafb04e21b09a0c4aec6a2ce31c4c34ae6cd  igers-future-upgrade.css  ->  index.html (inline style block; original source hash below)
0313a24993c564eff86b43f4700d342ca128a6aa93ca5ba8c5dbdabccf49433b  igers-future-upgrade.js  ->  igers-future-upgrade.js (retained; see build log for intentional edits to HTML/JS snippets)
5930b3b5b96175f6dab541f87a0e4d5fe0f74e109732d7978d2861ae747a37dc  igers-live-3d-operations-2026-10-05.css  ->  igers-compact-bundle.css (source section; or dormant media block for generic legacy themes)
41fe943cd0d7f05020169cfd3bdbbf84e53e7bb4b5f3ae21bbd2bf92deebcef2  igers-live-3d-operations-2026-10-05.js  ->  igers-live-3d-operations-2026-10-05.js (retained; see build log for intentional edits to HTML/JS snippets)
40739ff945ebabf1c02ea122862f1de03d85d46842466838ea51f44ecd659146  igers-live-enhancer.js  ->  igers-live-enhancer.js (retained; see build log for intentional edits to HTML/JS snippets)
7868b5f87281630c63a497f0caeaa9a6f0211b8a6b6edf8324a3a1e3ad10706d  igers-nextgen.css  ->  igers-compact-bundle.css (source section; or dormant media block for generic legacy themes)
2df72df9983c1461c7bafedd98b0b62439f089d64880a195e17bf4c4cc18d3a5  igers-nextgen.js  ->  igers-nextgen.js (retained; see build log for intentional edits to HTML/JS snippets)
9237677247357adef83a1791a9e1476c178eededb102a707b6e4cd183f13c4a6  index.html  ->  index.html (retained; see build log for intentional edits to HTML/JS snippets)
b74109311b3037317d32727b1ca29b1c44a5025cdad78a78181b70030d325d90  integration-snippet.html  ->  integration-snippet.html (retained; see build log for intentional edits to HTML/JS snippets)
b4bc231268d829b9aa19d194dcccdc2bb47700b3d892295fb9c7cd379967ef98  iron-dome-runtime-hardening.css  ->  igers-compact-bundle.css (source section; or dormant media block for generic legacy themes)
ebb90758b47bb9e74f446fe9fb9d041807c2c99fa3f64c30bb22db694a66aea6  iron-dome-runtime-hardening.js  ->  iron-dome-runtime-hardening.js (retained; see build log for intentional edits to HTML/JS snippets)
afaf10297a5280bbfc483f54a5b23f8dace51636aa633f8c1405e705c5dec21d  legal.css  ->  igers-compact-bundle.css (source section; or dormant media block for generic legacy themes)
97ada0758cfcc01547bff3389097b8638c7c67f64f199c566f669b58e57449fe  live-indicator-fix.css  ->  index.html (inline style block; original source hash below)
c22fc0a5bc992aed847918047652d395e7a3b941db171151ee4cc55a066a4bf8  live-indicator-fix.js  ->  live-indicator-fix.js (retained; see build log for intentional edits to HTML/JS snippets)
9655ee4d26730a84da6b961329192ee0ee91ed850b1ab90bcd8cd0ebca315ad2  live-results-3d-flow-center.css  ->  igers-compact-bundle.css (source section; or dormant media block for generic legacy themes)
1db16a882f69e58b2dd57d74ade591734ab85d646e4d73e8264c8760c958467d  live-results-3d-flow-center.js  ->  live-results-3d-flow-center.js (retained; see build log for intentional edits to HTML/JS snippets)
353d2d44b0a8519d3cb3df7575f0f72fdaa8b896c5a7a3fb7c7a732519dce2bb  main.jsx  ->  main.jsx (retained; see build log for intentional edits to HTML/JS snippets)
539163843e48e7c265d6b8614822093a17a0745f58d9797f82ca39eb067626ee  manifest.webmanifest  ->  manifest.webmanifest (retained; see build log for intentional edits to HTML/JS snippets)
9c1dd46e053a031c0e937522ce439bfbb3d89185d7fae51dbda031903e37bbf8  mobile-tower-control.css  ->  igers-compact-bundle.css (source section; or dormant media block for generic legacy themes)
83bdd632c907ca5b66a6a0bfd34ae03b2fe35a870abb40555ba0ecd818b973fa  mobile-tower-control.js  ->  mobile-tower-control.js (retained; see build log for intentional edits to HTML/JS snippets)
6acbe645da3de9543f695061d9f18d616b75513b37d15cec15f8a983abb67df8  nasa-gibs-bd.css  ->  igers-compact-bundle.css (source section; or dormant media block for generic legacy themes)
81fd9feaa61b41f94b5370ceb5fad03567de7af81a2bdced9abcd9b328cc1591  nasa-gibs-bd.js  ->  nasa-gibs-bd.js (retained; see build log for intentional edits to HTML/JS snippets)
6ab824a025f41dda81e8bf18aaef233e8ac8fc6955eaf84b3e67f7744223fc56  nasa-intel.js  ->  nasa-intel.js (retained; see build log for intentional edits to HTML/JS snippets)
35d7e93040fc3704081dfd10e40cc57fd85782578cf9af0110ee489cfb851b8c  network-architecture.png  ->  network-architecture.png (retained; see build log for intentional edits to HTML/JS snippets)
e8269ef72648846260b28f1b9ad1fb028542dbe9e0473e4cf10d161b4bbef411  package.json  ->  package.json (retained; see build log for intentional edits to HTML/JS snippets)
244f51fe307f9845d6ef0fd36f63f495dd6e11a4f7e71b7f95a01c075144bc06  privacy.html  ->  privacy.html (retained; see build log for intentional edits to HTML/JS snippets)
f1f0fe375212fa6fb953e15f4913a50664853a00f9d18c0ff41cf8c011fb8e60  pwa-download-fix.css  ->  igers-compact-bundle.css (source section; or dormant media block for generic legacy themes)
8236590dfadd670d399fec87d7db2ab85e9bf7b1675c517dbff4455094aaedd8  pwa-download-fix.js  ->  pwa-download-fix.js (retained; see build log for intentional edits to HTML/JS snippets)
0b13370643b7e3aaeff60466e8f79fc8f9c727a72b250092cbb7b5f89ce97d9b  runtime.png  ->  runtime.png (retained; see build log for intentional edits to HTML/JS snippets)
6f09b0552917b07f9016f37b92435c128459ccd294e29e7629e4018cda92f268  satellite-connection-pro.js  ->  satellite-connection-pro.js (retained; see build log for intentional edits to HTML/JS snippets)
791172c7da77bcc6d75eb3c50f1834ebcd731dc98838dae432090034348e4aad  script.js  ->  script.js (retained; see build log for intentional edits to HTML/JS snippets)
5990cd74f717f8ae6596c1c04f519ef55a4336424e57fa2c52a8de55e280c62b  server.mjs  ->  server.mjs (retained; see build log for intentional edits to HTML/JS snippets)
633c9a41659031962dfbb69f90a75df976b61b75793f73147243ac1187de2738  style.css  ->  igers-compact-bundle.css (source section; or dormant media block for generic legacy themes)
9c93ad3a1c3b35d831b62fe089a747f3dbe79597cf4712eff4dd4613492d8fdc  styles.css  ->  styles.css (retained as standalone runtime dependency)
9cd7f66b1808874e22ca854ac1208c0e33eec109575f9c964b4d7111fa39f26d  sw.js  ->  sw.js (retained; see build log for intentional edits to HTML/JS snippets)
d552e0536766a67ec4da924eca3c964c10095903ccca82781bef4856ca2b44c2  terms.html  ->  terms.html (retained; see build log for intentional edits to HTML/JS snippets)
ea2bdfee81348c88772d480f99e7252121c9583e0cbdce9c4f68ff6dcc07f8b9  test_airtraffic_relay.py  ->  test_airtraffic_relay.py (retained; see build log for intentional edits to HTML/JS snippets)
fc6dc85d36bfb69677e2cf48b4097b83d2e34895dbfe08f17020cdd9214a43ef  time-energy-repair.css  ->  igers-compact-bundle.css (source section; or dormant media block for generic legacy themes)
68ebe191ed607f6106ee6a8ca1100aaa3e6e973f4bf89dd454cfb3c887650a9c  time-energy-repair.js  ->  time-energy-repair.js (retained; see build log for intentional edits to HTML/JS snippets)
94d15871851e8273cbbe8aaa16195a0ca5f11032c7a472ba8d442df391f12436  time-weather-update.css  ->  time-weather-update.css (retained as standalone runtime dependency)
6b639fd0d516463a143307201a5101075705cc5883630c57f9a359ea434fcc7c  time-weather-update.js  ->  time-weather-update.js (retained; see build log for intentional edits to HTML/JS snippets)
ecf8b8b60f6e82a2056004eab2b8171ab7158be99fe5d99cec6caf6e37fcc4d0  toll-live-relay.py  ->  toll-live-relay.py (retained; see build log for intentional edits to HTML/JS snippets)
7677f4f3a5c42bc671e8590ac9d5b0f768dfe366357ad82e045d30a8b59b93a2  toll-national-pro.css  ->  igers-compact-bundle.css (source section; or dormant media block for generic legacy themes)
5321dac7db77ae19642ce631d76d3bf7408a3684d12b3060a41e74d2c349a34a  toll-national-pro.js  ->  toll-national-pro.js (retained; see build log for intentional edits to HTML/JS snippets)
907439198422d6794917b66fd7acd078e5f70ae65a803ead4e7b230c664db020  toll-plaza-national-3d.css  ->  igers-compact-bundle.css (source section; or dormant media block for generic legacy themes)
87dd0ab918ce6027f0d92766184f68e3425d398fe67ea807e42cd9b480612d40  toll-plaza-national-3d.js  ->  toll-plaza-national-3d.js (retained; see build log for intentional edits to HTML/JS snippets)
71b1bf5ea6006c62a75d827855a4c8dd6e96853aa25d29facef42380546d9f39  ui-visual-upgrade.css  ->  index.html (inline style block; original source hash below)
190ad2e34e3f5c08be230866d904f9125f4e65e52dfddc2408401bf1e2e764ed  ui-visual-upgrade.js  ->  ui-visual-upgrade.js (retained; see build log for intentional edits to HTML/JS snippets)
5c0e11726bf9d9f53e19910a3480c7eaa0b11526a5b71d92768cc005228efdb3  upgrade-pro.css  ->  igers-compact-bundle.css (source section; or dormant media block for generic legacy themes)
09e6f991880fd141f9075e3cedd282090153ac981922e71f114f2e6da2cf2528  upgrade-pro.js  ->  upgrade-pro.js (retained; see build log for intentional edits to HTML/JS snippets)
b2d352e9eed8c173453e1accd000d27a461f3624c2259eb22e39b2afc273f1b4  upgrade.css  ->  igers-compact-bundle.css (source section; or dormant media block for generic legacy themes)
8e6e46cacdad25b365ba9dbb02a0c40ce0d737e0b831be6ec69af95f06a952eb  upgrade.js  ->  upgrade.js (retained; see build log for intentional edits to HTML/JS snippets)
6fa28e375801003d0cfda2f9dd1a93d5e5959f07780b15c5cca91e58b0c7a7bb  vehicle-movement-monitor.css  ->  igers-compact-bundle.css (source section; or dormant media block for generic legacy themes)
0c6221191ffeb28f4b8dcd30e25b5ec862bd947c1e2f616122eff915f9943578  vehicle-movement-monitor.js  ->  vehicle-movement-monitor.js (retained; see build log for intentional edits to HTML/JS snippets)
5a17b6b24a78cab9b8cbecdf28dc29c390ba19832b605fd7fa4aa591e4301f4b  vercel.json  ->  vercel.json (retained; see build log for intentional edits to HTML/JS snippets)
3fceb55a0b7da315b9d5a68599fc2a904966333288804c252c549f3b43cd4d4b  voicemail.css  ->  igers-compact-bundle.css (source section; or dormant media block for generic legacy themes)
773bc93f7dcedf44b445aa3bf7d5eb5ca2ad0fd19d09d97b93ac6c1def051578  voicemail.js  ->  voicemail.js (retained; see build log for intentional edits to HTML/JS snippets)
d93562e68a7024b07bd6198000735fade470be1e0a7cfdfc4a10f79e4f436e73  water-foot-live.css  ->  igers-compact-bundle.css (source section; or dormant media block for generic legacy themes)
585898fc28578d1297b9ef815e793532721cf3e1c15f9d75ff3807b65e44a0a2  water-foot-live.js  ->  water-foot-live.js (retained; see build log for intentional edits to HTML/JS snippets)
29621d579156adb3072b0d14e3a9d620eb2bc2e7c073456fcd1c3aea131be547  weather-3d-location.css  ->  igers-compact-bundle.css (source section; or dormant media block for generic legacy themes)
809f8fb0fee3113a4f56fc040c967e64557d2e5eb00b64c2e5609097280c88de  weather-3d-location.js  ->  weather-3d-location.js (retained; see build log for intentional edits to HTML/JS snippets)


---

## Original file: `DEPLOY_DIRECT.md`

# IGERS POWERCORE — Direct Deployment Package

Version: 1.1.0-designer  
Project: IGERS-BD-01 — Integrated Gradient-Based Energy Recovery & Storage System  
Organization concept: IGERS POWERCORE TECHNOLOGIES LTD.  
Author / Inventor: Abdullah Al Rafi [BD]

## What is included
This package keeps the latest verified IGERS interface as the functional base and adds a non-destructive designer layer. Existing monitoring and information modules are retained, including:

- energy recovery concept architecture and deployment views
- live time and weather panels
- environmental / earthquake indicators
- live air-traffic panel
- Bangladesh Airspace Anomaly Monitor
- satellite connection/orbital public-data monitor
- NASA GIBS near-real-time imagery panel
- NASA POWER atmospheric panel
- satellite/disaster/navigation information layer
- comments & customer-care demo interface
- copyright, privacy and terms/disclaimer pages
- Bangladesh flag visual treatment and responsive mobile navigation

## Local run

```bash
npm run build
npm run serve
```

Then open `http://127.0.0.1:4173/`.

## Static hosting
The production output is written to `dist/`. Upload the **contents of `dist/`** to a static hosting service. No GitHub repository is required for the static files themselves.

Connect the custom domain `the custom domain` at the hosting provider using that provider's DNS instructions.

## Important data note
The dashboard uses public external data services. A live indicator means the browser reached the relevant public feed; it is not a guarantee that every upstream service is continuously available.

The NASA Worldview panel is represented through the public NASA GIBS data layer and official source links. The site does not claim restricted spacecraft telemetry or military system access.

The visitor comments interface in this static package is local browser demo storage; it does not send messages to a remote inbox.


---

## Original file: `DEPLOY_VERCEL_NOW.md`

# IGERS POWERCORE — GitHub-free Vercel deployment

The project is prepared for Vercel without a GitHub repository.

## Deploy with Vercel CLI

1. Install Node.js LTS.
2. In this project folder run:

```bash
npm install
npx vercel login
npx vercel --prod
```

Vercel will build with `npm run build` and publish `dist/`.

## Custom domain

After deployment, add:

`the custom domain`

in Vercel → Project → Settings → Domains.

Use the DNS records Vercel shows for the domain registrar. HTTPS/SSL is then handled by Vercel.

## Important

No GitHub repository is required for this route. The local static build and existing website features remain the source of deployment.


---

## Original file: `ENERGY-TIME-WEATHER-COMBINED-UPDATE-INSTALL.md`

# IGERS Combined Time + Weather + Live Energy Update

This package is an additive update to the existing IGERS-BD-01 web app.

## Included
- Existing IGERS application and preserved panels/features.
- Live Time / Weather update already integrated in the current baseline.
- New `IGERS ENERGY CALCULATION ENGINE` panel.
- Live recalculation when model inputs change.
- Admin-protected Energy Engine ON/OFF and Reset controls.
- Existing IGERS administrator password/session model is reused: `MIM2005`.

## Energy reference model
The default values reproduce the current illustrative roadway model:
- mass = 900 kg
- entry speed = 20 km/h
- exit speed = 15 km/h
- net recovery efficiency = 20%
- 100,000 harvesting locations
- 210,000 vehicle passages/year/location

The model uses `ΔE = 0.5 m (v1² - v2²)` and then applies the recovery factor. It is a planning/illustrative model, not measured field production.

## GitHub Pages
Upload/extract the package so `index.html` remains at the repository root. Keep all files and relative paths together.

## Security note
The password/session mechanism is suitable only for a static prototype UI. GitHub Pages cannot protect a secret like a production backend. Physical hardware control is not performed by this panel.


---

## Original file: `FINAL-AIR-TRAFFIC-QA-2026-10-08.md`

# IGERS Bangladesh Air Traffic — Final QA 2026-10-08

## Provider correction
- Airplanes.live `/point` radius corrected from 450 nm to **250 nm** (documented API maximum).
- 30-second browser refresh remains safely above the documented 1 request/second rate limit.
- Bangladesh geographic polygon filtering remains active before 3D rendering.

## Runtime hardening
- Optional same-origin Python relay: `/api/airtraffic`.
- Python relay uses standard library only.
- Per-target stale pruning retained; temporary upstream failures no longer wipe the entire target set prematurely.
- 3D canvas resize remains event/size driven rather than per animation frame.
- Service Worker cache bumped to v21.

## Tests
- Python relay self-test: PASS.
- Python relay `py_compile`: PASS.
- Air traffic JS `node --check`: PASS.
- Project local-script reference scan: PASS.
- Duplicate ID scan: PASS.
- ZIP integrity: PASS.
- Local `/api/health` smoke test: PASS.
- Live upstream availability in sandbox: NOT CERTIFIED because external DNS/network is unavailable in this environment.


---

## Original file: `FINAL-QA-REPORT-2026-10-06.md`

# IGERS POWERCORE — FINAL HARDENED QA — 2026-10-06

## Static QA
- JavaScript syntax: PASS — 0 errors across all project JS files.
- Duplicate HTML IDs: 0.
- Local stylesheet dependencies are inlined into `index.html` for GitHub Pages deployment robustness.
- Service-worker revision: `igers-powercore-v11`.
- Development-only `jscheck/` folder and build helper removed from deployment package.
- Bangladesh fallback GeoJSON present.
- Existing major sections retained, including Air Traffic, Airspace Safety, Border Monitor, 3D Early Warning, 3D Traffic, Seismic 3D, Marine 3D, IGERS 3D Lab, Tower Mesh, Salah/Qibla, Emergency, Weather and Data Analysis.

## Browser runtime smoke QA
Executed against the actual `index.html` in headless Chromium using the real browser DOM and canvas runtime.
- Default theme: `night`.
- Digital 3D Weather canvas initialized with non-zero dimensions.
- 3D Air/Ground/Maritime early-warning scope initialized.
- 3D Bangladesh Border monitor initialized.
- 3D radar-style scanner initialized.
- 3D Qibla canvas initialized.
- Salah grid populated with 5 prayer entries.
- Qibla result populated: 278° W (Dhaka fallback test location).
- Administrator controls start locked.
- No JavaScript `pageerror` exceptions.
- No application console errors during the successful runtime boot; public network requests were isolated in the test harness and their forced aborts are not application errors.

## Security boundary
- Administrator controls are configuration/monitoring controls only.
- No weapon firing, interceptor launch, target assignment, military fire-control, jamming, or remote weapons control is included.
- GitHub Pages frontend authentication remains UI-level; production-grade secrets must live server-side.
- Coverage rings in the early-warning panel are explicitly labeled as visualization-only.


---

## Original file: `GITHUB-FINAL-CHECK-2026-09-22.md`

# IGERS GitHub Final Check — 2026-09-22

- Repository root contains index.html: YES
- CNAME: the custom domain
- .nojekyll: YES
- Missing local HTML references: 0
- Missing asset references: 1
- Root structure: VERIFIED
- Source package was flattened from the production `dist/` output so GitHub Pages can serve it directly.


---

## Original file: `GITHUB-GIBS-FIX-README.txt`

IGERS POWERCORE — NASA GIBS / Bangladesh 3D Radar Fix

Extract the CONTENTS to the repository root, keeping index.html at root.

This build preserves the existing app and adds/fixes a direct NASA GIBS WMTS tile view inside the existing 3D Bangladesh Air/Ground/Maritime monitor. The original NASA Worldview iframe is retained as a separate public imagery option.

New direct GIBS panel:
- Bangladesh satellite imagery tile layer
- VIIRS SNPP / VIIRS NOAA-20 / MODIS Terra layer selection
- imagery-date fallback across recent dates
- tile load status
- zoom +/- and refresh controls
- existing radar-style scanner remains separate from imagery

Live sensor/air/ground/maritime values are only shown when the corresponding public/authorized data bridge provides them. Missing data is shown as VERIFY/OFFLINE rather than invented.


---

## Original file: `GITHUB-PAGES-DEPLOYMENT-README.md`

IGERS POWERCORE — GitHub Pages deployment hardening — 2026-10-06

This package contains index.html with the visual/theme CSS and upgrade JavaScript inlined into the page.
The default theme is NIGHT. The Day/Night control remains available.

Why this build exists:
- avoids GitHub Pages/browser cache problems for the visual/theme layer
- avoids dependence on separate theme/3D CSS/JS files for first paint
- preserves existing local modules and data assets

Deploy:
1. Extract this ZIP.
2. Replace the repository root files with these files, especially index.html.
3. Keep the data/ folder and any existing assets.
4. Commit/push to the GitHub Pages source branch.
5. Open the Pages URL with a hard refresh (Ctrl+Shift+R) once.

Note: public live APIs still require the user's browser/network and may show LIVE/VERIFY/OFFLINE states honestly.


---

## Original file: `GITHUB-PAGES-DIRECT-DEPLOY.md`

# IGERS POWERCORE · DIRECT GITHUB PAGES BUILD

Canonical live URL:
https://raabdullah59720-igers.github.io/IGERS-POWERCORE/

This release is intentionally custom-domain-free. It contains no `CNAME` file and no runtime redirect to a custom domain.

## Deploy
1. Upload the CONTENTS of this package to the repository root.
2. Keep `index.html` at the repository root.
3. Keep the `.github/workflows/pages.yml` workflow.
4. In GitHub: Settings → Pages → Build and deployment → Source → GitHub Actions.
5. The workflow deploys the repository as a project site at `/IGERS-POWERCORE/`.

Important: GitHub account/repository Pages settings are server-side. If a custom domain is still configured in Settings → Pages, remove it there to stop GitHub's server-side custom-domain redirect. The files in this package do not request or create such a redirect.


---

## Original file: `GITHUB-PAGES-FIXED-SETUP.md`

# IGERS-BD-01 — GitHub Pages Fixed Release

This package is prepared for direct GitHub Pages project hosting.

## Important
- `index.html` is at the repository root.
- `.nojekyll` is included.
- All website assets are kept with relative paths so the project works under:
  `https://raabdullah59720-igers.github.io/IGERS-POWERCORE/`
- The previous `CNAME` file for the custom domain has intentionally been removed from this GitHub-safe release. This avoids a broken/misconfigured custom-domain setup from interfering with the normal GitHub Pages URL.
- If the custom domain is later configured correctly in GitHub Pages + DNS, a `CNAME` file containing only the custom domain can be restored.

## Upload
Upload the CONTENTS of this folder to the root of the `IGERS-POWERCORE` repository, not the outer ZIP folder.

GitHub:
1. Open the repository.
2. Upload/replace the files in the repository root.
3. Commit to the branch used by Pages.
4. Settings → Pages → Deploy from a branch → select that branch and `/ (root)`.
5. Wait for the Pages deployment to finish.
6. Open the project URL.

## Local QA performed
- JavaScript syntax checked successfully for all project JS files.
- Root `index.html` served successfully through a local HTTP server.
- Relative asset references were checked.
- Existing project assets/features were preserved.

This is a static GitHub Pages release. Server-side files in the source package are not required for GitHub Pages.


---

## Original file: `GITHUB-PAGES-PRODUCTION-DEPLOY.md`

# IGERS-BD-01 POWERCORE — Production GitHub Pages Release

Target project URL:
`https://raabdullah59720-igers.github.io/IGERS-POWERCORE/`

## What is preserved
This package is based on the latest IGERS POWERCORE full-feature release and preserves the existing Journal/Magazine, time, weather, earthquake, live ADS-B air traffic, airspace safety, NASA GIBS/GPM, NASA POWER, satellite/disaster intelligence, Bangabandhu-1 public orbital monitor, engineering lab, admin control, voicemail/customer-care, and advanced operations layers.

## Production fixes
- Restored the missing Professional Engineering Magazine PDF asset referenced by the app.
- Added a read-only Satellite Public Data Connection Center for CelesTrak, SatNOGS and NASA GIBS source-health checks.
- Added conservative timeout/fallback behavior; an unavailable external provider cannot blank the app.
- Rotated the service-worker cache namespace to prevent a stale broken build from persisting.
- Added a GitHub Pages Actions workflow and `404.html` fallback.
- Hardened external links with `noopener noreferrer`.
- Kept the physical-control boundary explicit: browser controls modify software state only and do not directly switch real equipment.

## Upload rule
Upload the CONTENTS of this ZIP to the repository root. Do not upload the ZIP as a single file. Existing duplicate root files should be replaced by this build's versions; do not place them inside another `IGERS-POWERCORE-main/` folder.

## Pages setting
Preferred: Settings → Pages → Build and deployment → Source → GitHub Actions.

The workflow will deploy on pushes to `main` or `master`, or manually from Actions.

## Satellite note
The satellite connection panel uses public orbital-element/catalog and Earth-observation service metadata. It does not transmit commands or expose spacecraft telemetry/control.


---

## Original file: `GITHUB-PAGES-README.md`

# IGERS-BD-01 — GitHub Pages Deployment

This folder is the deployable static website root.

## GitHub Pages
1. Upload **all files in this folder** to the repository root.
2. Confirm `index.html` is directly in the repository root.
3. GitHub → Settings → Pages → Deploy from branch → `main` → `/ (root)`.
4. The included `CNAME` targets `the custom domain`.

Do not upload this folder itself as a nested directory.


---

## Original file: `GITHUB-UPLOAD-README.txt`

IGERS POWERCORE — FINAL BUGFIXED GITHUB PAGES PACKAGE

Extract this ZIP and upload the CONTENTS to the repository root. Keep index.html at the root.

This compact deployment includes the restored 3D Air Traffic, Vehicle Movement, Field Link, National Toll Plaza/individual 3D models, hourly seismographs, Chrome/PWA install/download handling, and the pre-existing app panels.

Live CCTV/toll/vehicle/ADS-B data requires a public or operator-authorized endpoint; unavailable feeds are not represented as live.


---

## Original file: `HASH-LINK-FIX.md`

# IGERS hash/deep-link fix

Direct links such as `#satelliteIntel` now use a resilient hash router and delayed scroll handler.

Examples:
- `#satelliteIntel` → Satellite Intelligence
- `#satellite` → Satellite Intelligence
- `#danger` → Bangladesh hazard monitor
- `#towers` → Mobile tower monitoring
- `#monitor` → IGERS command center

The page also adds scroll-margin for the sticky header and bumps the service-worker cache to avoid stale navigation code.


---

## Original file: `IN_APP_LIVE_VISUAL_UPGRADE_2026-09-14.md`

# IGERS In-App Live Visual Upgrade — 2026-09-14

## Scope
This release keeps the existing IGERS application and its prior live systems while converting the newly added satellite/NASA experience to an in-app visual workflow.

## In-app behavior
- NASA GIBS Earth-observation imagery is rendered directly inside the IGERS page.
- Satellite observation can be expanded in an in-app modal; it does not navigate to NASA Worldview.
- NASA EONET regional event records are rendered inside the application and can be opened in an in-app detail modal.
- NASA Astronomy Picture of the Day is rendered in the application and can be enlarged in-app.
- Satellite/BMD navigation cards scroll to internal IGERS panels instead of opening external pages.
- Source-state indicators remain source-specific and do not claim spacecraft telemetry or uninterrupted live video.

## Regression checks
- Production static build: PASS
- JavaScript syntax checks: PASS
- Duplicate HTML IDs: 0
- Broken local asset references: 0
- Satellite section external navigation: 0
- NASA section external navigation: 0
- Core/legal/runtime HTTP routes: 200
- Existing Air Traffic / Earthquake / Airspace / Bangabandhu-1 markers: present
- ZIP integrity: to be recorded after packaging

## External-feed limitation
The local QA environment cannot guarantee third-party external-feed availability. The application therefore exposes explicit feed freshness/availability states instead of falsely marking unavailable data as LIVE.


---

## Original file: `INCognito-QA-REPORT.md`

# IGERS-BD-01 Incognito / PWA / 3D QA Report

Build: 2026.10.06-3d-pwa.1

## Passed
- HTML duplicate ID scan: 0 duplicates
- Local href/src reference scan: 0 missing local files
- Node JavaScript syntax check: PASS for all top-level JS files and service worker
- PWA manifest JSON: PASS
- PWA `start_url`: `/IGERS-POWERCORE/`
- PWA `scope`: `/IGERS-POWERCORE/`
- App package ZIP integrity: PASS
- App package contains 3D engine JS/CSS, PWA manifest/service worker, icons, and mobile tower controller
- Direct app package download link exists in the web UI
- 3D panel has rotate/reset/layer controls

## Browser limitation
The execution environment blocks local and external browser navigation with `ERR_BLOCKED_BY_ADMINISTRATOR`, so a truthful end-to-end Chromium Incognito page interaction run could not be completed here. The final package was therefore validated with source/parser/static HTTP/package checks instead of claiming a browser pass that was not observable.

Chrome's native `beforeinstallprompt` is conditional on installability criteria and browser/device state; it is not guaranteed in private/incognito mode. The app therefore keeps a direct same-origin `DOWNLOAD APP` ZIP fallback in addition to the native PWA install button.

## Expected behavior on GitHub Pages
Use:
https://raabdullah59720-igers.github.io/IGERS-POWERCORE/

For native PWA install, use the normal browser window on HTTPS. In Incognito/private mode, use the built-in `DOWNLOAD APP` fallback when the native install prompt is not offered.


---

## Original file: `LIVE-DATA-3D-FLOW-QA-2026-10-08.md`

# IGERS POWERCORE — Live Data / Live Feed / Result / 3D / Traffic Flow QA
Date: 2026-10-08

## Fix scope
Added an independent output center with four separately rendered panels:
1. Live Feed Panel — provider-by-provider incoming observations.
2. Live Result Panel — normalized result table independent of canvases.
3. 3D Visualization Panel — separate 3D-style live-data rendering layer.
4. Traffic Flow Panel — independent vehicle-flow visualization.

## Data bridges fixed
- Air Traffic 3D now dispatches `igers:airtraffic` with normalized current observations so the existing advanced air, border, and new live-output modules can consume the same feed.
- Vehicle Movement Monitor now dispatches `igers:vehicle-flow` after each observed/authorized refresh.
- National Toll Plaza already dispatches `igers:toll-traffic`; the new center consumes that event directly.
- Service-worker cache was bumped from v17 to v18 and includes the new live-output assets.

## Providers
- Air: Airplanes.live public ADS-B API (browser fetch).
- Seismic: USGS all-hour GeoJSON feed.
- Weather: Open-Meteo current forecast endpoint for Dhaka.
- Road traffic: public/authorized vehicle-count or toll/ITS endpoint only; no private CCTV bypass and no fabricated national live count.

## Regression checks
- Baseline IDs: 419
- New-build IDs: 443
- Removed baseline IDs: 0
- Added IDs: 24 (new live-output center only)
- Sections: 34 -> 35
- Duplicate IDs: 0
- Local HTML/CSS/JS references missing: 0
- Inline JS syntax blocks checked: 13, failures: 0
- New external JS syntax: PASS
- ZIP integrity (`zip -T`): PASS
- Local HTTP smoke check: index.html + new JS/CSS + sw.js returned HTTP 200

## Runtime limitation
A full Chromium page-run was attempted in the build sandbox, but the environment blocks local `http://127.0.0.1` and `file://` navigation with `ERR_BLOCKED_BY_ADMINISTRATOR`. Therefore browser click-through/runtime provider connectivity cannot be honestly certified from this sandbox. The package is statically validated and the live providers remain explicitly labeled by actual fetch status in the browser.


## Regression repair applied
- Fixed missing runtime script tags for `field-connectivity-hardening.js` and `vehicle-movement-monitor.js`. Their CSS had been loaded, but the JavaScript runtime modules were not attached to `index.html`.
- Dependency order is now: Field Link → Vehicle Movement → Toll Plaza → PWA → Air Traffic 3D → Live Data/3D/Flow Center, so event bridges can initialize before asynchronous providers return.
- Service worker cache version bumped to v18 to prevent GitHub Pages from retaining the pre-fix shell.


---

## Original file: `MAGAZINE-PANEL-RELEASE-2026-09-22.md`

# IGERS Magazine Panel

Added the Library copy of IGERS-BD-01 Professional Engineering Magazine as a new additive web-app panel.

- Existing panels preserved.
- Static relative PDF path for GitHub Pages.
- Embedded browser PDF reader with Open, Download and Fullscreen controls.
- Quick section links.
- Service worker cache updated for the magazine PDF.


---

## Original file: `NASA_CONNECTION_UPGRADE_2026-09-14.md`

# IGERS NASA Connection & Intelligence Upgrade — 2026-09-14

## Added
- NASA GIBS Earth-observation image layer with source-specific freshness state.
- Geostationary Himawari-9/AHI candidates (10-minute observation times) through NASA GIBS first, followed by NOAA-21, NOAA-20 and MODIS Terra fallback imagery.
- NASA Worldview deep link centered on the current browser location when available.
- NASA EONET v3 open natural-event metadata for a Bangladesh bounding box plus a global context count.
- NASA astronomy panel with local-location sky planning (solar state, sunrise/sunset, dark-sky window) and NASA Astronomy Picture of the Day.
- Explicit separation between satellite observation, forecast weather, disaster metadata, and astronomy media.
- Feed-specific LIVE/READY/WARN/OFFLINE states to avoid false global LIVE claims.

## Accuracy model
- Green NASA GIBS state means the selected NASA imagery request loaded successfully; it does not imply continuous satellite video or spacecraft control.
- EONET state means the EONET v3 feed returned current open-event metadata.
- APOD state means the NASA astronomy endpoint returned current astronomy media.
- The existing Open-Meteo weather panel remains the numerical forecast source.
- No private Bangabandhu-1 telemetry or government control access is claimed.

## QA
- `node --check nasa-intel.js`: PASS
- `npm run build`: PASS
- Duplicate HTML IDs: 0
- Missing local asset references: 0
- Local HTTP server: PASS
- `/`, `/privacy.html`, `/terms.html`, `/copyright.html`, `/nasa-intel.js`, `/dist/index.html`, `/dist/nasa-intel.js`: HTTP 200
- External NASA provider end-to-end fetch was not claimed in this sandbox because outbound networking is restricted; runtime logic is fail-safe and source-specific.


---

## Original file: `NEXTGEN_UPGRADE_2026-10-06.md`

# IGERS-BD-01 Next-Gen Engineering Simulation Upgrade — 2026-10-06

This additive upgrade preserves the existing application and adds an isolated Engineering Simulation Command Center.

## Added panels
- Conceptual 3D Model Gallery
- Automatic Calculation Panel (per model)
- System Architecture panel
- Fleet / scenario summary panel
- Local Simulation Control panel
- Time/Weather indicator repair layer from the 2026-10-03 package

## Conceptual 3D models
Road recovery, river-current hydrokinetic, regulator/low-head hydraulic, footstep micro-harvest, bridge/culvert node, regenerative rail, airport PV-first, hybrid PV+VAWT, and BESS.

## Engineering integrity
Outputs are marked conceptual/scenario/site-dependent. The simulator does not present a calculation as proof of field performance or construction readiness.

## Static deployment note
The administrative control is deliberately described as a local browser simulation control. GitHub Pages cannot provide server-side authentication.


---

## Original file: `OPS_UPGRADE_2026-09-14.md`

# IGERS-BD-01 — Integrated Operations Upgrade — 14 September 2026

## Added
- Integrated communications/operations layer for authorised Bangabandhu-1/BSCL backhaul workflows.
- Field-energy ledger for Road, Border, Naval, Bridge and Dam prototype harvesters.
- Maintenance/condition panel with explicit prototype status.
- Bangladesh road-intelligence map workspace with satellite/aerial and traffic-provider launch controls.
- Freshness-aware data-trust language: LIVE / STALE / SIMULATED / OFFLINE.

## Engineering honesty
Bangabandhu-1 is a communications satellite. This frontend does not claim direct satellite control, spacecraft telemetry, or exclusive access to a satellite link. A real operational deployment requires an authorised BSCL/service-provider gateway, secure backend ingestion, authentication, field-node telemetry and appropriate network licensing.

The prototype energy values in the dashboard are simulation values until signed field telemetry is connected.

The embedded Bangladesh map is a conventional basemap. Satellite imagery is not represented as inherently live. Dynamic traffic requires an authorised traffic-data provider; Google documents Traffic Layer availability in Bangladesh. Street-level imagery and live traffic remain provider-controlled services.

## Validation
- JavaScript syntax: PASS
- Production build: PASS
- Duplicate HTML IDs: 0
- Static HTTP smoke tests: PASS (/, privacy.html, terms.html, copyright.html, sw.js)
- Existing air traffic / earthquake / airspace-safety IDs preserved
- Existing weather/location paths preserved


---

## Original file: `PROJECT-DOCUMENTATION-COMPENDIUM.md`

# IGERS POWERCORE — Original Documentation Compendium

This compendium preserves the full text of all Markdown documents that were consolidated to keep the GitHub upload below the 100-file limit. The source filename and SHA-256 are recorded for every document. Original Markdown is placed in fenced blocks so that its headings, links, code samples, and formatting are preserved as source text.

## Document index

- [ADMIN-MODULE-CONTROL-QA-2026-10-06.md](#doc-admin-module-control-qa-2026-10-06-md)
- [ADVANCED-LIVE-SUITE-README.md](#doc-advanced-live-suite-readme-md)
- [AIRSPACE-EARLY-WARNING-ADMIN-HARDENING-2026-10-06.md](#doc-airspace-early-warning-admin-hardening-2026-10-06-md)
- [AIRSPACE-EARLY-WARNING-README.md](#doc-airspace-early-warning-readme-md)
- [AUDIT_2026-09-13-COMMENTS-CARE.md](#doc-audit-2026-09-13-comments-care-md)
- [AUDIT_FINAL_2026-09-13.md](#doc-audit-final-2026-09-13-md)
- [BANGLADESH-AIR-TRAFFIC-3D-PRO-QA-2026-10-08.md](#doc-bangladesh-air-traffic-3d-pro-qa-2026-10-08-md)
- [BANGLADESH-AIR-TRAFFIC-3D-QA-2026-10-08.md](#doc-bangladesh-air-traffic-3d-qa-2026-10-08-md)
- [BD-SATELLITE-MONITOR-README.md](#doc-bd-satellite-monitor-readme-md)
- [BORDER-COMMAND-MONITOR-2026-10-05.md](#doc-border-command-monitor-2026-10-05-md)
- [BORDER-MONITOR-QA-2026-10-06.md](#doc-border-monitor-qa-2026-10-06-md)
- [BORDER-MONITOR-README.md](#doc-border-monitor-readme-md)
- [BORDER-ZONE-3D-MONITOR-RELEASE-2026-10-05.md](#doc-border-zone-3d-monitor-release-2026-10-05-md)
- [BUGFIX-REPORT-2026-10-03-FULL.md](#doc-bugfix-report-2026-10-03-full-md)
- [BUGFIX-REPORT-2026-10-09-02.md](#doc-bugfix-report-2026-10-09-02-md)
- [DEPLOY_DIRECT.md](#doc-deploy-direct-md)
- [DEPLOY_VERCEL_NOW.md](#doc-deploy-vercel-now-md)
- [ENERGY-TIME-WEATHER-COMBINED-UPDATE-INSTALL.md](#doc-energy-time-weather-combined-update-install-md)
- [FINAL-AIR-TRAFFIC-QA-2026-10-08.md](#doc-final-air-traffic-qa-2026-10-08-md)
- [FINAL-QA-REPORT-2026-10-06.md](#doc-final-qa-report-2026-10-06-md)
- [GITHUB-FINAL-CHECK-2026-09-22.md](#doc-github-final-check-2026-09-22-md)
- [GITHUB-PAGES-DEPLOYMENT-README.md](#doc-github-pages-deployment-readme-md)
- [GITHUB-PAGES-DIRECT-DEPLOY.md](#doc-github-pages-direct-deploy-md)
- [GITHUB-PAGES-FIXED-SETUP.md](#doc-github-pages-fixed-setup-md)
- [GITHUB-PAGES-PRODUCTION-DEPLOY.md](#doc-github-pages-production-deploy-md)
- [GITHUB-PAGES-README.md](#doc-github-pages-readme-md)
- [HASH-LINK-FIX.md](#doc-hash-link-fix-md)
- [INCognito-QA-REPORT.md](#doc-incognito-qa-report-md)
- [IN_APP_LIVE_VISUAL_UPGRADE_2026-09-14.md](#doc-in-app-live-visual-upgrade-2026-09-14-md)
- [LIVE-DATA-3D-FLOW-QA-2026-10-08.md](#doc-live-data-3d-flow-qa-2026-10-08-md)
- [MAGAZINE-PANEL-RELEASE-2026-09-22.md](#doc-magazine-panel-release-2026-09-22-md)
- [NASA_CONNECTION_UPGRADE_2026-09-14.md](#doc-nasa-connection-upgrade-2026-09-14-md)
- [NEXTGEN_UPGRADE_2026-10-06.md](#doc-nextgen-upgrade-2026-10-06-md)
- [OPS_UPGRADE_2026-09-14.md](#doc-ops-upgrade-2026-09-14-md)
- [PANEL-DATA-RELIABILITY-PATCH-2026-10-09.md](#doc-panel-data-reliability-patch-2026-10-09-md)
- [PWA-DANGER-FIX-INSTALL.md](#doc-pwa-danger-fix-install-md)
- [QA-BORDER-COMMAND-CALC-2026-10-05.md](#doc-qa-border-command-calc-2026-10-05-md)
- [QA-BORDER-MAP-CONTROL-FINAL-2026-10-05.md](#doc-qa-border-map-control-final-2026-10-05-md)
- [QA-BORDER-MAP-CONTROL-FIX-2026-10-05.md](#doc-qa-border-map-control-fix-2026-10-05-md)
- [QA-FINAL-DEEP-INTEGRATION-2026-09-14.md](#doc-qa-final-deep-integration-2026-09-14-md)
- [QA-RELEASE-VERIFICATION-2026-09-14.md](#doc-qa-release-verification-2026-09-14-md)
- [QA-REPORT-2026-10-06.md](#doc-qa-report-2026-10-06-md)
- [QA-REPORT-NEXTGEN-2026-10-06.md](#doc-qa-report-nextgen-2026-10-06-md)
- [QA-REPORT.md](#doc-qa-report-md)
- [README-INSTALL.md](#doc-readme-install-md)
- [README.md](#doc-readme-md)
- [README.old.md](#doc-readme-old-md)
- [README_BUGFIX_2026-09-13.md](#doc-readme-bugfix-2026-09-13-md)
- [REGRESSION-QA-2026-10-08.md](#doc-regression-qa-2026-10-08-md)
- [RUNTIME-QA-2026-10-06.md](#doc-runtime-qa-2026-10-06-md)
- [SATELLITE_MODULE_AUDIT_2026-09-13.md](#doc-satellite-module-audit-2026-09-13-md)
- [SATELLITE_WEATHER_RESTORE_2026-09-14.md](#doc-satellite-weather-restore-2026-09-14-md)
- [TOLL-NATIONAL-QA-2026-10-08.md](#doc-toll-national-qa-2026-10-08-md)
- [UI-VISUAL-DATA-UPGRADE-2026-10-06.md](#doc-ui-visual-data-upgrade-2026-10-06-md)
- [UPGRADE-ONLY-RELEASE-2026-09-22.md](#doc-upgrade-only-release-2026-09-22-md)
- [UPGRADE-REPORT-2026-10-03.md](#doc-upgrade-report-2026-10-03-md)
- [UPGRADE-REPORT-2026-10-05-DEEP-3D-LIVE-BORDER.md](#doc-upgrade-report-2026-10-05-deep-3d-live-border-md)
- [UPGRADE-REPORT-2026-10-05-DEEP-3D-LIVE.md](#doc-upgrade-report-2026-10-05-deep-3d-live-md)
- [UPGRADE_AUDIT_2026-09-14.md](#doc-upgrade-audit-2026-09-14-md)
- [UPGRADE_NOTES_2026-09-13.md](#doc-upgrade-notes-2026-09-13-md)
- [UPGRADE_PRO_RELEASE_2026-09-22.md](#doc-upgrade-pro-release-2026-09-22-md)
- [VOICEMAIL-FULL-APP-AUDIT-2026-09-15.md](#doc-voicemail-full-app-audit-2026-09-15-md)
- [WEATHER-3D-DIGITAL-UPGRADE-2026-10-06.md](#doc-weather-3d-digital-upgrade-2026-10-06-md)

---

<a id="doc-admin-module-control-qa-2026-10-06-md"></a>
## Original file: `ADMIN-MODULE-CONTROL-QA-2026-10-06.md`

SHA-256: `ff84b53b4d5b07082140485e41b0c192410d7b59047266441c3a9c754669d4b7`

````markdown
# IGERS POWERCORE — ADMIN MODULE CONTROL QA — 2026-10-06

## Added
- Administrator-gated software module controls inside the Air/Ground/Maritime early-warning panel.
- Local ON/OFF controls for Radar Scan, ADS-B feed, Satellite View, and Alert Engine.
- Coverage visualization control, alert test, acknowledge, reset, and local-state dispose/clear.
- 15-minute administrator inactivity auto-lock retained.
- Service-worker cache bumped to v10.

## Safety boundary
These controls operate only the browser-side monitoring/visualization/data-state modules. They do not control weapons, interceptors, target assignment, fire-control, jamming, or remote military infrastructure. “Dispose local monitor state” clears browser-local state only.

## QA
- Inline JavaScript blocks: 13
- Inline JS syntax errors: 0
- Duplicate HTML IDs: 0
- Required admin/module-control IDs: present
- Existing panel files: preserved; upgrade is additive to index.html plus service-worker cache version.
````

---

<a id="doc-advanced-live-suite-readme-md"></a>
## Original file: `ADVANCED-LIVE-SUITE-README.md`

SHA-256: `ddc595642816b6981604762b59133401e1404cf082b872162467ab41316a3920`

````markdown
# IGERS POWERCORE — Advanced Live 3D Monitoring Suite

This package is an additive upgrade to the existing IGERS POWERCORE web app. Existing sections are preserved.

## Added independent panels

1. **3D Air Traffic Monitor** — uses the existing Airplanes.live public ADS-B feed bridge and adds a 3D globe with flight-detail cards.
2. **Google 3D Map Layer** — optional, user-supplied Google Maps JavaScript API key; no key is bundled.
3. **Universal Seismic / Plate Reference Monitor** — USGS global all-hour earthquake feed + PB2002 plate-boundary reference model; browser alert threshold is configurable.
4. **3D Coastal / Marine Monitor** — public Open-Meteo marine model for selected Bangladesh coastal points, including sea level, waves, SST and ocean currents.
5. **IGERS-BD-01 3D Concept Lab** — scenario calculator for kinetic, hydraulic, solar and battery calculations.
6. **3D Mobile-Tower Resilience Mesh** — simulation-only network-node dashboard. It does not operate real telecom, satellite or defence equipment.
7. **3D Salah / Qibla** — browser location, AlAdhan prayer-time service and geometric Qibla bearing; local browser alerts.
8. **Emergency Center** — local administrator message, evacuation-direction cue and notification test. No remote emergency broadcast is implemented.

## Public sources used

- Airplanes.live API: https://airplanes.live/api-docs/
- USGS earthquake feeds: https://earthquake.usgs.gov/earthquakes/feed/v1.0/
- PB2002 tectonic boundary reference: https://github.com/fraxen/tectonicplates
- Open-Meteo Marine API: https://open-meteo.com/en/docs/marine-weather-api
- Google Maps 3D documentation: https://developers.google.com/maps/documentation/javascript/3d/get-started
- AlAdhan Prayer Times API: https://aladhan.com/prayer-times-api
- AlAdhan Qibla API: https://aladhan.com/qibla-api
- EMSC / SeismicPortal reference: https://www.seismicportal.eu/fdsn-wsevent.html

## Important data limitations

- `LIVE` means the browser reached the public provider and received data.
- `VERIFY` means the module is ready but provider data is not presently verified.
- `OFFLINE` means the request failed; the UI does not fabricate values.
- USGS/EMSC event feeds are not official earthquake early-warning signals.
- Open-Meteo states that coastal sea-level/current model accuracy is limited and is not suitable for coastal navigation.
- ADS-B is not primary radar and cannot guarantee complete aircraft visibility.
- Google 3D requires an authorized API key and the required Google Maps API configuration.
- All calculation outputs in the IGERS concept lab are scenario estimates until replaced by measured field data.

## Static web deployment

Upload all files in this package together to the same GitHub Pages directory. The application remains client-side except for direct browser calls to the named public providers.
````

---

<a id="doc-airspace-early-warning-admin-hardening-2026-10-06-md"></a>
## Original file: `AIRSPACE-EARLY-WARNING-ADMIN-HARDENING-2026-10-06.md`

SHA-256: `7dddd9225d5f49a139dbf433f77b5fb71c64876eae7bec08bb149dc9caf43165`

````markdown
# IGERS POWERCORE — Air/Ground/Maritime Early-Warning Admin Hardening

## What changed
- Added a dedicated administrator unlock directly inside the 3D Air/Ground/Maritime early-warning panel.
- Protected coverage-visualization, local alert-test, acknowledgement and reset controls.
- Reuses the existing IGERS administrator verifier/session so existing administrator workflows are not replaced.
- Added a local `Lock controls` action and 15-minute inactivity auto-lock for this panel.
- Kept public/authorized data feeds read-only.
- No weapon deployment, target assignment, fire-control, interceptor launch, jamming, or automatic use-of-force controls are included.
- Bumped service-worker cache from v8 to v9 for GitHub Pages deployment refresh.

## Security limitation
This project is a static GitHub Pages frontend. A browser-side password gate can restrict UI controls, but it is not production-grade authentication because the page source is delivered to the browser. A real secure deployment should move authentication and sensitive data access to a server-side identity provider/backend and never embed secrets in client JavaScript.

## Existing-feature policy
This upgrade is additive. Existing weather, time, energy, air traffic, seismic, marine, Salah/Qibla, analytics, border monitoring, satellite/imagery and other panels remain in the package.
````

---

<a id="doc-airspace-early-warning-readme-md"></a>
## Original file: `AIRSPACE-EARLY-WARNING-README.md`

SHA-256: `f5ae916fea56e52712cde4098dde3daeb0948a2c68eb3f14ab12e1e299939745`

````markdown
# IGERS POWERCORE — 3D Bangladesh Air / Ground / Maritime Early-Warning Panel

Additive module for the existing IGERS POWERCORE GitHub Pages app.

## Data layers
- NASA Worldview / GIBS: public Earth-observation imagery viewer.
- Airplanes.live: public ADS-B aircraft positions via the documented `/v2/point/{lat}/{lon}/{radius}` endpoint.
- Bangladesh ADM0 fallback geometry: existing local GeoJSON bundled with the app.

## Administrator access
The new configuration controls reuse the existing IGERS Administrator Gate/session. The panel does not expose or duplicate a password in this module.

## Safety / scope
This is a read-only early-warning and visualization layer. Coverage rings are generic visualization controls only. The module does not implement weapon deployment, interceptor launch, target assignment, fire-control, jamming, or automatic use of force.

## Public-source limitations
Public satellite imagery and public ADS-B data are not equivalent to military radar, military satellite telemetry, or a government command network. The UI therefore reports LIVE/VERIFY/OFFLINE honestly and does not fabricate sensor values.
````

---

<a id="doc-audit-2026-09-13-comments-care-md"></a>
## Original file: `AUDIT_2026-09-13-COMMENTS-CARE.md`

SHA-256: `5572850a759e8359a2f36c6c3bea33f3e7250a5cc4028e9f6e14d068939a4778`

````markdown
IGERS-BD-01 — Comments / Customer Care Developer Demo Audit
Date: 13 September 2026

Upgrade scope:
- Added a premium, isolated visual layer for the Comments / Customer Care developer-demo module.
- Visitor inputs remain limited to Email Address + Comment / Customer Care Message.
- No name, phone number, location, account or extra profile fields are collected by this module.
- Data remains local to the browser via localStorage; no email/API/remote submission is implemented.
- Existing weather, live time, environment, earthquake notification, air-traffic, legal pages and other site systems were not modified by the feedback UI upgrade.

Validation performed:
- JavaScript syntax checks: PASS
- Duplicate HTML id check: PASS
- Local asset/reference check: PASS
- Local HTTP smoke tests for main page, legal pages, service worker, live enhancer, icons and major image assets: PASS
- Responsive CSS includes mobile breakpoints and prefers-reduced-motion handling.

Note:
The project includes legacy React/Vite source files that are not referenced by the static website entry point. This audit intentionally leaves that legacy source untouched to avoid altering the existing deployed runtime.
````

---

<a id="doc-audit-final-2026-09-13-md"></a>
## Original file: `AUDIT_FINAL_2026-09-13.md`

SHA-256: `4906cd43f39912aa5268224da68baa55fc62dfced551bf993685e289c20284a5`

````markdown
IGERS-BD-01 — FINAL HIGH-EFFICIENCY RUNTIME / BUILD AUDIT
Date: 2026-09-13

Base: IGERS-POWERCORE-WEATHER-COMMENTS-CARE-NPM-BUILD-VERIFIED-2026-09-13.zip

TESTS PASSED
1. ZIP extraction: PASS
2. npm run build: PASS (offline-safe production fallback generated dist/)
3. Built output HTTP smoke test: PASS
   /, /privacy.html, /terms.html, /copyright.html, core JS/CSS/assets -> HTTP 200
4. Node syntax validation: PASS for build.mjs, server.mjs, upgrade.js, script.js, sw.js
5. HTML ID uniqueness: PASS (85 IDs, 85 unique)
6. Local asset reference audit: PASS for index.html, privacy.html, terms.html, copyright.html
7. Comments/Customer Care feature presence: PASS
8. Feedback storage isolation: PASS; uses localStorage key igersDeveloperFeedbackV1
9. Feedback remote submission check: PASS; no feedback fetch/remote submission code detected
10. Local server test: PASS using PORT=4187; main/legal/feedback stylesheet returned 200
11. ZIP integrity after rebuild: PASS

KNOWN ENVIRONMENT LIMITATION
A fresh npm install could not complete in this execution environment because registry access timed out. The project therefore uses its existing offline-safe build.mjs fallback when node_modules/Vite is unavailable. The package's static-first deployment works without installed dependencies.

NO-REGRESSION INTENT
The new Comments / Customer Care UI is isolated to its own feedback section and CSS layer. Existing weather, live time, earthquake notification, air-traffic, legal pages, and other site systems were not intentionally modified by this upgrade.
````

---

<a id="doc-bangladesh-air-traffic-3d-pro-qa-2026-10-08-md"></a>
## Original file: `BANGLADESH-AIR-TRAFFIC-3D-PRO-QA-2026-10-08.md`

SHA-256: `e904bb9fa7024c2e0c9f398c58cc4b73fe816b2445e48200eee3fe05ee3c4c31`

````markdown
# Bangladesh Air Traffic 3D Professional QA

Date: 2026-10-08

- Bangladesh-footprint-only live rendering preserved.
- Live provider health indicators added for authorized relay, Airplanes.live and OpenSky.
- Last-update time, request latency, received/accepted/filtered counts added.
- Target observation age shown in the live list and selected-flight detail.
- Canvas resize/reallocation fixed: dimensions update only when container size or DPR changes, avoiding per-frame canvas resets.
- No synthetic aircraft positions are generated.
- Service Worker cache bumped to v20 to avoid stale GitHub Pages shell/assets.
````

---

<a id="doc-bangladesh-air-traffic-3d-qa-2026-10-08-md"></a>
## Original file: `BANGLADESH-AIR-TRAFFIC-3D-QA-2026-10-08.md`

SHA-256: `17a33bfe250a7d3ab4f8ec1cd4362b46055dd288e2081368ac84765ea9e2c6d0`

````markdown
# IGERS-BD-01 — Bangladesh Air Traffic 3D Radar Fix QA
Date: 2026-10-08

## Scope
- `airTraffic3D` is now a Bangladesh-footprint-only live ADS-B/MLAT visualization layer.
- Aircraft are geographically filtered before rendering; positions outside the Bangladesh footprint are not drawn in this panel.
- The panel includes a continuous radar sweep, Bangladesh outline, altitude extrusion, short trails, target list, selected-flight detail, and directional flow counters (N/E/S/W).
- The existing broader `airtraffic` panel is preserved unchanged.

## Data behavior
- Preferred live source: authorized relay from Field Link when configured.
- Public fallback: Airplanes.live point query centered on Dhaka.
- Secondary fallback: OpenSky state vectors over the Bangladesh-region bounding box.
- Source data are filtered to the Bangladesh footprint before state merge/render.
- No synthetic aircraft positions are generated.
- `LIVE`, `VERIFY`, and `OFFLINE` states remain explicit.

## Static QA
- 35 sections
- 451 unique IDs
- Duplicate IDs: 0
- Missing local references: 0
- JavaScript syntax checks: PASS for all project JS files checked
- Service worker cache: `igers-powercore-v19`
- ZIP integrity: PASS

## Connectivity caveat
The build environment could not resolve the public API hostnames during direct curl testing (`api.airplanes.live`, `opensky-network.org`). This is an environment/network limitation and is not evidence that the browser user will be offline. The app therefore keeps provider failure states explicit instead of fabricating live data.

## Interpretation
“Bangladesh air traffic” in this panel means aircraft whose current tracked position falls inside the Bangladesh geographic footprint. It does not mean only Bangladesh-registered airlines or aircraft.
````

---

<a id="doc-bd-satellite-monitor-readme-md"></a>
## Original file: `BD-SATELLITE-MONITOR-README.md`

SHA-256: `dfd88aec1b63a6dc9ab9215ad2fbaf7104a2cc095c89bf51fb86d7c09e493b4e`

````markdown
# IGERS-BD-01 Bangladesh Satellite Monitor

Additive monitor panel. Existing app modules are preserved.

## Live/public data sources
- NASA GIBS / Worldview: public Earth-observation imagery.
- USGS Earthquakes GeoJSON: recent seismic events.
- GDACS API: public multi-hazard alerts.
- Existing IGERS ADS-B panel: public aircraft-feed state.
- OpenStreetMap: Bangladesh basemap iframe.

## Safety boundary
The danger/threat indicator is a public-data hazard/anomaly indicator only. It does not identify hostile actors, generate targeting information, or control real-world sensors.

## GitHub Pages
All files are root-relative/relative and the build contains no CNAME file. Keep the GitHub Pages source on GitHub Actions.
````

---

<a id="doc-border-command-monitor-2026-10-05-md"></a>
## Original file: `BORDER-COMMAND-MONITOR-2026-10-05.md`

SHA-256: `eaa22e9b6cf9f9566fc93ea3b3414fa8b15e1ebee994860391822edb23b365a4`

````markdown
# IGERS Border Zone Command Monitor — 2026-10-05

This additive module provides a command-style visual interface using public data only:
- Airplanes.live public ADS-B/MLAT-derived feed for aircraft counts and current positions.
- NASA GIBS / Himawari-9 AHI Band 13 clean-infrared Earth-observation imagery.
- A public-data aircraft flow heuristic: inbound, in-airspace, passing, outbound, based on current position and a 5-minute forward projection.
- Existing Airplanes.live map iframe remains intact.
- Existing simulated tower layer remains clearly labeled as simulated / authorized-feed-ready; no private telecom or restricted border sensor access is added.

The interface is styled like a professional command/HUD console but does not claim military affiliation or access to military-only sensors.

Calculation audit scope:
- Road kinetic recovery: ΔKE = 1/2 m(v1²-v2²), converted from km/h to m/s; efficiency applied after gross loss; annual aggregation uses explicit locations × vehicles/year/location.
- Water recovery: P = ρgQHη; flow is converted L/s → m³/s; annual energy uses hours/day × 365 × sites.
- Footstep recovery: E = Fδ; stroke converted mm → m; efficiency applied; annual energy uses steps/day × pads × 365.
- Fixed Professional Upgrade energy model so zero installed units correctly produce zero output instead of silently forcing one unit.
````

---

<a id="doc-border-monitor-qa-2026-10-06-md"></a>
## Original file: `BORDER-MONITOR-QA-2026-10-06.md`

SHA-256: `71aae07a1d9594e18f7aa0b9827ea1caef35a6da190fdbd1dd1b7888cae61f7c`

````markdown
# IGERS POWERCORE — Border Monitor QA — 2026-10-06 (Final)

## Integration
- Baseline preserved: `IGERS-POWERCORE-ADVANCED-LIVE-3D-MONITORING-UPGRADE-2026-10-06.zip`.
- Existing application structure/features preserved.
- Border module remains a separate `#borderMonitor` section with dedicated CSS/JS and bundled Bangladesh fallback GeoJSON.
- Added an independent read-only Airplanes.live refresh path so the Border panel does not depend on another panel's event payload.

## Static QA
- All standalone JavaScript files: PASS (`node --check`).
- Inline JavaScript blocks: PASS.
- Duplicate HTML IDs: NONE.
- Missing local script/style/image/iframe references: NONE.
- All Border JS DOM references exist in HTML: PASS.
- Border navigation link exists: PASS.
- Dedicated Border 3D canvas exists: PASS.
- Dedicated Border radar-style scanner canvas exists: PASS.
- Radar scanner render path initializes without JavaScript errors: PASS.
- Dedicated alert buttons and mesh indicator exist: PASS.
- Salah / Qibla panel renders a non-empty prayer grid in offline/local-fallback mode: PASS.
- Qibla bearing calculation populated in runtime smoke test: PASS.
- Site-wide 3D depth stylesheet loads as a separate additive asset: PASS.
- Bundled Bangladesh GeoJSON parses as a valid FeatureCollection: PASS.
- Service-worker cache version remains v5.

## Module runtime-path test
A Node VM mock-DOM/canvas test was used to execute the Border module's initialization/rendering path without requiring a browser GUI. The exported renderer was invoked successfully and initialized the canvas to 800x540 in the mock layout.

The module's fallback-boundary and public-feed paths are guarded with explicit VERIFY/FALLBACK/OFFLINE states; no provider values are fabricated when external services are unreachable.

## Browser execution limitation
The execution environment blocks navigation to local HTTP/file/data pages with `ERR_BLOCKED_BY_ADMINISTRATOR`, so a full graphical browser interaction test cannot be certified from this environment. This is an execution-environment restriction and not a detected application JavaScript error.

## Live-provider limitation
Direct container HTTP calls to geoBoundaries and Airplanes.live returned HTTP 000 because outbound network access is restricted in this execution environment. The production browser must therefore determine LIVE/VERIFY/OFFLINE from actual provider reachability.

## Design boundary
- Bangladesh geography: public geoBoundaries ADM0 dataset with bundled fallback.
- Aircraft layer: public ADS-B/aircraft feed, read-only.
- Network mesh: explicitly virtual/illustrative until an authorized telemetry API is provided.
- The panel does not provide protected military radar access, weapon control, targeting, jamming, interception, or automated engagement.
- Unknown/unverified public track status is not a hostile-activity determination.


## Final module smoke test
- Node VM mock-DOM/canvas execution: ERROR_COUNT=0.
- Salah grid populated: Fajr, Dhuhr, Asr, Maghrib, Isha.
- Qibla populated: 278° W for the Dhaka fallback coordinates.
- Border public ADS-B bridge path: LIVE in mock provider.
- Border track count: 2 in mock provider.
- Border scanner status: LIVE · ADS-B scanner in mock provider.
````

---

<a id="doc-border-monitor-readme-md"></a>
## Original file: `BORDER-MONITOR-README.md`

SHA-256: `76f9d5095733b28d6aad40bcea15a4560df98c736dcd12168c58660a18f4e515`

````markdown
# IGERS POWERCORE — Bangladesh Border Defensive Monitor

Additive module for the existing IGERS web app. The module provides a 3D Bangladesh ADM0 geographic view, public/authorized data status indicators, a read-only public ADS-B bridge, and an illustrative virtual border-network mesh.

## Geography
Primary boundary source: geoBoundaries `gbOpen` Bangladesh ADM0. The app attempts to load the current public geoBoundaries simplified GeoJSON in the browser. A bundled local fallback is included for offline continuity.

Boundary metadata: https://www.geoboundaries.org/api/current/gbOpen/BGD/ADM0/
Primary GeoJSON source referenced by the module: https://github.com/wmgeolab/geoBoundaries/raw/9469f09592ced973a3448cf66b6100b741b64c0d/releaseData/gbOpen/BGD/ADM0/geoBoundaries-BGD-ADM0_simplified.geojson

## Live data boundary
The panel can consume the existing IGERS Airplanes.live public ADS-B bridge already used by the app. It does not provide primary radar or military radar access.

## Network representation
The border gateway nodes are explicitly virtual/illustrative. They are not real mobile-operator tower locations and do not claim access to Grameenphone, Robi, Banglalink, Teletalk, BTRC, BGB, Bangladesh Armed Forces, or other protected networks.

## Safety
The panel is read-only and defensive. It provides detection/verification/status visualization and alerts only. It does not perform weapon control, automated engagement, jamming, interception, targeting, or tactical command.


## Dedicated Radar-Style Scanner
The Border panel now contains a separate scanner card with its own 3D-style sweep canvas, track counters, feed-age indicator and read-only public ADS-B track list. It is a radar-style visualization, not a military/primary radar feed.

## Salah / Qibla reliability
The Salah panel now renders a local solar-angle fallback immediately and then replaces it with the public AlAdhan result when reachable. This prevents a blank prayer grid when the external service is unavailable. AlAdhan documents the daily timings endpoints and calculation methods; the panel defaults to the Karachi/South-Asia reference method and clearly labels fallback mode when needed.

## Site-wide 3D presentation
A lightweight `global-3d.css` layer adds subtle perspective/depth, lighting and elevation effects to existing cards and visual containers without changing the existing information architecture or removing earlier features.
````

---

<a id="doc-border-zone-3d-monitor-release-2026-10-05-md"></a>
## Original file: `BORDER-ZONE-3D-MONITOR-RELEASE-2026-10-05.md`

SHA-256: `bdc12dadcaf7be4d4e6699d5308b835a0e8d0f8dbf46d10bd49a8dc95ffe5742`

````markdown
# IGERS Border Zone 3D Monitor — Release Notes

Date: 5 October 2026

## Additive scope

This module was added to the supplied `IGERS-POWERCORE-main (8).zip` baseline without removing or replacing the existing Energy, Water/Foodstep, Weather/Location, Air Traffic, Airspace Safety, Satellite Connection, Future Upgrade or 3D operations modules.

### New panel

- `BORDER ZONE 3D GROUND + AIR MONITOR`
- Separate Ground / Air / Satellite layer controls
- Animated 3D-style radar visualization rendered with `requestAnimationFrame()`
- Public ADS-B-derived air states reused from the existing IGERS feed when available
- Non-identifying aggregate/demo mobile-signal coverage visualization
- Public NASA GIBS Himawari AHI Band-13 clean-infrared Earth-observation image layer with fallback look-back attempts
- Satellite observation freshness / provider state indicators
- Responsive desktop/tablet/mobile layout

## Data and safety semantics

The panel does not claim access to military radar, border-security sensors, telecom operator private data or individual mobile-device locations. The network layer is deliberately aggregate/demo unless an authorized operator feed is integrated later.

NASA GIBS documentation exposes public WMS imagery through the EPSG:4326 endpoint, which is used by the satellite observation layer. CelesTrak public orbital-element refresh guidance is respected by the existing satellite connection module; the new panel does not create an extra high-frequency CelesTrak polling loop.

## Validation performed for this release

- All JavaScript source files: `node --check` PASS.
- HTML duplicate-ID audit: PASS.
- Local CSS/JS reference audit: PASS.
- Offline/static production build via the repository's `build.mjs`: PASS.
- Local HTTP smoke test: PASS (`http://127.0.0.1:4173/`).
- Final ZIP extraction/integrity: PASS.

## Browser/live-feed limitation

The execution environment used for this build cannot directly resolve external public data hosts, so NASA GIBS/CelesTrak/ADS-B live connectivity cannot be truthfully certified from this sandbox. The module therefore reports provider success/failure from the user's browser rather than pretending a feed is live.
````

---

<a id="doc-bugfix-report-2026-10-03-full-md"></a>
## Original file: `BUGFIX-REPORT-2026-10-03-FULL.md`

SHA-256: `463e640db2b339255542837152e30f73e856a8eb799f718dd3532738553a1e9e`

````markdown
# IGERS-BD-01 — Full Runtime Bug-Fix / QA Pass
Date: 03 October 2026

## Fixed
- Restored and hardened the Live Time engine: Bangladesh, browser-local, and world time remain independent and update every second.
- Restored the missing unified System Master Control panel with responsive status cards and admin-gated ALL SYSTEMS ON/OFF controls.
- Kept existing Future Upgrade Control Center and machine controls; unified controls synchronize with their persistent local states.
- Fixed missing environment helper functions (`setWidth`, `degToCompass`) that could interrupt environmental status updates.
- Hardened weather runtime: Dhaka fallback remains available; browser geolocation can update the weather target; weather retries automatically; failure is displayed as an explicit unavailable state rather than leaving the panel ambiguous.
- Preserved satellite element-age and air-traffic data-age displays.
- Preserved simulation/live/unavailable distinctions; no physical hardware control is implied.

## Verification
- `node --check script.js` — PASS
- `node --check igers-future-upgrade.js` — PASS
- `node --check server.mjs` — PASS
- `npm run build` — PASS
- Duplicate HTML IDs — 0 found
- Local asset references in index — previously audited; current root remains self-contained
- Local HTTP smoke test — PASS (`/`, future JS/CSS, `/dist/index.html` returned 200)
- External Open-Meteo connectivity from this execution environment — DNS unavailable, therefore live weather data itself was not claimed as network-verified here.

## Security note
The admin password is frontend/static prototype authentication. GitHub Pages cannot securely protect a secret embedded in client-side JavaScript. Production machine control requires an authenticated backend and authorized hardware controller.
````

---

<a id="doc-bugfix-report-2026-10-09-02-md"></a>
## Original file: `BUGFIX-REPORT-2026-10-09-02.md`

SHA-256: `02055ea9f02f34957512235d23fc09f9927ad09caa24df6490d44dd80e87475e`

````markdown
# IGERS POWERCORE — focused bug-fix report (2026-10-09)

## Fixed in this package
- Added the missing `bdmNetLive` HTML target so the existing browser-network status updater can display its state.
- Changed border monitor feed freshness logic to use the provider retrieval timestamp and ADS-B position age; cached data is no longer labelled `NOW` just because a refresh handler ran.
- Added a retrieval timestamp to the border monitor's direct public-provider fallback.
- Changed NASA GIBS date fallback to try explicit recent dates rather than the ambiguous `default` time value, advances promptly when every tile fails, and allows more time for slower tile responses.

## Validation limits
- Static checks can verify syntax, archive integrity, expected IDs and local asset paths.
- A live Chromium visual/runtime session was blocked in the available environment, so public providers, NASA tiles, GitHub Pages deployment, and all remote feeds cannot be certified as live from this package build alone.
- ADS-B is public flight-state data, not border radar or mobile-tower telemetry. Virtual nodes and radar-style sweeps remain simulations.
````

---

<a id="doc-deploy-direct-md"></a>
## Original file: `DEPLOY_DIRECT.md`

SHA-256: `c9811403dcbbff441c5b718014ac5185171c2caaf1c69ac9e78b99a99d005bc8`

````markdown
# IGERS POWERCORE — Direct Deployment Package

Version: 1.1.0-designer  
Project: IGERS-BD-01 — Integrated Gradient-Based Energy Recovery & Storage System  
Organization concept: IGERS POWERCORE TECHNOLOGIES LTD.  
Author / Inventor: Abdullah Al Rafi [BD]

## What is included
This package keeps the latest verified IGERS interface as the functional base and adds a non-destructive designer layer. Existing monitoring and information modules are retained, including:

- energy recovery concept architecture and deployment views
- live time and weather panels
- environmental / earthquake indicators
- live air-traffic panel
- Bangladesh Airspace Anomaly Monitor
- satellite connection/orbital public-data monitor
- NASA GIBS near-real-time imagery panel
- NASA POWER atmospheric panel
- satellite/disaster/navigation information layer
- comments & customer-care demo interface
- copyright, privacy and terms/disclaimer pages
- Bangladesh flag visual treatment and responsive mobile navigation

## Local run

```bash
npm run build
npm run serve
```

Then open `http://127.0.0.1:4173/`.

## Static hosting
The production output is written to `dist/`. Upload the **contents of `dist/`** to a static hosting service. No GitHub repository is required for the static files themselves.

Connect the custom domain `the custom domain` at the hosting provider using that provider's DNS instructions.

## Important data note
The dashboard uses public external data services. A live indicator means the browser reached the relevant public feed; it is not a guarantee that every upstream service is continuously available.

The NASA Worldview panel is represented through the public NASA GIBS data layer and official source links. The site does not claim restricted spacecraft telemetry or military system access.

The visitor comments interface in this static package is local browser demo storage; it does not send messages to a remote inbox.
````

---

<a id="doc-deploy-vercel-now-md"></a>
## Original file: `DEPLOY_VERCEL_NOW.md`

SHA-256: `df5d8e96901bc8800b6dbcf41cb0d2b157e7c08d41a75109129328e52bd1d5a6`

````markdown
# IGERS POWERCORE — GitHub-free Vercel deployment

The project is prepared for Vercel without a GitHub repository.

## Deploy with Vercel CLI

1. Install Node.js LTS.
2. In this project folder run:

```bash
npm install
npx vercel login
npx vercel --prod
```

Vercel will build with `npm run build` and publish `dist/`.

## Custom domain

After deployment, add:

`the custom domain`

in Vercel → Project → Settings → Domains.

Use the DNS records Vercel shows for the domain registrar. HTTPS/SSL is then handled by Vercel.

## Important

No GitHub repository is required for this route. The local static build and existing website features remain the source of deployment.
````

---

<a id="doc-energy-time-weather-combined-update-install-md"></a>
## Original file: `ENERGY-TIME-WEATHER-COMBINED-UPDATE-INSTALL.md`

SHA-256: `73d0979f3deafc571916637b355a0530aaa9e5e627bec3c0597c8abc485a1dfb`

````markdown
# IGERS Combined Time + Weather + Live Energy Update

This package is an additive update to the existing IGERS-BD-01 web app.

## Included
- Existing IGERS application and preserved panels/features.
- Live Time / Weather update already integrated in the current baseline.
- New `IGERS ENERGY CALCULATION ENGINE` panel.
- Live recalculation when model inputs change.
- Admin-protected Energy Engine ON/OFF and Reset controls.
- Existing IGERS administrator password/session model is reused: `MIM2005`.

## Energy reference model
The default values reproduce the current illustrative roadway model:
- mass = 900 kg
- entry speed = 20 km/h
- exit speed = 15 km/h
- net recovery efficiency = 20%
- 100,000 harvesting locations
- 210,000 vehicle passages/year/location

The model uses `ΔE = 0.5 m (v1² - v2²)` and then applies the recovery factor. It is a planning/illustrative model, not measured field production.

## GitHub Pages
Upload/extract the package so `index.html` remains at the repository root. Keep all files and relative paths together.

## Security note
The password/session mechanism is suitable only for a static prototype UI. GitHub Pages cannot protect a secret like a production backend. Physical hardware control is not performed by this panel.
````

---

<a id="doc-final-air-traffic-qa-2026-10-08-md"></a>
## Original file: `FINAL-AIR-TRAFFIC-QA-2026-10-08.md`

SHA-256: `ae2f1eef1391f7c3027ac874cad8a62380878460f35cd3be3150e66c268519f5`

````markdown
# IGERS Bangladesh Air Traffic — Final QA 2026-10-08

## Provider correction
- Airplanes.live `/point` radius corrected from 450 nm to **250 nm** (documented API maximum).
- 30-second browser refresh remains safely above the documented 1 request/second rate limit.
- Bangladesh geographic polygon filtering remains active before 3D rendering.

## Runtime hardening
- Optional same-origin Python relay: `/api/airtraffic`.
- Python relay uses standard library only.
- Per-target stale pruning retained; temporary upstream failures no longer wipe the entire target set prematurely.
- 3D canvas resize remains event/size driven rather than per animation frame.
- Service Worker cache bumped to v21.

## Tests
- Python relay self-test: PASS.
- Python relay `py_compile`: PASS.
- Air traffic JS `node --check`: PASS.
- Project local-script reference scan: PASS.
- Duplicate ID scan: PASS.
- ZIP integrity: PASS.
- Local `/api/health` smoke test: PASS.
- Live upstream availability in sandbox: NOT CERTIFIED because external DNS/network is unavailable in this environment.
````

---

<a id="doc-final-qa-report-2026-10-06-md"></a>
## Original file: `FINAL-QA-REPORT-2026-10-06.md`

SHA-256: `a352e49bf543fa11f3d393a1f7c0470195d9f7ae2bed524c23ec009fea4ea02d`

````markdown
# IGERS POWERCORE — FINAL HARDENED QA — 2026-10-06

## Static QA
- JavaScript syntax: PASS — 0 errors across all project JS files.
- Duplicate HTML IDs: 0.
- Local stylesheet dependencies are inlined into `index.html` for GitHub Pages deployment robustness.
- Service-worker revision: `igers-powercore-v11`.
- Development-only `jscheck/` folder and build helper removed from deployment package.
- Bangladesh fallback GeoJSON present.
- Existing major sections retained, including Air Traffic, Airspace Safety, Border Monitor, 3D Early Warning, 3D Traffic, Seismic 3D, Marine 3D, IGERS 3D Lab, Tower Mesh, Salah/Qibla, Emergency, Weather and Data Analysis.

## Browser runtime smoke QA
Executed against the actual `index.html` in headless Chromium using the real browser DOM and canvas runtime.
- Default theme: `night`.
- Digital 3D Weather canvas initialized with non-zero dimensions.
- 3D Air/Ground/Maritime early-warning scope initialized.
- 3D Bangladesh Border monitor initialized.
- 3D radar-style scanner initialized.
- 3D Qibla canvas initialized.
- Salah grid populated with 5 prayer entries.
- Qibla result populated: 278° W (Dhaka fallback test location).
- Administrator controls start locked.
- No JavaScript `pageerror` exceptions.
- No application console errors during the successful runtime boot; public network requests were isolated in the test harness and their forced aborts are not application errors.

## Security boundary
- Administrator controls are configuration/monitoring controls only.
- No weapon firing, interceptor launch, target assignment, military fire-control, jamming, or remote weapons control is included.
- GitHub Pages frontend authentication remains UI-level; production-grade secrets must live server-side.
- Coverage rings in the early-warning panel are explicitly labeled as visualization-only.
````

---

<a id="doc-github-final-check-2026-09-22-md"></a>
## Original file: `GITHUB-FINAL-CHECK-2026-09-22.md`

SHA-256: `5b4a6cf6c4b5089a1be992261ec4930034b801cd4db2388b0313be30e85a3a0c`

````markdown
# IGERS GitHub Final Check — 2026-09-22

- Repository root contains index.html: YES
- CNAME: the custom domain
- .nojekyll: YES
- Missing local HTML references: 0
- Missing asset references: 1
- Root structure: VERIFIED
- Source package was flattened from the production `dist/` output so GitHub Pages can serve it directly.
````

---

<a id="doc-github-pages-deployment-readme-md"></a>
## Original file: `GITHUB-PAGES-DEPLOYMENT-README.md`

SHA-256: `12d3998f102ea463dd248164547650f9682d06d1bdab65f1a578c18ff49a901f`

````markdown
IGERS POWERCORE — GitHub Pages deployment hardening — 2026-10-06

This package contains index.html with the visual/theme CSS and upgrade JavaScript inlined into the page.
The default theme is NIGHT. The Day/Night control remains available.

Why this build exists:
- avoids GitHub Pages/browser cache problems for the visual/theme layer
- avoids dependence on separate theme/3D CSS/JS files for first paint
- preserves existing local modules and data assets

Deploy:
1. Extract this ZIP.
2. Replace the repository root files with these files, especially index.html.
3. Keep the data/ folder and any existing assets.
4. Commit/push to the GitHub Pages source branch.
5. Open the Pages URL with a hard refresh (Ctrl+Shift+R) once.

Note: public live APIs still require the user's browser/network and may show LIVE/VERIFY/OFFLINE states honestly.
````

---

<a id="doc-github-pages-direct-deploy-md"></a>
## Original file: `GITHUB-PAGES-DIRECT-DEPLOY.md`

SHA-256: `c0c6b8656277b91c7c8dba864d17009c97ae0cc41c37171e0e6b5ab878441e1c`

````markdown
# IGERS POWERCORE · DIRECT GITHUB PAGES BUILD

Canonical live URL:
https://raabdullah59720-igers.github.io/IGERS-POWERCORE/

This release is intentionally custom-domain-free. It contains no `CNAME` file and no runtime redirect to a custom domain.

## Deploy
1. Upload the CONTENTS of this package to the repository root.
2. Keep `index.html` at the repository root.
3. Keep the `.github/workflows/pages.yml` workflow.
4. In GitHub: Settings → Pages → Build and deployment → Source → GitHub Actions.
5. The workflow deploys the repository as a project site at `/IGERS-POWERCORE/`.

Important: GitHub account/repository Pages settings are server-side. If a custom domain is still configured in Settings → Pages, remove it there to stop GitHub's server-side custom-domain redirect. The files in this package do not request or create such a redirect.
````

---

<a id="doc-github-pages-fixed-setup-md"></a>
## Original file: `GITHUB-PAGES-FIXED-SETUP.md`

SHA-256: `bc321a3c58e8cc56854119cc532088ff1682d15067993b23643cdc3a19249852`

````markdown
# IGERS-BD-01 — GitHub Pages Fixed Release

This package is prepared for direct GitHub Pages project hosting.

## Important
- `index.html` is at the repository root.
- `.nojekyll` is included.
- All website assets are kept with relative paths so the project works under:
  `https://raabdullah59720-igers.github.io/IGERS-POWERCORE/`
- The previous `CNAME` file for the custom domain has intentionally been removed from this GitHub-safe release. This avoids a broken/misconfigured custom-domain setup from interfering with the normal GitHub Pages URL.
- If the custom domain is later configured correctly in GitHub Pages + DNS, a `CNAME` file containing only the custom domain can be restored.

## Upload
Upload the CONTENTS of this folder to the root of the `IGERS-POWERCORE` repository, not the outer ZIP folder.

GitHub:
1. Open the repository.
2. Upload/replace the files in the repository root.
3. Commit to the branch used by Pages.
4. Settings → Pages → Deploy from a branch → select that branch and `/ (root)`.
5. Wait for the Pages deployment to finish.
6. Open the project URL.

## Local QA performed
- JavaScript syntax checked successfully for all project JS files.
- Root `index.html` served successfully through a local HTTP server.
- Relative asset references were checked.
- Existing project assets/features were preserved.

This is a static GitHub Pages release. Server-side files in the source package are not required for GitHub Pages.
````

---

<a id="doc-github-pages-production-deploy-md"></a>
## Original file: `GITHUB-PAGES-PRODUCTION-DEPLOY.md`

SHA-256: `ef88026079c8c0153cf565a2c1194bd033599e02d82af36dbd34949f8020127a`

````markdown
# IGERS-BD-01 POWERCORE — Production GitHub Pages Release

Target project URL:
`https://raabdullah59720-igers.github.io/IGERS-POWERCORE/`

## What is preserved
This package is based on the latest IGERS POWERCORE full-feature release and preserves the existing Journal/Magazine, time, weather, earthquake, live ADS-B air traffic, airspace safety, NASA GIBS/GPM, NASA POWER, satellite/disaster intelligence, Bangabandhu-1 public orbital monitor, engineering lab, admin control, voicemail/customer-care, and advanced operations layers.

## Production fixes
- Restored the missing Professional Engineering Magazine PDF asset referenced by the app.
- Added a read-only Satellite Public Data Connection Center for CelesTrak, SatNOGS and NASA GIBS source-health checks.
- Added conservative timeout/fallback behavior; an unavailable external provider cannot blank the app.
- Rotated the service-worker cache namespace to prevent a stale broken build from persisting.
- Added a GitHub Pages Actions workflow and `404.html` fallback.
- Hardened external links with `noopener noreferrer`.
- Kept the physical-control boundary explicit: browser controls modify software state only and do not directly switch real equipment.

## Upload rule
Upload the CONTENTS of this ZIP to the repository root. Do not upload the ZIP as a single file. Existing duplicate root files should be replaced by this build's versions; do not place them inside another `IGERS-POWERCORE-main/` folder.

## Pages setting
Preferred: Settings → Pages → Build and deployment → Source → GitHub Actions.

The workflow will deploy on pushes to `main` or `master`, or manually from Actions.

## Satellite note
The satellite connection panel uses public orbital-element/catalog and Earth-observation service metadata. It does not transmit commands or expose spacecraft telemetry/control.
````

---

<a id="doc-github-pages-readme-md"></a>
## Original file: `GITHUB-PAGES-README.md`

SHA-256: `847f7321344a5023e9958f83ea3821121a565460d8e955999d8c75623fd6f544`

````markdown
# IGERS-BD-01 — GitHub Pages Deployment

This folder is the deployable static website root.

## GitHub Pages
1. Upload **all files in this folder** to the repository root.
2. Confirm `index.html` is directly in the repository root.
3. GitHub → Settings → Pages → Deploy from branch → `main` → `/ (root)`.
4. The included `CNAME` targets `the custom domain`.

Do not upload this folder itself as a nested directory.
````

---

<a id="doc-hash-link-fix-md"></a>
## Original file: `HASH-LINK-FIX.md`

SHA-256: `f291d8b3f751f0ac292413bb9f32e80fc6eb82d5ed5e699a8f559e78f44882ac`

````markdown
# IGERS hash/deep-link fix

Direct links such as `#satelliteIntel` now use a resilient hash router and delayed scroll handler.

Examples:
- `#satelliteIntel` → Satellite Intelligence
- `#satellite` → Satellite Intelligence
- `#danger` → Bangladesh hazard monitor
- `#towers` → Mobile tower monitoring
- `#monitor` → IGERS command center

The page also adds scroll-margin for the sticky header and bumps the service-worker cache to avoid stale navigation code.
````

---

<a id="doc-incognito-qa-report-md"></a>
## Original file: `INCognito-QA-REPORT.md`

SHA-256: `04a6800be676cb84b0b3ca136358a4aee407519b46a800ce46d4cb619c64e3cc`

````markdown
# IGERS-BD-01 Incognito / PWA / 3D QA Report

Build: 2026.10.06-3d-pwa.1

## Passed
- HTML duplicate ID scan: 0 duplicates
- Local href/src reference scan: 0 missing local files
- Node JavaScript syntax check: PASS for all top-level JS files and service worker
- PWA manifest JSON: PASS
- PWA `start_url`: `/IGERS-POWERCORE/`
- PWA `scope`: `/IGERS-POWERCORE/`
- App package ZIP integrity: PASS
- App package contains 3D engine JS/CSS, PWA manifest/service worker, icons, and mobile tower controller
- Direct app package download link exists in the web UI
- 3D panel has rotate/reset/layer controls

## Browser limitation
The execution environment blocks local and external browser navigation with `ERR_BLOCKED_BY_ADMINISTRATOR`, so a truthful end-to-end Chromium Incognito page interaction run could not be completed here. The final package was therefore validated with source/parser/static HTTP/package checks instead of claiming a browser pass that was not observable.

Chrome's native `beforeinstallprompt` is conditional on installability criteria and browser/device state; it is not guaranteed in private/incognito mode. The app therefore keeps a direct same-origin `DOWNLOAD APP` ZIP fallback in addition to the native PWA install button.

## Expected behavior on GitHub Pages
Use:
https://raabdullah59720-igers.github.io/IGERS-POWERCORE/

For native PWA install, use the normal browser window on HTTPS. In Incognito/private mode, use the built-in `DOWNLOAD APP` fallback when the native install prompt is not offered.
````

---

<a id="doc-in-app-live-visual-upgrade-2026-09-14-md"></a>
## Original file: `IN_APP_LIVE_VISUAL_UPGRADE_2026-09-14.md`

SHA-256: `1039b27e39b2fc8ac1af1eb4d0f8cd944ee5334e1693060f7f3ce09f2c1f5bb5`

````markdown
# IGERS In-App Live Visual Upgrade — 2026-09-14

## Scope
This release keeps the existing IGERS application and its prior live systems while converting the newly added satellite/NASA experience to an in-app visual workflow.

## In-app behavior
- NASA GIBS Earth-observation imagery is rendered directly inside the IGERS page.
- Satellite observation can be expanded in an in-app modal; it does not navigate to NASA Worldview.
- NASA EONET regional event records are rendered inside the application and can be opened in an in-app detail modal.
- NASA Astronomy Picture of the Day is rendered in the application and can be enlarged in-app.
- Satellite/BMD navigation cards scroll to internal IGERS panels instead of opening external pages.
- Source-state indicators remain source-specific and do not claim spacecraft telemetry or uninterrupted live video.

## Regression checks
- Production static build: PASS
- JavaScript syntax checks: PASS
- Duplicate HTML IDs: 0
- Broken local asset references: 0
- Satellite section external navigation: 0
- NASA section external navigation: 0
- Core/legal/runtime HTTP routes: 200
- Existing Air Traffic / Earthquake / Airspace / Bangabandhu-1 markers: present
- ZIP integrity: to be recorded after packaging

## External-feed limitation
The local QA environment cannot guarantee third-party external-feed availability. The application therefore exposes explicit feed freshness/availability states instead of falsely marking unavailable data as LIVE.
````

---

<a id="doc-live-data-3d-flow-qa-2026-10-08-md"></a>
## Original file: `LIVE-DATA-3D-FLOW-QA-2026-10-08.md`

SHA-256: `1dcfbf7427cc011bec6f74c9bdf8f9af59b620e87c9b3b46be3c9425b90634dd`

````markdown
# IGERS POWERCORE — Live Data / Live Feed / Result / 3D / Traffic Flow QA
Date: 2026-10-08

## Fix scope
Added an independent output center with four separately rendered panels:
1. Live Feed Panel — provider-by-provider incoming observations.
2. Live Result Panel — normalized result table independent of canvases.
3. 3D Visualization Panel — separate 3D-style live-data rendering layer.
4. Traffic Flow Panel — independent vehicle-flow visualization.

## Data bridges fixed
- Air Traffic 3D now dispatches `igers:airtraffic` with normalized current observations so the existing advanced air, border, and new live-output modules can consume the same feed.
- Vehicle Movement Monitor now dispatches `igers:vehicle-flow` after each observed/authorized refresh.
- National Toll Plaza already dispatches `igers:toll-traffic`; the new center consumes that event directly.
- Service-worker cache was bumped from v17 to v18 and includes the new live-output assets.

## Providers
- Air: Airplanes.live public ADS-B API (browser fetch).
- Seismic: USGS all-hour GeoJSON feed.
- Weather: Open-Meteo current forecast endpoint for Dhaka.
- Road traffic: public/authorized vehicle-count or toll/ITS endpoint only; no private CCTV bypass and no fabricated national live count.

## Regression checks
- Baseline IDs: 419
- New-build IDs: 443
- Removed baseline IDs: 0
- Added IDs: 24 (new live-output center only)
- Sections: 34 -> 35
- Duplicate IDs: 0
- Local HTML/CSS/JS references missing: 0
- Inline JS syntax blocks checked: 13, failures: 0
- New external JS syntax: PASS
- ZIP integrity (`zip -T`): PASS
- Local HTTP smoke check: index.html + new JS/CSS + sw.js returned HTTP 200

## Runtime limitation
A full Chromium page-run was attempted in the build sandbox, but the environment blocks local `http://127.0.0.1` and `file://` navigation with `ERR_BLOCKED_BY_ADMINISTRATOR`. Therefore browser click-through/runtime provider connectivity cannot be honestly certified from this sandbox. The package is statically validated and the live providers remain explicitly labeled by actual fetch status in the browser.


## Regression repair applied
- Fixed missing runtime script tags for `field-connectivity-hardening.js` and `vehicle-movement-monitor.js`. Their CSS had been loaded, but the JavaScript runtime modules were not attached to `index.html`.
- Dependency order is now: Field Link → Vehicle Movement → Toll Plaza → PWA → Air Traffic 3D → Live Data/3D/Flow Center, so event bridges can initialize before asynchronous providers return.
- Service worker cache version bumped to v18 to prevent GitHub Pages from retaining the pre-fix shell.
````

---

<a id="doc-magazine-panel-release-2026-09-22-md"></a>
## Original file: `MAGAZINE-PANEL-RELEASE-2026-09-22.md`

SHA-256: `c5752682fa8c7604a05a2888e2701cd2c78d37a98bfc9f914c4f665902a7ed50`

````markdown
# IGERS Magazine Panel

Added the Library copy of IGERS-BD-01 Professional Engineering Magazine as a new additive web-app panel.

- Existing panels preserved.
- Static relative PDF path for GitHub Pages.
- Embedded browser PDF reader with Open, Download and Fullscreen controls.
- Quick section links.
- Service worker cache updated for the magazine PDF.
````

---

<a id="doc-nasa-connection-upgrade-2026-09-14-md"></a>
## Original file: `NASA_CONNECTION_UPGRADE_2026-09-14.md`

SHA-256: `df7c80eafcec2e829e945e5483ec24a49245a25db8515af9a8706f54a0b82313`

````markdown
# IGERS NASA Connection & Intelligence Upgrade — 2026-09-14

## Added
- NASA GIBS Earth-observation image layer with source-specific freshness state.
- Geostationary Himawari-9/AHI candidates (10-minute observation times) through NASA GIBS first, followed by NOAA-21, NOAA-20 and MODIS Terra fallback imagery.
- NASA Worldview deep link centered on the current browser location when available.
- NASA EONET v3 open natural-event metadata for a Bangladesh bounding box plus a global context count.
- NASA astronomy panel with local-location sky planning (solar state, sunrise/sunset, dark-sky window) and NASA Astronomy Picture of the Day.
- Explicit separation between satellite observation, forecast weather, disaster metadata, and astronomy media.
- Feed-specific LIVE/READY/WARN/OFFLINE states to avoid false global LIVE claims.

## Accuracy model
- Green NASA GIBS state means the selected NASA imagery request loaded successfully; it does not imply continuous satellite video or spacecraft control.
- EONET state means the EONET v3 feed returned current open-event metadata.
- APOD state means the NASA astronomy endpoint returned current astronomy media.
- The existing Open-Meteo weather panel remains the numerical forecast source.
- No private Bangabandhu-1 telemetry or government control access is claimed.

## QA
- `node --check nasa-intel.js`: PASS
- `npm run build`: PASS
- Duplicate HTML IDs: 0
- Missing local asset references: 0
- Local HTTP server: PASS
- `/`, `/privacy.html`, `/terms.html`, `/copyright.html`, `/nasa-intel.js`, `/dist/index.html`, `/dist/nasa-intel.js`: HTTP 200
- External NASA provider end-to-end fetch was not claimed in this sandbox because outbound networking is restricted; runtime logic is fail-safe and source-specific.
````

---

<a id="doc-nextgen-upgrade-2026-10-06-md"></a>
## Original file: `NEXTGEN_UPGRADE_2026-10-06.md`

SHA-256: `c3dfe489bb13afa93e6069032d13f7479d7cd06473972332f098533dcc91175e`

````markdown
# IGERS-BD-01 Next-Gen Engineering Simulation Upgrade — 2026-10-06

This additive upgrade preserves the existing application and adds an isolated Engineering Simulation Command Center.

## Added panels
- Conceptual 3D Model Gallery
- Automatic Calculation Panel (per model)
- System Architecture panel
- Fleet / scenario summary panel
- Local Simulation Control panel
- Time/Weather indicator repair layer from the 2026-10-03 package

## Conceptual 3D models
Road recovery, river-current hydrokinetic, regulator/low-head hydraulic, footstep micro-harvest, bridge/culvert node, regenerative rail, airport PV-first, hybrid PV+VAWT, and BESS.

## Engineering integrity
Outputs are marked conceptual/scenario/site-dependent. The simulator does not present a calculation as proof of field performance or construction readiness.

## Static deployment note
The administrative control is deliberately described as a local browser simulation control. GitHub Pages cannot provide server-side authentication.
````

---

<a id="doc-ops-upgrade-2026-09-14-md"></a>
## Original file: `OPS_UPGRADE_2026-09-14.md`

SHA-256: `c8625a57d5adc69bc60d9c6dcfb9f74e11c356bd8e0f720bf9bb9fa63e8eb477`

````markdown
# IGERS-BD-01 — Integrated Operations Upgrade — 14 September 2026

## Added
- Integrated communications/operations layer for authorised Bangabandhu-1/BSCL backhaul workflows.
- Field-energy ledger for Road, Border, Naval, Bridge and Dam prototype harvesters.
- Maintenance/condition panel with explicit prototype status.
- Bangladesh road-intelligence map workspace with satellite/aerial and traffic-provider launch controls.
- Freshness-aware data-trust language: LIVE / STALE / SIMULATED / OFFLINE.

## Engineering honesty
Bangabandhu-1 is a communications satellite. This frontend does not claim direct satellite control, spacecraft telemetry, or exclusive access to a satellite link. A real operational deployment requires an authorised BSCL/service-provider gateway, secure backend ingestion, authentication, field-node telemetry and appropriate network licensing.

The prototype energy values in the dashboard are simulation values until signed field telemetry is connected.

The embedded Bangladesh map is a conventional basemap. Satellite imagery is not represented as inherently live. Dynamic traffic requires an authorised traffic-data provider; Google documents Traffic Layer availability in Bangladesh. Street-level imagery and live traffic remain provider-controlled services.

## Validation
- JavaScript syntax: PASS
- Production build: PASS
- Duplicate HTML IDs: 0
- Static HTTP smoke tests: PASS (/, privacy.html, terms.html, copyright.html, sw.js)
- Existing air traffic / earthquake / airspace-safety IDs preserved
- Existing weather/location paths preserved
````

---

<a id="doc-panel-data-reliability-patch-2026-10-09-md"></a>
## Original file: `PANEL-DATA-RELIABILITY-PATCH-2026-10-09.md`

SHA-256: `cff620c11976d21fb9cd82632b297d2d890fadb529984db417223dfa3b518bfb`

````markdown
# IGERS POWERCORE — Panel Data Reliability Patch

Build date: 2026-10-09

## Changes in this patch

- Restores the direct NASA GIBS tile viewer in the existing Public Satellite Imagery / Worldview-GIBS panel, with layer selection, zoom, refresh, tile-load status, and a bounded recent-date fallback. The Worldview website remains available as a separate public-viewer route.
- Bundles a simplified Bangladesh outline so the border/air-ground-maritime views do not remain blank solely because an external boundary API cannot load. The outline is a visual fallback, not a legal, navigational, or operational boundary product.
- Adds a shared public ADS-B data bridge and sequential fallback between Airplanes.live and ADSB.lol. The flight, air-defense and border panels can reuse a common successful fetch instead of independently polling a provider every few seconds.
- Reduces redundant public-feed polling and makes unavailable/stale status explicit when both public providers cannot be reached.
- Preserves existing page structure and adds changes within the named panels/modules rather than rebuilding the app.

## Real data vs visual simulation

- Aircraft positions are public ADS-B-derived observations when the selected provider returns them. Coverage, completeness, update cadence and availability depend on receiver/provider reach and browser/network conditions.
- NASA GIBS provides public satellite imagery products, not a real-time tactical sensor feed. Image acquisition/processing can lag, and a valid imagery tile is not proof of a live sensor connection.
- The local Bangladesh outline, animated sweep, 3D effects, generic coverage rings and any nodes without an authorized feed are visual/reference elements only. They must not be described as 24/7 real radar coverage, telecom-tower access, border sensor detections, or a verified maritime/ground sensor network.
- No private mobile-tower feed, carrier network access, classified radar, restricted sensor feed, or actual military system is enabled by this patch. Integrate those only through a specifically authorized, documented API.
- The app is a static-site project. Any password gate implemented in browser JavaScript/session storage is only a UI gate, not production-grade authentication. Do not store production secrets in client-side files.

## Deployment and checks

Upload the project contents to the existing GitHub Pages repository using the same root structure, including `data/bangladesh-boundary-fallback.geojson`, `nasa-gibs-bd.js`, and `nasa-gibs-bd.css`.

Static checks performed for this build: all standalone JavaScript files and all four non-empty inline JavaScript blocks pass `node --check`; required links/DOM hooks and the GeoJSON fallback asset are present. A browser visual/runtime test could not be completed in this environment, so deployment must still be checked in Chrome with browser DevTools open. Public provider access may vary by CORS, network policy, endpoint availability, and browser conditions.
````

---

<a id="doc-pwa-danger-fix-install-md"></a>
## Original file: `PWA-DANGER-FIX-INSTALL.md`

SHA-256: `683464ac71afa48cbd827661996466a6e5cc23d2bd74bbd54a9a82b0fe72faec`

````markdown
# IGERS POWERCORE: Danger Alert + App Install Fix

Build: 2026.10.06-bdtower.2

## What was fixed
- PWA manifest now includes valid 192x192 and 512x512 PNG icons.
- GitHub Pages start URL and scope are `/IGERS-POWERCORE/`.
- Service-worker cache version was bumped and old IGERS caches are deleted on activation.
- Service worker skips cached navigation responses so new deployments are picked up.
- An in-app INSTALL APP button was added with Android/Chrome/Edge prompt support.
- iPhone/iPad fallback instructions are built into the UI.
- Danger/Threat alert engine explicitly shows `ENGINE ON · MONITORING` even when a public feed is degraded.
- A `Test alert channel` button lets the user verify the notification channel without claiming a real threat.
- Real public hazard severity is still data-driven from public feeds. No fabricated live danger is shown.

## GitHub Pages deployment
1. Extract this ZIP.
2. Upload the CONTENTS to the repository ROOT. Do not create an extra nested `IGERS-POWERCORE/` folder inside the repository.
3. Keep GitHub Pages source on GitHub Actions.
4. Open:
   https://raabdullah59720-igers.github.io/IGERS-POWERCORE/
5. Hard refresh once with Ctrl+Shift+R after deployment.

## Install the app
- Android Chrome/Edge: use `INSTALL APP` when the browser offers the prompt, or Browser menu -> Install app / Add to Home screen.
- iPhone/iPad Safari: Share -> Add to Home Screen.
- Installability requires the secure HTTPS GitHub Pages URL.

## Danger alert testing
Use `Test alert channel` inside the Bangladesh Satellite / Danger Monitor panel. This sends a developer/test notification only. A real DANGER state appears only when the public hazard/anomaly rules are met.
````

---

<a id="doc-qa-border-command-calc-2026-10-05-md"></a>
## Original file: `QA-BORDER-COMMAND-CALC-2026-10-05.md`

SHA-256: `57467edd20333b01f9d7e5198700de078c47a82958f181c91ac6496847be7eba`

````markdown
# IGERS Border Command + Calculation QA — 2026-10-05

## Integration
- Existing Air Traffic module preserved.
- Border Command monitor added as an independent section after the existing Air Traffic panel.
- Public Airplanes.live API snapshot is reused for counts and aircraft positions.
- Existing Airplanes.live live map remains available inside the new monitor and via Open Live Map.
- NASA GIBS / Himawari-9 AHI Band 13 public Earth-observation image layer added with 10-minute-slot fallback attempts.
- Existing simulated tower/mobile coverage module remains explicitly labelled simulated / authorized-feed-ready.

## Border flow counters
The monitor now shows:
- Total aircraft received from the regional public API response.
- Aircraft with position data.
- Current aircraft inside the approximate Bangladesh polygon.
- Inbound: outside now, predicted to enter within a 5-minute forward projection.
- Passing: inside now, predicted to remain in-airspace over the next 5 minutes.
- Outbound: inside now, predicted to exit within a 5-minute forward projection.
- Aggregate flow = inbound + passing + outbound.

The flow classification is an interface heuristic based on current public ADS-B-derived state, not a flight-plan or military-intelligence determination.

## Calculation audit
Independent unit checks passed against the exact equations used by the live calculators:
- Road kinetic-energy recovery: 1/2 m(v1²-v2²), km/h→m/s conversion, efficiency after gross loss, annual aggregation.
- Water: rho*g*Q*H*eta with L/s→m3/s conversion, operating hours/day and 365 days/year.
- Footstep: F*stroke*eta with mm→m conversion and annual steps.
- Professional Upgrade hydraulic module: zero installed units now correctly yields zero output rather than silently forcing one.

Default-model audit values:
- Road gross loss: 6076.389 J/event; net recovered: 1215.278 J/event; annual model: 7,089,120.370 kWh/year.
- Water net: 5.15025 kW/site; annual model: 225,580.95 kWh/year.
- Foot net: 1.68 J/step; annual model: 51.10 kWh/year.

## Verification
- All JS files pass `node --check`.
- `npm run build` passes.
- Local HTTP smoke test: 200 for root, index, new JS/CSS, dist index and dist new JS.
- Baseline file content preserved; only additive module files and the intended index/logic patches were added.
````

---

<a id="doc-qa-border-map-control-final-2026-10-05-md"></a>
## Original file: `QA-BORDER-MAP-CONTROL-FINAL-2026-10-05.md`

SHA-256: `5e95ec17b5535856889491fa4c06c244f66d82904600bb7c2942aeac4f8ad973`

````markdown
# IGERS Border Map Control — Final QA
Date: 2026-10-05

## Passed
- Re-audited the supplied PRO-MIL-STYLE-PUBLIC-SATELLITE-BORDER release.
- All project JavaScript files pass Node syntax validation.
- Production static build passes.
- Local HTTP smoke test returns HTTP 200 for root/index, Border JS/CSS and generated dist assets.
- All 179 files from the previous release are preserved; the patch adds only new/updated map-control assets and QA output.
- Border monitor now uses a real geographic Leaflet map with OpenStreetMap tiles centered on Bangladesh.
- Aircraft search results are plotted at the exact latitude/longitude received from the existing Airplanes.live public API snapshot rather than an approximate screen-space projection.
- Bangladesh boundary overlay is displayed on the geographic map.
- Zoom control and a Bangladesh-view recenter control are available.
- Aircraft markers expose status, altitude, speed, track and position in map popups.
- Live aggregate counters show total received, position data, inbound, in-airspace, passing, outbound and total flow.
- Radar search status is driven by the freshness of the public aircraft snapshot; stale/offline data does not remain falsely marked LIVE.
- If Leaflet CDN loading fails, the existing Airplanes.live public live-map iframe is used as a fallback.

## Data semantics
- The radar/search layer is a public ADS-B/MLAT-derived aircraft visualization, not a restricted military radar feed.
- Inbound/outbound/passing are derived from current public position plus a 5-minute forward projection against the Bangladesh polygon; they are not flight-plan or military-intelligence classifications.
- No individual mobile-phone location is collected or inferred.
- Satellite observation uses NASA GIBS/Worldview public Earth-observation imagery.
````

---

<a id="doc-qa-border-map-control-fix-2026-10-05-md"></a>
## Original file: `QA-BORDER-MAP-CONTROL-FIX-2026-10-05.md`

SHA-256: `d1d7e9ff8ab7bf0314dc8eafd036526ca051b8088a6915024c4d76f0f12e148b`

````markdown
IGERS Border Map Control QA — 5 October 2026

Fix: replaced the command-panel aircraft view from pixel-projected markers over a remote iframe with a real Leaflet/OpenStreetMap geographic basemap. Public aircraft results now render as geolocated markers using the exact lat/lon returned by the existing Airplanes.live API snapshot. Bangladesh boundary/zone overlay, zoom controls, Bangladesh recenter control, popups and live counts are included.

The Airplanes.live iframe remains as a fallback if Leaflet CDN loading fails.

Safety/data semantics: public ADS-B/MLAT-derived air traffic only; no restricted military radar or individual phone tracking.
````

---

<a id="doc-qa-final-deep-integration-2026-09-14-md"></a>
## Original file: `QA-FINAL-DEEP-INTEGRATION-2026-09-14.md`

SHA-256: `630a0b614c1faa784f4e370c10fd5deee187322dff16ad2284b2f978eabfaf59`

````markdown
# IGERS-BD-01 — Final Deep Integration QA
Date: 2026-09-14

## Package integrity
- ZIP extracted successfully: PASS
- Production build (`node build.mjs`): PASS
- JavaScript syntax checks: PASS
- Duplicate HTML IDs: 0
- Local asset/reference checks: PASS

## Preserved legacy/core IGERS features
- Energy source map: PASS
- Energy journey / conversion architecture: PASS
- Roads / bridges / water / hybrid applications: PASS
- Sentinel/NOC concept: PASS
- Bangladesh deployment section: PASS
- Environmental/radar/earthquake layer: PASS
- Time engine: PASS
- Weather/location layer: PASS
- Inventor / project identity: PASS
- Engineering limitations/safety section: PASS
- Feedback/customer-care section: PASS

## Live/added systems
- Live Air Traffic: PASS
- Earthquake alert feed + notification UI: PASS
- Satellite connection monitor: PASS
- Airspace Anomaly Monitor: PASS
- Satellite weather/observation visual layer: PASS
- NASA GIBS visual layer: PASS
- NASA EONET disaster intelligence: PASS
- NASA astrography/live-location panel: PASS
- Same-origin provider gateway: PASS
- Provider failure state: HTTP 502 / UPSTREAM_UNAVAILABLE

## Runtime smoke test
Local server started successfully.
Core routes returned HTTP 200:
- /
- /privacy.html
- /terms.html
- /copyright.html
- /nasa-intel.js
- /sw.js

Provider gateway behavior from this isolated environment:
- weather: 502 UPSTREAM_UNAVAILABLE
- USGS: 502 UPSTREAM_UNAVAILABLE
- NASA EONET: 502 UPSTREAM_UNAVAILABLE
- NASA API: 502 UPSTREAM_UNAVAILABLE
- NASA GIBS: 502 UPSTREAM_UNAVAILABLE

These 502 results are expected because this execution environment has no outbound provider connectivity. The app now reports this state honestly instead of presenting stale data as LIVE.

## Conclusion
The new live/remote-data layer is integrated into the same application package and the previous core IGERS features are preserved. No duplicate HTML IDs or broken local references were detected. The only untestable condition here is actual third-party live data retrieval because the test environment blocks outbound network access.
````

---

<a id="doc-qa-release-verification-2026-09-14-md"></a>
## Original file: `QA-RELEASE-VERIFICATION-2026-09-14.md`

SHA-256: `9e8c8e91ca717c78e754a5cd2e8a75ea1ae39c9cfa4a66667e052829025c0b87`

````markdown
# IGERS POWERCORE — Final Complete Release Verification
Date: 14 September 2026

## Release
IGERS-POWERCORE-FINAL-COMPLETE-2026-09-14

## Verified
- Clean extraction and file integrity
- Production build via `npm run build`: PASS
- `dist/index.html` generated: PASS
- Duplicate HTML IDs: PASS (0)
- JavaScript syntax: PASS (`script.js`, `igers-live-enhancer.js`, `server.mjs`)
- Inline application script extraction + syntax check: PASS (after fixing Airspace Monitor string-literal syntax defect)
- Local server startup: PASS
- HTTP smoke test for core/legal/runtime assets: PASS
- Required feature presence: PASS (weather, air traffic, earthquake, satellite, airspace anomaly, energy/network/maintenance/road layers)
- Common secret/private-key marker scan: PASS
- Final source inspection: PASS
- ZIP integrity: PASS

## Live-feed behavior
The UI uses explicit freshness/error states where implemented and does not claim proprietary satellite telemetry. External-feed availability, CORS, quotas and provider changes remain outside the local package test environment.

## Browser limitation
A full browser-rendered test was attempted previously, but the sandbox Chromium policy blocked navigation with `ERR_BLOCKED_BY_ADMINISTRATOR`. No false browser-pass claim is made.

## Release assessment
READY FOR USER-SIDE IMPORT/RUN TESTING. A reproducible inline JavaScript syntax defect in the Airspace Monitor was found and fixed; the final package was rebuilt and the fixed inline script now passes syntax validation.
````

---

<a id="doc-qa-report-2026-10-06-md"></a>
## Original file: `QA-REPORT-2026-10-06.md`

SHA-256: `829b90631eec90516d2cae0b3ccd3b5f7a6fde86250e72a95ae84a5dd05d79a4`

````markdown
# IGERS POWERCORE — Navigation Build QA (2026-10-06)

## Passed
- ZIP integrity: PASS
- Required local assets (cover + 44-page engineering PDF): present
- Duplicate HTML IDs: none
- Inline JavaScript syntax (`node --check`): PASS for all script blocks
- Navigation panel + map + 3D canvas + controls: present
- `state.navMap` initialization: present before navigation interactions
- Air Traffic / Earthquake / Weather / Alert / Anomaly / Silo / Satellite / Border / Admin panels: present
- Service worker cache includes index, cover and engineering PDF

## Navigation hardening
- Driving uses the public OSRM demo route endpoint.
- Walking/Cycling are explicitly labeled as direct-navigation fallback modes; they no longer pretend to return an OSRM road route.
- When OSRM is unavailable, the UI shows VERIFY + direct distance/bearing and clears ETA instead of keeping stale route data.
- Map click updates destination and triggers navigation calculation.
- Browser geolocation is permission-gated.

## Runtime limitation
The build sandbox could not complete a stable Chromium interactive render against localhost before timeout, and external routing/ADS-B providers may be inaccessible from the sandbox network. The static/runtime wiring was therefore validated by source inspection, syntax checking, DOM-reference checks and package integrity. The app is designed to display LIVE only after a provider responds and VERIFY when it does not.
````

---

<a id="doc-qa-report-nextgen-2026-10-06-md"></a>
## Original file: `QA-REPORT-NEXTGEN-2026-10-06.md`

SHA-256: `f7fa5bc6969b0b29764dfacbc1b9b7e8b9375aff854536588c93f241651a2737`

````markdown
# IGERS POWERCORE — NEXT-GEN QA REPORT — 2026-10-06

## Build / syntax
- `igers-nextgen.js`: PASS (`node --check`)
- `time-weather-update.js`: PASS
- `live-indicator-fix.js`: PASS
- `time-energy-repair.js`: PASS
- Existing `script.js`: PASS
- Existing `igers-live-enhancer.js`: PASS
- Offline production build: PASS (`node build.mjs`)

## Static integration
- Missing local HTML/CSS/JS asset references: NONE
- Duplicate IDs across static HTML + new simulation template: NONE
- New Simulation Lab navigation anchor: PRESENT
- Automatic calculation panel: PRESENT
- Local simulation control panel: PRESENT
- Conceptual 3D canvas: PRESENT

## Conceptual model set
1. Road Kinetic Recovery
2. River Current Hydrokinetic
3. Regulator / Low-Head Hydraulic
4. Footstep / Pedestrian Micro-Harvest
5. Bridge / Culvert Energy Node
6. Rail Regenerative Braking
7. Airport PV Canopy + Footstep
8. Hybrid Solar + VAWT Resilience Node
9. BESS + Local Load Sizing

## Calculation integrity spot checks
Independent arithmetic checks were run for the default scenarios. The implemented equations match the intended engineering forms (kinetic, hydrokinetic, hydraulic, footstep, regenerative braking, PV, hybrid wind/PV and BESS sizing).

## Live-provider / browser limitation
The container environment prevented a full Chromium navigation test of the locally served application (`ERR_BLOCKED_BY_ADMINISTRATOR`). Therefore the report does **not** claim a successful full browser interaction run from this environment. Live external providers are still handled by the existing application using explicit LIVE / degraded / offline states rather than invented values.

## Deployment status
The root project and `dist/` build are ready for GitHub Pages upload. Existing modules and files were preserved; the new Simulation Command Center is additive.
````

---

<a id="doc-qa-report-md"></a>
## Original file: `QA-REPORT.md`

SHA-256: `70f70f5ff98ff4fee3de24a8ad328e36fbdbb13cae900ac0ae106afb399239c6`

````markdown
# IGERS POWERCORE — FINAL QA REPORT — 2026-10-06

## Static QA
- JavaScript syntax: PASS (all inline script blocks).
- Duplicate HTML IDs: NONE.
- Missing `$()` DOM references: NONE after final patch.
- Required 3D renderer functions restored: `prepCanvas`, `loop`, `weather3DUpdate`, `air3DUpdate`, `siloUpdate`, `satellite`.
- Required 3D canvases present: Air Traffic, Weather, Anomaly, Silo, Admin.
- Journal cover and 44-page PDF are physically included in `assets/`.
- Service-worker cache bumped to final v3.

## Interactive UI QA (Playwright, mocked external providers)
- All 13 main sections rendered in DOM.
- 5 required 3D canvases initialized with non-zero dimensions.
- Alert Test button produced visible in-app toast.
- Alert toggle changed ON → OFF → ON correctly.
- Admin password `IGERS-2026` unlocked the maintenance console.
- Flight-detail renderer displayed callsign, registration, ICAO hex, altitude, ground speed, track, vertical rate, squawk, latitude, longitude, category and provider.
- Silo recalculation responded to user input and produced a maintenance state/notice.
- Page errors after the final runtime patch: NONE in the mocked-provider browser test.

## External-provider limitation
The sandbox cannot certify live production responses from every public provider because external network access and local HTTP browser navigation are restricted here. The application therefore intentionally uses LIVE/VERIFY/UNKNOWN states rather than fabricating provider output.

## Visual QA
A full-page Playwright render was captured after the final renderer repair. The 3D Air Traffic, 3D Weather, 3D Anomaly, 3D Silo and Administrative 3D canvases rendered as visible interactive graphics.
````

---

<a id="doc-readme-install-md"></a>
## Original file: `README-INSTALL.md`

SHA-256: `c6e8852d369a818a939c2b9d475fd4bb49d80f7550875fb1badf0c4124b17a25`

````markdown
# IGERS Live Engineering Indicators — ADD-ONLY — TESTED

This package is an isolated add-on. It does not replace the existing IGERS application and does not intentionally modify existing panels, APIs, localStorage, routes, or other application data.

## Install
Copy `igers-live-indicators/` into the existing repository root, then add before `</head>`:

```html
<link rel="stylesheet" href="./igers-live-indicators/igers-live-indicators.css">
<script src="./igers-live-indicators/igers-live-indicators.js" defer></script>
```

The 12 indicators are explicitly labelled **MODEL / DEMONSTRATION**. They are not claimed as sensor/API live measurements.

## Verification performed
- ZIP integrity check: PASS
- JavaScript syntax check: PASS
- Browser-style DOM runtime harness: PASS
- 12 indicator cards rendered: PASS
- Duplicate-load guard: PASS
- CSS root isolation / selector scoping: PASS
- No fetch / XHR / WebSocket / localStorage / sessionStorage calls: PASS
- Existing-app mutation through routes/history/location: NONE DETECTED

A headless Chromium run was attempted, but the execution environment's Chromium process did not terminate reliably; therefore the browser-harness result above is the runtime verification used for this isolated add-on. No application-source regression claim is made because the complete current IGERS site source is not included in this add-on package.
````

---

<a id="doc-readme-md"></a>
## Original file: `README.md`

SHA-256: `8a465d07445537405d120f83340135d22b8072c6dfe17427dcd2361733701681`

````markdown
# IGERS-BD-01 Magazine Integration | Developer Package

This package integrates the Library magazine into the existing IGERS POWERCORE static website without external viewer dependencies.

## Contents
#magazine/index.html: responsive magazine page
#magazine/styles.css: responsive styling
#magazine/IGERS-BD-01-Professional-Engineering-Magazine.pdf: 70-page A4 magazine
#integration/magazine-section.html: homepage card
#integration/magazine.css: homepage card styling

## Deploy
Copy the `magazine/` folder into the existing repository root. The public page becomes `/IGERS-POWERCORE/magazine/`.

Add the markup from `integration/magazine-section.html` to the existing homepage and its CSS to the existing stylesheet. Do not replace the existing index or application files.

## Source identity
Project: IGERS-BD-01
Author / Inventor: Abdullah Al Rafi [BD]
Publication: 09 September 2026
Edition: 2026 Professional Thesis & Engineering Concept Edition

## QA
The PDF is bundled locally, so the viewer does not depend on an external document host. Browser-native PDF rendering provides zoom, page navigation and printing. A direct Open PDF and Download action are included for compatibility.
````

---

<a id="doc-readme-old-md"></a>
## Original file: `README.old.md`

SHA-256: `f552a18a33a443514a322e7653bd927d5d83b7c3c81a47e43c9eca300b8e3e09`

````markdown
# IGERS-BD-01 Final Safe Live Enhancer

This is a **drop-in enhancement** for the existing `raabdullah59720-igers/IGERS-POWERCORE` static site.

## What it does

- Adds a clearly visible Bangladesh national-flag visual to the existing first hero section (`#home.hero`).
- Adds a small Bangladesh flag mark beside the existing IGERS brand.
- Keeps the current HTML sections and existing site architecture intact.
- Keeps live clock values updating every second.
- Independently refreshes Dhaka weather/environment data from Open-Meteo.
- Independently refreshes Asia earthquake data from the USGS past-hour GeoJSON feed.
- Independently refreshes Dhaka-region ADS-B aircraft state data from Airplanes.live.
- Uses request timeouts and isolated failures, so one provider outage does not stop the rest of the page.
- Uses only scoped visual CSS injected by the script. It does not add global `section`, `button`, `a`, `header`, `.card`, `.panel`, or `.live` rules.
- Uses no external image file for the flag. The flag is embedded as an SVG data URI, eliminating broken relative paths.

## Install

Upload `igers-live-enhancer.js` to the repository root.

Then, in `index.html`, add **one line only** immediately before `</body>`:

```html
<script src="igers-live-enhancer.js"></script>
```

Do **not** remove the current `style.css`, `styles.css`, `script.js`, or the existing inline script. This file is intended to sit on top of the current application.

## Why this is safer

The current site already contains live-data logic for time, weather, environmental readings, earthquakes, and Airplanes.live aircraft data. This enhancer mirrors those providers with independent, timeout-protected refreshes while preserving the existing element IDs and section structure.

The flag layer is inserted only inside `#home.hero`, with `pointer-events:none`. It cannot become a click-blocking overlay.

## Static QA

Before delivery, this package was checked for:

- JavaScript syntax via Node.js
- balanced template literals/braces/parentheses at source level
- no forbidden broad selectors in the injected CSS string
- no external flag asset dependency
- no DOM rewrite of the navigation or unrelated sections
- only one file required to integrate

## Important live-data limitation

A browser cannot guarantee that an external public data provider is reachable at every moment. When a provider is unavailable, the corresponding panel shows a retry/offline state and the other systems continue operating.

## Current repository context verified

The current IGERS repository already contains `index.html`, `script.js`, `style.css`, `styles.css`, an existing Airplanes.live integration, Open-Meteo weather/environment calls, USGS earthquake polling, and a world/local time engine. The live site also exposes those sections.

This package does not claim to replace those existing systems. It is a safer final presentation + live-refresh layer.
````

---

<a id="doc-readme-bugfix-2026-09-13-md"></a>
## Original file: `README_BUGFIX_2026-09-13.md`

SHA-256: `c0cb3196f53a0c899a79d8d3e9e0f7baf24212be1d0e849285a776da325f99af`

````markdown
# IGERS-BD-01 Bug-Fix Audit — 13 September 2026

Fixed / hardened:
- Browser location detection with safe Dhaka fallback.
- Weather and environment feeds now use the active location coordinates.
- Weather timezone uses the active location (`auto`) instead of always forcing Dhaka.
- Added manual “Use my location” control and clear location/feed status.
- Removed the unused Leaflet CDN reference with a mismatched integrity value.
- Added a dependency-free local server and Windows `START-IGERS.bat` launcher.
- Preserved earthquake, notification, live time, weather, environment, and air-traffic sections.
- Preserved all original images/assets and project identity.

Run locally:
1. Double-click `START-IGERS.bat`.
2. The browser opens at `http://127.0.0.1:4173/`.
3. Allow location permission to use current browser coordinates; otherwise Dhaka fallback remains active.

Note: live external feeds still require internet access and can be unavailable when their public providers are down or browser/network policy blocks them.

## Legal / privacy hardening — 13 September 2026
- Added public `copyright.html`, `privacy.html` and `terms.html` pages.
- Added legal links and copyright line to the main site footer.
- Added a project-specific proprietary notice in `LICENSE` so the bundled Apache-2.0 template license is no longer presented as the project license.
- Privacy notice documents browser geolocation, functional localStorage, notifications and current external live-data providers.
- Terms page explicitly distinguishes conceptual/illustrative engineering information from certified or measured performance and limits reliance on live feeds for safety-critical decisions.
````

---

<a id="doc-regression-qa-2026-10-08-md"></a>
## Original file: `REGRESSION-QA-2026-10-08.md`

SHA-256: `5e8f42d34746e5de08b7f9091d60b4b638359df415a3a938d2c6cb5964164842`

````markdown
# IGERS POWERCORE — Full Regression QA — 2026-10-08

Baseline: `IGERS-GITHUB-TOLL-PLAZA-3D-FULL-2026-10-08.zip`

## Restored / preserved panels
- Core IGERS sections and existing system control
- 3D Early Warning / IronDome-style public-data monitor
- Existing Air Traffic panel
- **Separate 3D Air Traffic / Flight Detail panel**
- **Separate Bangladesh Vehicle Movement & Count Monitor**
- **Separate Field Link / Network & Satellite Resilience panel**
- **National Toll Plaza registry with individual 3D-style plaza models**
- National hourly toll-flow seismograph
- Individual plaza hourly mini-seismographs
- RHD/BBA source-link/report layer
- Authorized live toll/ITS feed connector
- Authorized CCTV snapshot/HLS connector
- Chrome/PWA install/download panel
- Existing Border, Satellite, Seismic, Marine, Tower Mesh, Emergency, Weather, Time, Energy, Analytics and other sections

## Automated checks
- External JavaScript syntax: PASS
- Inline JavaScript syntax: PASS (13 inline blocks)
- Duplicate HTML IDs: PASS (0 duplicates)
- Missing local references: PASS (0)
- Required runtime files: PASS
- Local HTTP resource test: PASS (index + manifest + service worker + new modules = HTTP 200)
- ZIP integrity: PASS
- Compact deployment remains below GitHub browser-upload file limit

## Runtime note
The container could serve every module over HTTP, but the large page did not reliably finish Chromium `--dump-dom` within the sandbox timeout. This does not invalidate static syntax/reference checks; external live-provider availability still depends on the user's browser/network/provider access.

## Data integrity
- No private government CCTV is scraped or bypassed.
- Live counts are only marked live when supplied by a public/authorized feed.
- Reference/estimated values remain explicitly labeled.
- ADS-B data is read-only visualization; no weapon/target control is implemented.
````

---

<a id="doc-runtime-qa-2026-10-06-md"></a>
## Original file: `RUNTIME-QA-2026-10-06.md`

SHA-256: `4428e56531b11bcaa8a14de38ecf431bbfa6b178f23b671c2330c4e6c9661e0e`

````markdown
# IGERS POWERCORE — RUNTIME QA — 2026-10-06

## Browser DOM smoke test
Actual application HTML + bundled local JavaScript modules were executed in Chromium with external providers mocked only at the network boundary.

- Page errors: 0
- Console errors/warnings: 0
- Duplicate IDs: 0
- Day/Night toggle: PASS (Day -> Night/Day label transition)
- Border Monitor section: PRESENT
- Border 3D canvas: INITIALIZED
- Border Radar 3D canvas: INITIALIZED
- Salah prayer grid: POPULATED (Fajr, Dhuhr, Asr, Maghrib, Isha)
- Qibla indicator: POPULATED (278° W for Dhaka fallback)
- Data Analysis panel: RENDERED
- Existing major monitor sections: PRESENT

## Provider test policy
External network responses were mocked only for deterministic runtime testing. Production provider availability is still represented by the app's LIVE / VERIFY / OFFLINE logic.

## Environment limitation
Direct Chromium navigation to local file/localhost pages is restricted in the execution environment. The runtime result above therefore verifies the actual bundled DOM/JavaScript execution path without claiming production-network availability.
````

---

<a id="doc-satellite-module-audit-2026-09-13-md"></a>
## Original file: `SATELLITE_MODULE_AUDIT_2026-09-13.md`

SHA-256: `507caa7fa6ed846a2c9004586d5a7c577c598060ffb3d92055ee4de9842bb032`

````markdown
# IGERS Satellite & Disaster Intelligence Module — Audit
Date: 2026-09-13

## Added
- Independent `Satellite & Disaster Intelligence` section.
- Bangabandhu-1 public orbital-data monitor retained.
- Official BMD source navigation for satellite imagery, radar, cyclone and warnings.
- HIMAWARI / FY-2 source navigation labels based on BMD public satellite products.
- Map/navigation view with OpenStreetMap handoff and browser-location support.
- Source clock / UI sync indicator.

## Isolation
- Existing Air Traffic Management is not replaced or rewritten by the satellite-intelligence UI.
- Airspace Safety remains a separate module.
- Weather, earthquake and Comments/Customer Care modules remain separate.

## Validation
- `npm run build`: PASS
- Duplicate HTML IDs: 0
- Broken internal hash targets: 0
- Inline JS syntax: PASS
- `igers-live-enhancer.js`: PASS
- `upgrade.js`: PASS
- Production server critical routes: HTTP 200
- Built `dist` contains the satellite module and controls.

## Data accuracy notes
- BMD official satellite/radar/warning pages are used as source-navigation destinations rather than fabricating government operational feeds.
- Bangabandhu-1 connection status represents public orbital-element data connectivity, not spacecraft telemetry, imagery, or government control.
- Disaster severity/warnings should be verified against the official BMD source.
````

---

<a id="doc-satellite-weather-restore-2026-09-14-md"></a>
## Original file: `SATELLITE_WEATHER_RESTORE_2026-09-14.md`

SHA-256: `fb16f444898d06ab3d93f64befb30f9f864a06bb86d520a7f2da71ffb261b9d4`

````markdown
# IGERS Satellite Weather & Disaster Intelligence Restore

Restored on 14 September 2026.

## Restored capabilities
- Dedicated Satellite & Disaster Intelligence section (`#satelliteIntel`).
- Bangladesh-focused satellite navigation layer.
- HIMAWARI / FY-2 satellite product navigation via Bangladesh Meteorological Department (BMD).
- BMD weather radar, cyclone and warning navigation.
- NASA GIBS near-real-time MODIS Earth-observation image panel for Bangladesh (`MODIS_Terra_CorrectedReflectance_TrueColor`).
- Satellite observation freshness/error state; unavailable imagery is not labelled LIVE.
- Existing Open-Meteo weather forecast remains separate from satellite observation.
- Existing Bangabandhu-1 public orbital-element connection monitor remains separate from satellite imagery.
- Existing Air Traffic, Earthquake and Airspace Safety systems remain independent.
- Location-aware OSM navigation control restored for the satellite intelligence section.

## Accuracy rule
Satellite imagery is presented as Earth observation. Forecast weather remains a weather-model feed. Bangabandhu-1 status is public orbital-element data, not private spacecraft telemetry or control.

## Validation
- `node --check script.js`: PASS
- Inline application script syntax: PASS
- Duplicate HTML IDs: 0
- Satellite section count: 1
- NASA GIBS image source present: YES
- HIMAWARI source navigation present: YES
- BMD satellite/radar/warning links present: YES
- Existing live feature markers preserved: YES
- Offline production build: PASS
````

---

<a id="doc-toll-national-qa-2026-10-08-md"></a>
## Original file: `TOLL-NATIONAL-QA-2026-10-08.md`

SHA-256: `08ffe02e96d439b1816f9f76d5dc43c73aa6ce26f8f0a7245dffaf3f7488374b`

````markdown
# Toll National QA — 2026-10-08

Baseline: IGERS-POWERCORE-main (10).zip
Baseline IDs: 353
New IDs: 374
Baseline IDs removed: 0
New Toll IDs added: 21

QA:
- JS syntax: PASS for all project JS modules
- Python relay py_compile: PASS
- Toll runtime simulation stub: PASS
- Toll event bridge runtime (`igers:vehicle-flow`): PASS
- Duplicate IDs: 0
- Missing local references: 0
- Local HTTP smoke: PASS (index, Toll JS/CSS, SW, manifest, Python relay, launcher)
- ZIP integrity: PASS

Official data references:
- RHD Traffic Insight Hub supports 1st 24-hour, 2nd 24-hour and 48-hour report generation.
- RHD Online Road Network publishes source-verified toll-plaza LRP/location records used in this module.
- BBA public site is linked for bridge/tunnel toll authority reference.

Live-data rule: the module marks data LIVE only when a public or operator-authorized feed actually returns values. No private CCTV or protected system is bypassed.
````

---

<a id="doc-ui-visual-data-upgrade-2026-10-06-md"></a>
## Original file: `UI-VISUAL-DATA-UPGRADE-2026-10-06.md`

SHA-256: `9e0b745c4b8508b58aeb9d5fc202e76cfff565f0669759e22b9976eb566da689`

````markdown
# IGERS POWERCORE — UI / Visual / Data Analysis Upgrade

## Preserved baseline
This package is an additive upgrade to the existing IGERS POWERCORE application. Existing panels, live-data modules, calculations, legal pages, Border Monitor, Salah/Qibla, Air Traffic, Seismic, Marine, Satellite and system controls are preserved.

## New UI capabilities
- Persistent **Day / Night mode** with browser/system preference on first load.
- Theme choice is stored locally as `igers-theme` and survives reloads.
- Subtle **3D depth / perspective interaction** on cards and major visual surfaces.
- Lightweight visual sheen and improved elevation for existing 3D panels.
- Respects `prefers-reduced-motion`.

## New Data Analysis panel
- **System Health** score is computed from existing system-state indicators.
- **Nominal stream count** and **degraded/fallback count** are derived from current UI states.
- Source-health matrix covers Time, Weather, Environment, Earthquake, Air Traffic, Satellite, Border and Energy.
- Trend graph is a visual history model derived from the current system-health score; it is explicitly labelled as modelled and does not represent fabricated sensor telemetry.
- Refresh timestamp is local browser time.

## QA
- JavaScript syntax: PASS for all app JS files.
- Duplicate HTML IDs: none.
- Missing local HTML script/link references: none.
- Bangladesh fallback GeoJSON: valid FeatureCollection with one feature.
- New theme button and analytics section present.
- New CSS/JS resources return HTTP 200 from a local static server.

## Browser verification note
The execution environment's Chromium process was unable to complete a reliable headless graphical session and timed out. Source/static checks and HTTP resource checks were therefore used as the authoritative QA for this visual-only additive layer. Existing external provider limitations remain unchanged.
````

---

<a id="doc-upgrade-only-release-2026-09-22-md"></a>
## Original file: `UPGRADE-ONLY-RELEASE-2026-09-22.md`

SHA-256: `86dd06f5033717aa74ab1b49472f8a481d8c100720309973cc7ede958fe24453`

````markdown
IGERS-BD-01 — Upgrade-Only Release
Date: 22 September 2026

This package preserves the existing IGERS website/application and adds a non-destructive presentation upgrade. No existing project files were removed.

Verified changes:
- Existing core script/main module hashes preserved.
- Added designer.css + designer.js presentation layer.
- Existing index.html, styles.css and package metadata updated only for the upgrade integration.
- No duplicate HTML IDs detected (143 IDs / 143 unique).
- Production build completed through the project's offline-safe build script.
- Local HTTP smoke test passed for /, /index.html, /privacy.html, /terms.html, /copyright.html and /manifest.webmanifest.

Important: live external providers (NASA/weather/ADS-B/etc.) remain dependent on their public network availability. The package does not fake external connectivity.
````

---

<a id="doc-upgrade-report-2026-10-03-md"></a>
## Original file: `UPGRADE-REPORT-2026-10-03.md`

SHA-256: `2cd7451dcddc976175bd8ae0b2dec05be45baed9becd9eb60122e486ec4b9700`

````markdown
# IGERS-BD-01 — Future Upgrade QA Report

## Baseline
The latest complete IGERS website package available in the persistent Library was used as the working baseline: `IGERS-POWERCORE-FINAL-VERIFIED-2026-09-14.zip`. The newer 2026-10-03 `IGERS-POWERCORE-main (6).zip` referenced in the request was not present in the Library index available to this run, so this release does **not** claim to be a byte-for-byte modification of that missing archive.

## Additive upgrades
- Bangladesh Mobile Tower Radar — isolated panel, simulated demo nodes, region filter, node/link controls, radar animation, tower information cards.
- IGERS Future Upgrade Control Center — per-module ON/OFF states with ACTIVE / INACTIVE / SIMULATION / UNAVAILABLE status semantics and local persistence.
- Administrator authentication prototype — masked password input, session login/logout, failed-login message, activity log, admin-only controls.
- Master and individual machine controls — simulation-only, persistent UI state, confirmation before Master OFF.
- GitHub Pages/static compatibility — relative assets and `.nojekyll` retained.

## Data integrity
No real mobile-tower coordinates are presented as verified. The tower panel explicitly uses `SIMULATED DEMONSTRATION` nodes.

## Security limitation
`MIM2005` is implemented as requested for the prototype, but browser-side/static authentication is not production-grade security. Physical machine control is not claimed; controls only modify simulated browser state.

## Automated checks performed
- ZIP extraction and file inventory.
- Required `index.html` present in repository root and `dist/`.
- New JS/CSS files present in both root and `dist/`.
- Relative script/style references inserted.
- Existing root `.nojekyll` and `dist/.nojekyll` retained.
- JavaScript syntax check with Node.js.
- Static HTML reference check for new assets.
- Final ZIP re-extraction and integrity check.

## Tests not possible
- Real GitHub Pages deployment from this environment.
- Browser visual interaction/console testing with a full browser automation stack.
- Verification of real mobile-tower locations or private operator databases.
- Physical hardware control.
- Any external live API requiring credentials.

## Remaining limitation
For an exact upgrade of `IGERS-POWERCORE-main (6).zip`, that exact archive must be available in the Library or attached to the conversation. This release instead uses the latest complete Library website baseline available during the run.
````

---

<a id="doc-upgrade-report-2026-10-05-deep-3d-live-border-md"></a>
## Original file: `UPGRADE-REPORT-2026-10-05-DEEP-3D-LIVE-BORDER.md`

SHA-256: `d71ca040217992160cc6c242207b29ff4895fc5fc87024289472ddff73a1605a`

````markdown
# IGERS POWERCORE — Deep 3D Border Zone Additive Upgrade

Date: 5 October 2026

Baseline: `IGERS-POWERCORE-main (8).zip`

## Delivered

- Added separate `Border Zone 3D Ground + Air Monitor`.
- Added public NASA GIBS Earth-observation image layer.
- Added public ADS-B-derived air-state visualization by reusing the existing Air Traffic snapshot.
- Added non-identifying aggregate/demo mobile signal / coverage layer.
- Added 3D-style radar sweep, ground sectors, satellite link visualization and live health states.
- Added layer controls and satellite refresh control.
- Preserved the existing panels and modules.

## Refresh model

Local visuals use `requestAnimationFrame()` for continuous rendering. External data uses provider-safe schedules or existing module data rather than pretending that internet providers can be polled every nanosecond.

## Important engineering/data boundary

A website cannot legitimately access private mobile-phone locations, telecom subscriber data, military border radar or restricted security feeds without authorized infrastructure and credentials. This release therefore uses only public/authorized-safe data semantics and clearly labels simulation/aggregate layers.
````

---

<a id="doc-upgrade-report-2026-10-05-deep-3d-live-md"></a>
## Original file: `UPGRADE-REPORT-2026-10-05-DEEP-3D-LIVE.md`

SHA-256: `59bf21e394dde05bd939e945b6de4dedfbf8b368d38b4cc956cf70bf40b6f48b`

````markdown
# IGERS POWERCORE — Deep 3D Live Calculation Upgrade

Date: 5 October 2026

## Scope
This is an additive upgrade to the supplied `IGERS-POWERCORE-main (7).zip` baseline. Existing panels and modules were preserved; the new layer is linked into the existing page without replacing the existing calculation, weather, location, air-traffic or satellite modules.

## Added
- Consolidated **Calculation Results Console** linked to the existing Energy, Water Flow and Footstep input fields.
- **Calculate & View Results** action with validation and a consolidated engineering snapshot.
- New **IGERS FRAME-LIVE 3D MONITOR** positioned immediately after the existing satellite connection section.
- CSS-based 3D satellite/orbit visualization with live connection, latency and element-age display sourced from the existing satellite panel.
- Frame-live 3D instrument modules for road energy, water flow, footstep harvesting, weather/time, combined output and location status.
- Local calculation values update on every browser animation frame while result text is rate-limited for performance.
- Satellite connection manager button delegates to the existing satellite refresh function.

## Refresh semantics
A browser cannot perform a real external network refresh every nanosecond. JavaScript and public data providers operate on millisecond/second-scale scheduling. The upgrade therefore uses `requestAnimationFrame()` for local visual/calculation updates (normally ~60–144+ FPS depending on display/browser) and keeps external feed refresh at provider-safe cadence.

## QA performed
- JavaScript syntax checks: all project `.js` files pass `node --check`.
- New module syntax check: pass.
- HTML duplicate-ID audit: 193 IDs, 193 unique in the supplied baseline after integration.
- Local asset reference audit: no missing local script or stylesheet references detected.
- Production build: pass using the project's offline-safe `build.mjs` path.
- Local server smoke test: `http://127.0.0.1:4173/` returned HTTP 200.

## Browser QA limitation
A full headless Chromium DOM interaction run was attempted, but the page's long-running live timers/external feed behavior prevented a clean bounded `--dump-dom` completion in this environment. Static/source/build validation passed; no claim is made that a full end-to-end browser test was completed here.

## Engineering disclaimer
All energy values remain conceptual/calculation-model outputs and are not physical sensor telemetry. Satellite connectivity refers to public orbital-element data and does not imply spacecraft telemetry or spacecraft control.
````

---

<a id="doc-upgrade-audit-2026-09-14-md"></a>
## Original file: `UPGRADE_AUDIT_2026-09-14.md`

SHA-256: `3f7c7da0d2323dc66be237e64334a99a2cf4aaa6a0ca926e5400d49e81a2ae0d`

````markdown
# IGERS POWERCORE Live Systems Upgrade Audit — 2026-09-14

## Baseline preserved
- Live Air Traffic / ADS-B module remains in place.
- Earthquake alert system remains multi-source (USGS + EMSC).
- Bangabandhu-1 satellite connection monitor remains isolated from Air Traffic and Airspace Safety.
- Bangladesh Airspace Anomaly Monitor remains a separate public-data heuristic layer.
- Weather, location, privacy, terms, copyright and the rest of the IGERS interface are preserved.

## Accuracy / efficiency changes
### Air Traffic
- Live status is now freshness-aware instead of treating any successful HTTP response as LIVE.
- `<=45 s` newest position: LIVE.
- `46–120 s`: DEGRADED.
- `>120 s`: STALE.
- Feed outage: OFFLINE.
- Status explicitly identifies Airplanes.live as the provider.

### Earthquake
- USGS feed `metadata.generated` is used for source freshness when available.
- `<=3 min`: LIVE / freshness verified.
- `3–10 min`: DEGRADED.
- `>10 min`: STALE.
- If both sources are unreachable: OFFLINE and no alert is inferred.
- USGS + EMSC remain separate sources and are deduplicated for display.

### Satellite
- CelesTrak GP data remains on a low-cadence refresh aligned with the provider's published 2-hour GP update interval.
- The indicator now describes the dataset as CURRENT/STALE rather than pretending it is spacecraft telemetry.
- Orbit-element epoch age is used for freshness.
- Official BMD satellite/radar navigation is surfaced without fabricating a BMD machine-readable feed.

### Airspace Anomaly Monitor
- Adds public emergency transponder-code awareness (7700/7600/7500) as a notice.
- Raises the speed outlier threshold and requires stronger combined conditions before an unverified high-altitude target becomes a higher-severity outlier.
- The module continues to state that ADS-B public data cannot confirm hostile, stealth or hypersonic objects.
- Feed failure never creates a danger notice.

## Local QA
- `npm run build`: PASS
- JavaScript syntax checks: PASS
- Duplicate HTML IDs: 0
- HTTP smoke tests: `/`, `/privacy.html`, `/copyright.html`, `/terms.html`, `/manifest.webmanifest`, `/sw.js` => HTTP 200
- Required production assets present: PASS

## External-source verification note
This build uses public providers whose current documentation was checked on 2026-09-14. The isolated container used for packaging does not have outbound network access, so no claim is made that the live third-party APIs were successfully queried from inside the packaging runtime.
````

---

<a id="doc-upgrade-notes-2026-09-13-md"></a>
## Original file: `UPGRADE_NOTES_2026-09-13.md`

SHA-256: `b591016aaba070fae6b64c580d8410c98059bfc54e1ab600071b5cf62f7a8f1a`

````markdown
# IGERS-BD-01 upgrade package

- Fixed the missing Bangladesh flag overlay by actually loading the enhancer and using a local SVG asset with isolated layering.
- Kept the existing weather, time and Airplanes.live systems intact.
- Upgraded earthquake monitoring to a multi-source USGS + EMSC browser feed with timeout isolation, deduplication, visibility-aware polling and notification de-duplication.
- Satellite/remote-sensing note: satellites can support earthquake mapping/coseismic deformation analysis, but they are not a safe substitute for a primary real-time seismic warning feed. This package therefore does not falsely claim satellite-based instant earthquake prediction.
- Existing interface remains informational and is not an official Bangladesh earthquake warning service.
````

---

<a id="doc-upgrade-pro-release-2026-09-22-md"></a>
## Original file: `UPGRADE_PRO_RELEASE_2026-09-22.md`

SHA-256: `5b2c6b86a460847312f31e6967fccd936c67c68a40507ecffac592ca764c9717`

````markdown
# IGERS-BD-01 Professional Upgrade Release — 2026-09-22

This release is additive. Existing IGERS panels, live-data modules, legal pages, graphics and project identity are preserved.

## New panels
- IGERS Command Center: core integrity scan, system status, event console, refresh, JSON snapshot export.
- Engineering Lab: hydro/flow recovery conceptual power and energy estimator.
- Engineering Lab: roadside solar harvesting conceptual estimator.
- System-flow visualization: source → recover → convert → store → apply.
- Analytics & Research Library: validation pathway and measured/estimated/live data distinction.
- New navigation entries for Command Center, Engineering Lab and Analytics.
- Dependency-free implementation for GitHub Pages performance.

## Deployment
- `index.html` remains at repository root.
- `.nojekyll` remains present.
- The custom `CNAME` file is intentionally absent so this release can use the GitHub project-page URL directly.
- Existing live-data APIs remain independent from the new panels.

## Engineering note
The new calculators are conceptual estimation tools. They do not represent measured field performance. Future measured/experimental data can be connected without changing the UI architecture.
````

---

<a id="doc-voicemail-full-app-audit-2026-09-15-md"></a>
## Original file: `VOICEMAIL-FULL-APP-AUDIT-2026-09-15.md`

SHA-256: `0cf167f230432341af4f9036e3b376e46bd4369a33f3fe32a5ff75e73bdf452a`

````markdown
# IGERS POWERCORE — Public Voicemail + Full Feature Audit

Date: 15 September 2026

## Base package
This build uses the IGERS-POWERCORE NASA GIBS live-indicator package as the base so existing live/environmental/satellite modules remain present.

## Added
- Public Voicemail recorder in the Comments / Care area.
- Maximum recording duration: 60 seconds.
- Browser preview, stop, discard and publish controls.
- Shared public feed through `/api/voicemails`.
- Public audio playback through `/api/voicemails/:id/audio`.
- MIME validation, 7 MB audio limit and basic per-connection rate limiting.
- Privacy/terms notes for public recordings.

## Existing feature verification
Verified in source package:
- IGERS-BD-01 identity and project title.
- Inventor / author: Abdullah Al Rafi [BD].
- Concept / invention date: 14 August 2026.
- Weather / Open-Meteo.
- Environmental and earthquake feeds.
- Air traffic / Airplanes.live.
- Airspace safety monitor.
- Satellite connection / Bangabandhu-1 public orbital-data context (NORAD 43463).
- NASA GIBS imagery and NASA GPM precipitation panel.
- Comments / Customer Care.
- Copyright / Privacy / Terms pages.

## QA checks
- `node build.mjs`: PASS.
- JavaScript syntax checks: PASS.
- Server syntax check: PASS.
- Duplicate HTML IDs: PASS (none found).
- Home-page HTTP smoke test: PASS.
- Voicemail GET feed: PASS.
- Voicemail POST/upload: PASS.
- Voicemail audio retrieval: PASS.
- Uploaded recording appears in shared feed: PASS.
- ZIP integrity test: PASS.

## Deployment note
Shared/public voicemail requires the included Node server (or an equivalent backend implementing the same API). A static-only hosting environment cannot persist cross-user voice recordings by itself.
````

---

<a id="doc-weather-3d-digital-upgrade-2026-10-06-md"></a>
## Original file: `WEATHER-3D-DIGITAL-UPGRADE-2026-10-06.md`

SHA-256: `41c6f9c8d352933fb99ad077c0a3eded2ccb7e7a5dc9ced6baad8188ac31260a`

````markdown
# IGERS POWERCORE — Digital 3D Weather Upgrade

This additive upgrade converts the Weather panel from an analog/emoji presentation into a digital 3D atmospheric console.

Included:
- Procedural 3D-style sky/depth scene with horizon grid, clouds, sun/moon, wind vectors and precipitation particles.
- Live values bound to the existing Open-Meteo weather engine; no duplicate provider or fabricated sensor values.
- Digital temperature, humidity, wind, precipitation, condition and direction HUD.
- Hourly forecast strip synchronized from the existing weather-hourly stream.
- Night/Day theme compatibility.
- Reduced performance footprint: capped animation geometry and 2x device-pixel ratio.
- Existing Weather API/location logic, Weather live-indicator and all other IGERS panels remain intact.
- Service-worker cache version bumped to v7.

QA:
- All inline script blocks pass Node syntax checking.
- All standalone JavaScript files pass Node syntax checking.
- Upgrade is additive and does not replace the existing Weather API/data flow.
````

---


---

## Original file: `PWA-DANGER-FIX-INSTALL.md`

# IGERS POWERCORE: Danger Alert + App Install Fix

Build: 2026.10.06-bdtower.2

## What was fixed
- PWA manifest now includes valid 192x192 and 512x512 PNG icons.
- GitHub Pages start URL and scope are `/IGERS-POWERCORE/`.
- Service-worker cache version was bumped and old IGERS caches are deleted on activation.
- Service worker skips cached navigation responses so new deployments are picked up.
- An in-app INSTALL APP button was added with Android/Chrome/Edge prompt support.
- iPhone/iPad fallback instructions are built into the UI.
- Danger/Threat alert engine explicitly shows `ENGINE ON · MONITORING` even when a public feed is degraded.
- A `Test alert channel` button lets the user verify the notification channel without claiming a real threat.
- Real public hazard severity is still data-driven from public feeds. No fabricated live danger is shown.

## GitHub Pages deployment
1. Extract this ZIP.
2. Upload the CONTENTS to the repository ROOT. Do not create an extra nested `IGERS-POWERCORE/` folder inside the repository.
3. Keep GitHub Pages source on GitHub Actions.
4. Open:
   https://raabdullah59720-igers.github.io/IGERS-POWERCORE/
5. Hard refresh once with Ctrl+Shift+R after deployment.

## Install the app
- Android Chrome/Edge: use `INSTALL APP` when the browser offers the prompt, or Browser menu -> Install app / Add to Home screen.
- iPhone/iPad Safari: Share -> Add to Home Screen.
- Installability requires the secure HTTPS GitHub Pages URL.

## Danger alert testing
Use `Test alert channel` inside the Bangladesh Satellite / Danger Monitor panel. This sends a developer/test notification only. A real DANGER state appears only when the public hazard/anomaly rules are met.


---

## Original file: `QA-BORDER-COMMAND-CALC-2026-10-05.md`

# IGERS Border Command + Calculation QA — 2026-10-05

## Integration
- Existing Air Traffic module preserved.
- Border Command monitor added as an independent section after the existing Air Traffic panel.
- Public Airplanes.live API snapshot is reused for counts and aircraft positions.
- Existing Airplanes.live live map remains available inside the new monitor and via Open Live Map.
- NASA GIBS / Himawari-9 AHI Band 13 public Earth-observation image layer added with 10-minute-slot fallback attempts.
- Existing simulated tower/mobile coverage module remains explicitly labelled simulated / authorized-feed-ready.

## Border flow counters
The monitor now shows:
- Total aircraft received from the regional public API response.
- Aircraft with position data.
- Current aircraft inside the approximate Bangladesh polygon.
- Inbound: outside now, predicted to enter within a 5-minute forward projection.
- Passing: inside now, predicted to remain in-airspace over the next 5 minutes.
- Outbound: inside now, predicted to exit within a 5-minute forward projection.
- Aggregate flow = inbound + passing + outbound.

The flow classification is an interface heuristic based on current public ADS-B-derived state, not a flight-plan or military-intelligence determination.

## Calculation audit
Independent unit checks passed against the exact equations used by the live calculators:
- Road kinetic-energy recovery: 1/2 m(v1²-v2²), km/h→m/s conversion, efficiency after gross loss, annual aggregation.
- Water: rho*g*Q*H*eta with L/s→m3/s conversion, operating hours/day and 365 days/year.
- Footstep: F*stroke*eta with mm→m conversion and annual steps.
- Professional Upgrade hydraulic module: zero installed units now correctly yields zero output rather than silently forcing one.

Default-model audit values:
- Road gross loss: 6076.389 J/event; net recovered: 1215.278 J/event; annual model: 7,089,120.370 kWh/year.
- Water net: 5.15025 kW/site; annual model: 225,580.95 kWh/year.
- Foot net: 1.68 J/step; annual model: 51.10 kWh/year.

## Verification
- All JS files pass `node --check`.
- `npm run build` passes.
- Local HTTP smoke test: 200 for root, index, new JS/CSS, dist index and dist new JS.
- Baseline file content preserved; only additive module files and the intended index/logic patches were added.


---

## Original file: `QA-BORDER-MAP-CONTROL-FINAL-2026-10-05.md`

# IGERS Border Map Control — Final QA
Date: 2026-10-05

## Passed
- Re-audited the supplied PRO-MIL-STYLE-PUBLIC-SATELLITE-BORDER release.
- All project JavaScript files pass Node syntax validation.
- Production static build passes.
- Local HTTP smoke test returns HTTP 200 for root/index, Border JS/CSS and generated dist assets.
- All 179 files from the previous release are preserved; the patch adds only new/updated map-control assets and QA output.
- Border monitor now uses a real geographic Leaflet map with OpenStreetMap tiles centered on Bangladesh.
- Aircraft search results are plotted at the exact latitude/longitude received from the existing Airplanes.live public API snapshot rather than an approximate screen-space projection.
- Bangladesh boundary overlay is displayed on the geographic map.
- Zoom control and a Bangladesh-view recenter control are available.
- Aircraft markers expose status, altitude, speed, track and position in map popups.
- Live aggregate counters show total received, position data, inbound, in-airspace, passing, outbound and total flow.
- Radar search status is driven by the freshness of the public aircraft snapshot; stale/offline data does not remain falsely marked LIVE.
- If Leaflet CDN loading fails, the existing Airplanes.live public live-map iframe is used as a fallback.

## Data semantics
- The radar/search layer is a public ADS-B/MLAT-derived aircraft visualization, not a restricted military radar feed.
- Inbound/outbound/passing are derived from current public position plus a 5-minute forward projection against the Bangladesh polygon; they are not flight-plan or military-intelligence classifications.
- No individual mobile-phone location is collected or inferred.
- Satellite observation uses NASA GIBS/Worldview public Earth-observation imagery.


---

## Original file: `QA-BORDER-MAP-CONTROL-FIX-2026-10-05.md`

IGERS Border Map Control QA — 5 October 2026

Fix: replaced the command-panel aircraft view from pixel-projected markers over a remote iframe with a real Leaflet/OpenStreetMap geographic basemap. Public aircraft results now render as geolocated markers using the exact lat/lon returned by the existing Airplanes.live API snapshot. Bangladesh boundary/zone overlay, zoom controls, Bangladesh recenter control, popups and live counts are included.

The Airplanes.live iframe remains as a fallback if Leaflet CDN loading fails.

Safety/data semantics: public ADS-B/MLAT-derived air traffic only; no restricted military radar or individual phone tracking.


---

## Original file: `QA-FINAL-DEEP-INTEGRATION-2026-09-14.md`

# IGERS-BD-01 — Final Deep Integration QA
Date: 2026-09-14

## Package integrity
- ZIP extracted successfully: PASS
- Production build (`node build.mjs`): PASS
- JavaScript syntax checks: PASS
- Duplicate HTML IDs: 0
- Local asset/reference checks: PASS

## Preserved legacy/core IGERS features
- Energy source map: PASS
- Energy journey / conversion architecture: PASS
- Roads / bridges / water / hybrid applications: PASS
- Sentinel/NOC concept: PASS
- Bangladesh deployment section: PASS
- Environmental/radar/earthquake layer: PASS
- Time engine: PASS
- Weather/location layer: PASS
- Inventor / project identity: PASS
- Engineering limitations/safety section: PASS
- Feedback/customer-care section: PASS

## Live/added systems
- Live Air Traffic: PASS
- Earthquake alert feed + notification UI: PASS
- Satellite connection monitor: PASS
- Airspace Anomaly Monitor: PASS
- Satellite weather/observation visual layer: PASS
- NASA GIBS visual layer: PASS
- NASA EONET disaster intelligence: PASS
- NASA astrography/live-location panel: PASS
- Same-origin provider gateway: PASS
- Provider failure state: HTTP 502 / UPSTREAM_UNAVAILABLE

## Runtime smoke test
Local server started successfully.
Core routes returned HTTP 200:
- /
- /privacy.html
- /terms.html
- /copyright.html
- /nasa-intel.js
- /sw.js

Provider gateway behavior from this isolated environment:
- weather: 502 UPSTREAM_UNAVAILABLE
- USGS: 502 UPSTREAM_UNAVAILABLE
- NASA EONET: 502 UPSTREAM_UNAVAILABLE
- NASA API: 502 UPSTREAM_UNAVAILABLE
- NASA GIBS: 502 UPSTREAM_UNAVAILABLE

These 502 results are expected because this execution environment has no outbound provider connectivity. The app now reports this state honestly instead of presenting stale data as LIVE.

## Conclusion
The new live/remote-data layer is integrated into the same application package and the previous core IGERS features are preserved. No duplicate HTML IDs or broken local references were detected. The only untestable condition here is actual third-party live data retrieval because the test environment blocks outbound network access.


---

## Original file: `QA-RELEASE-VERIFICATION-2026-09-14.md`

# IGERS POWERCORE — Final Complete Release Verification
Date: 14 September 2026

## Release
IGERS-POWERCORE-FINAL-COMPLETE-2026-09-14

## Verified
- Clean extraction and file integrity
- Production build via `npm run build`: PASS
- `dist/index.html` generated: PASS
- Duplicate HTML IDs: PASS (0)
- JavaScript syntax: PASS (`script.js`, `igers-live-enhancer.js`, `server.mjs`)
- Inline application script extraction + syntax check: PASS (after fixing Airspace Monitor string-literal syntax defect)
- Local server startup: PASS
- HTTP smoke test for core/legal/runtime assets: PASS
- Required feature presence: PASS (weather, air traffic, earthquake, satellite, airspace anomaly, energy/network/maintenance/road layers)
- Common secret/private-key marker scan: PASS
- Final source inspection: PASS
- ZIP integrity: PASS

## Live-feed behavior
The UI uses explicit freshness/error states where implemented and does not claim proprietary satellite telemetry. External-feed availability, CORS, quotas and provider changes remain outside the local package test environment.

## Browser limitation
A full browser-rendered test was attempted previously, but the sandbox Chromium policy blocked navigation with `ERR_BLOCKED_BY_ADMINISTRATOR`. No false browser-pass claim is made.

## Release assessment
READY FOR USER-SIDE IMPORT/RUN TESTING. A reproducible inline JavaScript syntax defect in the Airspace Monitor was found and fixed; the final package was rebuilt and the fixed inline script now passes syntax validation.


---

## Original file: `QA-REPORT-2026-10-06.md`

# IGERS POWERCORE — Navigation Build QA (2026-10-06)

## Passed
- ZIP integrity: PASS
- Required local assets (cover + 44-page engineering PDF): present
- Duplicate HTML IDs: none
- Inline JavaScript syntax (`node --check`): PASS for all script blocks
- Navigation panel + map + 3D canvas + controls: present
- `state.navMap` initialization: present before navigation interactions
- Air Traffic / Earthquake / Weather / Alert / Anomaly / Silo / Satellite / Border / Admin panels: present
- Service worker cache includes index, cover and engineering PDF

## Navigation hardening
- Driving uses the public OSRM demo route endpoint.
- Walking/Cycling are explicitly labeled as direct-navigation fallback modes; they no longer pretend to return an OSRM road route.
- When OSRM is unavailable, the UI shows VERIFY + direct distance/bearing and clears ETA instead of keeping stale route data.
- Map click updates destination and triggers navigation calculation.
- Browser geolocation is permission-gated.

## Runtime limitation
The build sandbox could not complete a stable Chromium interactive render against localhost before timeout, and external routing/ADS-B providers may be inaccessible from the sandbox network. The static/runtime wiring was therefore validated by source inspection, syntax checking, DOM-reference checks and package integrity. The app is designed to display LIVE only after a provider responds and VERIFY when it does not.


---

## Original file: `QA-REPORT-NEXTGEN-2026-10-06.md`

# IGERS POWERCORE — NEXT-GEN QA REPORT — 2026-10-06

## Build / syntax
- `igers-nextgen.js`: PASS (`node --check`)
- `time-weather-update.js`: PASS
- `live-indicator-fix.js`: PASS
- `time-energy-repair.js`: PASS
- Existing `script.js`: PASS
- Existing `igers-live-enhancer.js`: PASS
- Offline production build: PASS (`node build.mjs`)

## Static integration
- Missing local HTML/CSS/JS asset references: NONE
- Duplicate IDs across static HTML + new simulation template: NONE
- New Simulation Lab navigation anchor: PRESENT
- Automatic calculation panel: PRESENT
- Local simulation control panel: PRESENT
- Conceptual 3D canvas: PRESENT

## Conceptual model set
1. Road Kinetic Recovery
2. River Current Hydrokinetic
3. Regulator / Low-Head Hydraulic
4. Footstep / Pedestrian Micro-Harvest
5. Bridge / Culvert Energy Node
6. Rail Regenerative Braking
7. Airport PV Canopy + Footstep
8. Hybrid Solar + VAWT Resilience Node
9. BESS + Local Load Sizing

## Calculation integrity spot checks
Independent arithmetic checks were run for the default scenarios. The implemented equations match the intended engineering forms (kinetic, hydrokinetic, hydraulic, footstep, regenerative braking, PV, hybrid wind/PV and BESS sizing).

## Live-provider / browser limitation
The container environment prevented a full Chromium navigation test of the locally served application (`ERR_BLOCKED_BY_ADMINISTRATOR`). Therefore the report does **not** claim a successful full browser interaction run from this environment. Live external providers are still handled by the existing application using explicit LIVE / degraded / offline states rather than invented values.

## Deployment status
The root project and `dist/` build are ready for GitHub Pages upload. Existing modules and files were preserved; the new Simulation Command Center is additive.


---

## Original file: `QA-REPORT.md`

# IGERS POWERCORE — FINAL QA REPORT — 2026-10-06

## Static QA
- JavaScript syntax: PASS (all inline script blocks).
- Duplicate HTML IDs: NONE.
- Missing `$()` DOM references: NONE after final patch.
- Required 3D renderer functions restored: `prepCanvas`, `loop`, `weather3DUpdate`, `air3DUpdate`, `siloUpdate`, `satellite`.
- Required 3D canvases present: Air Traffic, Weather, Anomaly, Silo, Admin.
- Journal cover and 44-page PDF are physically included in `assets/`.
- Service-worker cache bumped to final v3.

## Interactive UI QA (Playwright, mocked external providers)
- All 13 main sections rendered in DOM.
- 5 required 3D canvases initialized with non-zero dimensions.
- Alert Test button produced visible in-app toast.
- Alert toggle changed ON → OFF → ON correctly.
- Admin password `IGERS-2026` unlocked the maintenance console.
- Flight-detail renderer displayed callsign, registration, ICAO hex, altitude, ground speed, track, vertical rate, squawk, latitude, longitude, category and provider.
- Silo recalculation responded to user input and produced a maintenance state/notice.
- Page errors after the final runtime patch: NONE in the mocked-provider browser test.

## External-provider limitation
The sandbox cannot certify live production responses from every public provider because external network access and local HTTP browser navigation are restricted here. The application therefore intentionally uses LIVE/VERIFY/UNKNOWN states rather than fabricating provider output.

## Visual QA
A full-page Playwright render was captured after the final renderer repair. The 3D Air Traffic, 3D Weather, 3D Anomaly, 3D Silo and Administrative 3D canvases rendered as visible interactive graphics.


---

## Original file: `README-BD-TOWER-UPDATE.txt`

IGERS POWERCORE BUILD 2026.10.06-bdtower.1

This release preserves the existing application and adds:
- Bangladesh Satellite / Ground / Air monitor panel
- Mobile Tower Signal & Network Control panel
- Safe monitoring/service-mode controls only; no RF transmitter control
- GitHub Pages cache-bust and service-worker update hardening

Deploy by extracting all repository-root contents, keeping index.html at repository root, and using GitHub Pages -> GitHub Actions.


---

## Original file: `README-INSTALL.md`

# IGERS Live Engineering Indicators — ADD-ONLY — TESTED

This package is an isolated add-on. It does not replace the existing IGERS application and does not intentionally modify existing panels, APIs, localStorage, routes, or other application data.

## Install
Copy `igers-live-indicators/` into the existing repository root, then add before `</head>`:

```html
<link rel="stylesheet" href="./igers-live-indicators/igers-live-indicators.css">
<script src="./igers-live-indicators/igers-live-indicators.js" defer></script>
```

The 12 indicators are explicitly labelled **MODEL / DEMONSTRATION**. They are not claimed as sensor/API live measurements.

## Verification performed
- ZIP integrity check: PASS
- JavaScript syntax check: PASS
- Browser-style DOM runtime harness: PASS
- 12 indicator cards rendered: PASS
- Duplicate-load guard: PASS
- CSS root isolation / selector scoping: PASS
- No fetch / XHR / WebSocket / localStorage / sessionStorage calls: PASS
- Existing-app mutation through routes/history/location: NONE DETECTED

A headless Chromium run was attempted, but the execution environment's Chromium process did not terminate reliably; therefore the browser-harness result above is the runtime verification used for this isolated add-on. No application-source regression claim is made because the complete current IGERS site source is not included in this add-on package.


---

## Original file: `README-START-HERE.txt`

IGERS-BD-01 — SAFE GITHUB PAGES / ACTIONS REPAIR OVERLAY

IMPORTANT
This is the SAFE overlay package for an existing IGERS repository.
It is deliberately designed so your existing index.html and old web-app files are NOT replaced.

1. Extract this ZIP.
2. Copy the .github folder into the ROOT of your existing GitHub repository.
3. Copy the assets folder into the ROOT of the existing repository and allow the supplied IGERS journal/border panel files to overwrite the same-named files.
4. Keep your EXISTING index.html and all existing app files.
5. Make sure GitHub Pages -> Build and deployment -> Source is set to GitHub Actions.
6. Commit/push to main (or master), or run the workflow manually from Actions.

Why this matters:
The current repaired package contained no .github/workflows deployment workflow. If GitHub Pages was configured to deploy from Actions and that workflow was deleted, the existing app could remain in the repository while the Pages deployment stops.

This overlay restores the official Pages artifact/deploy flow without replacing your old app entry point.

The supplied journal/border assets are already QA-hardened and tested independently:
- JavaScript syntax passes.
- Browser smoke test passes with mocked public feeds.
- Journal TOC renders 21 entries.
- Next-page action works.
- Journal search filters correctly.
- Public status refresh is guarded against overlaps.
- Mobile layout has no horizontal document overflow in the test.
- External PDF link uses noopener noreferrer.
- No eval(), new Function(), or document.write().

If you intentionally want a standalone site made only from this package, use the separate STANDALONE package instead.


---

## Original file: `README.old.md`

# IGERS-BD-01 Final Safe Live Enhancer

This is a **drop-in enhancement** for the existing `raabdullah59720-igers/IGERS-POWERCORE` static site.

## What it does

- Adds a clearly visible Bangladesh national-flag visual to the existing first hero section (`#home.hero`).
- Adds a small Bangladesh flag mark beside the existing IGERS brand.
- Keeps the current HTML sections and existing site architecture intact.
- Keeps live clock values updating every second.
- Independently refreshes Dhaka weather/environment data from Open-Meteo.
- Independently refreshes Asia earthquake data from the USGS past-hour GeoJSON feed.
- Independently refreshes Dhaka-region ADS-B aircraft state data from Airplanes.live.
- Uses request timeouts and isolated failures, so one provider outage does not stop the rest of the page.
- Uses only scoped visual CSS injected by the script. It does not add global `section`, `button`, `a`, `header`, `.card`, `.panel`, or `.live` rules.
- Uses no external image file for the flag. The flag is embedded as an SVG data URI, eliminating broken relative paths.

## Install

Upload `igers-live-enhancer.js` to the repository root.

Then, in `index.html`, add **one line only** immediately before `</body>`:

```html
<script src="igers-live-enhancer.js"></script>
```

Do **not** remove the current `style.css`, `styles.css`, `script.js`, or the existing inline script. This file is intended to sit on top of the current application.

## Why this is safer

The current site already contains live-data logic for time, weather, environmental readings, earthquakes, and Airplanes.live aircraft data. This enhancer mirrors those providers with independent, timeout-protected refreshes while preserving the existing element IDs and section structure.

The flag layer is inserted only inside `#home.hero`, with `pointer-events:none`. It cannot become a click-blocking overlay.

## Static QA

Before delivery, this package was checked for:

- JavaScript syntax via Node.js
- balanced template literals/braces/parentheses at source level
- no forbidden broad selectors in the injected CSS string
- no external flag asset dependency
- no DOM rewrite of the navigation or unrelated sections
- only one file required to integrate

## Important live-data limitation

A browser cannot guarantee that an external public data provider is reachable at every moment. When a provider is unavailable, the corresponding panel shows a retry/offline state and the other systems continue operating.

## Current repository context verified

The current IGERS repository already contains `index.html`, `script.js`, `style.css`, `styles.css`, an existing Airplanes.live integration, Open-Meteo weather/environment calls, USGS earthquake polling, and a world/local time engine. The live site also exposes those sections.

This package does not claim to replace those existing systems. It is a safer final presentation + live-refresh layer.


---

## Original file: `README.txt`

IGERS-BD-01 Professional Live Website

Includes:
- Bangladesh, visitor-local and world time
- Live Weather via Open-Meteo with Dhaka fallback
- Live Asia earthquake monitor via USGS GeoJSON
- Live update indicators and independent feed fault isolation
- IGERS professional conceptual, engineering, simulator and deployment sections

Deploy on GitHub Pages as a static site. External live feeds require browser internet access.


---

## Original file: `README_BUGFIX_2026-09-13.md`

# IGERS-BD-01 Bug-Fix Audit — 13 September 2026

Fixed / hardened:
- Browser location detection with safe Dhaka fallback.
- Weather and environment feeds now use the active location coordinates.
- Weather timezone uses the active location (`auto`) instead of always forcing Dhaka.
- Added manual “Use my location” control and clear location/feed status.
- Removed the unused Leaflet CDN reference with a mismatched integrity value.
- Added a dependency-free local server and Windows `START-IGERS.bat` launcher.
- Preserved earthquake, notification, live time, weather, environment, and air-traffic sections.
- Preserved all original images/assets and project identity.

Run locally:
1. Double-click `START-IGERS.bat`.
2. The browser opens at `http://127.0.0.1:4173/`.
3. Allow location permission to use current browser coordinates; otherwise Dhaka fallback remains active.

Note: live external feeds still require internet access and can be unavailable when their public providers are down or browser/network policy blocks them.

## Legal / privacy hardening — 13 September 2026
- Added public `copyright.html`, `privacy.html` and `terms.html` pages.
- Added legal links and copyright line to the main site footer.
- Added a project-specific proprietary notice in `LICENSE` so the bundled Apache-2.0 template license is no longer presented as the project license.
- Privacy notice documents browser geolocation, functional localStorage, notifications and current external live-data providers.
- Terms page explicitly distinguishes conceptual/illustrative engineering information from certified or measured performance and limits reliance on live feeds for safety-critical decisions.


---

## Original file: `REGRESSION-QA-2026-10-08.md`

# IGERS POWERCORE — Full Regression QA — 2026-10-08

Baseline: `IGERS-GITHUB-TOLL-PLAZA-3D-FULL-2026-10-08.zip`

## Restored / preserved panels
- Core IGERS sections and existing system control
- 3D Early Warning / IronDome-style public-data monitor
- Existing Air Traffic panel
- **Separate 3D Air Traffic / Flight Detail panel**
- **Separate Bangladesh Vehicle Movement & Count Monitor**
- **Separate Field Link / Network & Satellite Resilience panel**
- **National Toll Plaza registry with individual 3D-style plaza models**
- National hourly toll-flow seismograph
- Individual plaza hourly mini-seismographs
- RHD/BBA source-link/report layer
- Authorized live toll/ITS feed connector
- Authorized CCTV snapshot/HLS connector
- Chrome/PWA install/download panel
- Existing Border, Satellite, Seismic, Marine, Tower Mesh, Emergency, Weather, Time, Energy, Analytics and other sections

## Automated checks
- External JavaScript syntax: PASS
- Inline JavaScript syntax: PASS (13 inline blocks)
- Duplicate HTML IDs: PASS (0 duplicates)
- Missing local references: PASS (0)
- Required runtime files: PASS
- Local HTTP resource test: PASS (index + manifest + service worker + new modules = HTTP 200)
- ZIP integrity: PASS
- Compact deployment remains below GitHub browser-upload file limit

## Runtime note
The container could serve every module over HTTP, but the large page did not reliably finish Chromium `--dump-dom` within the sandbox timeout. This does not invalidate static syntax/reference checks; external live-provider availability still depends on the user's browser/network/provider access.

## Data integrity
- No private government CCTV is scraped or bypassed.
- Live counts are only marked live when supplied by a public/authorized feed.
- Reference/estimated values remain explicitly labeled.
- ADS-B data is read-only visualization; no weapon/target control is implemented.


---

## Original file: `RUNTIME-QA-2026-10-06.md`

# IGERS POWERCORE — RUNTIME QA — 2026-10-06

## Browser DOM smoke test
Actual application HTML + bundled local JavaScript modules were executed in Chromium with external providers mocked only at the network boundary.

- Page errors: 0
- Console errors/warnings: 0
- Duplicate IDs: 0
- Day/Night toggle: PASS (Day -> Night/Day label transition)
- Border Monitor section: PRESENT
- Border 3D canvas: INITIALIZED
- Border Radar 3D canvas: INITIALIZED
- Salah prayer grid: POPULATED (Fajr, Dhuhr, Asr, Maghrib, Isha)
- Qibla indicator: POPULATED (278° W for Dhaka fallback)
- Data Analysis panel: RENDERED
- Existing major monitor sections: PRESENT

## Provider test policy
External network responses were mocked only for deterministic runtime testing. Production provider availability is still represented by the app's LIVE / VERIFY / OFFLINE logic.

## Environment limitation
Direct Chromium navigation to local file/localhost pages is restricted in the execution environment. The runtime result above therefore verifies the actual bundled DOM/JavaScript execution path without claiming production-network availability.


---

## Original file: `SATELLITE_MODULE_AUDIT_2026-09-13.md`

# IGERS Satellite & Disaster Intelligence Module — Audit
Date: 2026-09-13

## Added
- Independent `Satellite & Disaster Intelligence` section.
- Bangabandhu-1 public orbital-data monitor retained.
- Official BMD source navigation for satellite imagery, radar, cyclone and warnings.
- HIMAWARI / FY-2 source navigation labels based on BMD public satellite products.
- Map/navigation view with OpenStreetMap handoff and browser-location support.
- Source clock / UI sync indicator.

## Isolation
- Existing Air Traffic Management is not replaced or rewritten by the satellite-intelligence UI.
- Airspace Safety remains a separate module.
- Weather, earthquake and Comments/Customer Care modules remain separate.

## Validation
- `npm run build`: PASS
- Duplicate HTML IDs: 0
- Broken internal hash targets: 0
- Inline JS syntax: PASS
- `igers-live-enhancer.js`: PASS
- `upgrade.js`: PASS
- Production server critical routes: HTTP 200
- Built `dist` contains the satellite module and controls.

## Data accuracy notes
- BMD official satellite/radar/warning pages are used as source-navigation destinations rather than fabricating government operational feeds.
- Bangabandhu-1 connection status represents public orbital-element data connectivity, not spacecraft telemetry, imagery, or government control.
- Disaster severity/warnings should be verified against the official BMD source.


---

## Original file: `SATELLITE_WEATHER_RESTORE_2026-09-14.md`

# IGERS Satellite Weather & Disaster Intelligence Restore

Restored on 14 September 2026.

## Restored capabilities
- Dedicated Satellite & Disaster Intelligence section (`#satelliteIntel`).
- Bangladesh-focused satellite navigation layer.
- HIMAWARI / FY-2 satellite product navigation via Bangladesh Meteorological Department (BMD).
- BMD weather radar, cyclone and warning navigation.
- NASA GIBS near-real-time MODIS Earth-observation image panel for Bangladesh (`MODIS_Terra_CorrectedReflectance_TrueColor`).
- Satellite observation freshness/error state; unavailable imagery is not labelled LIVE.
- Existing Open-Meteo weather forecast remains separate from satellite observation.
- Existing Bangabandhu-1 public orbital-element connection monitor remains separate from satellite imagery.
- Existing Air Traffic, Earthquake and Airspace Safety systems remain independent.
- Location-aware OSM navigation control restored for the satellite intelligence section.

## Accuracy rule
Satellite imagery is presented as Earth observation. Forecast weather remains a weather-model feed. Bangabandhu-1 status is public orbital-element data, not private spacecraft telemetry or control.

## Validation
- `node --check script.js`: PASS
- Inline application script syntax: PASS
- Duplicate HTML IDs: 0
- Satellite section count: 1
- NASA GIBS image source present: YES
- HIMAWARI source navigation present: YES
- BMD satellite/radar/warning links present: YES
- Existing live feature markers preserved: YES
- Offline production build: PASS


---

## Original file: `TOLL-NATIONAL-QA-2026-10-08.md`

# Toll National QA — 2026-10-08

Baseline: IGERS-POWERCORE-main (10).zip
Baseline IDs: 353
New IDs: 374
Baseline IDs removed: 0
New Toll IDs added: 21

QA:
- JS syntax: PASS for all project JS modules
- Python relay py_compile: PASS
- Toll runtime simulation stub: PASS
- Toll event bridge runtime (`igers:vehicle-flow`): PASS
- Duplicate IDs: 0
- Missing local references: 0
- Local HTTP smoke: PASS (index, Toll JS/CSS, SW, manifest, Python relay, launcher)
- ZIP integrity: PASS

Official data references:
- RHD Traffic Insight Hub supports 1st 24-hour, 2nd 24-hour and 48-hour report generation.
- RHD Online Road Network publishes source-verified toll-plaza LRP/location records used in this module.
- BBA public site is linked for bridge/tunnel toll authority reference.

Live-data rule: the module marks data LIVE only when a public or operator-authorized feed actually returns values. No private CCTV or protected system is bypassed.


---

## Original file: `TOLL-NATIONAL-UPDATE-README.txt`

IGERS POWERCORE — National Toll Intelligence Update

Existing IGERS POWERCORE app preserved; 15-entry National Toll Intelligence module added as an independent panel.

Features:
- Individual 3D-style result/model for each source-verified RHD/BBA entry in the build.
- National toll-plaza map visualization.
- Separate plaza-by-plaza traffic-flow panel.
- Hourly national traffic seismograph stored locally from observed/authorized flow.
- Authorized Toll/ITS JSON feed support and event-bridge support (`igers:toll-traffic`, `igers:vehicle-flow`).
- CSV report download.
- Local Python same-origin relay at `/api/tollplazas` to reduce browser CORS problems.
- Explicit LIVE / REFERENCE / SIMULATION status. Simulation is never labeled live.

GitHub Pages: extract the ZIP and upload contents to repository root; keep index.html at root.

Python live mode: set IGERS_TOLL_FEED_URL to an operator-authorized JSON endpoint, run RUN-TOLL-LIVE-RELAY.bat, then open http://127.0.0.1:8765/.


---

## Original file: `UI-VISUAL-DATA-UPGRADE-2026-10-06.md`

# IGERS POWERCORE — UI / Visual / Data Analysis Upgrade

## Preserved baseline
This package is an additive upgrade to the existing IGERS POWERCORE application. Existing panels, live-data modules, calculations, legal pages, Border Monitor, Salah/Qibla, Air Traffic, Seismic, Marine, Satellite and system controls are preserved.

## New UI capabilities
- Persistent **Day / Night mode** with browser/system preference on first load.
- Theme choice is stored locally as `igers-theme` and survives reloads.
- Subtle **3D depth / perspective interaction** on cards and major visual surfaces.
- Lightweight visual sheen and improved elevation for existing 3D panels.
- Respects `prefers-reduced-motion`.

## New Data Analysis panel
- **System Health** score is computed from existing system-state indicators.
- **Nominal stream count** and **degraded/fallback count** are derived from current UI states.
- Source-health matrix covers Time, Weather, Environment, Earthquake, Air Traffic, Satellite, Border and Energy.
- Trend graph is a visual history model derived from the current system-health score; it is explicitly labelled as modelled and does not represent fabricated sensor telemetry.
- Refresh timestamp is local browser time.

## QA
- JavaScript syntax: PASS for all app JS files.
- Duplicate HTML IDs: none.
- Missing local HTML script/link references: none.
- Bangladesh fallback GeoJSON: valid FeatureCollection with one feature.
- New theme button and analytics section present.
- New CSS/JS resources return HTTP 200 from a local static server.

## Browser verification note
The execution environment's Chromium process was unable to complete a reliable headless graphical session and timed out. Source/static checks and HTTP resource checks were therefore used as the authoritative QA for this visual-only additive layer. Existing external provider limitations remain unchanged.


---

## Original file: `UPGRADE-ONLY-RELEASE-2026-09-22.md`

IGERS-BD-01 — Upgrade-Only Release
Date: 22 September 2026

This package preserves the existing IGERS website/application and adds a non-destructive presentation upgrade. No existing project files were removed.

Verified changes:
- Existing core script/main module hashes preserved.
- Added designer.css + designer.js presentation layer.
- Existing index.html, styles.css and package metadata updated only for the upgrade integration.
- No duplicate HTML IDs detected (143 IDs / 143 unique).
- Production build completed through the project's offline-safe build script.
- Local HTTP smoke test passed for /, /index.html, /privacy.html, /terms.html, /copyright.html and /manifest.webmanifest.

Important: live external providers (NASA/weather/ADS-B/etc.) remain dependent on their public network availability. The package does not fake external connectivity.


---

## Original file: `UPGRADE-REPORT-2026-10-03.md`

# IGERS-BD-01 — Future Upgrade QA Report

## Baseline
The latest complete IGERS website package available in the persistent Library was used as the working baseline: `IGERS-POWERCORE-FINAL-VERIFIED-2026-09-14.zip`. The newer 2026-10-03 `IGERS-POWERCORE-main (6).zip` referenced in the request was not present in the Library index available to this run, so this release does **not** claim to be a byte-for-byte modification of that missing archive.

## Additive upgrades
- Bangladesh Mobile Tower Radar — isolated panel, simulated demo nodes, region filter, node/link controls, radar animation, tower information cards.
- IGERS Future Upgrade Control Center — per-module ON/OFF states with ACTIVE / INACTIVE / SIMULATION / UNAVAILABLE status semantics and local persistence.
- Administrator authentication prototype — masked password input, session login/logout, failed-login message, activity log, admin-only controls.
- Master and individual machine controls — simulation-only, persistent UI state, confirmation before Master OFF.
- GitHub Pages/static compatibility — relative assets and `.nojekyll` retained.

## Data integrity
No real mobile-tower coordinates are presented as verified. The tower panel explicitly uses `SIMULATED DEMONSTRATION` nodes.

## Security limitation
`MIM2005` is implemented as requested for the prototype, but browser-side/static authentication is not production-grade security. Physical machine control is not claimed; controls only modify simulated browser state.

## Automated checks performed
- ZIP extraction and file inventory.
- Required `index.html` present in repository root and `dist/`.
- New JS/CSS files present in both root and `dist/`.
- Relative script/style references inserted.
- Existing root `.nojekyll` and `dist/.nojekyll` retained.
- JavaScript syntax check with Node.js.
- Static HTML reference check for new assets.
- Final ZIP re-extraction and integrity check.

## Tests not possible
- Real GitHub Pages deployment from this environment.
- Browser visual interaction/console testing with a full browser automation stack.
- Verification of real mobile-tower locations or private operator databases.
- Physical hardware control.
- Any external live API requiring credentials.

## Remaining limitation
For an exact upgrade of `IGERS-POWERCORE-main (6).zip`, that exact archive must be available in the Library or attached to the conversation. This release instead uses the latest complete Library website baseline available during the run.


---

## Original file: `UPGRADE-REPORT-2026-10-05-DEEP-3D-LIVE-BORDER.md`

# IGERS POWERCORE — Deep 3D Border Zone Additive Upgrade

Date: 5 October 2026

Baseline: `IGERS-POWERCORE-main (8).zip`

## Delivered

- Added separate `Border Zone 3D Ground + Air Monitor`.
- Added public NASA GIBS Earth-observation image layer.
- Added public ADS-B-derived air-state visualization by reusing the existing Air Traffic snapshot.
- Added non-identifying aggregate/demo mobile signal / coverage layer.
- Added 3D-style radar sweep, ground sectors, satellite link visualization and live health states.
- Added layer controls and satellite refresh control.
- Preserved the existing panels and modules.

## Refresh model

Local visuals use `requestAnimationFrame()` for continuous rendering. External data uses provider-safe schedules or existing module data rather than pretending that internet providers can be polled every nanosecond.

## Important engineering/data boundary

A website cannot legitimately access private mobile-phone locations, telecom subscriber data, military border radar or restricted security feeds without authorized infrastructure and credentials. This release therefore uses only public/authorized-safe data semantics and clearly labels simulation/aggregate layers.


---

## Original file: `UPGRADE-REPORT-2026-10-05-DEEP-3D-LIVE.md`

# IGERS POWERCORE — Deep 3D Live Calculation Upgrade

Date: 5 October 2026

## Scope
This is an additive upgrade to the supplied `IGERS-POWERCORE-main (7).zip` baseline. Existing panels and modules were preserved; the new layer is linked into the existing page without replacing the existing calculation, weather, location, air-traffic or satellite modules.

## Added
- Consolidated **Calculation Results Console** linked to the existing Energy, Water Flow and Footstep input fields.
- **Calculate & View Results** action with validation and a consolidated engineering snapshot.
- New **IGERS FRAME-LIVE 3D MONITOR** positioned immediately after the existing satellite connection section.
- CSS-based 3D satellite/orbit visualization with live connection, latency and element-age display sourced from the existing satellite panel.
- Frame-live 3D instrument modules for road energy, water flow, footstep harvesting, weather/time, combined output and location status.
- Local calculation values update on every browser animation frame while result text is rate-limited for performance.
- Satellite connection manager button delegates to the existing satellite refresh function.

## Refresh semantics
A browser cannot perform a real external network refresh every nanosecond. JavaScript and public data providers operate on millisecond/second-scale scheduling. The upgrade therefore uses `requestAnimationFrame()` for local visual/calculation updates (normally ~60–144+ FPS depending on display/browser) and keeps external feed refresh at provider-safe cadence.

## QA performed
- JavaScript syntax checks: all project `.js` files pass `node --check`.
- New module syntax check: pass.
- HTML duplicate-ID audit: 193 IDs, 193 unique in the supplied baseline after integration.
- Local asset reference audit: no missing local script or stylesheet references detected.
- Production build: pass using the project's offline-safe `build.mjs` path.
- Local server smoke test: `http://127.0.0.1:4173/` returned HTTP 200.

## Browser QA limitation
A full headless Chromium DOM interaction run was attempted, but the page's long-running live timers/external feed behavior prevented a clean bounded `--dump-dom` completion in this environment. Static/source/build validation passed; no claim is made that a full end-to-end browser test was completed here.

## Engineering disclaimer
All energy values remain conceptual/calculation-model outputs and are not physical sensor telemetry. Satellite connectivity refers to public orbital-element data and does not imply spacecraft telemetry or spacecraft control.


---

## Original file: `UPGRADE_AUDIT_2026-09-14.md`

# IGERS POWERCORE Live Systems Upgrade Audit — 2026-09-14

## Baseline preserved
- Live Air Traffic / ADS-B module remains in place.
- Earthquake alert system remains multi-source (USGS + EMSC).
- Bangabandhu-1 satellite connection monitor remains isolated from Air Traffic and Airspace Safety.
- Bangladesh Airspace Anomaly Monitor remains a separate public-data heuristic layer.
- Weather, location, privacy, terms, copyright and the rest of the IGERS interface are preserved.

## Accuracy / efficiency changes
### Air Traffic
- Live status is now freshness-aware instead of treating any successful HTTP response as LIVE.
- `<=45 s` newest position: LIVE.
- `46–120 s`: DEGRADED.
- `>120 s`: STALE.
- Feed outage: OFFLINE.
- Status explicitly identifies Airplanes.live as the provider.

### Earthquake
- USGS feed `metadata.generated` is used for source freshness when available.
- `<=3 min`: LIVE / freshness verified.
- `3–10 min`: DEGRADED.
- `>10 min`: STALE.
- If both sources are unreachable: OFFLINE and no alert is inferred.
- USGS + EMSC remain separate sources and are deduplicated for display.

### Satellite
- CelesTrak GP data remains on a low-cadence refresh aligned with the provider's published 2-hour GP update interval.
- The indicator now describes the dataset as CURRENT/STALE rather than pretending it is spacecraft telemetry.
- Orbit-element epoch age is used for freshness.
- Official BMD satellite/radar navigation is surfaced without fabricating a BMD machine-readable feed.

### Airspace Anomaly Monitor
- Adds public emergency transponder-code awareness (7700/7600/7500) as a notice.
- Raises the speed outlier threshold and requires stronger combined conditions before an unverified high-altitude target becomes a higher-severity outlier.
- The module continues to state that ADS-B public data cannot confirm hostile, stealth or hypersonic objects.
- Feed failure never creates a danger notice.

## Local QA
- `npm run build`: PASS
- JavaScript syntax checks: PASS
- Duplicate HTML IDs: 0
- HTTP smoke tests: `/`, `/privacy.html`, `/copyright.html`, `/terms.html`, `/manifest.webmanifest`, `/sw.js` => HTTP 200
- Required production assets present: PASS

## External-source verification note
This build uses public providers whose current documentation was checked on 2026-09-14. The isolated container used for packaging does not have outbound network access, so no claim is made that the live third-party APIs were successfully queried from inside the packaging runtime.


---

## Original file: `UPGRADE_NOTES_2026-09-13.md`

# IGERS-BD-01 upgrade package

- Fixed the missing Bangladesh flag overlay by actually loading the enhancer and using a local SVG asset with isolated layering.
- Kept the existing weather, time and Airplanes.live systems intact.
- Upgraded earthquake monitoring to a multi-source USGS + EMSC browser feed with timeout isolation, deduplication, visibility-aware polling and notification de-duplication.
- Satellite/remote-sensing note: satellites can support earthquake mapping/coseismic deformation analysis, but they are not a safe substitute for a primary real-time seismic warning feed. This package therefore does not falsely claim satellite-based instant earthquake prediction.
- Existing interface remains informational and is not an official Bangladesh earthquake warning service.


---

## Original file: `UPGRADE_PRO_RELEASE_2026-09-22.md`

# IGERS-BD-01 Professional Upgrade Release — 2026-09-22

This release is additive. Existing IGERS panels, live-data modules, legal pages, graphics and project identity are preserved.

## New panels
- IGERS Command Center: core integrity scan, system status, event console, refresh, JSON snapshot export.
- Engineering Lab: hydro/flow recovery conceptual power and energy estimator.
- Engineering Lab: roadside solar harvesting conceptual estimator.
- System-flow visualization: source → recover → convert → store → apply.
- Analytics & Research Library: validation pathway and measured/estimated/live data distinction.
- New navigation entries for Command Center, Engineering Lab and Analytics.
- Dependency-free implementation for GitHub Pages performance.

## Deployment
- `index.html` remains at repository root.
- `.nojekyll` remains present.
- The custom `CNAME` file is intentionally absent so this release can use the GitHub project-page URL directly.
- Existing live-data APIs remain independent from the new panels.

## Engineering note
The new calculators are conceptual estimation tools. They do not represent measured field performance. Future measured/experimental data can be connected without changing the UI architecture.


---

## Original file: `VOICEMAIL-FULL-APP-AUDIT-2026-09-15.md`

# IGERS POWERCORE — Public Voicemail + Full Feature Audit

Date: 15 September 2026

## Base package
This build uses the IGERS-POWERCORE NASA GIBS live-indicator package as the base so existing live/environmental/satellite modules remain present.

## Added
- Public Voicemail recorder in the Comments / Care area.
- Maximum recording duration: 60 seconds.
- Browser preview, stop, discard and publish controls.
- Shared public feed through `/api/voicemails`.
- Public audio playback through `/api/voicemails/:id/audio`.
- MIME validation, 7 MB audio limit and basic per-connection rate limiting.
- Privacy/terms notes for public recordings.

## Existing feature verification
Verified in source package:
- IGERS-BD-01 identity and project title.
- Inventor / author: Abdullah Al Rafi [BD].
- Concept / invention date: 14 August 2026.
- Weather / Open-Meteo.
- Environmental and earthquake feeds.
- Air traffic / Airplanes.live.
- Airspace safety monitor.
- Satellite connection / Bangabandhu-1 public orbital-data context (NORAD 43463).
- NASA GIBS imagery and NASA GPM precipitation panel.
- Comments / Customer Care.
- Copyright / Privacy / Terms pages.

## QA checks
- `node build.mjs`: PASS.
- JavaScript syntax checks: PASS.
- Server syntax check: PASS.
- Duplicate HTML IDs: PASS (none found).
- Home-page HTTP smoke test: PASS.
- Voicemail GET feed: PASS.
- Voicemail POST/upload: PASS.
- Voicemail audio retrieval: PASS.
- Uploaded recording appears in shared feed: PASS.
- ZIP integrity test: PASS.

## Deployment note
Shared/public voicemail requires the included Node server (or an equivalent backend implementing the same API). A static-only hosting environment cannot persist cross-user voice recordings by itself.


---

## Original file: `WEATHER-3D-DIGITAL-UPGRADE-2026-10-06.md`

# IGERS POWERCORE — Digital 3D Weather Upgrade

This additive upgrade converts the Weather panel from an analog/emoji presentation into a digital 3D atmospheric console.

Included:
- Procedural 3D-style sky/depth scene with horizon grid, clouds, sun/moon, wind vectors and precipitation particles.
- Live values bound to the existing Open-Meteo weather engine; no duplicate provider or fabricated sensor values.
- Digital temperature, humidity, wind, precipitation, condition and direction HUD.
- Hourly forecast strip synchronized from the existing weather-hourly stream.
- Night/Day theme compatibility.
- Reduced performance footprint: capped animation geometry and 2x device-pixel ratio.
- Existing Weather API/location logic, Weather live-indicator and all other IGERS panels remain intact.
- Service-worker cache version bumped to v7.

QA:
- All inline script blocks pass Node syntax checking.
- All standalone JavaScript files pass Node syntax checking.
- Upgrade is additive and does not replace the existing Weather API/data flow.


# Consolidated legacy upgrade reports and integration snippets


## Archived source: BUGFIX-VERIFY-REPORT.md

# IGERS POWERCORE 12-Module Upgrade · Post-Audit Fix Report

Date: 2026-10-09
Package: `IGERS-POWERCORE-12-UPGRADE-GITHUB-PAGES.zip` (post-audit corrected build)

## Bugs corrected in this pass

1. **Simulation reset feedback:** Reset restored the scenario but immediately overwrote its confirmation text. Reset now redraws the scenario and then shows an accurate reset confirmation.
2. **Map fallback status:** the unified map replaced GeoJSON load-failure details with a generic fallback message. The visible status now preserves the bundled GeoJSON load/error detail and separately names the schematic fallback.
3. **Diagnostics robustness:** malformed percent-encoded hash links can no longer abort diagnostics; local resource probes time out after 8 seconds; unexpected errors are reported and the diagnostics busy lock is released in `finally`.
4. **Command Center source count:** known simulation and local-model states are now counted as observed states.
5. **Degraded/stale KPI:** runtime JavaScript errors are no longer incorrectly added to the degraded/stale provider count; runtime errors have their own counter and alert path.
6. **Unknown status classification:** explicit `unknown`, `n/a`, `not exposed`, `not reported`, and `no data` labels stay `unknown` rather than being misclassified as warning.
7. **Cache invalidation:** command-center script URL and service-worker revision were bumped to `powersuite12-v3`.

## Validation plan/results

Final run results: JavaScript/MJS 45/45 syntax checks passed; inline scripts 13/13; CSS 6/6 parse checks; HTML 563 IDs with no duplicates; 40/40 hash targets resolve; 14/14 local page references resolve; JSON/manifest/GeoJSON parse checks passed; Python 4/4 scripts compile; air-traffic relay self-test passed; physics/status/coordinate model tests 20/20; `npm run build` passed; local HTTP smoke test 22/22 routes returned HTTP 200; final ZIP integrity passed with 90 files, below the 98-file limit.

Browser automation is blocked by the current workspace browser policy, so this report does not claim a completed full visual browser test or verified live public-provider connectivity.



## Archived source: FULL-PANEL-AUDIT-REPORT.md

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



## Archived source: POWERCORE-12-UPGRADE-REPORT.md

# IGERS POWERCORE · 12-Module Upgrade & Validation Report

Build date: 2026-10-09 (post-audit bugfix pass)
Baseline: `IGERS-POWERCORE-FULL-PANEL-AUDITED-GITHUB-READY.zip`

## Added modules

1. **Unified Command Center** — 3D-style animated globe, source-state KPIs and consolidated quick overview.
2. **Live Data Integrity Center** — provider/source status, observation age where timestamp exists, and explicit unknown/fallback states.
3. **Unified Bangladesh Map** — bundled GeoJSON boundary/rivers, airport reference markers and valid coordinates from the existing public ADS-B payload when exposed.
4. **IGERS Energy Laboratory** — kinetic-energy reduction, wind, hydro and solar estimate models with visible assumptions and input validation.
5. **Smart Alert Center** — local alerts derived from exposed offline/stale/error states and browser runtime errors; acknowledgement is device-local.
6. **System Diagnostics** — internal hash links, duplicate IDs, required sections/scripts, core local resources and service-worker API checks.
7. **Report Generator** — JSON and CSV snapshots plus browser Print / Save as PDF.
8. **Personalized Dashboard** — locally pinned panel shortcuts and compact layout preference.
9. **Mobile App Experience** — browser install prompt when available, standalone/service-worker/network status and Android installation guidance.
10. **Simulation Training Lab** — 3D-style runway, energy-flow and map-scan visual scenarios with run/pause/reset/speed controls. Scenarios are labelled simulations.
11. **Admin & Audit Center** — selected non-sensitive UI action log in local browser storage; it is not server-side security/audit.
12. **Performance & Offline** — network/visibility/data-saving indicators, low-motion and compact-card controls, and local runtime error count.

The three new workspaces are linked in navigation as **Command Center**, **Engineering & Simulation Lab**, and **Operations & App Health**. Existing menu groups and panel destinations remain available.

## Calculation and data-integrity notes

- Kinetic-energy reduction is displayed as **kJ/event**, not power; the annual energy estimate uses the user-entered events/year.
- Wind output uses `P = 0.5 × ρ × A × v³ × Cp × η`; Cp is constrained to the ideal Betz limit of 0.593 and annual energy uses the entered operating hours.
- Hydraulic output uses `P = ρ × g × Q × H × η`; annual energy uses entered operating hours.
- Solar output uses `P = irradiance × area × module efficiency × system derate`; annual energy uses entered peak-sun-hours/day and days/year.
- All new energy results are **assumption-based estimates**, not measured site readings or feasibility certification.
- Unknown external provider statuses remain unknown. The dashboard does not convert missing data into healthy/live status.
- Airport locations are reference markers. Aircraft are drawn only from valid coordinates already exposed by the public ADS-B payload. Simulated visuals never enter the live aircraft list.
- Audit history, favorites, acknowledgement and interface settings are browser-local. Front-end session gating on static GitHub Pages is not production-grade authorization.

## Regression and build validation

- Original baseline paths: 86.
- Removed original paths: 0.
- Initial 12-module integration changed the existing `index.html` and `sw.js`; this post-audit fix pass additionally updates `powercore-command-center.js` for diagnostics, reset-feedback, map-status and KPI accuracy.
- New runtime assets: `powercore-command-center.css` and `powercore-command-center.js`.
- Validation report added: this file.
- HTML IDs: 563; duplicate IDs: 0.
- Internal hash links: 40; missing targets: 0.
- Local asset references: no missing paths detected.
- Inline JavaScript syntax: 13 blocks passed.
- JavaScript/MJS syntax: 45 files passed.
- CSS parser checks: 6 stylesheets passed.
- JSON/package/manifest/GeoJSON: parsed successfully.
- Pure-model/status/coordinate tests: 20/20 passed, including unit correction, energy formulas, annualization assumptions, Betz Cp limit, input bounds, coordinate validation, and stale/offline classification.
- Static production build: `npm run build` passed using the repository's offline-safe `build.mjs` fallback because local Vite dependencies are not installed in this workspace.
- Final local HTTP smoke test: 22/22 routes returned HTTP 200.
- Final post-audit delivery ZIP: 90 files, below the 98-file repository limit. The only new path added during the final bug-fix pass is `BUGFIX-VERIFY-REPORT.md`.

## Not verified in this workspace

Chromium headless attempts timed out before producing a screenshot, so full browser visual/interaction testing was not completed. External APIs, NASA tile delivery and live aircraft/weather/seismic feeds were not independently confirmed live. Run **Operations & App Health → Run diagnostics** after deploying to GitHub Pages; then check each provider's own timestamp/status in its original panel.

## GitHub Pages upload

1. Extract the ZIP.
2. Upload the extracted contents to the root of the existing `IGERS-POWERCORE` repository and overwrite files with the same names.
3. Keep `index.html` in the repository root and keep the `data/` directory intact.
4. Commit the changes and wait for GitHub Pages deployment to finish. The final command-center JavaScript query string and service-worker revision are `powersuite12-v3`; the command-center stylesheet query is `powersuite12-v2` for cache/update detection.
5. Open the existing Pages URL and hard-refresh (`Ctrl+F5`) once after deployment.

The ZIP is a website source/deployment package, not an Android APK.


## Thesis 3D Concept Lab update (2026-10-09)

Added an interactive, local SVG-based concept visualizer inside the existing `#concept` section with four isometric scenes: integrated source-to-storage architecture, roadway/kinetic recovery, controlled hydraulic recovery, and solar/airflow support. It preserves the existing IGERS `#concept` and `#concept3d` IDs and calculators. Each scene is explicitly marked as conceptual, not to scale, and not proof of measured output. Added responsive styling, accessible scene selectors, a conceptual energy-flow chain, and a service-worker revision bump.

## Final thesis visual package verification (2026-10-09)

- Added 4 local, original SVG concept illustrations: integrated IGERS architecture, road/kinetic recovery, controlled hydraulic recovery, and solar/airflow support.
- Added `thesis-concept-lab.css` and `thesis-concept-lab.js`; the gallery is embedded inside the existing `#concept` section and uses accessible scene buttons plus keyboard arrow navigation.
- Existing section IDs and existing calculator `#concept3d` remain intact. No remote image source or additional runtime library is required.
- The illustrations are conceptual, not to scale, and do not imply measured performance, verified deployment or guaranteed recovery yield.
- Checks: 571 unique HTML IDs; no duplicate IDs, broken internal anchors or missing local references; 13 inline scripts syntax checked; 46 JS/MJS files parsed; 7 CSS files parsed; JSON/manifest/GeoJSON parsed; 4 SVGs parsed and rendered for visual review; concept gallery interaction checks 7/7 passed; production static build succeeded; local HTTP smoke test 18/18 routes returned HTTP 200.
- Full in-browser visual/interaction testing of the entire application was not available in this workspace. External live data provider availability was not verified by this package check.

---

## Follow-up bug-fix audit · 9 October 2026

### Confirmed fix
- Corrected malformed markup in the Weather section: an extra closing `div` had closed the responsive wrapper before the weather cards. The Weather digital stage and the detailed weather cards now remain inside the same `.wrap` container.
- Bumped the Thesis Concept Lab CSS/JS query versions and service-worker revision from `thesis3d-v1` to `thesis3d-v2` so deployed clients can detect the updated release.

### Validation performed
- Production static build via `npm run build`: passed (offline static fallback mode; Vite dependencies were not installed in this environment).
- JavaScript/MJS syntax: 46 files passed; service-worker syntax passed.
- Inline JavaScript syntax: 13 scripts passed.
- HTML parsing: 0 parser errors after the Weather wrapper correction.
- HTML IDs and internal anchors: 571 IDs, no duplicate IDs; 41 internal anchors, no missing targets.
- Local HTML asset references: no missing files.
- CSS parsing: 7 stylesheets, no parser errors.
- JSON, SVG and GeoJSON parsing: passed; Bangladesh fallback GeoJSON contains 93 features with no coordinate-range issues.
- Python compilation: 4 scripts passed.
- Concept Lab mock-runtime test: 15 assertions passed (default scene, four scene selections, ARIA selection, keyboard navigation, local image load/error states and initialization guard).
- Local HTTP smoke test: 18/18 main routes returned HTTP 200, including all four thesis SVGs, CSS/JS, service worker, manifest, Bangladesh fallback GeoJSON, PWA icons and runway assets.

### Limitations
- Chromium screenshot/navigation timed out in this environment, so full visual browser testing was not confirmed.
- External live-data providers were not exhaustively tested; their availability depends on network/provider status.
- Final GitHub Pages publication has not been performed from this environment.

## Thesis Concept Lab live-style visual layer update (2026-10-09, v3)

- Added an animated canvas overlay on the four local isometric thesis illustrations. It draws scene-specific conceptual energy-flow paths, glowing particles/nodes and a subtle scan band. The overlay is explicitly labelled as a live concept simulation; it does not claim live sensor telemetry or measured kW output.
- Added simulation controls: Play/Pause, Reset, 0.5x/1x/1.5x/2x speed, a simulation clock, active conceptual stage, and selected animation rate. Scene switching resets the simulation cycle and maintains accessible `aria-pressed` states.
- Added subtle pointer-driven perspective tilt for fine-pointer devices, reduced-motion handling, pause while the document is hidden, and automatic resume when returning to the tab. If Canvas is unavailable, the static conceptual illustration remains and the control is disabled with a status explanation.
- Retained all four local SVG scenes and the existing Thesis Concept Lab, calculator panels, and original navigation identifiers. No external image API or new runtime dependency was added.
- Cache/update revision bumped to `igers-2026-10-09-thesis3d-v3`; concept CSS/JS URL query strings now use `thesis3d-v3`.

### Validation
- JavaScript/MJS syntax: 46 files passed; inline scripts: 13 passed.
- HTML parsing: 0 parser errors; 582 IDs with no duplicates; 41 internal links with no missing targets; no missing local assets.
- CSS: 7 stylesheets parsed without syntax/declaration errors; JSON, GeoJSON and SVG XML parsed.
- Concept simulation mocked-runtime checks: 14/14 passed, including scene switches, ARIA state, pause, reset, speed, resume, hidden-tab pause/resume and keyboard navigation.
- Production static build: `npm run build` passed; the built output contains the new Concept Lab files and matching v3 cache revision.
- Local HTTP smoke test: 19/19 routes returned HTTP 200, including all four SVGs, Concept Lab CSS/JS, service worker, manifest, Bangladesh GeoJSON, PWA icons, command center assets, and runway simulator assets.
- Source package remains 96 files, below the 98-file limit. Temporary `dist/` build output is excluded from the GitHub upload ZIP.

### Limitations
- This is a live-style 2.5D animated visualization layered over isometric conceptual illustrations, not a physical 3D engineering solver. Movement represents illustrative flow only, not measured energy or real sensor events.
- Browser screenshot/visual test of the entire app could not be completed in this environment, and public external providers were not independently verified live.

## Thesis Concept Lab animated 3D-style live visualization (v3 final verification)

- Added a scene-synchronized Canvas overlay on top of each isometric concept SVG: animated dotted energy routes, glowing moving particles, pulsing junction nodes, and a subtle scanning band.
- Added subtle pointer-based perspective tilt on fine-pointer devices. Reduced-motion preference starts the lab paused; the user can explicitly resume it. Animation pauses when the tab becomes hidden and resumes when visible again.
- Added accessible Play/Pause, Reset, 0.5x/1x/1.5x/2x speed selection, simulation clock, active conceptual stage, and animation-rate readout. `aria-pressed`, keyboard scene navigation, and a screen-reader announcement region are wired.
- Scene-specific paths were visually aligned against the integrated, roadway, hydraulic and solar SVG preview renders. Fixed the explicit `[hidden]` image-fallback styling so an unavailable scene illustration can actually be hidden while the status explains why.
- Labels clearly say `LIVE CONCEPT SIMULATION`, `Illustrative animated paths · no sensor telemetry`, and `CONCEPT ONLY`; no fabricated energy output or sensor data is generated.
- `thesis-concept-lab.css` and `thesis-concept-lab.js` query revisions are `thesis3d-v3`; service-worker revision is `igers-2026-10-09-thesis3d-v3`.

### Final verification for this update
- `npm run build`: passed using the repository's offline-safe static build fallback.
- JavaScript/MJS syntax: 46 files passed; inline JavaScript: 13 scripts passed.
- HTML: 0 parser errors; 582 unique IDs, no duplicate IDs; 41 internal links, no missing targets; no missing local assets.
- CSS: 7 stylesheets parsed without errors. JSON/GeoJSON and all SVG XML assets parsed.
- Concept gallery mocked-runtime checks: 14/14 passed (four scene switches, pause/resume, reset, speed, hidden-tab handling, keyboard navigation and ARIA selected state).
- Local HTTP smoke test: 19/19 required routes returned HTTP 200.
- Original project paths are preserved; source package remains 96 actual files and below the 98-file GitHub limit. Temporary `dist/` output is excluded from the upload ZIP.

### Limitations
- This is a layered isometric/2.5D animated illustration, not a physical 3D engineering solver or real sensor telemetry. The moving particles show conceptual pathways only.
- Full in-browser rendering of the entire app and external live provider connectivity could not be independently verified in this environment.


## Latest thesis visuals addition
- Added the user-supplied sluice-gate and roadway energy-harvester images to Concept Lab as two selectable scenes.
- Added animated canvas energy-path overlays and a clearly labelled simulated storage meter (not measured battery telemetry).
- Preserved all prior project paths; two JPG assets are the only added files.
- Service-worker revision bumped to v4 for update detection.
- The image simulations are conceptual, not validated mechanical/electrical designs or sensor data.

## User-supplied hydraulic and roadway concept visuals (v4)
- Added `thesis-concept-sluice-gate.jpg` and `thesis-concept-road-harvester.jpg` as selectable Concept Lab scenes.
- The six scene options are integrated ecosystem, road SVG concept, hydraulic SVG concept, solar/airflow SVG concept, supplied sluice-gate visual, and supplied road energy-harvester visual.
- Canvas overlays animate illustrative flow / vehicle-associated recovery paths over both supplied images. The overlay runs locally and does not require new libraries or external image services.
- Added a deterministic simulated storage-state indicator, explicitly labelled `SIMULATED · NOT MEASURED`; it is not battery telemetry or a measured charging profile. The 185W label present in the supplied road image remains part of that image and is not reported by the application as a live value.
- Preserved the six scene choices, accessible selected state, Play/Pause, Reset, speed control, reduced-motion behavior, and hidden-tab animation pause/resume.
- Fixed image-scene canvas resizing immediately after a scene switch; this prevents the previous scene's canvas dimensions from being temporarily reused when the supplied photos have different aspect ratios.
- Bumped Concept Lab asset query strings and service-worker revision to v4.
- Validation: 98 source files (the 96 baseline files retained plus 2 supplied image assets), 585 HTML IDs with no duplicates, no missing same-page anchors or local assets, 46 JS/MJS files parsed, 13 inline scripts parsed, 7 CSS files parsed, 4 Python files parsed, JSON/manifest/GeoJSON/SVG parsed, 30 Concept Lab runtime mock assertions passed, static build passed, 19/19 local HTTP routes returned 200, and ZIP integrity passed.
- Browser visual automation was not available for full application-wide testing in this workspace; public feeds are not represented as measured energy telemetry in these concept scenes.



## Archived source: SECTION-GROUPING-UPDATE.md

# IGERS POWERCORE · Section Navigation Update

## Purpose
Organize the existing dashboard without removing/rebuilding its modules. Related destinations are grouped into six expandable categories:

1. **Overview**: Home, concept, energy sources, energy journey, applications, deployment, inventor, engineering limits.
2. **Environment & Live Data**: environment, weather, live time, earthquake/seismic, marine/coastal, Salah/Qibla.
3. **Air & Border Operations**: public air traffic, 3D flight monitor/runway simulation, airspace safety, early warning, border monitor.
4. **Infrastructure & Network**: Sentinel Grid, toll intelligence, satellite monitor, Google 3D map, tower mesh.
5. **Energy & System Control**: energy calculator, IGERS 3D lab, data analysis, system control.
6. **Safety & Support**: emergency center, comments/customer care.

## Compatibility measures
- Existing section IDs used by the original navigation are retained. All 30 current section anchors are present in the navigation and resolve to matching HTML IDs.
- `section-navigation.js` provides keyboard-friendly category handling, mobile open/close, Escape-to-close, and closes the selected category after navigation.
- The six current categories explicitly cover all 30 section elements present in this version. Future dynamically injected sections must be given a matching navigation entry when introduced; the current controller does not auto-classify arbitrary future links.
- Asset URLs and the service-worker revision were bumped to help clients pick up the new navigation after GitHub Pages completes deployment.
- All existing page sections, calculations, module scripts, legal pages, PWA files, boundary data and runway simulation assets were preserved.

## Verification
- 445 HTML IDs after wiring the live copyright year; no duplicates.
- Six category groups and all static navigation anchor targets resolve. The master-system ON/OFF buttons are now connected to the existing administrator-session gate.
- 82 standalone `.js` files passed `node --check` across source and Android bundle.
- 13 inline scripts passed `node --check`; five CSS files and 15 embedded style blocks parsed without syntax errors.
- Web manifest and Bangladesh GeoJSON parse; local HTML asset references resolve.
- Android launch-kit structural validator: 36/36 checks passed after synchronizing the bundle.

A complete Chromium visual/interaction test and Android APK compilation were not available in this environment. The Android Launch Kit therefore contains source and an auto-build workflow, not a precompiled APK.



## Archived source: UPGRADE-AND-VALIDATION-REPORT.md

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



## Archived source: border-status-integration-snippet.html

````html
<!-- IGERS-BD-01 Border Resilience Public-Data Status Panel -->
<link rel="stylesheet" href="igers-compact-bundle.css">
<div id="igers-border-status-panel"></div>
<script src="assets/igers-border-status.js"></script>
<script>IGERSBorderStatusPanel.mount('#igers-border-status-panel');</script>

````

## Archived source: integration-snippet.html

````html
<!-- 1) Add this where you want the separate Journal/Magazine panel to appear. -->
<div id="igers-journal-panel"></div>

<!-- 2) Load the module. Adjust the asset path to match your app. -->
<link rel="stylesheet" href="igers-compact-bundle.css">
<script src="journal/assets/igers-journal.js"></script>
<script>
  IGERSJournalPanel.mount('#igers-journal-panel', {
    pdfUrl: 'journal/assets/IGERS-BD-01_Professional_Engineering_Magazine_Merged_3D.pdf',
    coverUrl: 'journal/assets/cover.webp'
  });
</script>

````


---

## Archived legacy template note (consolidated; not a runtime file)

IGERS-BD-01 Lightweight Website Template
========================================
Open index.html in a browser, or upload the folder to GitHub Pages, Netlify, Vercel, or any static web host.

Design goals:
- Responsive
- No external libraries
- No external fonts
- No image assets
- Inline CSS/SVG-style conceptual visualization
- Intended to stay far below 1 MB

Replace/add validated project data, prototype images, calculations, and contact information as the research project develops.


## Archived source: `STYLES-SOURCE-ARCHIVE.css` (source-only, not loaded by the application)

The original file contents are retained below for historical reference; production uses the active bundled stylesheets.

```css
/* IGERS POWERCORE consolidated source stylesheet archive.
 * Not linked by index.html: the deployed UI continues to use its existing inline styles and igers-compact-bundle.css.
 * Each original stylesheet is preserved below with filename separators for future editing. */


/* ===== Original file: admin-control.css ===== */
.igx-admin{padding:72px 0}.igx-admin-login{max-width:540px;margin:0 auto 18px;padding:18px;border:1px solid var(--line);border-radius:18px;background:linear-gradient(145deg,#07131b,#0a1b25)}.igx-admin-login[hidden],.igx-admin [hidden]{display:none!important}.igx-admin-input{width:100%;box-sizing:border-box;padding:12px 13px;border:1px solid var(--line);border-radius:11px;background:#061017;color:#eef8fc;margin:10px 0;font:inherit}.igx-admin-tools{display:flex;gap:9px;flex-wrap:wrap}.igx-machine-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.igx-machine{border:1px solid var(--line);border-radius:16px;padding:15px;background:#07131b}.igx-machine h3{font-size:13px}.igx-machine-state{display:inline-block;padding:4px 8px;border-radius:999px;font-size:9px;border:1px solid var(--line);margin:5px 0 12px}.igx-machine-state.on{color:#8af3bf}.igx-machine-state.off{color:#ff9b9b}.igx-machine-state.auto{color:#ffd37a}.igx-machine button{font-size:10px;padding:8px 9px;border:1px solid var(--line);border-radius:9px;background:#091923;color:#eef8fc;cursor:pointer}.igx-machine button:disabled{opacity:.35;cursor:not-allowed}.igx-admin-log{margin-top:14px;max-height:180px;overflow:auto;border:1px solid var(--line);border-radius:14px;padding:10px;background:#040b10;font:10px/1.7 ui-monospace,monospace;color:#8da7b6}.igx-admin-log .warn{color:#ffadad}.igx-admin-head{display:flex;align-items:center;justify-content:space-between;gap:12px}.igx-admin-badge{font-size:9px;border:1px solid var(--line);border-radius:999px;padding:6px 9px;color:#8af3bf}.igx-admin-danger{border-color:#7b3636!important;color:#ff9b9b!important}.igx-admin-error{min-height:20px;color:#8af3bf;font-size:10px}.igx-admin-note{font-size:10px;color:var(--muted);margin-top:10px}.igx-admin-physical{border:1px solid #5c3f1f;border-radius:14px;padding:12px;margin-top:14px;background:#171008;color:#d8c3a5;font-size:10px}
@media(max-width:950px){.igx-machine-grid{grid-template-columns:repeat(2,1fr)}}@media(max-width:600px){.igx-machine-grid{grid-template-columns:1fr}}


/* ===== Original file: advanced-live-suite.css ===== */
/* IGERS POWERCORE — Advanced Live 3D Monitoring Suite
   Additive module: preserves the existing app UI and introduces independent panels. */
:root{
  --als-bg:#061018;--als-panel:#091923;--als-panel2:#0d212d;--als-line:#214454;--als-cyan:#55ddff;
  --als-green:#8af3bf;--als-gold:#ffd37a;--als-red:#ff7777;--als-muted:#8da7b6;--als-shadow:0 18px 55px rgba(0,0,0,.24)
}
.als-section{position:relative;overflow:hidden;border-top:1px solid rgba(85,221,255,.08)}
.als-section:before{content:"";position:absolute;inset:0;pointer-events:none;background:radial-gradient(circle at 80% 10%,rgba(85,221,255,.07),transparent 35%),linear-gradient(180deg,rgba(7,18,26,.35),rgba(2,8,13,.08))}
.als-shell{position:relative}
.als-head{display:flex;align-items:flex-end;justify-content:space-between;gap:20px;margin-bottom:18px}
.als-kicker{font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--als-cyan)}
.als-head h2{margin:3px 0 8px}
.als-head p{margin:0;color:var(--als-muted);max-width:880px}
.als-live{display:inline-flex;align-items:center;gap:7px;padding:7px 11px;border:1px solid var(--als-line);border-radius:999px;white-space:nowrap;font-size:10px;font-weight:900;letter-spacing:.08em;background:#07131b}
.als-live i{width:8px;height:8px;border-radius:50%;background:var(--als-green);box-shadow:0 0 14px rgba(138,243,191,.7);animation:alsPulse 1.4s infinite}
.als-live.offline i{background:var(--als-red);box-shadow:0 0 12px rgba(255,119,119,.5)}
.als-live.warn i{background:var(--als-gold);box-shadow:0 0 12px rgba(255,211,122,.5)}
@keyframes alsPulse{50%{transform:scale(.55);opacity:.45}}
.als-grid{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(300px,.6fr);gap:16px}
.als-grid-3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
.als-card{position:relative;background:linear-gradient(145deg,rgba(12,29,41,.92),rgba(6,14,21,.96));border:1px solid var(--als-line);border-radius:20px;padding:17px;box-shadow:var(--als-shadow);min-width:0}
.als-card h3{margin:0 0 6px;font-size:17px}
.als-card p{margin:6px 0;color:var(--als-muted);font-size:12px}
.als-canvas-wrap{height:480px;border:1px solid #224756;border-radius:18px;background:radial-gradient(circle at 52% 42%,#0e2735,#051019 64%,#03080d);overflow:hidden;position:relative}
.als-canvas-wrap canvas{width:100%;height:100%;display:block}
.als-overlay{position:absolute;top:12px;left:12px;right:12px;display:flex;justify-content:space-between;gap:10px;pointer-events:none}
.als-chip{padding:6px 9px;border:1px solid rgba(85,221,255,.25);border-radius:999px;background:rgba(3,12,17,.82);font-size:9px;color:#d5edf5}
.als-metric{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 11px;border:1px solid var(--als-line);border-radius:13px;background:#07131b}
.als-metric b{font-size:16px;line-height:1.15}
.als-metric span{font-size:9px;text-transform:uppercase;letter-spacing:.11em;color:var(--als-muted);text-align:right}
.als-stack{display:grid;gap:10px}
.als-toolbar{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}
.als-btn{padding:10px 12px;border:1px solid var(--als-line);border-radius:11px;background:#08161f;color:#eaf7fc;font-weight:800;font-size:11px;cursor:pointer}
.als-btn:hover{border-color:#3e7387;background:#0b1d27}
.als-btn.primary{background:linear-gradient(135deg,#44cfee,#77f0c0);color:#031016;border-color:transparent}
.als-btn.danger{border-color:#6b3131;color:#ffd0d0}
.als-input,.als-select,.als-textarea{width:100%;padding:10px 11px;border:1px solid var(--als-line);border-radius:11px;background:#061018;color:#eef8fc;font:inherit;font-size:12px;outline:none}
.als-textarea{min-height:90px;resize:vertical}
.als-label{display:block;font-size:9px;color:var(--als-muted);text-transform:uppercase;letter-spacing:.12em;margin:0 0 5px}
.als-field{display:grid;gap:5px}
.als-field-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
.als-data-list{display:grid;gap:7px;max-height:270px;overflow:auto;margin-top:10px;padding-right:3px}
.als-row{display:grid;grid-template-columns:1fr auto;gap:10px;padding:9px 10px;border:1px solid var(--als-line);border-radius:12px;background:#07131b;cursor:pointer}
.als-row:hover{border-color:#3d7284}
.als-row strong{display:block;font-size:11px}
.als-row small{display:block;color:var(--als-muted);font-size:9px;margin-top:2px}
.als-row em{font-style:normal;color:var(--als-cyan);font-size:10px;white-space:nowrap}
.als-kv{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:10px}
.als-kv div{padding:9px;border:1px solid var(--als-line);border-radius:10px;background:#07131b}
.als-kv b{display:block;font-size:10px}
.als-kv span{display:block;color:var(--als-muted);font-size:9px;margin-top:2px}
.als-sourcebar{display:flex;flex-wrap:wrap;gap:7px;margin-top:12px}
.als-sourcebar a,.als-sourcebar span{padding:5px 8px;border:1px solid var(--als-line);border-radius:999px;color:var(--als-muted);font-size:9px;background:#061018}
.als-sourcebar a:hover{color:var(--als-cyan);border-color:#3d7284}
.als-note{padding:10px 12px;border:1px dashed var(--als-line);border-radius:12px;color:var(--als-muted);font-size:10px;line-height:1.5;margin-top:10px}
.als-note strong{color:#eaf7fc}
.als-alert{padding:11px 12px;border:1px solid var(--als-line);border-radius:12px;background:#07131b;color:var(--als-muted);font-size:11px}
.als-alert.ok{border-color:#235640;color:#bdf4db}.als-alert.warn{border-color:#6b5520;color:#ffe2a1}.als-alert.danger{border-color:#6c2c2c;color:#ffcaca}
.als-big{font-size:30px;font-weight:900;letter-spacing:.01em}
.als-sub{color:var(--als-muted);font-size:10px}
.als-formula{padding:11px;border:1px solid var(--als-line);border-radius:12px;background:#061018;color:#bfeaf5;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:10px;line-height:1.55;overflow:auto}
.als-statusline{display:flex;justify-content:space-between;gap:12px;align-items:center;margin-top:10px;padding:9px 11px;border:1px dashed var(--als-line);border-radius:12px;font-size:10px;color:var(--als-muted)}
.als-statusline b{color:#eaf7fc}
.als-safety{font-size:10px;color:#ffcaca;margin-top:7px}
.als-google-box{min-height:330px;border:1px solid #224756;border-radius:16px;overflow:hidden;background:#041018}
.als-google-box gmp-map-3d{display:block;width:100%;height:100%;min-height:330px}
.als-two{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.als-list-scroll{max-height:210px;overflow:auto;display:grid;gap:7px;margin-top:10px}
.als-pillline{display:flex;flex-wrap:wrap;gap:7px}
.als-pill{padding:5px 8px;border:1px solid var(--als-line);border-radius:999px;font-size:9px;color:var(--als-muted);background:#061018}
.als-pill.on{color:var(--als-green);border-color:#235640}
.als-pill.off{color:#ffb2b2;border-color:#5d2d2d}
.als-admin-lock{position:absolute;inset:0;display:grid;place-items:center;background:rgba(3,10,15,.84);backdrop-filter:blur(5px);z-index:3;border-radius:20px}
.als-admin-lock>div{width:min(420px,90%);padding:18px;border:1px solid #315867;border-radius:16px;background:linear-gradient(145deg,#0d202b,#071119);box-shadow:0 20px 70px rgba(0,0,0,.45)}
.als-hidden{display:none!important}
.als-geo-status{font-size:10px;color:var(--als-muted);margin-top:5px}
.als-prayer-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-top:10px}
.als-prayer{padding:10px;border:1px solid var(--als-line);border-radius:11px;background:#07131b}.als-prayer.current{border-color:#55ddff88;box-shadow:0 0 0 1px #55ddff22 inset}.als-prayer b{display:block;font-size:11px}.als-prayer span{display:block;margin-top:2px;color:var(--als-muted);font-size:10px}
.als-table{width:100%;border-collapse:collapse;font-size:10px}.als-table th,.als-table td{padding:8px 7px;border-bottom:1px solid rgba(33,68,84,.6);text-align:left}.als-table th{font-size:9px;color:var(--als-muted);text-transform:uppercase;letter-spacing:.09em}
.als-emergency-preview{min-height:150px;border:1px dashed #5b3535;border-radius:16px;background:radial-gradient(circle at 50% 30%,#281717,#090e14 70%);display:grid;place-items:center;text-align:center;padding:18px}.als-emergency-preview strong{display:block;font-size:30px;color:#ffd2d2}.als-emergency-preview span{display:block;font-size:11px;color:#c7a6a6;margin-top:7px}
.als-route-controls{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;max-width:190px;margin:12px auto 0}.als-route-controls button{aspect-ratio:1;border:1px solid var(--als-line);border-radius:10px;background:#07131b;color:#eef8fc;font-weight:900;cursor:pointer}.als-route-controls button.active{border-color:#55ddff;background:#0d2631}
.als-tower-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:10px}.als-tower-node{padding:10px;border:1px solid var(--als-line);border-radius:12px;background:#07131b}.als-tower-node h4{margin:0;font-size:11px}.als-tower-node small{display:block;color:var(--als-muted);font-size:9px;margin:3px 0 7px}.als-node-controls{display:flex;gap:6px}.als-node-controls button{flex:1;padding:6px 7px;border:1px solid var(--als-line);border-radius:9px;background:#08161f;color:#eaf7fc;font-size:9px;font-weight:800;cursor:pointer}.als-node-controls button.on{color:var(--als-green);border-color:#235640}.als-node-controls button.off{color:#ffb2b2;border-color:#5d2d2d}
@media(max-width:1050px){.als-grid{grid-template-columns:1fr}.als-grid-3{grid-template-columns:1fr 1fr}.als-canvas-wrap{height:430px}}
@media(max-width:720px){.als-head{align-items:flex-start;flex-direction:column}.als-grid-3,.als-two,.als-field-grid{grid-template-columns:1fr}.als-canvas-wrap{height:360px}.als-prayer-grid{grid-template-columns:1fr 1fr}.als-tower-grid{grid-template-columns:1fr}.als-statusline{display:block}.als-statusline span{display:block;margin-top:4px}.navlinks{max-height:50px;overflow:auto}}


/* ===== Original file: air-traffic-live-3d.css ===== */
/* IGERS live air-traffic 3D command panel — additive module */
#airTraffic3D{scroll-margin-top:84px}.air3d-shell{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(300px,.5fr);gap:16px;margin-top:18px}.air3d-panel{border:1px solid var(--line,#244656);border-radius:24px;background:linear-gradient(180deg,#07141d,#041018);overflow:hidden}.air3d-head{display:flex;justify-content:space-between;gap:12px;align-items:center;padding:14px 16px;border-bottom:1px solid var(--line,#244656)}.air3d-badges{display:flex;gap:8px;flex-wrap:wrap}.air3d-badge{font-size:10px;font-weight:800;letter-spacing:.08em;padding:7px 9px;border:1px solid #244656;border-radius:999px;color:#9eb9c5}.air3d-badge.live{color:#8af3bf;border-color:#2c7258}.air3d-badge.warn{color:#ffd18a;border-color:#80612e}.air3d-canvas-wrap{position:relative;min-height:540px;background:radial-gradient(circle at 50% 45%,#123a4a 0,#07151f 38%,#03090e 72%)}#air3dCanvas{display:block;width:100%;height:540px}.air3d-overlay{position:absolute;inset:12px;pointer-events:none}.air3d-corner{position:absolute;padding:9px 10px;border:1px solid #285263;background:rgba(3,10,15,.72);border-radius:10px;font-size:10px;color:#a9c1ca;backdrop-filter:blur(5px)}.air3d-corner.tl{left:0;top:0}.air3d-corner.tr{right:0;top:0;text-align:right}.air3d-corner.bl{left:0;bottom:0}.air3d-corner.br{right:0;bottom:0;text-align:right}.air3d-controls{display:flex;gap:8px;flex-wrap:wrap;padding:12px 16px;border-top:1px solid #183743}.air3d-controls button,.air3d-controls select{min-height:40px;padding:8px 11px;border-radius:10px;border:1px solid #285263;background:#07141d;color:#dff3fa;font:inherit;font-size:11px}.air3d-controls button{cursor:pointer}.air3d-controls button:hover{border-color:#55ddff}.air3d-side{display:grid;gap:16px;min-width:0}.air3d-card{padding:16px}.air3d-metrics{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:12px}.air3d-metric{padding:10px;border:1px solid #1d3c49;border-radius:11px;background:#06131b}.air3d-metric b{display:block;font-size:18px;font-variant-numeric:tabular-nums}.air3d-metric span{display:block;margin-top:3px;color:#7e9ba7;font-size:9px;text-transform:uppercase;letter-spacing:.08em}.air3d-source{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:9px 0;border-bottom:1px solid #17323e;font-size:11px}.air3d-source:last-child{border-bottom:0}.air3d-dot{width:8px;height:8px;border-radius:50%;background:#65747a;display:inline-block;margin-right:6px}.air3d-dot.live{background:#62e6a5}.air3d-dot.warn{background:#f0bb5e}.air3d-dot.offline{background:#e87878}.air3d-detail-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px}.air3d-detail-grid div{padding:9px;border:1px solid #1d3c49;border-radius:10px;background:#06131b}.air3d-detail-grid b{display:block;font-size:12px}.air3d-detail-grid span{display:block;color:#7895a1;font-size:9px;margin-top:3px}.air3d-list{max-height:245px;overflow:auto;margin-top:10px;display:grid;gap:6px}.air3d-row{display:grid;grid-template-columns:1fr auto;gap:8px;padding:9px;border:1px solid #17323e;border-radius:10px;background:#06131b;cursor:pointer}.air3d-row:hover,.air3d-row.selected{border-color:#55ddff}.air3d-row strong{font-size:11px}.air3d-row small{display:block;color:#7895a1;margin-top:2px;font-size:9px}.air3d-row em{font-style:normal;color:#8af3bf;font-size:10px}.air3d-note{font-size:10px;color:#7f9ca7;line-height:1.55}.air3d-key{display:flex;gap:7px}.air3d-key input{flex:1;min-width:0;border:1px solid #285263;background:#06131b;color:#dff3fa;border-radius:9px;padding:9px;font-size:10px}.air3d-key button{border:1px solid #285263;background:#0b202a;color:#dff3fa;border-radius:9px;padding:9px;font-size:10px;cursor:pointer}.air3d-google{min-height:180px;border:1px dashed #285263;border-radius:12px;display:grid;place-items:center;padding:16px;text-align:center;color:#88a4af;font-size:10px}.air3d-google gmp-map-3d{width:100%;height:360px;display:block}.air3d-hidden{display:none!important}@media(max-width:950px){.air3d-shell{grid-template-columns:1fr}.air3d-canvas-wrap,#air3dCanvas{height:440px;min-height:440px}}@media(max-width:650px){.air3d-canvas-wrap,#air3dCanvas{height:350px;min-height:350px}.air3d-head{align-items:flex-start;flex-direction:column}.air3d-detail-grid,.air3d-metrics{grid-template-columns:1fr 1fr}.air3d-controls button,.air3d-controls select{flex:1 1 120px}}


/* ===== Original file: border-monitor.css ===== */
/* IGERS POWERCORE — Border Surveillance & Early-Warning Monitor
   Defensive public/authorized-data visualization. No weapon control. */
:root{--bdm-bg:#050c12;--bdm-panel:#081721;--bdm-panel2:#0c202b;--bdm-line:#214756;--bdm-cyan:#55ddff;--bdm-green:#8af3bf;--bdm-gold:#ffd37a;--bdm-red:#ff7777;--bdm-muted:#8da7b6}
.bdm-section{position:relative;overflow:hidden;border-top:1px solid rgba(85,221,255,.08);padding:72px 0;background:radial-gradient(circle at 80% 8%,rgba(85,221,255,.06),transparent 34%),linear-gradient(180deg,rgba(5,15,22,.2),rgba(2,8,13,.05))}
.bdm-head{display:flex;justify-content:space-between;align-items:flex-end;gap:20px;margin-bottom:18px}.bdm-kicker{font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--bdm-cyan)}.bdm-head h2{margin:4px 0 8px}.bdm-head p{margin:0;color:var(--bdm-muted);max-width:900px}
.bdm-live{display:inline-flex;align-items:center;gap:7px;padding:7px 11px;border:1px solid var(--bdm-line);border-radius:999px;background:#07131b;font-size:10px;font-weight:900;letter-spacing:.08em;white-space:nowrap}.bdm-live i{width:8px;height:8px;border-radius:50%;background:var(--bdm-green);box-shadow:0 0 14px rgba(138,243,191,.7);animation:bdmPulse 1.4s infinite}.bdm-live.warn i{background:var(--bdm-gold);box-shadow:0 0 12px rgba(255,211,122,.65)}.bdm-live.offline i{background:var(--bdm-red);box-shadow:0 0 12px rgba(255,119,119,.55)}@keyframes bdmPulse{50%{transform:scale(.55);opacity:.45}}
.bdm-grid{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(310px,.6fr);gap:16px}.bdm-grid3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px}.bdm-card{background:linear-gradient(145deg,rgba(10,26,37,.92),rgba(5,13,20,.97));border:1px solid var(--bdm-line);border-radius:20px;padding:17px;box-shadow:0 18px 55px rgba(0,0,0,.24);min-width:0}.bdm-card h3{margin:0 0 7px;font-size:17px}.bdm-card p{color:var(--bdm-muted);font-size:12px}
.bdm-canvas{height:540px;border:1px solid #224756;border-radius:18px;overflow:hidden;background:radial-gradient(circle at 50% 45%,#102d3b,#051018 66%,#02070a);position:relative}.bdm-canvas canvas{display:block;width:100%;height:100%}.bdm-overlay{position:absolute;top:12px;left:12px;right:12px;display:flex;justify-content:space-between;gap:8px;pointer-events:none;flex-wrap:wrap}.bdm-chip{padding:6px 9px;border:1px solid rgba(85,221,255,.24);border-radius:999px;background:rgba(3,12,17,.82);font-size:9px;color:#d7eef5}.bdm-metric{padding:11px;border:1px solid var(--bdm-line);border-radius:12px;background:#07131b}.bdm-metric b{display:block;font-size:18px;font-variant-numeric:tabular-nums}.bdm-metric span{display:block;color:var(--bdm-muted);font-size:9px;text-transform:uppercase;letter-spacing:.1em;margin-top:2px}
.bdm-side{display:grid;gap:16px}.bdm-row{display:grid;grid-template-columns:1fr auto;gap:9px;padding:10px;border:1px solid var(--bdm-line);border-radius:12px;background:#07131b}.bdm-row strong{display:block;font-size:10px}.bdm-row small{display:block;color:var(--bdm-muted);font-size:9px;margin-top:2px}.bdm-state{font-size:10px;color:var(--bdm-cyan);white-space:nowrap}.bdm-state.ok{color:var(--bdm-green)}.bdm-state.warn{color:var(--bdm-gold)}.bdm-state.off{color:#ffabab}
.bdm-toolbar{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}.bdm-btn{padding:10px 12px;border:1px solid var(--bdm-line);border-radius:11px;background:#08161f;color:#eaf7fc;font-weight:800;font-size:11px;cursor:pointer}.bdm-btn:hover{border-color:#3b7081}.bdm-btn.primary{background:linear-gradient(135deg,#44cfee,#77f0c0);color:#031016;border-color:transparent}.bdm-btn.danger{border-color:#6b3131;color:#ffcaca}
.bdm-zone-list{display:grid;gap:7px;max-height:235px;overflow:auto}.bdm-zone{display:grid;grid-template-columns:1fr auto;gap:8px;padding:9px 10px;border:1px solid var(--bdm-line);border-radius:11px;background:#07131b}.bdm-zone b{font-size:10px}.bdm-zone span{display:block;color:var(--bdm-muted);font-size:9px;margin-top:2px}.bdm-zone em{font-style:normal;font-size:9px;color:var(--bdm-green);white-space:nowrap}.bdm-note{padding:10px 11px;border:1px dashed var(--bdm-line);border-radius:12px;color:var(--bdm-muted);font-size:10px;line-height:1.5}.bdm-note strong{color:#eef8fc}.bdm-alert{padding:12px;border:1px solid var(--bdm-line);border-radius:13px;background:#07131b;color:var(--bdm-muted);font-size:11px}.bdm-alert.ok{border-color:#245b45;color:#bbf2d9}.bdm-alert.warn{border-color:#6b5520;color:#ffe1a0}.bdm-alert.danger{border-color:#702f2f;color:#ffcaca;animation:bdmFlash 1.2s infinite}@keyframes bdmFlash{50%{box-shadow:0 0 0 2px rgba(255,119,119,.08) inset}}
.bdm-kv{display:grid;grid-template-columns:1fr 1fr;gap:8px}.bdm-kv>div{padding:9px;border:1px solid var(--bdm-line);border-radius:10px;background:#07131b}.bdm-kv b{display:block;font-size:10px}.bdm-kv span{display:block;color:var(--bdm-muted);font-size:9px;margin-top:2px}.bdm-tagbar{display:flex;flex-wrap:wrap;gap:6px;margin-top:9px}.bdm-tag{padding:5px 8px;border-radius:999px;border:1px solid var(--bdm-line);background:#061018;color:var(--bdm-muted);font-size:9px}.bdm-tag.live{color:var(--bdm-green);border-color:#285f48}.bdm-tag.sim{color:var(--bdm-gold);border-color:#5e4d20}.bdm-tag.public{color:var(--bdm-cyan);border-color:#28586a}
.bdm-disclaimer{font-size:10px;color:#7e9aa6;line-height:1.55}.bdm-disclaimer b{color:#cbe4ec}.bdm-disclaimer strong{color:#ffca85}.bdm-toggle{display:flex;justify-content:space-between;align-items:center;padding:10px 11px;border:1px solid var(--bdm-line);border-radius:12px;background:#07131b;font-size:10px}.bdm-toggle input{accent-color:#55ddff}
@media(max-width:1000px){.bdm-grid{grid-template-columns:1fr}.bdm-canvas{height:460px}}@media(max-width:700px){.bdm-grid3{grid-template-columns:1fr}.bdm-canvas{height:380px}.bdm-head{align-items:flex-start;flex-direction:column}.bdm-kv{grid-template-columns:1fr}}

.bdm-radar-card{background:linear-gradient(145deg,rgba(7,20,28,.98),rgba(3,10,15,.98));border:1px solid rgba(85,221,255,.22);border-radius:18px;padding:14px;box-shadow:0 18px 48px rgba(0,0,0,.26),inset 0 0 44px rgba(85,221,255,.025)}
.bdm-radar-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start;margin-bottom:10px}.bdm-radar-kicker{font-size:9px;letter-spacing:.15em;color:var(--bdm-cyan);font-weight:900}.bdm-radar-head h3{margin:3px 0 4px;font-size:15px}.bdm-radar-head p{margin:0;max-width:760px;color:var(--bdm-muted);font-size:10px;line-height:1.45}
.bdm-radar-grid{display:grid;grid-template-columns:minmax(0,1.35fr) minmax(250px,.65fr);gap:12px}.bdm-radar-scope{height:330px;border:1px solid rgba(85,221,255,.18);border-radius:15px;overflow:hidden;background:radial-gradient(circle at 50% 50%,rgba(85,221,255,.07),transparent 45%),#030a10;position:relative}.bdm-radar-scope canvas{width:100%;height:100%;display:block}.bdm-radar-overlay{position:absolute;left:9px;right:9px;top:9px;display:flex;justify-content:space-between;pointer-events:none}.bdm-radar-side{display:grid;gap:9px;align-content:start}.bdm-radar-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:7px}.bdm-radar-stats>div{padding:9px;border:1px solid var(--bdm-line);border-radius:10px;background:#061018}.bdm-radar-stats b{display:block;font-size:16px}.bdm-radar-stats span{display:block;font-size:8px;color:var(--bdm-muted);text-transform:uppercase;letter-spacing:.08em;margin-top:2px}.bdm-radar-tracks{max-height:205px;overflow:auto;border:1px solid var(--bdm-line);border-radius:11px;background:#061018;padding:7px}.bdm-radar-track{display:grid;grid-template-columns:1fr auto;gap:7px;padding:8px;border-bottom:1px solid rgba(255,255,255,.04)}.bdm-radar-track:last-child{border-bottom:0}.bdm-radar-track b{font-size:10px}.bdm-radar-track span{display:block;color:var(--bdm-muted);font-size:8px;margin-top:2px}.bdm-radar-track em{font-size:8px;font-style:normal;color:var(--bdm-cyan)}
@media(max-width:900px){.bdm-radar-grid{grid-template-columns:1fr}}@media(max-width:600px){.bdm-radar-scope{height:280px}.bdm-radar-stats{grid-template-columns:1fr 1fr 1fr}.bdm-radar-head{flex-direction:column}}


/* ===== Original file: border-zone-command.css ===== */
/* IGERS · Border Zone Command Monitor — public-data visualization only */
.bzc-section{margin-top:20px}.bzc-shell{border:1px solid #2b4a3b;border-radius:22px;overflow:hidden;background:radial-gradient(circle at 30% 15%,rgba(126,174,76,.07),transparent 34%),linear-gradient(145deg,#07100b,#09130f 50%,#050b08);box-shadow:0 20px 70px rgba(0,0,0,.34)}
.bzc-header{display:flex;justify-content:space-between;align-items:center;gap:14px;padding:14px 16px;border-bottom:1px solid rgba(134,174,112,.15);background:linear-gradient(90deg,rgba(98,130,70,.10),transparent 50%,rgba(200,160,62,.05))}.bzc-badge{display:inline-flex;align-items:center;gap:8px;font-weight:900;font-size:10px;letter-spacing:.12em;color:#a9e58b}.bzc-badge i{display:block;width:8px;height:8px;border-radius:50%;background:#a9e58b;box-shadow:0 0 14px #a9e58b;animation:bzcPulse 1.3s infinite}.bzc-badge.warn{color:#ffd27a}.bzc-badge.warn i{background:#ffd27a;box-shadow:0 0 14px #ffd27a}.bzc-badge.off{color:#ff9c9c}.bzc-badge.off i{background:#ff9c9c;box-shadow:none;animation:none}@keyframes bzcPulse{50%{opacity:.35;transform:scale(.85)}}
.bzc-toolbar{display:flex;gap:8px;flex-wrap:wrap}.bzc-toolbar .btn{padding:8px 11px}.bzc-grid{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(310px,.72fr);gap:14px;padding:14px}.bzc-map-wrap{position:relative;min-height:590px;border:1px solid #294536;border-radius:18px;overflow:hidden;background:#08110d}.bzc-map-wrap iframe{width:100%;height:100%;min-height:590px;border:0;display:block;filter:saturate(.78) contrast(1.05) brightness(.82)}.bzc-map-overlay{position:absolute;inset:0;pointer-events:none;background:radial-gradient(circle at 50% 46%,transparent 32%,rgba(1,7,4,.06) 58%,rgba(1,5,3,.62) 100%)}.bzc-scope{position:absolute;inset:0;display:grid;place-items:center;pointer-events:none}.bzc-scope::before{content:"";width:min(52vw,430px);height:min(52vw,430px);max-width:430px;max-height:430px;border:1px solid rgba(171,225,135,.32);border-radius:50%;box-shadow:0 0 0 48px rgba(171,225,135,.025),0 0 0 110px rgba(171,225,135,.018),inset 0 0 40px rgba(171,225,135,.05)}.bzc-scope::after{content:"";position:absolute;width:1px;height:100%;background:linear-gradient(transparent 18%,rgba(171,225,135,.16) 32%,rgba(171,225,135,.16) 68%,transparent 82%);box-shadow:0 0 0 0 transparent}
.bzc-radar-canvas{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}.bzc-hud-grid{position:absolute;left:12px;right:12px;top:12px;display:grid;grid-template-columns:repeat(4,1fr);gap:7px;pointer-events:none}.bzc-hud{padding:8px 10px;background:rgba(3,9,6,.72);border:1px solid rgba(167,210,138,.16);border-radius:10px;backdrop-filter:blur(7px)}.bzc-hud small{display:block;color:#7d9484;font-size:8px;letter-spacing:.12em}.bzc-hud strong{display:block;margin-top:3px;color:#d9efcf;font-size:16px;font-variant-numeric:tabular-nums}.bzc-hud .amber{color:#ffd27a}.bzc-hud .cyan{color:#8edcff}.bzc-map-label{position:absolute;bottom:11px;left:12px;padding:7px 9px;border:1px solid rgba(167,210,138,.15);border-radius:8px;background:rgba(3,9,6,.78);color:#9cad9b;font-size:8px;letter-spacing:.08em;pointer-events:none}.bzc-map-label strong{color:#d9efcf}.bzc-rail{position:absolute;right:12px;bottom:11px;display:flex;gap:6px;pointer-events:none}.bzc-chip{padding:7px 8px;border:1px solid rgba(167,210,138,.15);border-radius:8px;background:rgba(3,9,6,.78);color:#95a896;font-size:8px}.bzc-chip b{color:#a9e58b}
.bzc-side{display:grid;gap:12px;align-content:start}.bzc-card{background:linear-gradient(145deg,rgba(13,27,18,.95),rgba(6,14,9,.96));border:1px solid #203b2b;border-radius:16px;padding:14px}.bzc-card h3{margin-top:6px}.bzc-stat-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-top:10px}.bzc-stat{padding:10px;border:1px solid rgba(167,210,138,.08);border-radius:10px;background:#07110c}.bzc-stat small{display:block;color:#799080;font-size:8px;letter-spacing:.08em}.bzc-stat strong{display:block;margin-top:3px;font-size:20px;font-variant-numeric:tabular-nums}.bzc-stat span{display:block;margin-top:2px;color:#7f9787;font-size:8px}.bzc-flow{display:grid;gap:7px;margin-top:10px}.bzc-flow-row{display:grid;grid-template-columns:74px 1fr 40px;gap:7px;align-items:center;font-size:9px}.bzc-flow-row label{color:#8da28f}.bzc-flow-bar{height:7px;border-radius:999px;background:#102017;overflow:hidden}.bzc-flow-bar i{display:block;height:100%;width:0;background:linear-gradient(90deg,#6da349,#a9e58b);border-radius:999px;transition:width .35s ease}.bzc-flow-row strong{text-align:right;color:#dcebd7;font-variant-numeric:tabular-nums}.bzc-source{display:flex;justify-content:space-between;gap:8px;padding:7px 0;border-bottom:1px solid rgba(167,210,138,.06);font-size:9px}.bzc-source:last-child{border-bottom:0}.bzc-good{color:#a9e58b!important}.bzc-warn{color:#ffd27a!important}.bzc-bad{color:#ff9c9c!important}.bzc-sat{position:relative;height:130px;margin-top:9px;border-radius:11px;overflow:hidden;border:1px solid rgba(140,203,247,.12);background:#07121a}.bzc-sat img{width:100%;height:100%;display:block;object-fit:cover;opacity:.73}.bzc-sat-mask{position:absolute;inset:0;background:linear-gradient(180deg,transparent 35%,rgba(3,7,8,.84) 100%);display:flex;align-items:end;justify-content:space-between;padding:7px;font-size:8px}.bzc-sat-mask strong{color:#d7efff}.bzc-note{margin-top:9px;padding:9px;border:1px dashed #2a4533;border-radius:10px;color:#7e9485;font-size:8px;line-height:1.5}.bzc-node-list{display:grid;grid-template-columns:repeat(2,1fr);gap:7px;margin-top:9px}.bzc-node{padding:8px;border:1px solid rgba(167,210,138,.08);border-radius:10px;background:#08130d}.bzc-node b{display:block;font-size:9px}.bzc-node span{display:block;color:#7d9383;font-size:8px;margin-top:2px}.bzc-foot{display:flex;justify-content:space-between;gap:10px;align-items:center;padding:0 14px 14px;flex-wrap:wrap}.bzc-footnote{font-size:8px;color:#718778}.bzc-footnote strong{color:#aac3ae}@media(max-width:1080px){.bzc-grid{grid-template-columns:1fr}.bzc-side{grid-template-columns:repeat(2,1fr)}.bzc-map-wrap,.bzc-map-wrap iframe{min-height:540px}}@media(max-width:720px){.bzc-header{align-items:flex-start;flex-direction:column}.bzc-grid{padding:10px}.bzc-side{grid-template-columns:1fr}.bzc-map-wrap,.bzc-map-wrap iframe{min-height:460px}.bzc-hud-grid{grid-template-columns:repeat(2,1fr)}.bzc-scope::before{width:290px;height:290px}.bzc-toolbar .btn{flex:1}}

/* Real geographic basemap + result marker layer */
.bzc-leaflet-map{position:absolute;inset:0;z-index:1;background:#0a1510}.bzc-iframe-fallback{position:absolute;inset:0;width:100%;height:100%;border:0;background:#07110c;display:none;z-index:2}.bzc-leaflet-map .leaflet-container{width:100%;height:100%;background:#0a1510;font:12px/1.4 system-ui,sans-serif}.bzc-leaflet-map .leaflet-tile{filter:saturate(.72) brightness(.68) contrast(1.08)}.bzc-leaflet-map .leaflet-control{z-index:900}.bzc-leaflet-map .leaflet-control-zoom a{background:#07110c;color:#dcebd7;border-color:#31553d}.bzc-leaflet-map .leaflet-control-attribution{background:rgba(3,8,5,.74);color:#90a492}.bzc-leaflet-map .leaflet-control-attribution a{color:#a9e58b}.bzc-plane-icon{background:transparent!important;border:0!important}.bzc-plane-icon span{display:block;width:20px;height:20px;line-height:20px;text-align:center;font-size:18px;color:var(--bzc-plane,#a9e58b);text-shadow:0 0 10px var(--bzc-plane,#a9e58b);transform:rotate(0deg);font-family:Arial,sans-serif}.bzc-map-overlay{z-index:3}.bzc-radar-canvas{z-index:4}.bzc-scope,.bzc-hud-grid,.bzc-map-label,.bzc-rail{z-index:5}.bzc-leaflet-map .leaflet-popup-content-wrapper,.bzc-leaflet-map .leaflet-popup-tip{background:#07110c;color:#e5f0e1;border:1px solid #31553d}.bzc-leaflet-map .leaflet-popup-content{margin:10px 12px;font:12px/1.45 system-ui,sans-serif}.bzc-leaflet-map .leaflet-tooltip{background:#07110c;color:#dcebd7;border:1px solid #31553d}.bzc-leaflet-map .leaflet-bar{box-shadow:0 1px 5px rgba(0,0,0,.4)}


/* ===== Original file: border-zone-monitor.css ===== */
/* IGERS Border Zone 3D Monitor - additive module */
.bzm-section{margin:18px 0 0}.bzm-section .section-head{margin-bottom:18px}.bzm-shell{border:1px solid #214554;border-radius:24px;background:linear-gradient(145deg,rgba(9,24,33,.96),rgba(4,11,16,.98));box-shadow:0 24px 90px rgba(0,0,0,.25);overflow:hidden}.bzm-topbar{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:13px 16px;border-bottom:1px solid rgba(120,210,240,.11);background:linear-gradient(90deg,rgba(85,221,255,.07),transparent 45%,rgba(138,243,191,.05))}.bzm-top-status{display:flex;align-items:center;gap:8px;font-size:10px;font-weight:900;letter-spacing:.12em;text-transform:uppercase}.bzm-dot{width:8px;height:8px;border-radius:50%;background:#8af3bf;box-shadow:0 0 16px #8af3bf;animation:pulse 1.6s infinite}.bzm-dot.warn{background:#ffd37a;box-shadow:0 0 16px #ffd37a}.bzm-dot.off{background:#ff8d8d;box-shadow:0 0 16px #ff8d8d;animation:none}.bzm-actions{display:flex;gap:8px;flex-wrap:wrap}.bzm-actions .btn{padding:8px 11px}.bzm-grid{display:grid;grid-template-columns:minmax(0,1.55fr) minmax(280px,.65fr);gap:14px;padding:14px}.bzm-viewport{position:relative;min-height:590px;border:1px solid #245160;border-radius:20px;overflow:hidden;background:radial-gradient(circle at 50% 45%,rgba(31,91,117,.26),transparent 42%),linear-gradient(180deg,#061019,#07141c 48%,#050b10);isolation:isolate}.bzm-canvas{position:absolute;inset:0;width:100%;height:100%;display:block}.bzm-satellite-image{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.24;mix-blend-mode:screen;filter:saturate(.72) contrast(1.08);pointer-events:none;transition:opacity .35s ease}.bzm-satellite-image.off{opacity:0}.bzm-vignette{position:absolute;inset:0;background:radial-gradient(circle at 50% 46%,transparent 34%,rgba(3,8,12,.25) 65%,rgba(1,5,8,.8) 100%);pointer-events:none}.bzm-hud{position:absolute;left:13px;right:13px;top:13px;display:flex;justify-content:space-between;gap:12px;pointer-events:none}.bzm-hud-box{padding:8px 10px;border:1px solid rgba(85,221,255,.18);border-radius:10px;background:rgba(3,10,15,.74);backdrop-filter:blur(9px);font-size:9px;color:#9bb2bd}.bzm-hud-box b{color:#55ddff;font-size:9px;letter-spacing:.12em}.bzm-hud-box strong{display:block;color:#eef8fc;margin-top:2px;font-size:12px;font-variant-numeric:tabular-nums}.bzm-legend{position:absolute;left:13px;right:13px;bottom:13px;display:flex;gap:10px;justify-content:space-between;align-items:end;pointer-events:none}.bzm-legend-card{padding:8px 10px;border:1px solid rgba(85,221,255,.14);border-radius:11px;background:rgba(3,10,15,.78);backdrop-filter:blur(8px);font-size:9px;color:#95abb6}.bzm-legend-card b{display:block;color:#dff5fb;margin-bottom:2px}.bzm-badge{display:inline-flex;align-items:center;gap:5px;padding:5px 8px;border-radius:999px;border:1px solid rgba(255,255,255,.08);color:#8af3bf;font-weight:800}.bzm-side{display:grid;gap:14px;align-content:start}.bzm-card{background:linear-gradient(145deg,rgba(13,30,41,.92),rgba(6,15,22,.92));border:1px solid #1b3545;border-radius:18px;padding:15px}.bzm-card h3{font-size:14px}.bzm-stat-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-top:10px}.bzm-stat{padding:10px;border:1px solid rgba(120,210,240,.1);border-radius:11px;background:#07131b}.bzm-stat b{display:block;font-size:9px;color:#8da7b6}.bzm-stat strong{display:block;margin-top:3px;font-size:19px;font-variant-numeric:tabular-nums}.bzm-stat span{display:block;margin-top:2px;font-size:9px;color:#8da7b6}.bzm-meter{height:6px;background:#0d232d;border-radius:999px;overflow:hidden;margin-top:8px}.bzm-meter i{display:block;height:100%;width:50%;background:linear-gradient(90deg,#55ddff,#8af3bf);border-radius:999px;transition:width .35s ease}.bzm-source{display:flex;justify-content:space-between;gap:8px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.05);font-size:10px}.bzm-source:last-child{border-bottom:0}.bzm-source span{color:#8da7b6;text-align:right}.bzm-feed-good{color:#8af3bf!important}.bzm-feed-warn{color:#ffd37a!important}.bzm-feed-bad{color:#ff9b9b!important}.bzm-layer-row{display:grid;grid-template-columns:1fr auto;gap:8px;align-items:center;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.05);font-size:10px}.bzm-layer-row:last-child{border-bottom:0}.bzm-switch{width:44px;height:24px;border:1px solid #2a4a58;border-radius:999px;background:#081721;position:relative;cursor:pointer}.bzm-switch i{position:absolute;top:3px;left:3px;width:16px;height:16px;border-radius:50%;background:#71909c;transition:transform .2s ease,background .2s ease}.bzm-switch.on{background:#0c2a31;border-color:#3c7281}.bzm-switch.on i{transform:translateX(20px);background:#8af3bf;box-shadow:0 0 13px rgba(138,243,191,.65)}.bzm-note{margin-top:10px;padding:9px;border:1px dashed #234454;border-radius:11px;color:#8da7b6;font-size:9px;line-height:1.45}.bzm-zone-list{display:grid;gap:6px;max-height:190px;overflow:auto;margin-top:9px}.bzm-zone{display:grid;grid-template-columns:auto 1fr auto;gap:7px;align-items:center;padding:8px;border:1px solid rgba(120,210,240,.08);border-radius:10px;background:#07131b}.bzm-zone .led{width:6px;height:6px;border-radius:50%;background:#8af3bf;box-shadow:0 0 10px #8af3bf}.bzm-zone .led.warn{background:#ffd37a;box-shadow:0 0 10px #ffd37a}.bzm-zone b{font-size:10px}.bzm-zone small{display:block;color:#8da7b6;font-size:8px}.bzm-zone em{font-style:normal;font-size:9px;color:#55ddff;font-variant-numeric:tabular-nums}.bzm-footer{padding:0 14px 14px;display:flex;justify-content:space-between;gap:12px;align-items:center;flex-wrap:wrap}.bzm-footnote{font-size:9px;color:#778f9b}.bzm-footnote strong{color:#b4c9d1}.bzm-mini-actions{display:flex;gap:8px;flex-wrap:wrap}.bzm-mini-actions .btn{padding:8px 11px}.bzm-sat-preview{height:110px;border:1px solid rgba(85,221,255,.1);border-radius:12px;overflow:hidden;background:#061018;margin-top:10px;position:relative}.bzm-sat-preview img{width:100%;height:100%;object-fit:cover;display:block;opacity:.72}.bzm-sat-overlay{position:absolute;inset:0;background:linear-gradient(180deg,transparent,rgba(3,10,15,.72));display:flex;align-items:end;justify-content:space-between;padding:7px;font-size:8px}.bzm-mobile-band{padding:10px 0 4px}.bzm-signal-row{display:grid;grid-template-columns:repeat(5,1fr);gap:5px;height:34px;align-items:end}.bzm-signal-row i{display:block;border-radius:5px 5px 2px 2px;background:linear-gradient(180deg,#8af3bf,#55ddff);box-shadow:0 0 10px rgba(85,221,255,.18);opacity:.78}.bzm-signal-row i:nth-child(1){height:22%}.bzm-signal-row i:nth-child(2){height:45%}.bzm-signal-row i:nth-child(3){height:68%}.bzm-signal-row i:nth-child(4){height:86%}.bzm-signal-row i:nth-child(5){height:58%}.bzm-signal-label{display:flex;justify-content:space-between;color:#7f98a4;font-size:8px;margin-top:3px}.bzm-activity-chip{display:inline-flex;align-items:center;gap:5px;font-size:9px;color:#8af3bf}.bzm-activity-chip i{width:6px;height:6px;border-radius:50%;background:#8af3bf;box-shadow:0 0 10px #8af3bf}.bzm-locked{color:#ffd37a}.bzm-locked i{background:#ffd37a;box-shadow:0 0 10px #ffd37a}@media(max-width:1020px){.bzm-grid{grid-template-columns:1fr}.bzm-viewport{min-height:540px}.bzm-side{grid-template-columns:repeat(2,1fr)}}@media(max-width:700px){.bzm-topbar{align-items:flex-start;flex-direction:column}.bzm-grid{padding:10px}.bzm-side{grid-template-columns:1fr}.bzm-viewport{min-height:470px}.bzm-hud,.bzm-legend{gap:7px}.bzm-hud-box{padding:7px 8px}.bzm-hud-box strong{font-size:10px}.bzm-legend{display:block}.bzm-legend-card{margin-top:6px}.bzm-actions .btn{flex:1}.bzm-stat-grid{grid-template-columns:1fr 1fr}}


/* ===== Original file: designer.css ===== */
/* IGERS-BD-01 Designer Layer — non-destructive presentation upgrade */
:root{
  --design-cyan:#63e7ff;
  --design-mint:#8ff7c9;
  --design-blue:#6e9cff;
  --design-gold:#ffd98a;
  --design-surface:rgba(10,24,34,.72);
  --design-surface-strong:rgba(8,20,30,.92);
  --design-glass:rgba(255,255,255,.035);
  --design-border:rgba(128,218,240,.16);
  --design-border-strong:rgba(99,231,255,.34);
  --design-shadow:0 24px 80px rgba(0,0,0,.28);
}
html{scroll-padding-top:92px}
body{background:
  radial-gradient(900px 480px at 12% -5%,rgba(45,138,175,.20),transparent 65%),
  radial-gradient(700px 420px at 88% 18%,rgba(62,131,104,.12),transparent 70%),
  linear-gradient(180deg,#03080d,#050c12 32%,#03080d 100%);}
body:before{content:"";position:fixed;inset:0;pointer-events:none;z-index:-1;opacity:.23;background-image:linear-gradient(rgba(99,231,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(99,231,255,.035) 1px,transparent 1px);background-size:48px 48px;mask-image:linear-gradient(to bottom,black,transparent 92%)}
.nav{border-bottom-color:rgba(99,231,255,.14);box-shadow:0 10px 40px rgba(0,0,0,.18)}
.navin{position:relative}
.brand{display:inline-flex;flex-direction:column;line-height:1.05;gap:3px}
.brand:after{content:"FIELD · ENERGY · DATA · RESILIENCE";font-size:8px;font-weight:700;letter-spacing:.16em;color:rgba(143,247,201,.62);margin-top:2px}
.navlinks{max-width:min(860px,72vw);overflow:auto;scrollbar-width:none;padding-bottom:2px}
.navlinks::-webkit-scrollbar{display:none}
.navlinks a{padding:7px 8px;border-radius:9px;transition:background .2s ease,color .2s ease,transform .2s ease}
.navlinks a:hover{background:rgba(99,231,255,.08);transform:translateY(-1px)}
.navlinks a.active{color:#effcff;background:linear-gradient(135deg,rgba(99,231,255,.14),rgba(143,247,201,.06));border:1px solid rgba(99,231,255,.18)}
.designer-menu{display:none;border:1px solid var(--design-border);background:rgba(3,12,18,.84);color:var(--text);width:40px;height:40px;border-radius:11px;cursor:pointer;font-size:19px}
.designer-dock{position:fixed;top:82px;left:50%;transform:translateX(-50%);z-index:45;display:flex;align-items:center;gap:10px;padding:7px 9px;border:1px solid var(--design-border);border-radius:999px;background:rgba(3,12,18,.74);backdrop-filter:blur(16px);box-shadow:0 16px 44px rgba(0,0,0,.22);color:#b8d8e2;font-size:10px;letter-spacing:.08em;text-transform:uppercase;white-space:nowrap;pointer-events:none;opacity:.95}
.designer-dock .dock-live{display:inline-flex;align-items:center;gap:6px;color:var(--design-mint);font-weight:800}
.designer-dock .dot{width:7px;height:7px;border-radius:50%;background:var(--design-mint);box-shadow:0 0 18px rgba(143,247,201,.9)}
.designer-dock .sep{width:1px;height:14px;background:rgba(255,255,255,.1)}
.designer-status-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin-top:20px}
.designer-status-card{padding:13px 14px;border:1px solid var(--design-border);border-radius:14px;background:linear-gradient(145deg,rgba(15,31,41,.75),rgba(5,13,19,.9));box-shadow:0 14px 36px rgba(0,0,0,.15)}
.designer-status-card .ds-top{display:flex;justify-content:space-between;gap:10px;align-items:center}
.designer-status-card .ds-label{font-size:9px;color:#7e9aa8;letter-spacing:.12em;text-transform:uppercase}
.designer-status-card .ds-value{font-size:14px;font-weight:800;margin-top:3px}
.designer-status-card .ds-state{font-size:9px;color:var(--design-mint);border:1px solid rgba(143,247,201,.18);padding:3px 6px;border-radius:999px;background:rgba(143,247,201,.05)}
.hero{position:relative;padding-top:102px}
.hero:before{content:"IGERS // 01";position:absolute;right:4%;top:34px;font-size:10px;letter-spacing:.26em;color:rgba(99,231,255,.35)}
.hero-grid{gap:54px}
.hero-visual{min-height:420px;background:
  radial-gradient(circle at 32% 24%,rgba(99,231,255,.16),transparent 34%),
  radial-gradient(circle at 72% 74%,rgba(143,247,201,.10),transparent 35%),
  linear-gradient(145deg,rgba(15,48,64,.72),rgba(4,13,20,.92));
  border-color:var(--design-border-strong);box-shadow:var(--design-shadow);}
.hero-visual:after{content:"PUBLIC-DATA / CONCEPTUAL / NON-OPERATIONAL";position:absolute;right:16px;bottom:14px;font-size:8px;letter-spacing:.14em;color:rgba(183,211,223,.4)}
.hub{border-color:rgba(99,231,255,.5);box-shadow:0 0 100px rgba(99,231,255,.14),inset 0 0 32px rgba(99,231,255,.05)}
.hero .lead{max-width:720px}
.hero .actions .btn{box-shadow:0 9px 30px rgba(0,0,0,.18)}
.hero .actions .btn.primary{box-shadow:0 12px 34px rgba(99,231,255,.12)}
.section-head{position:relative}
.section-head:after{content:"";position:absolute;left:0;right:0;bottom:-14px;height:1px;background:linear-gradient(90deg,var(--design-border-strong),transparent 62%)}
.card,.feedback-card,.clock-card{border-color:var(--design-border);background:linear-gradient(145deg,rgba(11,26,37,.82),rgba(5,13,19,.92));box-shadow:var(--design-shadow)}
.card:hover,.feedback-card:hover,.clock-card:hover{border-color:rgba(99,231,255,.28);transform:translateY(-2px)}
.card,.feedback-card,.clock-card{transition:transform .22s ease,border-color .22s ease,box-shadow .22s ease}
.kicker{color:var(--design-cyan)}
.eyebrow{border-color:rgba(99,231,255,.18);background:rgba(99,231,255,.03)}
.live-panel,.environment-panel,.nasa-panel,.nasa-radar-panel,.sat-intel,.airspace-safety-section,.feedback-section{position:relative}
.live-panel:before,.environment-panel:before,.nasa-panel:before,.nasa-radar-panel:before,.sat-intel:before,.airspace-safety-section:before,.feedback-section:before{content:"";position:absolute;inset:16px 0;border:1px solid rgba(99,231,255,.035);border-radius:32px;pointer-events:none}
.weather-hour,.weather-card,.nasa-meta-card,.air-row,.eq-item{transition:border-color .18s ease,background .18s ease,transform .18s ease}
.weather-hour:hover,.weather-card:hover,.nasa-meta-card:hover,.air-row:hover,.eq-item:hover{border-color:rgba(99,231,255,.3);background:rgba(99,231,255,.04);transform:translateY(-1px)}
.nasa-radar-view,.airmap,.satellite-visual,.mapbox,.bridge,.road{box-shadow:inset 0 0 0 1px rgba(99,231,255,.03),0 16px 50px rgba(0,0,0,.18)}
footer.footer{background:linear-gradient(180deg,transparent,rgba(6,15,22,.52));position:relative}
.designer-footer-bar{display:flex;justify-content:space-between;align-items:center;gap:16px;padding:13px 15px;margin-top:18px;border:1px solid var(--design-border);border-radius:14px;background:rgba(2,9,14,.56);font-size:10px;color:#89a6b5}
.designer-footer-bar strong{color:#d9f5fb}
#designerBackTop{position:fixed;right:20px;bottom:20px;z-index:55;width:42px;height:42px;border-radius:12px;border:1px solid var(--design-border);background:rgba(5,15,22,.8);backdrop-filter:blur(10px);color:#dff9ff;cursor:pointer;opacity:0;transform:translateY(10px);pointer-events:none;transition:.2s;box-shadow:0 12px 34px rgba(0,0,0,.24)}
#designerBackTop.is-visible{opacity:1;transform:translateY(0);pointer-events:auto}
.designer-reveal{opacity:0;transform:translateY(14px);transition:opacity .5s ease,transform .5s ease}
.designer-reveal.is-visible{opacity:1;transform:none}
.designer-divider{height:1px;margin:4px 0 0;background:linear-gradient(90deg,transparent,rgba(99,231,255,.24),transparent)}
.flag-designer{position:fixed;left:-54px;top:112px;width:180px;height:64px;z-index:20;opacity:.18;pointer-events:none;transform:rotate(-14deg);background-image:url('bangladesh-flag-overlay.svg');background-size:contain;background-repeat:no-repeat;background-position:center;filter:drop-shadow(0 0 18px rgba(99,231,255,.15)) saturate(1.45) brightness(1.22)}
.hero-meta{display:flex;gap:8px;flex-wrap:wrap;margin-top:18px}
.hero-meta span{font-size:10px;color:#99b6c3;border:1px solid var(--design-border);padding:6px 8px;border-radius:999px;background:rgba(255,255,255,.025)}
.hero-meta span strong{color:#e6faff}
@media(max-width:1100px){.navlinks{max-width:60vw}.designer-status-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.designer-dock{display:none}}
@media(max-width:820px){.navin{height:64px}.designer-menu{display:block}.navlinks{display:none;position:absolute;left:0;right:0;top:70px;max-width:none;padding:10px;background:rgba(3,11,17,.97);border:1px solid var(--design-border);border-radius:0 0 18px 18px;box-shadow:0 22px 50px rgba(0,0,0,.34)}.navlinks.is-open{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:5px}.navlinks a{padding:10px}.hero{padding-top:78px}.hero:before{display:none}.flag-designer{opacity:.12;left:-66px}}
@media(max-width:650px){.designer-status-grid{grid-template-columns:1fr 1fr}.designer-status-card{padding:11px}.hero-meta{gap:6px}.designer-footer-bar{display:block}.designer-footer-bar span{display:block}.designer-footer-bar span+span{margin-top:7px}#designerBackTop{right:14px;bottom:14px}.hero-visual{min-height:340px}}
@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important;animation-duration:.01ms!important;transition-duration:.01ms!important}.designer-reveal{opacity:1!important;transform:none!important}}

/* Reliable GitHub Pages hash/deep-link navigation */
section[id], [data-panel-module] { scroll-margin-top: 96px; }
.deep-link-target { outline: 1px solid rgba(112,225,255,.35); outline-offset: 8px; }


/* ===== Original file: energy-live-update.css ===== */
/* IGERS live energy calculation update — additive module */
.energy-live-section{position:relative}
.energy-live-shell{display:grid;grid-template-columns:1.2fr .8fr;gap:16px}
.energy-live-card{background:linear-gradient(145deg,#0b202b,#061017);border:1px solid #275465;border-radius:22px;padding:20px;box-shadow:0 18px 50px rgba(0,0,0,.2)}
.energy-live-head{display:flex;justify-content:space-between;align-items:center;gap:14px;margin-bottom:16px}
.energy-live-badge{display:inline-flex;align-items:center;gap:8px;padding:6px 10px;border:1px solid #315c68;border-radius:999px;font-size:10px;font-weight:900;letter-spacing:.12em;color:#79f3b5}
.energy-live-badge i{width:8px;height:8px;border-radius:50%;background:#79f3b5;box-shadow:0 0 12px #79f3b5;animation:energyPulse 1.5s infinite}
.energy-live-badge.off{color:#ffb0b0}.energy-live-badge.off i{background:#ff6f6f;box-shadow:0 0 10px #ff6f6f;animation:none}
.energy-input-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.energy-field{padding:11px;border:1px solid #1c3c49;border-radius:14px;background:#07141c}
.energy-field label{display:block;font-size:9px;letter-spacing:.11em;text-transform:uppercase;color:#7893a0;margin-bottom:6px}
.energy-field input{width:100%;border:1px solid #254c5a;border-radius:10px;background:#061018;color:#eef9fc;padding:9px 10px;font:700 13px system-ui}
.energy-field input:focus{outline:none;border-color:#55ddff;box-shadow:0 0 0 2px #55ddff12}
.energy-results{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:14px}
.energy-result{padding:14px;border:1px solid #214754;border-radius:14px;background:#081820}
.energy-result strong{display:block;font-size:22px;line-height:1.15;font-variant-numeric:tabular-nums;color:#8af3bf}
.energy-result span{display:block;margin-top:4px;font-size:9px;text-transform:uppercase;letter-spacing:.11em;color:#77919d}
.energy-flow{margin-top:14px;padding:13px;border:1px dashed #2a5663;border-radius:14px;color:#a9c2cc;font-size:11px;text-align:center}
.energy-admin{display:grid;gap:12px}
.energy-admin-box{padding:15px;border:1px solid #234956;border-radius:16px;background:#07141c}
.energy-admin-row{display:flex;gap:9px;flex-wrap:wrap;margin-top:10px}
.energy-admin input{flex:1;min-width:190px;border:1px solid #294f5d;border-radius:10px;background:#061018;color:#eef9fc;padding:10px}
.energy-admin-msg{min-height:18px;font-size:10px;color:#8fa8b2;margin-top:7px}
.energy-status-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:12px}
.energy-status-grid div{padding:11px;border:1px solid #1d3d49;border-radius:12px;background:#06131a}
.energy-status-grid b{display:block;font-size:10px}.energy-status-grid span{display:block;color:#79f3b5;font-size:11px;margin-top:3px}
.energy-note{font-size:10px;color:#78909a;line-height:1.55;margin-top:12px}
@keyframes energyPulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.45;transform:scale(.72)}}
@media(max-width:900px){.energy-live-shell{grid-template-columns:1fr}.energy-input-grid{grid-template-columns:1fr 1fr}}
@media(max-width:600px){.energy-input-grid,.energy-results{grid-template-columns:1fr}.energy-live-head{display:block}.energy-live-badge{margin-top:9px}.energy-admin-row{display:grid}.energy-admin input{min-width:0}}
.energy-live-section .hidden{display:none!important}


/* ===== Original file: feedback-premium.css ===== */
/* Compatibility stylesheet retained for the original app reference. Feedback styling is embedded in index.html. */


/* ===== Original file: field-connectivity-hardening.css ===== */
.fch-section{padding:72px 0;background:linear-gradient(180deg,transparent,rgba(7,25,35,.13),transparent)}.fch-grid{display:grid;grid-template-columns:1.15fr .85fr;gap:16px}.fch-card{border:1px solid #214653;border-radius:18px;background:linear-gradient(145deg,#0b1b24,#061018);padding:18px}.fch-hero{position:relative;overflow:hidden;min-height:330px}.fch-canvas{display:block;width:100%;height:330px}.fch-chip{display:inline-flex;padding:7px 9px;border:1px solid #294b5b;border-radius:10px;background:#041018e8;color:#b9d4de;font-size:9px;letter-spacing:.07em}.fch-hud{position:absolute;inset:12px;pointer-events:none}.fch-tl{position:absolute;left:0;top:0}.fch-tr{position:absolute;right:0;top:0;text-align:right}.fch-bl{position:absolute;left:0;bottom:0}.fch-br{position:absolute;right:0;bottom:0;text-align:right}.fch-status{display:inline-flex;align-items:center;gap:7px;font-size:10px;font-weight:800}.fch-dot{width:8px;height:8px;border-radius:50%;background:#ffd37a}.fch-dot.live{background:#8af3bf;box-shadow:0 0 10px #8af3bf}.fch-dot.offline{background:#ff8d8d}.fch-kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:10px}.fch-kpi{padding:10px;border:1px solid #1d3c49;border-radius:10px;background:#06131b}.fch-kpi b{display:block;font-size:15px}.fch-kpi span{display:block;color:#8099a4;font-size:8px;margin-top:3px}.fch-row{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:9px 0;border-bottom:1px solid rgba(255,255,255,.05);font-size:9px}.fch-badge{padding:5px 7px;border:1px solid #294b5b;border-radius:999px;color:#9eb5bf;font-size:8px}.fch-badge.live{color:#8af3bf;border-color:#2f765c}.fch-badge.warn{color:#ffd37a;border-color:#80612e}.fch-input{display:grid;grid-template-columns:1fr auto;gap:8px;margin-top:9px}.fch-input input{width:100%;min-height:40px;padding:9px 10px;border:1px solid #294b5b;border-radius:10px;background:#07151e;color:#eef8fc;font:inherit;font-size:10px}.fch-tools{display:flex;gap:8px;flex-wrap:wrap}.fch-tools button{min-height:40px;padding:9px 11px;border:1px solid #294b5b;border-radius:10px;background:#07151e;color:#eef8fc;font:inherit;font-size:10px;cursor:pointer}.fch-note{font-size:9px;line-height:1.55;color:#819aa5}.fch-metrics{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}.fch-metric{padding:9px;border:1px solid #1d3c49;border-radius:10px;background:#06131b}.fch-metric b{display:block;font-size:11px}.fch-metric span{display:block;color:#7f98a4;font-size:8px;margin-top:3px}.fch-sat{height:240px;border:1px solid #214653;border-radius:12px;overflow:hidden;background:#02070b}.fch-sat iframe{width:100%;height:240px;border:0}@media(max-width:960px){.fch-grid{grid-template-columns:1fr}.fch-kpis{grid-template-columns:1fr 1fr}}@media(max-width:620px){.fch-kpis,.fch-metrics{grid-template-columns:1fr}.fch-input{grid-template-columns:1fr}.fch-hero,.fch-canvas{height:290px;min-height:290px}}


/* ===== Original file: global-3d.css ===== */
/* IGERS POWERCORE — subtle site-wide 3D depth layer. Content and navigation remain unchanged. */
:root{--igers-depth:0 20px 55px rgba(0,0,0,.24)}
html{scroll-behavior:smooth}
body{background-image:radial-gradient(circle at 15% 10%,rgba(85,221,255,.035),transparent 22%),radial-gradient(circle at 85% 30%,rgba(138,243,191,.025),transparent 24%)}
.card,.bdm-card,.als-card,.sat-card{transform-style:preserve-3d;backface-visibility:hidden;box-shadow:var(--igers-depth),inset 0 1px 0 rgba(255,255,255,.025);transition:transform .22s ease,box-shadow .22s ease,border-color .22s ease}
.card:hover,.bdm-card:hover,.als-card:hover,.sat-card:hover{transform:translateY(-2px) perspective(900px) rotateX(.35deg);box-shadow:0 28px 70px rgba(0,0,0,.3),inset 0 1px 0 rgba(255,255,255,.035)}
.hero-visual,.hub,.orb,.als-canvas-wrap,.bdm-canvas,.bdm-radar-scope,.sat-visual{transform-style:preserve-3d}
@media(prefers-reduced-motion:reduce){.card,.bdm-card,.als-card,.sat-card{transition:none}.card:hover,.bdm-card:hover,.als-card:hover,.sat-card:hover{transform:none}}


/* ===== Original file: global-realistic-3d.css ===== */
/* IGERS POWERCORE — Global Realistic 3D Scene */
.global-3d-canvas{position:fixed;inset:0;width:100vw;height:100vh;display:block;z-index:0;pointer-events:none;opacity:.88;mix-blend-mode:screen}
body>nav,body>main,body>section,body>footer,body>div:not(#global3DCanvas),body>header{position:relative;z-index:1}
body[data-theme="day"] .global-3d-canvas{opacity:.28;mix-blend-mode:multiply}
body{perspective:1400px}
.hero,.section,.analytics,.ia-section{transform-style:preserve-3d}
.hero-grid,.grid,.cards,.ia-grid{transform-style:preserve-3d}
.card,.clock-card,.energy-live-card,.system-control-card,.als-card,.bdm-card,.ia-card{backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}
@media(prefers-reduced-motion:reduce){.global-3d-canvas{display:none}}


/* ===== Original file: igers-3d-engineering.css ===== */

/* IGERS 3D Engineering Visualization Panel */
.ig3d-section{padding:72px 0 80px;background:radial-gradient(circle at 50% 20%,rgba(24,72,96,.22),transparent 48%)}
.ig3d-shell{display:grid;grid-template-columns:1.25fr .75fr;gap:18px}
.ig3d-stage{min-height:620px;position:relative;overflow:hidden;border:1px solid #1e4051;border-radius:26px;background:radial-gradient(circle at 50% 50%,#0d3040 0,#07151f 45%,#04090e 100%);box-shadow:0 25px 80px rgba(0,0,0,.28);perspective:1100px}
.ig3d-stage:before{content:"";position:absolute;inset:-30%;background:repeating-linear-gradient(0deg,transparent 0 42px,rgba(85,221,255,.055) 43px 44px),repeating-linear-gradient(90deg,transparent 0 42px,rgba(85,221,255,.055) 43px 44px);transform:rotateX(67deg) translateY(23%);transform-origin:center bottom;opacity:.55}
.ig3d-hud{position:absolute;top:16px;left:16px;right:16px;display:flex;justify-content:space-between;gap:10px;z-index:10;flex-wrap:wrap}.ig3d-hud span{font-size:10px;letter-spacing:.1em;color:#9fc0ce;border:1px solid #234657;background:#06131bee;border-radius:999px;padding:6px 9px}.ig3d-hud .live{color:#8af3bf;border-color:#3e846f66}
.ig3d-model{position:absolute;left:50%;top:53%;width:560px;height:460px;transform:translate(-50%,-50%) rotateX(58deg) rotateZ(-9deg);transform-style:preserve-3d;transition:transform .5s ease}
.ig3d-base{position:absolute;left:82px;top:316px;width:390px;height:90px;border-radius:18px;background:linear-gradient(145deg,#183d4c,#091923);border:1px solid #55ddff55;box-shadow:0 22px 50px #0009;transform:translateZ(0)}
.ig3d-tower{position:absolute;left:252px;top:108px;width:56px;height:226px;background:linear-gradient(90deg,#102b36,#63828e 48%,#0c232c);border:1px solid #8dd9ec55;box-shadow:0 0 35px #55ddff20;transform:translateZ(42px);clip-path:polygon(33% 0,67% 0,100% 100%,0 100%)}
.ig3d-radar{position:absolute;left:199px;top:66px;width:165px;height:55px;border-radius:50%;border:2px solid #55ddff99;background:radial-gradient(ellipse at center,#1c586d55,#06131d00 68%);box-shadow:0 0 34px #55ddff33;transform:translateZ(92px)}
.ig3d-radar:after{content:"";position:absolute;left:50%;top:50%;width:76px;height:1px;background:linear-gradient(90deg,#55ddff,transparent);transform-origin:left center;animation:ig3dSweep 2.2s linear infinite}
@keyframes ig3dSweep{to{transform:rotate(360deg)}}
.ig3d-satellite{position:absolute;left:370px;top:24px;width:112px;height:62px;transform:translateZ(120px);filter:drop-shadow(0 0 20px #55ddff55)}
.ig3d-sat-body{position:absolute;left:38px;top:12px;width:36px;height:38px;border:1px solid #d5f5ff77;background:linear-gradient(145deg,#bfdce8,#355a68);border-radius:6px}
.ig3d-panel{position:absolute;top:8px;width:34px;height:48px;border:1px solid #55ddff88;background:linear-gradient(135deg,#0a2841,#1c6d87);border-radius:3px}.ig3d-panel.left{left:0;transform:rotateY(-20deg)}.ig3d-panel.right{right:0;transform:rotateY(20deg)}
.ig3d-link{position:absolute;height:2px;background:linear-gradient(90deg,transparent,#55ddff,transparent);opacity:.8;filter:drop-shadow(0 0 7px #55ddff);transform-origin:left center}.ig3d-link.l1{left:288px;top:118px;width:180px;transform:rotate(-17deg)}.ig3d-link.l2{left:285px;top:174px;width:190px;transform:rotate(23deg)}.ig3d-link.l3{left:236px;top:288px;width:120px;transform:rotate(2deg)}
.ig3d-orbit{position:absolute;left:50%;top:50%;border:1px solid #55ddff28;border-radius:50%;transform:translate(-50%,-50%) rotateX(64deg)}.ig3d-orbit.o1{width:430px;height:190px}.ig3d-orbit.o2{width:610px;height:280px;border-color:#8af3bf1f}.ig3d-orbit.o3{width:790px;height:360px;border-color:#ffd37a14}
.ig3d-node{position:absolute;padding:7px 9px;border:1px solid #294b5d;border-radius:10px;background:#06131df0;font-size:9px;color:#b8d0da;z-index:9;box-shadow:0 8px 24px #0005}.ig3d-node b{display:block;color:#e7faff;font-size:10px}.ig3d-node small{display:block;margin-top:2px;color:#6f9aaa}.ig3d-node.nsat{right:26px;top:96px}.ig3d-node.nrad{left:22px;top:188px}.ig3d-node.nair{right:28px;bottom:140px}.ig3d-node.nground{left:24px;bottom:84px}.ig3d-label{position:absolute;left:26px;bottom:20px;color:#6f96a6;font-size:9px;letter-spacing:.08em;z-index:8}
.ig3d-controls{position:absolute;left:16px;bottom:16px;display:flex;gap:8px;flex-wrap:wrap;z-index:10}.ig3d-controls button{border:1px solid #284b5b;background:#071822;color:#dff8ff;border-radius:10px;padding:9px 11px;font-size:10px;cursor:pointer}.ig3d-controls button:hover{border-color:#55ddff66;background:#0a2634}.ig3d-card{background:linear-gradient(145deg,rgba(12,29,40,.95),rgba(5,12,18,.95));border:1px solid #1b3545;border-radius:20px;padding:18px}.ig3d-card h3{margin:0 0 7px}.ig3d-card p{color:#8da7b6;font-size:12px}.ig3d-stack{display:grid;gap:12px}.ig3d-metric{display:flex;justify-content:space-between;gap:12px;padding:11px 12px;border:1px solid #1b3545;border-radius:12px;background:#07131b;font-size:11px}.ig3d-metric b{color:#8af3bf}.ig3d-toggle{display:grid;grid-template-columns:1fr 1fr 1fr;gap:7px;margin-top:12px}.ig3d-toggle button{border:1px solid #1b3545;background:#07131b;color:#9fc0ce;border-radius:9px;padding:8px 7px;font-size:10px;cursor:pointer}.ig3d-toggle button.active{border-color:#55ddff66;color:#eafcff;background:#0a2734}
@media(max-width:980px){.ig3d-shell{grid-template-columns:1fr}.ig3d-stage{min-height:580px}.ig3d-model{transform:translate(-50%,-50%) rotateX(55deg) rotateZ(-7deg) scale(.86)}}
@media(max-width:620px){.ig3d-stage{min-height:470px}.ig3d-model{transform:translate(-50%,-50%) rotateX(54deg) rotateZ(-6deg) scale(.62)}.ig3d-orbit.o1{width:310px}.ig3d-orbit.o2{width:450px}.ig3d-orbit.o3{width:560px}.ig3d-node{display:none}.ig3d-controls{right:14px}.ig3d-hud{font-size:8px}}

/* IGERS orbital satellite laboratory: self-contained CSS 3D, no external runtime dependency. */
.ig3d-satellite-lab{position:relative;grid-column:1/-1;min-height:650px;margin-top:2px;border:1px solid #1e4051;border-radius:26px;overflow:hidden;background:radial-gradient(circle at 50% 48%,#102f42 0,#06131e 45%,#02070c 100%);box-shadow:0 25px 80px rgba(0,0,0,.28);isolation:isolate}
.satlab-hud{position:absolute;left:18px;right:18px;top:16px;display:flex;justify-content:space-between;gap:12px;z-index:20;flex-wrap:wrap}.satlab-hud span,.satlab-hud b{font-size:10px;letter-spacing:.13em;padding:7px 10px;border:1px solid #285064;background:#04101ae8;border-radius:999px;color:#9fc5d4}.satlab-hud b{color:#8af3bf}
.satlab-space{position:absolute;inset:0;perspective:1200px;overflow:hidden}.satlab-stars{position:absolute;inset:-20%;background-image:radial-gradient(circle,#bdefff 0 1px,transparent 1.5px),radial-gradient(circle,#8adfff 0 1px,transparent 1.5px);background-size:83px 71px,127px 109px;background-position:14px 21px,53px 66px;opacity:.22;animation:satStars 18s linear infinite}.satlab-space:before{content:"";position:absolute;inset:0;background:linear-gradient(115deg,transparent 30%,#55ddff09 50%,transparent 70%);pointer-events:none}@keyframes satStars{to{transform:translate3d(25px,18px,0)}}
.satlab-earth{position:absolute;left:50%;top:58%;width:270px;height:270px;transform:translate(-50%,-50%) rotateX(66deg);border-radius:50%;background:radial-gradient(circle at 35% 28%,#4e9db1 0 8%,#1d6178 22%,#0a3447 54%,#03131f 78%);box-shadow:inset -38px -28px 70px #000b,0 0 90px #1b9bc53b;overflow:hidden;border:1px solid #70dcff38}.satlab-earth:before{content:"";position:absolute;inset:12%;border-radius:50%;background:repeating-linear-gradient(28deg,transparent 0 17px,#79c6d421 18px 19px),repeating-linear-gradient(-38deg,transparent 0 31px,#79c6d414 32px 33px);transform:rotate(18deg)}.satlab-earth span{position:absolute;left:50%;bottom:28px;transform:translateX(-50%);font-size:10px;letter-spacing:.3em;color:#bfefff;opacity:.65}.satlab-cloud{position:absolute;width:90px;height:16px;border-radius:50%;background:#d8fbff20;filter:blur(3px)}.satlab-cloud.c1{left:35px;top:80px;transform:rotate(-18deg)}.satlab-cloud.c2{right:20px;top:135px;transform:rotate(22deg)}.satlab-cloud.c3{left:90px;bottom:55px;transform:rotate(8deg)}
.satlab-orbit{position:absolute;left:50%;top:55%;border:1px solid #55ddff2c;border-radius:50%;transform:translate(-50%,-50%) rotateX(68deg) rotateZ(-16deg);pointer-events:none}.orbit-a{width:540px;height:210px}.orbit-b{width:760px;height:300px;border-color:#8af3bf1d;transform:translate(-50%,-50%) rotateX(68deg) rotateZ(24deg)}
.satlab-sat{position:absolute;left:50%;top:31%;width:300px;height:150px;transform:translate(-50%,-50%) rotateX(15deg) rotateY(-22deg) rotateZ(-8deg);transform-style:preserve-3d;transition:transform .65s ease;z-index:8}.satlab-body{position:absolute;left:108px;top:48px;width:84px;height:56px;border-radius:7px;background:linear-gradient(145deg,#d9f4f8,#617d88 42%,#213b47);border:1px solid #dffbff99;box-shadow:inset -8px -7px 14px #06131b88,0 0 28px #55ddff25;transform:translateZ(24px);display:grid;place-items:center}.satlab-body span{font-size:7px;letter-spacing:.13em;color:#09202a;font-weight:900}.satlab-body i{position:absolute;right:7px;top:7px;width:7px;height:7px;border-radius:50%;background:#8af3bf;box-shadow:0 0 10px #8af3bf}
.satlab-panel{position:absolute;top:30px;width:105px;height:92px;border:1px solid #7edfffaa;background:linear-gradient(135deg,#09273e,#0c5572 50%,#06233a);box-shadow:inset 0 0 0 2px #173e58,0 0 25px #55ddff18;display:grid;grid-template-columns:repeat(4,1fr);gap:3px;padding:5px;transform-style:preserve-3d;transition:transform .7s ease}.satlab-panel:before{content:"";position:absolute;inset:4px;border:1px solid #8beaff35}.satlab-panel div{border:1px solid #78d9f233;background:linear-gradient(180deg,#123e5c,#061b2e)}.satlab-left{left:0;transform-origin:right center;transform:rotateY(24deg)}.satlab-right{right:0;transform-origin:left center;transform:rotateY(-24deg)}.satlab-sat.deployed .satlab-left{transform:rotateY(2deg) translateX(-10px)}.satlab-sat.deployed .satlab-right{transform:rotateY(-2deg) translateX(10px)}
.satlab-boom{position:absolute;left:186px;top:71px;width:75px;height:4px;background:linear-gradient(90deg,#cbeaf0,#577985);transform:translateZ(28px)}.satlab-dish{position:absolute;left:218px;top:37px;width:52px;height:52px;border-radius:50%;border:2px solid #bcefff77;background:radial-gradient(circle,#234a5b 0 12%,transparent 13% 100%);transform:translateZ(35px) rotateX(58deg)}.satlab-dish i{position:absolute;left:50%;top:50%;width:3px;height:25px;background:#d8faff;transform-origin:top;transform:rotate(28deg)}.satlab-antenna{position:absolute;width:44px;height:2px;background:#d7faff;transform-origin:left center;transform:translateZ(35px)}.satlab-antenna.a1{left:186px;top:62px;transform:rotate(-25deg) translateZ(35px)}.satlab-antenna.a2{left:186px;top:91px;transform:rotate(25deg) translateZ(35px)}
.satlab-link{position:absolute;height:1px;background:linear-gradient(90deg,transparent,#8af3bf,#55ddff,transparent);filter:drop-shadow(0 0 6px #55ddff);z-index:7;transform-origin:left center;opacity:.85}.sl1{left:58%;top:29%;width:220px;transform:rotate(16deg)}.sl2{left:57%;top:35%;width:190px;transform:rotate(-12deg);opacity:.45}.satlab-tag{position:absolute;z-index:12;padding:7px 9px;border:1px solid #2a5365;border-radius:9px;background:#04111af2;color:#a9d3df;font-size:9px;letter-spacing:.08em}.tag-earth{left:24px;bottom:115px}.tag-link{right:25px;top:170px}.tag-power{left:25px;top:170px}
.satlab-controls{position:absolute;left:18px;bottom:58px;display:flex;gap:8px;flex-wrap:wrap;z-index:20}.satlab-controls button{border:1px solid #285064;background:#071923;color:#dff8ff;border-radius:10px;padding:10px 12px;font-size:10px;letter-spacing:.05em;cursor:pointer}.satlab-controls button:hover{border-color:#55ddff88;background:#0b2938}.satlab-readouts{position:absolute;right:18px;bottom:18px;display:grid;grid-template-columns:repeat(4,auto);gap:8px;z-index:20}.satlab-readouts span{min-width:112px;padding:9px 10px;border:1px solid #1d3c4d;background:#041019e8;border-radius:10px}.satlab-readouts b{display:block;font-size:10px;color:#bfeeff}.satlab-readouts small{display:block;margin-top:3px;font-size:8px;color:#668a9b;letter-spacing:.1em}.satlab-satellite-lab-orbiting .satlab-sat{animation:satOrbit 7s linear infinite}@keyframes satOrbit{0%{transform:translate(-50%,-50%) rotateX(15deg) rotateY(-22deg) rotateZ(-8deg) translateX(0)}50%{transform:translate(-50%,-50%) rotateX(15deg) rotateY(158deg) rotateZ(4deg) translateX(42px)}100%{transform:translate(-50%,-50%) rotateX(15deg) rotateY(338deg) rotateZ(-8deg) translateX(0)}}
@media(max-width:900px){.ig3d-satellite-lab{min-height:590px}.satlab-readouts{left:18px;right:18px;grid-template-columns:repeat(2,1fr)}.satlab-controls{bottom:116px}.satlab-sat{transform:translate(-50%,-50%) scale(.82) rotateX(15deg) rotateY(-22deg)}}
@media(max-width:620px){.ig3d-satellite-lab{min-height:500px}.satlab-earth{width:190px;height:190px}.orbit-a{width:390px;height:155px}.orbit-b{width:510px;height:210px}.satlab-sat{transform:translate(-50%,-50%) scale(.58) rotateX(15deg) rotateY(-22deg)}.satlab-tag{display:none}.satlab-controls{left:12px;right:12px;bottom:104px}.satlab-controls button{flex:1;min-width:130px}.satlab-readouts{left:12px;right:12px;bottom:12px}.satlab-readouts span{min-width:0}.satlab-readouts b{font-size:8px}}


/* ===== Original file: igers-advanced-panels-2026-10-03.css ===== */
.igx-adv{position:relative}.igx-adv-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}.igx-adv-card{background:linear-gradient(145deg,rgba(13,29,40,.94),rgba(5,13,19,.94));border:1px solid var(--line);border-radius:20px;padding:20px;min-height:180px;box-shadow:0 14px 45px rgba(0,0,0,.12)}.igx-adv-card.wide{grid-column:span 2}.igx-live{display:inline-flex;align-items:center;gap:7px;padding:6px 9px;border:1px solid var(--line);border-radius:999px;color:var(--green);font-size:10px;font-weight:800;letter-spacing:.08em}.igx-live i{width:7px;height:7px;border-radius:50%;background:var(--green);box-shadow:0 0 12px var(--green);animation:igxPulse 1.5s infinite}.igx-live.warn{color:var(--gold)}.igx-live.warn i{background:var(--gold)}.igx-metric-row{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin-top:15px}.igx-metric{padding:12px;border:1px solid var(--line);border-radius:13px;background:#07131b}.igx-metric small{display:block;color:var(--muted);font-size:9px;text-transform:uppercase;letter-spacing:.1em}.igx-metric b{display:block;font-size:22px;margin-top:3px;font-variant-numeric:tabular-nums}.igx-flow{display:grid;grid-template-columns:repeat(7,1fr);gap:8px;align-items:center;margin-top:17px}.igx-flow-node{padding:13px 8px;text-align:center;border:1px solid #285467;border-radius:13px;background:#07131b;font-size:10px;font-weight:800;position:relative}.igx-flow-node.live:after{content:'LIVE UI';position:absolute;right:6px;top:5px;font-size:7px;color:var(--green)}.igx-flow-arrow{text-align:center;color:var(--cyan);font-weight:900}.igx-progress{height:8px;background:#061018;border:1px solid var(--line);border-radius:99px;overflow:hidden;margin-top:8px}.igx-progress span{display:block;height:100%;width:0;background:linear-gradient(90deg,#55ddff,#8af3bf);transition:width .8s ease}.igx-status-list{display:grid;gap:8px;margin-top:12px}.igx-status-row{display:grid;grid-template-columns:1fr auto;align-items:center;gap:10px;padding:10px 11px;border:1px solid var(--line);border-radius:12px;background:#07131b}.igx-status-row strong{font-size:11px}.igx-status-row span{font-size:9px;font-weight:900;letter-spacing:.08em}.igx-status-row .ok{color:var(--green)}.igx-status-row .warn{color:var(--gold)}.igx-status-row .sim{color:var(--cyan)}.igx-deploy-map{height:285px;border:1px solid var(--line);border-radius:18px;background:radial-gradient(circle at 52% 42%,#183746 0 5%,transparent 6%),linear-gradient(145deg,#07161e,#091018);position:relative;overflow:hidden}.igx-deploy-map:before{content:'';position:absolute;inset:18% 31%;border:2px solid #55ddff55;border-radius:45% 55% 50% 45%;transform:rotate(11deg)}.igx-pin{position:absolute;width:10px;height:10px;border-radius:50%;background:var(--cyan);box-shadow:0 0 16px var(--cyan);transform:translate(-50%,-50%)}.igx-pin:after{content:attr(data-name);position:absolute;left:13px;top:-5px;white-space:nowrap;color:var(--muted);font-size:8px}.igx-event-list{display:grid;gap:8px;max-height:210px;overflow:auto;margin-top:12px}.igx-event{display:grid;grid-template-columns:70px 1fr;gap:9px;padding:9px;border:1px solid var(--line);border-radius:11px;background:#07131b}.igx-event time{font-size:9px;color:var(--cyan);font-variant-numeric:tabular-nums}.igx-event span{font-size:10px;color:var(--muted)}.igx-last-sync,.igx-note{margin-top:9px;color:var(--muted);font-size:10px}.igx-research{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:15px}.igx-equation{padding:15px;border:1px solid var(--line);border-radius:13px;background:#061018;font-family:ui-monospace,SFMono-Regular,Consolas,monospace;color:#d9f7ff;font-size:12px}.igx-alert{border-left:3px solid var(--gold);padding:11px 13px;background:#211b0c66;border-radius:10px;color:#d9c58e;font-size:10px;margin-top:12px}@keyframes igxPulse{50%{opacity:.35;transform:scale(.8)}}@media(max-width:950px){.igx-adv-grid{grid-template-columns:1fr 1fr}.igx-adv-card.wide{grid-column:span 2}.igx-flow{grid-template-columns:1fr 20px 1fr 20px 1fr 20px 1fr}.igx-research{grid-template-columns:1fr}}@media(max-width:650px){.igx-adv-grid{grid-template-columns:1fr}.igx-adv-card.wide{grid-column:span 1}.igx-metric-row{grid-template-columns:1fr 1fr}.igx-flow{grid-template-columns:1fr}.igx-flow-arrow{transform:rotate(90deg)}.igx-deploy-map{height:230px}}


/* ===== Original file: igers-bd-satellite-monitor.css ===== */
.bdmon{margin:20px 0}.bdmon-grid{display:grid;grid-template-columns:1.1fr .9fr;gap:16px}.bdmon-card{position:relative;overflow:hidden}.bdmon-head{display:flex;justify-content:space-between;gap:12px;align-items:center;flex-wrap:wrap}.bdmon-chip{display:inline-flex;align-items:center;gap:8px;padding:6px 10px;border-radius:999px;border:1px solid #2b4a59;background:#07131b;color:#bfeeff;font-size:10px;font-weight:900;letter-spacing:.09em}.bdmon-chip.live{color:#8af3bf;border-color:#2f5a4b}.bdmon-chip.warn{color:#ffd37a;border-color:#6b5930}.bdmon-chip.danger{color:#ff9d9d;border-color:#6e3737}.bdmon-dot{width:7px;height:7px;border-radius:50%;background:#8af3bf;box-shadow:0 0 14px rgba(138,243,191,.9);animation:pulse 1.4s infinite}.bdmon-chip.warn .bdmon-dot{background:#ffd37a;box-shadow:0 0 14px rgba(255,211,122,.8)}.bdmon-chip.danger .bdmon-dot{background:#ff8f8f;box-shadow:0 0 14px rgba(255,143,143,.8)}
.bdmon-map{height:430px;border:1px solid #244b59;border-radius:18px;overflow:hidden;background:#07131b;position:relative}.bdmon-map iframe{width:100%;height:100%;border:0;display:block;filter:saturate(.78) contrast(1.03)}.bdmon-map .map-overlay{position:absolute;left:12px;right:12px;top:12px;display:flex;justify-content:space-between;gap:10px;z-index:3;pointer-events:none}.bdmon-map .map-overlay span{padding:6px 8px;border-radius:9px;background:rgba(4,12,18,.85);border:1px solid #2a5260;color:#bfeeff;font-size:9px;letter-spacing:.08em}.bdmon-sat{height:430px;border:1px solid #244b59;border-radius:18px;overflow:hidden;background:#051018;position:relative}.bdmon-sat img{width:100%;height:100%;object-fit:cover;display:block}.bdmon-sat .sat-loading{position:absolute;inset:0;display:grid;place-items:center;padding:20px;text-align:center;background:radial-gradient(circle at 50% 50%,rgba(85,221,255,.12),rgba(3,10,15,.9) 70%);color:#9fb9c6;font-size:11px}.bdmon-sat .sat-loading.hidden{display:none}.bdmon-sat .sat-overlay{position:absolute;left:12px;right:12px;top:12px;display:flex;justify-content:space-between;gap:10px;z-index:2}.bdmon-sat .sat-overlay span{padding:6px 8px;border-radius:9px;background:rgba(4,12,18,.82);border:1px solid #2a5260;color:#bfeeff;font-size:9px;letter-spacing:.08em}.bdmon-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}.bdmon-actions .btn{flex:1;min-width:170px}.bdmon-meta{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:12px}.bdmon-meta>div{padding:10px;border:1px solid var(--line);border-radius:11px;background:#07131b}.bdmon-meta b{display:block;font-size:11px}.bdmon-meta span{display:block;margin-top:3px;font-size:10px;color:var(--muted)}
.bdmon-scanner{margin-top:16px;display:grid;grid-template-columns:1.2fr .8fr;gap:16px}.bdmon-radar{min-height:440px;position:relative;border:1px solid #244b59;border-radius:20px;overflow:hidden;background:radial-gradient(circle at 50% 50%,#0f3440 0,#07161f 48%,#04090d 100%)}.bdmon-radar-head{position:absolute;left:16px;right:16px;top:14px;display:flex;justify-content:space-between;z-index:3}.bdmon-radar-title{font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#55ddff}.bdmon-radar-live{font-size:10px;color:#8af3bf}.bdmon-scope{position:absolute;left:50%;top:53%;width:min(68vw,330px);height:min(68vw,330px);max-width:330px;max-height:330px;transform:translate(-50%,-50%);border-radius:50%;border:1px solid #55ddff3f;background:repeating-radial-gradient(circle,#55ddff11 0 1px,transparent 1px 66px),radial-gradient(circle,#55ddff08 0 1px,transparent 1px);box-shadow:0 0 75px #55ddff0f inset}.bdmon-scope:before,.bdmon-scope:after{content:"";position:absolute;background:#55ddff20}.bdmon-scope:before{left:50%;top:0;bottom:0;width:1px}.bdmon-scope:after{top:50%;left:0;right:0;height:1px}.bdmon-sweep{position:absolute;left:50%;top:50%;width:50%;height:50%;transform-origin:0 0;background:conic-gradient(from 0deg,transparent 0 326deg,#55ddff28 338deg,#8af3bf78 360deg);clip-path:polygon(0 0,100% 36%,100% 64%);animation:bdmonSweep 3.2s linear infinite}@keyframes bdmonSweep{to{transform:rotate(360deg)}}.bdmon-center{position:absolute;left:50%;top:50%;width:11px;height:11px;border-radius:50%;transform:translate(-50%,-50%);background:#8af3bf;box-shadow:0 0 18px #8af3bf}.bdmon-blip{position:absolute;width:8px;height:8px;border-radius:50%;background:#55ddff;box-shadow:0 0 15px #55ddff;animation:bdmonBlip 2.4s ease-in-out infinite}.bdmon-blip.a{left:30%;top:36%}.bdmon-blip.b{right:24%;top:44%;animation-delay:.6s}.bdmon-blip.c{left:40%;bottom:24%;animation-delay:1.1s}.bdmon-blip.d{right:34%;bottom:31%;animation-delay:1.7s}.bdmon-blip.hot{background:#ffd37a;box-shadow:0 0 17px #ffd37a}.bdmon-blip.danger{background:#ff8f8f;box-shadow:0 0 18px #ff8f8f}@keyframes bdmonBlip{50%{opacity:.35;transform:scale(.55)}}.bdmon-radar-foot{position:absolute;left:16px;right:16px;bottom:14px;display:flex;justify-content:space-between;gap:12px;color:#8da7b6;font-size:9px;z-index:3}.bdmon-side{display:grid;gap:16px}.bdmon-alert{min-height:180px}.bdmon-alert.good{border-color:#2f5a4b}.bdmon-alert.warn{border-color:#6b5930}.bdmon-alert.danger{border-color:#6e3737}.bdmon-alert .alert-level{font-size:10px;letter-spacing:.16em;text-transform:uppercase;font-weight:900}.bdmon-alert.good .alert-level{color:#8af3bf}.bdmon-alert.warn .alert-level{color:#ffd37a}.bdmon-alert.danger .alert-level{color:#ff9d9d}.bdmon-alert h3{margin-top:8px}.bdmon-alert p{color:var(--muted);font-size:11px;margin:6px 0 0}.bdmon-alert-list{display:grid;gap:8px;margin-top:12px;max-height:210px;overflow:auto}.bdmon-event{padding:10px 11px;border:1px solid var(--line);border-radius:11px;background:#07131b}.bdmon-event-top{display:flex;justify-content:space-between;gap:10px;font-size:10px}.bdmon-event-top b{font-size:11px}.bdmon-event-meta{margin-top:3px;font-size:9px;color:var(--muted)}.bdmon-state-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}.bdmon-state{padding:11px;border:1px solid var(--line);border-radius:11px;background:#07131b}.bdmon-state b{display:block;font-size:11px}.bdmon-state span{display:block;color:var(--muted);font-size:9px;margin-top:3px}.bdmon-note{font-size:10px;line-height:1.5;color:var(--muted);padding:11px;border:1px dashed var(--line);border-radius:11px}.bdmon-count{font-size:22px;font-weight:900;color:#bfeeff}.bdmon-statusline{display:flex;justify-content:space-between;gap:10px;margin-top:10px;color:var(--muted);font-size:9px}.bdmon-statusline strong{color:#8af3bf}
@media(max-width:980px){.bdmon-grid,.bdmon-scanner{grid-template-columns:1fr}}@media(max-width:620px){.bdmon-map,.bdmon-sat{height:320px}.bdmon-meta{grid-template-columns:1fr}.bdmon-scope{width:260px;height:260px}.bdmon-state-grid{grid-template-columns:1fr}.bdmon-actions .btn{min-width:100%}}


/* ===== Original file: igers-future-upgrade.css ===== */
/* Compatibility stylesheet retained for the original app reference. New styles are in advanced-live-suite.css. */


/* ===== Original file: igers-live-3d-operations-2026-10-05.css ===== */
/* IGERS-BD-01 — Live Calculation Console + 3D Operations Monitor 2026-10-05 */
#igersLiveOps{margin-top:22px}
.igers-results-console{display:grid;grid-template-columns:1.15fr .85fr;gap:16px;margin-top:18px}
.ilers-panel{background:linear-gradient(180deg,rgba(6,18,27,.96),rgba(4,11,17,.96));border:1px solid rgba(120,225,255,.14);border-radius:18px;padding:18px;box-shadow:0 16px 44px rgba(0,0,0,.16)}
.ilers-head{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;flex-wrap:wrap;margin-bottom:14px}
.ilers-head h3{margin:4px 0 0;font-size:18px}
.ilers-live-badge{display:inline-flex;align-items:center;gap:7px;padding:6px 9px;border-radius:999px;border:1px solid rgba(120,244,180,.18);background:rgba(120,244,180,.06);color:#a6f4c4;font-size:9px;font-weight:900;letter-spacing:.1em;white-space:nowrap}
.ilers-live-badge i{width:7px;height:7px;border-radius:50%;background:#8bf2bf;box-shadow:0 0 13px rgba(139,242,191,.95);animation:ilersPulse 1s infinite}
@keyframes ilersPulse{0%,100%{opacity:.45;transform:scale(.9)}50%{opacity:1;transform:scale(1.15)}}
.ilers-action-row{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px}
.ilers-table{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
.ilers-cell{padding:11px 12px;border-radius:12px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.06);min-width:0}
.ilers-cell b{display:block;font-size:16px;font-variant-numeric:tabular-nums;line-height:1.15;overflow-wrap:anywhere}
.ilers-cell span{display:block;color:var(--muted);font-size:9px;margin-top:4px;line-height:1.35}
.ilers-snapshot{margin-top:10px;padding:11px 12px;border-radius:12px;border:1px dashed rgba(120,225,255,.22);font-size:10px;color:#b9ddea;line-height:1.5}
.ilers-status-line{margin-top:10px;color:var(--muted);font-size:9px;display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;font-variant-numeric:tabular-nums}
.ilers-monitor-shell{position:relative;overflow:hidden;border-radius:20px;border:1px solid rgba(120,225,255,.15);background:linear-gradient(180deg,#07131d,#041018);padding:15px;isolation:isolate}
.ilers-monitor-shell:before{content:"";position:absolute;inset:-20%;background:radial-gradient(circle at 50% 30%,rgba(96,212,255,.12),transparent 34%),radial-gradient(circle at 10% 90%,rgba(98,240,176,.08),transparent 25%);z-index:0;pointer-events:none}
.ilers-monitor-top{position:relative;z-index:2;display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:12px}
.ilers-monitor-top .mini{margin:0}
.ilers-clock{font-variant-numeric:tabular-nums;font-weight:900;font-size:12px;color:#dbf4ff}
.ilers-3d-grid{position:relative;z-index:1;display:grid;grid-template-columns:1.35fr .85fr;gap:12px}
.ilers-sat-3d{min-height:260px;position:relative;overflow:hidden;border-radius:18px;background:radial-gradient(circle at 50% 45%,rgba(85,179,255,.14),transparent 23%),linear-gradient(180deg,#071a2b,#05101a 72%,#030b11);border:1px solid rgba(120,225,255,.12);perspective:900px}
.ilers-space-star{position:absolute;width:2px;height:2px;background:rgba(235,250,255,.7);border-radius:50%;box-shadow:0 0 7px rgba(180,235,255,.55)}
.ilers-earth{position:absolute;left:50%;top:56%;width:126px;height:126px;transform:translate(-50%,-50%);border-radius:50%;background:radial-gradient(circle at 34% 32%,#76caff 0 8%,#2e8acb 22%,#154a73 50%,#071b2a 73%,#030a10 100%);box-shadow:0 0 28px rgba(63,177,255,.28),inset -18px -12px 22px rgba(0,0,0,.45);animation:ilersEarth 16s linear infinite}
@keyframes ilersEarth{from{transform:translate(-50%,-50%) rotate(0)}to{transform:translate(-50%,-50%) rotate(360deg)}}
.ilers-orbit{position:absolute;left:50%;top:56%;width:210px;height:86px;transform:translate(-50%,-50%) rotateX(64deg) rotateZ(-17deg);border:1px solid rgba(139,224,255,.34);border-radius:50%;box-shadow:0 0 20px rgba(64,188,255,.08);animation:ilersOrbit 6s linear infinite}
@keyframes ilersOrbit{from{transform:translate(-50%,-50%) rotateX(64deg) rotateZ(-17deg)}to{transform:translate(-50%,-50%) rotateX(64deg) rotateZ(343deg)}}
.ilers-satellite{position:absolute;left:calc(50% + 82px);top:calc(56% - 39px);width:34px;height:14px;transform:translate(-50%,-50%) rotateY(-18deg) translateZ(90px);z-index:4;animation:ilersSat 6s linear infinite;filter:drop-shadow(0 0 9px rgba(120,220,255,.58))}
@keyframes ilersSat{from{transform:translate(-50%,-50%) rotateY(-18deg) rotateZ(0) translateZ(90px)}to{transform:translate(-50%,-50%) rotateY(-18deg) rotateZ(360deg) translateZ(90px)}}
.ilers-satellite:before{content:"";position:absolute;left:8px;top:3px;width:18px;height:8px;border-radius:3px;background:linear-gradient(90deg,#c4f0ff,#6fb8d6)}
.ilers-satellite:after{content:"";position:absolute;left:-13px;top:2px;width:9px;height:10px;background:#3f80ae;box-shadow:48px 0 0 #3f80ae}
.ilers-link{position:absolute;left:50%;top:56%;width:92px;height:2px;transform-origin:0 50%;background:linear-gradient(90deg,rgba(120,225,255,.55),rgba(120,225,255,0));transform:rotate(-25deg);animation:ilersLink 1.1s ease-in-out infinite}
@keyframes ilersLink{0%,100%{opacity:.22;box-shadow:0 0 0 rgba(120,225,255,0)}50%{opacity:1;box-shadow:0 0 16px rgba(120,225,255,.65)}}
.ilers-sat-hud{position:absolute;inset:12px;display:flex;justify-content:space-between;align-items:flex-start;pointer-events:none;z-index:6}
.ilers-hud-box{padding:7px 9px;border-radius:10px;background:rgba(1,8,13,.55);border:1px solid rgba(120,225,255,.12);backdrop-filter:blur(4px);font-size:9px;color:#a6d8ea}
.ilers-sat-label{position:absolute;left:14px;bottom:13px;font-size:9px;color:#8dbbcb;z-index:6;max-width:85%}
.ilers-rack{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
.ilers-device{min-height:118px;padding:12px;border-radius:16px;border:1px solid rgba(255,255,255,.07);background:linear-gradient(180deg,rgba(9,25,35,.92),rgba(5,13,20,.92));position:relative;overflow:hidden}
.ilers-device-head{display:flex;justify-content:space-between;gap:8px;align-items:center;margin-bottom:9px}
.ilers-device-title{font-size:10px;font-weight:900;letter-spacing:.08em}
.ilers-dot{width:8px;height:8px;border-radius:50%;background:#8ef0bf;box-shadow:0 0 11px rgba(142,240,191,.8);animation:ilersPulse .9s infinite}
.ilers-device[data-state="degraded"] .ilers-dot{background:#ffd77b;box-shadow:0 0 11px rgba(255,215,123,.7)}
.ilers-device[data-state="offline"] .ilers-dot{background:#ff8d8d;box-shadow:0 0 11px rgba(255,141,141,.7);animation:none}
.ilers-orb-gauge{height:62px;display:flex;align-items:center;gap:10px}
.ilers-ring{width:56px;height:56px;border-radius:50%;display:grid;place-items:center;background:conic-gradient(#79d8ff var(--p,35%),rgba(255,255,255,.08) 0);position:relative;flex:none}
.ilers-ring:after{content:"";position:absolute;inset:5px;border-radius:50%;background:#06111a;border:1px solid rgba(255,255,255,.05)}
.ilers-ring span{position:relative;z-index:1;font-size:10px;font-weight:900;font-variant-numeric:tabular-nums}
.ilers-device-value{font-size:16px;font-weight:900;font-variant-numeric:tabular-nums;line-height:1.1;overflow-wrap:anywhere}
.ilers-device-sub{font-size:8px;color:var(--muted);margin-top:4px;line-height:1.35}
.ilers-frame-note{margin-top:10px;font-size:9px;color:#7faabb;font-variant-numeric:tabular-nums;display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap}
.ilers-source-note{font-size:9px;color:#799ca9;margin-top:10px;line-height:1.5}
.ilers-hidden{display:none!important}
@media(max-width:1050px){.ilers-3d-grid{grid-template-columns:1fr}.ilers-sat-3d{min-height:290px}.igers-results-console{grid-template-columns:1fr}}
@media(max-width:620px){.ilers-table,.ilers-rack{grid-template-columns:1fr}.ilers-panel{padding:14px}.ilers-sat-3d{min-height:270px}.ilers-earth{width:112px;height:112px}.ilers-orbit{width:192px;height:82px}.ilers-satellite{left:calc(50% + 74px)} }
@media(prefers-reduced-motion:reduce){.ilers-live-badge i,.ilers-dot,.ilers-earth,.ilers-orbit,.ilers-satellite,.ilers-link{animation:none!important}}


/* ===== Original file: igers-nextgen.css ===== */
/* IGERS-BD-01 — Next-Gen Engineering Simulation Command Center */
:root{--nx-cyan:#58ddff;--nx-green:#79f3b5;--nx-gold:#ffd27a;--nx-red:#ff7f91;--nx-panel:#07131b;--nx-panel2:#0a1d28;--nx-line:#234c5d}
#engineeringLab{position:relative;overflow:hidden}
.nx-shell{display:grid;gap:16px}
.nx-command{display:grid;grid-template-columns:1.25fr .75fr;gap:16px}
.nx-panel{background:linear-gradient(145deg,rgba(9,28,39,.96),rgba(4,11,17,.98));border:1px solid rgba(88,221,255,.18);border-radius:22px;padding:18px;box-shadow:0 18px 55px rgba(0,0,0,.22);position:relative;overflow:hidden}
.nx-panel:before{content:"";position:absolute;inset:-35%;background:radial-gradient(circle at 20% 20%,rgba(88,221,255,.08),transparent 28%),radial-gradient(circle at 80% 70%,rgba(121,243,181,.06),transparent 25%);pointer-events:none}
.nx-panel>*{position:relative;z-index:1}
.nx-head{display:flex;justify-content:space-between;align-items:center;gap:14px;margin-bottom:13px}
.nx-kicker{font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:#79a0b0}
.nx-title{font-size:18px;font-weight:900;letter-spacing:.02em;margin-top:3px}
.nx-sub{font-size:11px;color:#7f99a6;margin-top:3px}
.nx-badges{display:flex;gap:7px;flex-wrap:wrap;justify-content:flex-end}
.nx-badge{display:inline-flex;align-items:center;gap:6px;padding:6px 9px;border:1px solid rgba(88,221,255,.2);border-radius:999px;background:rgba(255,255,255,.02);font-size:9px;font-weight:900;letter-spacing:.08em;color:#9cc1cc}
.nx-badge .led{width:7px;height:7px;border-radius:50%;background:var(--nx-green);box-shadow:0 0 12px var(--nx-green);animation:nxPulse 1.5s infinite}
.nx-badge.warn{color:var(--nx-gold)}.nx-badge.warn .led{background:var(--nx-gold);box-shadow:0 0 12px var(--nx-gold)}
.nx-badge.off{color:var(--nx-red)}.nx-badge.off .led{background:var(--nx-red);box-shadow:none;animation:none}
.nx-navrail{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px}
.nx-navbtn,.nx-modelbtn,.nx-action{border:1px solid rgba(88,221,255,.16);background:#06131a;color:#dff8ff;border-radius:12px;padding:10px 11px;font:inherit;font-size:10px;font-weight:850;letter-spacing:.06em;text-transform:uppercase;cursor:pointer;transition:.18s ease}
.nx-navbtn:hover,.nx-modelbtn:hover,.nx-action:hover{transform:translateY(-1px);border-color:rgba(88,221,255,.48);box-shadow:0 10px 25px rgba(0,0,0,.18)}
.nx-navbtn.active,.nx-modelbtn.active,.nx-action.primary{background:linear-gradient(135deg,#0d3c4d,#0b2834);border-color:rgba(88,221,255,.44);color:#9cecff}
.nx-model-layout{display:grid;grid-template-columns:.72fr 1.28fr;gap:16px;margin-top:16px}
.nx-model-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px;max-height:490px;overflow:auto;padding-right:2px}
.nx-modelbtn{text-align:left;padding:12px}
.nx-modelbtn b{display:block;font-size:11px;color:#f1fbff}
.nx-modelbtn span{display:block;margin-top:3px;font-size:9px;color:#7895a1;text-transform:none;letter-spacing:0}
.nx-view{min-height:490px;display:grid;grid-template-rows:auto 1fr auto;gap:10px}
.nx-viewport{position:relative;min-height:385px;border-radius:19px;border:1px solid #1c4657;background:radial-gradient(circle at 50% 25%,#0e2d3a,#040b11 64%);overflow:hidden}
#nx3dCanvas{width:100%;height:100%;display:block}
.nx-crosshair{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:22px;height:22px;pointer-events:none;border:1px solid rgba(88,221,255,.18);border-radius:50%}
.nx-crosshair:before,.nx-crosshair:after{content:"";position:absolute;background:rgba(88,221,255,.18)}.nx-crosshair:before{left:50%;top:-8px;width:1px;height:38px}.nx-crosshair:after{left:-8px;top:50%;width:38px;height:1px}
.nx-model-overlay{position:absolute;left:12px;top:12px;padding:8px 10px;border:1px solid rgba(88,221,255,.16);border-radius:11px;background:rgba(3,10,15,.74);backdrop-filter:blur(7px);font-size:10px}
.nx-overlay-name{font-weight:900;color:#ecfbff}.nx-overlay-state{margin-top:2px;color:#7ca0ae}
.nx-input-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:9px}
.nx-field{padding:10px;border:1px solid #173b49;border-radius:12px;background:#06131a}
.nx-field label{display:block;font-size:9px;letter-spacing:.08em;text-transform:uppercase;color:#7897a4;margin-bottom:5px}
.nx-field input,.nx-field select{width:100%;border:1px solid #224b5a;border-radius:9px;background:#051018;color:#ecfbff;padding:8px 9px;font:700 12px system-ui,sans-serif}
.nx-field input:focus,.nx-field select:focus{outline:none;border-color:var(--nx-cyan);box-shadow:0 0 0 2px rgba(88,221,255,.08)}
.nx-results{display:grid;grid-template-columns:repeat(4,1fr);gap:9px;margin-top:10px}
.nx-result{padding:12px;border:1px solid #1b4250;border-radius:12px;background:#071820}
.nx-result strong{display:block;font-size:18px;line-height:1.15;color:var(--nx-green);font-variant-numeric:tabular-nums}
.nx-result span{display:block;margin-top:3px;font-size:9px;text-transform:uppercase;letter-spacing:.08em;color:#74909c}
.nx-equation{margin-top:10px;padding:10px 12px;border:1px dashed #285463;border-radius:12px;color:#acc7d1;font:600 11px/1.5 ui-monospace,SFMono-Regular,Consolas,monospace}
.nx-architecture{display:grid;grid-template-columns:repeat(7,1fr);gap:7px;align-items:center}
.nx-stage{padding:11px 8px;text-align:center;border:1px solid #173c4a;border-radius:12px;background:#06131a;font-size:9px;font-weight:900;color:#d8f1f7}
.nx-arrow{text-align:center;color:var(--nx-cyan);font-weight:900}
.nx-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}
.nx-stat{padding:13px;border:1px solid #1a404e;border-radius:13px;background:#071820}
.nx-stat b{display:block;font-size:18px;color:#e8faff;font-variant-numeric:tabular-nums}.nx-stat span{display:block;font-size:9px;margin-top:2px;color:#7894a0;letter-spacing:.08em;text-transform:uppercase}
.nx-calc-layout{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:16px}
.nx-list{display:grid;gap:8px}.nx-row{display:grid;grid-template-columns:1fr auto;gap:10px;align-items:center;padding:10px 12px;border:1px solid #173c4a;border-radius:12px;background:#06131a}.nx-row b{font-size:10px}.nx-row small{display:block;color:#758f9c;margin-top:2px}.nx-row strong{font-size:11px;color:var(--nx-green)}
.nx-admin{display:grid;gap:10px}.nx-admin-actions{display:flex;gap:8px;flex-wrap:wrap}.nx-note{font-size:10px;color:#6e8a97;line-height:1.5}
.nx-scroll-top{position:fixed;right:20px;bottom:18px;z-index:70;display:none;width:42px;height:42px;border-radius:50%;border:1px solid rgba(88,221,255,.35);background:rgba(3,12,18,.9);color:#bdefff;cursor:pointer;box-shadow:0 10px 30px rgba(0,0,0,.25)}
.nx-scroll-top.show{display:block}
@keyframes nxPulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.45;transform:scale(.78)}}
@media(max-width:1050px){.nx-command,.nx-model-layout,.nx-calc-layout{grid-template-columns:1fr}.nx-navrail{grid-template-columns:repeat(3,1fr)}.nx-model-grid{max-height:none}.nx-results{grid-template-columns:repeat(2,1fr)}}
@media(max-width:700px){.nx-navrail{grid-template-columns:1fr 1fr}.nx-model-grid,.nx-input-grid,.nx-results,.nx-stats{grid-template-columns:1fr}.nx-architecture{grid-template-columns:1fr}.nx-arrow{display:none}.nx-head{display:block}.nx-badges{justify-content:flex-start;margin-top:10px}.nx-viewport{min-height:360px}}


/* ===== Original file: iron-dome-runtime-hardening.css ===== */
#ironDomeRuntimeHealth{scroll-margin-top:80px}.idh-grid{display:grid;grid-template-columns:1.15fr .85fr;gap:14px}.idh-card{border:1px solid #214653;border-radius:18px;background:linear-gradient(145deg,#0b1b24,#061018);padding:16px}.idh-kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.idh-kpi{padding:11px;border:1px solid #1b3946;border-radius:11px;background:#06141c}.idh-kpi b{display:block;font-size:15px}.idh-kpi span{display:block;color:#849da8;font-size:8px;text-transform:uppercase;letter-spacing:.08em;margin-top:3px}.idh-source{display:flex;align-items:center;justify-content:space-between;gap:9px;padding:9px 0;border-bottom:1px solid rgba(255,255,255,.05);font-size:10px}.idh-dot{width:8px;height:8px;border-radius:50%;display:inline-block;background:#76858b;margin-right:6px}.idh-dot.live{background:#8af3bf;box-shadow:0 0 10px rgba(138,243,191,.55)}.idh-dot.warn{background:#ffd37a}.idh-dot.offline{background:#ff8d8d}.idh-actions{display:flex;gap:7px;flex-wrap:wrap;margin-top:10px}.idh-actions button{border:1px solid #294b5b;background:#07151e;color:#eaf7fb;border-radius:9px;padding:8px 11px;font:inherit;font-size:9px;cursor:pointer}.idh-actions button:hover{border-color:#55ddff}.idh-locked{opacity:.45}.idh-note{font-size:9px;color:#819aa5;line-height:1.55}.idh-log{max-height:170px;overflow:auto;font-family:ui-monospace,SFMono-Regular,Consolas,monospace;font-size:9px;line-height:1.55;background:#030a0f;border:1px solid #1b3946;border-radius:10px;padding:10px;white-space:pre-wrap}.idh-badge{display:inline-flex;align-items:center;gap:6px;border:1px solid #294b5b;border-radius:999px;padding:6px 8px;color:#9eb5bf;font-size:8px;font-weight:800;letter-spacing:.07em}.idh-badge.on{color:#8af3bf;border-color:#2f765c}.idh-badge.warn{color:#ffd37a;border-color:#80612e}@media(max-width:900px){.idh-grid{grid-template-columns:1fr}.idh-kpis{grid-template-columns:1fr 1fr}}@media(max-width:620px){.idh-kpis{grid-template-columns:1fr}.idh-actions button{flex:1 1 130px}}


/* ===== Original file: legal.css ===== */
:root{--bg:#050b10;--panel:#0b151e;--panel2:#0d1d28;--line:#1b3545;--text:#eef8fc;--muted:#8da7b6;--cyan:#55ddff;--green:#8af3bf;--gold:#ffd37a;--danger:#ff8d8d}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:radial-gradient(circle at 15% 0%,#123044 0,#071019 38%,#04080c 100%);color:var(--text);font:15px/1.7 Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif}.wrap{max-width:1000px;margin:auto;padding:0 22px}a{color:var(--cyan);text-decoration:none}a:hover{text-decoration:underline}.nav{position:sticky;top:0;z-index:10;background:rgba(4,10,15,.88);backdrop-filter:blur(16px);border-bottom:1px solid rgba(120,210,240,.12)}.navin{min-height:70px;display:flex;align-items:center;justify-content:space-between;gap:18px}.brand{color:var(--text);font-weight:900;letter-spacing:.1em}.brand small{display:block;color:var(--muted);font-size:9px;letter-spacing:.04em;font-weight:500}.navlinks{display:flex;gap:14px;flex-wrap:wrap;font-size:12px;color:var(--muted)}.navlinks a{color:var(--muted)}main{padding:70px 0 90px}.eyebrow{display:inline-block;border:1px solid var(--line);border-radius:999px;padding:6px 10px;color:var(--green);font-size:10px;letter-spacing:.14em;text-transform:uppercase}h1{font-size:clamp(38px,6vw,64px);line-height:1;margin:18px 0 12px;letter-spacing:-.04em}h2{font-size:24px;margin:34px 0 8px;color:#dff8ff}h3{font-size:17px;margin:24px 0 6px}.lead{color:var(--muted);max-width:780px}.updated{font-size:11px;color:var(--muted);margin:18px 0 28px}.panel{background:linear-gradient(145deg,rgba(13,29,40,.9),rgba(7,15,22,.9));border:1px solid var(--line);border-radius:20px;padding:26px;margin:16px 0}.panel p,.panel li{color:#c4d6de}.panel ul{padding-left:22px}.notice{border-left:2px solid var(--gold);padding:12px 16px;background:rgba(255,211,122,.05);color:#d8e5ea}.legal-nav{display:flex;gap:10px;flex-wrap:wrap;margin:28px 0}.legal-nav a{border:1px solid var(--line);padding:8px 11px;border-radius:10px;color:var(--muted);font-size:12px}.legal-nav a:hover{color:var(--cyan);text-decoration:none;border-color:#356779}footer{border-top:1px solid rgba(120,180,200,.12);padding:30px 0;color:#718995;font-size:11px}footer strong{color:#d7f3fa}@media(max-width:650px){.navin{align-items:flex-start;padding:14px 0;flex-direction:column}.navlinks{width:100%;overflow:auto;flex-wrap:nowrap}.navlinks a{white-space:nowrap}main{padding-top:45px}.panel{padding:20px}}


/* ===== Original file: live-indicator-fix.css ===== */
/* IGERS-BD-01 — Live Indicator Precision Fix 2026.10.03 */
.igers-live-badge{display:inline-flex;align-items:center;gap:8px;padding:6px 10px;border:1px solid rgba(138,243,191,.20);border-radius:999px;color:#8af3bf;background:rgba(138,243,191,.035);font-size:10px;font-weight:900;letter-spacing:.11em;text-transform:uppercase;white-space:nowrap}
.igers-live-badge .igers-live-led{width:7px;height:7px;min-width:7px;border-radius:50%;background:#8af3bf;box-shadow:0 0 12px #8af3bf;animation:igersLedPulse 1.25s ease-in-out infinite}
.igers-live-badge.degraded{color:#ffd37a;border-color:rgba(255,211,122,.20)}
.igers-live-badge.degraded .igers-live-led{background:#ffd37a;box-shadow:0 0 12px #ffd37a}
.igers-live-badge.offline{color:#ff9b9b;border-color:rgba(255,141,141,.22)}
.igers-live-badge.offline .igers-live-led{background:#ff8d8d;box-shadow:0 0 12px #ff8d8d;animation:none}
.igers-live-badge.stale{color:#ffca8a;border-color:rgba(255,170,100,.20)}
.igers-live-badge.stale .igers-live-led{background:#ffad69;box-shadow:0 0 12px #ffad69;animation:none}
.air-live{display:inline-flex!important;align-items:center;gap:7px}
.air-live::before{content:"";width:7px;height:7px;min-width:7px;border-radius:50%;background:#8af3bf;box-shadow:0 0 12px #8af3bf;animation:igersLedPulse 1.25s ease-in-out infinite}
.air-live.degraded::before{background:#ffd37a;box-shadow:0 0 12px #ffd37a}
.air-live.stale::before{background:#ffad69;box-shadow:0 0 12px #ffad69;animation:none}
.air-live.offline::before{background:#ff8d8d;box-shadow:0 0 12px #ff8d8d;animation:none}
.live-panel .live-dot{flex:0 0 auto}
@keyframes igersLedPulse{0%,100%{transform:scale(.86);opacity:.72}50%{transform:scale(1.18);opacity:1}}
@media(prefers-reduced-motion:reduce){.igers-live-badge .igers-live-led,.air-live::before{animation:none}}


/* ===== Original file: live-results-3d-flow-center.css ===== */
/* IGERS-BD-01 — Independent Live Data / Feed / Result / 3D / Traffic-Flow center */
.lrc-section{position:relative;overflow:hidden;border-top:1px solid rgba(85,221,255,.10);padding:72px 0}
.lrc-section:before{content:"";position:absolute;inset:0;pointer-events:none;background:radial-gradient(circle at 80% 8%,rgba(85,221,255,.055),transparent 34%),radial-gradient(circle at 14% 80%,rgba(138,243,191,.035),transparent 30%)}
.lrc-shell{position:relative}
.lrc-head{display:flex;justify-content:space-between;align-items:end;gap:20px;margin-bottom:18px}
.lrc-head h2{margin:3px 0 8px}.lrc-head p{margin:0;max-width:920px;color:var(--muted)}
.lrc-badge{display:inline-flex;align-items:center;gap:7px;padding:7px 10px;border:1px solid #214454;border-radius:999px;background:#07131b;font-size:10px;font-weight:900;white-space:nowrap}
.lrc-dot{width:8px;height:8px;border-radius:50%;background:#ffd37a;box-shadow:0 0 12px #ffd37a88}.lrc-badge.live .lrc-dot{background:#8af3bf;box-shadow:0 0 13px #8af3bf99}.lrc-badge.offline .lrc-dot{background:#ff7777;box-shadow:0 0 13px #ff777766}
.lrc-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}
.lrc-panel{min-width:0;background:linear-gradient(145deg,rgba(12,28,39,.94),rgba(5,13,20,.97));border:1px solid #214454;border-radius:20px;padding:16px;box-shadow:0 18px 55px rgba(0,0,0,.20)}
.lrc-panel h3{margin:0 0 5px;font-size:17px}.lrc-sub{margin:0;color:#8da7b6;font-size:11px}.lrc-panel-head{display:flex;justify-content:space-between;gap:10px;align-items:start}
.lrc-state{padding:5px 8px;border:1px solid #214454;border-radius:999px;color:#8da7b6;background:#061018;font-size:9px;font-weight:900;white-space:nowrap}.lrc-state.live{color:#8af3bf;border-color:#245b47}.lrc-state.warn{color:#ffd37a;border-color:#665221}.lrc-state.offline{color:#ffabab;border-color:#633333}
.lrc-stream{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin-top:12px}.lrc-kpi{padding:10px;border:1px solid #214454;border-radius:12px;background:#07131b}.lrc-kpi b{display:block;font-size:18px;line-height:1.15}.lrc-kpi span{display:block;margin-top:4px;color:#8da7b6;font-size:8px;text-transform:uppercase;letter-spacing:.1em}
.lrc-feed-list{display:grid;gap:7px;max-height:210px;overflow:auto;margin-top:11px}.lrc-feed-row{display:grid;grid-template-columns:1fr auto;gap:10px;padding:9px 10px;border:1px solid #214454;border-radius:11px;background:#07131b}.lrc-feed-row strong{display:block;font-size:10px}.lrc-feed-row small{display:block;color:#8da7b6;font-size:9px;margin-top:2px}.lrc-feed-row em{font-style:normal;color:#55ddff;font-size:10px;white-space:nowrap}
.lrc-table-wrap{max-height:275px;overflow:auto;margin-top:12px;border:1px solid #214454;border-radius:12px}.lrc-table{width:100%;border-collapse:collapse;font-size:10px}.lrc-table th,.lrc-table td{padding:8px;border-bottom:1px solid rgba(33,68,84,.55);text-align:left}.lrc-table th{position:sticky;top:0;background:#08151f;color:#8da7b6;font-size:8px;text-transform:uppercase;letter-spacing:.08em}.lrc-empty{padding:18px;color:#8da7b6;font-size:10px}
.lrc-canvas-wrap{height:330px;margin-top:12px;border:1px solid #214454;border-radius:16px;background:radial-gradient(circle at 50% 44%,#0e2b3a,#040d14 68%);overflow:hidden;position:relative}.lrc-canvas-wrap canvas{display:block;width:100%;height:100%}.lrc-overlay{position:absolute;top:10px;left:10px;right:10px;display:flex;justify-content:space-between;gap:8px;pointer-events:none}.lrc-chip{padding:5px 8px;border:1px solid #315566;border-radius:999px;background:rgba(3,12,17,.80);font-size:8px;color:#d7eef5}
.lrc-toolbar{display:flex;flex-wrap:wrap;gap:7px;margin-top:10px}.lrc-btn{padding:9px 11px;border:1px solid #214454;border-radius:10px;background:#08161f;color:#eaf7fc;font-weight:800;font-size:10px;cursor:pointer}.lrc-btn:hover{border-color:#3f7183;background:#0a1c26}.lrc-btn.primary{background:linear-gradient(135deg,#44cfee,#77f0c0);color:#031016;border-color:transparent}
.lrc-sourcebar{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}.lrc-sourcebar span,.lrc-sourcebar a{padding:5px 8px;border:1px solid #214454;border-radius:999px;background:#061018;color:#8da7b6;font-size:8px}.lrc-sourcebar a:hover{color:#55ddff;border-color:#3f7183}
.lrc-note{padding:10px 11px;border:1px dashed #214454;border-radius:11px;color:#8da7b6;font-size:9px;line-height:1.5;margin-top:10px}.lrc-note strong{color:#eaf7fc}
.lrc-flow-legend{display:flex;flex-wrap:wrap;gap:6px;margin-top:9px}.lrc-flow-legend span{padding:4px 7px;border:1px solid #214454;border-radius:999px;color:#8da7b6;font-size:8px;background:#061018}
@media(max-width:900px){.lrc-grid{grid-template-columns:1fr}.lrc-stream{grid-template-columns:1fr 1fr}.lrc-head{align-items:flex-start;flex-direction:column}}
@media(max-width:540px){.lrc-stream{grid-template-columns:1fr 1fr}.lrc-canvas-wrap{height:280px}}


/* ===== Original file: mobile-tower-control.css ===== */

.tower-control-section{padding:72px 0;background:linear-gradient(180deg,rgba(6,14,20,.0),rgba(8,26,36,.18),rgba(6,14,20,0))}
.tower-toolbar{display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin:14px 0 18px}.tower-sync{margin-left:auto;color:var(--muted);font-size:10px;letter-spacing:.04em}.tower-grid{display:grid;grid-template-columns:1.45fr .55fr;gap:16px}.tower-card-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:13px}.tower-chip{display:inline-flex;align-items:center;gap:7px;padding:6px 9px;border:1px solid var(--line);border-radius:999px;color:var(--muted);font-size:10px;letter-spacing:.06em;white-space:nowrap}.tower-chip.live{color:var(--green);border-color:#2c6452;background:#0a1b17}.tower-chip.good{color:var(--green);border-color:#2c6452;background:#0a1b17}.tower-chip.watch{color:#ffd37a;border-color:#665a31;background:#1b170b}.tower-chip.down{color:#ff9b9b;border-color:#713f3f;background:#201010}.tower-dot{width:6px;height:6px;border-radius:50%;background:currentColor;box-shadow:0 0 11px currentColor}.tower-map-card,.tower-summary-card{min-height:100%}.tower-map-stage{position:relative;min-height:430px;border:1px solid #234454;border-radius:18px;overflow:hidden;background:#06121a}.tower-map-stage iframe{width:100%;height:430px;border:0;display:block;filter:saturate(.75) contrast(1.04)}.tower-map-gridline{position:absolute;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,#55ddff22,transparent);pointer-events:none}.tower-map-gridline.one{top:33%}.tower-map-gridline.two{top:66%}.tower-node{position:absolute;transform:translate(-50%,-50%);display:flex;gap:6px;align-items:center;z-index:2;cursor:pointer}.tower-node span{width:13px;height:13px;border-radius:50%;background:#55ddff;border:2px solid #c8f6ff;box-shadow:0 0 0 5px #55ddff18,0 0 18px #55ddff;animation:towerpulse 2.2s infinite}.tower-node b{padding:5px 8px;border:1px solid #3a5967;background:#061018e8;border-radius:8px;font-size:9px;color:#d9f5fd;white-space:nowrap}.tower-node.watch span{background:#ffd37a;box-shadow:0 0 0 5px #ffd37a12,0 0 18px #ffd37a}.tower-node.down span{background:#ff8d8d;box-shadow:0 0 0 5px #ff8d8d12,0 0 18px #ff8d8d}@keyframes towerpulse{50%{transform:scale(.72);opacity:.65}}.n-dhaka{left:51%;top:57%}.n-comilla{left:59%;top:65%}.n-ctg{left:70%;top:76%}.n-raj{left:28%;top:59%}.n-rang{left:34%;top:34%}.n-khul{left:38%;top:77%}.n-syl{left:69%;top:38%}.n-bar{left:48%;top:83%}.tower-map-legend{position:absolute;left:12px;right:12px;bottom:12px;z-index:3;display:flex;flex-wrap:wrap;gap:10px;padding:8px 10px;border:1px solid #274858;background:#061018e8;border-radius:11px;font-size:9px;color:#b7cdd6;backdrop-filter:blur(6px)}.tower-map-legend i{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:4px}.tower-map-legend i.ok{background:#55ddff}.tower-map-legend i.watch{background:#ffd37a}.tower-map-legend i.down{background:#ff8d8d}.legend-note{margin-left:auto;color:#6f8792}.tower-map-actions{display:flex;gap:9px;flex-wrap:wrap;margin-top:12px}
.tower-kpis{display:grid;grid-template-columns:1fr 1fr;gap:10px}.tower-kpis>div{padding:13px;border:1px solid var(--line);border-radius:12px;background:#07131b}.tower-kpis strong{display:block;font-size:27px;line-height:1.1;margin-top:4px}.tower-health{margin-top:14px;padding-top:12px;border-top:1px solid var(--line)}.tower-health-head{display:flex;justify-content:space-between;gap:10px;font-size:11px}.tower-meter{height:7px;background:#10232d;border-radius:99px;overflow:hidden;margin-top:8px}.tower-meter i{display:block;width:0;height:100%;background:linear-gradient(90deg,#ff8d8d,#ffd37a,#55ddff,#8af3bf);border-radius:99px;transition:width .35s ease}.tower-source-box{display:grid;gap:8px;margin-top:14px;padding:12px;border:1px solid var(--line);border-radius:12px;background:#07131b}.tower-source-box>b{font-size:11px}.tower-source-box>div{display:flex;justify-content:space-between;gap:10px;font-size:10px}.tower-source-box span{color:var(--muted)}.tower-source-box strong{color:#ccefff}.tower-notice{margin-top:12px;padding:10px 11px;border-left:3px solid #55ddff;background:#08151e;color:var(--muted);font-size:10px;line-height:1.5}.tower-list{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-top:16px}.tower-card{padding:16px;border:1px solid var(--line);border-radius:16px;background:linear-gradient(145deg,#0c1d27,#07131b)}.tower-card.watch{border-color:#5b4d2a}.tower-card.down{border-color:#693b3b}.tower-row-top{display:flex;justify-content:space-between;gap:10px;align-items:flex-start}.tower-name{font-weight:850}.tower-id{font-size:9px;color:var(--muted);margin-top:2px}.tower-services{display:grid;grid-template-columns:repeat(4,1fr);gap:7px;margin-top:12px}.tower-service{padding:8px 7px;border:1px solid var(--line);border-radius:10px;background:#07131b}.tower-service small{display:block;color:var(--muted);font-size:8px;text-transform:uppercase;letter-spacing:.08em}.tower-service b{display:block;margin-top:3px;font-size:11px}.tower-signal-bar{height:5px;background:#12242d;border-radius:99px;overflow:hidden;margin-top:5px}.tower-signal-bar i{display:block;height:100%;border-radius:99px;background:linear-gradient(90deg,#ff8d8d,#ffd37a,#55ddff,#8af3bf);transition:width .3s ease}.tower-actions{display:flex;flex-wrap:wrap;gap:7px;margin-top:12px}.tower-actions button,.tower-command-grid button{border:1px solid var(--line);background:#0a1923;color:var(--text);border-radius:9px;padding:8px 10px;font:inherit;font-size:9px;cursor:pointer}.tower-actions button:hover,.tower-command-grid button:hover{border-color:#55ddff66;background:#0e2430}.tower-actions button[data-mode="maintenance"]{color:#ffd37a}.tower-actions button[data-mode="monitor"]{color:#8af3bf}.tower-command{margin-top:16px}.tower-command-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:8px}.tower-command-log{margin-top:11px;padding:10px;border:1px dashed var(--line);border-radius:10px;color:var(--muted);font-size:10px;min-height:38px}.tower-control-section .btn{cursor:pointer}@media(max-width:980px){.tower-grid{grid-template-columns:1fr}.tower-list{grid-template-columns:1fr 1fr}.tower-command-grid{grid-template-columns:repeat(3,1fr)}}@media(max-width:680px){.tower-toolbar{align-items:stretch}.tower-toolbar .btn{width:100%}.tower-sync{width:100%;margin-left:0}.tower-map-stage,.tower-map-stage iframe{min-height:360px;height:360px}.tower-list{grid-template-columns:1fr}.tower-services{grid-template-columns:1fr 1fr}.tower-command-grid{grid-template-columns:1fr 1fr}.tower-node b{display:none}.tower-node span{width:11px;height:11px}}


/* ===== Original file: nasa-gibs-bd.css ===== */
.gibs-fusion{margin-top:10px;border:1px solid rgba(85,221,255,.16);border-radius:14px;background:linear-gradient(145deg,#071821,#040b11);overflow:hidden}.gibs-fusion-head{display:flex;justify-content:space-between;gap:10px;align-items:flex-start;padding:10px 11px;border-bottom:1px solid rgba(120,210,240,.08)}.gibs-fusion-head h4{margin:3px 0;font-size:12px}.gibs-fusion-kicker{font-size:8px;letter-spacing:.13em;text-transform:uppercase;color:#55ddff;font-weight:900}.gibs-fusion-sub{margin:0;color:#7f98a4;font-size:8px;line-height:1.45}.gibs-state{padding:5px 7px;border-radius:999px;border:1px solid #214653;color:#ffd37a;font-size:8px;font-weight:900;white-space:nowrap}.gibs-state.ok{color:#8af3bf;border-color:#2d684f}.gibs-state.off{color:#ff9a9a;border-color:#663636}.gibs-map{position:relative;height:240px;overflow:hidden;background:#061018}.gibs-tiles{position:absolute;inset:0;overflow:hidden}.gibs-tile{position:absolute;width:256px;height:256px;object-fit:cover}.gibs-overlay{position:absolute;inset:0;pointer-events:none;background:linear-gradient(180deg,rgba(1,8,13,.08),rgba(1,8,13,.24));mix-blend-mode:multiply}.gibs-label{position:absolute;left:9px;top:9px;padding:5px 7px;background:rgba(3,12,17,.74);border:1px solid rgba(85,221,255,.16);border-radius:8px;color:#d9f2fa;font-size:8px;font-weight:900}.gibs-foot{display:flex;justify-content:space-between;gap:8px;align-items:center;padding:8px 10px;border-top:1px solid rgba(120,210,240,.08);font-size:8px;color:#76919c}.gibs-foot a{color:#55ddff}.gibs-controls{display:flex;gap:6px;padding:7px 10px;flex-wrap:wrap}.gibs-controls button,.gibs-controls select{border:1px solid rgba(85,221,255,.14);background:#06141d;color:#d9f2fa;border-radius:8px;padding:6px 7px;font-size:8px;cursor:pointer}.gibs-controls select{max-width:220px}.gibs-controls button:hover{border-color:#55ddff}@media(max-width:650px){.gibs-map{height:210px}}


/* ===== Original file: pwa-download-fix.css ===== */
.pwa-center{margin:14px 0;padding:14px;border:1px solid #234a59;border-radius:16px;background:linear-gradient(145deg,#0b1b24,#061018)}.pwa-row{display:flex;gap:8px;align-items:center;flex-wrap:wrap}.pwa-row button{min-height:40px;padding:9px 12px;border:1px solid #2a5363;border-radius:10px;background:#07151e;color:#eef8fc;font:inherit;font-size:10px;cursor:pointer}.pwa-row button.primary{border-color:#2f765c;color:#8af3bf}.pwa-state{font-size:9px;color:#839ca6;margin-top:8px}.pwa-badge{display:inline-flex;align-items:center;gap:6px;padding:6px 8px;border:1px solid #294b5b;border-radius:999px;color:#9eb5bf;font-size:8px;font-weight:800;letter-spacing:.07em}.pwa-badge.ready{color:#8af3bf;border-color:#2f765c}.pwa-badge.warn{color:#ffd37a;border-color:#80612e}


/* ===== Original file: style.css ===== */
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:#050b13;color:#eaf7ff;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;line-height:1.6}a{color:inherit;text-decoration:none}img,svg{max-width:100%;display:block}.site-header{height:76px;position:fixed;z-index:20;top:0;left:0;right:0;display:flex;align-items:center;justify-content:space-between;padding:0 5vw;background:rgba(5,11,19,.72);border-bottom:1px solid rgba(130,190,220,.12);backdrop-filter:blur(18px)}.brand{display:flex;align-items:center;gap:11px;letter-spacing:.02em}.brand-mark{width:34px;height:34px;border:1px solid #65dcf6;border-radius:9px;display:grid;place-items:center;color:#71e9ff;font-weight:800;box-shadow:0 0 24px rgba(65,215,245,.16)}.brand small{display:block;color:#7e9aac;font-size:9px;text-transform:uppercase;letter-spacing:.18em}.nav{display:flex;gap:28px;font-size:12px;text-transform:uppercase;letter-spacing:.12em;color:#a8bfcc}.nav a{transition:.25s}.nav a:hover{color:#70e7fb}.menu-toggle{display:none;background:none;border:0;color:#dff8ff;font-size:25px}.hero{min-height:100vh;position:relative;overflow:hidden;display:grid;grid-template-columns:1fr 1fr;align-items:center;padding:120px 7vw 70px;background:radial-gradient(circle at 74% 48%,rgba(25,118,159,.2),transparent 32%),linear-gradient(120deg,#040910,#071321 55%,#040a12)}.hero-grid{position:absolute;inset:0;opacity:.25;background-image:linear-gradient(rgba(103,182,207,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(103,182,207,.08) 1px,transparent 1px);background-size:52px 52px;mask-image:linear-gradient(to bottom,black,transparent 90%)}.hero-water{position:absolute;width:75vw;height:20vw;right:-15vw;bottom:-7vw;border:1px solid rgba(77,218,244,.15);border-radius:50%;transform:rotate(-8deg);box-shadow:0 0 100px rgba(30,177,219,.07)}.hero-copy,.hero-visual{position:relative;z-index:2}.hero-copy{max-width:670px}.eyebrow{color:#68d9f1;font-size:10px;letter-spacing:.22em;font-weight:750;margin:0 0 16px}.hero h1{font-size:clamp(64px,8vw,116px);line-height:.86;letter-spacing:-.065em;margin:0;color:#f3fbff}.hero h1 span{color:#63e2fa;font-weight:350}.hero h2{font-size:clamp(20px,2.2vw,31px);line-height:1.2;max-width:600px;margin:25px 0 18px;font-weight:550;letter-spacing:-.02em}.lead{color:#9bb4c2;max-width:600px;font-size:16px}.motto{font-size:13px;letter-spacing:.06em;color:#d9f8ff;border-left:2px solid #5ee5fb;padding-left:15px;margin:28px 0}.hero-actions{display:flex;gap:12px;flex-wrap:wrap}.btn{padding:12px 18px;border:1px solid rgba(111,224,245,.3);border-radius:8px;font-size:11px;text-transform:uppercase;letter-spacing:.12em;transition:.25s}.btn.primary{background:#68dff6;color:#031018;border-color:#68dff6;font-weight:750}.btn:hover{transform:translateY(-2px);box-shadow:0 12px 35px rgba(65,205,238,.12)}.btn.ghost{color:#cdebf4;background:rgba(255,255,255,.025)}.hero-visual{filter:drop-shadow(0 20px 50px rgba(27,172,220,.1));animation:float 6s ease-in-out infinite}.scroll-hint{position:absolute;bottom:28px;left:7vw;color:#637d8b;font-size:9px;letter-spacing:.2em}.scroll-hint span{color:#69e1fa;margin-left:8px}.section{padding:120px 7vw;position:relative}.section-head{max-width:790px;margin-bottom:55px}.section-head h2{font-size:clamp(34px,5vw,62px);line-height:1.05;letter-spacing:-.045em;margin:0 0 18px}.section-head p:not(.eyebrow){color:#829aa8;max-width:700px}.concept{background:#07111c}.system-map{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;position:relative}.node{min-height:150px;border:1px solid rgba(108,178,205,.16);background:linear-gradient(145deg,rgba(21,44,60,.72),rgba(7,17,28,.8));padding:20px;border-radius:12px;position:relative;overflow:hidden;transition:.3s}.node:after{content:"";position:absolute;left:0;right:0;bottom:0;height:2px;background:linear-gradient(90deg,transparent,#55dff7,transparent);transform:scaleX(.25);transition:.3s}.node:hover{transform:translateY(-4px);border-color:rgba(93,220,242,.38)}.node:hover:after{transform:scaleX(1)}.node span{font-size:9px;color:#5bd9f3;letter-spacing:.18em}.node b{display:block;font-size:18px;margin-top:25px}.node small{display:block;color:#718b9a;margin-top:4px}.engineering-note{margin-top:24px;border-left:2px solid #58dff6;padding:16px 20px;background:rgba(73,189,216,.04);display:flex;gap:20px;font-size:12px}.engineering-note strong{white-space:nowrap;color:#bdeaf5}.engineering-note span{color:#728b99}.vision{background:linear-gradient(180deg,#050b13,#07121c)}.compact{margin-bottom:38px}.cards{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}.vision-card{padding:28px;border:1px solid rgba(115,180,205,.14);border-radius:14px;background:rgba(13,28,42,.58);min-height:270px;transition:.3s}.vision-card:hover{transform:translateY(-7px);background:rgba(17,39,55,.8);border-color:rgba(101,224,245,.35)}.vision-card .icon{font-size:30px;color:#68e4fa;height:60px}.vision-card p{color:#5b7787;font-size:10px;letter-spacing:.18em}.vision-card h3{font-size:22px;margin:5px 0 8px}.vision-card span{font-size:13px;color:#8099a7}.gallery{background:#050a11}.gallery-grid{display:grid;grid-template-columns:1.3fr .7fr .7fr;gap:16px}.visual-card{margin:0;border:1px solid rgba(112,177,199,.13);border-radius:14px;overflow:hidden;background:#09131f;min-height:300px;position:relative}.visual-card img{width:100%;height:100%;min-height:260px;object-fit:cover;opacity:.88;transition:.5s}.visual-card:hover img{transform:scale(1.025);opacity:1}.visual-card figcaption{position:absolute;left:0;right:0;bottom:0;padding:30px 22px 20px;background:linear-gradient(transparent,rgba(2,7,12,.96));display:flex;flex-direction:column}.visual-card figcaption b{font-size:17px}.visual-card figcaption span{font-size:11px;color:#9bb1bc}.visual-card.large{grid-row:span 2;min-height:620px}.visual-card.wide{grid-column:1/-1;min-height:370px}.identity{background:radial-gradient(circle at 75% 40%,rgba(43,158,190,.12),transparent 30%),#07101a}.identity-panel{max-width:1050px;margin:auto;padding:55px;display:grid;grid-template-columns:170px 1fr;gap:55px;border:1px solid rgba(109,191,216,.18);border-radius:20px;background:linear-gradient(135deg,rgba(19,43,58,.72),rgba(6,15,25,.84));box-shadow:0 25px 80px rgba(0,0,0,.22)}.seal{width:140px;height:140px;border:1px solid #54d9f2;border-radius:50%;display:grid;place-items:center;text-align:center;font-size:22px;font-weight:800;line-height:1.05;color:#6fe5fa;box-shadow:inset 0 0 40px rgba(75,218,244,.07),0 0 50px rgba(75,218,244,.08)}.seal span{font-size:12px;letter-spacing:.3em}.identity h2{font-size:50px;line-height:1;margin:0}.identity h3{font-weight:400;color:#94adba;margin:10px 0 30px}.id-lines{display:grid;grid-template-columns:1fr 1fr;gap:12px}.id-lines p{margin:0;padding:13px;border-top:1px solid rgba(128,184,204,.13);display:flex;flex-direction:column}.id-lines b{font-size:9px;color:#55d9f1;letter-spacing:.16em;text-transform:uppercase}.id-lines span{font-size:13px;color:#d5e8ee}.future{min-height:650px;display:grid;place-items:center;overflow:hidden;background:#040910}.centered{text-align:center;margin:auto;max-width:800px;position:relative;z-index:2}.centered p:not(.eyebrow){margin-left:auto;margin-right:auto}.motto-large{margin-top:45px;font-size:clamp(25px,4vw,46px);line-height:1.12;letter-spacing:-.035em;color:#e7fbff}.future-orbit{position:absolute;width:650px;height:650px;border:1px solid rgba(89,213,238,.1);border-radius:50%;animation:spin 35s linear infinite}.future-orbit:before,.future-orbit:after,.future-orbit span{content:"";position:absolute;border:1px solid rgba(89,213,238,.07);border-radius:50%}.future-orbit:before{inset:80px}.future-orbit:after{inset:170px}.future-orbit span:nth-child(1){width:8px;height:8px;background:#67e4fa;top:8%;left:48%;box-shadow:0 0 30px #67e4fa}.future-orbit span:nth-child(2){width:5px;height:5px;background:#67e4fa;bottom:20%;right:12%}.future-orbit span:nth-child(3){width:6px;height:6px;background:#67e4fa;left:18%;bottom:18%}footer{padding:35px 7vw;border-top:1px solid rgba(120,180,200,.12);display:flex;justify-content:space-between;gap:30px;color:#718995;font-size:10px;letter-spacing:.08em;text-transform:uppercase}footer strong{display:block;color:#d7f3fa;font-size:14px}footer span{display:block;margin-top:4px}.footer-mid{align-self:center;color:#5f7987}@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}@keyframes spin{to{transform:rotate(360deg)}}@media(max-width:900px){.hero{grid-template-columns:1fr;padding-top:120px}.hero-visual{max-width:650px;margin:10px auto 0}.hero-copy{max-width:760px}.system-map{grid-template-columns:repeat(2,1fr)}.cards{grid-template-columns:repeat(2,1fr)}.gallery-grid{grid-template-columns:1fr 1fr}.visual-card.large{grid-row:auto;min-height:350px}.visual-card.wide{grid-column:1/-1}.identity-panel{grid-template-columns:1fr;padding:35px;gap:30px}.seal{width:110px;height:110px}.id-lines{grid-template-columns:1fr}}@media(max-width:650px){.site-header{height:64px;padding:0 5vw}.menu-toggle{display:block}.nav{position:absolute;top:64px;left:0;right:0;padding:15px 5vw;display:none;flex-direction:column;gap:0;background:rgba(5,11,19,.97);border-bottom:1px solid rgba(120,190,215,.14)}.nav.open{display:flex}.nav a{padding:12px 0}.hero{padding:105px 6vw 55px;min-height:auto}.hero h1{font-size:64px}.hero h2{font-size:21px}.lead{font-size:14px}.section{padding:80px 6vw}.section-head{margin-bottom:35px}.section-head h2{font-size:38px}.system-map,.cards,.gallery-grid{grid-template-columns:1fr}.visual-card.wide{grid-column:auto}.visual-card.large{min-height:320px}.engineering-note{display:block}.engineering-note span{display:block;margin-top:8px}.identity-panel{padding:28px}.identity h2{font-size:38px}.identity h3{font-size:16px}.future{min-height:580px}.future-orbit{width:450px;height:450px}footer{flex-direction:column;gap:18px;padding:28px 6vw}.footer-mid{order:3}.scroll-hint{display:none}}


/* ===== Original file: styles.css ===== */
:root{font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#eef6ff;background:#050b14;font-synthesis:none;text-rendering:optimizeLegibility;--bg:#050b14;--panel:#0a1421;--panel2:#0f1c2b;--line:rgba(159,196,231,.14);--text:#eef6ff;--muted:#8da3b8;--accent:#70e1ff;--accent2:#bca8ff}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:radial-gradient(900px 420px at 75% -5%,rgba(112,225,255,.11),transparent 60%),linear-gradient(180deg,#050b14 0%,#07101b 55%,#050a12 100%);min-height:100vh}.app{overflow:hidden}.topbar{height:72px;display:flex;align-items:center;justify-content:space-between;padding:0 5vw;border-bottom:1px solid var(--line);backdrop-filter:blur(16px);background:rgba(5,11,20,.72);position:sticky;top:0;z-index:20}.brand{display:flex;align-items:center;gap:10px;cursor:pointer}.brandMark{width:34px;height:34px;border:1px solid rgba(112,225,255,.35);border-radius:10px;display:grid;place-items:center;color:var(--accent);background:rgba(112,225,255,.06);box-shadow:0 0 24px rgba(112,225,255,.08)}.brand strong{font-size:14px;letter-spacing:.18em;display:block}.brand span{font-size:10px;color:var(--muted);letter-spacing:.2em}.nav{display:flex;gap:28px}.nav a{color:#b6c8da;text-decoration:none;font-size:13px}.nav a:hover{color:#fff}.menuBtn{display:none;background:none;border:0;color:#ddecfa}.hero{max-width:1280px;margin:0 auto;min-height:680px;padding:90px 5vw 70px;display:grid;grid-template-columns:1.1fr .9fr;gap:50px;align-items:center;position:relative}.heroCopy{position:relative;z-index:2}.eyebrow,.miniTag,.kicker{font-size:10px;letter-spacing:.2em;color:var(--accent);font-weight:700}.eyebrow{display:flex;align-items:center;gap:8px}.dot{width:7px;height:7px;border-radius:50%;background:var(--accent);box-shadow:0 0 16px var(--accent)}h1{font-size:clamp(68px,9vw,124px);line-height:.86;letter-spacing:-.075em;margin:26px 0 18px;background:linear-gradient(120deg,#fff 0%,#bfeaff 42%,#cbbcff 100%);-webkit-background-clip:text;background-clip:text;color:transparent}h1 span{font-size:.42em;vertical-align:top;letter-spacing:-.03em;margin-left:10px}.subtitle{font-size:21px;color:#cad9e8;max-width:700px;margin:0 0 16px;line-height:1.4}.lead{color:var(--muted);font-size:15px;line-height:1.8;max-width:680px}.actions{display:flex;gap:12px;margin-top:28px;align-items:center}.primary,.secondary{border-radius:12px;padding:13px 16px;font-size:13px;font-weight:700;display:inline-flex;gap:9px;align-items:center;text-decoration:none;cursor:pointer}.primary{border:1px solid rgba(112,225,255,.45);background:linear-gradient(135deg,rgba(112,225,255,.18),rgba(188,168,255,.12));color:#f4fbff;box-shadow:0 12px 50px rgba(69,171,212,.12)}.secondary{color:#bcd0e4;border:1px solid var(--line)}.identityStrip{margin-top:40px;border-top:1px solid var(--line);display:flex;gap:34px;padding-top:18px}.identityStrip div{display:flex;flex-direction:column;gap:5px}.identityStrip span{font-size:10px;color:#6d8297;text-transform:uppercase;letter-spacing:.14em}.identityStrip strong{font-size:12px;color:#dae8f5}.heroVisual{height:480px;position:relative}.core{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:210px;height:210px;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;background:radial-gradient(circle at 35% 30%,rgba(112,225,255,.22),rgba(17,29,45,.82) 48%,rgba(8,14,24,.97));border:1px solid rgba(147,209,239,.24);box-shadow:0 0 90px rgba(112,225,255,.12),inset 0 0 60px rgba(112,225,255,.08)}.coreRing{width:88px;height:88px;border-radius:50%;display:grid;place-items:center;color:var(--accent);border:1px solid rgba(112,225,255,.36);box-shadow:0 0 30px rgba(112,225,255,.1)}.core span{font-weight:800;letter-spacing:.2em}.core small{font-size:9px;color:#6f879e;letter-spacing:.25em}.orbital{position:absolute;left:50%;top:50%;border:1px solid rgba(125,172,208,.13);border-radius:50%;transform:translate(-50%,-50%) rotate(-12deg)}.orbitA{width:350px;height:180px}.orbitB{width:460px;height:270px;transform:translate(-50%,-50%) rotate(35deg)}.node{position:absolute;width:38px;height:38px;border-radius:50%;display:grid;place-items:center;background:#0d1b2a;border:1px solid rgba(112,225,255,.32);box-shadow:0 0 26px rgba(112,225,255,.09)}.node span{font-size:9px;color:#a7cce3}.energyLine{position:absolute;height:1px;background:linear-gradient(90deg,transparent,var(--accent),transparent);opacity:.55;transform-origin:left center}.l1{width:210px;left:14%;top:23%;transform:rotate(26deg)}.l2{width:190px;left:35%;top:78%;transform:rotate(-22deg)}.l3{width:180px;left:58%;top:40%;transform:rotate(28deg)}.visualLabel{position:absolute;font-size:9px;letter-spacing:.13em;color:#7f96aa;display:flex;gap:6px;align-items:center}.labelTop{right:2%;top:9%}.labelBottom{left:4%;bottom:7%}.statsGrid{max-width:1180px;margin:0 auto;padding:0 5vw 80px;display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.stat{border:1px solid var(--line);background:rgba(8,17,29,.72);padding:18px;border-radius:14px;display:flex;gap:12px;align-items:center}.statIcon{width:34px;height:34px;border-radius:10px;display:grid;place-items:center;color:var(--accent);background:rgba(112,225,255,.06);border:1px solid rgba(112,225,255,.15)}.stat span{display:block;font-size:9px;color:#6f8397;text-transform:uppercase;letter-spacing:.15em}.stat strong{display:block;font-size:12px;margin-top:5px}.section{max-width:1180px;margin:0 auto;padding:100px 5vw}.sectionHead{display:flex;justify-content:space-between;gap:30px;align-items:end;margin-bottom:28px}.section h2{font-size:clamp(30px,4vw,54px);line-height:1;letter-spacing:-.045em;margin:10px 0 0;max-width:700px}.sectionNote{color:var(--muted);font-size:13px;line-height:1.6;max-width:330px}.modelGrid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.modelCard{position:relative;text-align:left;border:1px solid var(--line);background:linear-gradient(180deg,rgba(12,24,39,.8),rgba(8,16,27,.86));border-radius:16px;color:var(--text);padding:18px;min-height:190px;cursor:pointer;transition:.25s}.modelCard:hover,.modelCard.active{transform:translateY(-3px);border-color:rgba(112,225,255,.33);box-shadow:0 18px 55px rgba(0,0,0,.22)}.modelCard.active{background:linear-gradient(180deg,rgba(21,42,59,.92),rgba(8,17,28,.95))}.cardIcon{width:40px;height:40px;border-radius:12px;display:grid;place-items:center;background:rgba(112,225,255,.06);border:1px solid rgba(112,225,255,.14);color:var(--accent);margin-bottom:28px}.cardText h3{font-size:15px;margin:0 0 7px}.cardText p{font-size:11px;color:#8196aa;line-height:1.5;margin:0}.arrow{position:absolute;right:16px;top:16px;color:#6c849a}.modulePanel{margin-top:15px;border:1px solid var(--line);border-radius:18px;background:radial-gradient(circle at 20% 30%,rgba(112,225,255,.07),transparent 45%),rgba(10,19,31,.9);padding:26px;display:grid;grid-template-columns:.9fr 1.1fr;gap:26px;align-items:center;min-height:360px}.panelVisual{position:relative;height:300px;display:grid;place-items:center;overflow:hidden}.moduleCore{width:104px;height:104px;border-radius:50%;display:grid;place-items:center;color:var(--accent);background:#091625;border:1px solid rgba(112,225,255,.3);box-shadow:0 0 55px rgba(112,225,255,.11)}.pulse{position:absolute;width:210px;height:210px;border:1px solid rgba(112,225,255,.2);border-radius:50%;animation:pulse 2.8s ease-out infinite}.modulePath{position:absolute;left:10%;right:10%;bottom:29px;height:2px;background:linear-gradient(90deg,transparent,rgba(112,225,255,.28),transparent)}.modulePath span{position:absolute;width:7px;height:7px;border-radius:50%;background:var(--accent);top:-3px;animation:flow 2.8s linear infinite}.modulePath span:nth-child(2){animation-delay:.7s}.modulePath span:nth-child(3){animation-delay:1.4s}.modulePath span:nth-child(4){animation-delay:2.1s}.panelCopy h3{font-size:30px;letter-spacing:-.03em;margin:9px 0}.panelCopy p{color:var(--muted);font-size:13px;line-height:1.7}.metricRow{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:26px}.metricRow div{padding:12px;border-radius:12px;border:1px solid var(--line);background:rgba(255,255,255,.018)}.metricRow span{display:block;color:#71869a;font-size:9px;text-transform:uppercase;letter-spacing:.13em}.metricRow strong{display:block;font-size:12px;margin-top:5px}.darkSection{max-width:none;padding-left:calc(5vw + (100vw - min(1180px,90vw))/2);padding-right:calc(5vw + (100vw - min(1180px,90vw))/2);background:linear-gradient(180deg,rgba(5,11,19,.6),rgba(9,19,31,.8));border-top:1px solid var(--line);border-bottom:1px solid var(--line)}.pipeline{display:grid;grid-template-columns:1fr auto 1fr auto 1fr auto 1fr auto 1fr;gap:11px;align-items:stretch}.step{border:1px solid var(--line);border-radius:15px;padding:18px;background:rgba(10,20,33,.8);min-height:180px}.step span{font-size:9px;color:var(--accent);letter-spacing:.15em}.step h3{font-size:14px;margin:27px 0 8px}.step p{font-size:10px;line-height:1.6;color:#7f94a7}.connector{display:grid;place-items:center;color:#6a849a;font-size:18px}.inventor{padding-top:90px;padding-bottom:110px}.inventorCard{border:1px solid var(--line);border-radius:20px;background:linear-gradient(135deg,rgba(112,225,255,.05),rgba(188,168,255,.04));padding:34px;display:grid;grid-template-columns:130px 1fr;gap:28px;align-items:center}.seal{width:116px;height:116px;border-radius:50%;border:1px solid rgba(112,225,255,.24);display:flex;flex-direction:column;justify-content:center;align-items:center;color:var(--accent);background:rgba(112,225,255,.03);box-shadow:inset 0 0 40px rgba(112,225,255,.04)}.seal span{font-weight:800;letter-spacing:.2em;font-size:14px;margin-top:7px}.seal small{color:#70869c;letter-spacing:.2em;font-size:8px;margin-top:4px}.inventorCard h2{margin:8px 0 10px}.inventorCard h2 span{font-size:.5em;color:var(--accent);vertical-align:top}.inventorCard p{color:var(--muted);font-size:13px;line-height:1.7;max-width:800px}.tags{display:flex;gap:8px;flex-wrap:wrap;margin-top:18px}.tags span{font-size:9px;color:#9ab1c6;border:1px solid var(--line);padding:7px 9px;border-radius:999px;background:rgba(255,255,255,.018)}footer{display:flex;justify-content:space-between;gap:20px;border-top:1px solid var(--line);padding:22px 5vw;color:#5f768d;font-size:10px;letter-spacing:.06em}.modal{position:fixed;inset:0;background:rgba(0,0,0,.68);backdrop-filter:blur(12px);display:grid;place-items:center;padding:20px;z-index:40}.modalCard{max-width:560px;width:100%;border:1px solid rgba(112,225,255,.23);background:linear-gradient(180deg,#0d1a29,#08101a);border-radius:20px;padding:30px;position:relative;box-shadow:0 30px 120px rgba(0,0,0,.45)}.close{position:absolute;right:14px;top:14px;background:none;border:0;color:#8ea5b9;cursor:pointer}.demoIcon{width:50px;height:50px;border-radius:15px;display:grid;place-items:center;color:var(--accent);border:1px solid rgba(112,225,255,.2);background:rgba(112,225,255,.06);margin-bottom:20px}.modalCard h2{font-size:34px;letter-spacing:-.04em;margin:8px 0}.modalCard p:not(.kicker){color:var(--muted);line-height:1.7;font-size:13px}.demoReadouts{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:22px}.demoReadouts div{border:1px solid var(--line);padding:12px;border-radius:12px}.demoReadouts span{display:block;color:#74899e;font-size:9px;text-transform:uppercase}.demoReadouts strong{font-size:11px;color:#dceeff;display:block;margin-top:6px}@keyframes pulse{0%{transform:scale(.72);opacity:0}35%{opacity:1}100%{transform:scale(1.3);opacity:0}}@keyframes flow{0%{left:0}100%{left:calc(100% - 7px)}}
@media(max-width:980px){.hero{grid-template-columns:1fr;min-height:auto;padding-top:70px}.heroVisual{height:390px}.modelGrid{grid-template-columns:repeat(2,1fr)}.pipeline{grid-template-columns:1fr;gap:8px}.connector{transform:rotate(90deg);height:18px}.statsGrid{grid-template-columns:repeat(2,1fr)}.modulePanel{grid-template-columns:1fr}.sectionHead{align-items:start;flex-direction:column}.inventorCard{grid-template-columns:1fr}.darkSection{padding-left:5vw;padding-right:5vw}}
@media(max-width:650px){.topbar{padding:0 18px}.menuBtn{display:block}.nav{display:none;position:absolute;top:72px;left:0;right:0;padding:12px 18px 20px;background:rgba(5,11,20,.96);border-bottom:1px solid var(--line)}.nav.open{display:grid}.hero{padding:54px 18px 50px}.heroVisual{height:330px}.core{width:165px;height:165px}.orbitA{width:270px;height:150px}.orbitB{width:340px;height:215px}h1{font-size:68px}.subtitle{font-size:18px}.identityStrip{flex-direction:column;gap:14px}.statsGrid,.modelGrid{grid-template-columns:1fr;padding-left:18px;padding-right:18px}.section{padding-left:18px;padding-right:18px}.metricRow{grid-template-columns:1fr}.inventor{padding-left:18px;padding-right:18px}.inventorCard{padding:24px}footer{padding:20px 18px;flex-direction:column}.section h2{font-size:36px}}


/* ===== Original file: time-energy-repair.css ===== */
/* IGERS emergency visibility safeguards */
#time .clock{display:block!important;visibility:visible!important;opacity:1!important;min-height:1.2em}
#time .clock-card,#time .live-panel{visibility:visible!important;opacity:1!important}
#energyLiveUpdate{display:block!important;visibility:visible!important;opacity:1!important}
#energyLiveUpdate[hidden]{display:block!important}
#energyLiveBadge{visibility:visible!important}
#sysEnergyState{font-variant-numeric:tabular-nums}


/* ===== Original file: time-weather-update.css ===== */
/* IGERS-BD-01 — Time + Weather Premium Update Layer */
.twx-shell{position:relative;overflow:hidden;margin-top:18px;padding:16px;border:1px solid rgba(96,220,255,.18);border-radius:24px;background:linear-gradient(145deg,rgba(7,22,31,.94),rgba(5,13,20,.98));box-shadow:0 22px 70px rgba(0,0,0,.25),inset 0 1px 0 rgba(255,255,255,.035)}
.twx-shell:before{content:"";position:absolute;inset:-35%;background:radial-gradient(circle at 20% 20%,rgba(64,211,255,.10),transparent 28%),radial-gradient(circle at 85% 75%,rgba(90,255,174,.07),transparent 25%);pointer-events:none}
.twx-head,.twx-toolbar,.twx-age{position:relative;z-index:1}.twx-head{display:flex;justify-content:space-between;align-items:center;gap:16px;margin-bottom:14px}.twx-kicker{font-size:9px;letter-spacing:.2em;color:#6f9aaa;text-transform:uppercase}.twx-title{font-size:18px;font-weight:850;letter-spacing:.03em;margin-top:4px}.twx-sub{font-size:11px;color:#718a98;margin-top:3px}.twx-toolbar{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.twx-btn{border:1px solid rgba(90,218,255,.28);background:rgba(7,25,34,.9);color:#d9f7ff;border-radius:11px;padding:9px 12px;font:inherit;font-size:10px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;transition:.2s ease}.twx-btn:hover{transform:translateY(-1px);border-color:rgba(90,218,255,.6);box-shadow:0 8px 25px rgba(0,0,0,.22)}.twx-btn.primary{background:linear-gradient(135deg,#0d4052,#0b2733);color:#9cecff}.twx-age{display:flex;gap:8px;flex-wrap:wrap}.twx-chip{display:inline-flex;align-items:center;gap:7px;padding:7px 10px;border:1px solid rgba(119,211,236,.16);border-radius:999px;background:rgba(255,255,255,.025);font-size:9px;letter-spacing:.1em;color:#89a4b1;text-transform:uppercase}.twx-dot{width:7px;height:7px;border-radius:50%;background:#79f3b5;box-shadow:0 0 12px #79f3b5;animation:twxPulse 1.5s infinite}.twx-dot.warn{background:#ffd27a;box-shadow:0 0 12px #ffd27a}.twx-dot.off{background:#ff6f7d;box-shadow:0 0 12px #ff6f7d;animation:none}.twx-value{color:#d9f7ff;font-weight:850;font-variant-numeric:tabular-nums}.time-wrap .clock-card,.weather>.card{transition:transform .22s ease,border-color .22s ease,box-shadow .22s ease}.time-wrap .clock-card:hover,.weather>.card:hover{transform:translateY(-3px);border-color:rgba(83,216,255,.38);box-shadow:0 18px 45px rgba(0,0,0,.22)}#time .section-head,#weather .section-head{align-items:flex-start}.twx-refreshing{opacity:.72}.twx-refreshing:after{content:"";display:inline-block;width:7px;height:7px;margin-left:7px;border:1px solid rgba(120,230,255,.45);border-top-color:#8eeaff;border-radius:50%;animation:twxSpin .7s linear infinite;vertical-align:middle}.twx-error{color:#ff9ca7!important}.twx-ok{color:#88f5bc!important}@keyframes twxPulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.45;transform:scale(.78)}}@keyframes twxSpin{to{transform:rotate(360deg)}}@media(max-width:650px){.twx-head{display:block}.twx-toolbar{margin-top:12px}.twx-btn{flex:1;min-width:120px}.twx-age{margin-top:10px}.twx-shell{border-radius:19px;padding:13px}}


/* ===== Original file: toll-national-pro.css ===== */
.toll-pro{padding:72px 0;border-top:1px solid rgba(85,221,255,.08)}.toll-pro-grid{display:grid;gap:14px}.toll-pro-overview{display:grid;grid-template-columns:1.2fr .8fr;gap:14px}.toll-card{border:1px solid #214653;border-radius:18px;background:linear-gradient(145deg,#0a1821,#040c12);padding:15px;overflow:hidden}.toll-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start}.toll-kicker{font-size:8px;letter-spacing:.14em;text-transform:uppercase;color:#55ddff;font-weight:900}.toll-head h3{margin:4px 0 3px;font-size:15px}.toll-sub{margin:0;color:#819aa5;font-size:9px;line-height:1.5}.toll-status{padding:6px 8px;border:1px solid #214653;border-radius:999px;color:#8fa7b1;font-size:8px;font-weight:900;white-space:nowrap}.toll-status.live{color:#8af3bf;border-color:#2d694e}.toll-status.warn{color:#ffd37a;border-color:#6a5728}.toll-status.off{color:#ff9999;border-color:#633636}.toll-map{position:relative;height:400px;margin-top:10px;border:1px solid #214653;border-radius:15px;background:radial-gradient(circle at 50% 46%,#113746,#040c12 70%);overflow:hidden}.toll-map canvas{display:block;width:100%;height:100%}.toll-map-chip{position:absolute;top:10px;padding:6px 8px;border:1px solid rgba(85,221,255,.18);border-radius:9px;background:rgba(3,12,17,.78);color:#d9f2fa;font-size:8px;font-weight:900}.toll-map-chip.left{left:10px}.toll-map-chip.right{right:10px}.toll-map-controls{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}.toll-map-controls button,.toll-map-controls select,.toll-feed-input input{border:1px solid #214653;background:#06141d;color:#d9f2fa;border-radius:8px;padding:8px 9px;font-size:9px}.toll-map-controls button{cursor:pointer}.toll-map-controls .primary{background:linear-gradient(135deg,#44cfee,#77f0c0);color:#031016;border-color:transparent}.toll-stats{display:grid;grid-template-columns:repeat(5,1fr);gap:7px;margin-top:10px}.toll-stat{padding:9px;border:1px solid #1d3d4a;border-radius:10px;background:#06131b}.toll-stat b{display:block;font-size:16px}.toll-stat span{display:block;color:#7d96a1;font-size:7px;margin-top:3px;text-transform:uppercase;letter-spacing:.07em}.toll-side-list{max-height:270px;overflow:auto;margin-top:9px}.toll-row{display:grid;grid-template-columns:1fr auto;gap:8px;padding:8px 0;border-bottom:1px solid rgba(120,210,240,.07)}.toll-row strong{display:block;font-size:9px}.toll-row small{display:block;color:#78919c;font-size:7px;margin-top:2px}.toll-row em{font-style:normal;color:#8af3bf;font-size:9px}.toll-flow-wrap{height:260px;margin-top:8px;border:1px solid #214653;border-radius:12px;background:#06131b;overflow:hidden}.toll-flow-wrap canvas{width:100%;height:100%}.toll-three-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.toll-plaza-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.toll-plaza{border:1px solid #214653;border-radius:15px;background:linear-gradient(145deg,#0a1821,#040c12);overflow:hidden}.toll-plaza-visual{height:220px;position:relative;background:radial-gradient(circle at 50% 45%,#153b49,#040b10 70%)}.toll-plaza-visual canvas{display:block;width:100%;height:100%}.toll-plaza-info{padding:12px}.toll-plaza-top{display:flex;justify-content:space-between;gap:8px;align-items:flex-start}.toll-plaza-top h4{margin:0;font-size:12px}.toll-pill{padding:5px 7px;border:1px solid #294b5b;border-radius:999px;color:#9fb4bd;font-size:7px;font-weight:900}.toll-pill.live{color:#8af3bf;border-color:#2d694e}.toll-mini-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-top:8px}.toll-mini{padding:7px;border:1px solid #1d3d4a;border-radius:8px;background:#06131b}.toll-mini b{display:block;font-size:10px}.toll-mini span{display:block;color:#78919c;font-size:6px;margin-top:2px}.toll-note{margin-top:8px;color:#79929d;font-size:8px;line-height:1.5}.toll-source-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.toll-source{padding:9px;border:1px solid #1d3d4a;border-radius:10px;background:#06131b}.toll-source b{display:block;font-size:9px}.toll-source span{display:block;color:#78919c;font-size:7px;line-height:1.45;margin-top:3px}.toll-source a{display:inline-block;margin-top:6px;color:#55ddff;font-size:8px}.toll-feed-input{display:grid;grid-template-columns:1fr auto;gap:6px;margin-top:8px}.toll-feed-input input{width:100%;box-sizing:border-box}.toll-table{width:100%;border-collapse:collapse;margin-top:8px;font-size:8px}.toll-table th,.toll-table td{border-bottom:1px solid rgba(120,210,240,.07);padding:7px;text-align:left}.toll-table th{color:#78919c;text-transform:uppercase;letter-spacing:.07em;font-size:7px}.toll-foot{margin-top:8px;padding:9px;border-top:1px dashed rgba(120,210,240,.08);color:#718995;font-size:7px;line-height:1.5}@media(max-width:1000px){.toll-pro-overview,.toll-three-grid{grid-template-columns:1fr}.toll-plaza-grid{grid-template-columns:1fr}.toll-stats{grid-template-columns:repeat(3,1fr)}.toll-source-grid{grid-template-columns:1fr 1fr}}@media(max-width:600px){.toll-stats,.toll-mini-grid,.toll-source-grid{grid-template-columns:1fr 1fr}.toll-feed-input{grid-template-columns:1fr}.toll-map{height:320px}}


/* ===== Original file: toll-plaza-national-3d.css ===== */
/* IGERS — National Toll Plaza Registry / Individual 3D views */
.npt-section{padding:72px 0;background:linear-gradient(180deg,transparent,rgba(6,22,31,.12),transparent)}
.npt-shell{display:grid;gap:16px}.npt-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start;flex-wrap:wrap}.npt-head p{max-width:900px}.npt-badge{display:inline-flex;align-items:center;gap:7px;padding:7px 9px;border:1px solid #2b4d5b;border-radius:999px;color:#9fb7c1;font-size:9px;font-weight:800;letter-spacing:.06em}.npt-badge.live{color:#8af3bf;border-color:#2f765c}.npt-badge.ref{color:#ffd37a;border-color:#80612e}.npt-badge.off{color:#ff9b9b;border-color:#713f3f}.npt-overview{display:grid;grid-template-columns:1.25fr .75fr;gap:16px}.npt-card{border:1px solid #214653;border-radius:20px;background:linear-gradient(145deg,#0b1b24,#061018);padding:18px}.npt-national{min-height:390px;position:relative;overflow:hidden}.npt-national canvas{width:100%;height:390px;display:block}.npt-hud{position:absolute;inset:12px;pointer-events:none}.npt-chip{display:inline-flex;padding:7px 9px;border:1px solid #294b5b;border-radius:10px;background:#041018e8;color:#b9d4de;font-size:9px;letter-spacing:.08em}.npt-tl{position:absolute;left:0;top:0}.npt-tr{position:absolute;right:0;top:0;text-align:right}.npt-bl{position:absolute;left:0;bottom:0}.npt-br{position:absolute;right:0;bottom:0;text-align:right}.npt-kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:9px;margin-top:12px}.npt-kpi{padding:11px;border:1px solid #214555;border-radius:12px;background:#06131b}.npt-kpi b{display:block;font-size:18px;font-variant-numeric:tabular-nums}.npt-kpi span{display:block;color:#829ba5;font-size:8px;text-transform:uppercase;letter-spacing:.08em;margin-top:3px}.npt-tools{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}.npt-tools button,.npt-tools input,.npt-tools select{min-height:40px;padding:9px 11px;border:1px solid #294b5b;border-radius:10px;background:#07151e;color:#eef8fc;font:inherit;font-size:10px}.npt-tools button{cursor:pointer}.npt-input{display:grid;grid-template-columns:1fr auto;gap:8px;margin-top:8px}.npt-source-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}.npt-source{padding:10px;border:1px solid #214555;border-radius:11px;background:#06131b}.npt-source b{display:block;font-size:10px}.npt-source span{display:block;color:#7e98a4;font-size:8px;line-height:1.4;margin-top:3px}.npt-list{display:grid;gap:10px;grid-template-columns:repeat(2,1fr)}.npt-plaza{border:1px solid #214653;border-radius:18px;background:linear-gradient(145deg,#0b1b24,#061018);overflow:hidden}.npt-plaza-main{display:grid;grid-template-columns:minmax(220px,.9fr) 1.1fr;gap:0}.npt-mini{min-height:230px;background:radial-gradient(circle at 50% 44%,#123746,#061019 68%);position:relative}.npt-mini canvas{width:100%;height:230px;display:block}.npt-plaza-info{padding:14px}.npt-plaza-title{display:flex;justify-content:space-between;gap:8px;align-items:flex-start}.npt-plaza-title h3{margin:0;font-size:14px}.npt-plaza-meta{font-size:9px;color:#7f98a3;margin-top:4px;line-height:1.45}.npt-detail-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin-top:10px}.npt-detail{padding:8px;border:1px solid #1f3d49;border-radius:9px;background:#06131b}.npt-detail b{display:block;font-size:10px}.npt-detail span{display:block;color:#79939d;font-size:7px;margin-top:2px}.npt-spark{height:65px;margin-top:9px}.npt-spark canvas{width:100%;height:65px;display:block}.npt-actions{display:flex;gap:7px;flex-wrap:wrap;margin-top:9px}.npt-actions button,.npt-actions a{min-height:34px;padding:7px 9px;border:1px solid #294b5b;border-radius:9px;background:#07151e;color:#dceef4;font:inherit;font-size:8px;text-decoration:none;cursor:pointer}.npt-actions .live-btn{border-color:#2f765c;color:#8af3bf}.npt-note{font-size:9px;line-height:1.55;color:#819aa5}.npt-cctv{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:9px}.npt-cctv img,.npt-cctv video{width:100%;height:150px;object-fit:cover;border:1px solid #214653;border-radius:10px;background:#02070b}.npt-hidden{display:none!important}.npt-seismo{height:250px;margin-top:8px}.npt-seismo canvas{width:100%;height:250px;display:block}.npt-report-box{padding:10px;border:1px dashed #2b5362;border-radius:10px;background:#051019;font-size:9px;line-height:1.55;color:#9fb8c1}
@media(max-width:1050px){.npt-overview,.npt-plaza-main{grid-template-columns:1fr}.npt-list{grid-template-columns:1fr}.npt-kpis{grid-template-columns:1fr 1fr}}@media(max-width:650px){.npt-kpis,.npt-source-grid,.npt-detail-grid,.npt-cctv{grid-template-columns:1fr}.npt-national,.npt-national canvas{min-height:310px;height:310px}.npt-input{grid-template-columns:1fr}}


/* ===== Original file: ui-visual-upgrade.css ===== */
/* IGERS POWERCORE — Day/Night + Smooth 3D Visual Upgrade (additive) */
:root{
  --ui-surface:#07131b;--ui-surface2:#0b1b25;--ui-elev:#0e2430;--ui-border:#214454;--ui-text:#eef8fc;--ui-muted:#8da7b6;
  --ui-glow:rgba(85,221,255,.16);--ui-shadow:0 24px 70px rgba(0,0,0,.22);
}
body{transition:background .35s ease,color .35s ease}
.nav{transition:background .35s ease,border-color .35s ease,box-shadow .35s ease}
.theme-control{display:inline-flex;align-items:center;gap:7px;padding:7px 10px;border:1px solid var(--ui-border);border-radius:999px;background:rgba(5,14,20,.72);color:var(--ui-text);font:800 11px/1 system-ui,sans-serif;cursor:pointer;white-space:nowrap;box-shadow:0 8px 24px rgba(0,0,0,.12)}
.theme-control:hover{border-color:#55ddff66;transform:translateY(-1px)}
.theme-control .theme-orb{width:16px;height:16px;border-radius:50%;background:radial-gradient(circle at 34% 28%,#fff7b2,#ffd76b 42%,#be7b20 72%);box-shadow:0 0 13px #ffd76b66}
body[data-theme="day"]{--bg:#eef4f7;--panel:#ffffff;--panel2:#f6fafc;--line:#d1e0e7;--text:#12242e;--muted:#5c7380;--cyan:#007f9c;--green:#13865d;--gold:#a56c00;--danger:#b83b3b;--shadow:0 18px 55px rgba(39,72,86,.12);--ui-surface:#ffffff;--ui-surface2:#f6fafc;--ui-elev:#ffffff;--ui-border:#cbdde5;--ui-text:#12242e;--ui-muted:#5d7481;--ui-glow:rgba(0,127,156,.12);--ui-shadow:0 18px 52px rgba(32,64,77,.12);color:#12242e;background:radial-gradient(circle at 15% 0%,#ffffff 0,#eef5f8 46%,#e6eef2 100%)}
body[data-theme="day"] .nav{background:rgba(255,255,255,.86);border-bottom-color:#cddde5;box-shadow:0 10px 32px rgba(24,66,84,.08)}
body[data-theme="day"] .navlinks{color:#58707d}body[data-theme="day"] .navlinks a:hover{color:#007f9c}
body[data-theme="day"] .theme-control{background:#f7fbfd;color:#12242e;border-color:#c4d6de}
body[data-theme="day"] .btn{background:#fff;color:#17313d;border-color:#c8d9e0;box-shadow:0 6px 18px rgba(39,72,86,.07)}
body[data-theme="day"] .btn.primary{background:linear-gradient(135deg,#62d8ef,#79dfb2);color:#07202a}
body[data-theme="day"] .card,body[data-theme="day"] .clock-card,body[data-theme="day"] .energy-live-card,body[data-theme="day"] .system-control-card{background:linear-gradient(145deg,rgba(255,255,255,.96),rgba(246,250,252,.98));border-color:#cbdde5;box-shadow:0 18px 48px rgba(44,77,90,.10)}
body[data-theme="day"] .section-head p,body[data-theme="day"] .card p,body[data-theme="day"] .lead,body[data-theme="day"] .mini,body[data-theme="day"] .date{color:#607783}
body[data-theme="day"] .select,body[data-theme="day"] input,body[data-theme="day"] textarea,body[data-theme="day"] select{background:#f8fbfc!important;color:#17313d!important;border-color:#c9d9e0!important}
body[data-theme="day"] .live-panel{background:linear-gradient(135deg,#f6fcfd,#edf8f8);border-color:#bad4dd}
body[data-theme="day"] .live-metrics small,.body[data-theme="day"] .label{color:#6d818a}
body[data-theme="day"] .journey .step,body[data-theme="day"] .road,body[data-theme="day"] .bridge,body[data-theme="day"] .mapbox{box-shadow:inset 0 0 40px rgba(55,102,122,.05)}
body[data-theme="day"] .theme-control .theme-orb{background:radial-gradient(circle at 34% 28%,#203948,#162d3a 42%,#09141c 72%);box-shadow:0 0 13px #173c4d77}
body[data-theme="day"] .hero-visual{background:linear-gradient(145deg,rgba(229,248,252,.95),rgba(243,248,250,.98));border-color:#c5dbe3;box-shadow:var(--ui-shadow)}
body[data-theme="day"] .hero-visual .hub{background:radial-gradient(circle,#d9f4f8,#f6fbfc 68%);color:#12303a}
body[data-theme="day"] .hero-visual .node{background:rgba(255,255,255,.9);border-color:#c8dce4;color:#476571}
body[data-theme="day"] .als-card,body[data-theme="day"] .bdm-card{background:linear-gradient(145deg,rgba(255,255,255,.97),rgba(246,250,252,.98));border-color:#cbdde5;color:#17313d}
body[data-theme="day"] .als-metric,body[data-theme="day"] .als-row,body[data-theme="day"] .als-kv div,body[data-theme="day"] .als-prayer,body[data-theme="day"] .als-alert,body[data-theme="day"] .bdm-row,body[data-theme="day"] .bdm-zone,body[data-theme="day"] .bdm-kv>div{background:#f7fbfd;border-color:#d0e0e6}
body[data-theme="day"] .als-input,body[data-theme="day"] .als-select,body[data-theme="day"] .als-textarea,body[data-theme="day"] .bdm-toggle{background:#f7fbfd;color:#17313d;border-color:#cbdde5}
body[data-theme="day"] .als-canvas-wrap,body[data-theme="day"] .bdm-canvas,body[data-theme="day"] .bdm-radar-scope{box-shadow:inset 0 0 70px rgba(0,92,120,.07),0 16px 44px rgba(25,58,70,.08)}
body[data-theme="day"] .als-live,body[data-theme="day"] .bdm-live{background:#f7fbfd;color:#17313d}

/* gentle realistic 3D surface */
.card,.clock-card,.energy-live-card,.system-control-card,.als-card,.bdm-card,.hero-visual{transform-style:preserve-3d;will-change:transform;backface-visibility:hidden}
.ui-3d-sheen{position:absolute;inset:0;border-radius:inherit;pointer-events:none;background:linear-gradient(125deg,rgba(255,255,255,.07),transparent 24%,transparent 76%,rgba(85,221,255,.035));mix-blend-mode:screen;opacity:.55;transform:translateZ(1px)}
.card,.clock-card,.als-card,.bdm-card{transition:transform .22s ease,box-shadow .22s ease,border-color .22s ease,background .25s ease}
.card:hover,.clock-card:hover,.als-card:hover,.bdm-card:hover{box-shadow:0 24px 65px rgba(0,0,0,.18),0 0 0 1px rgba(85,221,255,.05) inset}

/* Analytics */
.ia-section{padding:64px 0;border-top:1px solid rgba(85,221,255,.07);position:relative;overflow:hidden}
.ia-section:before{content:"";position:absolute;inset:0;pointer-events:none;background:radial-gradient(circle at 12% 0%,rgba(85,221,255,.07),transparent 34%),radial-gradient(circle at 100% 80%,rgba(138,243,191,.05),transparent 36%)}
.ia-shell{position:relative}.ia-head{display:flex;justify-content:space-between;align-items:end;gap:20px;margin-bottom:18px}.ia-kicker{font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--cyan)}.ia-head h2{margin:3px 0 8px}.ia-head p{margin:0;color:var(--muted);max-width:900px}
.ia-grid{display:grid;grid-template-columns:1.15fr .85fr;gap:16px}.ia-card{background:linear-gradient(145deg,rgba(10,24,34,.92),rgba(5,12,18,.97));border:1px solid var(--line);border-radius:20px;padding:18px;box-shadow:0 18px 55px rgba(0,0,0,.18)}
.ia-kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.ia-kpi{padding:11px;border:1px solid var(--line);border-radius:12px;background:rgba(7,19,27,.9)}.ia-kpi b{display:block;font-size:20px}.ia-kpi span{display:block;color:var(--muted);font-size:8px;text-transform:uppercase;letter-spacing:.1em;margin-top:3px}
.ia-chart{height:220px;margin-top:12px;border:1px solid var(--line);border-radius:15px;background:linear-gradient(180deg,rgba(85,221,255,.045),rgba(85,221,255,.01));position:relative;overflow:hidden}.ia-chart canvas{width:100%;height:100%;display:block}.ia-chart-labels{display:flex;justify-content:space-between;margin-top:6px;color:var(--muted);font-size:8px;text-transform:uppercase;letter-spacing:.08em}
.ia-health-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:8px}.ia-health{padding:10px;border:1px solid var(--line);border-radius:12px;background:#07131b}.ia-health-head{display:flex;justify-content:space-between;gap:10px;align-items:center}.ia-health b{font-size:10px}.ia-dot{width:8px;height:8px;border-radius:50%;background:#8af3bf;box-shadow:0 0 12px rgba(138,243,191,.55)}.ia-dot.warn{background:#ffd37a;box-shadow:0 0 12px rgba(255,211,122,.45)}.ia-dot.off{background:#ff8d8d;box-shadow:0 0 12px rgba(255,141,141,.45)}.ia-health span{display:block;color:var(--muted);font-size:9px;margin-top:4px}.ia-confidence{margin-top:10px;padding:11px;border:1px dashed var(--line);border-radius:12px;color:var(--muted);font-size:9px;line-height:1.5}.ia-confidence strong{color:var(--text)}
.ia-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}.ia-btn{padding:9px 11px;border:1px solid var(--line);border-radius:10px;background:#08161f;color:var(--text);font-weight:800;font-size:10px;cursor:pointer}.ia-btn:hover{border-color:#3e7387}.ia-btn.primary{background:linear-gradient(135deg,#44cfee,#77f0c0);color:#031016;border-color:transparent}
body[data-theme="day"] .ia-card{background:linear-gradient(145deg,#ffffff,#f5fafc);border-color:#cbdde5;box-shadow:0 18px 48px rgba(44,77,90,.10)}
body[data-theme="day"] .ia-kpi,body[data-theme="day"] .ia-health{background:#f7fbfd;border-color:#d0e0e6}
body[data-theme="day"] .ia-chart{background:linear-gradient(180deg,rgba(0,127,156,.05),rgba(0,127,156,.015))}
@media(max-width:1000px){.ia-grid{grid-template-columns:1fr}.ia-kpis{grid-template-columns:repeat(2,1fr)}}@media(max-width:620px){.theme-control{font-size:10px;padding:7px 8px}.ia-head{align-items:flex-start;flex-direction:column}.ia-kpis{grid-template-columns:1fr 1fr}.ia-health-grid{grid-template-columns:1fr 1fr}}
@media(prefers-reduced-motion:reduce){*,*::before,*::after{scroll-behavior:auto!important;animation-duration:.01ms!important;transition-duration:.01ms!important}}

/* GitHub Pages-safe theme + premium visual baseline */
html,body{min-height:100%;background:#04080c!important}
body[data-theme="night"]{background:radial-gradient(circle at 18% -8%,#123044 0,#071019 38%,#04080c 100%)!important;color:#eef8fc!important}
.theme-control{position:fixed;right:18px;top:82px;z-index:1200}
.nav{padding-right:92px}
@media(max-width:900px){.theme-control{right:12px;top:76px}.nav{padding-right:110px}.navlinks{padding-right:56px}}
body[data-theme="day"]{background:radial-gradient(circle at 15% 0%,#ffffff 0,#eef5f8 46%,#e6eef2 100%)!important}


/* ===== Original file: upgrade-pro.css ===== */
/* IGERS-BD-01 Professional Upgrade Panels - additive layer */
:root{--igx-cyan:#55ddff;--igx-green:#8af3bf;--igx-gold:#ffd37a;--igx-red:#ff8d8d;--igx-panel:rgba(8,20,29,.82);--igx-line:rgba(120,210,240,.16)}
.igx-section{position:relative;overflow:hidden}
.igx-section:before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 80% 10%,rgba(85,221,255,.08),transparent 30%),radial-gradient(circle at 10% 90%,rgba(138,243,191,.05),transparent 28%);pointer-events:none}
.igx-kicker{color:var(--igx-green);font-size:10px;letter-spacing:.18em;text-transform:uppercase;font-weight:800;margin-bottom:8px}
.igx-grid{display:grid;gap:16px}.igx-grid-3{grid-template-columns:repeat(3,minmax(0,1fr))}.igx-grid-4{grid-template-columns:repeat(4,minmax(0,1fr))}
.igx-card{position:relative;background:linear-gradient(145deg,rgba(12,30,42,.92),rgba(5,14,21,.9));border:1px solid var(--igx-line);border-radius:20px;padding:20px;box-shadow:0 18px 55px rgba(0,0,0,.18)}
.igx-card h3{margin:0 0 7px}.igx-muted{color:var(--muted);font-size:12px}.igx-value{font-size:30px;font-weight:900;letter-spacing:-.03em}.igx-label{display:block;color:var(--muted);font-size:10px;text-transform:uppercase;letter-spacing:.12em;margin-bottom:5px}
.igx-status{display:inline-flex;align-items:center;gap:7px;border:1px solid rgba(138,243,191,.2);border-radius:999px;padding:6px 9px;font-size:9px;font-weight:800;letter-spacing:.1em;color:var(--igx-green)}
.igx-status i{width:6px;height:6px;border-radius:50%;background:currentColor;box-shadow:0 0 12px currentColor}.igx-status.warn{color:var(--igx-gold)}.igx-status.off{color:var(--igx-red)}
.igx-control-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.igx-field label{display:block;color:var(--muted);font-size:10px;margin-bottom:5px}.igx-field input,.igx-field select{width:100%;padding:11px 12px;border:1px solid var(--igx-line);border-radius:11px;background:#06131c;color:var(--text);outline:none}.igx-field input:focus,.igx-field select:focus{border-color:rgba(85,221,255,.55);box-shadow:0 0 0 3px rgba(85,221,255,.07)}
.igx-actions{display:flex;flex-wrap:wrap;gap:9px;margin-top:14px}.igx-btn{cursor:pointer;border:1px solid var(--igx-line);background:#081822;color:var(--text);border-radius:11px;padding:10px 13px;font-weight:800;font-size:11px}.igx-btn.primary{background:linear-gradient(135deg,#44cfee,#77f0c0);color:#031016;border-color:transparent}.igx-btn:active{transform:translateY(1px)}
.igx-result{margin-top:14px;padding:15px;border-radius:15px;background:#041018;border:1px solid rgba(85,221,255,.14)}.igx-result strong{font-size:24px}.igx-meter{height:8px;border-radius:99px;background:#07131b;overflow:hidden;margin-top:10px}.igx-meter span{display:block;height:100%;width:0;background:linear-gradient(90deg,#55ddff,#8af3bf);transition:width .5s ease}
.igx-flow{display:grid;grid-template-columns:repeat(5,1fr);gap:10px;align-items:stretch}.igx-flow-step{position:relative;text-align:center;padding:18px 10px;border:1px solid var(--igx-line);border-radius:15px;background:#06131c}.igx-flow-step b{display:block;font-size:11px}.igx-flow-step span{display:block;color:var(--muted);font-size:9px;margin-top:4px}.igx-flow-step:not(:last-child):after{content:"→";position:absolute;right:-16px;top:50%;transform:translateY(-50%);color:var(--igx-cyan);font-weight:900;z-index:2}
.igx-health{display:grid;grid-template-columns:1fr 1fr;gap:10px}.igx-health-row{display:flex;justify-content:space-between;align-items:center;padding:12px 13px;border:1px solid var(--igx-line);border-radius:12px;background:#06131c}.igx-health-row span:first-child{font-size:11px}.igx-health-row small{color:var(--muted)}
.igx-log{height:180px;overflow:auto;font:11px/1.6 ui-monospace,SFMono-Regular,Menlo,monospace;color:#b9d5df;background:#030b10;border:1px solid var(--igx-line);border-radius:12px;padding:12px}.igx-log div{padding:2px 0}.igx-log .ok{color:var(--igx-green)}.igx-log .warn{color:var(--igx-gold)}
.igx-research{display:grid;grid-template-columns:1.2fr .8fr;gap:16px}.igx-doc{display:flex;align-items:flex-start;gap:12px;padding:14px;border:1px solid var(--igx-line);border-radius:14px;background:#06131c}.igx-doc .num{width:30px;height:30px;border-radius:9px;display:grid;place-items:center;background:#0d2937;color:var(--igx-cyan);font-weight:900;font-size:11px}.igx-doc b{display:block;font-size:12px}.igx-doc span{display:block;color:var(--muted);font-size:10px;margin-top:3px}
.igx-top{position:fixed;right:16px;bottom:60px;z-index:1000;display:flex;gap:7px}.igx-float{width:40px;height:40px;border-radius:12px;border:1px solid var(--igx-line);background:rgba(5,14,21,.9);color:var(--text);display:grid;place-items:center;cursor:pointer;backdrop-filter:blur(12px);box-shadow:0 12px 30px rgba(0,0,0,.25)}
@media(max-width:900px){.igx-grid-3,.igx-grid-4{grid-template-columns:1fr 1fr}.igx-flow{grid-template-columns:1fr}.igx-flow-step:not(:last-child):after{content:"↓";right:auto;left:50%;top:auto;bottom:-17px;transform:translateX(-50%)}.igx-research{grid-template-columns:1fr}}
@media(max-width:600px){.igx-grid-3,.igx-grid-4,.igx-control-grid,.igx-health{grid-template-columns:1fr}.igx-top{right:10px;bottom:50px}.igx-card{padding:16px}}


/* ===== Original file: upgrade.css ===== */
/* IGERS-BD-01 FINAL visual enhancement layer
   Scope: presentation only. No API/feed/data logic is touched.
   Intentionally avoids generic component selectors that can change existing widgets.
*/

:root{
  --igers-vg-bg:#06101c;
  --igers-vg-accent:#56d8bb;
  --igers-vg-line:rgba(147,191,224,.14);
}

/* Background-only identity treatment. Does not create an overlay element,
   change stacking order, or intercept pointer events. */
html{
  scroll-behavior:smooth;
  background:var(--igers-vg-bg);
}

body{
  background-color:var(--igers-vg-bg) !important;
  background-image:
    radial-gradient(circle at 50% 150px, rgba(222,41,57,.30) 0 58px, rgba(222,41,57,.13) 59px, transparent 112px),
    linear-gradient(180deg, rgba(0,106,78,.34) 0 300px, rgba(0,106,78,.10) 390px, transparent 560px),
    radial-gradient(circle at 15% 0%, rgba(70,127,190,.12), transparent 30%),
    linear-gradient(155deg,#06101c 0%,#091725 45%,#06101b 100%) !important;
}

/* Navigation polish: scoped by actual navigation elements, but does not alter
   layout, positioning, stacking, or content. */
nav a,
.nav a,
.navbar a{
  transition:background-color .22s ease,color .22s ease,border-color .22s ease;
  border-radius:10px;
}

nav a:hover,
.nav a:hover,
.navbar a:hover{
  background-color:rgba(86,216,187,.09);
  color:var(--igers-vg-accent);
}

/* Form controls: visual-only, preserving dimensions and interaction. */
input,
select,
textarea{
  border-color:var(--igers-vg-line);
  border-radius:10px;
}

/* Map polish only when Leaflet is already present. */
.leaflet-container{
  border-radius:16px;
}

@media (max-width:900px){
  body{
    background-image:
      radial-gradient(circle at 50% 115px, rgba(222,41,57,.27) 0 46px, rgba(222,41,57,.11) 47px, transparent 94px),
      linear-gradient(180deg, rgba(0,106,78,.29) 0 270px, rgba(0,106,78,.08) 355px, transparent 500px),
      radial-gradient(circle at 15% 0%, rgba(70,127,190,.10), transparent 30%),
      linear-gradient(155deg,#06101c 0%,#091725 45%,#06101b 100%) !important;
  }
}


/* === Bangladesh identity hero treatment ===
   Safe presentation-only layer. Pointer events are disabled and no existing
   page content, feed, map, form behavior, or data logic is altered. */
body{
  position:relative;
  min-height:100vh;
  isolation:isolate;
  background-color:#06101c !important;
  background-image:
    linear-gradient(180deg,rgba(6,16,28,.72) 0%,rgba(6,16,28,.88) 52%,rgba(6,16,28,1) 100%),
    url('./bangladesh-flag-overlay.svg') !important;
  background-repeat:no-repeat;
  background-position:center top;
  background-size:100% 720px,100% 720px;
}

/* Visible flag layer at the top of the landing page. */
body::before{
  content:"";
  position:absolute;
  top:0;
  left:0;
  right:0;
  height:min(720px,100vh);
  z-index:-1;
  pointer-events:none;
  background-image:
    linear-gradient(180deg,rgba(0,30,22,.12),rgba(6,16,28,.42)),
    url('./bangladesh-flag-overlay.svg');
  background-repeat:no-repeat;
  background-position:center top;
  background-size:100% 100%,100% 100%;
  opacity:.72;
}

/* Keep the flag tasteful on smaller screens while retaining the national
   identity mark clearly in the first viewport. */
@media (max-width:900px){
  body{
    background-size:cover,auto 560px;
    background-position:center top;
  }
  body::before{
    height:560px;
    background-size:cover,auto 560px;
  }
}


/* ===== Original file: vehicle-movement-monitor.css ===== */
.vm-section{padding:72px 0}.vm-grid{display:grid;grid-template-columns:1.2fr .8fr;gap:16px}.vm-card{border:1px solid #214653;border-radius:18px;background:linear-gradient(145deg,#0b1b24,#061018);padding:18px}.vm-map{position:relative;min-height:360px;overflow:hidden}.vm-canvas{width:100%;height:360px;display:block}.vm-chip{position:absolute;padding:7px 9px;border:1px solid #294b5b;border-radius:10px;background:#041018e8;color:#b9d4de;font-size:9px}.vm-tl{left:12px;top:12px}.vm-tr{right:12px;top:12px;text-align:right}.vm-kpis{display:grid;grid-template-columns:1fr 1fr;gap:8px}.vm-kpi{padding:11px;border:1px solid #1d3c49;border-radius:10px;background:#06131b}.vm-kpi b{display:block;font-size:18px}.vm-kpi span{display:block;color:#8099a4;font-size:8px;margin-top:3px}.vm-list{max-height:250px;overflow:auto;margin-top:10px}.vm-row{display:grid;grid-template-columns:1fr auto;gap:8px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.05)}.vm-row strong{display:block;font-size:10px}.vm-row small{display:block;color:#7f98a4;font-size:8px;margin-top:2px}.vm-row em{font-style:normal;color:#8af3bf;font-size:9px}.vm-tools{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}.vm-tools button,.vm-tools input{min-height:40px;padding:9px 11px;border:1px solid #294b5b;border-radius:10px;background:#07151e;color:#eef8fc;font:inherit;font-size:10px}.vm-tools button{cursor:pointer}.vm-input{display:grid;grid-template-columns:1fr auto;gap:8px;flex:1;min-width:270px}.vm-note{font-size:9px;color:#819aa5;line-height:1.55}@media(max-width:960px){.vm-grid{grid-template-columns:1fr}}@media(max-width:620px){.vm-kpis{grid-template-columns:1fr}.vm-input{grid-template-columns:1fr}.vm-map,.vm-canvas{height:300px;min-height:300px}}


/* ===== Original file: voicemail.css ===== */

/* IGERS-BD-01 · Public Voice Mail visual layer */
.voicemail-card,.voicemail-list-card{grid-column:1/-1}
.voicemail-card{margin-top:0}
.voicemail-public-badge{background:rgba(85,221,255,.06);border-color:rgba(85,221,255,.18);color:#8dd8ea}
.voicemail-recorder{position:relative;z-index:1;margin-top:16px;padding:18px;border:1px solid rgba(120,210,240,.13);border-radius:16px;background:rgba(3,12,18,.56)}
.voicemail-level{height:42px;display:flex;align-items:center;justify-content:center;gap:5px;border:1px solid rgba(85,221,255,.09);border-radius:12px;background:linear-gradient(180deg,rgba(85,221,255,.035),rgba(138,243,191,.02));overflow:hidden}
.voicemail-level i{display:block;width:4px;height:8px;border-radius:5px;background:#55ddff;opacity:.45;transform-origin:center;transition:height .12s ease,opacity .12s ease}
.voicemail-recorder.recording .voicemail-level i{animation:vmPulse 850ms ease-in-out infinite alternate}
.voicemail-recorder.recording .voicemail-level i:nth-child(2n){animation-delay:-180ms}.voicemail-recorder.recording .voicemail-level i:nth-child(3n){animation-delay:-390ms}.voicemail-recorder.recording .voicemail-level i:nth-child(4n){animation-delay:-590ms}
@keyframes vmPulse{from{height:7px;opacity:.35}to{height:31px;opacity:.95}}
.voicemail-time-row{display:flex;justify-content:space-between;align-items:center;margin-top:12px;gap:12px}.voicemail-time-row strong{font-variant-numeric:tabular-nums;font-size:24px;letter-spacing:.04em}.voicemail-time-row span{font-size:10px;letter-spacing:.13em;color:#9ce8bf;font-weight:900}
.voicemail-controls{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}.voicemail-controls .feedback-btn{margin-top:0}.voicemail-controls button:disabled{opacity:.42;cursor:not-allowed}
.voicemail-preview{width:100%;margin-top:14px;height:42px;border-radius:10px}
.voicemail-note{margin-top:12px}.voicemail-status{min-height:0}
.voicemail-list-card .list-heading{align-items:center}.voicemail-refresh-btn{margin-top:0;white-space:nowrap}
.voicemail-list{display:grid;gap:10px;margin-top:12px;max-height:510px;overflow:auto;padding-right:2px}
.voicemail-empty{display:grid;place-items:center;text-align:center;gap:6px;padding:34px 18px;border:1px dashed rgba(120,210,240,.14);border-radius:14px;color:var(--muted)}
.voicemail-item{padding:14px;border:1px solid rgba(120,210,240,.13);border-radius:14px;background:rgba(4,15,23,.68)}
.voicemail-meta{display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:10px;font-size:10px;color:var(--muted)}
.voicemail-meta strong{color:var(--text);font-size:12px}.voicemail-meta span{font-variant-numeric:tabular-nums}
.voicemail-item audio{width:100%;height:38px}.voicemail-item .vm-error{font-size:11px;color:#ffb2b2;margin-top:8px}
.voicemail-server-note{font-size:10px;color:#7d98a7;margin-top:10px}
@media(max-width:650px){.voicemail-controls{display:grid;grid-template-columns:1fr 1fr}.voicemail-controls .feedback-btn{width:100%}.voicemail-controls .voicemail-record-btn{grid-column:1/-1}.voicemail-item audio{height:42px}.voicemail-meta{display:block}.voicemail-meta span{display:block;margin-top:3px}.voicemail-refresh-btn{width:100%}}


/* ===== Original file: water-foot-live.css ===== */
/* IGERS-BD-01 — Water Flow + Foot Harvesting live engineering panels */
.harvest-live-section{position:relative;overflow:hidden}
.harvest-live-section:before{content:"";position:absolute;inset:0;pointer-events:none;background:radial-gradient(circle at 15% 10%,rgba(67,211,255,.09),transparent 28%),radial-gradient(circle at 90% 70%,rgba(91,246,185,.07),transparent 24%)}
.harvest-grid{display:grid;grid-template-columns:1fr 1fr;gap:18px;position:relative}
.harvest-card{background:linear-gradient(180deg,rgba(8,22,31,.94),rgba(5,15,22,.94));border:1px solid rgba(130,220,255,.13);border-radius:18px;padding:18px;box-shadow:0 18px 48px rgba(0,0,0,.18)}
.harvest-card-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start;flex-wrap:wrap;margin-bottom:14px}
.harvest-live-badge{display:inline-flex;align-items:center;gap:7px;padding:6px 10px;border-radius:999px;border:1px solid rgba(138,243,191,.2);background:rgba(138,243,191,.06);color:#9df3c0;font-size:9px;font-weight:900;letter-spacing:.1em;white-space:nowrap}
.harvest-live-badge i{width:7px;height:7px;border-radius:50%;background:#8af3bf;box-shadow:0 0 13px rgba(138,243,191,.95);animation:pulse 1.5s infinite}
.harvest-live-badge.off{color:#ffb0aa;border-color:rgba(255,141,141,.2);background:rgba(255,100,100,.05)}
.harvest-live-badge.off i{background:#ff8f8f;box-shadow:0 0 12px rgba(255,143,143,.75);animation:none}
.harvest-inputs{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
.harvest-field label{display:block;font-size:9px;text-transform:uppercase;letter-spacing:.09em;color:var(--muted);margin-bottom:6px;font-weight:800}
.harvest-field input{width:100%;box-sizing:border-box;background:#08131b;color:var(--text);border:1px solid rgba(255,255,255,.09);border-radius:10px;padding:10px 11px;outline:none;font:inherit;font-size:12px}
.harvest-field input:focus{border-color:rgba(120,225,255,.42);box-shadow:0 0 0 3px rgba(120,225,255,.08)}
.harvest-results{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:12px}
.harvest-result{padding:10px;border:1px solid rgba(255,255,255,.07);border-radius:11px;background:rgba(255,255,255,.018)}
.harvest-result strong{display:block;font-size:18px;line-height:1.1;letter-spacing:-.02em;font-variant-numeric:tabular-nums}
.harvest-result span{display:block;font-size:9px;color:var(--muted);margin-top:4px}
.harvest-formula{margin-top:12px;padding:10px 12px;border-radius:11px;border:1px dashed rgba(120,225,255,.2);font-size:10px;color:#aad9e8;line-height:1.5}
.harvest-note{margin-top:10px;color:var(--muted);font-size:10px;line-height:1.55}
.harvest-last{margin-top:10px;font-size:9px;color:var(--muted);font-variant-numeric:tabular-nums}
.harvest-summary{margin-top:18px;padding:13px 15px;border:1px solid rgba(120,225,255,.12);border-radius:14px;background:linear-gradient(90deg,rgba(67,211,255,.04),rgba(91,246,185,.03));display:flex;justify-content:space-between;gap:12px;align-items:center;flex-wrap:wrap}
.harvest-summary strong{font-size:11px;letter-spacing:.07em}
.harvest-summary span{font-size:10px;color:var(--muted)}
@media(max-width:900px){.harvest-grid{grid-template-columns:1fr}}
@media(max-width:600px){.harvest-inputs,.harvest-results{grid-template-columns:1fr}.harvest-card{padding:14px}}

/* 3D Weather / location scene */
.weather-3d-wrap{margin-top:18px;position:relative}
.weather-3d-shell{display:grid;grid-template-columns:1.45fr .85fr;gap:16px}
.weather-3d-stage{position:relative;min-height:340px;overflow:hidden;border-radius:22px;border:1px solid rgba(120,225,255,.15);background:linear-gradient(180deg,#0a2136 0%,#0c2f44 48%,#07151e 100%);perspective:900px;isolation:isolate}
.weather-3d-stage:before{content:"";position:absolute;inset:-20%;background:radial-gradient(circle at 50% 35%,rgba(118,212,255,.19),transparent 34%),linear-gradient(180deg,transparent 58%,rgba(1,7,12,.36));z-index:0}
.weather-3d-ground{position:absolute;left:-10%;right:-10%;bottom:-32%;height:62%;background:linear-gradient(160deg,rgba(65,135,128,.28),rgba(9,28,31,.75));transform:rotateX(66deg);transform-origin:center top;border-top:1px solid rgba(126,226,196,.15);z-index:1}
.weather-3d-glow{position:absolute;left:50%;top:35%;width:260px;height:180px;transform:translate(-50%,-50%);background:radial-gradient(circle,rgba(109,220,255,.2),transparent 64%);filter:blur(12px);z-index:0}
.weather-3d-sun{position:absolute;left:18%;top:18%;width:92px;height:92px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff4b8,#ffcf5a 52%,#ff9a4d 100%);box-shadow:0 0 42px rgba(255,201,91,.65);transform:translateZ(70px);z-index:4;opacity:0;transition:opacity .35s ease}
.weather-3d-stage.day .weather-3d-sun{opacity:1}
.weather-3d-moon{position:absolute;right:16%;top:18%;width:74px;height:74px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff,#cfe8ff 68%,#99b9d0 100%);box-shadow:0 0 35px rgba(187,224,255,.45);transform:translateZ(80px);z-index:4;opacity:0;transition:opacity .35s ease}
.weather-3d-stage.night .weather-3d-moon{opacity:1}
.weather-3d-cloud{position:absolute;width:180px;height:62px;border-radius:60px;background:linear-gradient(180deg,rgba(239,250,255,.92),rgba(181,211,226,.76));filter:drop-shadow(0 15px 18px rgba(0,0,0,.22));transform:translateZ(110px);z-index:5;opacity:.08;transition:opacity .3s ease}
.weather-3d-cloud:before,.weather-3d-cloud:after{content:"";position:absolute;border-radius:50%;background:inherit}
.weather-3d-cloud:before{width:86px;height:86px;left:22px;bottom:8px}.weather-3d-cloud:after{width:96px;height:96px;right:24px;bottom:4px}
.weather-3d-stage.cloud .weather-3d-cloud,.weather-3d-stage.rain .weather-3d-cloud,.weather-3d-stage.storm .weather-3d-cloud,.weather-3d-stage.fog .weather-3d-cloud{opacity:.92}
.weather-3d-cloud.c1{left:11%;top:29%;animation:weatherCloudDrift 18s ease-in-out infinite}.weather-3d-cloud.c2{right:6%;top:42%;transform:translateZ(70px) scale(.75);animation:weatherCloudDrift2 23s ease-in-out infinite}
.weather-3d-rain{position:absolute;inset:0;z-index:6;pointer-events:none;opacity:0;transition:opacity .25s ease}
.weather-3d-stage.rain .weather-3d-rain,.weather-3d-stage.storm .weather-3d-rain{opacity:1}
.weather-3d-rain i{position:absolute;top:-40px;width:2px;height:24px;border-radius:999px;background:linear-gradient(180deg,rgba(188,235,255,.05),rgba(104,205,255,.8));animation:rainDrop 1s linear infinite}
.weather-3d-rain i:nth-child(1){left:9%;animation-delay:-.15s}.weather-3d-rain i:nth-child(2){left:18%;animation-delay:-.72s}.weather-3d-rain i:nth-child(3){left:27%;animation-delay:-.38s}.weather-3d-rain i:nth-child(4){left:35%;animation-delay:-.92s}.weather-3d-rain i:nth-child(5){left:44%;animation-delay:-.22s}.weather-3d-rain i:nth-child(6){left:52%;animation-delay:-.61s}.weather-3d-rain i:nth-child(7){left:61%;animation-delay:-.46s}.weather-3d-rain i:nth-child(8){left:69%;animation-delay:-.82s}.weather-3d-rain i:nth-child(9){left:77%;animation-delay:-.29s}.weather-3d-rain i:nth-child(10){left:85%;animation-delay:-.64s}.weather-3d-rain i:nth-child(11){left:93%;animation-delay:-.12s}
.weather-3d-fog{position:absolute;inset:18% -8% 30%;z-index:6;opacity:0;filter:blur(10px);background:linear-gradient(180deg,rgba(220,232,236,.12),rgba(200,217,220,.24),transparent);transition:opacity .25s ease;animation:fogShift 10s ease-in-out infinite}
.weather-3d-stage.fog .weather-3d-fog{opacity:1}
.weather-3d-lightning{position:absolute;left:56%;top:25%;width:72px;height:120px;z-index:7;opacity:0;transform:skewX(-18deg);background:linear-gradient(180deg,transparent 0 15%,#fff 18% 22%,transparent 25% 43%,#fff 46% 50%,transparent 53% 100%);filter:drop-shadow(0 0 13px rgba(255,255,255,.95));animation:flash 1.7s infinite}
.weather-3d-stage.storm .weather-3d-lightning{opacity:.72}
.weather-3d-hud{position:absolute;left:16px;right:16px;top:14px;display:flex;justify-content:space-between;gap:12px;z-index:9;align-items:flex-start;flex-wrap:wrap}
.weather-3d-live{display:inline-flex;align-items:center;gap:8px;padding:7px 10px;border-radius:999px;border:1px solid rgba(138,243,191,.18);background:rgba(3,11,16,.42);backdrop-filter:blur(7px);color:#a9f4ca;font-size:9px;font-weight:900;letter-spacing:.09em}
.weather-3d-live i{width:7px;height:7px;border-radius:50%;background:#8af3bf;box-shadow:0 0 13px rgba(138,243,191,.95);animation:pulse 1.5s infinite}
.weather-3d-clock{font-variant-numeric:tabular-nums;font-weight:900;font-size:25px;letter-spacing:.01em;text-shadow:0 4px 20px rgba(0,0,0,.5)}
.weather-3d-clock small{display:block;font-size:9px;letter-spacing:.08em;color:rgba(230,246,255,.72);margin-top:2px;text-align:right}
.weather-3d-center{position:absolute;left:50%;top:53%;transform:translate(-50%,-50%);z-index:8;text-align:center;min-width:230px}
.weather-3d-temp{font-size:56px;font-weight:900;line-height:.96;letter-spacing:-.04em;text-shadow:0 8px 28px rgba(0,0,0,.32)}
.weather-3d-condition{margin-top:8px;font-size:12px;font-weight:800}.weather-3d-meta{margin-top:6px;font-size:9px;color:rgba(229,246,255,.72)}
.weather-3d-side{display:grid;gap:12px}
.location-system-card{padding:16px;border-radius:18px;border:1px solid rgba(120,225,255,.13);background:linear-gradient(180deg,rgba(8,22,31,.94),rgba(5,15,22,.94));box-shadow:0 18px 48px rgba(0,0,0,.15)}
.location-system-head{display:flex;justify-content:space-between;gap:10px;align-items:center}
.location-system-badge{display:inline-flex;align-items:center;gap:7px;padding:6px 10px;border-radius:999px;color:#9df3c0;background:rgba(138,243,191,.06);border:1px solid rgba(138,243,191,.18);font-size:9px;font-weight:900;letter-spacing:.1em}
.location-system-badge i{width:7px;height:7px;border-radius:50%;background:#8af3bf;box-shadow:0 0 13px rgba(138,243,191,.95);animation:pulse 1.5s infinite}
.location-system-badge.warn{color:#ffdb9e;background:rgba(255,214,141,.05);border-color:rgba(255,214,141,.16)}.location-system-badge.warn i{background:#ffd88d;box-shadow:0 0 12px rgba(255,216,141,.7)}
.location-system-badge.off{color:#ffb0aa;background:rgba(255,100,100,.05);border-color:rgba(255,100,100,.16)}.location-system-badge.off i{background:#ff8f8f;box-shadow:0 0 12px rgba(255,143,143,.7);animation:none}
.location-coords{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:13px}.location-coords div{padding:10px;border:1px solid rgba(255,255,255,.07);border-radius:11px;background:rgba(255,255,255,.015)}.location-coords b{display:block;font-size:9px;color:var(--muted);text-transform:uppercase;letter-spacing:.08em}.location-coords span{display:block;margin-top:4px;font-size:13px;font-variant-numeric:tabular-nums}
.location-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}.location-actions .btn{flex:1}
.location-note{margin-top:9px;font-size:9px;color:var(--muted);line-height:1.5}
@keyframes weatherCloudDrift{0%,100%{transform:translate3d(0,0,110px)}50%{transform:translate3d(18px,-4px,110px)}}
@keyframes weatherCloudDrift2{0%,100%{transform:translate3d(0,0,70px) scale(.75)}50%{transform:translate3d(-20px,5px,70px) scale(.75)}}
@keyframes rainDrop{0%{transform:translateY(-20px) translateX(0) rotate(8deg);opacity:0}12%{opacity:1}100%{transform:translateY(390px) translateX(-35px) rotate(8deg);opacity:0}}
@keyframes fogShift{0%,100%{transform:translateX(-4%)}50%{transform:translateX(4%)}}
@keyframes flash{0%,82%,100%{opacity:0}84%{opacity:.95}88%{opacity:.05}90%{opacity:.75}94%{opacity:0}}
@media(max-width:900px){.weather-3d-shell{grid-template-columns:1fr}.weather-3d-stage{min-height:300px}}
@media(max-width:600px){.weather-3d-stage{min-height:260px}.weather-3d-temp{font-size:48px}.weather-3d-clock{font-size:20px}.location-coords{grid-template-columns:1fr}}
@media(prefers-reduced-motion:reduce){.weather-3d-cloud,.weather-3d-rain i,.weather-3d-fog,.weather-3d-lightning{animation:none!important}.harvest-live-badge i,.weather-3d-live i,.location-system-badge i{animation:none!important}}


/* ===== Original file: weather-3d-location.css ===== */
/* Dedicated cascade guard for the location + 3D weather module. */
.weather-3d-wrap{contain:layout paint style}.weather-3d-stage{will-change:transform}.location-status.location-system-on{color:#9df3c0}.location-status.location-system-warn{color:#ffd88d}.location-status.location-system-off{color:#ffaaa4}

```
