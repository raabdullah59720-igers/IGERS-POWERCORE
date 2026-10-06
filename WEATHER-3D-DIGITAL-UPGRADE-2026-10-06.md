# IGERS POWERCORE — Digital 3D Weather Upgrade

This additive upgrade converts the Weather panel from an analog/emoji presentation into a digital 3D atmospheric console.

Included:
- Procedural 3D-style sky/depth scene with horizon grid, clouds, sun/moon, wind vectors and precipitation particles.
- Live values bound to the existing Open-Meteo weather engine; no duplicate provider or fabricated sensor values.
- Digital temperature, humidity, wind, precipitation, condition and direction HUD.
- Hourly forecast strip synchronized from the existing weather-hourly stream.
- Night/Day theme compatibility.
- Reduced performance footprint: capped animation geometry and 2x device-pixel ratio.
- Existing Weather API/location logic, Weather live-indicator and all other IGERS panels remain intact.
- Service-worker cache version bumped to v7.

QA:
- All inline script blocks pass Node syntax checking.
- All standalone JavaScript files pass Node syntax checking.
- Upgrade is additive and does not replace the existing Weather API/data flow.
