# IGERS POWERCORE — UI / Visual / Data Analysis Upgrade

## Preserved baseline
This package is an additive upgrade to the existing IGERS POWERCORE application. Existing panels, live-data modules, calculations, legal pages, Border Monitor, Salah/Qibla, Air Traffic, Seismic, Marine, Satellite and system controls are preserved.

## New UI capabilities
- Persistent **Day / Night mode** with browser/system preference on first load.
- Theme choice is stored locally as `igers-theme` and survives reloads.
- Subtle **3D depth / perspective interaction** on cards and major visual surfaces.
- Lightweight visual sheen and improved elevation for existing 3D panels.
- Respects `prefers-reduced-motion`.

## New Data Analysis panel
- **System Health** score is computed from existing system-state indicators.
- **Nominal stream count** and **degraded/fallback count** are derived from current UI states.
- Source-health matrix covers Time, Weather, Environment, Earthquake, Air Traffic, Satellite, Border and Energy.
- Trend graph is a visual history model derived from the current system-health score; it is explicitly labelled as modelled and does not represent fabricated sensor telemetry.
- Refresh timestamp is local browser time.

## QA
- JavaScript syntax: PASS for all app JS files.
- Duplicate HTML IDs: none.
- Missing local HTML script/link references: none.
- Bangladesh fallback GeoJSON: valid FeatureCollection with one feature.
- New theme button and analytics section present.
- New CSS/JS resources return HTTP 200 from a local static server.

## Browser verification note
The execution environment's Chromium process was unable to complete a reliable headless graphical session and timed out. Source/static checks and HTTP resource checks were therefore used as the authoritative QA for this visual-only additive layer. Existing external provider limitations remain unchanged.
