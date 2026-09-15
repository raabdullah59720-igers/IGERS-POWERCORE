# IGERS POWERCORE — Public Voicemail + Full Feature Audit

Date: 15 September 2026

## Base package
This build uses the IGERS-POWERCORE NASA GIBS live-indicator package as the base so existing live/environmental/satellite modules remain present.

## Added
- Public Voicemail recorder in the Comments / Care area.
- Maximum recording duration: 60 seconds.
- Browser preview, stop, discard and publish controls.
- Shared public feed through `/api/voicemails`.
- Public audio playback through `/api/voicemails/:id/audio`.
- MIME validation, 7 MB audio limit and basic per-connection rate limiting.
- Privacy/terms notes for public recordings.

## Existing feature verification
Verified in source package:
- IGERS-BD-01 identity and project title.
- Inventor / author: Abdullah Al Rafi [BD].
- Concept / invention date: 14 August 2026.
- Weather / Open-Meteo.
- Environmental and earthquake feeds.
- Air traffic / Airplanes.live.
- Airspace safety monitor.
- Satellite connection / Bangabandhu-1 public orbital-data context (NORAD 43463).
- NASA GIBS imagery and NASA GPM precipitation panel.
- Comments / Customer Care.
- Copyright / Privacy / Terms pages.

## QA checks
- `node build.mjs`: PASS.
- JavaScript syntax checks: PASS.
- Server syntax check: PASS.
- Duplicate HTML IDs: PASS (none found).
- Home-page HTTP smoke test: PASS.
- Voicemail GET feed: PASS.
- Voicemail POST/upload: PASS.
- Voicemail audio retrieval: PASS.
- Uploaded recording appears in shared feed: PASS.
- ZIP integrity test: PASS.

## Deployment note
Shared/public voicemail requires the included Node server (or an equivalent backend implementing the same API). A static-only hosting environment cannot persist cross-user voice recordings by itself.
