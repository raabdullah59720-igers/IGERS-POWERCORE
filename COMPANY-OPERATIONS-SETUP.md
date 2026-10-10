# IGERS POWERCORE Company Operations — setup and trust boundaries

## What works immediately on the static site

- Project and equipment register, project lifecycle entries, site-screening records, BOM/procurement lines, work orders, safety checklist/incident entries, design revision metadata and team/client requests are stored in the current browser using `localStorage`.
- Engineering model validation runs locally from explicit user-entered assumptions. It validates units/ranges, displays formulas and differentiates scenario estimates from field measurements.
- Digital Twin Canvas is a visual simulation only. The storage fill is simulated; it must never be read as a battery state-of-charge measurement.
- Local JSON export/import is available. Keep a backup before clearing browser data.
- GitHub Actions tests and builds the static website and deploys `dist/` to GitHub Pages after a successful push to `main` or `master`.

Local browser storage is not shared between devices/users and is not a substitute for a company database. Avoid entering highly sensitive personal or client data until a properly access-controlled backend and privacy policy are approved.

## Publish the website

1. Extract this ZIP.
2. Upload the extracted contents to the **root** of the existing `IGERS-POWERCORE` repository, overwriting same-name project files.
3. Keep `index.html` at repository root and keep `data/`, images, SVGs, JS and CSS beside it.
4. In GitHub, open **Settings → Pages → Build and deployment → Source → GitHub Actions** once.
5. Commit to the default branch. The `IGERS Validate and Deploy` workflow runs backend tests, JavaScript syntax checks and the static build. It only deploys when the required job succeeds. Check the Actions tab for the real run result.

GitHub Pages runs static HTML/CSS/JavaScript. It does **not** run Python or keep a private database alive.

## Deploy the optional Python API (separate service)

A backend is required for multi-device company records and real device-reported telemetry. The `render.yaml` Blueprint describes a Python API with an attached persistent disk; a persistent disk requires a paid compatible Render service. Review the service and any charge before confirming deployment.

1. Push the same repository to GitHub.
2. In Render, choose **New → Blueprint** and select the repository containing `render.yaml`.
3. Review the proposed web service and persistent disk. Create it only after reviewing plan/costs.
4. Set the requested environment values:
   - `IGERS_ADMIN_USERNAME`: choose an administrator username.
   - `IGERS_ADMIN_PASSWORD`: generate a unique, long password; do not reuse an account password.
   - `IGERS_ALLOWED_ORIGINS`: exact browser origin(s), comma-separated. For this site, use `https://raabdullah59720-igers.github.io` (origin only; no `/IGERS-POWERCORE` path). Add your approved local/test origins only when needed.
   - `IGERS_AUTH_SECRET` and `IGERS_DEVICE_TOKEN`: use generated secrets; never place either in the website, GitHub files, screenshots or reports.
5. Wait for the API health check to pass. In the Company Operations → Hardware / IoT tab, enter the API base URL (without `/health`) and test connection. Sign in through Security / Release. Local records upload only when you explicitly press Sync.
6. For a hardware gateway, store the device token on the gateway/server and POST device measurements to `/api/v1/telemetry`. Do not embed it in frontend JavaScript.

After the first backend setup, commits can redeploy the API through the host's Git-linked deployment, and GitHub Actions independently redeploys the static website after its tests pass.

## API overview

- `GET /health`: non-secret configuration status only.
- `POST /api/v1/auth/session`: creates an 8-hour signed administrator session; never stores the password.
- `GET/POST/DELETE /api/v1/records`: authenticated JSON records for projects, assets, sites, lifecycle/commissioning, procurement, work orders, incidents, revisions, team tasks, client requests, economics scenarios and safety-check snapshots.
- `POST /api/v1/telemetry`: device-token authenticated ingestion with timestamp, finite-number and measurement bounds checks. The server always marks readings `DEVICE_REPORTED_UNVERIFIED`; it cannot independently certify the sensor's calibration or the physical source.
- `GET /api/v1/telemetry`: authenticated, recent telemetry list.

The API is a single-admin baseline with a device token, not a complete enterprise identity/role-management system. Before commercial deployment, add individual users/roles, credential rotation, backups/restore drills, an incident response process, monitoring, a reviewed privacy policy and qualified OT security review. Never connect safety-critical equipment directly to a general-purpose web UI. Use a safety-rated local controller/interlock for the physical process.

## Data integrity rules

- `measured`, `device-reported`, `forecast`, `model estimate`, `screening result` and `simulation` are not interchangeable.
- Energy output from scenario formulas is only as good as the input assumptions; no site is deemed technically feasible from data-completeness score alone.
- Work orders are user-entered tasks. They are not predictive maintenance unless a validated model and sufficient representative telemetry are added.
- Carbon totals are preliminary avoided-emissions estimates, not independently verified reductions or carbon credits.
- Configure licensed/authorised provider endpoints on the backend as required; no API credential is committed with this package.


## বাংলা দ্রুত নির্দেশিকা

IGERS POWERCORE — Company Operations Upgrade

১. ZIP extract করুন।
২. সব extracted file আপনার বর্তমান IGERS-POWERCORE GitHub repository-র root-এ upload করে একই নামের file overwrite করুন। index.html root-এ এবং data/ folder অক্ষত রাখুন।
৩. GitHub Settings → Pages → Build and deployment → Source → GitHub Actions একবার নির্বাচন করুন।
৪. Default branch-এ commit করুন। GitHub Actions test/build পাস করলেই website deploy করবে।

Company Operations-এ project/asset register, digital twin concept, engineering calculation validation, site-screening, commissioning tracker, BOM/procurement, maintenance, finance/carbon scenario, safety checklist, thesis revision, team/client request, telemetry connection ও JSON backup আছে। Local records বর্তমান browser-এ থাকে।

বাস্তব hardware telemetry ও একাধিক device/user-এর shared company records চালাতে আলাদা secure Python API deployment দরকার। GitHub Pages Python server চালায় না। API-র সেটআপ, environment variables, persistent storage ও নিরাপত্তার সীমাবদ্ধতা COMPANY-OPERATIONS-SETUP.md-তে আছে। কোনো password/token GitHub-এ commit করবেন না।

