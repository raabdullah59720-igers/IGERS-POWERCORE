# IGERS Live Flag Theme — ADD-ONLY Update

## Purpose
Adds a subtle animated Bangladesh-flag visual theme behind the existing IGERS interface.

## Preservation
This package does NOT replace existing panels, modules, APIs, localStorage, routes, or application data. It creates one isolated layer with unique IDs/classes and pointer-events disabled. Remove this folder and its two HTML references to revert the visual update.

## Install
Copy `igers-live-flag/` into the existing IGERS app root and add before `</head>` in the existing `index.html`:

```html
<link rel="stylesheet" href="./igers-live-flag/igers-live-flag.css">
<script src="./igers-live-flag/igers-live-flag.js" defer></script>
```

## Checks performed
- JavaScript syntax check: PASS
- CSS/JS isolation checks: PASS
- No `fetch()` or `localStorage` usage in addon JS: PASS
- Duplicate-load guard present: PASS
- Reduced-motion support present: PASS
- ZIP integrity test: PASS

## Important
A full regression run of the complete existing IGERS website requires the current full website source. This addon has been tested in isolation and is intentionally non-destructive.
