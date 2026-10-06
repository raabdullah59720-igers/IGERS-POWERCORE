IGERS POWERCORE — GitHub Pages deployment hardening — 2026-10-06

This package contains index.html with the visual/theme CSS and upgrade JavaScript inlined into the page.
The default theme is NIGHT. The Day/Night control remains available.

Why this build exists:
- avoids GitHub Pages/browser cache problems for the visual/theme layer
- avoids dependence on separate theme/3D CSS/JS files for first paint
- preserves existing local modules and data assets

Deploy:
1. Extract this ZIP.
2. Replace the repository root files with these files, especially index.html.
3. Keep the data/ folder and any existing assets.
4. Commit/push to the GitHub Pages source branch.
5. Open the Pages URL with a hard refresh (Ctrl+Shift+R) once.

Note: public live APIs still require the user's browser/network and may show LIVE/VERIFY/OFFLINE states honestly.
