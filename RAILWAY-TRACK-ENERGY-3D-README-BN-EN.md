# IGERS POWERCORE — Railway Live 3D Energy Recovery (v6)

## v6 bug fixes
- Corrected recovery-pad geometry in the 2D fallback so the pad top touches the underside of the sleeper rather than overlapping it.
- Corrected WebGL pad/sleeper contact alignment during compression; the upper face remains in contact with the deflecting sleeper.
- Reset now avoids immediately re-crediting an in-flight wheel/pad contact.
- Session energy counters reset when valid energy assumptions change; invalid energy inputs suppress Wh output instead of leaving a stale cumulative estimate visible.
- WebGL rendering now suspends while off-screen or the browser tab is hidden, stops its continuous frame loop when paused, and renders once after input/camera changes. GPU render errors stop retrying each frame and leave the 2D fallback available.
- HTML asset query strings and service-worker revision are bumped consistently to v6.

## What the Railway panel does
- Self-contained WebGL 1 perspective scene when a working WebGL context is available; no CDN or downloaded 3D model required.
- Coloured locomotive and three passenger coaches, rotating wheels, steel rails, sleepers, ballast, clips, four concept harvesting pads, cables, converter, storage battery and wayside sensor.
- Drag-to-rotate perspective; arrow keys while canvas-focused.
- Pads compress/highlight on simulated wheel contact; cyan energy pulses travel to converter/storage.
- Separate orange wheel–rail slip heat/spark effect. Friction loss is not counted as recovered electrical energy.
- Close-up cutaway shows wheel → steel rail → sleeper → pad → rectifier/storage alongside separate wheel–rail friction-loss view.
- Canvas-based 2D fallback is retained when WebGL is unavailable or fails.

## Scenario energy calculator
`E_pass = Wh_available/pass/module × conversion_efficiency`

`E_day = E_pass × passages/day/module × module_count × system_availability`

`E_year (kWh) = E_day (Wh) × operating_days/year ÷ 1,000`

Defaults: 5 Wh assumed mechanical input/pass/module × 35% conversion efficiency = 1.75 Wh/pass/module. With 40 passages/day/module, four modules, 90% assumed availability and 365 operating days, estimated output is **252 Wh/day, 91.98 kWh/year and 10.50 W annualized average**. These are editable scenario assumptions, not measured railway generation.

## Wheel–rail slip-loss model
`F_t (kN) = μ × N (kN) × tangential-force utilization`

`v_slip (m/s) = train_speed (km/h) ÷ 3.6 × slip_ratio`

`P_loss (kW) = F_t (kN) × v_slip (m/s)`

`E_loss/contact (J) = F_t (kN) × 1,000 × slip_ratio × assumed_contact_length (m)`

Illustrative contact length is 0.50 m. Defaults yield 6 kN tangential force, 1.20 kW slip-loss power, 30 J/contact and 25 ms at 72 km/h. This is a simplified slip-dissipation scenario, not calibrated wheel/rail-contact or rolling-resistance analysis.

## Deploy
Extract the complete Deploy ZIP and upload the root-level files to the GitHub Pages repository, replacing same-named files while retaining unrelated app files. The `index.html`, `railway-track-energy.js`, `railway-track-webgl.js`, `sw.js`, and Railway CSS query references must be from the same v6 deployment package. Do not upload Deploy ZIP and Patch ZIP together. Hard-refresh the site after the commit.

## QA truth
Node syntax checks, HTML/hash/local-asset checks, mock-DOM calculator/control regression tests, mocked-WebGL control-flow/draw-call tests, and ZIP integrity passed. Native GPU pixel rendering and the published GitHub Pages site were not verified: headless Chromium timed out even on a simple test page in this environment. Mocked WebGL verifies code flow and draw calls, not actual on-screen pixels.

## Engineering boundary
No real train, track-load sensor or battery telemetry is connected. Pad deformation is illustrative and does not predict rail deflection, fatigue life, fastener loading or actual Wh. This is not a validated digital twin, finite-element model or operational railway simulator. Do not attach hardware to active railway infrastructure without railway-authority approval and professional structural/fatigue/signalling/electrical safety validation.
