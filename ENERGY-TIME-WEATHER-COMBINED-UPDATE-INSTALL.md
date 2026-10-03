# IGERS Combined Time + Weather + Live Energy Update

This package is an additive update to the existing IGERS-BD-01 web app.

## Included
- Existing IGERS application and preserved panels/features.
- Live Time / Weather update already integrated in the current baseline.
- New `IGERS ENERGY CALCULATION ENGINE` panel.
- Live recalculation when model inputs change.
- Admin-protected Energy Engine ON/OFF and Reset controls.
- Existing IGERS administrator password/session model is reused: `MIM2005`.

## Energy reference model
The default values reproduce the current illustrative roadway model:
- mass = 900 kg
- entry speed = 20 km/h
- exit speed = 15 km/h
- net recovery efficiency = 20%
- 100,000 harvesting locations
- 210,000 vehicle passages/year/location

The model uses `ΔE = 0.5 m (v1² - v2²)` and then applies the recovery factor. It is a planning/illustrative model, not measured field production.

## GitHub Pages
Upload/extract the package so `index.html` remains at the repository root. Keep all files and relative paths together.

## Security note
The password/session mechanism is suitable only for a static prototype UI. GitHub Pages cannot protect a secret like a production backend. Physical hardware control is not performed by this panel.
