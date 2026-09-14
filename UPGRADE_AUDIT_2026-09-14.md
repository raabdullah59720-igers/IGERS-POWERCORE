# IGERS POWERCORE Live Systems Upgrade Audit — 2026-09-14

## Baseline preserved
- Live Air Traffic / ADS-B module remains in place.
- Earthquake alert system remains multi-source (USGS + EMSC).
- Bangabandhu-1 satellite connection monitor remains isolated from Air Traffic and Airspace Safety.
- Bangladesh Airspace Anomaly Monitor remains a separate public-data heuristic layer.
- Weather, location, privacy, terms, copyright and the rest of the IGERS interface are preserved.

## Accuracy / efficiency changes
### Air Traffic
- Live status is now freshness-aware instead of treating any successful HTTP response as LIVE.
- `<=45 s` newest position: LIVE.
- `46–120 s`: DEGRADED.
- `>120 s`: STALE.
- Feed outage: OFFLINE.
- Status explicitly identifies Airplanes.live as the provider.

### Earthquake
- USGS feed `metadata.generated` is used for source freshness when available.
- `<=3 min`: LIVE / freshness verified.
- `3–10 min`: DEGRADED.
- `>10 min`: STALE.
- If both sources are unreachable: OFFLINE and no alert is inferred.
- USGS + EMSC remain separate sources and are deduplicated for display.

### Satellite
- CelesTrak GP data remains on a low-cadence refresh aligned with the provider's published 2-hour GP update interval.
- The indicator now describes the dataset as CURRENT/STALE rather than pretending it is spacecraft telemetry.
- Orbit-element epoch age is used for freshness.
- Official BMD satellite/radar navigation is surfaced without fabricating a BMD machine-readable feed.

### Airspace Anomaly Monitor
- Adds public emergency transponder-code awareness (7700/7600/7500) as a notice.
- Raises the speed outlier threshold and requires stronger combined conditions before an unverified high-altitude target becomes a higher-severity outlier.
- The module continues to state that ADS-B public data cannot confirm hostile, stealth or hypersonic objects.
- Feed failure never creates a danger notice.

## Local QA
- `npm run build`: PASS
- JavaScript syntax checks: PASS
- Duplicate HTML IDs: 0
- HTTP smoke tests: `/`, `/privacy.html`, `/copyright.html`, `/terms.html`, `/manifest.webmanifest`, `/sw.js` => HTTP 200
- Required production assets present: PASS

## External-source verification note
This build uses public providers whose current documentation was checked on 2026-09-14. The isolated container used for packaging does not have outbound network access, so no claim is made that the live third-party APIs were successfully queried from inside the packaging runtime.
