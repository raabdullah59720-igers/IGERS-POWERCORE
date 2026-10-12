# IGERS-BD-01 | Live Conceptual Application Silo Add-on

## বাংলা: কী যোগ হবে
এই additive upgrade app-এ **LIVE CONCEPTUAL APPLICATION SILO** নামে একটি নতুন panel যোগ করে। এতে থাকছে:

- ১১টি concept-stage 3D-style visual scene এবং selectable scene cards
- original Thesis 3D Concept Lab-এর সঙ্গে selection bridge
- animated local energy-flow overlay, Play/Pause এবং Reset controls
- roadway kinetic, hydraulic, PV energy এবং battery autonomy-এর input-driven calculation cards
- calculation assumptions, formulas, model limits এবং reference links
- engineering navigation link এবং Command Center shortcut
- cache-busting URL version যাতে পুরোনো JS/CSS cache থেকে আগের UI ফিরে না আসে

### গুরুত্বপূর্ণ পার্থক্য
এখানে **Live** বলতে browser-এ concept animation, local clock এবং input বদলালে calculation update বোঝানো হয়েছে। এটি real hardware telemetry, live energy meter, CCTV feed বা verified field performance নয়। Default values হলো editable scenario assumptions, measured readings নয়।

## GitHub Pages-এ যোগ করার নিয়ম
1. ZIP extract করো।
2. Extract করা ZIP-এর ভেতরের সব file সরাসরি তোমার repository root-এ upload করো, `IGERS-CONCEPT-SILO-PATCH` নামে subfolder হিসেবে নয়।
3. Existing file-এর নামের সঙ্গে মিললে replace করো। বিশেষ করে `index.html`, `thesis-concept-lab.js`, `thesis-concept-lab.css`, এবং `thesis-concept-*` image assets replace/retain করতে হবে।
4. সব changes commit করো। GitHub Pages deployment complete হলে app-এ `Ctrl + F5` দাও।
5. Navigation > **Live Concept Application Silo** খুলবে, অথবা `/#liveConceptSilo` route ব্যবহার করবে।

এই patch-এ `index.html` আছে কারণ নতুন panel load করার জন্য CSS/JS reference এবং navigation link দরকার। শুধু নতুন `.js`/`.css` files upload করলে static GitHub Pages সেগুলো স্বয়ংক্রিয়ভাবে load করবে না।

## Included concept assets
The package includes all eleven scene image files, the existing `thesis-concept-lab.js` and stylesheet, plus the two FEAS reference visuals used by that module. The new panel is added as a separately namespaced component and does not replace the existing application modules.

## Calculation conventions
- **Road:** kinetic energy reduction = `0.5 × mass × (v1² − v2²)`, with speeds converted from km/h to m/s. A separate efficiency factor is applied to create an illustrative recoverable-energy scenario. This is not a claim that all vehicle deceleration energy is practically harvestable.
- **Hydraulic:** `P = ρ × g × Q × H × η`, assuming water density 1000 kg/m³ and standard gravitational acceleration 9.80665 m/s². Net head and flow should come from the site, not visual estimates.
- **PV:** annual energy = installed PV capacity × entered specific yield. For project design use a site-specific model, shading/orientation inputs and local weather data.
- **Battery:** autonomy = nominal capacity × usable depth of discharge × discharge efficiency ÷ constant load. Temperature, ageing, inverter loss, standby demand, power limits and reserve policy are omitted unless separately modelled.
- The combined annual estimate sums the independent roadway, hydraulic and PV scenarios. It is an exploratory comparison only and does not prove that the sources can be combined at one site or that the result is bankable.

## References
- NREL PVWatts: https://pvwatts.nrel.gov/ (PV production modelling; actual yield needs site inputs)
- U.S. Department of Energy, Hydropower Basics: https://www.energy.gov/eere/water/hydropower-basics
- IGERS-BD-01 supplied thesis concept assets in this repository (illustrative proposal drawings, not independently validated engineering designs)

## Deployment QA limits
Static asset checks and JavaScript syntax checks are performed before packaging. This add-on does not claim a full end-to-end browser test or measured hardware integration unless stated in the accompanying QA report. Public GitHub Pages cannot securely host secrets for any private telemetry gateway.
