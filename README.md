# IGERS Journal + Border Public-Data Status Panel

This package preserves the existing IGERS-BD-01 Engineering Journal/Magazine reader and adds a **separate Border Resilience Public-Data Status** panel.

## Added panel
- NASA GIBS NRT imagery reachability check (public Earth-observation service)
- SatNOGS public satellite-catalog connectivity check
- GDACS public disaster/hazard feed connectivity and recent-event list
- Live clock and 60-second status refresh
- Conservative **UNKNOWN / UNVERIFIED NOTICE** state when a public feed is unavailable or a higher-severity public disaster alert is seen
- External verification links to NASA Worldview, SatNOGS, and GDACS
- No military activity detection, targeting, interception, or classified-source access

## Important
GitHub Pages/browser CORS or network policy can prevent a live public API from being read. In that case the UI correctly shows RESTRICTED/VERIFY instead of pretending the feed is live.

## Integration
Use `border-status-integration-snippet.html` with the existing web app's asset paths.
The original journal panel files remain unchanged except for the new panel being mounted alongside them.


## QA / hardening pass
- Verified all packaged local assets are reachable from the standalone `index.html` path.
- JavaScript syntax checked for both panel modules.
- Fixed the SatNOGS status update bug that previously targeted a metric element instead of the actual status row.
- Added defensive DOM handling to the shared status renderer.
- Added a manual **Refresh status** control and prevented overlapping refresh requests.
- Preserved conservative behavior when browser CORS/network access prevents public-feed verification.
- Added `noopener noreferrer` to external verification links.
- PDF integrity checked: 44 pages, no embedded JavaScript, not encrypted, no parser-reported suspects.
- No `eval()`, `new Function()`, or `document.write()` usage found in the JavaScript modules.
- The live public-data endpoints still depend on the visitor's browser/network and may legitimately report RESTRICTED/VERIFY when external access is unavailable.
