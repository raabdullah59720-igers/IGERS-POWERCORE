# HDRSRI-01 Rules & Regulations — Bug Check Report

**Package:** `HDRSRI-01-RULES-REGULATIONS-GITHUB-PATCH.zip`  
**Test scope:** Standalone page and assets in this patch, not the unavailable original company website repository.

## Checks performed

| Check | Result | Notes |
|---|---|---|
| HTML parsing | PASS | Document parses and closes correctly. |
| Unique IDs | PASS | 12 IDs found; no duplicates. |
| Internal fragment links | PASS | 9 internal anchors; all matching targets exist. |
| Local CSS/JS paths | PASS | Both referenced assets exist inside the page folder. |
| JavaScript syntax | PASS | `node --check` succeeds. |
| CSS syntax | PASS | `tinycss2` reported no top-level parse errors. |
| Rule counts | PASS | 9 mandatory-rule cards and 4 institutional-change cards. |
| ZIP integrity | PASS | Re-tested after packaging; required files present. |
| Print rendering | PASS | Rendered to a 5-page A4 preview; key sections no longer split across pages. |
| Small-text contrast spot checks | PASS | Updated the rule labels, fine print, and footer text to meet a 4.5:1 contrast target against their intended light backgrounds. |

## Fixes made during this audit

1. Adjusted print layout to reduce the oversized title/overview area and prevent rule cards, the policy-change section, and application note from being awkwardly split between pages.
2. Added a page break before the mandatory-rules and policy-change sections, and kept the application note together for printing.
3. Darkened several small text colors: rule type labels, fine print, footer text, and the secondary footer brand label. These were too faint on light backgrounds in the first contrast spot-check.

## Important limits

- The original HDRSRI-01 homepage/source files were not included in this work session, so this patch does not merge or modify the existing navigation automatically.
- The Chromium headless visual check did not complete in this environment. The page was instead parsed and its print stylesheet rendered with WeasyPrint for a page-by-page visual check. This does not replace testing in Chrome, Firefox, and a real mobile browser.
- GitHub Pages publishing, repository permissions, custom-domain configuration, production cache behavior, and live URL routing are not testable from the ZIP alone. After upload, check the deployed path and the navigation link in the target repository.
- This is a proposed policy draft. It must be approved by the designated company authority and reviewed for applicable Bangladesh law before being presented as binding policy.
