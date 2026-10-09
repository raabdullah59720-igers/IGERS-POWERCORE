# IGERS-BD-01 · POWERCORE

**Integrated Gradient-Based Energy Recovery and Storage System**

Inventor & Author: Abdullah Al Rafi [BD]  
Concept / Invention Date: 14 August 2026

This is a static-first, GitHub Pages-compatible engineering dashboard. All pre-existing project modules are retained. The navigation now groups related panels into six expandable categories (Overview; Environment & Live Data; Air & Border Operations; Infrastructure & Network; Energy & System Control; Safety & Support). The SYSTEM MASTER CONTROL ON/OFF buttons are wired to the existing admin-session flags and update a local UI simulation status only; they do not control physical hardware or interrupt live public-data feeds. Existing section IDs and feature handlers remain in place; the update changes navigation organization, styling, and mobile menu behavior rather than deleting panel functionality.

## Navigation / section grouping

- The same six categories organize the existing section destinations so related modules sit together.
- The theme toggle remains available. On mobile, use the navigation button to open/close the groups; select a category and then a panel.
- The browser cache-busting versions and service-worker revision have been bumped for this update. GitHub Pages still needs to finish deployment after commit; a frontend cannot make the hosting deployment instant.

## Admin master state

The `SYSTEM MASTER CONTROL` ON/OFF buttons are wired to the existing administrator session gate. They persist a **local prototype UI state** only; they do not stop public-data refreshes or actuate physical hardware. Unauthenticated clicks do not change state and guide the operator to the existing admin gate.

## Deploy to GitHub Pages

1. Download and extract this ZIP. The archive stores project files directly at its root, including `index.html`.
2. Upload all extracted files and the `data` folder to the root of the existing `IGERS-POWERCORE` repository. Do not put them inside an extra nested project folder. `index.html` must remain at the repository root.
3. In GitHub, open **Settings → Pages** and confirm the existing source branch/folder that serves the site.
4. Commit the uploaded files. GitHub Pages publishes automatically from the currently configured source; wait until its deployment finishes. The service worker checks for a new build on load and every 60 seconds while the app is open, then reloads a previously controlled page when the new worker activates. Versioned CSS/JS/manifest URLs also help bypass stale asset caches. A hard refresh (**Ctrl+F5**) is still a useful first check after replacing the package. GitHub Pages deployment/CDN propagation itself cannot be made instantaneous by frontend code.

## Data honesty

- Border fallback geometry and river strokes are bundled low-resolution geography for offline visualization only. The UI still attempts a public geoBoundaries boundary first/alongside its fallback. Do not use the fallback as legal, cadastral, surveying, or operational boundary data.
- Air traffic is read-only public ADS-B data when Airplanes.live can be reached. No fictional aircraft are added. Provider coverage may be incomplete and observations may be stale.
- Virtual border/ground nodes and radar sweeps are labelled simulation/illustration and do not imply access to private telecom networks, national surveillance infrastructure, military radar, or physical systems.
- The NASA GIBS panel reports tile success/failure counts and bounded date retries. Satellite imagery is not live spacecraft telemetry. Live endpoint verification was blocked in the packaging environment by unavailable DNS/network access; verify the tile panel after deployment.
- Browser-side admin locks remain prototype UI restrictions only, not production authentication.

## File-count and historical sources

The package is kept below the requested 98-file maximum. Historical Markdown/text reports are consolidated into `PROJECT-DOCUMENTATION-ARCHIVE.md`; source CSS files are preserved in `STYLES-SOURCE-ARCHIVE.css`. `index.html` continues to use its existing `igers-compact-bundle.css` and inline scripts, with `design-standard.css` loaded afterward for visual consistency. The unused nested ZIP was removed to avoid shipping a second copy of the application inside the repository.

The off-line boundary fallback is in `data/bangladesh-boundary-fallback.geojson`. It carries per-feature source/accuracy metadata. For the current authoritative boundary, verify geoBoundaries availability and attribution before promoting that source to the live layer.
