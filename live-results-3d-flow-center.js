/* IGERS-BD-01 — Independent Live Data / Feed / Result / 3D / Traffic Flow Center
 * Additive-only. Public feeds are read-only; vehicle/toll live data requires authorized endpoints.
 */
(function(){
  'use strict';
  if(window.__igersLiveResultsFlowLoaded)return;
  window.__igersLiveResultsFlowLoaded=true;
  const $=id=>document.getElementById(id);
  const state={air:[],quakes:[],weather:null,traffic:[],trafficSource:'WAITING',lastAir:0,lastQuake:0,lastWeather:0,lastTraffic:0,paused:false,sim:false,flowPhase:0};
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const now=()=>new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',second:'2-digit'});
  const num=v=>Number.isFinite(Number(v))?Number(v):0;
  const set=(id,v)=>{const e=$(id);if(e)e.textContent=v};
  const stateBadge=(id,kind,text)=>{const e=$(id);if(!e)return;e.className='lrc-state '+(kind||'');e.textContent=text};
  function paintOverall(){
    const total=state.air.length+state.quakes.length+(state.weather?1:0)+state.traffic.length;
    const liveStreams=[state.air.length>0,state.quakes.length>=0&&state.lastQuake>0,!!state.weather,state.traffic.length>0].filter(Boolean).length;
    const badge=$('lrcOverall'), label=$('lrcOverallText');
    if(badge&&label){badge.className='lrc-badge '+(liveStreams>=2?'live':'');label.textContent=(liveStreams>=2?'LIVE DATA LAYERS':'VERIFY / PARTIAL LIVE')+' · '+liveStreams+'/4 streams';}
    set('lrcDataStreams',String(liveStreams));set('lrcDataRows',String(total));set('lrcLastSync',now());
  }
  async function getJson(url,timeout=10000){
    const c=new AbortController(),t=setTimeout(()=>c.abort(),timeout);
    try{const r=await fetch(url,{cache:'no-store',signal:c.signal,headers:{Accept:'application/json'}});if(!r.ok)throw Error('HTTP '+r.status);return await r.json();}
    finally{clearTimeout(t);}
  }
  function normalizeAir(d){
    const src=Array.isArray(d?.ac)?d.ac:[];
    return src.map(a=>({hex:String(a.hex||'').toLowerCase(),callsign:String(a.flight||'').trim()||'UNKNOWN',lat:num(a.lat),lon:num(a.lon),alt:num(a.alt_baro),speed:num(a.gs),track:num(a.track),seen:num(a.seen_pos)})).filter(a=>a.hex&&Number.isFinite(a.lat)&&Number.isFinite(a.lon));
  }
  async function refreshAir(){
    if(state.paused)return;
    stateBadge('lrcFeedAir','warn','SYNCING');
    try{
      const d=await getJson('https://api.airplanes.live/v2/point/23.8103/90.4125/450');
      state.air=normalizeAir(d);state.lastAir=Date.now();stateBadge('lrcFeedAir',state.air.length?'live':'warn',state.air.length?'LIVE · AIRPLANES.LIVE':'VERIFY · NO TARGETS');stateBadge('lrcResultState',state.air.length||state.quakes.length||state.weather||state.traffic.length?'live':'warn',state.air.length||state.quakes.length||state.weather||state.traffic.length?'LIVE RESULT STREAM':'WAITING FOR RESULTS');
      set('lrcAirCount',state.air.length.toLocaleString());set('lrcAirPos',state.air.length.toLocaleString());set('lrcAirSync',now());
      renderFeedRows();renderResults();draw3D();
      window.__igersAirLastPayload=state.air.map(a=>({hex:a.hex,callsign:a.callsign,lat:a.lat,lon:a.lon,alt:a.alt,speed:a.speed,track:a.track,seen:a.seen}));
      try{window.dispatchEvent(new CustomEvent('igers:airtraffic',{detail:window.__igersAirLastPayload}));}catch(_){}
    }catch(_){stateBadge('lrcFeedAir','offline','OFFLINE · AIR FEED');set('lrcAirSync','Retry pending · '+now());}
    paintOverall();
  }
  async function refreshQuakes(){
    if(state.paused)return;
    stateBadge('lrcFeedQuake','warn','SYNCING');
    try{
      const d=await getJson('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson');
      state.quakes=(d?.features||[]).map(f=>({id:f.id,mag:num(f.properties?.mag),place:String(f.properties?.place||'Unknown'),time:num(f.properties?.time),lon:num(f.geometry?.coordinates?.[0]),lat:num(f.geometry?.coordinates?.[1]),depth:num(f.geometry?.coordinates?.[2])})).filter(q=>Number.isFinite(q.lat)&&Number.isFinite(q.lon));
      state.lastQuake=Date.now();stateBadge('lrcFeedQuake','live','LIVE · USGS GEOJSON');stateBadge('lrcResultState','live','LIVE RESULT STREAM');set('lrcQuakeCount',state.quakes.length.toLocaleString());set('lrcQuakeSync',now());renderFeedRows();renderResults();draw3D();
    }catch(_){stateBadge('lrcFeedQuake','offline','OFFLINE · USGS FEED');set('lrcQuakeSync','Retry pending · '+now());}
    paintOverall();
  }
  async function refreshWeather(){
    if(state.paused)return;
    stateBadge('lrcFeedWeather','warn','SYNCING');
    try{
      const d=await getJson('https://api.open-meteo.com/v1/forecast?latitude=23.8103&longitude=90.4125&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation,weather_code&timezone=Asia%2FDhaka&forecast_days=1');
      state.weather={temp:num(d.current?.temperature_2m),hum:num(d.current?.relative_humidity_2m),wind:num(d.current?.wind_speed_10m),precip:num(d.current?.precipitation),code:num(d.current?.weather_code),time:d.current?.time||''};state.lastWeather=Date.now();
      stateBadge('lrcFeedWeather','live','LIVE · OPEN-METEO');stateBadge('lrcResultState','live','LIVE RESULT STREAM');set('lrcWeather',''+state.weather.temp.toFixed(1)+' °C');set('lrcWeatherSync',now());renderResults();draw3D();
    }catch(_){stateBadge('lrcFeedWeather','offline','OFFLINE · WEATHER');set('lrcWeatherSync','Retry pending · '+now());}
    paintOverall();
  }
  function parseRows(d){
    const arr=Array.isArray(d?.zones)?d.zones:Array.isArray(d?.vehicles)?d.vehicles:Array.isArray(d?.tollPlazas)?d.tollPlazas:Array.isArray(d?.plazas)?d.plazas:Array.isArray(d)?d:[];
    return arr.map(x=>({name:String(x.name||x.zone||x.plaza||'Zone'),moving:num(x.vehicleCount??x.movingVehicles??x.count),flow:num(x.vehiclesPerHour??x.flowPerHour??x.flow),queue:num(x.queue),source:String(x.source||d?.source||'authorized feed')})).filter(r=>r.moving>0||r.flow>0||r.queue>0||r.name);
  }
  function mergeTraffic(rows,source){if(!rows.length)return;state.traffic=rows.slice(0,40);state.trafficSource=source||'authorized feed';state.lastTraffic=Date.now();state.sim=false;stateBadge('lrcTrafficFlowState','live','LIVE · '+state.trafficSource);set('lrcTrafficSync',now());stateBadge('lrcResultState','live','LIVE RESULT STREAM');renderFeedRows();renderResults();drawFlow();paintOverall();}
  function localTrafficConfig(){
    try{const a=JSON.parse(localStorage.getItem('igersNationalTollV2')||'{}');if(a.feedUrl)return a.feedUrl;}catch(_){}
    try{const b=localStorage.getItem('igersVehicleFeedUrl')||'';if(b)return b;}catch(_){}
    return '';
  }
  async function refreshTraffic(){
    if(state.paused)return;
    const url=localTrafficConfig();
    if(!url){stateBadge('lrcFeedTraffic','warn','NO AUTHORIZED FEED');set('lrcTrafficSync','No configured live traffic endpoint');paintOverall();return;}
    stateBadge('lrcFeedTraffic','warn','SYNCING');
    try{const d=await getJson(url,9000);const rows=parseRows(d);if(!rows.length)throw Error('No flow rows');mergeTraffic(rows,String(d?.source||'AUTHORIZED TOLL / ITS'));stateBadge('lrcFeedTraffic','live','LIVE · AUTHORIZED TRAFFIC');set('lrcTrafficSync',now());}
    catch(_){stateBadge('lrcFeedTraffic','offline','VERIFY · TRAFFIC FEED');set('lrcTrafficSync','Unavailable · '+now());}
  }
  function renderFeedRows(){
    const box=$('lrcFeedRows');if(!box)return;
    const air=state.air.slice(0,6).map(a=>'<div class="lrc-feed-row"><div><strong>'+esc(a.callsign)+'</strong><small>ADS-B · '+esc(a.hex)+' · '+a.lat.toFixed(3)+', '+a.lon.toFixed(3)+'</small></div><em>'+Math.round(a.alt||0).toLocaleString()+' ft</em></div>');
    const q=state.quakes.slice(0,4).map(x=>'<div class="lrc-feed-row"><div><strong>M'+x.mag.toFixed(1)+' · '+esc(x.place)+'</strong><small>USGS · '+new Date(x.time).toLocaleString('en-GB')+'</small></div><em>'+x.depth.toFixed(1)+' km</em></div>');
    if(air.length+q.length)box.innerHTML=air.concat(q).join('');else box.innerHTML='<div class="lrc-empty">No public feed rows available yet. The panel will not fabricate live observations.</div>';
  }
  function renderResults(){
    const body=$('lrcResultBody');if(!body)return;
    const rows=[];
    if(state.weather)rows.push(['WEATHER','Dhaka',''+state.weather.temp.toFixed(1)+' °C','Humidity '+state.weather.hum.toFixed(0)+'% · Wind '+state.weather.wind.toFixed(1)+' km/h']);
    state.quakes.slice(0,5).forEach(q=>rows.push(['SEISMIC','M'+q.mag.toFixed(1),q.place,q.lat.toFixed(3)+', '+q.lon.toFixed(3)]));
    state.traffic.slice(0,8).forEach(r=>rows.push(['TRAFFIC',r.name,Math.round(r.flow||r.moving).toLocaleString()+(r.flow?'/h':''),r.source]));
    if(state.air.slice(0,6).length)state.air.slice(0,6).forEach(a=>rows.push(['AIR',a.callsign,Math.round(a.alt||0).toLocaleString()+' ft',Math.round(a.speed||0)+' kt']));
    body.innerHTML=rows.length?rows.map(r=>'<tr><td>'+esc(r[0])+'</td><td>'+esc(r[1])+'</td><td>'+esc(r[2])+'</td><td>'+esc(r[3])+'</td></tr>').join(''):'<tr><td colspan="4" class="lrc-empty">Waiting for live results…</td></tr>';
  }
  function size(c){if(!c)return null;const d=Math.min(2,devicePixelRatio||1),r=c.getBoundingClientRect(),w=Math.max(1,r.width),h=Math.max(1,r.height);c.width=Math.round(w*d);c.height=Math.round(h*d);const x=c.getContext('2d');x.setTransform(d,0,0,d,0,0);return{x,w,h};}
  function draw3D(){const c=$('lrc3D');const s=size(c);if(!s)return;const {x,w,h}=s;x.clearRect(0,0,w,h);const cx=w/2,cy=h*.52,r=Math.min(w,h)*.30;
    const bg=x.createRadialGradient(cx,cy,5,cx,cy,r*1.8);bg.addColorStop(0,'rgba(60,150,175,.18)');bg.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=bg;x.fillRect(0,0,w,h);x.fillStyle='#06141d';x.beginPath();x.arc(cx,cy,r,0,Math.PI*2);x.fill();
    x.strokeStyle='rgba(85,221,255,.22)';for(let i=1;i<5;i++){x.beginPath();x.arc(cx,cy,r*i/4,0,Math.PI*2);x.stroke()}for(let i=-2;i<=2;i++){x.beginPath();x.ellipse(cx,cy,r,r*(.18+i*.07),i*.12,0,Math.PI*2);x.stroke()}
    state.air.slice(0,100).forEach(a=>{const px=cx+(a.lon-90.4125)*w*.038,py=cy-(a.lat-23.8103)*h*.05; if(px<cx-r||px>cx+r||py<cy-r||py>cy+r)return;x.fillStyle='#55ddff';x.shadowColor='#55ddff';x.shadowBlur=8;x.beginPath();x.arc(px,py,2.5,0,Math.PI*2);x.fill();x.shadowBlur=0});
    state.quakes.slice(0,40).forEach(q=>{const px=cx+(q.lon-90.4)*w*.015,py=cy-(q.lat-23.8)*h*.018;if(px<cx-r||px>cx+r||py<cy-r||py>cy+r)return;x.fillStyle='#ffd37a';x.beginPath();x.arc(px,py,Math.max(2,Math.min(7,q.mag)),0,Math.PI*2);x.fill()});
    const zones=state.traffic.slice(0,12);zones.forEach((z,i)=>{const a=(i/Math.max(1,zones.length))*Math.PI*2-.5;const rr=r*.76;const px=cx+Math.cos(a)*rr,py=cy+Math.sin(a)*rr*.60;x.fillStyle='#8af3bf';x.beginPath();x.arc(px,py,4,0,Math.PI*2);x.fill();x.strokeStyle='rgba(138,243,191,.34)';x.beginPath();x.moveTo(cx,cy);x.lineTo(px,py);x.stroke()});
    x.fillStyle='#d9f2fa';x.font='700 11px system-ui';x.fillText('3D LIVE DATA FIELD',12,20);x.fillStyle='#8da7b6';x.font='9px system-ui';x.fillText('AIR · SEISMIC · WEATHER · AUTHORIZED TRAFFIC',12,36);
  }
  function drawFlow(){const c=$('lrcFlow');const s=size(c);if(!s)return;const {x,w,h}=s;x.clearRect(0,0,w,h);const bg=x.createLinearGradient(0,0,w,h);bg.addColorStop(0,'#061018');bg.addColorStop(1,'#0a1b24');x.fillStyle=bg;x.fillRect(0,0,w,h);
    const lanes=Math.max(3,Math.min(8,state.traffic.length||6));for(let i=0;i<lanes;i++){const y=45+i*(h-90)/Math.max(1,lanes-1);x.strokeStyle='rgba(85,221,255,.16)';x.lineWidth=10;x.beginPath();x.moveTo(20,y);x.lineTo(w-20,y);x.stroke();x.strokeStyle='rgba(220,240,245,.28)';x.setLineDash([12,12]);x.lineWidth=1;x.beginPath();x.moveTo(20,y);x.lineTo(w-20,y);x.stroke();x.setLineDash([])}
    const rows=state.traffic.length?state.traffic.slice(0,lanes):[];const max=Math.max(1,...rows.map(r=>r.flow||r.moving||0));
    rows.forEach((r,i)=>{const y=45+i*(h-90)/Math.max(1,lanes-1),count=Math.min(14,Math.max(1,Math.round((r.flow||r.moving||1)/max*14)));for(let j=0;j<count;j++){const xx=((j/14*w*1.08)+state.flowPhase*(1+i*.08))%(w-30)+15;x.fillStyle='#8af3bf';x.beginPath();x.arc(xx,y,4,0,Math.PI*2);x.fill();}x.fillStyle='#eaf7fc';x.font='9px system-ui';x.fillText(String(r.name).slice(0,18),24,y-10);x.fillStyle='#55ddff';x.fillText(Math.round(r.flow||r.moving).toLocaleString()+(r.flow?'/h':''),w-90,y-10)});
    if(!rows.length){x.fillStyle='#8da7b6';x.font='11px system-ui';x.fillText('TRAFFIC FLOW WAITING FOR LIVE/AUTHORIZED COUNT DATA',18,28);x.font='9px system-ui';x.fillText('No traffic particles are fabricated until a real feed is available.',18,46)}
    x.fillStyle='#8da7b6';x.font='8px system-ui';x.fillText(state.sim?'SIMULATION · NOT LIVE':'OBSERVED / AUTHORIZED FLOW ONLY',18,h-12);state.flowPhase+=.7;
  }
  function syncFromEvents(){
    window.addEventListener('igers:toll-traffic',e=>{const rows=(e.detail?.rows||[]).map(r=>({name:r.name||r.id,moving:num(r.vehicleCount),flow:num(r.vehiclesPerHour),queue:num(r.queue),source:r.source||e.detail?.source||'toll feed'}));mergeTraffic(rows,'Toll / ITS live event bridge');stateBadge('lrcFeedTraffic',rows.length?'live':'warn',rows.length?'LIVE · TOLL/ITS EVENT':'VERIFY · EMPTY EVENT');});
    window.addEventListener('igers:vehicle-flow',e=>{const rows=e.detail?.rows||[];mergeTraffic(rows,'Vehicle monitor event bridge');stateBadge('lrcFeedTraffic',rows.length?'live':'warn',rows.length?'LIVE · VEHICLE EVENT':'VERIFY · EMPTY EVENT');});
  }
  function bind(){
    $('lrcRefreshAll')?.addEventListener('click',()=>{refreshAir();refreshQuakes();refreshWeather();refreshTraffic();});
    $('lrcPause')?.addEventListener('click',e=>{state.paused=!state.paused;e.currentTarget.textContent=state.paused?'Resume live refresh':'Pause live refresh';if(!state.paused){refreshAir();refreshQuakes();refreshWeather();refreshTraffic();}});
    $('lrcFlowSim')?.addEventListener('click',()=>{state.sim=!state.sim;if(state.sim){state.traffic=['Dhaka','Chattogram','Gazipur','Narayanganj','Rajshahi','Khulna'].map((n,i)=>({name:n,moving:900+i*320,flow:1800+i*610,queue:12+i*7,source:'simulation'}));state.trafficSource='SIMULATION';state.lastTraffic=Date.now();stateBadge('lrcFeedTraffic','warn','SIMULATION · NOT LIVE');}else{state.traffic=[];state.trafficSource='WAITING';stateBadge('lrcFeedTraffic','warn','NO AUTHORIZED FEED');}renderFeedRows();renderResults();drawFlow();draw3D();});
    window.addEventListener('resize',()=>{draw3D();drawFlow();});syncFromEvents();
  }
  function init(){if(!$('lrc3D'))return;bind();refreshAir();refreshQuakes();refreshWeather();refreshTraffic();draw3D();drawFlow();setInterval(()=>{if(!state.paused){refreshAir();refreshWeather();}},30000);setInterval(()=>{if(!state.paused){refreshQuakes();refreshTraffic();}},60000);setInterval(()=>{drawFlow();draw3D();},50);}
  window.IGERSLiveResultsFlow={state,refreshAir,refreshQuakes,refreshWeather,refreshTraffic,draw3D,drawFlow};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
