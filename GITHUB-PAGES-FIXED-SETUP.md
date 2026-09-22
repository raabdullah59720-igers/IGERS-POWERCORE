# IGERS-BD-01 — GitHub Pages Fixed Release

This package is prepared for direct GitHub Pages project hosting.

## Important
- `index.html` is at the repository root.
- `.nojekyll` is included.
- All website assets are kept with relative paths so the project works under:
  `https://raabdullah59720-igers.github.io/IGERS-POWERCORE/`
- The previous `CNAME` file for `igersbdr.com` has intentionally been removed from this GitHub-safe release. This avoids a broken/misconfigured custom-domain setup from interfering with the normal GitHub Pages URL.
- If `igersbdr.com` is later configured correctly in GitHub Pages + DNS, a `CNAME` file containing only `igersbdr.com` can be restored.

## Upload
Upload the CONTENTS of this folder to the root of the `IGERS-POWERCORE` repository, not the outer ZIP folder.

GitHub:
1. Open the repository.
2. Upload/replace the files in the repository root.
3. Commit to the branch used by Pages.
4. Settings → Pages → Deploy from a branch → select that branch and `/ (root)`.
5. Wait for the Pages deployment to finish.
6. Open the project URL.

## Local QA performed
- JavaScript syntax checked successfully for all project JS files.
- Root `index.html` served successfully through a local HTTP server.
- Relative asset references were checked.
- Existing project assets/features were preserved.

This is a static GitHub Pages release. Server-side files in the source package are not required for GitHub Pages.
