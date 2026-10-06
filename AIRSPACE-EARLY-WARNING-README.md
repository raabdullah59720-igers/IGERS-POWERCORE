# IGERS POWERCORE — 3D Bangladesh Air / Ground / Maritime Early-Warning Panel

Additive module for the existing IGERS POWERCORE GitHub Pages app.

## Data layers
- NASA Worldview / GIBS: public Earth-observation imagery viewer.
- Airplanes.live: public ADS-B aircraft positions via the documented `/v2/point/{lat}/{lon}/{radius}` endpoint.
- Bangladesh ADM0 fallback geometry: existing local GeoJSON bundled with the app.

## Administrator access
The new configuration controls reuse the existing IGERS Administrator Gate/session. The panel does not expose or duplicate a password in this module.

## Safety / scope
This is a read-only early-warning and visualization layer. Coverage rings are generic visualization controls only. The module does not implement weapon deployment, interceptor launch, target assignment, fire-control, jamming, or automatic use of force.

## Public-source limitations
Public satellite imagery and public ADS-B data are not equivalent to military radar, military satellite telemetry, or a government command network. The UI therefore reports LIVE/VERIFY/OFFLINE honestly and does not fabricate sensor values.
