# IGERS-BD-01 Bangladesh Satellite Monitor

Additive monitor panel. Existing app modules are preserved.

## Live/public data sources
- NASA GIBS / Worldview: public Earth-observation imagery.
- USGS Earthquakes GeoJSON: recent seismic events.
- GDACS API: public multi-hazard alerts.
- Existing IGERS ADS-B panel: public aircraft-feed state.
- OpenStreetMap: Bangladesh basemap iframe.

## Safety boundary
The danger/threat indicator is a public-data hazard/anomaly indicator only. It does not identify hostile actors, generate targeting information, or control real-world sensors.

## GitHub Pages
All files are root-relative/relative and the build contains no CNAME file. Keep the GitHub Pages source on GitHub Actions.
