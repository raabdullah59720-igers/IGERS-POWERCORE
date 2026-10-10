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


# Consolidated legacy handoff documents and snippets

The following non-runtime documentation/sample files were consolidated into this archive on 2026-10-10 to keep the live GitHub project within the 98-file limit. Their historical text/source is retained below; these files were not used as runtime dependencies by index.html.


---

## Archived file: `BUGFIX-VERIFY-REPORT.md`

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


---

## Archived file: `FULL-PANEL-AUDIT-REPORT.md`

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


---

## Archived file: `POWERCORE-12-UPGRADE-REPORT.md`

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


---

## Archived file: `UPGRADE-AND-VALIDATION-REPORT.md`

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


## 2026-10-10 Real-world data reliability update

- Consolidated weather/environment panels on a single timeout-bounded Open-Meteo forecast request with in-flight request coalescing and a 4-minute browser cache. Weather values are labelled model outputs, not station telemetry.
- Corrected hourly rain probability and the next-rain estimate to start at the current model hour instead of index 0 (midnight). Missing numeric fields remain unavailable, never silently converted to zero.
- Added an Open-Meteo/CAMS air-quality panel for US AQI, PM2.5, PM10, NO2 and ozone, showing model time and source limitations; it is explicitly not a ground-station reading. Refresh is bounded to 30 minutes, with a 12-second request timeout and honest offline/stale state.
- Shared USGS all-hour GeoJSON between the main earthquake panel and the advanced seismic panel, coalescing concurrent refreshes and slowing the main polling interval to 60 seconds visible / 180 seconds hidden.
- Corrected ADS-B coordinate and observation-age parsing for null/blank provider fields; selected-flight details show origin/destination only when the feed actually supplies them.
- Hardened marine/seismic missing-value formatting, avoiding null-to-zero conversions, and corrected NASA legacy helper endpoints to direct public EONET v3, GIBS WMS and APOD WordPress API URLs.
- GitHub Pages remains static hosting. Python relay scripts require a separately hosted server runtime; no local script is represented as running on GitHub Pages.
- Browser visual end-to-end and external provider reachability could not be fully proven by static test alone; API status in the app remains the source of truth at runtime.


### Data-freshness/polling refinements

- Forecast panel refresh is now coalesced and bounded to a 10-minute cache / 15-minute foreground poll; air-quality model refresh has a 45-minute cache / 60-minute foreground poll. Open-Meteo notes its underlying models are generally updated every few hours, so rapid repeated requests do not imply newer measurements.
- Hour labels are rendered in the provider's location timezone (rather than being silently reinterpreted in the device timezone). API/model time and browser retrieval time remain separate.
- AQI provider status has distinct model, stale and offline styles. Failed coordinate changes cannot let a previous location's late response overwrite the new location's display.
- Seismic status is marked degraded when only a source without a comparable generation timestamp is available; it no longer claims freshness is verified when the timestamp is unknown.


### Source and hosting notes

- Environmental weather values are labelled as Open-Meteo forecast-model output; the radar sweep/blips remain illustrative. Hour labels use the provider's timezone and are not reinterpreted in the device timezone.
- Added CAMS ENSEMBLE via Open-Meteo Air Quality API (US AQI, PM2.5, PM10, NO2 and ozone). The UI states the gridded/global resolution and warns that it is not a ground-station measurement.
- Main earthquake and advanced seismic views now share the USGS all-hour response when it is recent; source timestamp absence is degraded/unknown, not “freshness verified”.
- A live query from this build workspace to Open-Meteo and NASA endpoints failed at DNS resolution, so those external service responses could not be independently verified here. The in-app API requests are direct public endpoints with timeout/error states; runtime provider badges remain authoritative. The USGS all-hour GeoJSON endpoint was independently reachable through the web verifier with HTTP 200 during this audit.
- GitHub Pages is static hosting and does not run the bundled Python relay scripts as a server. Authorized toll/ITS and other private/credentialed feeds require a separately deployed server-side relay; the frontend does not fabricate such data.

## 2026-10-10 · Final real-world data + failure-path audit

