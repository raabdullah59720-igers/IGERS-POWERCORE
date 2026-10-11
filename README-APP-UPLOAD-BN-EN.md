# IGERS POWERCORE — Smart App Shell Update (2026-10-11)

## বাংলা: GitHub-এ আপলোড

এই প্যাকেজে মূল অ্যাপের বিদ্যমান প্যানেল ও JavaScript মডিউল রেখে নতুন app-style dashboard, workspace/category view, focused panel navigation এবং responsive styling যোগ করা হয়েছে। মূল প্যানেল/কন্ট্রোল সরানো হয়নি।

1. ZIP ফাইলটি কম্পিউটারে Extract করুন।
2. Extract করা ফোল্ডারের **সব ফাইল ও ফোল্ডার** একসঙ্গে GitHub repository-এর root-এ আপলোড করুন। ZIP ফাইলটিকে নিজে repository-তে রেখে দিলেই ওয়েবসাইট আপডেট হবে না।
3. একই নামের ফাইল overwrite করার সময় GitHub-এর পরিবর্তন নিশ্চিত করুন। Repository-এর অন্য অপ্রাসঙ্গিক ফাইল মুছবেন না।
4. GitHub repository → **Settings → Pages**-এ গিয়ে `Deploy from a branch`, branch `main`, folder `/ (root)` নির্বাচন করুন—যদি ইতিমধ্যে এভাবেই সেট করা থাকে, পরিবর্তনের প্রয়োজন নেই।
5. Deploy শেষ হলে hard refresh করুন (`Ctrl + Shift + R`)। Service-worker revision-ও আপডেট করা হয়েছে।

এই deploy package-এ **৮৫টি ফাইল** আছে—browser uploader-এর ১০০-ফাইল সীমার নিচে।

## English: Upload instructions

1. Extract this ZIP locally.
2. Upload **all files and folders inside the extracted folder** to the root of your existing GitHub Pages repository. Uploading the ZIP as a file alone will not deploy the site.
3. Overwrite matching filenames when prompted, but do not delete unrelated repository files.
4. In **Settings → Pages**, use `Deploy from a branch` → `main` → `/ (root)` if that is your existing setup.
5. After deployment, hard-refresh with `Ctrl + Shift + R`.

## What changed

- Added a modern, responsive launcher dashboard.
- Grouped existing navigation into seven workspaces.
- Added feature lists inside each workspace and a back-to-workspaces control.
- Existing panels, original IDs, calculations, module scripts, theme and access-gate code are retained.
- Shared access password remains `MIM2005` in the existing client-side gate code.

## Important limitations

- The original archive referenced a missing Bangladesh boundary fallback file. A **generalized Natural Earth 1:110m public-domain outline** has been supplied so the build and map fallback can load. It is for broad visual context only—not legal border demarcation, navigation or operational decisions.
- Live external feeds depend on each provider, network, browser CORS policy and any required API configuration. A green/live status should only be trusted when the panel itself confirms a successful provider response.
- Static checks passed, but a full interactive Chromium click-through could not be completed in the build environment. Review the app in your own browser after deployment.
