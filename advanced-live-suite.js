/* IGERS POWERCORE — Advanced Live 3D Monitoring Suite
 * Additive-only module. Public-data integrations are read-only. Defence/tower controls are simulation-only.
 */
(function(){
  'use strict';
  const $ = (id) => document.getElementById(id);
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const nowTime = () => new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',second:'2-digit'});
  const fmtNum = (v,d=1) => Number.isFinite(Number(v)) ? Number(v).toFixed(d) : '—';
  const rad = (d)=>d*Math.PI/180, deg=(r)=>r*180/Math.PI;
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

  const state = {
    air: [], selectedAir: null, quakes: [], marine: null, marineSite: 'chattogram',
    plates: [], googleReady:false, geo:null, prayers:null, qibla:null,
    tower: [], emergency:null, admin:false, concept:null,
    googleKey: localStorageSafe('igersGoogle3dKey') || ''
  };

  function localStorageSafe(k, value){
    try{if(value===undefined)return localStorage.getItem(k); localStorage.setItem(k,value);return value;}catch(_){return value===undefined?null:null;}
  }
  function sessionHasAdmin(){
    try{
      return sessionStorage.getItem('igersEnergyAdminV1')==='1' || sessionStorage.getItem('igersAdvancedAdminV1')==='1';
    }catch(_){return false;}
  }
  function setAdminSession(){try{sessionStorage.setItem('igersAdvancedAdminV1','1');}catch(_){} state.admin=true; syncAdminUI();}
  function clearAdminSession(){try{sessionStorage.removeItem('igersAdvancedAdminV1');}catch(_){} state.admin=false; syncAdminUI();}
  function getExistingEnergyPasswordHint(){return window.__IGERS_ADMIN_PASSWORD__ || '';}
  // The current static app uses a shared prototype password inside energy-live-update.js.
  // We keep this comparison isolated so the advanced UI never claims production security.
  function tryAdminPassword(p){
    const env=getExistingEnergyPasswordHint();
    if(env && p===env)return true;
    return p==='MIM2005';
  }
  function syncAdminUI(){
    document.querySelectorAll('[data-als-admin-only]').forEach(el=>el.classList.toggle('als-hidden',!state.admin));
    const lock=$('alsAdminLock'); if(lock)lock.classList.toggle('als-hidden',state.admin);
    const s=$('alsAdminState'); if(s){s.textContent=state.admin?'UNLOCKED':'LOCKED';s.className='als-pill '+(state.admin?'on':'off');}
  }

  function notify(title,body,tag='igers-advanced'){
    if(!('Notification' in window))return Promise.resolve(false);
    const send=()=>{try{new Notification(title,{body,tag});return true;}catch(_){return false;}};
    if(Notification.permission==='granted') return Promise.resolve(send());
    if(Notification.permission==='default') return Notification.requestPermission().then(p=>p==='granted'?send():false).catch(()=>false);
    return Promise.resolve(false);
  }
  function setLive(id, kind, text){
    const e=$(id);if(!e)return;e.className='als-live '+(kind||'');e.innerHTML='<i></i>'+esc(text);
  }
  function setText(id,v){const e=$(id);if(e)e.textContent=v;}

  // ---------- 3D-like projection renderer ----------
  function sizeCanvas(canvas){
    if(!canvas)return null;
    const r=canvas.getBoundingClientRect(); const dpr=Math.min(window.devicePixelRatio||1,2);
    const w=Math.max(1,Math.round(r.width*dpr)), h=Math.max(1,Math.round(r.height*dpr));
    if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}
    const ctx=canvas.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);return {ctx,w:r.width,h:r.height};
  }
  function rotPoint(p,ry,rx){
    let x=p.x*Math.cos(ry)-p.z*Math.sin(ry), z=p.x*Math.sin(ry)+p.z*Math.cos(ry), y=p.y;
    const y2=y*Math.cos(rx)-z*Math.sin(rx), z2=y*Math.sin(rx)+z*Math.cos(rx);return {x,y:y2,z:z2};
  }
  function project(p,w,h,scale=1){
    const f=3.1, z=p.z+f, k=f/z; return {x:w/2+p.x*k*Math.min(w,h)*.9*scale,y:h/2-p.y*k*Math.min(w,h)*.9*scale,z:p.z};
  }
  function line(ctx,a,b,alpha=.18, width=1, color='#55ddff'){
    ctx.strokeStyle=color;ctx.globalAlpha=alpha;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();ctx.globalAlpha=1;
  }
  function drawGlobe(canvas, options){
    const sized=sizeCanvas(canvas);if(!sized)return;const {ctx,w,h}=sized;ctx.clearRect(0,0,w,h);
    const r=Math.min(w,h)*.29; const ry=options.rotationY||0, rx=options.rotationX||.2;
    ctx.fillStyle='#071923';ctx.beginPath();ctx.arc(w/2,h/2,r,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='rgba(85,221,255,.38)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(w/2,h/2,r,0,Math.PI*2);ctx.stroke();
    for(let lat=-75;lat<=75;lat+=15){
      const pts=[];for(let lon=-180;lon<=180;lon+=6){const la=rad(lat),lo=rad(lon);pts.push(rotPoint({x:Math.cos(la)*Math.cos(lo),y:Math.sin(la),z:Math.cos(la)*Math.sin(lo)},ry,rx));}
      for(let i=1;i<pts.length;i++){const a=project(pts[i-1],w,h,r/(Math.min(w,h)*.9)),b=project(pts[i],w,h,r/(Math.min(w,h)*.9));line(ctx,a,b,.08,1,'#55ddff');}
    }
    for(let lon=-180;lon<180;lon+=15){
      const pts=[];for(let lat=-90;lat<=90;lat+=5){const la=rad(lat),lo=rad(lon);pts.push(rotPoint({x:Math.cos(la)*Math.cos(lo),y:Math.sin(la),z:Math.cos(la)*Math.sin(lo)},ry,rx));}
      for(let i=1;i<pts.length;i++){const a=project(pts[i-1],w,h,r/(Math.min(w,h)*.9)),b=project(pts[i],w,h,r/(Math.min(w,h)*.9));line(ctx,a,b,.06,1,'#55ddff');}
    }
    if(Array.isArray(options.boundaries)){
      options.boundaries.slice(0,180).forEach(seg=>{
        const pts=Array.isArray(seg)?seg:seg?.points;if(!pts||pts.length<2)return;
        for(let i=1;i<pts.length;i++){
          const a=pts[i-1],b=pts[i];if(!Array.isArray(a)||!Array.isArray(b))continue;
          const p1=rotPoint(llxyz(a[1],a[0]),ry,rx),p2=rotPoint(llxyz(b[1],b[0]),ry,rx);
          const pa=project(p1,w,h,r/(Math.min(w,h)*.9)),pb=project(p2,w,h,r/(Math.min(w,h)*.9));
          if(p1.z>-.05||p2.z>-.05) line(ctx,pa,pb,.45,1,'#ffd37a');
        }
      });
    }
    (options.points||[]).forEach(o=>{
      const p=rotPoint(llxyz(o.lat,o.lon),ry,rx);if(p.z < -0.88)return;const q=project(p,w,h,r/(Math.min(w,h)*.9));
      const sz=o.size||3;ctx.beginPath();ctx.fillStyle=o.color||'#8af3bf';ctx.shadowColor=o.color||'#8af3bf';ctx.shadowBlur=8;ctx.arc(q.x,q.y,sz,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
      if(o.label){ctx.fillStyle='#dff7ff';ctx.font='10px system-ui';ctx.fillText(o.label,q.x+7,q.y-6);}
    });
  }
  function llxyz(lat,lon){const la=rad(lat),lo=rad(lon);return {x:Math.cos(la)*Math.cos(lo),y:Math.sin(la),z:Math.cos(la)*Math.sin(lo)};}
  function simpleGrid(canvas, cfg){
    const sized=sizeCanvas(canvas);if(!sized)return;const {ctx,w,h}=sized;ctx.clearRect(0,0,w,h);
    ctx.fillStyle='#06131b';ctx.fillRect(0,0,w,h);
    const cx=w/2, cy=h*.56, s=Math.min(w,h)*.48, t=(cfg.time||0)*.001;
    ctx.strokeStyle='rgba(85,221,255,.13)';ctx.lineWidth=1;
    for(let i=-7;i<=7;i++){
      ctx.beginPath();ctx.moveTo(cx+i*s/8,cy-s*.36);ctx.lineTo(cx+i*s/2,cy+s*.46);ctx.stroke();
      ctx.beginPath();ctx.moveTo(cx-s*.5,cy+i*s/12);ctx.lineTo(cx+s*.5,cy+i*s/12);ctx.stroke();
    }
    for(let ix=0;ix<22;ix++){
      const x=-.5+ix/21;ctx.beginPath();for(let iz=0;iz<=32;iz++){
        const z=iz/32-.25;const yy=(Math.sin((iz*.65)+t*1.8)+Math.cos(ix*.7+t))/11;const px=cx+x*s, py=cy+z*s*.65-yy*25; if(iz===0)ctx.moveTo(px,py);else ctx.lineTo(px,py);
      }ctx.strokeStyle=cfg.waveColor||'rgba(85,221,255,.20)';ctx.stroke();
    }
    (cfg.objects||[]).forEach((o,i)=>{
      const px=cx+(o.x||0)*s*.45, py=cy+(o.z||0)*s*.35-(o.y||0)*s*.23;
      ctx.fillStyle=o.color||'#8af3bf';ctx.shadowColor=o.color||'#8af3bf';ctx.shadowBlur=12;ctx.beginPath();ctx.arc(px,py,o.r||4,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
      ctx.strokeStyle='rgba(138,243,191,.28)';ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(px+18,py-12);ctx.stroke();
      if(o.label){ctx.fillStyle='#dff7ff';ctx.font='10px system-ui';ctx.fillText(o.label,px+22,py-13);}
      if(i<cfg.objects.length-1){/* reserved for animated object traces */}
    });
  }

  // ---------- Air Traffic 3D ----------
  function airPoint(a){return Number.isFinite(a.lat)&&Number.isFinite(a.lon)?{lat:a.lat,lon:a.lon,size:state.selectedAir?.hex===a.hex?5:3,color:state.selectedAir?.hex===a.hex?'#8af3bf':'#55ddff',label:state.selectedAir?.hex===a.hex?(a.callsign||a.hex):''}:null;}
  function renderAir3D(){
    const pts=state.air.map(airPoint).filter(Boolean);drawGlobe($('alsAir3D'),{rotationY:performance.now()/24000,rotationX:.22,points:pts});
    requestAnimationFrame(renderAir3D);
  }
  function renderAirList3D(){
    const box=$('alsAirList3D');if(!box)return;box.innerHTML='';state.air.filter(a=>a.lat!=null&&a.lon!=null).slice(0,18).forEach(a=>{
      const row=document.createElement('div');row.className='als-row';row.innerHTML='<div><strong>'+esc(a.callsign||a.hex||'UNKNOWN')+'</strong><small>'+esc(a.reg||a.type||'ADS-B target')+' · '+esc(a.category||'category n/a')+'</small></div><em>'+(a.alt==null?'—':Math.round(a.alt).toLocaleString()+' ft')+'</em>';
      row.onclick=()=>{state.selectedAir=a;renderAirList3D();renderAirSelected();};box.appendChild(row);
    });
    if(!box.children.length)box.innerHTML='<div class="als-note">No positioned aircraft in the current public response.</div>';
  }
  function renderAirSelected(){
    const a=state.selectedAir;if(!a){setText('alsAirSelected','No aircraft selected');setText('alsAirSelectedMeta','Select a target from the live list.');return;}
    setText('alsAirSelected',a.callsign||a.hex||'Unknown');setText('alsAirSelectedMeta',(a.reg||'Registration n/a')+' · '+(a.type||'Type n/a')+' · '+(a.category||'ADS-B'));
    const vals=[['Altitude',a.alt==null?'—':Math.round(a.alt)+' ft'],['Speed',a.speed==null?'—':Math.round(a.speed)+' kt'],['Track',a.track==null?'—':Math.round(a.track)+'°'],['Position',(a.lat==null||a.lon==null)?'—':a.lat.toFixed(4)+', '+a.lon.toFixed(4)],['Squawk',a.squawk||'—'],['Provider','Airplanes.live']];
    const box=$('alsAirDetail');if(box)box.innerHTML=vals.map(v=>'<div><b>'+esc(v[1])+'</b><span>'+esc(v[0])+'</span></div>').join('');
  }
  function handleAirFeed(list){
    state.air=Array.isArray(list)?list.slice():[];
    setText('alsAirCount',state.air.length);setText('alsAirPos',state.air.filter(a=>a.lat!=null&&a.lon!=null).length);
    let newest=Infinity;state.air.forEach(a=>{if(Number.isFinite(Number(a.seen)))newest=Math.min(newest,Number(a.seen));});
    setText('alsAirAge',Number.isFinite(newest)?(newest<60?Math.round(newest)+'s':Math.round(newest/60)+'m'):'—');
    setText('alsAirLast','Last provider sync · '+nowTime());setLive('alsAirLive',state.air.length?'':'offline',state.air.length?'LIVE · Airplanes.live':'VERIFY · no positioned targets');
    if(state.selectedAir){const fresh=state.air.find(x=>x.hex===state.selectedAir.hex);state.selectedAir=fresh||state.selectedAir;}
    renderAirList3D();renderAirSelected();
  }
  async function refreshAirFallback(){
    if(Array.isArray(window.__igersAirLastPayload)&&window.__igersAirLastPayload.length){handleAirFeed(window.__igersAirLastPayload);return;}
    try{
      const r=await fetch('https://api.airplanes.live/v2/point/23.8103/90.4125/250',{cache:'no-store'});if(!r.ok)throw new Error('feed');const d=await r.json();
      handleAirFeed((d.ac||[]).map(a=>({hex:a.hex||'',callsign:(a.flight||'').trim(),lat:a.lat,lon:a.lon,alt:a.alt_baro,speed:a.gs,track:a.track,reg:a.r,type:a.t,category:a.category,squawk:a.squawk,seen:a.seen_pos,baroRate:a.baro_rate})));
    }catch(_){setLive('alsAirLive','offline','OFFLINE · provider unavailable');setText('alsAirLast','Retry pending · '+nowTime());}
  }

  // ---------- Seismic / Plate ----------
  async function fetchJson(url, timeout=12000){
    const c=new AbortController(),to=setTimeout(()=>c.abort(),timeout);try{const r=await fetch(url,{cache:'no-store',signal:c.signal,headers:{Accept:'application/json'}});if(!r.ok)throw new Error('HTTP '+r.status);return await r.json();}finally{clearTimeout(to);}
  }
  function renderQuake3D(){
    const pts=state.quakes.map(q=>({lat:q.lat,lon:q.lon,size:clamp(q.mag,1,8)*.55,color:q.alert?'#ff7777':'#ffd37a',label:q.alert?'M'+fmtNum(q.mag,1):''}));
    drawGlobe($('alsSeismic3D'),{rotationY:performance.now()/30000,rotationX:.18,boundaries:state.plates,points:pts});
    requestAnimationFrame(renderQuake3D);
  }
  function renderQuakeList(){
    const box=$('alsQuakeList');if(!box)return;box.innerHTML='';state.quakes.slice(0,18).forEach(q=>{
      const row=document.createElement('div');row.className='als-row';row.innerHTML='<div><strong>'+esc('M'+fmtNum(q.mag,1)+' · '+(q.place||'Unknown'))+'</strong><small>'+new Date(q.time).toLocaleString('en-GB')+' · '+fmtNum(q.lat,2)+', '+fmtNum(q.lon,2)+'</small></div><em>'+esc(q.alert?'ALERT':'EVENT')+'</em>';box.appendChild(row);
    });
    if(!box.children.length)box.innerHTML='<div class="als-note">No earthquake records received in the current public window.</div>';
  }
  async function loadQuakes(){
    try{
      const d=await fetchJson('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson');
      const threshold=Number($('alsQuakeThreshold')?.value||5.5);
      state.quakes=(d.features||[]).map(f=>({
        id:f.id,mag:Number(f.properties?.mag),place:f.properties?.place||'Unknown',time:Number(f.properties?.time)||Date.now(),
        lon:Number(f.geometry?.coordinates?.[0]),lat:Number(f.geometry?.coordinates?.[1]),depth:Number(f.geometry?.coordinates?.[2]),
        alert:Number(f.properties?.mag)>=threshold
      })).filter(q=>Number.isFinite(q.lat)&&Number.isFinite(q.lon)&&Number.isFinite(q.mag)).sort((a,b)=>b.time-a.time);
      setText('alsQuakeCount',state.quakes.length);setText('alsQuakeMax',state.quakes.length?'M'+fmtNum(Math.max(...state.quakes.map(x=>x.mag)),1):'—');
      setText('alsQuakeLast','USGS sync · '+nowTime());setLive('alsQuakeLive','', 'LIVE · USGS all-hour feed');renderQuakeList();
      const alert=state.quakes.find(q=>q.alert);setText('alsQuakeAlert',alert?('ALERT SCREENING · '+alert.place):'No threshold event in current hour');
      if(alert && localStorageSafe('igersQuakeLastAlert')!==alert.id){
        localStorageSafe('igersQuakeLastAlert',alert.id);if($('alsQuakeNotify')?.checked)notify('IGERS seismic screening alert','USGS reports '+('M'+fmtNum(alert.mag,1))+' near '+alert.place+'. This is not official EEW.');
      }
    }catch(_){setLive('alsQuakeLive','offline','OFFLINE · verify feed');setText('alsQuakeLast','Feed retry · '+nowTime());}
  }
  async function loadPlates(){
    try{
      const d=await fetchJson('https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json',20000);
      const items=[];for(const f of (d.features||[])){const g=f.geometry||{};if(g.type==='LineString')items.push(g.coordinates);else if(g.type==='MultiLineString')g.coordinates.forEach(x=>items.push(x));}
      state.plates=items.filter(x=>x.length>1);setText('alsPlateState',state.plates.length+' reference boundary segments');
    }catch(_){setText('alsPlateState','Reference boundary dataset unavailable');}
  }

  // ---------- Marine / Coastal public environmental monitor ----------
  const marineSites={
    chattogram:{name:'Chattogram Coast',lat:22.2496,lon:91.8132},
    cox:{name:"Cox's Bazar Coast",lat:21.4272,lon:91.9702}
  };
  async function loadMarine(){
    const s=marineSites[state.marineSite]||marineSites.chattogram;
    const url='https://marine-api.open-meteo.com/v1/marine?latitude='+s.lat+'&longitude='+s.lon+'&current=sea_level_height_msl,wave_height,wind_wave_height,swell_wave_height,sea_surface_temperature,ocean_current_velocity,ocean_current_direction&hourly=sea_level_height_msl,wave_height,ocean_current_velocity,ocean_current_direction,sea_surface_temperature&forecast_days=1&timezone=auto&wind_speed_unit=ms';
    try{
      const d=await fetchJson(url);state.marine={...d,site:s};const c=d.current||{};
      const wave=Number(c.wave_height),cur=Number(c.ocean_current_velocity),sea=Number(c.sea_level_height_msl),sst=Number(c.sea_surface_temperature),dir=Number(c.ocean_current_direction);
      setText('alsSeaLevel',fmtNum(sea,2)+' m');setText('alsWave',fmtNum(wave,2)+' m');setText('alsCurrent',fmtNum(cur,2)+' m/s');setText('alsSst',fmtNum(sst,1)+' °C');setText('alsCurrentDir',Number.isFinite(dir)?Math.round(dir)+'°':'—');setText('alsMarineLast','Marine model sync · '+nowTime());
      const danger=(Number.isFinite(wave)&&wave>=2.5)||(Number.isFinite(cur)&&cur>=1.5);setLive('alsMarineLive',danger?'warn':'','MODEL UPDATE · '+s.name);setText('alsMarineAlert',danger?'Screening threshold exceeded — verify with local maritime authority.':'No configured marine screening threshold exceeded.');
      renderMarine3D();
    }catch(_){setLive('alsMarineLive','offline','OFFLINE · marine model');setText('alsMarineLast','Feed retry · '+nowTime());}
  }
  function renderMarine3D(){
    const c=state.marine?.current||{};const wave=Number(c.wave_height)||0;const cur=Number(c.ocean_current_velocity)||0;const objs=[];
    for(let i=0;i<9;i++)objs.push({x:(i-4)/6,z:((i%3)-1)/4,y:(Math.sin(i+performance.now()/1000)+1)/5,color:'#55ddff',r:2.5,label:i===8?'SEA GRID':''});
    simpleGrid($('alsMarine3D'),{time:performance.now(),objects:objs,waveColor:wave>=2.5?'rgba(255,119,119,.28)':'rgba(85,221,255,.22)'});
    setText('alsMarineScene', 'Sea level '+fmtNum(c.sea_level_height_msl,2)+' m · wave '+fmtNum(wave,2)+' m · current '+fmtNum(cur,2)+' m/s');
  }
  function animateMarine3D(){renderMarine3D();requestAnimationFrame(animateMarine3D);}

  // ---------- Concept + calculator ----------
  function computeConcept(){
    const m=Number($('alsC_mass')?.value||0),v1=Number($('alsC_v1')?.value||0),v2=Number($('alsC_v2')?.value||0),eta=clamp(Number($('alsC_eta')?.value||0)/100,0,1);
    const n=Number($('alsC_events')?.value||0),loc=Number($('alsC_locations')?.value||0),q=Number($('alsC_q')?.value||0),head=Number($('alsC_head')?.value||0),hydEta=clamp(Number($('alsC_hydEta')?.value||0)/100,0,1),avail=clamp(Number($('alsC_avail')?.value||0)/100,0,1);
    const pv=Number($('alsC_pv')?.value||0),specificYield=Number($('alsC_yield')?.value||0),bat=Number($('alsC_bat')?.value||0),dod=clamp(Number($('alsC_dod')?.value||0)/100,0,1),beff=clamp(Number($('alsC_batEff')?.value||0)/100,0,1),load=Number($('alsC_load')?.value||0);
    const eKJ=Math.max(0,.5*m*((v1/3.6)**2-(v2/3.6)**2)), netWh=eKJ*1000*eta,annualRoad=(netWh/1000)*n*loc;
    const hydKW=(1000*9.81*q*head*hydEta)/1000,annualHyd=hydKW*8760*avail;const solarMWh=(pv*specificYield)/1000;const batRuntime=load>0?(bat*dod*beff/load):0;const totalMWh=(annualRoad+annualHyd)/1000+solarMWh;
    state.concept={eKJ,netWh,annualRoad,hydKW,annualHyd,solarMWh,batRuntime,totalMWh};
    setText('alsCEk',''+fmtNum(eKJ,2)+' kJ');setText('alsCNet',fmtNum(netWh,3)+' Wh/event');setText('alsCRoad',fmtNum(annualRoad/1e6,3)+' GWh/y');setText('alsCHyd',fmtNum(hydKW,2)+' kW');setText('alsCSolar',fmtNum(solarMWh,2)+' MWh/y');setText('alsCBat',fmtNum(batRuntime,1)+' h');setText('alsCTotal',fmtNum(totalMWh,2)+' MWh/y');setText('alsCCalcTime','Calculated '+nowTime());
  }
  function renderConcept3D(){
    const c=state.concept||{};const objects=[];for(let i=0;i<8;i++)objects.push({x:(i-3.5)/10,z:Math.sin(i)*.09,y:.45+Math.abs(i-3.5)/20,color:i<4?'#8af3bf':'#55ddff',r:3,label:i===7?'IGERS NODE':''});
    simpleGrid($('alsConcept3D'),{time:performance.now(),objects,waveColor:'rgba(138,243,191,.18)'});
    setText('alsConceptScene','ROTOR + PV CANOPY + BESS · '+fmtNum(c.totalMWh||0,2)+' MWh/y scenario');requestAnimationFrame(()=>renderConcept3D());
  }

  // ---------- Tower resilience mesh — simulation only ----------
  const towerSeed=[['Dhaka','CORE'],['Chattogram','COAST'],['Rajshahi','WEST'],['Sylhet','NORTH-EAST'],['Khulna','SOUTH-WEST'],['Rangpur','NORTH'],['Cumilla','EAST'],['Barishal','SOUTH']];
  function initTowers(){
    state.tower=towerSeed.map((x,i)=>({name:x[0],role:x[1],on:true,latency:34+i*7,health:96-i*2}));renderTowers();}
  function renderTowers(){
    const box=$('alsTowerList');if(!box)return;box.innerHTML='';state.tower.forEach((t,i)=>{
      const row=document.createElement('div');row.className='als-tower-node';row.innerHTML='<h4>'+esc(t.name)+' · '+esc(t.role)+'</h4><small>'+t.health+'% health · '+t.latency+' ms simulated link</small><div class="als-node-controls"><button class="'+(t.on?'on':'off')+'" data-i="'+i+'">'+(t.on?'SIM ON':'SIM OFF')+'</button><button data-reset="'+i+'">Cycle</button></div>';box.appendChild(row);
    });
    box.querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>{const i=Number(b.dataset.i);state.tower[i].on=!state.tower[i].on;renderTowers();renderTower3D();});
    box.querySelectorAll('[data-reset]').forEach(b=>b.onclick=()=>{const i=Number(b.dataset.reset);state.tower[i].latency=30+Math.round(Math.random()*55);state.tower[i].health=85+Math.round(Math.random()*14);renderTowers();});
    const up=state.tower.filter(t=>t.on).length;setText('alsTowerUp',up+'/'+state.tower.length);setText('alsTowerNet',navigator.onLine?'BROWSER ONLINE':'BROWSER OFFLINE');setLive('alsTowerLive',navigator.onLine?'':'offline',navigator.onLine?'SIMULATION LINK · ONLINE BROWSER':'OFFLINE · local simulation');
  }
  function renderTower3D(){
    const objs=state.tower.map((t,i)=>({x:(i%4-1.5)/2,z:(Math.floor(i/4)-.5)/2,y:t.on?.55:.25,color:t.on?'#8af3bf':'#ff7777',r:t.on?4:3,label:t.name}));simpleGrid($('alsTower3D'),{time:performance.now(),objects:objs,waveColor:'rgba(85,221,255,.12)'});
  }
  function animateTower3D(){renderTower3D();requestAnimationFrame(animateTower3D);}
  function towerAll(on){state.tower.forEach(t=>t.on=on);renderTowers();renderTower3D();}

  // ---------- Salah / Qibla ----------
  function qiblaBearing(lat,lon){const kLat=21.422487,kLon=39.826206,dLon=rad(kLon-lon);const y=Math.sin(dLon)*Math.cos(rad(kLat));const x=Math.cos(rad(lat))*Math.sin(rad(kLat))-Math.sin(rad(lat))*Math.cos(rad(kLat))*Math.cos(dLon);return (deg(Math.atan2(y,x))+360)%360;}
  async function resolveGeo(){
    const status=$('alsGeoStatus');
    if(!('geolocation' in navigator)){if(status)status.textContent='Geolocation unavailable · Dhaka fallback';return {lat:23.8103,lon:90.4125,name:'Dhaka, Bangladesh'};}
    return new Promise(resolve=>navigator.geolocation.getCurrentPosition(p=>resolve({lat:p.coords.latitude,lon:p.coords.longitude,name:'Browser location'}),()=>resolve({lat:23.8103,lon:90.4125,name:'Dhaka fallback'}),{enableHighAccuracy:true,timeout:10000,maximumAge:300000}));
  }
  // Local fallback prayer-time calculator (used when the public service is unavailable).
  // This keeps Salah times visible offline using a standard solar-angle approach.
  function prayerTimesLocal(lat,lon,date,method=1){
    const deg2rad=x=>x*Math.PI/180,rad2deg=x=>x*180/Math.PI;
    const jd=(()=>{let y=date.getFullYear(),m=date.getMonth()+1,d=date.getDate();if(m<=2){y--;m+=12;}const A=Math.floor(y/100),B=2-A+Math.floor(A/4);return Math.floor(365.25*(y+4716))+Math.floor(30.6001*(m+1))+d+B-1524.5;})();
    const D=jd-2451545.0;
    const g=357.529+0.98560028*D, q=280.459+0.98564736*D, L=(q+1.915*Math.sin(deg2rad(g))+0.020*Math.sin(deg2rad(2*g)))%360;
    const e=23.439-0.00000036*D, ra=rad2deg(Math.atan2(Math.cos(deg2rad(e))*Math.sin(deg2rad(L)),Math.cos(deg2rad(L))))/15;
    const eqt=q/15-ra; const decl=rad2deg(Math.asin(Math.sin(deg2rad(e))*Math.sin(deg2rad(L))));
    const tz=6; const noon=12+tz-eqt-lon/15;
    const angleSun=(angle,afterNoon)=>{const sa=deg2rad(angle),phi=deg2rad(lat),dec=deg2rad(decl);let c=(Math.sin(sa)-Math.sin(phi)*Math.sin(dec))/(Math.cos(phi)*Math.cos(dec));c=Math.max(-1,Math.min(1,c));const h=rad2deg(Math.acos(c))/15;return noon+(afterNoon?h:-h);};
    const sunrise=angleSun(-0.8333,false),sunset=angleSun(-0.8333,true);
    const fajr=angleSun(-(method===1?18:18),false), isha=angleSun(-(method===1?18:18),true);
    const asrFactor=1; // Shafi reference default; dropdown remains for public API method.
    const shadow=(()=>{const phi=deg2rad(lat),dec=deg2rad(decl),alt=Math.atan(1/(asrFactor+Math.tan(Math.abs(phi-dec))));let c=(Math.sin(alt)-Math.sin(phi)*Math.sin(dec))/(Math.cos(phi)*Math.cos(dec));c=Math.max(-1,Math.min(1,c));return rad2deg(Math.acos(c))/15;})();
    const asr=noon+shadow;
    const fmt=h=>{h=((h%24)+24)%24;const hr=Math.floor(h),mi=Math.round((h-hr)*60);const hh=String((hr+(mi===60?1:0))%24).padStart(2,'0'),mm=String(mi===60?0:mi).padStart(2,'0');return hh+':'+mm;};
    return {Fajr:fmt(fajr),Sunrise:fmt(sunrise),Dhuhr:fmt(noon),Asr:fmt(asr),Sunset:fmt(sunset),Maghrib:fmt(sunset),Isha:fmt(isha),Imsak:fmt(fajr-0.17),Midnight:fmt((sunset+24+fajr)/2)};
  }
  function applyPrayerFallback(g){
    state.prayers=prayerTimesLocal(g.lat,g.lon,new Date(),Number($('alsPrayerMethod')?.value||1));renderPrayers();setLive('alsPrayerLive','warn','LOCAL CALC · public service unavailable');setText('alsPrayerLast','Local calculation · '+nowTime());
  }

  async function loadPrayerTimes(){
    const g=state.geo||await resolveGeo();state.geo=g;const b=qiblaBearing(g.lat,g.lon);state.qibla=b;setText('alsQibla',Math.round(b)+'° '+compass8(b));setText('alsGeo',''+g.name+' · '+g.lat.toFixed(4)+', '+g.lon.toFixed(4));setText('alsGeoStatus','Location: '+g.name);renderQibla3D();applyPrayerFallback(g);
    const method=Number($('alsPrayerMethod')?.value||1),date=new Date(),dd=String(date.getDate()).padStart(2,'0'),mm=String(date.getMonth()+1).padStart(2,'0'),yyyy=date.getFullYear();
    try{
      const url='https://api.aladhan.com/v1/timings/'+dd+'-'+mm+'-'+yyyy+'?latitude='+encodeURIComponent(g.lat)+'&longitude='+encodeURIComponent(g.lon)+'&method='+method+'&timezonestring=Asia/Dhaka&iso8601=true';
      const d=await fetchJson(url);state.prayers=d.data?.timings||{};renderPrayers();setLive('alsPrayerLive','','LIVE · AlAdhan prayer service');setText('alsPrayerLast','Prayer sync · '+nowTime());
    }catch(_){applyPrayerFallback(g);}
  }
  function compass8(d){return ['N','NE','E','SE','S','SW','W','NW'][Math.round((((d%360)+360)%360)/45)%8];}
  function cleanPrayerTime(v){return String(v||'').match(/^\d{2}:\d{2}/)?.[0]||null;}
  function renderPrayers(){
    const order=['Fajr','Dhuhr','Asr','Maghrib','Isha'];const box=$('alsPrayerGrid');if(!box||!state.prayers)return;const now=new Date();const nowMin=now.getHours()*60+now.getMinutes();let next=null;
    const items=order.map(name=>{const t=cleanPrayerTime(state.prayers[name]);const mins=t?Number(t.slice(0,2))*60+Number(t.slice(3)):9999;if(mins>nowMin&&!next)next={name,time:t,mins};return {name,time:t};});
    if(!next)next=items[0]?{...items[0],nextDay:true}:null;
    box.innerHTML=items.map(x=>'<div class="als-prayer '+(next&&x.name===next.name?'current':'')+'"><b>'+x.name+'</b><span>'+esc(x.time||'—')+'</span></div>').join('');
    if(next&&next.time){let delta=next.mins-nowMin;if(delta<0)delta+=1440;setText('alsNextPrayer',next.name+' in '+Math.floor(delta/60)+'h '+(delta%60)+'m');}
  }
  function renderQibla3D(){
    const sized=sizeCanvas($('alsQibla3D'));if(!sized)return;const {ctx,w,h}=sized;ctx.clearRect(0,0,w,h);const cx=w/2,cy=h/2,r=Math.min(w,h)*.34;ctx.strokeStyle='rgba(85,221,255,.35)';for(let rr of [r,r*.75,r*.45]){ctx.beginPath();ctx.arc(cx,cy,rr,0,Math.PI*2);ctx.stroke();}
    for(let i=0;i<8;i++){const a=rad(i*45-90),x=cx+Math.cos(a)*r,y=cy+Math.sin(a)*r;ctx.fillStyle='#8da7b6';ctx.font='10px system-ui';ctx.textAlign='center';ctx.fillText(['N','NE','E','SE','S','SW','W','NW'][i],x,y);}
    const a=rad((state.qibla||0)-90),x=cx+Math.cos(a)*r*.92,y=cy+Math.sin(a)*r*.92;ctx.strokeStyle='#8af3bf';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(x,y);ctx.stroke();ctx.fillStyle='#8af3bf';ctx.beginPath();ctx.arc(x,y,7,0,Math.PI*2);ctx.fill();ctx.fillStyle='#eaf7fc';ctx.font='700 11px system-ui';ctx.fillText('QIBLA '+Math.round(state.qibla||0)+'°',cx,cy-r-.12*r);
    requestAnimationFrame(renderQibla3D);
  }
  function startPrayerAlertLoop(){
    setInterval(()=>{renderPrayers();if(!state.prayers)return;const now=new Date(),hm=now.toTimeString().slice(0,5);['Fajr','Dhuhr','Asr','Maghrib','Isha'].forEach(name=>{const t=cleanPrayerTime(state.prayers[name]);if(t===hm&&localStorageSafe('igersPrayerAlertKey')!==name+'_'+now.toDateString()){localStorageSafe('igersPrayerAlertKey',name+'_'+now.toDateString());notify(name+' prayer time','It is time for '+name+'. Qibla '+Math.round(state.qibla||0)+'° '+compass8(state.qibla||0)+'.','igers-prayer');}});},15000);
  }

  // ---------- Emergency admin broadcast (local browser simulation) ----------
  function renderEmergency(){
    const e=state.emergency||localStorageSafe('igersEmergencyState');let data=e;try{if(typeof e==='string')data=JSON.parse(e);}catch(_){data=null;}
    if(!data){setText('alsEmergencyTitle','No active message');setText('alsEmergencyBody','Administrator has not published a local emergency banner.');return;}
    setText('alsEmergencyTitle',data.title||'Emergency');setText('alsEmergencyBody',data.message||'');const preview=$('alsEmergencyPreview');if(preview)preview.innerHTML='<strong>'+esc(data.title||'EMERGENCY')+'</strong><span>'+esc(data.message||'')+'</span>';
  }
  function publishEmergency(){
    if(!state.admin)return;const sev=$('alsEmergencySeverity')?.value||'WARNING',message=($('alsEmergencyMessage')?.value||'').trim(),direction=($('alsEmergencyDirection')?.value||'').trim();if(!message){setText('alsEmergencyStatus','Write a message first.');return;}
    const data={severity:sev,title:sev+' · ADMINISTRATOR MESSAGE',message:message+(direction?' · Move '+direction+'.':''),direction,createdAt:new Date().toISOString()};state.emergency=data;localStorageSafe('igersEmergencyState',JSON.stringify(data));renderEmergency();setText('alsEmergencyStatus','Published locally · '+nowTime());document.body.dataset.igersEmergency=sev;notify('IGERS '+sev,data.message,'igers-emergency');
  }
  function clearEmergency(){if(!state.admin)return;state.emergency=null;try{localStorage.removeItem('igersEmergencyState');}catch(_){}renderEmergency();setText('alsEmergencyStatus','Local emergency banner cleared.');document.body.dataset.igersEmergency='';}

  // ---------- Google 3D optional layer ----------
  async function loadGoogle3D(){
    const key=($('alsGoogleKey')?.value||state.googleKey||'').trim();if(!key){setText('alsGoogleStatus','API key required · map remains in native 3D view');return;}
    state.googleKey=key;localStorageSafe('igersGoogle3dKey',key);setText('alsGoogleStatus','Loading Google 3D Maps…');
    if(!window.google){
      await new Promise((resolve,reject)=>{const sc=document.createElement('script');sc.async=true;sc.src='https://maps.googleapis.com/maps/api/js?loading=async&key='+encodeURIComponent(key)+'&libraries=maps3d';sc.onload=resolve;sc.onerror=reject;document.head.appendChild(sc);});
    }
    const host=$('alsGoogle3DHost');if(!host){return;}
    host.innerHTML='';const map=document.createElement('gmp-map-3d');map.setAttribute('mode','HYBRID');map.setAttribute('center','23.8103,90.4125,1100000');map.setAttribute('heading','0');map.setAttribute('tilt','50');map.setAttribute('range','1200000');host.appendChild(map);state.googleReady=true;setText('alsGoogleStatus','Google 3D map mounted · provider key active in this browser.');
  }

  function bind(){
    // Air feed bridge from the existing app.
    window.addEventListener('igers:airtraffic',e=>handleAirFeed(e.detail||[]));
    if(Array.isArray(window.__igersAirLastPayload))handleAirFeed(window.__igersAirLastPayload);
    $('alsAirRefresh')?.addEventListener('click',refreshAirFallback);

    $('alsQuakeRefresh')?.addEventListener('click',loadQuakes);$('alsQuakeThreshold')?.addEventListener('change',loadQuakes);
    $('alsQuakeNotify')?.addEventListener('change',e=>{if(e.target.checked)notify('IGERS seismic alerts','Browser notice permission request. Public USGS event feed is not official EEW.','igers-quake');});
    $('alsMarineRefresh')?.addEventListener('click',loadMarine);$('alsMarineSite')?.addEventListener('change',e=>{state.marineSite=e.target.value;loadMarine();});
    document.querySelectorAll('[data-concept-input]').forEach(i=>i.addEventListener('input',computeConcept));$('alsConceptRecalc')?.addEventListener('click',computeConcept);
    $('alsTowerOn')?.addEventListener('click',()=>towerAll(true));$('alsTowerOff')?.addEventListener('click',()=>towerAll(false));
    $('alsPrayerLocate')?.addEventListener('click',()=>loadPrayerTimes());$('alsPrayerMethod')?.addEventListener('change',loadPrayerTimes);
    $('alsPrayerNotify')?.addEventListener('click',()=>notify('IGERS prayer alerts enabled','Prayer-time browser notices are enabled in this browser.','igers-prayer'));
    $('alsEmergencyPublish')?.addEventListener('click',publishEmergency);$('alsEmergencyClear')?.addEventListener('click',clearEmergency);
    document.querySelectorAll('[data-route]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-route]').forEach(x=>x.classList.remove('active'));b.classList.add('active');const d=$('alsEmergencyDirection');if(d)d.value=b.dataset.route==='SAFE'?'SAFE ASSEMBLY':b.dataset.route;}));
    $('alsEmergencyTest')?.addEventListener('click',()=>notify('IGERS emergency test','This is a local browser notification test.','igers-emergency-test'));
    $('alsGoogleMount')?.addEventListener('click',()=>loadGoogle3D().catch(()=>setText('alsGoogleStatus','Google 3D load failed · verify key, billing and browser support.')));
    $('alsAdminUnlock')?.addEventListener('click',()=>{const p=$('alsAdminPassword')?.value||'';if(tryAdminPassword(p)){setAdminSession();setText('alsAdminMsg','Administrator UI unlocked.');}else setText('alsAdminMsg','Invalid prototype administrator password.');});
    $('alsAdminLogout')?.addEventListener('click',()=>clearAdminSession());
  }

  function init(){
    if(!$('alsAir3D'))return;
    state.admin=sessionHasAdmin();syncAdminUI();
    $('alsGoogleKey').value=state.googleKey;
    initTowers();renderEmergency();computeConcept();
    bind();
    renderAir3D();renderQuake3D();renderConcept3D();animateTower3D();renderQibla3D();animateMarine3D();
    refreshAirFallback();loadQuakes();loadPlates();loadMarine();loadPrayerTimes();startPrayerAlertLoop();
    setInterval(loadQuakes,60000);setInterval(loadMarine,900000);setInterval(()=>loadPrayerTimes(),3600000);
    window.addEventListener('online',()=>{renderTowers();refreshAirFallback();loadQuakes();loadMarine();loadPrayerTimes();});
    window.addEventListener('offline',()=>renderTowers());
  }
  window.IGERSAdvancedSuite={state,computeConcept,refreshAirFallback,loadQuakes,loadMarine,loadPrayerTimes,publishEmergency,clearEmergency};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
