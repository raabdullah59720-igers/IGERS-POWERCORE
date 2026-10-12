# IGERS-BD-01 · Real-data Command Dashboard Upgrade

Release: `2026-10-12-authorized-ground-v2`  
Package style: GitHub Pages static deployment; all files in this ZIP are intended for the repository root, except the preserved `data/` fallback boundary asset.

## What changed

- Replaced the generic first-open workspace landing view with a responsive, dark command-centre dashboard inspired by the provided visual reference.
- Preserved the existing IGERS app shell, original panel sections, language selector, time/weather/seismic systems, public ADS-B modules, concept lab, energy calculations, satellite monitor, magazine PDF and navigation history.
- Restored runtime dependencies that were missing from the prior compact bundle, including the original live-suite, border-monitor, energy, map, indicator and 3D support files.
- Added a geospatial view with an Esri satellite/aerial basemap, OpenStreetMap street basemap, NASA GIBS daily VIIRS Earth-observation option, and a local Bangladesh boundary fallback when it can be loaded.
- Added source-driven weather (Open-Meteo), past-day earthquake events (USGS GeoJSON), and public aircraft data using the existing shared Airplanes.live feed when available. A limited fallback request is used only if the existing shared feed has not initialized.
- Added visible source-health labels, provider timestamps/status and an explicit distinction between public observations, conceptual models, and physical telemetry.
- Added a **private authorized ground-feed connector** to the Border Traffic panel, plus `authorized-ground-gateway/` (Node.js 20, no third-party dependencies), an environment example, schema documentation, and a draft agency access request.
- The connector consumes only a read-only owner-approved HTTPS aggregate API. It exposes vehicle/queue/lane/camera *counts and status only*; it does not provide raw CCTV video, people tracking, camera discovery, or authentication bypass.
- Cache-busted the app shell, dashboard stylesheet/script, and service-worker release ID so the updated dashboard is less likely to be hidden by an old cached build.

## Important truth-in-data rules

- **Satellite imagery is not live border video.** Esri imagery tiles can have varying acquisition dates. NASA GIBS VIIRS true-colour imagery is daily Earth observation and can lag actual acquisition/processing. The dashboard labels both appropriately.
- **No public real-time ground-border traffic feed is connected in this package.** Vehicle queues, crossing counts, people counts, and CCTV are shown as not connected rather than fabricated. Connecting those requires an authorized agency/operator endpoint or camera/sensor plus permission, authentication, and a documented schema.
- **Public ADS-B aircraft data is not a ground traffic sensor or a physical radar return.** Aircraft counts only reflect the public provider response and its receiver coverage. The radar sweep graphic is decorative and explicitly described as such.
- **Energy recovered, battery state of charge, grid MW and CO₂ avoided are not real until instrumented.** The dashboard therefore leaves these as unavailable instead of reusing illustrative numbers from mockups. For hydraulic concepts, the reference formula is `P = η × ρ × g × Q × H`; it is only useful when flow `Q`, head `H`, density `ρ` and system efficiency `η` are measured/justified. It does not establish field output by itself.
- **Tower count is a historical project reference, not a live operator result.** Validate its reporting date and scope against the relevant BTRC publication before external/publication use.

## Public data / technical references

- NASA Global Imagery Browse Services (GIBS), access patterns and imagery date dimension: https://nasa-gibs.github.io/gibs-api-docs/access-basics/
- NASA Worldview: https://worldview.earthdata.nasa.gov/
- Open-Meteo API documentation: https://open-meteo.com/en/docs
- USGS Earthquake GeoJSON feeds: https://earthquake.usgs.gov/earthquakes/feed/v1.0/
- Airplanes.live API documentation: https://airplanes.live/api-docs/
- OpenStreetMap copyright / attribution: https://www.openstreetmap.org/copyright
- Esri service terms: https://www.esri.com/en-us/legal/terms/full-master-agreement
- Leaflet map library 1.9.4: https://leafletjs.com/reference.html

Review the current provider terms, traffic/caching rules, attribution requirements and licensing before using these public services in a commercial product. Open-Meteo's free service is for non-commercial use; a commercial deployment must use a properly licensed service plan or another provider. Review tile provider policies and expected request volume before scaling beyond a personal/demo deployment.

## GitHub Pages deployment

1. Download and extract the ZIP.
2. Upload the **contents** of the extracted folder to the root of the existing `IGERS-POWERCORE` repository. Do not upload the ZIP itself as one file.
3. Preserve repository Settings → Pages and the existing deployment branch/action. Do not delete Actions/workflows to perform this upgrade.
4. Commit the update. After the Pages deployment finishes, open the existing `github.io` URL and hard-refresh with `Ctrl+F5`.
5. If a service-worker-controlled install shows the prior build, close app tabs, reopen the hosted URL, and allow the updated service worker to activate. The service-worker revision was bumped for this release.
6. Check the Dashboard, Border Monitor, Satellite Monitor, Air Traffic, Earthquake, Weather, Energy Calculation, Tower Network, System Control and Magazine panels. Test the page on both desktop and mobile widths.

## Feed configuration needed for real border ground traffic / live energy

A production connection should document the provider and permission, endpoint URL, authentication method, allowed fields, update interval, rate limit, units, coordinate reference system, timestamp timezone, data retention and outage behaviour. Keep credentials on a trusted backend/proxy, not in client-side GitHub Pages source. Dashboard values should only become live after an authorized response is validated.


## Authorized ground-feed setup (new in this release)

The public GitHub Pages dashboard ships with `authorized-feed-config.js` intentionally blank. Keep it blank for public demos. To display restricted agency operational data, obtain written permission and an owner-issued API credential, deploy the dashboard and gateway on an agency-approved private origin behind SSO/VPN, then configure a same-origin reverse-proxy route to `/api/operations/status`. Store the upstream credential only in the private gateway's environment/secret manager. Do not put secret keys, passwords, RTSP URLs, or restricted data into GitHub. Full setup and accepted fields are documented in `AUTHORIZED-GROUND-FEED-INTEGRATION.md` and `authorized-ground-gateway/README.md`; an official-contact request letter template is provided in `GOVERNMENT-FEED-ACCESS-REQUEST-TEMPLATE.md`.

The ZIP cannot itself grant access to government or operator systems. The authorized data owner must approve and provision the actual connection. Until the endpoint responds with a validated schema, the app explicitly shows `NOT CONFIGURED` or `UNAVAILABLE`, rather than made-up live values.
