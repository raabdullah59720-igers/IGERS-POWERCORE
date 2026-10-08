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
