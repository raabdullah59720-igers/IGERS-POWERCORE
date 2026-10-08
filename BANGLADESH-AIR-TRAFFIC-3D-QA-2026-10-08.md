# IGERS-BD-01 — Bangladesh Air Traffic 3D Radar Fix QA
Date: 2026-10-08

## Scope
- `airTraffic3D` is now a Bangladesh-footprint-only live ADS-B/MLAT visualization layer.
- Aircraft are geographically filtered before rendering; positions outside the Bangladesh footprint are not drawn in this panel.
- The panel includes a continuous radar sweep, Bangladesh outline, altitude extrusion, short trails, target list, selected-flight detail, and directional flow counters (N/E/S/W).
- The existing broader `airtraffic` panel is preserved unchanged.

## Data behavior
- Preferred live source: authorized relay from Field Link when configured.
- Public fallback: Airplanes.live point query centered on Dhaka.
- Secondary fallback: OpenSky state vectors over the Bangladesh-region bounding box.
- Source data are filtered to the Bangladesh footprint before state merge/render.
- No synthetic aircraft positions are generated.
- `LIVE`, `VERIFY`, and `OFFLINE` states remain explicit.

## Static QA
- 35 sections
- 451 unique IDs
- Duplicate IDs: 0
- Missing local references: 0
- JavaScript syntax checks: PASS for all project JS files checked
- Service worker cache: `igers-powercore-v19`
- ZIP integrity: PASS

## Connectivity caveat
The build environment could not resolve the public API hostnames during direct curl testing (`api.airplanes.live`, `opensky-network.org`). This is an environment/network limitation and is not evidence that the browser user will be offline. The app therefore keeps provider failure states explicit instead of fabricating live data.

## Interpretation
“Bangladesh air traffic” in this panel means aircraft whose current tracked position falls inside the Bangladesh geographic footprint. It does not mean only Bangladesh-registered airlines or aircraft.
