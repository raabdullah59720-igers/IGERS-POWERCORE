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
