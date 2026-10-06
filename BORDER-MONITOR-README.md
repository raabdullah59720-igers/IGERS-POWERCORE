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
