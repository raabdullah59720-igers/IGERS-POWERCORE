# IGERS POWERCORE — Bangladesh Border Defensive Monitor

Additive module for the existing IGERS web app. The module provides a 3D Bangladesh ADM0 geographic view, public/authorized data status indicators, a read-only public ADS-B bridge, and an illustrative virtual border-network mesh.

## Geography
Primary boundary source: geoBoundaries `gbOpen` Bangladesh ADM0. The app attempts to load the current public geoBoundaries simplified GeoJSON in the browser. A bundled local fallback is included for offline continuity.

Boundary metadata: https://www.geoboundaries.org/api/current/gbOpen/BGD/ADM0/
Primary GeoJSON source referenced by the module: https://github.com/wmgeolab/geoBoundaries/raw/9469f09592ced973a3448cf66b6100b741b64c0d/releaseData/gbOpen/BGD/ADM0/geoBoundaries-BGD-ADM0_simplified.geojson

## Live data boundary
The panel can consume the existing IGERS Airplanes.live public ADS-B bridge already used by the app. It does not provide primary radar or military radar access.

## Network representation
The border gateway nodes are explicitly virtual/illustrative. They are not real mobile-operator tower locations and do not claim access to Grameenphone, Robi, Banglalink, Teletalk, BTRC, BGB, Bangladesh Armed Forces, or other protected networks.

## Safety
The panel is read-only and defensive. It provides detection/verification/status visualization and alerts only. It does not perform weapon control, automated engagement, jamming, interception, targeting, or tactical command.


## Dedicated Radar-Style Scanner
The Border panel now contains a separate scanner card with its own 3D-style sweep canvas, track counters, feed-age indicator and read-only public ADS-B track list. It is a radar-style visualization, not a military/primary radar feed.

## Salah / Qibla reliability
The Salah panel now renders a local solar-angle fallback immediately and then replaces it with the public AlAdhan result when reachable. This prevents a blank prayer grid when the external service is unavailable. AlAdhan documents the daily timings endpoints and calculation methods; the panel defaults to the Karachi/South-Asia reference method and clearly labels fallback mode when needed.

## Site-wide 3D presentation
A lightweight `global-3d.css` layer adds subtle perspective/depth, lighting and elevation effects to existing cards and visual containers without changing the existing information architecture or removing earlier features.
