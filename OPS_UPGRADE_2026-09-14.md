# IGERS-BD-01 — Integrated Operations Upgrade — 14 September 2026

## Added
- Integrated communications/operations layer for authorised Bangabandhu-1/BSCL backhaul workflows.
- Field-energy ledger for Road, Border, Naval, Bridge and Dam prototype harvesters.
- Maintenance/condition panel with explicit prototype status.
- Bangladesh road-intelligence map workspace with satellite/aerial and traffic-provider launch controls.
- Freshness-aware data-trust language: LIVE / STALE / SIMULATED / OFFLINE.

## Engineering honesty
Bangabandhu-1 is a communications satellite. This frontend does not claim direct satellite control, spacecraft telemetry, or exclusive access to a satellite link. A real operational deployment requires an authorised BSCL/service-provider gateway, secure backend ingestion, authentication, field-node telemetry and appropriate network licensing.

The prototype energy values in the dashboard are simulation values until signed field telemetry is connected.

The embedded Bangladesh map is a conventional basemap. Satellite imagery is not represented as inherently live. Dynamic traffic requires an authorised traffic-data provider; Google documents Traffic Layer availability in Bangladesh. Street-level imagery and live traffic remain provider-controlled services.

## Validation
- JavaScript syntax: PASS
- Production build: PASS
- Duplicate HTML IDs: 0
- Static HTTP smoke tests: PASS (/, privacy.html, terms.html, copyright.html, sw.js)
- Existing air traffic / earthquake / airspace-safety IDs preserved
- Existing weather/location paths preserved
