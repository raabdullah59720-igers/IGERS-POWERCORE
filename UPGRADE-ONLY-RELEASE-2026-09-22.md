IGERS-BD-01 — Upgrade-Only Release
Date: 22 September 2026

This package preserves the existing IGERS website/application and adds a non-destructive presentation upgrade. No existing project files were removed.

Verified changes:
- Existing core script/main module hashes preserved.
- Added designer.css + designer.js presentation layer.
- Existing index.html, styles.css and package metadata updated only for the upgrade integration.
- No duplicate HTML IDs detected (143 IDs / 143 unique).
- Production build completed through the project's offline-safe build script.
- Local HTTP smoke test passed for /, /index.html, /privacy.html, /terms.html, /copyright.html and /manifest.webmanifest.

Important: live external providers (NASA/weather/ADS-B/etc.) remain dependent on their public network availability. The package does not fake external connectivity.
