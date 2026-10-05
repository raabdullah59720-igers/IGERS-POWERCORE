# IGERS POWERCORE FINAL — FULL BUG-CHECKED BUILD 2026.10.06

## Upload
Extract this folder and upload its contents to the GitHub Pages repository root. Keep `index.html` at the repository root.

## Independent modules
- Live Environment
- Alert & Notification Center
- Live Air Traffic + tap-to-view flight details
- 3D Air Traffic Monitor
- Dedicated Earthquake Monitor
- Dedicated 3D Weather View
- Anomaly Monitor + 3D Anomaly Field
- Silo / Storage Health Monitor + 3D model
- Satellite Connection (NASA GIBS public-service probe + public orbital elements)
- Border Resilience Monitor
- Energy Calculation Lab + Z-CALCULATING heartbeat
- IGERS-BD-01 Engineering Journal / Magazine
- Administrative 3D Control Center with local password gate and maintenance toggles

## Live providers
- Weather / precipitation: Open-Meteo
- Air quality: Open-Meteo Air Quality
- Earthquakes: USGS GeoJSON
- Public ADS-B-derived traffic: Airplanes.live with ADSB.lol fallback
- Earth observation: NASA GIBS public service
- Public orbital elements: CelesTrak

## Safety / honesty
The public-data modules show LIVE only when the browser reaches the provider. Offline/restricted states become VERIFY/UNKNOWN. The Anomaly Monitor and Alert Center are conservative information tools; they do not determine hostile intent or official threat status. The Silo/Storage panel is an engineering UI/simulation unless connected to a real sensor/API. The Admin password controls this static frontend only; it is not production-grade server authentication and does not control physical equipment.

## Alert System
Alert Center can show in-app toasts and, with browser permission, browser notifications. Test alert is explicitly labeled as a local test and is not a real hazard.
