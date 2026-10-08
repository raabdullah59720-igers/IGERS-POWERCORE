IGERS POWERCORE — National Toll Intelligence Update

Existing IGERS POWERCORE app preserved; 15-entry National Toll Intelligence module added as an independent panel.

Features:
- Individual 3D-style result/model for each source-verified RHD/BBA entry in the build.
- National toll-plaza map visualization.
- Separate plaza-by-plaza traffic-flow panel.
- Hourly national traffic seismograph stored locally from observed/authorized flow.
- Authorized Toll/ITS JSON feed support and event-bridge support (`igers:toll-traffic`, `igers:vehicle-flow`).
- CSV report download.
- Local Python same-origin relay at `/api/tollplazas` to reduce browser CORS problems.
- Explicit LIVE / REFERENCE / SIMULATION status. Simulation is never labeled live.

GitHub Pages: extract the ZIP and upload contents to repository root; keep index.html at root.

Python live mode: set IGERS_TOLL_FEED_URL to an operator-authorized JSON endpoint, run RUN-TOLL-LIVE-RELAY.bat, then open http://127.0.0.1:8765/.
