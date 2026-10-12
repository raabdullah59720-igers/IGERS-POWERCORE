# IGERS POWERCORE — Independent 11 Concept Visual Panel Fix (v4)

## What was fixed
Earlier fixes nested the silo inside `#concept3d`. The existing app shell groups links by their containing top-level `main > section`, so a nested anchor could be treated as an alias of the 3D Lab instead of a distinct panel. This release corrects that structural mistake:

- `#liveConceptSilo` is now its **own top-level `<section>` directly under `<main>`**, between `#concept3d` and `#tower3d`.
- The main navigation has its own `href="#liveConceptSilo"` entry, allowing app-shell to register it as an independent destination.
- The app-shell dashboard template contains a prominent **LIVE CONCEPTUAL APPLICATION SILO · 11 VISUALS** shortcut.
- `app-shell.js` is cache-busted to a new version and the service-worker revision is bumped.
- The panel markup and all 11 scene-card entries are directly in `index.html`; JavaScript activates interactions but does not create the panel itself.
- Existing application panels remain in the original `index.html`; this is a root-overlay patch, not a full-app replacement archive.

## Install in GitHub Pages
1. Download and extract this ZIP. All files are at the ZIP root.
2. Open the existing `IGERS-POWERCORE` repository root, where the current `index.html`, `app-shell.js`, `app-shell.css`, and `sw.js` already live.
3. Upload the **contents** of this ZIP directly to repository root. Do not upload the ZIP as a single file or keep the files in a nested folder.
4. Replace `index.html`, `app-shell.js`, and `sw.js`. Add `live-concept-application-silo.css` and `live-concept-application-silo.js`. Keep/add the 11 `thesis-concept-*` image assets. Do not delete unrelated app files. `app-shell.css` was not changed and is intentionally not included.
5. Commit and wait for the GitHub Pages deployment to complete.
6. Open `https://raabdullah59720-igers.github.io/IGERS-POWERCORE/#liveConceptSilo` and hard-refresh with `Ctrl+F5`. If using an installed PWA, close its windows completely and reopen the hosted URL.

## Verify the build served by GitHub Pages
Use View Page Source and search for:

`<meta name="igers-concept-silo-release" content="2026-10-12-independent-panel-v4">`

Then search for `id="liveConceptSilo"`, `class="lcs-card"` (11 occurrences), and `live-concept-application-silo.js?v=20261012-independent-panel-v4`.

If the release marker is absent, the page being served is not this build: check that you uploaded `index.html` to the actual Pages publishing branch/root, the deployment succeeded, and you are not looking at a stale installed PWA.

## Feature scope
The independent panel includes 11 selectable concept illustrations, a large visual preview, local animated energy-flow overlay, Play/Pause/Reset controls, editable road kinetic-energy/hydraulic/PV/battery scenario assumptions, formulas, and source references. “Live” in this panel means browser-local animation and calculation updates; it does not indicate physical sensor or generator telemetry. Concept images are not fabrication-ready designs.
