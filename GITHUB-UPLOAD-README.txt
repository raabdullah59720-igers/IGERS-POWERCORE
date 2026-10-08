IGERS POWERCORE — FINAL BUGFIXED GITHUB PAGES PACKAGE

Extract this ZIP and upload the CONTENTS to the repository root. Keep index.html at the root.

This compact deployment includes the restored 3D Air Traffic, Vehicle Movement, Field Link, National Toll Plaza/individual 3D models, hourly seismographs, Chrome/PWA install/download handling, and the pre-existing app panels.

Live CCTV/toll/vehicle/ADS-B data requires a public or operator-authorized endpoint; unavailable feeds are not represented as live.


New in this build: Live Data / Live Feed / Result / 3D / Traffic Flow Center with independent panels and event bridges between Air Traffic, Vehicle Movement, and National Toll modules.


AIR TRAFFIC LIVE RELAY
======================
Optional local professional live mode:
  python airtraffic_live_relay.py
Then open:
  http://127.0.0.1:8765/

The relay fetches Airplanes.live server-side, filters to Bangladesh, and exposes /api/airtraffic.
The GitHub Pages build remains static and continues to use direct public-provider fallback.

Airplanes.live point endpoint is capped at 250 nautical miles; the web panel now uses 250 nm.
