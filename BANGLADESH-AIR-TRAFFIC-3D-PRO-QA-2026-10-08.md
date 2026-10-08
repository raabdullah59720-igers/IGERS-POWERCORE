# Bangladesh Air Traffic 3D Professional QA

Date: 2026-10-08

- Bangladesh-footprint-only live rendering preserved.
- Live provider health indicators added for authorized relay, Airplanes.live and OpenSky.
- Last-update time, request latency, received/accepted/filtered counts added.
- Target observation age shown in the live list and selected-flight detail.
- Canvas resize/reallocation fixed: dimensions update only when container size or DPR changes, avoiding per-frame canvas resets.
- No synthetic aircraft positions are generated.
- Service Worker cache bumped to v20 to avoid stale GitHub Pages shell/assets.
