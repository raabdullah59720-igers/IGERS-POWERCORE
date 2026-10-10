# IGERS POWERCORE Language-only Upgrade · QA report

**Build date:** 10 October 2026  
**Patch revision:** `20261010-ja-ur-vi-3`  
**Scope:** Japanese, Urdu and Vietnamese only. No panel, calculation, admin feature or base service-worker rewrite.

## Results completed in this workspace

- Original Library baseline ZIP integrity: **PASS** (83 entries, no corrupt member).
- Original Library baseline `npm run build`: **PASS** through the included `build.mjs` offline/static production build path.
- Static production HTTP smoke test: **9/9 PASS** for `index.html`, `sw.js`, manifest, SVG/PNG icons, `app.js`, `script.js`, and `nasa-intel.js`.
- Language dictionary coverage: **PASS**; at least 180 curated source phrase keys, each with Japanese/Urdu/Vietnamese values.
- Add-on static tests: **10/10 PASS**.
- Guarded patcher test suite: **3/3 PASS**, covering apply/idempotence with a matching language-enabled fixture, safe-stop/no-write behavior without a language runtime, and protection against a bundled test fixture falsely satisfying the source preflight.
- `node --check igers-language-addon.js`: **PASS**.
- ZIP integrity and internal SHA-256 file checks: **PASS**.
- Legacy file preservation behavior: the patcher only inserts two versioned asset references into `index.html` and copies the two add-on assets. The existing JS/CSS panels, calculations, service worker and original language dictionaries are not replaced; the `index.html` backup is saved before modification.

## Critical source mismatch found

The newest complete application ZIP available in the Library is `IGERS-POWERCORE-ULTIMATE-FRESH-2026-10-06.zip`. Its active HTML/JS/JSX/CSS files do **not** contain the previously described `i18n.js`, `window.IGERSLanguage`, `igersLanguageSelect`, or the eight legacy language options. It therefore is not demonstrably the right source package for a non-destructive merge of the three new locales into the prior eight.

For that reason, this deliverable is a **guarded language-only overlay**, not a re-packed replacement application. Running the supplied patcher against the currently available Library baseline correctly stops before writing any file. It will only apply to the actual language-enabled source tree once the existing selector/runtime and legacy language labels are present.

## Not claimed / not completed

- Chromium headless browser navigation timed out before returning a DOM; the browser did not reach the local smoke fixture. Therefore a real Chromium UI/interaction run is **BLOCKED / NOT VERIFIED**.
- Native-speaker linguistic review has not been performed.
- The patch is not deployed to the live GitHub Pages site, and the live app's behavior after deployment has not been verified.
- Absolute/“1000%” translation accuracy or zero risk cannot honestly be guaranteed.

## Safe apply command

```bash
python apply-language-upgrade.py --app /path/to/current/IGERS-POWERCORE --source /path/to/extracted/language-overlay
```

The patcher uses a fail-closed preflight. If the expected existing eight-language selector/runtime cannot be verified, it exits with `SAFE STOP` and does not edit the application.
