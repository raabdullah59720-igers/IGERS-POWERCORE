# IGERS POWERCORE — Railway Live 3D Demo / Railway Track Energy Recovery (v4)

## What's included

- Coloured locomotive plus three coloured passenger cars moving on an isometric steel track.
- Four rail-pad visual indicators that pulse as wheel positions cross them.
- A cutaway mechanism view showing conceptual wheel load → rail/sleeper → transducer pad → rectifier/DC conditioner → buffer storage.
- A separate steel wheel–rail slip/heat-loss visualization. Dissipated friction/heat is never counted as recovered electricity.
- Editable speed, wheel load, adhesion, force utilization, relative slip and visual pad-compression inputs.
- The existing recovery calculator, daily/annual estimates, battery autonomy view, Pause/Resume and Reset controls.
- Invalid-input regression fixes: energy accumulation no longer uses stale calculator values; invalid friction parameters suppress stale force/loss values and heat visuals.
- OS/browser reduced-motion preference is identified as a static preview instead of falsely reporting a running animation.

## Recovery calculator

`E_day (Wh) = Wh_available/pass/module × conversion_efficiency × system_availability × passages/day/module × number_of_modules`

`E_year (kWh) = E_day (Wh) × operating_days/year ÷ 1,000`

Default scenario: 5 Wh mechanical input/pass/module × 35% conversion = 1.75 Wh electrical estimate/pass/module; × 40 passes/day × 4 modules × 90% availability = **252 Wh/day**. At 365 operating days, **91.98 kWh/year** and **10.50 W** annualized average power. These are assumption-based outputs, not field measurements.

## Wheel–rail slip-loss model

`F_t (kN) = μ × N (kN) × force_utilization`

`v_slip (m/s) = train_speed (km/h) ÷ 3.6 × slip_ratio`

`P_loss (kW) = F_t (kN) × v_slip (m/s)`

`E_loss/contact (J) = F_t (kN) × 1,000 × slip_ratio × assumed_contact_length (m)`

The assumed contact length is 0.50 m. Defaults yield 6 kN, 1.20 kW slip-loss power, 30 J/contact and 25 ms at 72 km/h. At 2% slip, loss rises to 2.40 kW and 60 J/contact. This is a simplified illustrative slip-dissipation case, not a calibrated rolling-resistance or wheel/rail contact model.

## Model limitations

The visuals are animated canvas drawings with isometric/cross-section presentation, not full WebGL geometry, finite-element analysis or a validated digital twin. Track spacing and train travel distance are illustrative. The pad-compression slider changes visual stroke but does not independently predict electrical Wh. No live railway telemetry or physical sensors are connected.

## Run / deploy

- Complete Deploy ZIP: 52 static runtime files + 3 documentation files = **55 root-level files**, under the stated 98-file upload target.
- Extract and upload the root-level contents beside `index.html` in the GitHub Pages repository. Replace same-named files from the matching `IGERS-POWERCORE-main (17).zip` baseline; retain unrelated files.
- Patch ZIP is only for overlaying that matching source baseline, not a standalone app. Do not upload both ZIPs together.
- CSS/JS query versions and service-worker revision were bumped to v4 to help browsers fetch the updated code.

## QA status

The production builder, 14 external JavaScript syntax checks, 13 inline script syntax checks, 10 CSS parser checks, 843 unique HTML IDs, local asset references, mocked canvas/control/calculation smoke tests, and ZIP integrity passed. Full real-browser end-to-end rendering was not verified: headless Chromium timed out at startup in this environment. GitHub Pages publication has not been externally checked.

Before any physical rail deployment, obtain railway-authority approval and complete qualified review of track geometry, axle load, fatigue, fasteners/sleepers, vibration, signalling compatibility, electrical isolation and maintenance access.
