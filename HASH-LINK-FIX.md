# IGERS hash/deep-link fix

Direct links such as `#satelliteIntel` now use a resilient hash router and delayed scroll handler.

Examples:
- `#satelliteIntel` → Satellite Intelligence
- `#satellite` → Satellite Intelligence
- `#danger` → Bangladesh hazard monitor
- `#towers` → Mobile tower monitoring
- `#monitor` → IGERS command center

The page also adds scroll-margin for the sticky header and bumps the service-worker cache to avoid stale navigation code.
