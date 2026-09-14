(function initNASAIntelligence(){
  'use strict';
  const $=id=>document.getElementById(id);
  const required=['nasaMasterState','nasaGibsState','nasaEonetState','nasaAstroState'];
  if(!required.every(id=>$(id))) return;
  const fallback={lat:23.8103,lon:90.4125,name:'Dhaka, Bangladesh'};
  let location={...fallback};
  try{const s=JSON.parse(localStorage.getItem('igersSatLocation')||'null');if(Number.isFinite(s?.lat)&&Number.isFinite(s?.lon))location={lat:Number(s.lat),lon:Number(s.lon),name:s.name||'Current browser location'};}catch(_){ }
  const state=(el,kind,text)=>{el.textContent=text;el.className='source-pill '+(kind==='ok'?'ok':kind==='warn'?'warn':kind==='bad'?'bad':'');};
  const nowText=()=>new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',second:'2-digit'});
  const stamp=()=>{const t=nowText();if($('nasaLastSync'))$('nasaLastSync').textContent='Last NASA sync: '+t;};
  const esc=v=>String(v??'').replace(/[&<>'"]/g,s=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[s]));
  const dayStr=offset=>new Date(Date.now()-offset*86400000).toISOString().slice(0,10);
  const geoTime=offset=>{const d=new Date(Date.now()-offset*10*60000);d.setUTCSeconds(0,0);d.setUTCMinutes(Math.floor(d.getUTCMinutes()/10)*10);return d.toISOString().replace(/\.000Z$/,'Z');};
  function gibsUrl(layer,date){return '/api/provider?provider=gibs&SERVICE=WMS&REQUEST=GetMap&VERSION=1.1.1&LAYERS='+encodeURIComponent(layer)+'&STYLES=&FORMAT=image/jpeg&SRS=EPSG:4326&BBOX=88,20,93,27&WIDTH=1200&HEIGHT=780&TIME='+encodeURIComponent(date)+'&_='+Date.now();}
  function refreshGibs(){
    const img=$('nasaGibsImage'), ph=$('nasaGibsPlaceholder'); if(!img||!ph)return;
    state($('nasaGibsState'),'warn','CHECKING NASA GIBS'); ph.style.display='grid';img.style.display='none';
    const candidates=[]; for(let t=0;t<6;t++){const dt=geoTime(t); candidates.push(['Himawari-9 · Clean IR','Himawari_AHI_Band13_Clean_Infrared',dt]); candidates.push(['Himawari-9 · Red Visible','Himawari_AHI_Band3_Red_Visible_1km',dt]);} for(let d=0;d<4;d++){const date=dayStr(d); candidates.push(['VIIRS NOAA-21 · Daily','VIIRS_NOAA21_CorrectedReflectance_TrueColor',date]);candidates.push(['VIIRS NOAA-20 · Daily','VIIRS_NOAA20_CorrectedReflectance_TrueColor',date]);candidates.push(['MODIS Terra · Daily','MODIS_Terra_CorrectedReflectance_TrueColor',date]);}
    let i=0;
    const next=()=>{
      if(i>=candidates.length){state($('nasaGibsState'),'bad','NASA GIBS UNAVAILABLE');if($('nasaObsHealth'))$('nasaObsHealth').textContent='UNAVAILABLE';ph.textContent='NASA GIBS did not return an image in the tested fallback window. Open NASA Worldview for the authoritative viewer.';return;}
      const [name,layer,date]=candidates[i++]; const probe=new Image();let done=false;const timer=setTimeout(()=>{if(!done){done=true;next();}},8000);
      probe.onload=()=>{if(done)return;done=true;clearTimeout(timer);img.src=probe.src;img.style.display='block';ph.style.display='none';$('nasaGibsLayer').textContent=name;$('nasaGibsDate').textContent=date;$('nasaObsSource').textContent=name;const ageMs=Math.max(0,Date.now()-Date.parse(date.length>10?date:date+'T00:00:00Z'));$('nasaObsAge').textContent=ageMs<3600000?Math.floor(ageMs/60000)+' min':Math.floor(ageMs/86400000)+' day';$('nasaObsHealth').textContent='IMAGE OK';state($('nasaGibsState'),'ok',name.includes('Himawari')?'NASA GEOSTATIONARY READY':'NASA OBSERVATION READY');stamp();};
      probe.onerror=()=>{if(done)return;done=true;clearTimeout(timer);next();};probe.src=gibsUrl(layer,date);
    }; next();
  }
  async function refreshEonet(){
    state($('nasaEonetState'),'warn','CHECKING NASA EONET');
    const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),10000);
    try{
      const bbox='88,26.7,92.7,20.5';
      const [regionalResp,globalResp]=await Promise.all([
        fetch('/api/provider?provider=eonet&status=open&bbox='+bbox,{cache:'no-store',signal:ctrl.signal}),
        fetch('/api/provider?provider=eonet&status=open&limit=100',{cache:'no-store',signal:ctrl.signal})
      ]);
      if(!regionalResp.ok||!globalResp.ok)throw new Error('EONET HTTP failure');
      const regional=await regionalResp.json(),global=await globalResp.json();clearTimeout(timer);
      const re=Array.isArray(regional.features)?regional.features:[], ge=Array.isArray(global.features)?global.features:[];
      const hasCat=(f,name)=>(f.properties?.categories||[]).some(c=>String(c.title||'').toLowerCase().includes(name));
      $('nasaBdEvents').textContent=String(re.length);$('nasaGlobalEvents').textContent=String(ge.length);$('nasaStormEvents').textContent=String(ge.filter(f=>hasCat(f,'storm')).length);$('nasaFireEvents').textContent=String(ge.filter(f=>hasCat(f,'wildfire')).length);
      const retrieved=nowText();$('nasaBdEventsAt').textContent='retrieved '+retrieved;$('nasaGlobalEventsAt').textContent='retrieved '+retrieved;
      const list=$('nasaEventList');
      list.innerHTML=re.slice(0,6).map(f=>{const p=f.properties||{},c=(p.categories||[]).map(x=>x.title).join(' · '),coord=Array.isArray(f.geometry?.coordinates)?f.geometry.coordinates:'';const point=Array.isArray(coord)&&coord.length>=2?Number(coord[1]).toFixed(2)+'°, '+Number(coord[0]).toFixed(2)+'°':'';const payload={title:p.title||'NASA natural event',point,cat:c||'Natural event',date:p.date||'',desc:p.description||'',source:p.link||''}; const encoded=encodeURIComponent(JSON.stringify(payload)); return `<div class="nasa-event"><div class="nasa-event-top"><b>${esc(payload.title)}</b><span>${esc(point)}</span></div><div><span>${esc(payload.cat)} · ${esc(payload.date)}</span></div><button class="inline-action" type="button" data-event-detail="${encoded}">View event in app →</button></div>`;}).join('')||'<div class="nasa-event-muted">No open NASA EONET event is currently returned inside the Bangladesh bounding box.</div>';
      state($('nasaEonetState'),'ok','EONET LIVE METADATA');stamp();
    }catch(_){clearTimeout(timer);state($('nasaEonetState'),'bad','EONET UNAVAILABLE');$('nasaEventList').innerHTML='<div class="nasa-event-muted">NASA EONET is temporarily unavailable. Other IGERS live systems remain independent.</div>';}
  }
  function setLocation(p){location={lat:p.coords.latitude,lon:p.coords.longitude,name:'Current browser location'};try{localStorage.setItem('igersSatLocation',JSON.stringify(location));}catch(_){ }localSolar();updateWorldviewLink();}
  function fmtHours(value){let v=value;while(v<0)v+=24;while(v>=24)v-=24;const hh=String(Math.floor(v)).padStart(2,'0');const mm=String(Math.floor((v-Math.floor(v))*60)).padStart(2,'0');return hh+':'+mm;}
  function localSolar(){
    const now=new Date(),day=Math.floor((Date.UTC(now.getUTCFullYear(),now.getUTCMonth(),now.getUTCDate())-Date.UTC(now.getUTCFullYear(),0,0))/86400000);const decl=23.44*Math.sin(Math.PI/180*(360/365*(day-81)));const lat=location.lat*Math.PI/180,decr=decl*Math.PI/180;const cosH=Math.max(-1,Math.min(1,(Math.cos(90.833*Math.PI/180)/(Math.cos(lat)*Math.cos(decr)))-Math.tan(lat)*Math.tan(decr)));const H=Math.acos(cosH)*180/Math.PI/15, noon=12-location.lon/15,rise=noon-H,set=noon+H;const mins=now.getHours()*60+now.getMinutes(),r=Math.round(rise*60),s=Math.round(set*60);let sky='DAYLIGHT';if(mins<r-30||mins>s+30)sky='NIGHT';else if(mins<r||mins>s)sky='TWILIGHT';$('nasaSolarState').textContent=sky;$('nasaSunrise').textContent=fmtHours(rise);$('nasaSunset').textContent=fmtHours(set);$('nasaDarkWindow').textContent=fmtHours(set+0.5)+' → '+fmtHours(rise-0.5);$('nasaAstroLocation').textContent=location.name+' · '+location.lat.toFixed(4)+'°, '+location.lon.toFixed(4)+'°';state($('nasaAstroState'),'ok','LOCATION AWARE');
  }
  async function loadApod(){
    try{const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),9000);const r=await fetch('/api/provider?provider=nasa&api_key=DEMO_KEY',{cache:'no-store',signal:ctrl.signal});if(!r.ok)throw new Error('APOD');const d=await r.json();clearTimeout(timer);$('nasaApodTitle').textContent=d.title||'NASA Astronomy Picture of the Day';$('nasaApodDesc').textContent=(d.explanation||'NASA astronomy media.')+' ';window.__igersApodUrl=d.url||d.hdurl||'';if(d.media_type==='image'&&d.url){$('nasaApodImage').src=d.url;$('nasaApodImage').style.display='block';}state($('nasaAstroState'),'ok','NASA ASTRONOMY READY');stamp();}catch(_){$('nasaApodTitle').textContent='NASA astronomy media unavailable';state($('nasaAstroState'),'warn','LOCAL SKY READY');}
  }
  const worldview=$('nasaWorldviewLocal');
  function buildWorldviewUrl(){const t=new Date().toISOString().replace(/\.000Z$/,'Z');const v=`${(location.lon-3).toFixed(3)},${(location.lat-3).toFixed(3)},${(location.lon+3).toFixed(3)},${(location.lat+3).toFixed(3)}`;const layers='Reference_Labels_15m%2CReference_Features_15m%2CCoastlines_15m%2CHimawari_AHI_Band13_Clean_Infrared%2CHimawari_AHI_Band3_Red_Visible_1km';return `https://worldview.earthdata.nasa.gov/?l=${layers}&lg=true&t=${encodeURIComponent(t)}&v=${encodeURIComponent(v)}`;}
  function updateWorldviewLink(){if(worldview)worldview.dataset.worldviewUrl=buildWorldviewUrl();}
  function openInApp(title,html){const modal=$('inAppVisualModal'),body=$('inAppVisualBody'),tt=$('inAppVisualTitle');if(!modal||!body)return;tt.textContent=title;body.innerHTML=html;modal.hidden=false;modal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';}
  function closeInApp(){const modal=$('inAppVisualModal');if(!modal)return;modal.hidden=true;modal.setAttribute('aria-hidden','true');document.body.style.overflow='';}
  document.addEventListener('click',e=>{const close=e.target.closest('[data-close-inapp]');if(close){closeInApp();return;}const jump=e.target.closest('[data-scroll-target]');if(jump){document.getElementById(jump.dataset.scrollTarget)?.scrollIntoView({behavior:'smooth',block:'center'});return;}const src=e.target.closest('[data-inapp-view]');if(src){const target=src.dataset.inappView;if(target==='nasa-earth'){const img=$('nasaGibsImage');if(img&&img.src)openInApp('NASA Earth observation',`<img class=\"inapp-modal-image\" src=\"${esc(img.src)}\" alt=\"NASA Earth observation over Bangladesh\"><div class=\"inapp-mini-grid\"><div><span>Layer</span><b>${esc($('nasaGibsLayer')?.textContent||'--')}</b></div><div><span>Observation</span><b>${esc($('nasaGibsDate')?.textContent||'--')}</b></div><div><span>Health</span><b>${esc($('nasaObsHealth')?.textContent||'--')}</b></div></div>`);else document.getElementById('nasaGibsRefresh')?.click();}else if(target==='satellite-observation'){document.getElementById('satObservationImage')?.scrollIntoView({behavior:'smooth',block:'center'});}} const eventBtn=e.target.closest('[data-event-detail]');if(eventBtn){try{const d=JSON.parse(decodeURIComponent(eventBtn.dataset.eventDetail));openInApp('NASA EONET event',`<div class=\"inapp-event-focus\"><h4>${esc(d.title)}</h4><p><b>Location:</b> ${esc(d.point||'--')}</p><p><b>Category:</b> ${esc(d.cat||'--')}</p><p><b>Date:</b> ${esc(d.date||'--')}</p><p>${esc(d.desc||'NASA EONET event metadata.')}</p><p><b>Source:</b> NASA EONET public event metadata</p></div>`);}catch(_){}return;}
    if(e.target.id==='nasaWorldviewLocal'){const img=$('nasaGibsImage');if(img&&img.src&&img.style.display!=='none'){openInApp('NASA local satellite view',`<img class=\"inapp-modal-image\" src=\"${esc(img.src)}\" alt=\"NASA local satellite view\"><div class=\"nasa-footnote\">The view above is the same NASA-observation product already rendered inside IGERS. No external viewer is required.</div>`);}else refreshGibs();return;}
    if(e.target.id==='nasaEonetFocus'){document.getElementById('nasaEventList')?.scrollIntoView({behavior:'smooth',block:'center'});return;}
    if(e.target.id==='nasaApodLink'){const url=window.__igersApodUrl||$('nasaApodImage')?.src||'';if(url)openInApp('NASA Astronomy Picture of the Day',`<img class=\"inapp-modal-image\" src=\"${esc(url)}\" alt=\"NASA Astronomy Picture of the Day\"><div class=\"nasa-footnote\">NASA astronomy content shown directly inside IGERS.</div>`);return;}
    if(e.target.id==='satObservationExpand'){const img=$('satObservationImage');if(img&&img.src&&img.style.display!=='none')openInApp('Satellite observation over Bangladesh',`<img class=\"inapp-modal-image\" src=\"${esc(img.src)}\" alt=\"Satellite observation over Bangladesh\"><div class=\"nasa-footnote\">Rendered directly inside the IGERS application from the configured public Earth-observation source.</div>`);return;}});
  window.addEventListener('keydown',e=>{if(e.key==='Escape')closeInApp();});
    $('nasaGibsRefresh').addEventListener('click',refreshGibs);$('nasaEonetRefresh').addEventListener('click',refreshEonet);
  $('nasaMasterState').textContent='NASA LAYERS ACTIVE';
  refreshGibs();refreshEonet();localSolar();updateWorldviewLink();loadApod();
  if(navigator.geolocation){navigator.geolocation.getCurrentPosition(setLocation,()=>{}, {enableHighAccuracy:false,timeout:7000,maximumAge:300000});}
})();
