# IGERS Bangladesh Air Traffic — Final QA 2026-10-08

## Provider correction
- Airplanes.live `/point` radius corrected from 450 nm to **250 nm** (documented API maximum).
- 30-second browser refresh remains safely above the documented 1 request/second rate limit.
- Bangladesh geographic polygon filtering remains active before 3D rendering.

## Runtime hardening
- Optional same-origin Python relay: `/api/airtraffic`.
- Python relay uses standard library only.
- Per-target stale pruning retained; temporary upstream failures no longer wipe the entire target set prematurely.
- 3D canvas resize remains event/size driven rather than per animation frame.
- Service Worker cache bumped to v21.

## Tests
- Python relay self-test: PASS.
- Python relay `py_compile`: PASS.
- Air traffic JS `node --check`: PASS.
- Project local-script reference scan: PASS.
- Duplicate ID scan: PASS.
- ZIP integrity: PASS.
- Local `/api/health` smoke test: PASS.
- Live upstream availability in sandbox: NOT CERTIFIED because external DNS/network is unavailable in this environment.
