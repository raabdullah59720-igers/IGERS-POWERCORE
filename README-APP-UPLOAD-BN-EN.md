# IGERS POWERCORE Smart App V5 — Dynamic Recovery Model Fix

## বাংলা — আপলোডের নিয়ম

1. এই ZIP extract করো। ZIP-এর ভেতরে `index.html`, JavaScript/CSS ফাইল ও asset-সহ একটি project folder থাকবে।
2. ওই folder-এর **ভেতরের সব ফাইল ও ফোল্ডার** তোমার GitHub Pages repository-এর root-এ upload করো। `index.html` root-এ থাকতে হবে।
3. একই নামের ফাইল overwrite করো; অন্য unrelated repository files মুছে ফেলো না।
4. Deploy হওয়ার পরে Chrome-এ `Ctrl + Shift + R` দিয়ে hard refresh করো।

### V5-এ কী ঠিক হয়েছে

`Dynamic Recovery Model` section-কে জোর করে সবসময় দৃশ্যমান রাখার legacy CSS app-shell navigation-এর সঙ্গে সংঘর্ষ করছিল। এখন সেটি legacy mode-এ সীমাবদ্ধ, আর app-shell dashboard/workspace/অন্য panel-এ model-টি লুকিয়ে রাখে। শুধু `Energy Calculation` / `Dynamic Recovery Model` panel active থাকলে এটি দৃশ্যমান হয়। Original calculator content ও input fields রাখা হয়েছে।

## English — Upload instructions

1. Extract this ZIP.
2. Upload **the contents of the project folder** to the root of your GitHub Pages repository. Keep `index.html` at the repository root.
3. Overwrite same-name files; do not delete unrelated repository files.
4. After deployment, use **Ctrl + Shift + R** in Chrome to bypass the browser cache.

### V5 change

The legacy emergency CSS forced `#energyLiveUpdate` to remain visible and overrode app-shell panel isolation. The safeguard is now scoped to legacy mode. In the app shell, the Dynamic Recovery Model is hidden on the dashboard, workspace screen, and all unrelated panels, and shown only when its own panel is active. The original calculator inputs and content are retained.

See `QA-REPORT-2026-10-11-V5-DYNAMIC-RECOVERY.md` for test results and scope.
