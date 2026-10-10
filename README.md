# IGERS POWERCORE — Company Operations Upgrade

GitHub Pages-ready static application with the existing IGERS dashboard, energy calculation panels, environmental/public-data views, border/air visualizations, airport runway simulator and Thesis Concept Lab preserved, plus a company operations workspace.

## Quick start

1. Extract the upgrade ZIP.
2. Upload its contents to the **root of your existing `IGERS-POWERCORE` repository**, overwriting files with the same names.
3. Keep `index.html` at root and keep `data/`, JS, CSS, SVG, JPG and icons alongside it.
4. Set **Settings → Pages → Build and deployment → Source → GitHub Actions** once.
5. Commit to the default branch. The included GitHub Actions workflow tests and builds the app, then deploys the generated static site only when checks succeed.

## Company Operations

The new workspace includes a conceptual digital twin, project/asset register, backend-ready telemetry gateway, engineering model validation, site-screening planner, prototype/commissioning tracker, BOM/procurement, maintenance work orders, energy-economics/carbon scenarios, safety checklist/incidents, thesis/design revision metadata, team/client request tracking, backup/export and release diagnostics.

Local records persist in the current browser until explicitly exported/synced. To use shared company data or real device telemetry, deploy the optional Python API described in [`COMPANY-OPERATIONS-SETUP.md`](COMPANY-OPERATIONS-SETUP.md). GitHub Pages cannot run Python; no backend credentials or fabricated telemetry are shipped in the frontend.

## Local verification

- Website-only build: `npm run build` (no npm install required for the static fallback).
- Backend API tests: `python -m unittest discover -s tests -v`.
- Backend local run: configure environment variables and run `python company_backend.py`.

Review `COMPANY-OPERATIONS-SETUP.md` before enabling the API. Persistent backend storage requires a compatible hosted service/disk. Do not commit secrets.
