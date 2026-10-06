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
