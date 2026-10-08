# IGERS POWERCORE — Live Data / Live Feed / Result / 3D / Traffic Flow QA
Date: 2026-10-08

## Fix scope
Added an independent output center with four separately rendered panels:
1. Live Feed Panel — provider-by-provider incoming observations.
2. Live Result Panel — normalized result table independent of canvases.
3. 3D Visualization Panel — separate 3D-style live-data rendering layer.
4. Traffic Flow Panel — independent vehicle-flow visualization.

## Data bridges fixed
- Air Traffic 3D now dispatches `igers:airtraffic` with normalized current observations so the existing advanced air, border, and new live-output modules can consume the same feed.
- Vehicle Movement Monitor now dispatches `igers:vehicle-flow` after each observed/authorized refresh.
- National Toll Plaza already dispatches `igers:toll-traffic`; the new center consumes that event directly.
- Service-worker cache was bumped from v17 to v18 and includes the new live-output assets.

## Providers
- Air: Airplanes.live public ADS-B API (browser fetch).
- Seismic: USGS all-hour GeoJSON feed.
- Weather: Open-Meteo current forecast endpoint for Dhaka.
- Road traffic: public/authorized vehicle-count or toll/ITS endpoint only; no private CCTV bypass and no fabricated national live count.

## Regression checks
- Baseline IDs: 419
- New-build IDs: 443
- Removed baseline IDs: 0
- Added IDs: 24 (new live-output center only)
- Sections: 34 -> 35
- Duplicate IDs: 0
- Local HTML/CSS/JS references missing: 0
- Inline JS syntax blocks checked: 13, failures: 0
- New external JS syntax: PASS
- ZIP integrity (`zip -T`): PASS
- Local HTTP smoke check: index.html + new JS/CSS + sw.js returned HTTP 200

## Runtime limitation
A full Chromium page-run was attempted in the build sandbox, but the environment blocks local `http://127.0.0.1` and `file://` navigation with `ERR_BLOCKED_BY_ADMINISTRATOR`. Therefore browser click-through/runtime provider connectivity cannot be honestly certified from this sandbox. The package is statically validated and the live providers remain explicitly labeled by actual fetch status in the browser.


## Regression repair applied
- Fixed missing runtime script tags for `field-connectivity-hardening.js` and `vehicle-movement-monitor.js`. Their CSS had been loaded, but the JavaScript runtime modules were not attached to `index.html`.
- Dependency order is now: Field Link → Vehicle Movement → Toll Plaza → PWA → Air Traffic 3D → Live Data/3D/Flow Center, so event bridges can initialize before asynchronous providers return.
- Service worker cache version bumped to v18 to prevent GitHub Pages from retaining the pre-fix shell.
