# IGERS NASA Connection & Intelligence Upgrade — 2026-09-14

## Added
- NASA GIBS Earth-observation image layer with source-specific freshness state.
- Geostationary Himawari-9/AHI candidates (10-minute observation times) through NASA GIBS first, followed by NOAA-21, NOAA-20 and MODIS Terra fallback imagery.
- NASA Worldview deep link centered on the current browser location when available.
- NASA EONET v3 open natural-event metadata for a Bangladesh bounding box plus a global context count.
- NASA astronomy panel with local-location sky planning (solar state, sunrise/sunset, dark-sky window) and NASA Astronomy Picture of the Day.
- Explicit separation between satellite observation, forecast weather, disaster metadata, and astronomy media.
- Feed-specific LIVE/READY/WARN/OFFLINE states to avoid false global LIVE claims.

## Accuracy model
- Green NASA GIBS state means the selected NASA imagery request loaded successfully; it does not imply continuous satellite video or spacecraft control.
- EONET state means the EONET v3 feed returned current open-event metadata.
- APOD state means the NASA astronomy endpoint returned current astronomy media.
- The existing Open-Meteo weather panel remains the numerical forecast source.
- No private Bangabandhu-1 telemetry or government control access is claimed.

## QA
- `node --check nasa-intel.js`: PASS
- `npm run build`: PASS
- Duplicate HTML IDs: 0
- Missing local asset references: 0
- Local HTTP server: PASS
- `/`, `/privacy.html`, `/terms.html`, `/copyright.html`, `/nasa-intel.js`, `/dist/index.html`, `/dist/nasa-intel.js`: HTTP 200
- External NASA provider end-to-end fetch was not claimed in this sandbox because outbound networking is restricted; runtime logic is fail-safe and source-specific.
