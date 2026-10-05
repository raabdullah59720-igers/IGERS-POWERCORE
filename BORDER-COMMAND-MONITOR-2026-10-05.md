# IGERS Border Zone Command Monitor — 2026-10-05

This additive module provides a command-style visual interface using public data only:
- Airplanes.live public ADS-B/MLAT-derived feed for aircraft counts and current positions.
- NASA GIBS / Himawari-9 AHI Band 13 clean-infrared Earth-observation imagery.
- A public-data aircraft flow heuristic: inbound, in-airspace, passing, outbound, based on current position and a 5-minute forward projection.
- Existing Airplanes.live map iframe remains intact.
- Existing simulated tower layer remains clearly labeled as simulated / authorized-feed-ready; no private telecom or restricted border sensor access is added.

The interface is styled like a professional command/HUD console but does not claim military affiliation or access to military-only sensors.

Calculation audit scope:
- Road kinetic recovery: ΔKE = 1/2 m(v1²-v2²), converted from km/h to m/s; efficiency applied after gross loss; annual aggregation uses explicit locations × vehicles/year/location.
- Water recovery: P = ρgQHη; flow is converted L/s → m³/s; annual energy uses hours/day × 365 × sites.
- Footstep recovery: E = Fδ; stroke converted mm → m; efficiency applied; annual energy uses steps/day × pads × 365.
- Fixed Professional Upgrade energy model so zero installed units correctly produce zero output instead of silently forcing one unit.
