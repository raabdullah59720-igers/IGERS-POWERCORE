# IGERS POWERCORE — Compact GitHub Upload Package

**Package date:** 11 October 2026  
**Upload count:** 98 files total (including files inside `data/`) — under the requested 99-file limit.  
**Baseline:** bug-fixed IGERS POWERCORE project with Japanese, Vietnamese and Urdu language support.

## Option A — GitHub Pages (recommended for your current workflow)

1. Extract this ZIP.
2. Open the `IGERS-POWERCORE-GITHUB-UPLOAD-98-FILES` folder.
3. Upload **the contents of this folder** to the repository root. Do not upload the ZIP itself as the website source.
4. In GitHub, open **Settings → Pages** and publish from the chosen branch and root folder.
5. After deployment, hard-refresh using `Ctrl+Shift+R` if an old cached page appears.

The browser entry point is `index.html`. All current JavaScript modules, required stylesheets and embedded styles, images/icons, the Bangladesh map fallback GeoJSON, language code/dictionaries, legal pages, manifest/service worker and the existing app package ZIP are retained. Duplicate CSS files are omitted only when their full CSS is already present in the inline HTML styles or `igers-compact-bundle.css`; CSS used as an active stylesheet or referenced by retained JavaScript remains included. `energy-live-update.css` is explicitly retained for compatibility.

**Important:** Upload these 98 root files as-is for GitHub Pages. Do not first run `node build.mjs` and then upload both the root and `dist/`—that would duplicate files in the repository.

## Option B — Production build / local preview

- `node build.mjs` creates `dist/`; build check passed and `dist/` contains 87 files. For a static host that uses build output, upload **only the contents of `dist/`** (87 files), not the root and `dist/` together.
- `node server.mjs` starts a simple local preview at `http://127.0.0.1:4173/`.
- `package.json`, `build.mjs`, `server.mjs`, `vercel.json` and `render.yaml` are included for the existing package/deployment workflow.

## Optional backend files

`company_backend.py`, `airtraffic_live_relay.py` and `toll-live-relay.py` are included. GitHub Pages does **not** execute Python; the company API must be deployed separately through the configuration in `render.yaml`, with required environment variables set in the host dashboard. Never commit real passwords, tokens or other secrets to the repository. Relay scripts only provide live data if their related data providers/network endpoints are configured and reachable.

## Validation performed

- Latest engineering-upgrade QA: 98 source files, 87 production-build files; 49 JavaScript syntax checks, 3 Python compilation checks, 12/12 math/runtime tests, 8/8 language-addon tests, offline relay fixture checks, and 0 missing direct local references. A separate downloadable QA report is provided with the build.

- Calculation regression tests: PASS (8 deterministic model/validation tests plus direct mathematical API tests).
- Japanese, Vietnamese and Urdu localization: 163 additional normalized UI keys per language, plus the add-on’s existing curated dictionary, with language selection and Urdu RTL behavior covered by targeted tests.
- Patch-guard tests: 3/3 PASS.
- Air-traffic relay self-test: PASS.
- Production static build: PASS; `dist/` generated with 87 files.
- Root HTML direct local resource references: 0 missing.

The previous bug fixes for kinetic-energy units, average power, input bounds, map fallback presence and service-worker revision are retained. These automated checks do not prove external providers are currently online, nor do they field-calibrate energy estimates. Model outputs must be validated against measured site data before engineering use.


## New: Field Calibration & Model Validation / মাঠপর্যায়ের যাচাই
- Use the new **Field Calibration & Model Validation** panel in Engineering & Simulation Lab. Save predicted and measured energy in kWh for the **same test interval**, include duration, site/test ID and operating conditions, and export CSV/JSON records.
- MAE, RMSE, mean bias, MAPE (excluding zero predictions) and aggregate signed bias are calculated from saved user-entered records. Records are kept in this browser only; export them before clearing browser storage or changing devices.
- Engineering model checks validate formula/unit reference cases, not field performance. Exact future field agreement cannot be guaranteed without calibrated instruments, representative testing, measured traffic/flow/weather, parasitic losses, downtime and additional energy/fuel penalties.
- The app is a static web/PWA. It can be installed through supported Android browsers; this package does **not** contain a native Android APK. Python backend/relay scripts require separate server hosting and do not run on GitHub Pages.

- Added model/site-scoped calibration metrics, duration-normalized power error metrics (kW), and filtered CSV/JSON exports.
- Fixed language-selection wiring so Japanese, Vietnamese and Urdu are supported by the localization engine rather than only displayed in the language selector.
- Restored the IGERS Professional Engineering Magazine panel and direct PDF asset in the main app. The old screenshot `runtime.png` was removed because it was not referenced by the runtime; the publication PDF is now a first-class resource.
