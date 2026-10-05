# IGERS POWERCORE: Danger Alert + App Install Fix

Build: 2026.10.06-bdtower.2

## What was fixed
- PWA manifest now includes valid 192x192 and 512x512 PNG icons.
- GitHub Pages start URL and scope are `/IGERS-POWERCORE/`.
- Service-worker cache version was bumped and old IGERS caches are deleted on activation.
- Service worker skips cached navigation responses so new deployments are picked up.
- An in-app INSTALL APP button was added with Android/Chrome/Edge prompt support.
- iPhone/iPad fallback instructions are built into the UI.
- Danger/Threat alert engine explicitly shows `ENGINE ON · MONITORING` even when a public feed is degraded.
- A `Test alert channel` button lets the user verify the notification channel without claiming a real threat.
- Real public hazard severity is still data-driven from public feeds. No fabricated live danger is shown.

## GitHub Pages deployment
1. Extract this ZIP.
2. Upload the CONTENTS to the repository ROOT. Do not create an extra nested `IGERS-POWERCORE/` folder inside the repository.
3. Keep GitHub Pages source on GitHub Actions.
4. Open:
   https://raabdullah59720-igers.github.io/IGERS-POWERCORE/
5. Hard refresh once with Ctrl+Shift+R after deployment.

## Install the app
- Android Chrome/Edge: use `INSTALL APP` when the browser offers the prompt, or Browser menu -> Install app / Add to Home screen.
- iPhone/iPad Safari: Share -> Add to Home Screen.
- Installability requires the secure HTTPS GitHub Pages URL.

## Danger alert testing
Use `Test alert channel` inside the Bangladesh Satellite / Danger Monitor panel. This sends a developer/test notification only. A real DANGER state appears only when the public hazard/anomaly rules are met.
