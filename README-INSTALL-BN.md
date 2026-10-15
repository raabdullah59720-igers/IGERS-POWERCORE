# HDRSRI-01 Rules & Regulations — GitHub Upgrade Patch

## এই প্যাকেজে কী আছে

- `hdrsri-rules/index.html` — Company Rules & Regulations-এর সম্পূর্ণ ওয়েবপেজ
- `hdrsri-rules/assets/hdrsri-rules.css` — Responsive layout, desktop/mobile styling এবং print styling
- `hdrsri-rules/assets/hdrsri-rules.js` — Print/Save PDF button এবং স্বয়ংক্রিয় footer year
- `NAV-LINK-SNIPPET.html` — বিদ্যমান ওয়েবসাইটের navigation menu-তে নতুন পেজের লিংক যোগ করার snippet
- `BUG-CHECK-REPORT.md` — স্থানীয় static validation, print-layout ও সীমাবদ্ধতার প্রতিবেদন

## GitHub-এ যোগ করার নিয়ম

1. ZIP extract করুন।
2. আপনার **HDRSRI-01 website-এর সঠিক GitHub repository** খুলুন।
3. ZIP-এর ভেতরের `hdrsri-rules` folder-টি repository root-এ upload করুন। `hdrsri-rules/index.html`-এর folder structure এবং `assets` subfolder ঠিক একইভাবে রাখতে হবে।
4. `README-INSTALL-BN.md` এবং `NAV-LINK-SNIPPET.html` নির্দেশনা/সহায়ক ফাইল; এগুলো website-এর public page হিসেবে প্রকাশ করতে হবে না।
5. Website-এর header/navigation-এ “Rules & Regulations” লিংক যোগ করতে `NAV-LINK-SNIPPET.html` থেকে উদাহরণটি কপি করে আপনার বিদ্যমান navigation markup-এ বসান। এটি নিজে থেকে বিদ্যমান menu পরিবর্তন করে না, কারণ এই প্যাকেজে আপনার বর্তমান homepage/source files ছিল না।
6. Commit changes করুন এবং GitHub Pages deployment সফল হয়েছে কি না দেখুন।
7. GitHub Pages-এর project site হলে সাধারণত পেজের পথ হবে `https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/hdrsri-rules/`; custom domain হলে `https://YOUR-DOMAIN/hdrsri-rules/`। `YOUR-USERNAME`, `YOUR-REPOSITORY` বা `YOUR-DOMAIN`-এর জায়গায় আপনার প্রকৃত তথ্য ব্যবহার করুন।

## নিরাপদ আপগ্রেড নীতি

- এই patch বিদ্যমান `index.html`, CSS, JavaScript, PWA, service worker বা অন্য কোনো app file overwrite করে না।
- ZIP-টি GitHub-এ একক ZIP ফাইল হিসেবে upload করলে পেজ চালু হবে না; extract করে folder-টি upload করুন।
- ফাইলের সংখ্যা কম এবং কোনো external JavaScript library/API প্রয়োজন নেই।
- Navigation link হাতে যোগ করা ছাড়া পেজটি সরাসরি URL দিয়ে খোলা যাবে।

## Policy publication warning

এই পৃষ্ঠাটি 9টি mandatory rule ও 4টি institutional-change rule-এর formal website draft। এতে “Proposed for formal approval” status দেখানো আছে। কোম্পানির অনুমোদিত কর্তৃপক্ষের অনুমোদন, কার্যকর তারিখ, policy owner এবং প্রয়োজনীয় Bangladesh/legal review সম্পন্ন না করে এটিকে চূড়ান্ত binding company policy হিসেবে উপস্থাপন করবেন না। অনুমোদন হলে পেজের status copy ও policy metadata আপডেট করুন।

## যাচাই

প্যাকেজে local HTML, stylesheet ও JavaScript path রাখা হয়েছে। Print stylesheet-এ page breaks ও key blocks-এর split নিয়ন্ত্রণ করা হয়েছে। Upload-এর পরে GitHub Pages URL খুলে ডেস্কটপ এবং মোবাইলে পরীক্ষা করুন; “Print / Save PDF” button-ও পরীক্ষা করুন। শুধু ZIP তৈরি/স্থানীয় পরীক্ষা দিয়ে GitHub deployment সফল হয়েছে বলে নিশ্চিত করা যায় না। বিস্তারিত static test ফল `BUG-CHECK-REPORT.md`-এ আছে।
