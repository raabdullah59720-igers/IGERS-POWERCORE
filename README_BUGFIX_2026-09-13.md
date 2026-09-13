# IGERS-BD-01 Bug-Fix Audit — 13 September 2026

Fixed / hardened:
- Browser location detection with safe Dhaka fallback.
- Weather and environment feeds now use the active location coordinates.
- Weather timezone uses the active location (`auto`) instead of always forcing Dhaka.
- Added manual “Use my location” control and clear location/feed status.
- Removed the unused Leaflet CDN reference with a mismatched integrity value.
- Added a dependency-free local server and Windows `START-IGERS.bat` launcher.
- Preserved earthquake, notification, live time, weather, environment, and air-traffic sections.
- Preserved all original images/assets and project identity.

Run locally:
1. Double-click `START-IGERS.bat`.
2. The browser opens at `http://127.0.0.1:4173/`.
3. Allow location permission to use current browser coordinates; otherwise Dhaka fallback remains active.

Note: live external feeds still require internet access and can be unavailable when their public providers are down or browser/network policy blocks them.

## Legal / privacy hardening — 13 September 2026
- Added public `copyright.html`, `privacy.html` and `terms.html` pages.
- Added legal links and copyright line to the main site footer.
- Added a project-specific proprietary notice in `LICENSE` so the bundled Apache-2.0 template license is no longer presented as the project license.
- Privacy notice documents browser geolocation, functional localStorage, notifications and current external live-data providers.
- Terms page explicitly distinguishes conceptual/illustrative engineering information from certified or measured performance and limits reliance on live feeds for safety-critical decisions.
