# Toll National QA — 2026-10-08

Baseline: IGERS-POWERCORE-main (10).zip
Baseline IDs: 353
New IDs: 374
Baseline IDs removed: 0
New Toll IDs added: 21

QA:
- JS syntax: PASS for all project JS modules
- Python relay py_compile: PASS
- Toll runtime simulation stub: PASS
- Toll event bridge runtime (`igers:vehicle-flow`): PASS
- Duplicate IDs: 0
- Missing local references: 0
- Local HTTP smoke: PASS (index, Toll JS/CSS, SW, manifest, Python relay, launcher)
- ZIP integrity: PASS

Official data references:
- RHD Traffic Insight Hub supports 1st 24-hour, 2nd 24-hour and 48-hour report generation.
- RHD Online Road Network publishes source-verified toll-plaza LRP/location records used in this module.
- BBA public site is linked for bridge/tunnel toll authority reference.

Live-data rule: the module marks data LIVE only when a public or operator-authorized feed actually returns values. No private CCTV or protected system is bypassed.
