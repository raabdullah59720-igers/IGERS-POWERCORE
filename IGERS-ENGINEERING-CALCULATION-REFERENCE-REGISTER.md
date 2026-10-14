# IGERS-BD-01 Engineering Calculation Reference Register

Release: 2026-10-14-defensive-modules-v2

The shared calculation kernel is used by the main Energy Calculator, Unified Command Center, Concept Lab, Scenario Silo/Vault and Railway energy calculator. Results are user-input scenario estimates until prototype tests and field data are supplied.

| Model | Governing model | Thesis / design reference | Evidence requirement |
|---|---|---|---|
| Road harvesting | ΔKE = ½m(v₁²−v₂²); E_electric/event = E_mechanical-capture × η_chain − E_aux | *IGERS Master Energy & Revenue Analysis (2026)*, road reference case; *IGERS-BD-01 Full Thesis Presentation (2026)*, formula-sheet appendix | Capture kJ must be supported by measured force–displacement integral or calibrated energy measurement. Kinetic reduction is an upper ceiling, not a capture estimate.
| Corridor annualisation | E_year = Wh/event × AADT × length × points/km × operating days × availability / 1000 | Road base case in 2026 IGERS master analysis | Use AADT per point, map device count and availability explicitly; do not confuse passages/day with total events/year.
| Controlled hydraulic | P = ρgQHη; E_year = P × operating hours | 2026 IGERS hydraulic/turbine concept calculations | Measure flow, net head and overall efficiency; include seasonal restrictions, bypass and operating hours.
| River-current turbine | P = ½ρAv³Cpη; annual energy uses capacity factor | 2026 IGERS river-current scenario | Measure current-speed distribution, swept area, device loading and downtime; Cp must not exceed the Betz ideal limit for an unshrouded actuator disk.
| Solar PV — specific yield | E_year = kWp × net specific yield (kWh/kWp-year) | 2026 IGERS solar corridor case: 400 kWp/km × 1,400 kWh/kWp-year = 560 MWh/km-year | Replace yield with site-specific, orientation/shading/temperature/soiling-aware yield. Specific yield already includes annual irradiation and losses; do not multiply by PSH again.
| Solar PV — irradiance + PSH | P_instant = G × A × η_module × derate; E_year = A × η_module × derate × PSH × days, using the 1 kW/m² PSH reference | Standard dimensional conversion used by the app; consistent with the thesis solar assumptions | G is used for instantaneous power. If PSH is supplied as equivalent sun-hours, do not multiply annual PSH yield by G a second time.
| Battery autonomy | t = nominal kWh × usable DoD × discharge-path efficiency / average kW | 2026 IGERS storage sizing example: 1,000 kWh × 85% × 92% / 250 kW = 3.128 h | Use manufacturer usable capacity, BMS/temperature limits, discharge efficiency and a measured/defined load profile.
| Railway module energy | E_net/pass = assumed captured Wh/pass × electrical efficiency; annual totals use passes/day/module × modules × operating days × availability | 2026 IGERS rail conceptual example; rail visual is not telemetry | Enter captured mechanical/electrical energy with a clear boundary; test rail deflection/vibration and conversion losses. The animation is simulation only.
| FEAS footstep | W_mech = ∫F dx (approx. mean F × stroke); E_electric = W_mech × η | 2026 IGERS FEAS/footstep calculation concept; the master thesis also contains a separate 2 J usable-energy/event benchmark | Mean force × stroke is only an approximation; pressure/force curve, displacement, event count and conversion efficiency require measured prototype data. Keep the thesis 2 J usable/event benchmark separate from a force×stroke calculation.

## Reproduced numerical checks

- Road benchmark: 900 kg, 20 → 15 km/h gives a 6.07639 kJ kinetic-reduction ceiling. With a 2.0 kJ mechanical-capture assumption and 70% conversion, estimated output is 0.38889 Wh/event. 210,000 passages/day, 100 km, 1 point/km, 365 days and 100% availability yield **2.98083 GWh/year**. This equals 340.278 kW calendar-average power (annual energy divided by 8,760 hours).
- Controlled hydraulic: Q=1 m³/s, H=2 m, η=75% and ρ=1,000 kg/m³ → **14.710 kW**.
- River-current example: A=50 m², v=1.5 m/s, Cp=0.35, η=90% → **26.578 kW** rated estimate; 50% capacity factor → **116.4 MWh/year**.
- Solar corridor example: 400 kWp × 1,400 kWh/kWp-year → **560 MWh/km-year**.
- Battery example: 1,000 kWh × 85% DoD × 92% efficiency ÷ 250 kW → **3.128 h**.
- FEAS illustration: mean force 400 N × stroke 5 mm = 2 J mechanical/event; at 20% efficiency, 0.4 J electrical/event; 100,000 events/day × 365 days → **4.056 kWh/year**. The thesis's separate 2 J *usable electrical* benchmark gives **20.278 kWh/year**; those two scenarios are not interchangeable.

## Limitations

This register documents equations, units and thesis-sourced reference assumptions; it does not certify the concept or establish observed field output, financial viability, structural safety or actual net fuel savings. Report measured data separately from modeled estimates.
