# IGERS POWERCORE V5 — Dynamic Recovery Model Isolation QA

Date: 2026-10-11

## Root cause found

The deployed `igers-compact-bundle.css` included a legacy emergency rule that forced `#energyLiveUpdate` to `display:block!important` and even overrode the HTML `hidden` state. That rule had higher selector priority than the app-shell's generic section-hiding selectors, so the Dynamic Recovery Model section could remain visible while users were on the dashboard, a workspace, or another panel.

## Fix applied

- Scoped the emergency `#energyLiveUpdate` visibility safeguard to `body:not(.igers-app-shell)` in both `igers-compact-bundle.css` (the deployed stylesheet) and `time-energy-repair.css` (source stylesheet).
- Added higher-specificity app-shell rules so `#energyLiveUpdate` is hidden on the dashboard and workspace screens, and hidden in panel view unless it has `data-igers-active-panel="true"`.
- Added an explicit active-panel rule so the recovery model displays normally when its own panel is selected.
- Updated app-shell CSS/JS cache query strings and the service-worker revision to prevent stale V4 code from being treated as V5.
- Did not remove or rewrite the recovery calculator, its existing inputs, calculations, engine controls, or other top-level panels.

## Automated verification

- Browser integration fixture using the production `igers-compact-bundle.css`, `app-shell.css`, `app-shell.js`, original navigation groups and main-panel markup, plus `time-energy-repair.js`: **39/39 tests passed**.
- All **34 canonical panel destinations** checked; the energy model was hidden on every unrelated destination and visible on its own `energyLiveUpdate` route.
- Dashboard and Energy workspace states: Dynamic Recovery Model hidden.
- Model own panel: visible exactly once; Back returns to the workspace with the model hidden.
- Dynamic title source/DOM occurrence checked: one instance.
- Browser page exceptions in this integration fixture: 0.
- JavaScript syntax: **49/49 runtime JS files passed** `node --check`.
- HTML ID audit: 752 IDs, zero duplicate IDs in the static HTML.
- Missing local `src`/`href`/`poster` references in production HTML: 0.
- Existing top-level app sections: 34 retained.
- Production static build succeeded.

## Test scope / limitations

The browser regression fixture executed the actual app-shell and energy-repair modules with the production CSS and the original app navigation/main markup. It isolates the route/CSS problem under test; it is not a full external-provider certification. External weather, satellite, aircraft, and earthquake feeds depend on their individual providers and were not retested as part of this CSS fix.
