/* IGERS Border Zone Command Monitor — public-data, aggregate visualization. */
(function(){
  'use strict';
  if(window.__IGERS_BORDER_COMMAND__)return;
  window.__IGERS_BORDER_COMMAND__=true;
  const $=id=>document.getElementById(id);
  const now=()=>new Date();
  const time=()=>now().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',second:'2-digit'});
  const esc=s=>String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  let leafletPromise=null, bzcMap=null, bzcMarkers=new Map(), bzcMapReady=false, lastMapStamp=0;
  const LEAFLET_CSS='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
  const LEAFLET_JS='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
  function loadLeaflet(){
    if(window.L)return Promise.resolve(window.L);
    if(leafletPromise)return leafletPromise;
    leafletPromise=new Promise((resolve,reject)=>{
      if(!document.querySelector('link[data-igers-leaflet]')){const l=document.createElement('link');l.rel='stylesheet';l.href=LEAFLET_CSS;l.dataset.igersLeaflet='1';document.head.appendChild(l);}
      const s=document.createElement('script');s.src=LEAFLET_JS;s.async=true;s.onload=()=>window.L?resolve(window.L):reject(new Error('Leaflet global missing'));s.onerror=()=>reject(new Error('Leaflet CDN unavailable'));document.head.appendChild(s);
    });
    return leafletPromise;
  }
  const BD=[
    [92.6727,22.0412],[92.6523,21.3241],[92.3033,21.4755],[92.3685,20.6709],[92.0829,21.1922],[92.0252,21.7016],[91.8349,22.1829],[91.4171,22.7650],[90.4960,22.8050],[90.5869,22.3928],[90.2729,21.8364],[89.8475,22.0392],[89.7020,21.8571],[89.4188,21.9662],[89.0320,22.0557],[88.8763,22.8791],[88.5298,23.6311],[88.6999,24.2337],[88.0844,24.5017],[88.3064,24.8661],[88.9315,25.2387],[88.2098,25.7681],[88.5631,26.4465],[89.3551,26.0144],[89.8325,25.9651],[89.9207,25.2698],[90.8722,25.1326],[91.7996,25.1474],[92.3762,24.9767],[91.9151,24.1304],[91.4677,24.0727],[91.1590,23.5035],[91.7065,22.9853],[91.8699,23.6244],[92.1461,23.6275]
  ];
  function inside(lat,lon){let x=lon,y=lat,c=false;for(let i=0,j=BD.length-1;i<BD.length;j=i++){const xi=BD[i][0],yi=BD[i][1],xj=BD[j][0],yj=BD[j][1];const hit=((yi>y)!==(yj>y))&&(x<(xj-xi)*(y-yi)/(yj-yi+1e-12)+xi);if(hit)c=!c;}return c;}
  function predict(a,mins=5){if(!Number.isFinite(a.lat)||!Number.isFinite(a.lon)||!Number.isFinite(a.speed)||!Number.isFinite(a.track))return null;const distNm=Math.max(0,a.speed)*mins/60,br=a.track*Math.PI/180;const latRad=a.lat*Math.PI/180;const dLat=distNm*Math.cos(br)/60;const dLon=distNm*Math.sin(br)/(60*Math.max(.15,Math.cos(latRad)));return {lat:a.lat+dLat,lon:a.lon+dLon};}
  function classify(a){const current=inside(a.lat,a.lon),p=predict(a,5);if(!p)return current?'IN AIRSPACE':'UNCLASSIFIED';const future=inside(p.lat,p.lon);if(!current&&future)return 'INBOUND';if(current&&!future)return 'OUTBOUND';if(current&&future)return 'PASSING';return 'OUTSIDE';}
  function gibsUrl(lookback=0){const d=new Date(Date.now()-lookback*60000);d.setUTCSeconds(0,0);d.setUTCMinutes(Math.floor(d.getUTCMinutes()/10)*10);const p=new URLSearchParams({SERVICE:'WMS',VERSION:'1.1.1',REQUEST:'GetMap',LAYERS:'Himawari_AHI_Band13_Clean_Infrared',STYLES:'',FORMAT:'image/jpeg',SRS:'EPSG:4326',BBOX:'88,20,93,27',WIDTH:'1100',HEIGHT:'680',TIME:d.toISOString()});return 'https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?'+p.toString();}
  function build(){
    const anchor=$('airtraffic');if(!anchor||$('borderCommandMonitor'))return;
    const sec=document.createElement('section');sec.id='borderCommandMonitor';sec.className='bzc-section';
    sec.innerHTML=`<div class="wrap"><div class="section-head"><div><div class="kicker">08D · Border airspace / satellite public-data monitor</div><h2>COMMAND-STYLE BORDER ZONE MONITOR</h2><p class="mini">Actual public ADS-B aircraft feed + NASA Earth-observation imagery + aggregate flow classification. Visual style is tactical; it is not a restricted military sensor feed.</p></div><span id="bzcStatus" class="bzc-badge"><i></i><span>CONNECTING</span></span></div><div class="bzc-shell">
      <div class="bzc-header"><div class="bzc-badge" id="bzcRadarBadge"><i></i><span>RADAR SEARCH</span></div><div class="bzc-toolbar"><button class="btn primary" id="bzcRefresh" type="button">↻ Refresh feed</button><button class="btn secondary" id="bzcSatToggle" type="button">Satellite ON</button><button class="btn secondary" id="bzcMapCenter" type="button">Bangladesh view</button><button class="btn secondary" id="bzcMapOpen" type="button">Open live map</button></div></div>
      <div class="bzc-grid"><div class="bzc-map-wrap"><div id="bzcLeafletMap" class="bzc-leaflet-map" aria-label="Real Bangladesh map with public aircraft search results"></div><iframe id="bzcAirMapFallback" class="bzc-iframe-fallback" title="Public live aircraft map fallback" loading="lazy" referrerpolicy="no-referrer" allow="fullscreen" src="https://globe.airplanes.live/?lat=23.8&lon=90.3&zoom=6&hideSidebar&hideButtons&largeMode=2"></iframe><div class="bzc-map-overlay"></div><canvas id="bzcRadarCanvas" class="bzc-radar-canvas" aria-label="Aggregate border airspace radar visualization"></canvas><div class="bzc-scope"></div><div class="bzc-hud-grid"><div class="bzc-hud"><small>AIR TRAFFIC</small><strong id="bzcTotal">--</strong></div><div class="bzc-hud"><small>INBOUND</small><strong id="bzcInbound" class="amber">--</strong></div><div class="bzc-hud"><small>IN AIRSPACE</small><strong id="bzcInside" class="cyan">--</strong></div><div class="bzc-hud"><small>OUTBOUND</small><strong id="bzcOutbound" class="amber">--</strong></div></div><div class="bzc-map-label"><strong>LIVE MAP</strong> · OpenStreetMap basemap · public ADS-B/MLAT result markers</div><div class="bzc-rail"><span class="bzc-chip"><b id="bzcPass">--</b> PASSING</span><span class="bzc-chip"><b id="bzcAge">--</b> DATA AGE</span></div></div>
      <aside class="bzc-side"><article class="bzc-card"><div class="label">LIVE AIRSPACE FLOW</div><div class="bzc-stat-grid"><div class="bzc-stat"><small>TOTAL RECEIVED</small><strong id="bzcTotalSide">--</strong><span>provider response</span></div><div class="bzc-stat"><small>POSITION DATA</small><strong id="bzcPosition">--</strong><span>track-bearing targets</span></div><div class="bzc-stat"><small>FLOW</small><strong id="bzcFlow">--</strong><span>in + passing + out</span></div><div class="bzc-stat"><small>LAST SYNC</small><strong id="bzcSync">--</strong><span>browser time</span></div></div><div class="bzc-flow"><div class="bzc-flow-row"><label>INBOUND</label><div class="bzc-flow-bar"><i id="bzcInboundBar"></i></div><strong id="bzcInboundF">--</strong></div><div class="bzc-flow-row"><label>PASSING</label><div class="bzc-flow-bar"><i id="bzcPassBar"></i></div><strong id="bzcPassF">--</strong></div><div class="bzc-flow-row"><label>OUTBOUND</label><div class="bzc-flow-bar"><i id="bzcOutboundBar"></i></div><strong id="bzcOutboundF">--</strong></div></div><div class="bzc-source"><b>Search state</b><span id="bzcSearchState" class="bzc-warn">WAITING</span></div><div class="bzc-source"><b>Air source</b><span id="bzcAirSource">Airplanes.live public API</span></div></article>
      <article class="bzc-card"><div class="label">NASA SATELLITE OBSERVATION</div><div class="bzc-sat"><img id="bzcSatImg" alt="NASA public Himawari clean infrared observation over Bangladesh"><div class="bzc-sat-mask"><strong>Himawari-9 · AHI Band 13</strong><span id="bzcSatState">CHECKING</span></div></div><div class="bzc-source"><b>Observation</b><span id="bzcSatTime">--</span></div><div class="bzc-source"><b>Satellite state</b><span id="bzcSatHealth" class="bzc-warn">CONNECTING</span></div></article>
      <article class="bzc-card"><div class="label">GROUND / NETWORK STATUS</div><div class="bzc-node-list"><div class="bzc-node"><b>BORDER ZONE</b><span>Map geofence · public visualization</span></div><div class="bzc-node"><b>TOWER LAYER</b><span>Simulated / authorized feed only</span></div><div class="bzc-node"><b>MOBILE SIGNAL</b><span>Aggregate coverage index</span></div><div class="bzc-node"><b>AIR TRACK</b><span>Public ADS-B/MLAT states</span></div></div><div class="bzc-note">Aircraft flow is estimated from the current public positions and 5-minute forward projection. “Inbound/outbound” is an interface heuristic, not a flight-plan or military-intelligence determination.</div></article>
      </aside></div><div class="bzc-foot"><div class="bzc-footnote"><strong>Refresh policy:</strong> air data follows the public API cadence; satellite imagery follows the observation provider. No individual phone locations or restricted military sensors are accessed.</div><div><a class="btn secondary" href="https://worldview.earthdata.nasa.gov/?l=Himawari_AHI_Band13_Clean_Infrared" target="_blank" rel="noopener noreferrer">Open NASA Worldview</a></div></div></div></div>`;
    anchor.insertAdjacentElement('afterend',sec);
  }
  function satLoad(look=0){const img=$('bzcSatImg');if(!img)return;const state=$('bzcSatHealth');if(state){state.textContent='CHECKING';state.className='bzc-warn';}const probe=new Image(),tm=setTimeout(()=>{probe.src='';if(look<60)satLoad(look+10);else {if(state){state.textContent='OFFLINE';state.className='bzc-bad';}$('bzcSatState').textContent='NO IMAGE';}},8500);probe.onload=()=>{clearTimeout(tm);img.src=probe.src; if(state){state.textContent='IMAGE READY';state.className='bzc-good';}$('bzcSatState').textContent='READY';$('bzcSatTime').textContent=time();};probe.onerror=()=>{clearTimeout(tm);if(look<60)satLoad(look+10);else {if(state){state.textContent='OFFLINE';state.className='bzc-bad';}$('bzcSatState').textContent='NO IMAGE';}};probe.src=gibsUrl(look)+'&_='+Date.now();}
  function markerColor(mode){return mode==='INBOUND'?'#ffd27a':mode==='OUTBOUND'?'#ffae73':mode==='PASSING'?'#8edcff':'#a9e58b';}
  function popupHtml(a,mode){
    const ident=esc(a.callsign||a.hex||'Unknown');
    const pos=Number.isFinite(a.lat)&&Number.isFinite(a.lon)?`${a.lat.toFixed(4)}, ${a.lon.toFixed(4)}`:'--';
    return `<div style="min-width:180px"><strong>${ident}</strong><br><span>Status: ${esc(mode)}</span><br><span>Altitude: ${a.alt==null?'--':Math.round(a.alt).toLocaleString()+' ft'}</span><br><span>Speed: ${a.speed==null?'--':Math.round(a.speed)+' kt'}</span><br><span>Track: ${a.track==null?'--':Math.round(a.track)+'°'}</span><br><span>Position: ${pos}</span></div>`;
  }
  async function initRealMap(){
    const host=$('bzcLeafletMap'), fallback=$('bzcAirMapFallback'); if(!host)return;
    try{
      const L=await loadLeaflet();
      bzcMap=L.map(host,{preferCanvas:true,zoomControl:true,scrollWheelZoom:true,attributionControl:true}).setView([23.6850,90.3563],7);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18,attribution:'© OpenStreetMap contributors'}).addTo(bzcMap);
      const bdLatLng=BD.map(([lon,lat])=>[lat,lon]);
      L.polygon(bdLatLng,{color:'#a9e58b',weight:1.4,opacity:.7,fillColor:'#a9e58b',fillOpacity:.035,dashArray:'6 5',interactive:false}).addTo(bzcMap);
      L.circle([23.6850,90.3563],{radius:220000,color:'#a9e58b',weight:1,opacity:.16,fillOpacity:0,interactive:false}).addTo(bzcMap);
      L.marker([23.8103,90.4125],{title:'Dhaka reference'}).addTo(bzcMap).bindTooltip('Dhaka reference',{direction:'top'});
      bzcMapReady=true;
      if(fallback)fallback.style.display='none';
      setTimeout(()=>bzcMap.invalidateSize(),250);
      renderRealMap();
    }catch(err){
      bzcMapReady=false;
      if(fallback){fallback.style.display='block';}
      const state=$('bzcSearchState'); if(state){state.textContent='MAP FALLBACK · LIVE PROVIDER';state.className='bzc-warn';}
    }
  }
  function renderRealMap(){
    if(!bzcMapReady||!bzcMap)return;
    const list=Array.isArray(window.__igersAirTrafficSnapshot)?window.__igersAirTrafficSnapshot:[];
    const stamp=Number(window.__igersAirTrafficSnapshotAt||0);
    if(stamp===lastMapStamp)return;
    lastMapStamp=stamp;
    const seen=new Set();
    list.filter(a=>Number.isFinite(a.lat)&&Number.isFinite(a.lon)).slice(0,250).forEach(a=>{
      const id=a.hex||a.callsign||`${a.lat},${a.lon}`; seen.add(id); const mode=classify(a); const color=markerColor(mode);
      let m=bzcMarkers.get(id);
      if(!m){
        const L=window.L;
        const icon=L.divIcon({className:'bzc-plane-icon',html:`<span style="--bzc-plane:${color}">✈</span>`,iconSize:[22,22],iconAnchor:[11,11]});
        m=L.marker([a.lat,a.lon],{icon,title:a.callsign||a.hex||'Aircraft'}).addTo(bzcMap);
        bzcMarkers.set(id,m);
      }
      const el=m.getElement();if(el)el.style.setProperty('--bzc-plane',color);
      m.setLatLng([a.lat,a.lon]);m.bindPopup(popupHtml(a,mode),{autoPan:true});m._bzcMode=mode;
    });
    for(const [id,m] of bzcMarkers){if(!seen.has(id)){bzcMap.removeLayer(m);bzcMarkers.delete(id);}}
  }
  function drawRadar(){const c=$('bzcRadarCanvas');if(!c)return;const ctx=c.getContext('2d');if(!ctx)return;let last=0,phase=0;function resize(){const r=c.getBoundingClientRect(),d=Math.min(2,devicePixelRatio||1);c.width=Math.max(1,r.width*d);c.height=Math.max(1,r.height*d);ctx.setTransform(d,0,0,d,0,0);c._w=r.width;c._h=r.height;}resize();addEventListener('resize',resize,{passive:true});function frame(ts){const w=c._w||900,h=c._h||590,dt=Math.max(0,ts-last);last=ts;phase+=dt*.0012;ctx.clearRect(0,0,w,h);const cx=w*.5,cy=h*.54,r=Math.min(w,h)*.255;ctx.save();ctx.translate(cx,cy);ctx.strokeStyle='rgba(169,229,139,.27)';ctx.lineWidth=1;for(let i=1;i<=4;i++){ctx.beginPath();ctx.arc(0,0,r*i/4,0,Math.PI*2);ctx.stroke();}ctx.beginPath();ctx.moveTo(-r,0);ctx.lineTo(r,0);ctx.moveTo(0,-r);ctx.lineTo(0,r);ctx.stroke();ctx.rotate(phase);ctx.globalAlpha=.11;const g=ctx.createRadialGradient(0,0,0,0,0,r);g.addColorStop(0,'rgba(169,229,139,.0)');g.addColorStop(.82,'rgba(169,229,139,.05)');g.addColorStop(1,'rgba(169,229,139,.45)');ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,r,-.18,.18);ctx.closePath();ctx.fill();ctx.restore();const list=Array.isArray(window.__igersAirTrafficSnapshot)?window.__igersAirTrafficSnapshot:[];list.filter(a=>Number.isFinite(a.lat)&&Number.isFinite(a.lon)).slice(0,120).forEach((a,i)=>{const x=.50+(a.lon-90.35)*.085;const y=.55-(a.lat-23.8)*.10;const px=x*w,py=y*h;if(px<15||py<15||px>w-15||py>h-15)return;const mode=classify(a);ctx.save();ctx.fillStyle=mode==='INBOUND'?'#ffd27a':mode==='OUTBOUND'?'#ffae73':mode==='PASSING'?'#8edcff':'#a9e58b';ctx.shadowColor=ctx.fillStyle;ctx.shadowBlur=10;ctx.beginPath();ctx.arc(px,py,2.7,0,Math.PI*2);ctx.fill();ctx.restore();});requestAnimationFrame(frame);}requestAnimationFrame(frame);}
  function sync(){const list=Array.isArray(window.__igersAirTrafficSnapshot)?window.__igersAirTrafficSnapshot:[];renderRealMap();const total=Number(window.__igersAirTrafficTotal||list.length);const pos=list.filter(a=>Number.isFinite(a.lat)&&Number.isFinite(a.lon));const counts={INBOUND:0,PASSING:0,OUTBOUND:0,'IN AIRSPACE':0};pos.forEach(a=>{const c=classify(a);if(c==='INBOUND')counts.INBOUND++;else if(c==='PASSING'){counts.PASSING++;counts['IN AIRSPACE']++;}else if(c==='OUTBOUND'){counts.OUTBOUND++;counts['IN AIRSPACE']++;}else if(c==='IN AIRSPACE')counts['IN AIRSPACE']++;});const age=Number(window.__igersAirTrafficSnapshotAge);$('bzcTotal')&&( $('bzcTotal').textContent=Number.isFinite(total)?String(total):'--');$('bzcTotalSide')&&($('bzcTotalSide').textContent=Number.isFinite(total)?String(total):'--');$('bzcPosition')&&($('bzcPosition').textContent=String(pos.length));$('bzcInbound')&&($('bzcInbound').textContent=String(counts.INBOUND));$('bzcInside')&&($('bzcInside').textContent=String(counts['IN AIRSPACE']));$('bzcOutbound')&&($('bzcOutbound').textContent=String(counts.OUTBOUND));$('bzcPass')&&($('bzcPass').textContent=String(counts.PASSING));const flow=counts.INBOUND+counts.PASSING+counts.OUTBOUND;$('bzcFlow')&&($('bzcFlow').textContent=String(flow));$('bzcSync')&&($('bzcSync').textContent=time());$('bzcAge')&&($('bzcAge').textContent=Number.isFinite(age)?(age<60?Math.round(age)+'s':Math.round(age/60)+'m'):'--');[['bzcInboundBar',counts.INBOUND],['bzcPassBar',counts.PASSING],['bzcOutboundBar',counts.OUTBOUND]].forEach(([id,n])=>{const e=$(id);if(e)e.style.width=(pos.length?Math.min(100,n/Math.max(1,pos.length)*100):0)+'%';});[['bzcInboundF',counts.INBOUND],['bzcPassF',counts.PASSING],['bzcOutboundF',counts.OUTBOUND]].forEach(([id,n])=>$(id)&&($(id).textContent=String(n)));const live=Number.isFinite(age)&&age<=45,deg=Number.isFinite(age)&&age<=120;const badge=$('bzcStatus'),r=$('bzcRadarBadge'),ss=$('bzcSearchState');if(badge){badge.className='bzc-badge '+(live?'':deg?'warn':'off');badge.querySelector('span').textContent=live?'PUBLIC DATA LIVE':deg?'PUBLIC DATA DEGRADED':'PUBLIC DATA OFFLINE';}if(r){r.className='bzc-badge '+(live?'':deg?'warn':'off');r.querySelector('span').textContent=live?'RADAR SEARCH ACTIVE':deg?'RADAR SEARCH DEGRADED':'RADAR SEARCH OFFLINE';}if(ss){ss.textContent=live?'ACTIVE · PUBLIC ADS-B':deg?'DEGRADED · STALE':'OFFLINE';ss.className=live?'bzc-good':deg?'bzc-warn':'bzc-bad';}}
  function start(){build();drawRadar();initRealMap();satLoad(0);sync();$('bzcRefresh')?.addEventListener('click',()=>{window.__igersAirTrafficManualRefresh?.();sync();});$('bzcSatToggle')?.addEventListener('click',()=>{const img=$('bzcSatImg'),b=$('bzcSatToggle');const off=img.dataset.off==='1';img.dataset.off=off?'0':'1';img.style.opacity=off?'0.73':'0';b.textContent=off?'Satellite ON':'Satellite OFF';});$('bzcMapCenter')?.addEventListener('click',()=>{if(bzcMapReady&&bzcMap)bzcMap.setView([23.6850,90.3563],7);});$('bzcMapOpen')?.addEventListener('click',()=>window.open('https://globe.airplanes.live/?lat=23.8&lon=90.3&zoom=6','_blank','noopener'));setInterval(sync,1000);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
