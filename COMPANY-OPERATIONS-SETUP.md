# IGERS POWERCORE · Company Operations, Real Telemetry & Automatic Deploy

## What runs immediately after the website deploys

The Company Operations screen starts in **local workspace mode**. Project records, asset register, site surveys, work orders, economics scenarios, design revisions, task assignments and service requests are stored in that browser's local storage. Those records are not automatically shared with other devices and are not a secure company database. The finance calculator distinguishes a model estimate from a user-entered meter value. The site planner uses explicit assumptions and shows model estimates, not guaranteed generation.

Real sensor/device telemetry is never fabricated by this UI. A device has to send measurements to the optional backend below. A blank or unavailable sensor value is not converted to zero.

## One-time automatic website deployment setup

The included `.github/workflows/deploy.yml` runs source checks, backend tests, local-link/asset checks and a static production build. It deploys **only after the checks pass**.

1. Extract the ZIP and upload its contents to the root of the existing `IGERS-POWERCORE` repository, preserving `.github/workflows/deploy.yml`, `backend/`, `tests/`, `data/`, and root `index.html`.
2. In GitHub, open **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions** once. This is required because the supplied workflow deploys the validated `dist/` artifact rather than publishing the source repository root.
3. Commit the upload on the repository's default branch. Open **Actions** and wait for `IGERS POWERCORE · Validate and Deploy`. If checks pass, it publishes the checked build. A pull request runs validation but does not deploy. Later pushes to the default branch run the same test/build/deploy pipeline.
4. If the GitHub upload form does not preserve the `.github` folder, create `.github/workflows/deploy.yml` using the file from the extracted archive before expecting automated deploys.

GitHub Pages publication begins after the commit and workflow; CDN propagation is not instantaneous. The existing branch-deployment setting must be switched to GitHub Actions only once for this gated workflow.

## Optional backend for shared company records and real device data

**GitHub Pages is static hosting; it does not execute Python.** The Python API in `backend/server.py` must be deployed separately to a Python-capable HTTPS host. Until that is done, the web app remains useful in local mode and shows telemetry as unavailable rather than inventing readings.

### Backend setup

- Use Python 3.11+ (workflow tests on Python 3.13).
- Install `backend/requirements.txt`.
- Start from the `backend/` directory using `uvicorn server:app --host 0.0.0.0 --port $PORT`.
- Configure these environment variables **in the backend host's secret/configuration UI**, never in HTML, JavaScript, the GitHub repository, or a screenshot:
  - `IGERS_ADMIN_API_KEY`: at least 32 random characters.
  - `IGERS_INGEST_API_KEY`: a different, independently generated key, at least 32 random characters.
  - `IGERS_ALLOWED_ORIGINS`: exact frontend origin, e.g. `https://raabdullah59720-igers.github.io` (no path; do not use `*`). Add localhost origins only for local development.
  - `IGERS_DB_PATH`: path on persistent storage, e.g. `/var/lib/igers/igers_powercore.sqlite3`.
  - `IGERS_ENABLE_API_DOCS=0` for hosted environments.
- Confirm `GET https://YOUR-API-HOST/api/health` returns status and storage configuration. Do not infer sensor connectivity from the health endpoint alone.
- In Company Operations, enter the backend base URL and admin key, then click **Connect & verify**. The URL is saved locally, but the key is held in memory only and must be re-entered after a reload. CORS must allow the exact website origin.

SQLite is included for a pilot. A hosted provider with ephemeral disk can lose records on restart; mount persistent storage or use a managed database before relying on records operationally. The sample API is a secured pilot scaffold, not a certified OT/security platform. Add individual identity/roles, MFA, rate limiting, backup/restore, audit retention and security review before company-wide deployment. Never expose the shared admin key to untrusted users.

### Real sensor/gateway data contract

A trusted device gateway posts an observation to `POST /api/telemetry/ingest` with header `X-IGERS-Ingest-Key` set on the gateway/server side. Example JSON:

```json
{
  "device_id": "gateway-01",
  "site_id": "site-01",
  "observed_at": "2026-10-10T08:30:00Z",
  "measurements": {
    "power_w": 421.6,
    "energy_wh": 15320.4,
    "temperature_c": 38.1,
    "soc_pct": 76.2
  },
  "units": {"power_w":"W", "energy_wh":"Wh", "temperature_c":"degC", "soc_pct":"%"}
}
```

Supported measurement names: `voltage_v`, `current_a`, `power_w`, `energy_wh`, `temperature_c`, `soc_pct`, `vibration_mm_s`, `flow_m3_s`, `head_m`, `solar_irradiance_w_m2`, `wind_speed_m_s`. The API checks field names, physical ranges, future timestamps, request size and authentication. Missing measurements should be omitted; do not send invented zeros. The frontend reads `GET /api/telemetry/latest` with the admin key and labels responses **device-reported**; calibration/metrology is not independently certified.

The backend provides authenticated CRUD for `projects`, `assets`, `sites`, `work-orders`, `design-versions`, `team-tasks`, `service-requests`, and `finance-scenarios`. Only share non-sensitive operational data with this pilot API. Do not store passwords, secrets, financial-account details or high-risk personal data in notes.

## Data sources and production honesty

- The existing public weather/air-quality integrations are external model services; service availability/rate limits and usage terms remain controlled by each provider.
- Public aircraft feeds can omit origin/destination, have uneven coverage or become stale.
- NASA image tiles are imagery products, not live spacecraft telemetry.
- Earthquake feeds report source observations; missing source timestamps remain unverified.
- Border radar sweeps, conceptual 3D diagrams and runway animation remain simulation/visualization unless a real, authorized sensor/gateway feed provides observations.
- Real installed energy measurement requires calibrated instrumentation and a commissioned gateway. A browser drawing is not proof of physical generation or a safety system.

## Validation performed locally

Run `python -m unittest discover -s tests -v`, then `npm run build`. The GitHub Actions workflow repeats JavaScript/MJS syntax checks, Python compilation, HTML IDs/anchors/local-asset tests, backend authentication/record/telemetry tests, and the static production build on every push/PR. A passing static test does not prove every external public provider is online or that unconnected hardware exists.

## Release validation performed (2026-10-10)

Final source package: 98 files with `index.html` at the archive root. The latest validation run passed 19 unit/static/API tests (11 static/DOM/runtime checks and 8 backend API checks), JavaScript/MJS syntax for 47 files, Python compilation, CSS parsing for 8 stylesheets, JSON/webmanifest parsing for 3 files, XML parsing for 6 SVGs, production build, and local HTTP retrieval for all 73 public runtime files. No duplicate HTML IDs or missing local links/assets were found. The test suite also covers admin-key non-persistence, authenticated connect/disconnect, telemetry timer lifecycle, finance NPV validation/edit/cancel, and the correct HTML structure for site estimate outputs.

Full Chromium visual/end-to-end testing was blocked by this workspace's browser navigation/timeout restrictions. External Open-Meteo/NASA endpoint availability was not confirmed from the build environment due to DNS restrictions. Run the release on GitHub Pages and inspect live provider status before treating it as operational. Physical-device telemetry still requires the separately hosted backend and a configured, authenticated device gateway.
