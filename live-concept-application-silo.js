/* IGERS-BD-01 | Static-first 11 Concept Visual Silo
 * The panel itself is in index.html: it stays visible if this script fails.
 * "Live" means local animation + input-driven scenario math, never hardware telemetry.
 */
(() => {
  'use strict';
  const root = document.getElementById('liveConceptSilo');
  if (!root || root.dataset.lcsInitialized === '1') return;
  root.dataset.lcsInitialized = '1';
  const $ = (id) => document.getElementById(id);
  const scenes = {
    integrated:{n:'01',category:'INTEGRATED SYSTEM',title:'Integrated recovery ecosystem',asset:'thesis-concept-integrated.svg',desc:'Conceptual system architecture connecting selected roadway, hydraulic and solar-support inputs through conversion and protection to storage, monitoring and suitable local loads.',tags:['Selected energy sources','Recovery interface','Power conditioning','Storage','Local loads']},
    road:{n:'02',category:'ROAD / KINETIC',title:'Road / kinetic recovery',asset:'thesis-concept-road.svg',desc:'Illustrates a possible mechanical recovery interface near controlled vehicle movement. A real device must account for vehicle propulsion losses, traffic and accessibility safety, pavement durability, maintenance and net recoverable energy.',tags:['Vehicle motion','Recovery interface','Generator','Power converter','Local loads']},
    hydro:{n:'03',category:'HYDRAULIC RECOVERY',title:'Controlled hydraulic node',asset:'thesis-concept-hydro.svg',desc:'Flow/head-driven recovery through a rotor-generator concept. Available output depends on measured flow, net head, efficiency, a safe bypass, water-service constraints and environmental review.',tags:['Measured flow Q','Net head H','Turbine / generator','Electrical protection','Storage / load']},
    solar:{n:'04',category:'SOLAR / AIRFLOW',title:'Solar and airflow hybrid',asset:'thesis-concept-solar.svg',desc:'PV support with an optional airflow-recovery component, conditioning and storage. Airflow is not an electricity source unless a suitable conversion device is included and its parasitic losses are considered.',tags:['Solar irradiance','PV module','Optional airflow rotor','MPPT / converter','Battery / loads']},
    sluice:{n:'05',category:'WATER INFRASTRUCTURE',title:'Sluice-gate turbine concept',asset:'thesis-concept-sluice-gate.jpg',desc:'Conceptual turbine placement around a controlled water channel. Gate operation, water delivery, debris, erosion, fish passage, civil loading and hydraulic losses need site-specific engineering review.',tags:['Channel flow','Safe intake','Rotor / generator','Power conditioning','Storage / load']},
    roadharvest:{n:'06',category:'ROAD APPLICATION',title:'Road energy harvester',asset:'thesis-concept-road-harvester.jpg',desc:'Illustrates a roadway energy-harvesting interface. Pilot testing must establish recoverable energy, vehicle interaction, road friction, ride quality, drainage, durability and lifecycle cost before scale-up.',tags:['Road surface / motion','Harvesting interface','Rectifier / converter','Storage','Lighting / sensors']},
    bridge:{n:'07',category:'BRIDGE / TOLL',title:'Bridge and toll infrastructure',asset:'thesis-concept-bridge-toll.svg',desc:'A concept for selected bridge, overpass or toll-plaza applications with optional low-power recovery and local monitoring/lighting loads. Structural safety comes first; sensor monitoring does not imply useful energy yield.',tags:['PV / selected motion','Safe transducer','Power conditioning','Storage','Local loads']},
    footstep:{n:'08',category:'FOOTSTEP / FEAS',title:'Footstep energy recovery',asset:'thesis-concept-footstep.svg',desc:'Pressure-pad concept for selected low-power loads. Output is site-dependent and must be measured. Accessibility, slip resistance, trip risk, durability and maintenance require testing.',tags:['Footfall pressure','Tile displacement','Transducer','Rectifier / storage','Pathway lighting']},
    thermal:{n:'09',category:'SOLAR / THERMAL',title:'Solar canopy and thermal mitigation',asset:'thesis-concept-thermal-canopy.svg',desc:'PV shade with passive heat-mitigation measures. A cooler surface or absorbed heat is not automatically electrical power. PV production and thermal comfort require separate site measurements.',tags:['Solar radiation','PV / canopy','Passive shade','Airflow','Nearby loads']},
    vibration:{n:'10',category:'VIBRATION / SENSING',title:'Vibration and acoustic concept',asset:'thesis-concept-vibration.svg',desc:'Shows structural vibration sensing with an optional low-power transducer. Monitoring and noise control are separate engineering tasks; energy recovery must not compromise fatigue life or safe vibration limits.',tags:['Structural vibration','Sensor / transducer','Signal conditioning','Optional storage','Monitoring loads']},
    station:{n:'11',category:'RESILIENCE / SERVICE',title:'Resilience and service station',asset:'thesis-concept-resilience-station.svg',desc:'A generic remote infrastructure service point with solar-assisted power, storage, communications and an inspection dock. It is a planning concept, not a live operational station or coverage guarantee.',tags:['PV / recovered input','Power conversion','Battery storage','Approved sensors / comms','Inspection / maintenance']}
  };
  const defaults = {lcsMass:900,lcsV1:20,lcsV2:15,lcsRoadEff:20,lcsEvents:210000,lcsSites:100,lcsFlow:5,lcsHead:1.5,lcsHydEff:70,lcsHydHours:2000,lcsPv:100,lcsYield:1400,lcsBattery:1000,lcsDod:85,lcsBatEff:92,lcsLoad:250};
  const state = {scene:'integrated',playing:!window.matchMedia('(prefers-reduced-motion: reduce)').matches,phase:0,last:0,width:0,height:0,visible:true,raf:0};
  const nice = (n,d=2) => Number.isFinite(n) ? new Intl.NumberFormat(undefined,{maximumFractionDigits:d,minimumFractionDigits:0}).format(n) : 'CHECK INPUT';
  const set = (id,value) => {const el=$(id);if(el)el.textContent=value;};

  function chooseScene(id) {
    const scene=scenes[id]||scenes.integrated; state.scene=id in scenes?id:'integrated';
    const img=$('lcsMainImage'); if(img){img.src=scene.asset;img.alt=scene.title+': conceptual illustration, not to scale';img.onerror=()=>{img.alt=scene.title+' illustration could not load. The concept notes and flow overlay remain available.';};}
    set('lcsSceneNumber',`CONCEPT ${scene.n} · ${scene.category}`);set('lcsSceneTitle',scene.title);set('lcsSceneDescription',scene.desc);set('lcsVisualRef','Concept reference asset · '+scene.asset);
    const tags=$('lcsFlowTags');if(tags){tags.replaceChildren();scene.tags.forEach(text=>{const span=document.createElement('span');span.textContent=text;tags.append(span);});}
    root.querySelectorAll('[data-lcs-scene]').forEach(btn=>btn.setAttribute('aria-pressed',String(btn.dataset.lcsScene===state.scene)));
    // Keep the existing thesis scene in sync when its matching button exists.
    const old=document.querySelector(`#thesisVisualLab [data-thesis-scene="${state.scene}"]`);if(old)old.click();
    state.phase=0; draw();
  }
  function calculate() {
    const v={};Object.keys(defaults).forEach(id=>{const el=$(id);v[id]=el&&el.value.trim()!==''?Number(el.value):NaN;});
    const ranges={lcsMass:[0,1e7],lcsV1:[0,500],lcsV2:[0,500],lcsRoadEff:[0,100],lcsEvents:[0,1e8],lcsSites:[0,1e6],lcsFlow:[0,1e5],lcsHead:[0,1e4],lcsHydEff:[0,100],lcsHydHours:[0,8760],lcsPv:[0,1e7],lcsYield:[0,5000],lcsBattery:[0,1e8],lcsDod:[0,100],lcsBatEff:[0,100],lcsLoad:[0,1e7]};
    let valid=true;for(const [id,n] of Object.entries(v)){const [lo,hi]=ranges[id];if(!Number.isFinite(n)||n<lo||n>hi)valid=false;}
    if(v.lcsV2>v.lcsV1)valid=false;
    if(!valid){['lcsRoadAnnual','lcsHydPower','lcsPvAnnual','lcsBatteryHours','lcsGrossEvent','lcsNetEvent','lcsHydAnnual','lcsCombined'].forEach(id=>set(id,'CHECK INPUT'));set('lcsUpdatedAt','Fix inputs; exit speed must not exceed entry speed');return;}
    const m=v.lcsMass,v1=v.lcsV1/3.6,v2=v.lcsV2/3.6;
    const grossJ=Math.max(0,.5*m*(v1*v1-v2*v2));const netJ=grossJ*v.lcsRoadEff/100;
    const roadKWh=grossJ/3600000*(v.lcsRoadEff/100)*v.lcsEvents*v.lcsSites;
    const hydKW=9.80665*v.lcsFlow*v.lcsHead*(v.lcsHydEff/100);const hydKWh=hydKW*v.lcsHydHours;
    const pvKWh=v.lcsPv*v.lcsYield;const batteryHours=v.lcsLoad>0?v.lcsBattery*(v.lcsDod/100)*(v.lcsBatEff/100)/v.lcsLoad:NaN;
    const combinedMWh=(roadKWh+hydKWh+pvKWh)/1000;
    set('lcsRoadAnnual',nice(roadKWh/1000)+' MWh/y');set('lcsHydPower',nice(hydKW)+' kW');set('lcsPvAnnual',nice(pvKWh/1000)+' MWh/y');set('lcsBatteryHours',Number.isFinite(batteryHours)?nice(batteryHours)+' h':'NO LOAD');
    set('lcsGrossEvent',nice(grossJ/3600000,7));set('lcsNetEvent',nice(netJ/1000,4));set('lcsHydAnnual',nice(hydKWh/1000));set('lcsCombined',nice(combinedMWh));
    set('lcsUpdatedAt',new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit',second:'2-digit'}));
    const model={roadScenarioMWhPerYear:roadKWh/1000,hydraulicPowerKW:hydKW,hydraulicScenarioMWhPerYear:hydKWh/1000,pvScenarioMWhPerYear:pvKWh/1000,batteryAutonomyHours:Number.isFinite(batteryHours)?batteryHours:null,combinedScenarioMWhPerYear:combinedMWh,kind:'scenario-only',assumptions:v};
    root.dataset.lcsScenario=JSON.stringify(model);
    root.dispatchEvent(new CustomEvent('igers:concept-silo-calculated',{detail:model}));
  }
  function resize() {
    const c=$('lcsFlowCanvas');if(!c)return;const rect=c.getBoundingClientRect();if(rect.width<1||rect.height<1)return;
    const dpr=Math.max(1,Math.min(2,window.devicePixelRatio||1));state.width=rect.width;state.height=rect.height;c.width=Math.round(rect.width*dpr);c.height=Math.round(rect.height*dpr);const ctx=c.getContext('2d');if(ctx)ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  function draw() {
    const c=$('lcsFlowCanvas');if(!c)return;const ctx=c.getContext('2d');if(!ctx||!state.width||!state.height)return;
    const w=state.width,h=state.height;ctx.clearRect(0,0,w,h);const scale=Math.min(w/800,h/450),cx=w*.5,cy=h*.53;const routes=[[[cx-w*.35,cy+h*.03],[cx-w*.17,cy-h*.15],[cx-w*.04,cy+h*.15],[cx+w*.1,cy+h*.02]],[[cx-w*.08,cy+h*.01],[cx+w*.06,cy-h*.18],[cx+w*.19,cy+h*.16],[cx+w*.34,cy+h*.04]],[[cx-w*.32,cy+h*.25],[cx-w*.14,cy+h*.13],[cx+w*.04,cy+h*.25],[cx+w*.24,cy+h*.14]]];
    routes.forEach((p,i)=>{ctx.beginPath();ctx.moveTo(p[0][0],p[0][1]);ctx.bezierCurveTo(p[1][0],p[1][1],p[2][0],p[2][1],p[3][0],p[3][1]);ctx.setLineDash([4*scale,7*scale]);ctx.lineWidth=Math.max(1,1.2*scale);ctx.strokeStyle=i===1?'rgba(131,240,185,.65)':'rgba(83,221,255,.58)';ctx.stroke();ctx.setLineDash([]);const t=((state.phase*.17+i*.31)%1),u=1-t;const x=u*u*u*p[0][0]+3*u*u*t*p[1][0]+3*u*t*t*p[2][0]+t*t*t*p[3][0],y=u*u*u*p[0][1]+3*u*u*t*p[1][1]+3*u*t*t*p[2][1]+t*t*t*p[3][1];ctx.beginPath();ctx.arc(x,y,Math.max(2,3*scale),0,Math.PI*2);ctx.fillStyle=i===1?'#83f0b9':'#53ddff';ctx.shadowColor=ctx.fillStyle;ctx.shadowBlur=10*scale;ctx.fill();ctx.shadowBlur=0;});
  }
  function frame(t){if(!document.documentElement.contains(root))return;const dt=state.last?Math.min(.05,(t-state.last)/1000):0;state.last=t;if(state.playing&&state.visible)state.phase+=dt*1.8;draw();state.raf=requestAnimationFrame(frame);}
  root.querySelectorAll('[data-lcs-scene]').forEach(btn=>btn.addEventListener('click',()=>chooseScene(btn.dataset.lcsScene)));
  $('lcsPlayToggle')?.addEventListener('click',()=>{state.playing=!state.playing;const b=$('lcsPlayToggle');b.textContent=state.playing?'Ⅱ Pause animation':'▶ Play animation';b.setAttribute('aria-pressed',String(state.playing));set('lcsModelState',state.playing?'CONCEPT SIMULATION RUNNING':'SIMULATION PAUSED');set('lcsAnimBadge',state.playing?'ANIMATION RUNNING':'ANIMATION PAUSED');});
  $('lcsReset')?.addEventListener('click',()=>{chooseScene('integrated');state.phase=0;state.playing=true;const toggle=$('lcsPlayToggle');if(toggle){toggle.textContent='Ⅱ Pause animation';toggle.setAttribute('aria-pressed','true');}set('lcsModelState','CONCEPT SIMULATION RUNNING');set('lcsAnimBadge','ANIMATION RUNNING');calculate();});
  $('lcsRecalc')?.addEventListener('click',calculate);Object.keys(defaults).forEach(id=>$(id)?.addEventListener('input',calculate));
  $('lcsDefaults')?.addEventListener('click',()=>{Object.entries(defaults).forEach(([id,value])=>{const e=$(id);if(e)e.value=String(value);});calculate();});
  window.addEventListener('resize',resize,{passive:true});if('IntersectionObserver' in window){const io=new IntersectionObserver(entries=>{state.visible=Boolean(entries[0]?.isIntersecting);},{threshold:.05});io.observe(root);}
  resize();chooseScene('integrated');calculate();
  // This runs after app-shell.js in script order, so the new feature is also visible from the home dashboard.
  function addHomeShortcut(attempt=0){
    const home=$('iasHomeView');
    if(!home){if(attempt<30)setTimeout(()=>addHomeShortcut(attempt+1),100);return;}
    if(home.querySelector('.lcs-home-shortcut'))return;
    const shortcut=document.createElement('a');shortcut.className='lcs-home-shortcut';shortcut.href='#liveConceptSilo';
    shortcut.innerHTML='<span class="lcs-home-icon" aria-hidden="true">⬡</span><span><strong>LIVE CONCEPTUAL APPLICATION SILO · 11 VISUALS</strong><small>Open the dedicated 3D concept library, animation controls and live scenario calculator.</small></span><span class="lcs-home-arrow" aria-hidden="true">↗</span>';
    const bar=home.querySelector('.ias-dashboard-bar');
    if(bar)bar.insertAdjacentElement('afterend',shortcut);else home.prepend(shortcut);
  }
  addHomeShortcut();
  state.raf=requestAnimationFrame(frame);
})();
