IGERS Border Map Control QA — 5 October 2026

Fix: replaced the command-panel aircraft view from pixel-projected markers over a remote iframe with a real Leaflet/OpenStreetMap geographic basemap. Public aircraft results now render as geolocated markers using the exact lat/lon returned by the existing Airplanes.live API snapshot. Bangladesh boundary/zone overlay, zoom controls, Bangladesh recenter control, popups and live counts are included.

The Airplanes.live iframe remains as a fallback if Leaflet CDN loading fails.

Safety/data semantics: public ADS-B/MLAT-derived air traffic only; no restricted military radar or individual phone tracking.
