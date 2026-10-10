# IGERS-BD-01: Japanese + Urdu + Vietnamese · Language-only Upgrade

এই প্যাকেজটি শুধু ভাষা-সংক্রান্ত additive patch। এটি মূল app-এর panel, script, stylesheet, calculation, admin control, PWA service worker বা feature file প্রতিস্থাপন করে না। প্যাকেজে complete app ZIP নেই; কারণ Library-তে পাওয়া `IGERS-POWERCORE-ULTIMATE-FRESH-2026-10-06.zip`-এ পুরোনো আট-ভাষার selector/runtime শনাক্ত করা যায়নি। সেটিতে সরাসরি merge করলে আপনি যে পুরোনো ভাষাগুলো রাখতে বলেছেন তা থাকার প্রমাণ পাওয়া যাচ্ছে না।

## নতুন ভাষা
- Japanese — `ja` / 日本語
- Urdu — `ur` / اردو (RTL)
- Vietnamese — `vi` / Tiếng Việt

প্রতিটি ভাষায় ১৮৯টি curated UI phrase আছে। অচেনা dynamic/provider text, sensor/API data, identifiers, formulas, units ও numeric measurements অনুবাদ করে বদলানো হয় না।

## নিরাপদে merge করার নিয়ম
1. এই ZIP-টি **বর্তমান language-enabled IGERS repository source**-এর বাইরে আলাদা folder-এ extract করুন।
2. সেই source tree-তে `python apply-language-upgrade.py --app "C:\path\to\IGERS-POWERCORE" --source "C:\path\to\extracted\overlay"` চালান। Python 3 প্রয়োজন।
3. Patcher আগে পরীক্ষা করে existing language selector/runtime ও legacy eight language labels শনাক্ত করতে হবে। এগুলোর কোনোটি প্রমাণ করতে না পারলে এটি **কোনো app file পরিবর্তন না করে থেমে যায়**।
4. সফল হলে কেবল `index.html`-এ CSS/JS link যোগ করে এবং দুইটি নতুন add-on asset কপি করে। `index.html`-এর backup `.igers-language-backups/`-এ থাকে। `sw.js`-কে স্পর্শ করে না; নতুন versioned asset প্রথম load-এ network থেকে আসে এবং বিদ্যমান fetch handler runtime-এ cache করতে পারে।
5. Build/tests চালিয়ে deploy করুন। English, পুরোনো সাতটি non-English locale, Japanese, Urdu, Vietnamese এবং English-এ ফিরে আসা বাস্তব browser-এ যাচাই করুন।

## QA সত্যতা
- Base ZIP integrity: PASS; 83 archive entries.
- Base `npm run build`: PASS through `build.mjs` offline/static production path.
- Add-on automated static checks: 10/10 PASS.
- Add-on JavaScript syntax: PASS.
- Patch guard: stale base ZIP-এর ওপর চালালে expected SAFE STOP হয়, কারণ selector/runtime এবং পুরোনো language labels অনুপস্থিত; source-এ কোনো ফাইল পরিবর্তন হয় না।
- Full Chromium E2E and native-speaker review: NOT VERIFIED in this environment. “১০০০% ভুলহীন” অনুবাদ বা app-এর প্রতিটি feature browser-এ যাচাই হয়েছে, এমন দাবি করা হচ্ছে না।
