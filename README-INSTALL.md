# IGERS POWERCORE — ADDITIVE ENGINEERING MODULES
Version: 2026-09-23

This is an ADD-ONLY GitHub-ready upgrade package. It deliberately does not overwrite the existing IGERS app files.

## Included panels
1. Energy Command Center
2. Smart Road Energy Map
3. Harvester Performance Lab
4. Bridge & Flyover Energy
5. Solar + Mechanical Hybrid
6. Water Energy Recovery
7. Traffic-to-Energy Analytics
8. Noise & Vibration Reduction
9. Infrastructure Digital Twin
10. Asset Health & Predictive Maintenance
11. Cost / ROI / Payback Simulator
12. Environmental Impact
13. Smart City Energy Network
14. Prototype Simulation Lab
15. Research & Thesis Lab

## Installation into the existing GitHub Pages repository
Copy the `igers-addon` folder into the root of the existing IGERS repository. Then add these two lines to the existing `index.html` immediately before `</head>`:

<link rel="stylesheet" href="./igers-addon/igers-addon.css">
<script src="./igers-addon/igers-addon.js" defer></script>

Commit and push. Existing files remain untouched except for those two additive references.

## Compatibility design
- No framework dependency.
- No existing IDs/classes are reused intentionally.
- CSS is scoped under `#igers-additive-modules-root`.
- JavaScript has a guarded namespace flag.
- No existing DOM node is replaced.
- No existing localStorage key or API is modified.
- Removing the `igers-addon` folder and the two references restores the prior app.
- Panels are explicitly marked conceptual/scenario-based until verified live sources are connected.

## Important
This package is source-independent because the current GitHub source ZIP was not available in the working files. It is therefore an additive module pack, not a rebuilt copy of the full existing website.
