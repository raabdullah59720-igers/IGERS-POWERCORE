# IGERS POWERCORE Safe Additive Upgrade · 2026-10-12

## বাংলা ইনস্টলেশন
এই ZIP-টি **overlay patch**। এতে কোনো delete operation নেই; পুরোনো app-এর unrelated files সরানো হবে না। সবচেয়ে নিরাপদ পদ্ধতি:

1. GitHub repository-এর বর্তমান branch-এর ZIP backup/download করে রাখো অথবা নতুন backup branch তৈরি করো।
2. এই ZIP extract করো। ফাইলগুলো সরাসরি repository root-এ upload করো; ZIP বা parent folder-কে একক ফাইল হিসেবে upload করো না।
3. একই নামের ফাইলগুলো replace করতে বললে এই patch-এর `index.html`, `app-shell.css`, `app-shell.js`, `sw.js` replace করো। নতুন `.js`, `.css`, `authorized-ground-gateway/`, `data/` এবং concept visual assets যোগ হবে। অন্য পুরোনো file delete করবে না।
4. Commit করো; GitHub Pages deployment শেষ হলে app খুলে Ctrl+F5 চাপো।
5. প্রথমে Dashboard, তারপর Library/Magazine, Weather, Earthquake, Air Traffic, Tower, Energy, System Control, Thesis 3D Lab এবং Live Concept Application Silo একে একে খুলে দেখো। কোনো সমস্যা হলে backup branch-এ ফিরে যাওয়া যাবে।

## What this patch preserves
- Starts from the user-supplied `IGERS-POWERCORE-main (16).zip` baseline.
- No old files are deleted. The static HTML page contains the same 754 existing IDs as the baseline, with zero duplicate IDs; feature sections were not removed.
- Existing original panel scripts/styles and the magazine PDF are not overwritten by this patch unless listed among overlay files.
- `index.html` intentionally includes current dashboard, authorized-feed integration and concept silo registrations.

## Fixes included
- Added a 2.5-second fail-open guard for the startup visibility gate, so a failed app-shell initialization cannot keep legacy app sections hidden indefinitely.
- Bumped cache-busting URL versions for updated shell/dashboard CSS and JS.
- Dashboard **Refresh feeds** now retries the authorized ground feed as well as public weather, earthquake and ADS-B data.
- A failed initial public ADS-B fallback can be retried after manual refresh or the browser returns online.
- Dashboard host initialization has a 4-second retry cap, avoiding an endless timer loop if the host never appears.
- Service-worker revision updated; this worker does not cache stale app assets.
- Added 11 concept scene visuals and the Live Conceptual Application Silo with calculations labeled as estimates, not sensor telemetry.

## Real-data boundary
Ground traffic/CCTV requires an authorized operator/agency endpoint behind private authentication. The public `authorized-feed-config.js` stays blank; never place passwords, tokens, RTSP URLs or API secrets in GitHub Pages files. Energy/storage readings stay unconnected until supported by physical meter/API data.

## QA scope
- ZIP integrity verified.
- All modified/new browser JavaScript passes `node --check`.
- Existing calculation regression test passes.
- All local HTML references resolve against the full merged source tree.
- Baseline top-level section IDs were retained (754/754, no duplicates).
- A full browser end-to-end run could not be confirmed in this container. One pre-existing Python test also refers to a missing `browser-smoke/index.html` fixture; it is unrelated to dashboard runtime and is reported in QA.
