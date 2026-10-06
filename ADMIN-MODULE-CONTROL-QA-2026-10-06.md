# IGERS POWERCORE — ADMIN MODULE CONTROL QA — 2026-10-06

## Added
- Administrator-gated software module controls inside the Air/Ground/Maritime early-warning panel.
- Local ON/OFF controls for Radar Scan, ADS-B feed, Satellite View, and Alert Engine.
- Coverage visualization control, alert test, acknowledge, reset, and local-state dispose/clear.
- 15-minute administrator inactivity auto-lock retained.
- Service-worker cache bumped to v10.

## Safety boundary
These controls operate only the browser-side monitoring/visualization/data-state modules. They do not control weapons, interceptors, target assignment, fire-control, jamming, or remote military infrastructure. “Dispose local monitor state” clears browser-local state only.

## QA
- Inline JavaScript blocks: 13
- Inline JS syntax errors: 0
- Duplicate HTML IDs: 0
- Required admin/module-control IDs: present
- Existing panel files: preserved; upgrade is additive to index.html plus service-worker cache version.
