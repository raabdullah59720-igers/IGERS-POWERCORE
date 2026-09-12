# IGERS-BD-01 upgrade package

- Fixed the missing Bangladesh flag overlay by actually loading the enhancer and using a local SVG asset with isolated layering.
- Kept the existing weather, time and Airplanes.live systems intact.
- Upgraded earthquake monitoring to a multi-source USGS + EMSC browser feed with timeout isolation, deduplication, visibility-aware polling and notification de-duplication.
- Satellite/remote-sensing note: satellites can support earthquake mapping/coseismic deformation analysis, but they are not a safe substitute for a primary real-time seismic warning feed. This package therefore does not falsely claim satellite-based instant earthquake prediction.
- Existing interface remains informational and is not an official Bangladesh earthquake warning service.
