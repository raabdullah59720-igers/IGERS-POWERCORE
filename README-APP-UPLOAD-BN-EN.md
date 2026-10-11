# IGERS POWERCORE Smart App V4 — Upload Guide

## বাংলা নির্দেশনা

এই ZIP-টি GitHub Pages-এর জন্য তৈরি। Extract করলে `index.html` root-এ থাকবে।

1. ZIP extract করো।
2. Extract করা সব ফাইল ও ফোল্ডার তোমার GitHub Pages repository-এর root-এ upload করো। শুধু ZIP-টি repository-তে রেখে দেবে না।
3. একই নামের ফাইল overwrite করো; অন্য অপ্রাসঙ্গিক repository ফাইল মুছে ফেলো না।
4. Commit/publish হওয়ার পর সাইট খুলে `Ctrl + Shift + R` দিয়ে hard refresh করো। পুরোনো version থাকলে DevTools → Application → Service Workers থেকে পুরোনো registration unregister করে আবার reload করা যেতে পারে।
5. Dashboard → workspace → panel → Back flow পরীক্ষা করো।

V4-তে dashboard header আরও compact করা হয়েছে, panel isolation-এর একটি CSS conflict ঠিক করা হয়েছে এবং দ্রুত navigation-এর সময়ে global resize event debounce করা হয়েছে। Existing feature source রাখা হয়েছে।

## English

This package is prepared for GitHub Pages. After extraction, `index.html` is at the package root.

1. Extract the ZIP.
2. Upload all extracted files and folders to the root of the existing GitHub Pages repository. Do not upload only the ZIP archive.
3. Replace files with matching names. Do not delete unrelated repository files.
4. After publishing, hard refresh with `Ctrl + Shift + R`. If an older service-worker version persists, unregister the old worker in DevTools → Application → Service Workers and reload.
5. Verify Dashboard → Workspace → Panel → Back.

V4 compacts the legacy header, fixes panel isolation against a legacy CSS override, and debounces layout refreshes during fast navigation. Existing source modules are retained.

## Notes

- The “ChatGPT” footer entry is an AI-assistance acknowledgement, not a statement of official partnership or endorsement.
- Live external feeds depend on their providers, connectivity, CORS and any required credentials. UI tests do not certify live-provider freshness.
