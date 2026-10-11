# IGERS POWERCORE — Smart App V2

**Release:** 2026-10-11 · App shell `2.0.0`

## বাংলা: GitHub Pages-এ আপলোড

এই সংস্করণে মূল অ্যাপের ওপর premium responsive dashboard, ৭টি workspace, unique panel list, global panel search এবং one-level Back navigation যোগ করা হয়েছে। এটি নতুন করে বানানো আলাদা অ্যাপ নয়—মূল `IGERS-POWERCORE-main (14).zip`-এর ওপর করা সংযোজন।

1. ZIP extract করুন। Extract করা ZIP-এর ভেতরের **সব ফাইল ও ফোল্ডার** repository-এর root-এ আপলোড করুন; `index.html` যেন root-এই থাকে।
2. একই নামের ফাইল overwrite করুন। Repository-এর অন্য কোনো অপ্রাসঙ্গিক ফাইল মুছবেন না।
3. GitHub → **Settings → Pages**-এ বর্তমান deployment configuration ঠিক থাকলে সেটি অপরিবর্তিত রাখুন। সাধারণ GitHub Pages setup হলে `main` branch এবং `/ (root)` ব্যবহার করুন।
4. Deployment শেষ হলে browser-এ hard refresh দিন: `Ctrl + Shift + R`। পুরোনো UI দেখালে site tab বন্ধ করে পুনরায় খুলুন, কারণ browser/service worker পুরোনো asset ধরে রাখতে পারে।

এই package-এ **৮৫টি ফাইল** আছে—এটি ১০০-ফাইলের upload সীমার নিচে। ZIP ফাইলটিকে repository-তে একা রেখে দিলে deploy হবে না; extract করা contents upload করতে হবে।

## নেভিগেশন

- Dashboard-এ ৭টি workspace আছে; workspace খুললে তার panel list দেখা যাবে।
- একই top-level panel একাধিক পুরোনো menu anchor-এ থাকলে সেটি একবারই দেখানো হয়। যেমন Concept-এর ভেতরের Thesis 3D Lab ও Footstep Energy (FEAS) alias একই card-এ group করা হয়েছে, এবং global search দিয়ে নির্দিষ্ট sub-view-এ যাওয়া যায়।
- **Back** প্যানেল থেকে আগের workspace বা আগের panel-এ ফেরে; workspace থেকে dashboard-এ ফেরে। Direct panel URL খুললে Back অ্যাপের dashboard-এ ফেরে। Browser Back/Forward-ও state restore করে।
- Dashboard finder-এ `Ctrl + K` (Mac-এ `Cmd + K`) চাপুন; `/`-ও finder focus করে।
- Language/theme controls রাখা হয়েছে। ছোট পর্দায় menu button চাপলে controls খুলবে।

## কী রাখা হয়েছে

- মূল HTML sections, IDs, panel content, JavaScript modules, calculations, map/monitor modules, settings controls, legal pages এবং access-gate code source-এ রাখা হয়েছে।
- Existing modules সরানো বা নতুন করে প্রতিস্থাপন করা হয়নি। App shell মূল section-গুলো hide/show ও navigation করে; source content মুছে না।
- Service-worker revision bump করা হয়েছে, যাতে নতুন UI cache refresh পায়।

## সীমাবদ্ধতা ও গুরুত্বপূর্ণ নোট

- Original archive-এর map fallback path-এ অনুপস্থিত থাকা `data/bangladesh-boundary-fallback.geojson` যোগ করা হয়েছে। এটি generalized Natural Earth 1:110m outline—শুধু broad visual context-এর জন্য; legal boundary, navigation বা operational decision-এর জন্য নয়।
- Live feeds প্রতিটি provider, network, CORS/API configuration এবং data freshness-এর ওপর নির্ভর করে। Dashboard-এর `INTERFACE READY` শুধু UI shell বোঝায়, সব external feed live—এমন দাবি নয়।
- Access gate client-side UI gate; এটি server-side authentication-এর বিকল্প নয়।
- পাশে দেওয়া পূর্ণ source backup: `IGERS-POWERCORE-FULL-SOURCE-V2-2026-10-11.zip`। QA details এই package-এর `QA-REPORT-2026-10-11.md`-এ আছে।

## English

Extract this ZIP and upload all contents into the root of your existing GitHub Pages repository (the `index.html` file must be at the repository root). Overwrite matching filenames, but do not delete unrelated repository files. Keep your existing Pages configuration and hard-refresh after deployment. This compact deploy ZIP contains 85 files. The full editable source backup is provided separately.
