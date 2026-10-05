# IGERS Border Command + Calculation QA — 2026-10-05

## Integration
- Existing Air Traffic module preserved.
- Border Command monitor added as an independent section after the existing Air Traffic panel.
- Public Airplanes.live API snapshot is reused for counts and aircraft positions.
- Existing Airplanes.live live map remains available inside the new monitor and via Open Live Map.
- NASA GIBS / Himawari-9 AHI Band 13 public Earth-observation image layer added with 10-minute-slot fallback attempts.
- Existing simulated tower/mobile coverage module remains explicitly labelled simulated / authorized-feed-ready.

## Border flow counters
The monitor now shows:
- Total aircraft received from the regional public API response.
- Aircraft with position data.
- Current aircraft inside the approximate Bangladesh polygon.
- Inbound: outside now, predicted to enter within a 5-minute forward projection.
- Passing: inside now, predicted to remain in-airspace over the next 5 minutes.
- Outbound: inside now, predicted to exit within a 5-minute forward projection.
- Aggregate flow = inbound + passing + outbound.

The flow classification is an interface heuristic based on current public ADS-B-derived state, not a flight-plan or military-intelligence determination.

## Calculation audit
Independent unit checks passed against the exact equations used by the live calculators:
- Road kinetic-energy recovery: 1/2 m(v1²-v2²), km/h→m/s conversion, efficiency after gross loss, annual aggregation.
- Water: rho*g*Q*H*eta with L/s→m3/s conversion, operating hours/day and 365 days/year.
- Footstep: F*stroke*eta with mm→m conversion and annual steps.
- Professional Upgrade hydraulic module: zero installed units now correctly yields zero output rather than silently forcing one.

Default-model audit values:
- Road gross loss: 6076.389 J/event; net recovered: 1215.278 J/event; annual model: 7,089,120.370 kWh/year.
- Water net: 5.15025 kW/site; annual model: 225,580.95 kWh/year.
- Foot net: 1.68 J/step; annual model: 51.10 kWh/year.

## Verification
- All JS files pass `node --check`.
- `npm run build` passes.
- Local HTTP smoke test: 200 for root, index, new JS/CSS, dist index and dist new JS.
- Baseline file content preserved; only additive module files and the intended index/logic patches were added.
