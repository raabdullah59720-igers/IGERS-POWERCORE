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
