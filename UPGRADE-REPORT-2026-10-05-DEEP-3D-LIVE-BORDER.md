# IGERS POWERCORE — Deep 3D Border Zone Additive Upgrade

Date: 5 October 2026

Baseline: `IGERS-POWERCORE-main (8).zip`

## Delivered

- Added separate `Border Zone 3D Ground + Air Monitor`.
- Added public NASA GIBS Earth-observation image layer.
- Added public ADS-B-derived air-state visualization by reusing the existing Air Traffic snapshot.
- Added non-identifying aggregate/demo mobile signal / coverage layer.
- Added 3D-style radar sweep, ground sectors, satellite link visualization and live health states.
- Added layer controls and satellite refresh control.
- Preserved the existing panels and modules.

## Refresh model

Local visuals use `requestAnimationFrame()` for continuous rendering. External data uses provider-safe schedules or existing module data rather than pretending that internet providers can be polled every nanosecond.

## Important engineering/data boundary

A website cannot legitimately access private mobile-phone locations, telecom subscriber data, military border radar or restricted security feeds without authorized infrastructure and credentials. This release therefore uses only public/authorized-safe data semantics and clearly labels simulation/aggregate layers.
