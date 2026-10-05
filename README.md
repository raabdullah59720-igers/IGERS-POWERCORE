# IGERS POWERCORE — FINAL AIR LIVE MULTI-SOURCE BUILD 2026.10.06

Upload-ready GitHub Pages build.

## Live Air Traffic
The Live Air Traffic panel now uses three public ADS-B providers in automatic failover order:
1. Airplanes.live — `https://api.airplanes.live/v2/point/{lat}/{lon}/{radius}`
2. ADSB.lol — `https://api.adsb.lol/v2/point/{lat}/{lon}/{radius}`
3. adsb.fi — `https://opendata.adsb.fi/api/v3/lat/{lat}/lon/{lon}/dist/{radius}`

The panel shows:
- LIVE / VERIFY provider status
- active source name
- aircraft count and position-bearing count
- provider response state/last success
- automatic 30-second refresh (when polling is enabled)
- manual provider cycling
- tap/click aircraft marker or list row for public flight details
- 3D air-traffic view using the same live dataset
- Air Alert integration for public emergency/squawk fields and unverified identity heuristics

The browser never fabricates aircraft when all providers are unavailable. It shows VERIFY instead.

## Other modules retained
Alert Center, earthquake monitor, 3D weather, anomaly monitor, silo/storage, satellite status, border monitor, energy calculations, Journal/Magazine and Admin 3D Control.

## Upload
Extract the folder and upload its contents to the GitHub Pages repository root. Keep `index.html` at repository root.

## Important
This uses public data sources. Provider availability, CORS policy, rate limits and coverage can change. The site is informational/resilience-oriented and not an official aviation-control, defence or emergency system.