- Extended the 12-second AbortController deadline to cover both HTTP fetch and JSON body parsing for Open-Meteo forecast and CAMS air-quality calls. A stalled response body can no longer keep these requests waiting indefinitely.
- Weather and AQI data are explicitly model products, not local weather-station or air-quality sensor observations. The AQI UI credits Open-Meteo / CAMS ENSEMBLE and shows model time, retrieval/status state, pollutant units and unavailable/stale conditions.
- Weather and environmental panels reuse a single keyed forecast promise/cache. Coordinate/location changes are guarded so a late response for an older location does not overwrite the new location. Missing/null/blank values stay unavailable, not fabricated zeros.
- Hourly rain/precipitation display starts at the provider model hour at or after current model time, with provider-local ISO hour labels. Model timestamp and browser retrieval timestamp remain separate.
- Shared USGS all-hour GeoJSON is reused by the main and advanced seismic views; missing comparable source-generation timestamps are reported as degraded/unknown rather than falsely verified as fresh.
- NASA imagery uses the active GIBS tile integration. Legacy NASA helper URLs were changed away from the non-existent `/api/provider` relay path to direct public NASA endpoints where those public endpoints are documented; this does not imply a live API response was reachable from this build workspace.

### Final verification performed
- Clean static build: `node build.mjs` PASS; generated `dist/` contains the production static site and runtime assets.
- JavaScript/MJS syntax: 46 files PASS. Python source parsing/compilation: 4 files PASS.
- HTML check across 7 HTML files: 599 IDs, zero duplicate IDs; 16 inline scripts syntax-checked with zero parser errors; zero missing active local resources or internal fragment targets. Two optional integration snippets are documentation examples only and refer to future/unbundled sample modules; neither is loaded by `index.html`.
- CSS parser: 7 stylesheets, zero parse errors. JSON, web manifest and GeoJSON parse without errors.
- Shared weather/AQI mock runtime harness: 14 assertions PASS (request coalescing, coordinate race handling, current-hour alignment, model-source labelling, no null-to-zero, stale/offline status and failed refresh behavior).
- Local HTTP smoke test against the generated production output: 25/25 key routes returned HTTP 200, including index, CSS, service worker, manifest, GeoJSON, NASA modules, Concept Lab SVG/JPG assets, PWA icons and legal/report pages.
- Baseline archive comparison: all 98 original file paths are retained; no project paths were added or removed. Six existing files changed: `index.html`, `design-standard.css`, `advanced-live-suite.js`, `nasa-intel.js`, `sw.js` and this report.
- External endpoint limitation: this workspace failed DNS resolution for Open-Meteo and NASA direct requests, so their live HTTP responses could not be validated here. The USGS all-hour GeoJSON endpoint returned HTTP 200 through the web verifier during this audit. Provider badges in the deployed app remain authoritative.
- GitHub Pages is static hosting and does not execute bundled Python relay scripts as a server; toll/authorized infrastructure feeds require a separately hosted service endpoint.
- Chromium visual end-to-end testing was not completed in this workspace. Static/build/runtime-mock/local-HTTP tests passed, but a post-deployment browser check is still recommended.


---

## Archived file: `SECTION-GROUPING-UPDATE.md`

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


---

## Archived file: `border-status-integration-snippet.html`

```html
<!-- IGERS-BD-01 Border Resilience Public-Data Status Panel -->
<link rel="stylesheet" href="igers-compact-bundle.css">
<div id="igers-border-status-panel"></div>
<script src="assets/igers-border-status.js"></script>
<script>IGERSBorderStatusPanel.mount('#igers-border-status-panel');</script>
```


---

## Archived file: `integration-snippet.html`

```html
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
```


---

## Archived file: `README_BN.txt`

```text
IGERS SENTINEL GRID — Demo App

এইটি একটি DEMO / prototype app। বাস্তব radar, CCTV, government network বা কোনো field equipment-এর সাথে এটি connected নয়। সব data simulated।

ANDROID-এ সহজে demo চালানোর পদ্ধতি:
1) ZIP extract করুন।
2) folder-টি একটি HTTPS hosting-এ upload করুন, যেমন GitHub Pages / Netlify / Cloudflare Pages।
3) Android Chrome-এ site open করুন।
4) Chrome menu → Add to Home screen / Install app নির্বাচন করুন।

বর্তমান demo screens:
• Home dashboard
• Network architecture
• Sensor node status
• Public & operations alerts
• Field engineer installation workflow
• NOC operator demo controls
• 3D model views

ভবিষ্যতে:
• Real API/backend
• User login & role management
• PostgreSQL/Firebase/Supabase
• Real weather/flood feeds
• GIS map
• Push notifications
• Device telemetry
• Android/iOS native app
```
