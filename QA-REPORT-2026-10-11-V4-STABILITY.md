# IGERS POWERCORE — V4 Interface Stability QA

**Date:** 2026-10-11  
**Baseline:** `IGERS-POWERCORE-main (14).zip`  
**App-shell version:** 2.1.0  
**Release:** V4 stability pass

## Findings fixed

1. **Panel isolation leak:** the original `#energyLiveUpdate` visibility safeguard forced that top-level section to `display:block!important`. The app-shell's generic panel-hiding selector could not override the legacy ID selector, so that section could remain visible while another panel was open. V4 adds a specific state-aware rule; it remains visible when it is the active panel and hidden otherwise.
2. **Header duplication / mobile height:** the old navbar brand duplicated the app-shell brand. The legacy brand is now suppressed while app-shell mode is active; dashboard/workspace branding stays clickable. The utility header is compact and responsive.
3. **Fast-navigation churn:** panel reveals previously emitted two global resize events. V4 debounces the resize notification to one delayed event, reducing redundant recalculation when switching quickly among modules.
4. **Cache identity:** updated app-shell CSS/JS query versions and service-worker revision so browsers can detect the stability patch.

## Source preservation

- Baseline files: **223**.
- Baseline files missing from the V4 source: **0**.
- Three new source/runtime files: `app-shell.css`, `app-shell.js`, `data/bangladesh-boundary-fallback.geojson`.
- Five existing files changed for integration/attribution: `build.mjs`, `copyright.html`, `index.html`, `sw.js`, `system-master-control.js`.
- All **34 original top-level sections** remain in `index.html`.

## Browser UI regression

**Result: 18/18 passed**, using the complete original HTML DOM and production CSS with the V4 app-shell JavaScript. The other legacy runtime scripts and external provider iframes were omitted in this focused fixture to isolate the app-shell behavior.

Checks covered:

- Seven workspaces and 34 unique canonical destinations.
- No duplicate HTML IDs after dynamic dashboard injection.
- One visible section on dashboard/workspace views and one active section in panel view.
- Every one of the 34 canonical destinations isolates its intended original section under the production CSS cascade.
- Workspace → panel → Back to workspace → Back to dashboard.
- Browser Back and Forward restoration.
- Direct in-app hash routing and safe Back behavior for direct-entry links.
- Global search keyboard shortcut (`Ctrl+K`).
- No horizontal overflow at 320, 360, 390, 430, 768, 820, 1024, 1366 or 1440 px.
- Zero page exceptions in the focused browser fixture.

## Static/build regression

**Result: 17/17 passed.**

- Offline production build succeeded.
- 49 external JS files and 13 inline script blocks passed syntax checks.
- Nine deployed CSS files parsed without syntax errors.
- 752 static HTML IDs; zero duplicates.
- Zero broken in-page anchors.
- All 22 direct local references resolved.
- All local CSS URL assets, manifest icons and fallback GeoJSON were present/valid.
- ChatGPT AI-assistance acknowledgement and non-endorsement wording preserved.
- Deployment package integrity and file count verified after packaging.

## Scope and limitations

These tests certify the V4 shell, navigation, CSS panel isolation and static package wiring; they are **not** a live-provider or full feature-by-feature runtime certification of every original module. Weather, aircraft, earthquake, NASA, mapping and other external services were not certified for current-data freshness. Availability remains dependent on the provider/network/browser/API configuration. The generalized Bangladesh GeoJSON fallback is for visualization only, not official border or navigation data.

## Release decision

**PASS for app-shell interface/navigation stability release.** Validate external feeds and individual original modules on the published GitHub Pages deployment as a separate acceptance step.
