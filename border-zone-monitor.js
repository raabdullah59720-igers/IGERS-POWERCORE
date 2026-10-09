/* IGERS Border Zone 3D Monitor
 * Additive, browser-safe visualization layer.
 * Uses public Earth-observation imagery and public ADS-B-derived aircraft states where available.
 * It does NOT access or infer private mobile-device positions or military/security sensor feeds.
 */
(function initBorderZoneMonitor(){
  'use strict';
  if(window.__igersBorderZoneMonitorLoaded)return;
  window.__igersBorderZoneMonitorLoaded=true;
  const $=id=>document.getElementById(id);
  const esc=v=>String(v??'').replace(/[&<>"']/g,s=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
  const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
  const now=()=>new Date();
  const time=()=>now().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',second:'2-digit'});
  const fallbackZones=[
    {name:'Northwest',desc:'border corridor',x:.18,y:.30,score:62},
    {name:'North',desc:'Rangpur corridor',x:.37,y:.18,score:48},
    {name:'Northeast',desc:'Sylhet corridor',x:.76,y:.24,score:55},
    {name:'East',desc:'Brahmanbaria corridor',x:.82,y:.47,score:71},
    {name:'Southeast',desc:'Chattogram hill corridor',x:.72,y:.72,score:43},
    {name:'Southwest',desc:'Khulna corridor',x:.19,y:.70,score:67}
  ];

  function gibsUrl(minutesBack=0){
    const d=new Date(Date.now()-minutesBack*60000);
    d.setUTCSeconds(0,0);
    d.setUTCMinutes(Math.floor(d.getUTCMinutes()/10)*10);
    const iso=d.toISOString();
    const p=new URLSearchParams({SERVICE:'WMS',VERSION:'1.1.1',REQUEST:'GetMap',LAYERS:'Himawari_AHI_Band13_Clean_Infrared',STYLES:'',FORMAT:'image/jpeg',SRS:'EPSG:4326',BBOX:'88,20,93,27',WIDTH:'1200',HEIGHT:'780',TIME:iso});
    return 'https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?'+p.toString();
  }

  function build(){
    const anchor=$('satelliteMonitor');
    if(!anchor||$('borderZoneMonitor'))return;
    const nav=document.querySelector('.navlinks');
    const navGroup=nav?.querySelector('[data-nav-group="air-border"]')||nav;
    if(navGroup&&!navGroup.querySelector('a[href="#borderZoneMonitor"]')){
      const a=document.createElement('a');a.href='#borderZoneMonitor';a.textContent='Border Zone 3D';navGroup.appendChild(a);
    }
    const section=document.createElement('section');
    section.id='borderZoneMonitor';section.className='bzm-section';
    section.innerHTML=`<div class="wrap"><div class="section-head"><div><div class="kicker">08D · Bangladesh border-zone visualization</div><h2>BORDER ZONE 3D GROUND + AIR MONITOR</h2><p class="mini">Public Earth-observation imagery + public ADS-B-derived aircraft states + non-identifying network-coverage visualization.</p></div><span class="eyebrow"><span class="pulse"></span>LIVE MONITOR LAYER</span></div>
      <div class="bzm-shell">
        <div class="bzm-topbar"><div class="bzm-top-status"><i id="bzmStateDot" class="bzm-dot"></i><span id="bzmSystemState">SYSTEM STARTING</span></div><div class="bzm-actions"><button id="bzmGroundBtn" class="btn primary" type="button">GROUND ON</button><button id="bzmAirBtn" class="btn secondary" type="button">AIR ON</button><button id="bzmSatBtn" class="btn secondary" type="button">SATELLITE ON</button><button id="bzmResetBtn" class="btn secondary" type="button">RESET VIEW</button></div></div>
        <div class="bzm-grid">
          <div class="bzm-viewport"><canvas id="bzmCanvas" class="bzm-canvas" aria-label="3D border-zone radar visualization"></canvas><img id="bzmSatImage" class="bzm-satellite-image off" alt="NASA public Earth observation layer over Bangladesh"/><div class="bzm-vignette"></div>
            <div class="bzm-hud"><div class="bzm-hud-box"><b>ZONE MODE</b><strong id="bzmMode">GROUND + AIR</strong></div><div class="bzm-hud-box"><b>SYNC</b><strong id="bzmSync">--:--:--</strong></div><div class="bzm-hud-box"><b>PUBLIC DATA</b><strong id="bzmDataHealth">CHECKING</strong></div></div>
            <div class="bzm-legend"><div class="bzm-legend-card"><b>VISUAL KEY</b><span>cyan = coverage / public feed · green = healthy · amber = stale / simulation</span></div><div class="bzm-legend-card"><b>AIR SOURCE</b><span id="bzmAirSource">Waiting for existing ADS-B module…</span></div></div>
          </div>
          <aside class="bzm-side">
            <article class="bzm-card"><div class="label">LIVE MONITOR HEALTH</div><div class="bzm-stat-grid"><div class="bzm-stat"><b>AIR STATES</b><strong id="bzmAirCount">--</strong><span>public position states</span></div><div class="bzm-stat"><b>GROUND ZONES</b><strong id="bzmGroundCount">6</strong><span>visual coverage sectors</span></div><div class="bzm-stat"><b>SIGNAL INDEX</b><strong id="bzmSignalIndex">--</strong><span>aggregate/demo layer</span></div><div class="bzm-stat"><b>DATA AGE</b><strong id="bzmDataAge">--</strong><span>newest air state</span></div></div><div class="bzm-source"><b>Satellite observation</b><span id="bzmSatState" class="bzm-feed-warn">CHECKING</span></div><div class="bzm-source"><b>ADS-B feed</b><span id="bzmAirState" class="bzm-feed-warn">WAITING</span></div><div class="bzm-source"><b>Network layer</b><span class="bzm-feed-warn">AGGREGATE / DEMO</span></div></article>
            <article class="bzm-card"><div class="label">GROUND COVERAGE / SIGNAL</div><div class="bzm-mobile-band"><div class="bzm-signal-row"><i></i><i></i><i></i><i></i><i></i></div><div class="bzm-signal-label"><span>WEAK</span><span>MEDIUM</span><span>STRONG</span></div></div><div class="bzm-meter"><i id="bzmSignalMeter"></i></div><div class="bzm-zone-list" id="bzmZoneList"></div><div class="bzm-note"><span class="bzm-activity-chip bzm-locked"><i></i>Non-identifying aggregate layer</span><br>Individual phone/device locations are not collected or inferred. Real telecom coverage/activity requires an authorised operator feed.</div></article>
            <article class="bzm-card"><div class="label">SATELLITE OBSERVATION</div><div class="bzm-sat-preview"><img id="bzmSatThumb" alt="NASA public satellite observation preview"><div class="bzm-sat-overlay"><span id="bzmSatLayerLabel">Himawari AHI Band 13 · NASA GIBS</span><span id="bzmSatAgeLabel">--</span></div></div><div class="bzm-source"><b>Last image request</b><span id="bzmSatSync">--</span></div><div class="bzm-source"><b>Observation state</b><span id="bzmSatHealth">WAITING</span></div></article>
            <article class="bzm-card"><div class="label">LAYER CONTROL</div><div class="bzm-layer-row"><span>Ground coverage</span><button class="bzm-switch on" data-layer="ground" aria-label="Toggle ground layer"><i></i></button></div><div class="bzm-layer-row"><span>Public ADS-B air layer</span><button class="bzm-switch on" data-layer="air" aria-label="Toggle air layer"><i></i></button></div><div class="bzm-layer-row"><span>Satellite image</span><button class="bzm-switch on" data-layer="sat" aria-label="Toggle satellite image"><i></i></button></div><div class="bzm-note">Radar sweep is a visualization layer. It does not constitute a live military radar or border-surveillance feed.</div></article>
          </aside>
        </div>
        <div class="bzm-footer"><div class="bzm-footnote"><strong>Update model:</strong> canvas visualisation runs each animation frame; external providers keep their own safe update cadence.</div><div class="bzm-mini-actions"><button id="bzmSatRefresh" class="btn secondary" type="button">↻ Refresh satellite image</button><a class="btn secondary" href="https://worldview.earthdata.nasa.gov/" target="_blank" rel="noopener noreferrer">Open NASA Worldview</a></div></div>
      </div></div>`;
    anchor.insertAdjacentElement('afterend',section);
  }

  function initCanvas(){
    const canvas=$('bzmCanvas');if(!canvas)return null;const ctx=canvas.getContext('2d');if(!ctx)return null;
    const state={ground:true,air:true,sat:true,angle:-1.05,last:performance.now()};
    function size(){const r=canvas.getBoundingClientRect(),dpr=Math.min(window.devicePixelRatio||1,2);canvas.width=Math.max(1,Math.floor(r.width*dpr));canvas.height=Math.max(1,Math.floor(r.height*dpr));ctx.setTransform(dpr,0,0,dpr,0,0);state.w=r.width;state.h=r.height;}
    const resize=()=>size();window.addEventListener('resize',resize,{passive:true});size();

    function project(x,y,z=0){const w=state.w,h=state.h;const cx=w*.50,cy=h*.54;const sx=w*.36,sy=h*.25;return {x:cx+(x-.5)*sx+(z*.10),y:cy+(y-.5)*sy-z*65};}
    function drawGrid(){
      const w=state.w,h=state.h;ctx.save();ctx.globalAlpha=.34;ctx.strokeStyle='#55ddff';ctx.lineWidth=1;
      for(let i=0;i<11;i++){const p1=project(i/10,.12,0),p2=project(i/10,.88,0);ctx.beginPath();ctx.moveTo(p1.x,p1.y);ctx.lineTo(p2.x,p2.y);ctx.stroke();}
      for(let j=0;j<9;j++){const p1=project(.08,j/8,0),p2=project(.92,j/8,0);ctx.beginPath();ctx.moveTo(p1.x,p1.y);ctx.lineTo(p2.x,p2.y);ctx.stroke();}
      ctx.globalAlpha=.11;ctx.strokeStyle='#8af3bf';for(let z=1;z<=4;z++){const y=.88-z*.08,p1=project(.08,y,z),p2=project(.92,y,z);ctx.beginPath();ctx.moveTo(p1.x,p1.y);ctx.lineTo(p2.x,p2.y);ctx.stroke();}
      ctx.restore();
    }
    function drawBangladeshEnvelope(){
      const poly=[[.20,.27],[.33,.20],[.49,.15],[.67,.20],[.79,.32],[.86,.46],[.79,.67],[.67,.78],[.51,.73],[.40,.81],[.24,.70],[.17,.52],[.20,.27]];
      ctx.save();ctx.lineWidth=2;ctx.strokeStyle='#55ddff';ctx.fillStyle='rgba(85,221,255,.055)';ctx.shadowBlur=14;ctx.shadowColor='rgba(85,221,255,.4)';
      ctx.beginPath();poly.forEach((v,i)=>{const p=project(v[0],v[1],2);if(i===0)ctx.moveTo(p.x,p.y);else ctx.lineTo(p.x,p.y);});ctx.closePath();ctx.fill();ctx.stroke();ctx.shadowBlur=0;
      ctx.setLineDash([6,7]);ctx.lineWidth=1;ctx.strokeStyle='#ffd37a';ctx.globalAlpha=.65;ctx.beginPath();poly.forEach((v,i)=>{const p=project(v[0],v[1],2.25);if(i===0)ctx.moveTo(p.x,p.y);else ctx.lineTo(p.x,p.y);});ctx.closePath();ctx.stroke();ctx.restore();
    }
    function drawRadar(){
      if(!state.ground&&!state.air)return;const w=state.w,h=state.h;const cx=w*.5,cy=h*.54;const r=Math.min(w,h)*.27;ctx.save();ctx.translate(cx,cy);ctx.strokeStyle='#55ddff';ctx.globalAlpha=.18;ctx.lineWidth=1;for(let k=1;k<=4;k++){ctx.beginPath();ctx.arc(0,0,r*k/4,0,Math.PI*2);ctx.stroke();}ctx.beginPath();ctx.moveTo(-r,0);ctx.lineTo(r,0);ctx.moveTo(0,-r);ctx.lineTo(0,r);ctx.stroke();ctx.rotate(state.angle);const grad=ctx.createRadialGradient(0,0,0,0,0,r);grad.addColorStop(0,'rgba(138,243,191,.00)');grad.addColorStop(.73,'rgba(85,221,255,.02)');grad.addColorStop(1,'rgba(85,221,255,.15)');ctx.fillStyle=grad;ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,r,-.18,.18);ctx.closePath();ctx.fill();ctx.restore();
    }
    function drawZones(t){
      if(!state.ground)return;fallbackZones.forEach((z,i)=>{const pulse=.65+.35*Math.sin(t*.002+i);const p=project(z.x,z.y,2.5);ctx.save();ctx.globalAlpha=.85;ctx.fillStyle=i%3===1?'#ffd37a':'#8af3bf';ctx.shadowBlur=12+10*pulse;ctx.shadowColor=ctx.fillStyle;ctx.beginPath();ctx.arc(p.x,p.y,4+2*pulse,0,Math.PI*2);ctx.fill();ctx.restore();});
    }
    function drawAir(){
      if(!state.air)return;const list=Array.isArray(window.__igersAirTrafficSnapshot)?window.__igersAirTrafficSnapshot:[];const valid=list.filter(a=>Number.isFinite(Number(a?.lat))&&Number.isFinite(Number(a?.lon))).slice(0,80);valid.forEach((a,i)=>{const nx=clamp((Number(a.lon)-88)/5,.04,.96),ny=clamp((27-Number(a.lat))/7,.06,.94),p=project(nx,ny,4.5+clamp((Number(a.alt)||0)/12000,0,5));ctx.save();ctx.fillStyle='#55ddff';ctx.shadowColor='#55ddff';ctx.shadowBlur=10;ctx.beginPath();ctx.arc(p.x,p.y,3.3,0,Math.PI*2);ctx.fill();ctx.font='8px system-ui,sans-serif';ctx.shadowBlur=0;ctx.fillStyle='rgba(218,243,250,.8)';if(i<18)ctx.fillText((a.callsign||a.hex||'AIR').trim().slice(0,7),p.x+5,p.y-4);ctx.restore();});
    }
    function drawSatelliteNode(){const p=project(.74,.22,8.5),q=project(.50,.50,2.2);ctx.save();ctx.strokeStyle='#8af3bf';ctx.globalAlpha=.45;ctx.setLineDash([3,5]);ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle='#8af3bf';ctx.shadowColor='#8af3bf';ctx.shadowBlur=16;ctx.beginPath();ctx.arc(p.x,p.y,5,0,Math.PI*2);ctx.fill();ctx.restore();}
    function frame(ts){const dt=Math.max(0,ts-state.last);state.last=ts;state.angle+=dt*.00115;ctx.clearRect(0,0,state.w,state.h);drawGrid();drawBangladeshEnvelope();drawRadar();drawZones(ts);drawAir();drawSatelliteNode();requestAnimationFrame(frame);}requestAnimationFrame(frame);
    return state;
  }

  function renderZones(){
    const root=$('bzmZoneList');if(!root)return;root.innerHTML=fallbackZones.map((z,i)=>{const drift=Math.round(clamp(z.score+8*Math.sin(Date.now()/15000+i),20,92));const warn=drift>72||drift<30;return `<div class="bzm-zone"><i class="led ${warn?'warn':''}"></i><div><b>${esc(z.name)}</b><small>${esc(z.desc)} · visual sector</small></div><em>${drift}%</em></div>`;}).join('');
    const avg=Math.round(fallbackZones.reduce((s,z)=>s+clamp(z.score+8*Math.sin(Date.now()/15000+fallbackZones.indexOf(z)),20,92),0)/fallbackZones.length);if($('bzmSignalIndex'))$('bzmSignalIndex').textContent=avg+'%';if($('bzmSignalMeter'))$('bzmSignalMeter').style.width=avg+'%';
  }

  let satTimer=null, satRefreshTimer=null, satReadyAt=0;
  function setSatState(kind,text){const e=$('bzmSatState');if(e){e.textContent=text;e.className=kind==='good'?'bzm-feed-good':kind==='bad'?'bzm-feed-bad':'bzm-feed-warn';}const h=$('bzmSatHealth');if(h){h.textContent=text;h.className=kind==='good'?'bzm-feed-good':kind==='bad'?'bzm-feed-bad':'bzm-feed-warn';}}
  function loadSatelliteImage(attempt=0){
    clearTimeout(satTimer);const candidates=[0,10,20,30,40,50,60];const back=candidates[Math.min(attempt,candidates.length-1)];const url=gibsUrl(back);const img=$('bzmSatImage'),thumb=$('bzmSatThumb');if(!img||!thumb)return;
    clearTimeout(satRefreshTimer);
    satReadyAt=0;
    window.__igersBorderSatelliteState={status:'checking',requestedAt:Date.now()};
    setSatState('warn','CHECKING GIBS');$('bzmSatSync').textContent='requesting '+time();
    const probe=new Image();let done=false;const timeout=setTimeout(()=>{if(!done){done=true;if(attempt<candidates.length-1)loadSatelliteImage(attempt+1);else{setSatState('bad','GIBS UNAVAILABLE');img.classList.add('off');$('bzmSatSync').textContent='failed '+time();window.__igersBorderSatelliteState={status:'offline',requestedAt:Date.now()};syncAir();satRefreshTimer=setTimeout(()=>loadSatelliteImage(),600000);}}},9000);
    probe.onload=()=>{if(done)return;done=true;clearTimeout(timeout);img.src=probe.src;thumb.src=probe.src;img.classList.remove('off');satReadyAt=Date.now();window.__igersBorderSatelliteState={status:'ready',requestedAt:Date.now(),readyAt:satReadyAt,lookbackMinutes:back};setSatState('good','IMAGE READY');$('bzmSatSync').textContent=time();$('bzmSatAgeLabel').textContent=(back?back+' min lookback':'current 10-min slot');$('bzmSatHealth').textContent='PUBLIC EARTH OBSERVATION';syncAir();satRefreshTimer=setTimeout(()=>loadSatelliteImage(),600000);};
    probe.onerror=()=>{if(done)return;done=true;clearTimeout(timeout);if(attempt<candidates.length-1)loadSatelliteImage(attempt+1);else{setSatState('bad','GIBS UNAVAILABLE');img.classList.add('off');window.__igersBorderSatelliteState={status:'offline',requestedAt:Date.now()};syncAir();satRefreshTimer=setTimeout(()=>loadSatelliteImage(),600000);}};probe.src=url+'&_='+Date.now();
  }

  function syncAir(){
    const list=Array.isArray(window.__igersAirTrafficSnapshot)?window.__igersAirTrafficSnapshot:[];const withPos=list.filter(a=>Number.isFinite(Number(a?.lat))&&Number.isFinite(Number(a?.lon)));const count=withPos.length;
    const hasSnapshot=Number.isFinite(Number(window.__igersAirTrafficSnapshotAt));
    $('bzmAirCount')&&($('bzmAirCount').textContent=hasSnapshot?String(count):'--');
    const ageEl=$('airAge')?.textContent||'--';$('bzmDataAge')&&($('bzmDataAge').textContent=ageEl);
    const health=$('airFeedState')?.textContent||'WAITING';$('bzmAirState')&&( $('bzmAirState').textContent=health.replace(/^●\s*/,'') );$('bzmAirState')&&( $('bzmAirState').className=health.includes('LIVE')?'bzm-feed-good':health.includes('OFFLINE')?'bzm-feed-bad':'bzm-feed-warn');
    $('bzmAirSource')&&( $('bzmAirSource').textContent=count?'PUBLIC ADS-B · EXISTING IGERS FEED':'Waiting for existing ADS-B module…' );
    const syncText=$('airLastSync')?.textContent||'--';if($('bzmSync'))$('bzmSync').textContent=syncText.replace(/^Last sync:\s*/,'')||time();
    const satLive=$('bzmSatState')?.textContent||'';
    const airAt=Number(window.__igersAirTrafficSnapshotAt||0),airAgeSec=airAt?Math.max(0,(Date.now()-airAt)/1000):Infinity;
    const airFresh=airAgeSec<=45, airDegraded=airAgeSec<=120;
    if($('bzmDataHealth'))$('bzmDataHealth').textContent=(satLive.includes('IMAGE READY')&&airFresh)?'CONNECTED':((satLive.includes('IMAGE READY')||airFresh||airDegraded)?'PARTIAL':'WAITING');
  }

  function bindLayers(state){
    document.querySelectorAll('.bzm-switch').forEach(btn=>btn.addEventListener('click',()=>{const k=btn.dataset.layer;state[k]=!state[k];btn.classList.toggle('on',state[k]);if(state[k])btn.classList.add('on');}));
    $('bzmGroundBtn')?.addEventListener('click',()=>{state.ground=!state.ground;const b=$('bzmGroundBtn');b.textContent=state.ground?'GROUND ON':'GROUND OFF';b.className=state.ground?'btn primary':'btn secondary';document.querySelector('[data-layer="ground"]')?.classList.toggle('on',state.ground);});
    $('bzmAirBtn')?.addEventListener('click',()=>{state.air=!state.air;const b=$('bzmAirBtn');b.textContent=state.air?'AIR ON':'AIR OFF';b.className=state.air?'btn primary':'btn secondary';document.querySelector('[data-layer="air"]')?.classList.toggle('on',state.air);});
    $('bzmSatBtn')?.addEventListener('click',()=>{state.sat=!state.sat;const b=$('bzmSatBtn');b.textContent=state.sat?'SATELLITE ON':'SATELLITE OFF';b.className=state.sat?'btn primary':'btn secondary';$('bzmSatImage')?.classList.toggle('off',!state.sat);document.querySelector('[data-layer="sat"]')?.classList.toggle('on',state.sat);});
    $('bzmResetBtn')?.addEventListener('click',()=>{state.ground=true;state.air=true;state.sat=true;document.querySelectorAll('.bzm-switch').forEach(x=>x.classList.add('on'));$('bzmGroundBtn').textContent='GROUND ON';$('bzmGroundBtn').className='btn primary';$('bzmAirBtn').textContent='AIR ON';$('bzmAirBtn').className='btn primary';$('bzmSatBtn').textContent='SATELLITE ON';$('bzmSatBtn').className='btn primary';loadSatelliteImage();});
    $('bzmSatRefresh')?.addEventListener('click',()=>loadSatelliteImage());
  }

  let uiLast=0;
  function tick(state){
    const t=Date.now();
    if(t-uiLast>=1000){uiLast=t;renderZones();syncAir();}
    const system=$('bzmSystemState'),dot=$('bzmStateDot');const sat=$('bzmSatState')?.textContent||'';const air=$('bzmAirState')?.textContent||'';const satReady=sat.includes('IMAGE READY');const satBad=sat.includes('UNAVAILABLE');const airAt=Number(window.__igersAirTrafficSnapshotAt||0),airAgeSec=airAt?Math.max(0,(Date.now()-airAt)/1000):Infinity;const airLive=airAgeSec<=45;const airDegraded=airAgeSec<=120;const airCount=Array.isArray(window.__igersAirTrafficSnapshot)?window.__igersAirTrafficSnapshot.length:0;
    if(system){if(airLive&&satReady)system.textContent='RADAR SEARCH ACTIVE · AIR '+airCount+' · SATELLITE READY';else if(airLive)system.textContent='RADAR SEARCH ACTIVE · AIR '+airCount;else if(airDegraded||satReady)system.textContent='RADAR SEARCH · PARTIAL PUBLIC DATA';else if(satBad||air.includes('OFFLINE'))system.textContent='RADAR SWEEP ACTIVE · NO LIVE FEED';else system.textContent='RADAR SWEEP ACTIVE · CONNECTING';}
    if(dot){dot.className='bzm-dot'+(airLive&&satReady?'':(airDegraded||satReady?' warn':(satBad||air.includes('OFFLINE')?' off':' warn')));}
    if($('bzmMode'))$('bzmMode').textContent=state.ground&&state.air?'GROUND + AIR':state.ground?'GROUND':'AIR';
    if($('bzmSync'))$('bzmSync').textContent=time();
    requestAnimationFrame(()=>tick(state));
  }

  function start(){build();const state=initCanvas();if(!state)return;bindLayers(state);renderZones();loadSatelliteImage();syncAir();tick(state);window.__igersBorderZoneMonitor='2026.10.05-public-data-3d';}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
