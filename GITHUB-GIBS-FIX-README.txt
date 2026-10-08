IGERS POWERCORE — NASA GIBS / Bangladesh 3D Radar Fix

Extract the CONTENTS to the repository root, keeping index.html at root.

This build preserves the existing app and adds/fixes a direct NASA GIBS WMTS tile view inside the existing 3D Bangladesh Air/Ground/Maritime monitor. The original NASA Worldview iframe is retained as a separate public imagery option.

New direct GIBS panel:
- Bangladesh satellite imagery tile layer
- VIIRS SNPP / VIIRS NOAA-20 / MODIS Terra layer selection
- imagery-date fallback across recent dates
- tile load status
- zoom +/- and refresh controls
- existing radar-style scanner remains separate from imagery

Live sensor/air/ground/maritime values are only shown when the corresponding public/authorized data bridge provides them. Missing data is shown as VERIFY/OFFLINE rather than invented.
