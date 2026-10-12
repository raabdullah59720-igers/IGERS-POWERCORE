# IGERS POWERCORE · 11 Concept Visual Panel Fix
Release marker: `2026-10-12-static-mount-fix-v2`

## কেন আগের add-on দেখা নাও যেতে পারে
আগের patch-এ panel মূলত JavaScript দিয়ে runtime-এ তৈরি হতো। যদি live repository-র `index.html`-এ script reference না পৌঁছায়, ভুল branch/folder-এ upload হয়, অথবা অন্য build-এর `index.html` serve হয়, panel তৈরি হতো না। এই patch-এ **১১টি visual card এবং silo markup সরাসরি `index.html`-এ আছে**, তাই panel নিজেই document-এ থাকবে; নতুন JS শুধু card selection, animation এবং calculation চালায়। Navigation entry `app-shell.js` চালুর আগেই `index.html`-এ register করা আছে। App-shell dashboard render হওয়ার পর একটি বড় shortcut-ও home dashboard-এ inject হয়, যাতে panel-টি workspace-এর ভেতরে লুকিয়ে না থাকে।

## ZIP upload করার সঠিক নিয়ম
1. এই ZIP download করে **Extract** করো।
2. GitHub repository `IGERS-POWERCORE`-এর **root**-এ যাও, যেখানে বর্তমান `index.html`, `app-shell.js` ও `thesis-concept-lab.js` আছে।
3. Extract করা ZIP-এর সব file root-এ upload করো। ZIP-টিকে single file হিসেবে upload করবে না, এবং `IGERS-CONCEPT-SILO-FIX-PATCH/` নামে nested folder-এর মধ্যে ফাইল রেখো না।
4. `index.html` replace করতেই হবে। পাশাপাশি `live-concept-application-silo.js`, `live-concept-application-silo.css`, `sw.js`, এবং `thesis-concept-*` assets root-এ রাখতে হবে। `thesis-concept-lab.js` ও `.css` একই নামে source-archive copy-সহ রয়েছে, compatibility বজায় রাখতে এগুলোও root-এ রেখে/replace করতে পারো। অন্য existing app files delete করবে না।
5. Commit করো, তারপর GitHub Pages deployment/Actions সফল হওয়া পর্যন্ত অপেক্ষা করো।
6. Browser-এ খুলো: `https://raabdullah59720-igers.github.io/IGERS-POWERCORE/#liveConceptSilo` এবং `Ctrl+F5` দাও। PWA install করা থাকলে app পুরোপুরি বন্ধ করে hosted link থেকে আবার খোলো।

## কীভাবে বুঝবে ঠিক build serve হচ্ছে
Hosted app-এ `Ctrl+U` (View Page Source) দিয়ে `igers-concept-silo-release` খোঁজো। এই marker থাকা চাই:

`<meta name="igers-concept-silo-release" content="2026-10-12-static-mount-fix-v2">`

এ marker নেই মানে GitHub Pages এখনও এই `index.html` serve করছে না; আগে repository/branch/root/deployment ঠিক করতে হবে। Marker থাকলে HTML-এ `id="liveConceptSilo"`, ১১টি `data-lcs-scene` card এবং `live-concept-application-silo.js?v=20261012-static-mount-fix-v2` পাওয়া উচিত।

## App-এর মধ্যে panel কোথায় থাকবে
- Direct link: `/#liveConceptSilo`
- Home dashboard থেকে নতুন **LIVE CONCEPTUAL APPLICATION SILO · 11 VISUALS** shortcut-এ click করো।
- Workspace route: **Energy & System Control** খুলে **Live Concept Application Silo** panel-টি খোলো।
- Page-এর original **Thesis 3D Lab**-ও রেখে দেওয়া হয়েছে। নতুন silo হলো তার বাইরে থাকা আলাদা panel, ১১টি selectable visual card-সহ।

## Feature / interpretation
- ১১টি concept scene: integrated ecosystem, road/kinetic, hydraulic node, solar/airflow, sluice-gate turbine, road harvester, bridge/toll, footstep/FEAS, thermal canopy, vibration/acoustic, resilience/service station.
- Large concept visual changes when a card is selected; a local animated flow overlay has Play/Pause and Reset.
- Road kinetic, hydraulic power, PV yield and battery autonomy update from editable inputs.
- Formula calculations are explicitly labelled scenario estimates. The animated state is local simulation and is not hardware telemetry or a measured live generation reading.

## Important compatibility note
This is a **root-level upgrade patch**, not a complete standalone copy of the entire app. It is based on the user-provided `IGERS-POWERCORE-main (16).zip` entry page. Apply it to the same repository/version that serves that app. Do not combine it with a different `index.html` unless the silo section, menu link, stylesheet and script reference are manually reconciled.
