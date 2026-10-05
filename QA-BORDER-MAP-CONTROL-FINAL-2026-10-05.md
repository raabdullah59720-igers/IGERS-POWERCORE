# IGERS Border Map Control — Final QA
Date: 2026-10-05

## Passed
- Re-audited the supplied PRO-MIL-STYLE-PUBLIC-SATELLITE-BORDER release.
- All project JavaScript files pass Node syntax validation.
- Production static build passes.
- Local HTTP smoke test returns HTTP 200 for root/index, Border JS/CSS and generated dist assets.
- All 179 files from the previous release are preserved; the patch adds only new/updated map-control assets and QA output.
- Border monitor now uses a real geographic Leaflet map with OpenStreetMap tiles centered on Bangladesh.
- Aircraft search results are plotted at the exact latitude/longitude received from the existing Airplanes.live public API snapshot rather than an approximate screen-space projection.
- Bangladesh boundary overlay is displayed on the geographic map.
- Zoom control and a Bangladesh-view recenter control are available.
- Aircraft markers expose status, altitude, speed, track and position in map popups.
- Live aggregate counters show total received, position data, inbound, in-airspace, passing, outbound and total flow.
- Radar search status is driven by the freshness of the public aircraft snapshot; stale/offline data does not remain falsely marked LIVE.
- If Leaflet CDN loading fails, the existing Airplanes.live public live-map iframe is used as a fallback.

## Data semantics
- The radar/search layer is a public ADS-B/MLAT-derived aircraft visualization, not a restricted military radar feed.
- Inbound/outbound/passing are derived from current public position plus a 5-minute forward projection against the Bangladesh polygon; they are not flight-plan or military-intelligence classifications.
- No individual mobile-phone location is collected or inferred.
- Satellite observation uses NASA GIBS/Worldview public Earth-observation imagery.
