# IGERS-BD-01 Professional Upgrade Release — 2026-09-22

This release is additive. Existing IGERS panels, live-data modules, legal pages, graphics and project identity are preserved.

## New panels
- IGERS Command Center: core integrity scan, system status, event console, refresh, JSON snapshot export.
- Engineering Lab: hydro/flow recovery conceptual power and energy estimator.
- Engineering Lab: roadside solar harvesting conceptual estimator.
- System-flow visualization: source → recover → convert → store → apply.
- Analytics & Research Library: validation pathway and measured/estimated/live data distinction.
- New navigation entries for Command Center, Engineering Lab and Analytics.
- Dependency-free implementation for GitHub Pages performance.

## Deployment
- `index.html` remains at repository root.
- `.nojekyll` remains present.
- The custom `CNAME` file is intentionally absent so this release can use the GitHub project-page URL directly.
- Existing live-data APIs remain independent from the new panels.

## Engineering note
The new calculators are conceptual estimation tools. They do not represent measured field performance. Future measured/experimental data can be connected without changing the UI architecture.
