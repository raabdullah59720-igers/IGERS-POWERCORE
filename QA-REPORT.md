# QA — IGERS POWERCORE AIR LIVE MULTI-SOURCE BUILD

## Static verification
- `index.html` JavaScript syntax check: PASS.
- Declared DOM IDs: 196.
- `$()` / `getElementById()` references resolved: no missing IDs.
- Multi-source endpoints present: Airplanes.live, ADSB.lol, adsb.fi.
- LIVE/VERIFY source-health UI present.
- 30-second automatic traffic refresh present; manual source cycling present.
- Flight marker/list detail interaction retained.
- Air Alert integration retained.
- 3D Air Traffic canvas retained.
- Magazine PDF and cover assets present.
- Service-worker cache bumped to `igers-final-2026-10-06-air-v5`.
- Local HTTP server returned `200` for `index.html`.
- ZIP integrity tested after packaging.

## Live-network limitation
The build container cannot resolve the external ADS-B provider DNS endpoints, so live provider payloads could not be fetched from this execution environment. The app therefore explicitly falls back across the three configured providers and shows VERIFY when all are unavailable.
