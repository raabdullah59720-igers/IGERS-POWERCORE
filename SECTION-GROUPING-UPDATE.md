# IGERS POWERCORE · Section Navigation Update

## Purpose
Organize the existing dashboard without removing/rebuilding its modules. Related destinations are grouped into six expandable categories:

1. **Overview**: Home, concept, energy sources, energy journey, applications, deployment, inventor, engineering limits.
2. **Environment & Live Data**: environment, weather, live time, earthquake/seismic, marine/coastal, Salah/Qibla.
3. **Air & Border Operations**: public air traffic, 3D flight monitor/runway simulation, airspace safety, early warning, border monitor.
4. **Infrastructure & Network**: Sentinel Grid, toll intelligence, satellite monitor, Google 3D map, tower mesh.
5. **Energy & System Control**: energy calculator, IGERS 3D lab, data analysis, system control.
6. **Safety & Support**: emergency center, comments/customer care.

## Compatibility measures
- Existing section IDs used by the original navigation are retained. All 30 current section anchors are present in the navigation and resolve to matching HTML IDs.
- `section-navigation.js` provides keyboard-friendly category handling, mobile open/close, Escape-to-close, and closes the selected category after navigation.
- The six current categories explicitly cover all 30 section elements present in this version. Future dynamically injected sections must be given a matching navigation entry when introduced; the current controller does not auto-classify arbitrary future links.
- Asset URLs and the service-worker revision were bumped to help clients pick up the new navigation after GitHub Pages completes deployment.
- All existing page sections, calculations, module scripts, legal pages, PWA files, boundary data and runway simulation assets were preserved.

## Verification
- 445 HTML IDs after wiring the live copyright year; no duplicates.
- Six category groups and all static navigation anchor targets resolve. The master-system ON/OFF buttons are now connected to the existing administrator-session gate.
- 82 standalone `.js` files passed `node --check` across source and Android bundle.
- 13 inline scripts passed `node --check`; five CSS files and 15 embedded style blocks parsed without syntax errors.
- Web manifest and Bangladesh GeoJSON parse; local HTML asset references resolve.
- Android launch-kit structural validator: 36/36 checks passed after synchronizing the bundle.

A complete Chromium visual/interaction test and Android APK compilation were not available in this environment. The Android Launch Kit therefore contains source and an auto-build workflow, not a precompiled APK.
