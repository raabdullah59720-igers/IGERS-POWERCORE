# IGERS-BD-01 — Defensive Modular Workspace

Release: `2026-10-14-defensive-modules-v2`

## Why this workspace was added

An isolated navigation option is available as **08 · DEFENSIVE MODULAR PANELS**. It preserves the existing IGERS application, and it presents six independent panels with separate enable/disable controls. The visual system uses bundled CSS, an SVG dependency diagram, and a canvas radar-style animation; it has no external graphic runtime dependency.

## Included modules

1. **Perimeter & Event Awareness** — radar-style canvas scene with conspicuous local-demo labeling; echoes are illustrative markers, not observations from hardware.
2. **Sensor & Feed Health** — reads selected status labels and exposed data already present in the application. It does not independently confirm remote reachability; timestamps and source coverage should be checked in the original panel.
3. **Critical Infrastructure Resilience Grid** — power, telecom, transport, water and response nodes. Clicking a node cycles its browser-local scenario state through Available → Degraded → Outage. No real infrastructure is contacted or controlled.
4. **Hazard & Environmental Context** — shortcuts to the app's existing weather, seismic, marine and toll/road panels. A shortcut does not itself verify that the destination has current data.
5. **Backup Power Endurance** — first-order scenario model: `hours = battery_kWh × DoD × discharge_efficiency ÷ average_load_kW`. Input limits and validity checks are applied. It excludes aging, surge power, temperature derating, standby loads and recharge time.
6. **Incident Notes & Drill Log** — local-only notes with category/priority, JSON/CSV export and clear-with-confirmation. Entries remain in the current browser storage; no server, emergency authority or external system is contacted.

## State and privacy

Panel settings, manually entered infrastructure scenario states and incident notes are stored in browser `localStorage` under `igers.defmod.*` keys. They do not automatically sync to other devices or users. Report exports contain explicit local/demo boundaries. Avoid entering credentials, private personal information or sensitive operational details.

## Release validation

- `npm run build` passed from the project root.
- The production builder verified all direct local HTML references and ran the existing engineering-calculation regression suite.
- JavaScript syntax was checked for all external `.js` files and all 13 inline script blocks.
- HTML validation found no duplicate IDs, missing fragment destinations or missing local assets.
- Every display which is a simulation or local operator entry is labeled accordingly.

Browser-rendered smoke testing and deployment against the live GitHub Pages URL could not be completed in this execution environment. A successful package build is not proof that external feeds are live.


## v2 bugfix note (14 October 2026)

- Saved Radar `OFF` now stays off after reload; start-up no longer unconditionally re-starts its animation.
- Animation frame IDs are tracked so Pause and tab visibility handling cancel the currently scheduled frame.
- Backup-power input handler enforces min/max bounds and rejects blank values before recalculation.
- A dependency-free runtime regression harness exercises module boot, source list, battery recalculation/errors, infrastructure scenario cycle/reset, browser-local event save/export/clear, persistent OFF state and animation pause/resume.
- The prior application baseline's 844 HTML IDs remain present in the upgraded source.
