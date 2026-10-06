# IGERS POWERCORE — Advanced Live 3D Monitoring Suite

This package is an additive upgrade to the existing IGERS POWERCORE web app. Existing sections are preserved.

## Added independent panels

1. **3D Air Traffic Monitor** — uses the existing Airplanes.live public ADS-B feed bridge and adds a 3D globe with flight-detail cards.
2. **Google 3D Map Layer** — optional, user-supplied Google Maps JavaScript API key; no key is bundled.
3. **Universal Seismic / Plate Reference Monitor** — USGS global all-hour earthquake feed + PB2002 plate-boundary reference model; browser alert threshold is configurable.
4. **3D Coastal / Marine Monitor** — public Open-Meteo marine model for selected Bangladesh coastal points, including sea level, waves, SST and ocean currents.
5. **IGERS-BD-01 3D Concept Lab** — scenario calculator for kinetic, hydraulic, solar and battery calculations.
6. **3D Mobile-Tower Resilience Mesh** — simulation-only network-node dashboard. It does not operate real telecom, satellite or defence equipment.
7. **3D Salah / Qibla** — browser location, AlAdhan prayer-time service and geometric Qibla bearing; local browser alerts.
8. **Emergency Center** — local administrator message, evacuation-direction cue and notification test. No remote emergency broadcast is implemented.

## Public sources used

- Airplanes.live API: https://airplanes.live/api-docs/
- USGS earthquake feeds: https://earthquake.usgs.gov/earthquakes/feed/v1.0/
- PB2002 tectonic boundary reference: https://github.com/fraxen/tectonicplates
- Open-Meteo Marine API: https://open-meteo.com/en/docs/marine-weather-api
- Google Maps 3D documentation: https://developers.google.com/maps/documentation/javascript/3d/get-started
- AlAdhan Prayer Times API: https://aladhan.com/prayer-times-api
- AlAdhan Qibla API: https://aladhan.com/qibla-api
- EMSC / SeismicPortal reference: https://www.seismicportal.eu/fdsn-wsevent.html

## Important data limitations

- `LIVE` means the browser reached the public provider and received data.
- `VERIFY` means the module is ready but provider data is not presently verified.
- `OFFLINE` means the request failed; the UI does not fabricate values.
- USGS/EMSC event feeds are not official earthquake early-warning signals.
- Open-Meteo states that coastal sea-level/current model accuracy is limited and is not suitable for coastal navigation.
- ADS-B is not primary radar and cannot guarantee complete aircraft visibility.
- Google 3D requires an authorized API key and the required Google Maps API configuration.
- All calculation outputs in the IGERS concept lab are scenario estimates until replaced by measured field data.

## Static web deployment

Upload all files in this package together to the same GitHub Pages directory. The application remains client-side except for direct browser calls to the named public providers.
