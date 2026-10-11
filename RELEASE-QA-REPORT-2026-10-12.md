# IGERS POWERCORE — Release QA Report

**Release:** 12 October 2026 · GitHub Pages compact deployment

## Package

- **50 files total** (45 runtime files + 3 maintenance/test tools + upload instructions + QA report)
- All files are flat at the package root; no subfolders are required. The extra maintenance/test tools are not loaded by the website runtime.
- Static build output: 45 root-level runtime files, approximately 4.9 MB uncompressed; the 50-file upload ZIP is approximately 3.5 MB compressed.
- The complete runtime includes the full `index.html`, all directly referenced CSS/JS, the 11 thesis concept visual assets, footstep reference imagery, icons, Dhaka-local prayer configuration, service worker, legal pages, GeoJSON fallback and engineering magazine PDF.

## Changes and fixes in this release

1. Retained the current app panels and the Thesis Concept Lab, including 11 visual scenes. The SVG/JPG scenes use local assets; animated flow is marked conceptual rather than live sensor telemetry.
2. Fixed Concept Lab unit errors: kinetic-energy loss is now calculated in SI joules then converted to kJ for display; recovered Wh/event uses 3.6 kJ per Wh; annual roadway energy is consistently stored in kWh/y and presented as MWh/y. Physical numeric inputs are clamped to non-negative values.
3. Fixed the main energy calculator average equivalent power conversion: kWh/year ÷ 8,760 h/year = kW.
4. Fixed the separate frame-live calculation's missing Wh-to-kWh division so its annual road energy agrees with the main calculator.
5. Fixed Command Center diagnostics to recognize both external script references and modules inlined inside `index.html`; previously a valid inlined module could be incorrectly flagged as missing.
6. Moved local Bangladesh boundary fallback references to the root level and bundled a single root-level GeoJSON, making the one-batch upload package flat.
7. The build now creates a deterministic runtime-only release, validates local references in `index.html`, and fails if the deployment file count reaches 98.
8. Regression-test path handling was fixed so `node calculation-regression-tests.cjs` runs from the project root. The test script and its frame-live calculation helper are included in the ZIP for local maintenance; they are not loaded by `index.html`. The updated `build.mjs` supports both the original nested magazine source and the flattened release PDF.

## Automated checks completed

- `node calculation-regression-tests.cjs`: **PASS** — Concept Lab SI conversions, annual roadway estimate, combined scenario, non-negative input constraints and main/frame-live calculation consistency.
- Static production build: **PASS** — 45 runtime files; all local `src`/`href` references found in the main HTML resolve.
- JavaScript syntax: **PASS** — 11 deployed external JS/service-worker files and 13 inline executable scripts.
- HTML ID audit: **PASS** — 754 IDs, zero duplicates.
- In-page navigation: **PASS** — 43 hash links checked, zero unresolved targets.
- CSS basic delimiter check: **PASS** — 7 CSS files have balanced braces.
- Manifest and GeoJSON parsing: **PASS**.
- SVG XML validation: **PASS** — 11 files.
- Raster asset decoding: **PASS** — 6 files.
- PDF signature check: **PASS**.
- ZIP integrity and final file count: **PASS** — 50 entries, no nested paths, no corrupt archive members.

## Explicit limitations

A Chromium browser smoke test could not be completed in this execution environment because navigation to the local preview was blocked by the environment (`ERR_BLOCKED_BY_ADMINISTRATOR`). Therefore the report does **not** certify full visual rendering on the public HTTPS deployment. After publishing, verify the live site, service-worker update, external data-provider access and browser notifications.

External feeds can fail due to provider availability, network or CORS policy. Browser-based prayer alarms require HTTPS and notification permission and cannot be guaranteed when the browser/app is fully closed on a static GitHub Pages deployment. Conceptual energy estimates are not field measurements or construction-ready engineering validation.
