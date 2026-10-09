# IGERS POWERCORE — GitHub Compact Package

This distribution is compacted to stay below GitHub's 100-file browser-upload limit while preserving the original project assets and documentation.

## Upload instructions

1. Extract `IGERS-POWERCORE-GITHUB-READY-2026-10-09.zip`.
2. Open the extracted `IGERS-POWERCORE-main` folder.
3. Upload the *contents of that folder* to the root of your existing GitHub Pages repository (not the outer folder itself).
4. Keep `index.html` at repository root and keep `data/bangladesh-boundary-fallback.geojson`, image/icon files, `sw.js`, `manifest.webmanifest`, and the original nested backup ZIP.
5. Do not rename `igers-compact-bundle.css`, `time-weather-update.css`, or `styles.css`; the app references them.
6. `PROJECT-DOCUMENTATION-COMPENDIUM.md` contains the full text of every original Markdown file, with source filenames and SHA-256 checksums.

## File consolidation

- Component/module CSS is combined in `igers-compact-bundle.css`. The original inline styles in `index.html` stay inline to preserve their cascade positions. The time/weather stylesheet remains separate because its JavaScript module loads it late, and `styles.css` remains for `main.jsx`'s import. A few unlinked, generic legacy themes are preserved inside the bundle but disabled so they do not unexpectedly override the existing website.
- Original Markdown reports are preserved in `PROJECT-DOCUMENTATION-COMPENDIUM.md`.
- Application JavaScript, HTML pages, Python relays/tests, imagery, icons, GeoJSON, JSON/configuration, and the original app ZIP are retained.

## Verification note

Static syntax, asset-path, archive-integrity, and compact file-count checks are performed on this package. Live provider availability still depends on external services, network policy, browser CORS, and provider rate limits; a static package check cannot guarantee every live feed is online.
