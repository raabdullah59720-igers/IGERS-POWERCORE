# IGERS POWERCORE Visual + Admin Upgrade

Release: `2026-10-14-visual-admin-v2`

## Additive changes

- Added **Visual Command Deck** as a separate navigation destination. It contains a responsive, original SVG system map for solar, airflow, hydraulic and transport recovery; conversion; storage; and end-use.
- The energy-flow animation can be paused/resumed, architecture nodes can be selected for engineering notes, and the scenario calculator lets the visitor edit assumed source power, local load and storage capacity.
- All sample values are labelled as illustrative scenario inputs. They are not live readings, guaranteed yield, measured efficiency, or actual battery telemetry.
- Added **Admin Machine Control** as a separate panel. It displays eight conceptual machine modules, per-module ON/AUTO/OFF state, master prototype commands, an emergency-stop simulation, and a browser-local activity log.
- The new admin panel delegates authentication to the existing IGERS admin gate instead of creating a second hard-coded password value. Password management has not been changed because the desired replacement password has not been supplied.
- Added responsive styles scoped to the two new panels, including keyboard focus behavior, mobile layout, day/night-theme support, and reduced-motion handling.
- Added direct navigation links so the existing app-shell workspace discovers both new panels. Cache-busting query strings and the service-worker release marker were bumped to encourage clients to load the new release.

## Important control and security boundary

This remains a GitHub Pages/static browser prototype. Password checks already present in the legacy app are client-side and are not production-grade security. The new panel does not actuate physical machines. The ON/OFF/AUTO commands update local prototype state only, and emergency stop is a UI simulation. Real operation requires server-side authentication, authorization, command validation, authenticated controller communications, feedback telemetry, fail-safe design and an independently implemented physical safety circuit.

## Verification performed

- `node --check` passed on all top-level JavaScript files.
- Parsed `index.html`: no duplicate IDs were found.
- All local HTML `src`/`href` references resolved in the source tree.
- All navigation hash targets exist, including `#visualCommandDeck` and `#adminMachineControl`.
- Both new panels are direct children of `<main>`, so the dynamic app shell can register them as independent panel destinations.
- A headless browser smoke test was attempted, but the execution environment blocked navigation to local HTTP/file URLs (`ERR_BLOCKED_BY_ADMINISTRATOR`). Browser rendering, GitHub Pages deployment and third-party live-data behavior are therefore **not** marked as verified.

## Deploy

1. Extract the upgrade ZIP.
2. Upload the *contents* of `IGERS-POWERCORE-main/` to the root of the existing GitHub repository, overwriting same-named files. Keep the two new assets beside `index.html`.
3. Commit the changes and verify the GitHub Actions workflow (if configured) finishes successfully.
4. Open `https://raabdullah59720-igers.github.io/IGERS-POWERCORE/` and do a hard refresh (`Ctrl+Shift+R`).
5. From the app dashboard, open **Command & Lab**, then **Visual Command Deck** or **Admin Machine Control**.

For real cross-device admin security or hardware control, do not rely on a browser-only static login. Add a secure backend/controller gateway before connecting equipment.


## Visual polish v2

- Softened the global perspective-floor background so it supports the content instead of competing with charts and panel text.
- Added sticky-navigation-aware scroll padding and dynamic navigation-height measurement to reduce anchor-navigation overlap.
- Made disabled master controls visually unmistakable while Admin is locked.
- Improved mobile machine-control button legibility, compact panel-header branding and narrow-screen back-button spacing.
- Added consistent keyboard focus indication and reduced-motion handling in the additive visual layer.
- Runtime UI smoke-tested in an isolated Chromium `set_content` harness at desktop and mobile viewport sizes, including workspace navigation, scenario calculation, motion toggle, locked/unlocked states, and master ON state. The test harness mocked the legacy administrator gate; it does not verify production authentication. GitHub Pages and external live feeds remain unverified from this environment.
