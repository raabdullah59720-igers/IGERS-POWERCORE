# IGERS Live Engineering Indicators — ADD-ONLY — TESTED

This package is an isolated add-on. It does not replace the existing IGERS application and does not intentionally modify existing panels, APIs, localStorage, routes, or other application data.

## Install
Copy `igers-live-indicators/` into the existing repository root, then add before `</head>`:

```html
<link rel="stylesheet" href="./igers-live-indicators/igers-live-indicators.css">
<script src="./igers-live-indicators/igers-live-indicators.js" defer></script>
```

The 12 indicators are explicitly labelled **MODEL / DEMONSTRATION**. They are not claimed as sensor/API live measurements.

## Verification performed
- ZIP integrity check: PASS
- JavaScript syntax check: PASS
- Browser-style DOM runtime harness: PASS
- 12 indicator cards rendered: PASS
- Duplicate-load guard: PASS
- CSS root isolation / selector scoping: PASS
- No fetch / XHR / WebSocket / localStorage / sessionStorage calls: PASS
- Existing-app mutation through routes/history/location: NONE DETECTED

A headless Chromium run was attempted, but the execution environment's Chromium process did not terminate reliably; therefore the browser-harness result above is the runtime verification used for this isolated add-on. No application-source regression claim is made because the complete current IGERS site source is not included in this add-on package.
