# IGERS Satellite Weather & Disaster Intelligence Restore

Restored on 14 September 2026.

## Restored capabilities
- Dedicated Satellite & Disaster Intelligence section (`#satelliteIntel`).
- Bangladesh-focused satellite navigation layer.
- HIMAWARI / FY-2 satellite product navigation via Bangladesh Meteorological Department (BMD).
- BMD weather radar, cyclone and warning navigation.
- NASA GIBS near-real-time MODIS Earth-observation image panel for Bangladesh (`MODIS_Terra_CorrectedReflectance_TrueColor`).
- Satellite observation freshness/error state; unavailable imagery is not labelled LIVE.
- Existing Open-Meteo weather forecast remains separate from satellite observation.
- Existing Bangabandhu-1 public orbital-element connection monitor remains separate from satellite imagery.
- Existing Air Traffic, Earthquake and Airspace Safety systems remain independent.
- Location-aware OSM navigation control restored for the satellite intelligence section.

## Accuracy rule
Satellite imagery is presented as Earth observation. Forecast weather remains a weather-model feed. Bangabandhu-1 status is public orbital-element data, not private spacecraft telemetry or control.

## Validation
- `node --check script.js`: PASS
- Inline application script syntax: PASS
- Duplicate HTML IDs: 0
- Satellite section count: 1
- NASA GIBS image source present: YES
- HIMAWARI source navigation present: YES
- BMD satellite/radar/warning links present: YES
- Existing live feature markers preserved: YES
- Offline production build: PASS
