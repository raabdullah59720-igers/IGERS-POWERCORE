# IGERS-BD-01 Visual Polish v2 · QA note

Date: 2026-10-14

This is an additive visual/UX update on top of the Visual Admin v1 release. It does not remove or replace existing concept, monitoring, engineering, language, magazine, 3D visualization, or admin-control panels.

## Changes
- Reduced the global perspective-floor canvas opacity so foreground text, dashboards, and cards remain more readable.
- Added sticky-navigation-aware scroll offsets measured from the actual responsive navigation height. This reduces deep-link and in-app panel headers being tucked underneath the header.
- Made the admin locked state explicit in the DOM and changed disabled master/machine controls to a subdued, unmistakably disabled appearance.
- Improved phone-size machine-control button legibility and narrow-screen fallback.
- Added a consistent keyboard `:focus-visible` ring and global reduced-motion handling.

## QA boundaries
- Static HTML IDs/navigation destinations and local asset references are checked by the release builder.
- JavaScript syntax and the existing calculation, defensive-module, and Visual Command Deck/Admin regression tests run during build.
- This browser environment blocks navigation to local/file URLs, so a true live GitHub Pages visual test is not claimed. A local-only HTML/CSS render preview is used for visual inspection, and external live-data feeds remain unverified here.
- Admin Machine Control remains a browser-only prototype; it does not actuate physical equipment or replace a secure server-side authentication system.
