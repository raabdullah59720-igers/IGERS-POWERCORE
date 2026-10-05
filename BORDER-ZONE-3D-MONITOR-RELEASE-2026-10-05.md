# IGERS Border Zone 3D Monitor — Release Notes

Date: 5 October 2026

## Additive scope

This module was added to the supplied `IGERS-POWERCORE-main (8).zip` baseline without removing or replacing the existing Energy, Water/Foodstep, Weather/Location, Air Traffic, Airspace Safety, Satellite Connection, Future Upgrade or 3D operations modules.

### New panel

- `BORDER ZONE 3D GROUND + AIR MONITOR`
- Separate Ground / Air / Satellite layer controls
- Animated 3D-style radar visualization rendered with `requestAnimationFrame()`
- Public ADS-B-derived air states reused from the existing IGERS feed when available
- Non-identifying aggregate/demo mobile-signal coverage visualization
- Public NASA GIBS Himawari AHI Band-13 clean-infrared Earth-observation image layer with fallback look-back attempts
- Satellite observation freshness / provider state indicators
- Responsive desktop/tablet/mobile layout

## Data and safety semantics

The panel does not claim access to military radar, border-security sensors, telecom operator private data or individual mobile-device locations. The network layer is deliberately aggregate/demo unless an authorized operator feed is integrated later.

NASA GIBS documentation exposes public WMS imagery through the EPSG:4326 endpoint, which is used by the satellite observation layer. CelesTrak public orbital-element refresh guidance is respected by the existing satellite connection module; the new panel does not create an extra high-frequency CelesTrak polling loop.

## Validation performed for this release

- All JavaScript source files: `node --check` PASS.
- HTML duplicate-ID audit: PASS.
- Local CSS/JS reference audit: PASS.
- Offline/static production build via the repository's `build.mjs`: PASS.
- Local HTTP smoke test: PASS (`http://127.0.0.1:4173/`).
- Final ZIP extraction/integrity: PASS.

## Browser/live-feed limitation

The execution environment used for this build cannot directly resolve external public data hosts, so NASA GIBS/CelesTrak/ADS-B live connectivity cannot be truthfully certified from this sandbox. The module therefore reports provider success/failure from the user's browser rather than pretending a feed is live.
