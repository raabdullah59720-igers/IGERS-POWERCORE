# IGERS POWERCORE — Railway Track Energy Recovery (railway-v2)

This update does three things without replacing the existing app shell:

1. Adds a selectable railway concept scene to the existing **Thesis 3D Concept Lab**.
2. Adds the railway concept as concept card 12 in the **Live Concept Application Silo**.
3. Adds a separate **Railway Track Energy Recovery · 3D** panel with a locally animated isometric train/rail/harvester/converter/storage/sensor concept and an editable scenario calculator.

## Calculator model

`E_day = Wh available/pass/module × conversion efficiency × availability × train passages/day/module × number of modules`

`E_year = E_day × operating days/year ÷ 1,000`

The battery autonomy estimate uses editable battery nameplate capacity, usable depth of discharge, discharge efficiency and the selected load. Input validation flags empty/out-of-range values and requires whole-number train passages, modules and annual operating days.

With the release defaults, the illustrative scenario gives **1.75 Wh per active passage per module**, **252 Wh/day**, **91.98 kWh/year**, **10.50 W calendar-average power**, **10.1 equivalent hours/day at a 25 W load**, and **62.6 h of battery autonomy** for the stated battery assumptions.

These values are not measured performance. The 5 Wh mechanical-energy input is a placeholder that must be replaced by laboratory/field measurements at a tested harvesting interface. No railway data source or physical device is connected.

## Deployment ZIP

Use `IGERS-POWERCORE-RAILWAY-3D-DEPLOY.zip` for a compact static deployment package. Extract its contents directly into the GitHub Pages repository root—the directory from which `index.html` is served. Do not upload the ZIP as a single file or place its contents in a nested folder. The deployment package contains fewer than 98 root-level files. Keep unrelated repository files that are not part of the package.

## Patch ZIP

Use `IGERS-POWERCORE-RAILWAY-3D-PATCH.zip` to overlay the source project represented by the uploaded `IGERS-POWERCORE-main (17).zip`. Extract at the repository root and commit/replace the listed files. The patch ZIP is not a standalone app.

## Validation status

The static production build, JavaScript syntax checks, duplicate-ID audit, scene selectors, SVG/CSS validation, local-reference checks, mocked-DOM/canvas calculator/control smoke tests and ZIP integrity checks passed. A real-browser end-to-end test and live GitHub Pages run remain unverified because Chromium did not complete even a minimal screenshot test in the execution environment.

## Safety

The animation is a conceptual 3D-style schematic, not a physical or finite-element simulation. Do not attach devices to active rails, sleepers, fasteners, signalling or railway electrical systems without railway-authority approval and qualified engineering review, including fatigue, track geometry, vibration, isolation and operational safety checks.
