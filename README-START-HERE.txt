IGERS-BD-01 — SAFE GITHUB PAGES / ACTIONS REPAIR OVERLAY

IMPORTANT
This is the SAFE overlay package for an existing IGERS repository.
It is deliberately designed so your existing index.html and old web-app files are NOT replaced.

1. Extract this ZIP.
2. Copy the .github folder into the ROOT of your existing GitHub repository.
3. Copy the assets folder into the ROOT of the existing repository and allow the supplied IGERS journal/border panel files to overwrite the same-named files.
4. Keep your EXISTING index.html and all existing app files.
5. Make sure GitHub Pages -> Build and deployment -> Source is set to GitHub Actions.
6. Commit/push to main (or master), or run the workflow manually from Actions.

Why this matters:
The current repaired package contained no .github/workflows deployment workflow. If GitHub Pages was configured to deploy from Actions and that workflow was deleted, the existing app could remain in the repository while the Pages deployment stops.

This overlay restores the official Pages artifact/deploy flow without replacing your old app entry point.

The supplied journal/border assets are already QA-hardened and tested independently:
- JavaScript syntax passes.
- Browser smoke test passes with mocked public feeds.
- Journal TOC renders 21 entries.
- Next-page action works.
- Journal search filters correctly.
- Public status refresh is guarded against overlaps.
- Mobile layout has no horizontal document overflow in the test.
- External PDF link uses noopener noreferrer.
- No eval(), new Function(), or document.write().

If you intentionally want a standalone site made only from this package, use the separate STANDALONE package instead.
