/* IGERS-BD-01 | Live Conceptual Application Silo
 * The "live" indicator refers to local visualization + recalculation only.
 * Nothing in this module claims real sensor or hardware telemetry.
 */
(function () {
  'use strict';

  if (window.__igersConceptSiloV1) return;
  window.__igersConceptSiloV1 = true;

  const scenes = [
    { id:'integrated', no:'01', title:'Integrated Recovery Ecosystem', short:'Multi-source energy architecture', asset:'thesis-concept-integrated.svg', category:'SYSTEM ARCHITECTURE', description:'Connects selected roadway, hydraulic, solar and environmental inputs through conversion, protection, storage and nearby loads. Real implementation requires separate source-by-source metering and a feasibility assessment.', route:['Energy sources','Recovery interface','Power conditioning','Storage','Local loads'], modelRef:'IGERS-BD-01 integrated concept model' },
    { id:'road', no:'02', title:'Road / Kinetic Recovery', short:'Vehicle movement and recovery interface', asset:'thesis-concept-road.svg', category:'TRANSPORT INFRASTRUCTURE', description:'Conceptual roadway recovery zone. Any claimed energy must account for added rolling or propulsion losses, vehicle safety, accessibility, roadway wear, maintenance, and the system boundary.', route:['Vehicle motion','Mechanical interface','Generator / converter','Protection','Local loads'], modelRef:'IGERS-BD-01 roadway concept model' },
    { id:'hydro', no:'03', title:'Controlled Hydraulic Node', short:'Flow, head and turbine-generator', asset:'thesis-concept-hydro.svg', category:'HYDRAULIC RECOVERY', description:'Illustrates a possible hydraulic recovery interface with a bypass and generator. Available power depends on measured flow, net head, efficiency and environmental or water-service constraints.', route:['Measured flow Q','Net head H','Turbine / generator','Power conditioning','Storage / load'], modelRef:'IGERS-BD-01 hydraulic concept model' },
    { id:'solar', no:'04', title:'Solar / Airflow Hybrid', short:'PV support plus local sensing', asset:'thesis-concept-solar.svg', category:'RENEWABLE SUPPORT', description:'Combines photovoltaic support, optional airflow sensing and storage for local loads. Airflow is not automatically an energy source unless a suitable turbine or other conversion device is provided and justified.', route:['Solar irradiance','PV module','MPPT / converter','Battery / DC bus','Local loads'], modelRef:'IGERS-BD-01 solar hybrid concept model' },
    { id:'sluice', no:'05', title:'Sluice-Gate Turbine', short:'Water-flow recovery concept', asset:'thesis-concept-sluice-gate.jpg', category:'CIVIL / WATER INFRASTRUCTURE', description:'Conceptual turbine placement around controlled water flow. Gate operation, water delivery, erosion, debris, fish passage, structural loads and hydraulic losses require site-specific review; this illustration is not a construction drawing.', route:['Gate / channel flow','Safe intake','Rotor / generator','Electrical protection','Storage / load'], modelRef:'IGERS-BD-01 sluice-gate concept model' },
    { id:'roadharvest', no:'06', title:'Road Energy Harvester', short:'Surface interface and storage', asset:'thesis-concept-road-harvester.jpg', category:'ROADWAY APPLICATION', description:'A possible surface-mounted or embedded recovery interface. Site trials must establish actual recoverable energy, durability, road friction, vehicle comfort, drainage, safety and lifecycle cost before scale-up.', route:['Road surface / motion','Harvesting interface','Rectifier / converter','Storage','Sensor / lighting'], modelRef:'IGERS-BD-01 road-harvester concept image' },
    { id:'bridge', no:'07', title:'Bridge / Toll Infrastructure', short:'Infrastructure power and local loads', asset:'thesis-concept-bridge-toll.svg', category:'BRIDGE / TOLL', description:'Combines optional footfall, structural monitoring and solar support near bridges or toll areas. A monitoring sensor does not imply meaningful vibration-energy yield; structural safety takes priority.', route:['PV / selected motion','Safe transducer','Power conditioning','Storage','Toll / sensor loads'], modelRef:'IGERS-BD-01 bridge / toll concept model' },
    { id:'footstep', no:'08', title:'Footstep / FEAS', short:'Pedestrian tiles to low-power use', asset:'thesis-concept-footstep.svg', category:'HUMAN-PRESSURE RECOVERY', description:'A pressure-pad concept intended for carefully selected low-power loads. Output is site-dependent and must be measured. Accessibility, slip resistance, trip risk, durability and maintenance are mandatory checks.', route:['Footfall pressure','Tile displacement','Transducer','Rectifier / storage','Wayfinding / light'], modelRef:'IGERS-BD-01 FEAS concept model' },
    { id:'thermal', no:'09', title:'Solar + Thermal Mitigation', short:'PV shade, surfaces and airflow', asset:'thesis-concept-thermal-canopy.svg', category:'SOLAR / THERMAL DESIGN', description:'Combines photovoltaic shade with passive heat-mitigation measures. A cooler surface or absorbed heat is not automatically electrical generation. PV yield and thermal comfort require separate measurement.', route:['Solar radiation','PV / canopy','Passive shade / airflow','Conditioning','Nearby loads'], modelRef:'IGERS-BD-01 thermal canopy concept model' },
    { id:'vibration', no:'10', title:'Vibration / Acoustic Concept', short:'Monitoring with optional recovery', asset:'thesis-concept-vibration.svg', category:'STRUCTURAL MONITORING', description:'Shows vibration sensing and an optional low-power transducer. Structural monitoring and noise control are distinct engineering tasks. Energy yield must be measured without compromising fatigue life or safe vibration limits.', route:['Structural vibration','Sensor / transducer','Signal / conditioning','Optional storage','Monitoring load'], modelRef:'IGERS-BD-01 vibration concept model' },
    { id:'station', no:'11', title:'Resilience / Service Station', short:'Solar BESS and generic inspection dock', asset:'thesis-concept-resilience-station.svg', category:'INFRASTRUCTURE RESILIENCE', description:'A generic remote infrastructure service point with solar-assisted power, battery storage, communications and an inspection dock. It is a planning concept, not a live border feed, tactical deployment, detection range or coverage guarantee.', route:['PV / recovered input','Power conversion','Battery storage','Approved sensors / comms','Inspection / maintenance'], modelRef:'IGERS-BD-01 resilience station concept model' }
  ];

  const $ = (id, root=document) => root.getElementById(id);
  const num = (root, id) => {
    const el = $(id, root);
    const value = el ? Number(el.value) : NaN;
    return Number.isFinite(value) ? value : NaN;
  };
  const fmt = (n, digits=2) => {
    if (!Number.isFinite(n)) return 'CHECK INPUT';
    return new Intl.NumberFormat(undefined, { maximumFractionDigits:digits, minimumFractionDigits:0 }).format(n);
  };
  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

  function buildSilo() {
    if ($('liveConceptSilo')) return $('liveConceptSilo');
    const anchor = $('concept3d') || $('thesisVisualLab') || $('applications');
    if (!anchor) return null;

    const section = document.createElement('section');
    section.id = 'liveConceptSilo';
    section.className = 'lcas-section';
    section.setAttribute('aria-labelledby', 'lcasHeading');
    section.innerHTML = `
      <div class="lcas-wrap">
        <header class="lcas-header">
          <div>
            <div class="lcas-eyebrow"><i class="lcas-pulse" aria-hidden="true"></i> IGERS-BD-01 · APPLICATION MODELLING LAYER</div>
            <h2 id="lcasHeading">LIVE CONCEPTUAL APPLICATION SILO</h2>
            <p>Eleven concept-stage 3D-style scenes, a selectable application library and a live-updating scenario calculator in one dedicated panel. Animated energy paths are a local illustration. Calculated values are engineering scenarios, not measured production or connected sensor data.</p>
          </div>
          <div class="lcas-head-badges"><span class="lcas-badge">11 CONCEPT MODULES</span><span class="lcas-badge sim">SIMULATION ONLY</span></div>
        </header>
        <div class="lcas-kpis" aria-label="Scenario summary">
          <div class="lcas-kpi"><span>Road recovery scenario</span><strong id="lcasRoadAnnual">--</strong><small>Calculated annual energy, MWh/y</small></div>
          <div class="lcas-kpi"><span>Hydraulic output estimate</span><strong id="lcasHydPower">--</strong><small>Power at given flow and net head, kW</small></div>
          <div class="lcas-kpi"><span>PV energy scenario</span><strong id="lcasPvAnnual">--</strong><small>Estimated annual energy, MWh/y</small></div>
          <div class="lcas-kpi"><span>Battery autonomy</span><strong id="lcasBatteryHours">--</strong><small>Hours at specified constant load</small></div>
        </div>
        <div class="lcas-workspace">
          <article class="lcas-panel lcas-view">
            <div class="lcas-panel-head"><h3>Selected concept · visual simulation</h3><span id="lcasModelRef">Concept model</span></div>
            <div class="lcas-stage" id="lcasStage">
              <div class="lcas-stage-top"><span id="lcasStageNo" class="lcas-stage-chip">CONCEPT 01</span><span class="lcas-stage-chip warn">NOT TO SCALE</span></div>
              <img id="lcasModelImage" class="lcas-model-image" src="thesis-concept-integrated.svg" alt="Isometric concept illustration of the integrated IGERS energy recovery and storage architecture" loading="lazy" decoding="async">
              <canvas id="lcasFlowCanvas" class="lcas-stage-canvas" aria-hidden="true"></canvas>
              <div class="lcas-stage-bottom"><span class="lcas-stage-chip">ENERGY PATH · ILLUSTRATIVE</span><span class="lcas-stage-chip" id="lcasStageMode">FLOW ANIMATION</span></div>
            </div>
            <div class="lcas-scene-info"><h4 id="lcasSceneTitle">Integrated Recovery Ecosystem</h4><p id="lcasSceneDesc"></p><div class="lcas-flow-tags" id="lcasFlowTags" aria-label="Concept stages"></div></div>
            <div class="lcas-controls"><button class="lcas-button primary" id="lcasRun" type="button" aria-pressed="true">Ⅱ Pause concept animation</button><button class="lcas-button" id="lcasReset" type="button">↺ Reset view</button><a class="lcas-button" href="#thesisVisualLab" id="lcasOpenThesisLab">Open original 11-scene visualizer ↗</a></div>
            <div class="lcas-state-row"><span>Model status: <strong id="lcasRunState">DEMO SIMULATION RUNNING</strong></span><span>Recalculated: <b id="lcasUpdateTime">--</b></span></div>
          </article>
          <aside class="lcas-panel lcas-calc" aria-labelledby="lcasCalcHeading">
            <div class="lcas-panel-head"><h3 id="lcasCalcHeading">Live conceptual calculations</h3><span>Input-driven · no sensor link</span></div>
            <p class="lcas-calc-intro">Edit assumptions to update the model immediately. Values use the displayed formulas and remain scenario-only until verified with site measurements and approved hardware telemetry.</p>
            <div class="lcas-input-groups">
              <details class="lcas-field-group" open><summary>Road / kinetic recovery</summary><div class="lcas-fields">
                <div class="lcas-field"><label for="lcasMass">Vehicle mass (kg)</label><input id="lcasMass" type="number" min="0" max="10000000" step="1" value="900"></div>
                <div class="lcas-field"><label for="lcasV1">Entry speed (km/h)</label><input id="lcasV1" type="number" min="0" max="500" step="0.1" value="20"></div>
                <div class="lcas-field"><label for="lcasV2">Exit speed (km/h)</label><input id="lcasV2" type="number" min="0" max="500" step="0.1" value="15"></div>
                <div class="lcas-field"><label for="lcasRoadEff">Net recovery efficiency (%)</label><input id="lcasRoadEff" type="number" min="0" max="100" step="0.1" value="20"></div>
                <div class="lcas-field"><label for="lcasEvents">Events / year / site</label><input id="lcasEvents" type="number" min="0" max="100000000" step="1000" value="210000"></div>
                <div class="lcas-field"><label for="lcasSites">Recovery sites</label><input id="lcasSites" type="number" min="0" max="1000000" step="1" value="100"></div>
              </div></details>
              <details class="lcas-field-group"><summary>Hydraulic recovery</summary><div class="lcas-fields">
                <div class="lcas-field"><label for="lcasFlow">Flow Q (m³/s)</label><input id="lcasFlow" type="number" min="0" max="100000" step="0.1" value="5"></div>
                <div class="lcas-field"><label for="lcasHead">Net head H (m)</label><input id="lcasHead" type="number" min="0" max="10000" step="0.1" value="1.5"></div>
                <div class="lcas-field"><label for="lcasHydEff">Overall hydraulic efficiency (%)</label><input id="lcasHydEff" type="number" min="0" max="100" step="0.1" value="70"></div>
                <div class="lcas-field"><label for="lcasHydHours">Operating hours / year</label><input id="lcasHydHours" type="number" min="0" max="8760" step="10" value="2000"></div>
              </div></details>
              <details class="lcas-field-group"><summary>PV + battery storage</summary><div class="lcas-fields">
                <div class="lcas-field"><label for="lcasPv">PV capacity (kWp)</label><input id="lcasPv" type="number" min="0" max="10000000" step="1" value="100"></div>
                <div class="lcas-field"><label for="lcasYield">Specific yield (kWh/kWp·y)</label><input id="lcasYield" type="number" min="0" max="5000" step="10" value="1400"></div>
                <div class="lcas-field"><label for="lcasBattery">Battery nominal capacity (kWh)</label><input id="lcasBattery" type="number" min="0" max="100000000" step="10" value="1000"></div>
                <div class="lcas-field"><label for="lcasDod">Usable depth of discharge (%)</label><input id="lcasDod" type="number" min="0" max="100" step="1" value="85"></div>
                <div class="lcas-field"><label for="lcasBatEff">Discharge efficiency (%)</label><input id="lcasBatEff" type="number" min="0" max="100" step="1" value="92"></div>
                <div class="lcas-field"><label for="lcasLoad">Average load (kW)</label><input id="lcasLoad" type="number" min="0" max="10000000" step="1" value="250"></div>
              </div></details>
            </div>
            <div class="lcas-calc-actions"><button class="lcas-button primary" id="lcasRecalc" type="button">↻ Recalculate</button><button class="lcas-button" id="lcasDefaults" type="button">Restore defaults</button></div>
            <div class="lcas-result-grid" style="margin-top:12px">
              <div class="lcas-result"><strong id="lcasKeEvent">--</strong><span>Gross kinetic reduction / event (kWh)</span></div>
              <div class="lcas-result"><strong id="lcasNetEvent">--</strong><span>Scenario recovery / event (Wh)</span></div>
              <div class="lcas-result"><strong id="lcasHydAnnual">--</strong><span>Hydraulic annual energy scenario (MWh/y)</span></div>
              <div class="lcas-result"><strong id="lcasCombined">--</strong><span>Sum of modeled annual energy (MWh/y)</span></div>
            </div>
            <div class="lcas-formula"><b>Formula set</b><br>Road: ΔE = ½m(v₁² − v₂²); net recovery = max(0, ΔE) × η.<br>Hydraulic: P = ρgQHη, using ρ = 1000 kg/m³ and g = 9.80665 m/s².<br>PV: E = capacity × specific yield. Battery: t = capacity × usable DoD × efficiency ÷ load.</div>
          </aside>
        </div>
        <div class="lcas-grid-block"><div class="lcas-grid-heading"><div><h3>11 conceptual application modules</h3><p>Select any tile to change the concept illustration and its application notes.</p></div><span class="lcas-badge sim">ALL VISUALS · CONCEPT STAGE</span></div><div class="lcas-scene-grid" id="lcasSceneGrid" role="group" aria-label="Select one of the eleven conceptual application modules"></div></div>
        <div class="lcas-footer-note"><div class="lcas-note-icon" aria-hidden="true">i</div><div><strong>Model boundary and engineering warning</strong><p>“Live” in this panel means the scene animation, clock and calculations update in this browser. No value here is read from physical IGERS hardware. Road recovery, hydraulic output, PV yield and battery autonomy are separate assumptions; the combined annual scenario is not a bankable energy forecast. Before deployment, verify site measurements, conversion losses, parasitic loads, structural and hydraulic limits, safety, lifecycle maintenance and applicable permits.</p></div></div>
        <div class="lcas-sources"><span>Visual reference: IGERS-BD-01 supplied thesis concept assets.</span><span>·</span><span>Physics model: standard kinetic energy and hydraulic-power equations.</span><span>·</span><a href="https://pvwatts.nrel.gov/" target="_blank" rel="noopener noreferrer">NREL PVWatts for PV yield modelling ↗</a><span>·</span><a href="https://www.energy.gov/eere/water/hydropower-basics" target="_blank" rel="noopener noreferrer">U.S. DOE hydropower basics ↗</a></div>
      </div>`;

    anchor.insertAdjacentElement('afterend', section);
    buildSceneGrid(section);
    bindInteractions(section);
    bindCalculator(section);
    initCanvas(section);
    selectScene(section, 'integrated');
    calculate(section);
    bindNavigation(section);
    return section;
  }

  function buildSceneGrid(root) {
    const grid = $('lcasSceneGrid', root);
    if (!grid) return;
    const fragment = document.createDocumentFragment();
    scenes.forEach(scene => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'lcas-scene-card';
      button.dataset.scene = scene.id;
      button.setAttribute('aria-pressed', 'false');
      button.setAttribute('aria-label', `Select concept ${scene.no}: ${scene.title}`);
      const thumb = document.createElement('span');
      thumb.className = 'lcas-thumb';
      const img = document.createElement('img');
      img.src = scene.asset;
      img.alt = '';
      img.loading = 'lazy';
      img.decoding = 'async';
      img.onerror = () => { img.style.display = 'none'; thumb.style.background = 'linear-gradient(135deg,#092334,#0a4960)'; };
      const no = document.createElement('span');
      no.className = 'lcas-card-num';
      no.textContent = `CONCEPT ${scene.no}`;
      thumb.append(img, no);
      const text = document.createElement('span');
      text.className = 'lcas-card-text';
      const title = document.createElement('b');
      title.textContent = scene.title;
      const sub = document.createElement('small');
      sub.textContent = scene.short;
      text.append(title, sub);
      button.append(thumb, text);
      fragment.append(button);
    });
    grid.replaceChildren(fragment);
  }

  function selectScene(root, id) {
    const scene = scenes.find(s => s.id === id) || scenes[0];
    root.dataset.activeScene = scene.id;
    const image = $('lcasModelImage', root);
    const title = $('lcasSceneTitle', root);
    const desc = $('lcasSceneDesc', root);
    const number = $('lcasStageNo', root);
    const ref = $('lcasModelRef', root);
    const tags = $('lcasFlowTags', root);
    if (image) {
      image.alt = `${scene.title}: illustrative concept-stage isometric engineering model`;
      image.src = scene.asset;
      image.onerror = () => { image.removeAttribute('src'); image.alt = `${scene.title} concept illustration unavailable. Scene flow overlay remains active.`; };
    }
    if (title) title.textContent = scene.title;
    if (desc) desc.textContent = scene.description;
    if (number) number.textContent = `CONCEPT ${scene.no} · ${scene.category}`;
    if (ref) ref.textContent = scene.modelRef;
    if (tags) {
      tags.replaceChildren();
      scene.route.forEach(stage => {
        const span = document.createElement('span');
        span.textContent = stage;
        tags.append(span);
      });
    }
    root.querySelectorAll('.lcas-scene-card').forEach(button => {
      const active = button.dataset.scene === scene.id;
      button.setAttribute('aria-pressed', String(active));
    });
    const fullLab = document.querySelector(`#thesisVisualLab [data-thesis-scene="${scene.id}"]`);
    if (fullLab && typeof fullLab.click === 'function') {
      try { fullLab.click(); } catch (_) {}
    }
    if (root.__lcasCanvasState) root.__lcasCanvasState.sceneIndex = scenes.findIndex(s => s.id === scene.id);
  }

  function bindInteractions(root) {
    $('lcasSceneGrid', root)?.addEventListener('click', event => {
      const button = event.target.closest('button[data-scene]');
      if (!button) return;
      selectScene(root, button.dataset.scene);
    });
    $('lcasRun', root)?.addEventListener('click', () => {
      const state = root.__lcasCanvasState;
      if (!state) return;
      state.playing = !state.playing;
      const button = $('lcasRun', root);
      const label = $('lcasRunState', root);
      if (button) {
        button.textContent = state.playing ? 'Ⅱ Pause concept animation' : '▶ Run concept animation';
        button.setAttribute('aria-pressed', String(state.playing));
      }
      if (label) label.textContent = state.playing ? 'DEMO SIMULATION RUNNING' : 'SIMULATION PAUSED';
      if (state.playing) state.lastFrame = 0;
    });
    $('lcasReset', root)?.addEventListener('click', () => {
      selectScene(root, 'integrated');
      const state = root.__lcasCanvasState;
      if (state) { state.phase = 0; state.playing = true; state.lastFrame = 0; }
      const run = $('lcasRun', root);
      if (run) { run.textContent = 'Ⅱ Pause concept animation'; run.setAttribute('aria-pressed', 'true'); }
      const label = $('lcasRunState', root);
      if (label) label.textContent = 'DEMO SIMULATION RUNNING';
      calculate(root);
    });
    $('lcasOpenThesisLab', root)?.addEventListener('click', () => {
      const active = root.dataset.activeScene || 'integrated';
      const existing = document.querySelector(`#thesisVisualLab [data-thesis-scene="${active}"]`);
      if (existing) existing.click();
    });
    $('lcasRecalc', root)?.addEventListener('click', () => calculate(root));
    $('lcasDefaults', root)?.addEventListener('click', () => {
      const defaults = {lcasMass:900,lcasV1:20,lcasV2:15,lcasRoadEff:20,lcasEvents:210000,lcasSites:100,lcasFlow:5,lcasHead:1.5,lcasHydEff:70,lcasHydHours:2000,lcasPv:100,lcasYield:1400,lcasBattery:1000,lcasDod:85,lcasBatEff:92,lcasLoad:250};
      Object.entries(defaults).forEach(([id,value]) => { const el=$(id,root); if(el) el.value=String(value); });
      calculate(root);
    });
    root.querySelectorAll('.lcas-fields input').forEach(input => {
      input.addEventListener('input', () => calculate(root));
      input.addEventListener('change', () => calculate(root));
    });
    window.addEventListener('resize', () => resizeCanvas(root), {passive:true});
    window.matchMedia?.('(prefers-reduced-motion: reduce)').addEventListener?.('change', event => {
      const state = root.__lcasCanvasState;
      if (state && event.matches) { state.phase = 0; state.lastFrame = 0; }
    });
  }

  function calculate(root) {
    const values = {
      mass:num(root,'lcasMass'), v1:num(root,'lcasV1'), v2:num(root,'lcasV2'), roadEff:num(root,'lcasRoadEff')/100,
      events:num(root,'lcasEvents'), sites:num(root,'lcasSites'), flow:num(root,'lcasFlow'), head:num(root,'lcasHead'), hydEff:num(root,'lcasHydEff')/100,
      hydHours:num(root,'lcasHydHours'), pv:num(root,'lcasPv'), yield:num(root,'lcasYield'), battery:num(root,'lcasBattery'), dod:num(root,'lcasDod')/100,
      batEff:num(root,'lcasBatEff')/100, load:num(root,'lcasLoad')
    };
    const limits = {mass:[0,10000000],v1:[0,500],v2:[0,500],roadEff:[0,1],events:[0,100000000],sites:[0,1000000],flow:[0,100000],head:[0,10000],hydEff:[0,1],hydHours:[0,8760],pv:[0,10000000],yield:[0,5000],battery:[0,100000000],dod:[0,1],batEff:[0,1],load:[0,10000000]};
    let valid = true;
    Object.entries(values).forEach(([key,value]) => {
      const [lo,hi] = limits[key];
      if (!Number.isFinite(value) || value < lo || value > hi) valid = false;
    });
    if (!valid) {
      ['lcasRoadAnnual','lcasHydPower','lcasPvAnnual','lcasBatteryHours','lcasKeEvent','lcasNetEvent','lcasHydAnnual','lcasCombined'].forEach(id => { const el=$(id,root); if(el) el.textContent='CHECK INPUT'; });
      const update = $('lcasUpdateTime',root); if(update) update.textContent='Input validation needed';
      return;
    }
    const speedValid = values.v2 <= values.v1;
    const v1 = values.v1 / 3.6;
    const v2 = values.v2 / 3.6;
    const grossJ = speedValid ? 0.5 * values.mass * (v1*v1 - v2*v2) : NaN;
    const netJ = Number.isFinite(grossJ) ? grossJ * values.roadEff : NaN;
    const roadAnnualKWh = Number.isFinite(netJ) ? netJ / 3600000 * values.events * values.sites : NaN;
    const hydroKW = 1000 * 9.80665 * values.flow * values.head * values.hydEff / 1000;
    const hydroAnnualKWh = hydroKW * values.hydHours;
    const pvAnnualKWh = values.pv * values.yield;
    const batteryHours = values.load > 0 ? (values.battery * values.dod * values.batEff) / values.load : NaN;
    const annualTotalMWh = (Number.isFinite(roadAnnualKWh) ? roadAnnualKWh : 0) / 1000 + hydroAnnualKWh / 1000 + pvAnnualKWh / 1000;
    const set = (id,text) => { const el=$(id,root); if(el) el.textContent=text; };
    set('lcasRoadAnnual', Number.isFinite(roadAnnualKWh) ? fmt(roadAnnualKWh/1000,2) : 'CHECK SPEEDS');
    set('lcasHydPower',fmt(hydroKW,2));
    set('lcasPvAnnual',fmt(pvAnnualKWh/1000,2));
    set('lcasBatteryHours',values.load > 0 ? fmt(batteryHours,2)+' h' : 'NO LOAD');
    set('lcasKeEvent',Number.isFinite(grossJ) ? fmt(grossJ/3600000,6) : 'CHECK SPEEDS');
    set('lcasNetEvent',Number.isFinite(netJ) ? fmt(netJ/1000,4) : 'CHECK SPEEDS');
    set('lcasHydAnnual',fmt(hydroAnnualKWh/1000,2));
    set('lcasCombined',fmt(annualTotalMWh,2));
    set('lcasUpdateTime',new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit',second:'2-digit'}));
    const status = $('lcasRunState',root);
    if (status && status.textContent === 'CALCULATION ERROR') status.textContent = 'DEMO SIMULATION RUNNING';
    root.dataset.lastScenario = JSON.stringify({roadAnnualMWh:Number.isFinite(roadAnnualKWh)?roadAnnualKWh/1000:null,hydraulicKW:hydroKW,hydraulicAnnualMWh:hydroAnnualKWh/1000,pvAnnualMWh:pvAnnualKWh/1000,batteryAutonomyHours:Number.isFinite(batteryHours)?batteryHours:null,combinedAnnualMWh:annualTotalMWh,scenarioOnly:true,source:'local assumptions'});
  }

  function initCanvas(root) {
    const canvas = $('lcasFlowCanvas',root);
    if (!canvas || !canvas.getContext) return;
    const ctx = canvas.getContext('2d', {alpha:true});
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || false;
    root.__lcasCanvasState = {ctx,canvas,phase:0,lastFrame:0,playing:!reduced,sceneIndex:0,width:0,height:0,visible:true};
    const state = root.__lcasCanvasState;
    const stage = $('lcasStage',root);
    if ('IntersectionObserver' in window && stage) {
      const observer = new IntersectionObserver(entries => { state.visible = Boolean(entries[0]?.isIntersecting); state.lastFrame = 0; }, {threshold:0.05});
      observer.observe(stage);
    }
    resizeCanvas(root);
    function frame(now) {
      if (!document.documentElement.contains(root)) return;
      const dt = state.lastFrame ? Math.min(0.05,(now-state.lastFrame)/1000) : 0;
      state.lastFrame = now;
      const w = state.width, h=state.height;
      ctx.clearRect(0,0,w,h);
      if (w>0 && h>0) {
        const scale = Math.min(w/700,h/394);
        const cx=w*.5, cy=h*.53;
        ctx.save();
        ctx.globalAlpha=.54;
        ctx.lineWidth=Math.max(1,1.3*scale);
        ctx.strokeStyle='rgba(85,221,255,.42)';
        ctx.setLineDash([4*scale,7*scale]);
        const paths=[
          [[cx-w*.36,cy+h*.03],[cx-w*.18,cy-h*.15],[cx-w*.06,cy+h*.15],[cx+w*.09,cy+h*.02]],
          [[cx-w*.09,cy+h*.02],[cx+w*.04,cy-h*.19],[cx+w*.19,cy+h*.17],[cx+w*.34,cy+h*.02]],
          [[cx-w*.32,cy+h*.26],[cx-w*.14,cy+h*.13],[cx+w*.04,cy+h*.26],[cx+w*.24,cy+h*.14]],
        ];
        paths.forEach((points,index)=>{
          ctx.beginPath();ctx.moveTo(points[0][0],points[0][1]);
          ctx.bezierCurveTo(points[1][0],points[1][1],points[2][0],points[2][1],points[3][0],points[3][1]);ctx.stroke();
          const t=((state.phase*.17+index*.31)%1);
          const p=bezier(points,t);ctx.beginPath();ctx.arc(p.x,p.y,3.2*scale,0,Math.PI*2);ctx.fillStyle=index===1?'#8af3bf':'#55ddff';ctx.shadowColor=ctx.fillStyle;ctx.shadowBlur=8*scale;ctx.fill();ctx.shadowBlur=0;
        });
        ctx.setLineDash([]);
        for(let i=0;i<7;i++){
          const angle=(i/7)*Math.PI*2+state.phase*.055;
          const x=cx+Math.cos(angle)*w*.21;
          const y=cy+Math.sin(angle)*h*.16;
          ctx.beginPath();ctx.arc(x,y,2.1*scale,0,Math.PI*2);ctx.fillStyle='rgba(138,243,191,.7)';ctx.fill();
        }
        ctx.restore();
      }
      if (state.playing && state.visible && !reduced) state.phase += dt*1.9;
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function bezier(points,t) {
    const u=1-t, p=points;
    return {x:u*u*u*p[0][0]+3*u*u*t*p[1][0]+3*u*t*t*p[2][0]+t*t*t*p[3][0],y:u*u*u*p[0][1]+3*u*u*t*p[1][1]+3*u*t*t*p[2][1]+t*t*t*p[3][1]};
  }
  function resizeCanvas(root) {
    const state=root.__lcasCanvasState;
    if(!state)return;
    const rect=state.canvas.getBoundingClientRect();
    if(rect.width<1||rect.height<1)return;
    const dpr=Math.max(1,Math.min(2,window.devicePixelRatio||1));
    state.width=rect.width;state.height=rect.height;
    const w=Math.round(rect.width*dpr),h=Math.round(rect.height*dpr);
    if(state.canvas.width!==w||state.canvas.height!==h){state.canvas.width=w;state.canvas.height=h;}
    state.ctx.setTransform(dpr,0,0,dpr,0,0);
  }

  function bindCalculator(root) {
    // Kept as a separate hook to make future approved telemetry adapters additive.
    root.addEventListener('lcas:recalculate', () => calculate(root));
  }

  function bindNavigation(root) {
    const navGroup=document.querySelector('[data-nav-group="engineering"]');
    if(navGroup&&!navGroup.querySelector('a[href="#liveConceptSilo"]')){
      const link=document.createElement('a');link.href='#liveConceptSilo';link.textContent='Live Concept Application Silo';navGroup.append(link);
    }
    const favorite=document.getElementById('pcFavoriteSelect');
    if(favorite&&!Array.from(favorite.options).some(o=>o.value==='#liveConceptSilo')){
      const option=document.createElement('option');option.value='#liveConceptSilo';option.textContent='Live Concept Application Silo';favorite.append(option);
    }
    const jump=document.createElement('a');jump.className='lcas-button';jump.href='#liveConceptSilo';jump.textContent='Open Live Concept Application Silo ↗';
    jump.setAttribute('aria-label','Open the Live Conceptual Application Silo');
    const dashboardHead=document.querySelector('#commandCenter .pc-suite-head');
    if(dashboardHead&&!dashboardHead.querySelector('.lcas-dashboard-shortcut')){
      jump.classList.add('lcas-dashboard-shortcut');
      jump.style.marginTop='10px';
      dashboardHead.append(jump);
    }
  }

  function start() {
    const root=buildSilo();
    if(!root)return;
    // Bridge the silo to the main visualizer and existing app navigation without replacing modules.
    root.addEventListener('click',event=>{
      if(event.target.closest('a[href="#liveConceptSilo"]')){
        event.preventDefault();root.scrollIntoView({behavior:window.matchMedia?.('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
      }
    });
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
