# IGERS-BD-01 · POWERCORE

**Integrated Gradient-Based Energy Recovery and Storage System**

Inventor & Author: Abdullah Al Rafi [BD]  
Concept / Invention Date: 14 August 2026

This is a static-first, GitHub Pages-compatible engineering dashboard. All pre-existing project modules are retained. The navigation now groups related panels into six expandable categories (Overview; Environment & Live Data; Air & Border Operations; Infrastructure & Network; Energy & System Control; Safety & Support). The SYSTEM MASTER CONTROL ON/OFF buttons are wired to the existing admin-session flags and update a local UI simulation status only; they do not control physical hardware or interrupt live public-data feeds. Existing section IDs and feature handlers remain in place; the update changes navigation organization, styling, and mobile menu behavior rather than deleting panel functionality.

## Navigation / section grouping

- The same six categories organize the existing section destinations so related modules sit together.
- The theme toggle remains available. On mobile, use the navigation button to open/close the groups; select a category and then a panel.
- The browser cache-busting versions and service-worker revision have been bumped for this update. GitHub Pages still needs to finish deployment after commit; a frontend cannot make the hosting deployment instant.

## Admin master state

The `SYSTEM MASTER CONTROL` ON/OFF buttons are wired to the existing administrator session gate. They persist a **local prototype UI state** only; they do not stop public-data refreshes or actuate physical hardware. Unauthenticated clicks do not change state and guide the operator to the existing admin gate.

## Deploy to GitHub Pages

1. Download and extract this ZIP. The archive stores project files directly at its root, including `index.html`.
2. Upload all extracted files and the `data` folder to the root of the existing `IGERS-POWERCORE` repository. Do not put them inside an extra nested project folder. `index.html` must remain at the repository root.
3. One-time requirement: in GitHub open **Settings → Pages → Build and deployment → Source** and select **GitHub Actions**. The included workflow validates and builds the app, then deploys `dist/` only from the repository's default branch. Keep `.github/workflows/deploy.yml` in the repository. The workflow validates pull requests but does not publish them.
4. Commit the uploaded files. After the one-time Pages setting is changed, future default-branch commits automatically run validation/build/deploy. GitHub Pages publication and CDN propagation still take time after a commit; frontend code cannot make hosting deployment instantaneous. Versioned assets and the service worker help the open app detect a new release. A hard refresh (**Ctrl+F5**) is useful after the first replacement.
5. If this existing repository still has the eight retired report/snippet files listed in `PROJECT-DOCUMENTATION-ARCHIVE.md`, you may leave them temporarily; the production build excludes those known legacy paths. They are not runtime assets. The downloadable source ZIP itself stays within the 98-file limit.

## Data honesty

- Border fallback geometry and river strokes are bundled low-resolution geography for offline visualization only. The UI still attempts a public geoBoundaries boundary first/alongside its fallback. Do not use the fallback as legal, cadastral, surveying, or operational boundary data.
- Air traffic is read-only public ADS-B data when Airplanes.live can be reached. No fictional aircraft are added. Provider coverage may be incomplete and observations may be stale.
- Virtual border/ground nodes and radar sweeps are labelled simulation/illustration and do not imply access to private telecom networks, national surveillance infrastructure, military radar, or physical systems.
- The NASA GIBS panel reports tile success/failure counts and bounded date retries. Satellite imagery is not live spacecraft telemetry. Live endpoint verification was blocked in the packaging environment by unavailable DNS/network access; verify the tile panel after deployment.
- Browser-side admin locks remain prototype UI restrictions only, not production authentication.

## File-count and historical sources

The package is kept below the requested 98-file maximum. Historical Markdown/text reports are consolidated into `PROJECT-DOCUMENTATION-ARCHIVE.md`; source CSS files are preserved in `STYLES-SOURCE-ARCHIVE.css`. `index.html` continues to use its existing `igers-compact-bundle.css` and inline scripts, with `design-standard.css` loaded afterward for visual consistency. The unused nested ZIP was removed to avoid shipping a second copy of the application inside the repository.

The off-line boundary fallback is in `data/bangladesh-boundary-fallback.geojson`. It carries per-feature source/accuracy metadata. For the current authoritative boundary, verify geoBoundaries availability and attribution before promoting that source to the live layer.

## Company Operations & Real Telemetry (2026-10-10)

The new **Company Operations** workspace adds project/asset/site/work-order registers, design revisions, team tasks, service requests, finance scenarios, engineering site estimates, local audit export, and a secured API connection UI. Browser-local records are device-local only; they are not automatically shared between users or devices.

### Automatic GitHub Pages validation and deploy

The repository now includes `.github/workflows/deploy.yml`. On every push/pull request it checks JavaScript/MJS syntax, Python compilation, HTML IDs/internal anchors/local resources, backend authentication and telemetry validation, and the static production build. Only a validated default-branch push deploys the `dist/` artifact. To enable this workflow, open **Settings → Pages → Build and deployment → Source → GitHub Actions** once. Keep the `.github/workflows/deploy.yml` path when uploading. GitHub deployment/CDN propagation takes some time after commit; the page cannot update before GitHub finishes its deployment.

### Real company data requires a backend

GitHub Pages runs the public HTML/CSS/JavaScript only; it does not execute Python or collect physical-device measurements on its own. Optional FastAPI source is in `backend/`, with setup, environment-secret, CORS, storage and telemetry-ingest instructions in `COMPANY-OPERATIONS-SETUP.md`. Deploy it separately to an HTTPS Python-capable host before expecting multi-device records or gateway telemetry. Keep `IGERS_ADMIN_API_KEY` and `IGERS_INGEST_API_KEY` only in the backend host's secret settings.

Never label model estimates, visual simulations or user-entered values as calibrated real-world measurements. Company Operations intentionally reports unavailable telemetry if no authenticated device gateway has submitted actual observations.
