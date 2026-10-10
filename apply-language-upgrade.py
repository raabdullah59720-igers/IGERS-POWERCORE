#!/usr/bin/env python3
"""Safely apply the IGERS Japanese/Urdu/Vietnamese overlay to a language-enabled app.

The patch aborts before writing anything unless it can identify the existing language
selector/runtime and all eight legacy language labels in active source files.
Usage: python apply-language-upgrade.py --app /path/to/IGERS-POWERCORE [--source /path/to/overlay]
"""
from __future__ import annotations
import argparse, hashlib, re, shutil, sys
from pathlib import Path

VERSION = "20261010-ja-ur-vi-3"
ADDON_FILES = ("igers-language-addon.js", "igers-language-addon.css")
ACTIVE_SUFFIXES = {".html", ".js", ".jsx", ".mjs", ".json", ".css"}
SKIP_DIRS = {".git", "node_modules", "dist", "build", "magazine", ".next", "coverage", "test", "tests", "browser-smoke", "fixtures", "upgrade", "upgrades", "language-overlay", "language-overlays", ".igers-language-backups"}
LEGACY_LABELS = {
    "English": r"\bEnglish\b",
    "Bangla": r"\bBangla\b|\bBengali\b|বাংলা",
    "Hindi": r"\bHindi\b|हिन्दी|हिंदी",
    "Arabic": r"\bArabic\b|العربية",
    "Chinese": r"\bChinese\b|中文|简体中文",
    "Spanish": r"\bSpanish\b|Español",
    "French": r"\bFrench\b|Français",
    "Russian": r"\bRussian\b|Русский",
}

def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()

def source_files(root: Path):
    for p in root.rglob("*"):
        if not p.is_file() or p.suffix.lower() not in ACTIVE_SUFFIXES:
            continue
        rel_parts = p.relative_to(root).parts
        if any(part in SKIP_DIRS for part in rel_parts):
            continue
        if p.stat().st_size <= 5_000_000:
            yield p

def fail_reasons(root: Path):
    reasons = []
    index = root / "index.html"
    sw = root / "sw.js"
    if not index.is_file(): return ["index.html was not found at the app root."]
    if not sw.is_file(): reasons.append("sw.js was not found; this patch expects the existing PWA layout.")
    texts = []
    for p in source_files(root):
        try: texts.append((p, p.read_text(encoding="utf-8", errors="ignore")))
        except OSError: pass
    aggregate = "\n".join(t for _, t in texts)
    idx = index.read_text(encoding="utf-8", errors="ignore")
    selector_found = bool(re.search(r"igersLanguageSelect|data-language-selector|language.{0,60}select|select.{0,60}language", aggregate, re.I))
    runtime_found = bool(re.search(r"window\s*\.\s*IGERSLanguage|\bIGERSLanguage\b|i18n(?:\.js|\s*[-.]|\s*runtime)|i18next", aggregate, re.I))
    if not selector_found:
        reasons.append("the existing language selector was not detected.")
    if not runtime_found:
        reasons.append("the existing i18n/IGERSLanguage runtime was not detected.")
    missing = [name for name, pat in LEGACY_LABELS.items() if not re.search(pat, aggregate, re.I)]
    if missing:
        reasons.append("legacy language labels could not be verified: " + ", ".join(missing) + ".")
    if "</head>" not in idx.lower() or "</body>" not in idx.lower():
        reasons.append("index.html does not have the expected closing head/body tags.")
    if not re.search(r"<html\b", idx, re.I):
        reasons.append("index.html does not look like an HTML application entry point.")
    return reasons

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--app", required=True, help="Existing IGERS app source directory")
    parser.add_argument("--source", default=str(Path(__file__).resolve().parent), help="Overlay asset directory")
    args = parser.parse_args()
    root = Path(args.app).expanduser().resolve()
    source = Path(args.source).expanduser().resolve()
    if not root.is_dir():
        print(f"SAFE STOP: app directory does not exist: {root}", file=sys.stderr); return 2
    missing_assets = [n for n in ADDON_FILES if not (source / n).is_file()]
    if missing_assets:
        print("SAFE STOP: overlay asset(s) missing: " + ", ".join(missing_assets), file=sys.stderr); return 2
    reasons = fail_reasons(root)
    if reasons:
        print("SAFE STOP: no files were changed. This source does not prove it contains the existing 8-language runtime needed for a non-destructive merge.", file=sys.stderr)
        for r in reasons: print(" - " + r, file=sys.stderr)
        print("Use the exact current language-enabled repository source, not a stale ZIP snapshot.", file=sys.stderr)
        return 3

    index = root / "index.html"
    original = index.read_text(encoding="utf-8")
    updated = original
    css_tag = f'<link rel="stylesheet" href="./igers-language-addon.css?v={VERSION}">'
    js_tag = f'<script src="./igers-language-addon.js?v={VERSION}"></script>'
    if "igers-language-addon.css" not in updated:
        updated = re.sub(r"</head\s*>", "  " + css_tag + "\n</head>", updated, count=1, flags=re.I)
    if "igers-language-addon.js" not in updated:
        updated = re.sub(r"</body\s*>", "  " + js_tag + "\n</body>", updated, count=1, flags=re.I)
    if updated == original:
        print("Already applied: index.html already references this language add-on; no duplicate tags added.")
        return 0

    backup_dir = root / ".igers-language-backups"
    backup_dir.mkdir(exist_ok=True)
    backup = backup_dir / f"index.html.before-{VERSION}.bak"
    if not backup.exists(): shutil.copy2(index, backup)
    # Backup any same-named prior add-on assets before replacing them.
    for name in ADDON_FILES:
        target = root / name
        if target.exists():
            b = backup_dir / f"{name}.before-{VERSION}.bak"
            if not b.exists(): shutil.copy2(target, b)
        shutil.copy2(source / name, target)
    index.write_text(updated, encoding="utf-8")
    print("Applied language-only overlay.")
    print("Changed: index.html (two integration tags) and the two add-on assets only.")
    print("Existing app scripts, CSS, panel code, service worker and translations were not edited.")
    print(f"Backup: {backup}")
    print("Next: run your regular build/tests, then test all 11 options on the deployed site.")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
