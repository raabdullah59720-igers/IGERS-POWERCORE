/* IGERS POWERCORE — Bangladesh Border Surveillance & Early-Warning Monitor
   Defensive, read-only visualization using public / authorized data only.
   No weapon-control, targeting, jamming, interception, or automated engagement. */
(function(){
  'use strict';
  const $=id=>document.getElementById(id);
  const state={boundary:null,riverBoundary:null,boundarySource:'NONE',boundaryLoad:'VERIFY',air:[],nodes:[],rotation:.18,tilt:.24,zoom:1,alert:null,lastSync:null,feed:'VERIFY',requestPending:false,layers:{outline:true,rivers:true,air:true,nodes:true,radar:true}};
  const SRC_REMOTE='https://github.com/wmgeolab/geoBoundaries/raw/9469f09592ced973a3448cf66b6100b741b64c0d/releaseData/gbOpen/BGD/ADM0/geoBoundaries-BGD-ADM0_simplified.geojson';
  const SRC_META='https://www.geoboundaries.org/api/current/gbOpen/BGD/ADM0/';
  const FALLBACK='data/bangladesh-boundary-fallback.geojson';
  const BD={minLat:20.67,maxLat:26.45,minLon:88.08,maxLon:92.67};
  const rad=(d)=>d*Math.PI/180;
  const KABA={lat:21.4225,lon:39.8262};
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const now=()=>new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',second:'2-digit'});
  const setText=(id,v)=>{const e=$(id);if(e)e.textContent=v;};
  const setLive=(id,kind,text)=>{const e=$(id);if(!e)return;e.className='bdm-live'+(kind?' '+kind:'');e.innerHTML='<i></i>'+esc(text);};
  const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
  function sizeCanvas(c){if(!c)return null;const r=c.getBoundingClientRect(),d=window.devicePixelRatio||1,w=Math.max(280,r.width),h=Math.max(240,r.height);const cw=Math.floor(w*d),ch=Math.floor(h*d);if(c.width!==cw||c.height!==ch){c.width=cw;c.height=ch;}const ctx=c.getContext('2d');ctx.setTransform(d,0,0,d,0,0);return{ctx,w,h,d};}
  async function json(url,timeout=15000){const ac=new AbortController(),to=setTimeout(()=>ac.abort(),timeout);try{const r=await fetch(url,{cache:'no-store',signal:ac.signal,headers:{Accept:'application/json'}});if(!r.ok)throw new Error('HTTP '+r.status);return await r.json();}finally{clearTimeout(to);}}
  async function loadBoundary(){
    setLive('bdmGeoLive','warn','LOADING · bundled Bangladesh outline');
    // Paint immediately from the bundle; remote requests must not leave the panel blank while they time out.
    try{
      const local=await json(FALLBACK,3500);
      if(local?.features?.length){state.boundary=local;state.riverBoundary=local;state.boundarySource='Simplified local fallback';state.boundaryLoad='FALLBACK';setText('bdmGeoSource','Bundled simplified Bangladesh outline · public source is checked in background');setLive('bdmGeoLive','warn','MAP READY · SIMPLIFIED FALLBACK');renderAll();}
    }catch(_){}
    try{
      const meta=await json(SRC_META,6500);
      const currentUrl=meta?.gjDownloadURL;
      if(currentUrl){const d=await json(currentUrl,9000);if(d?.features?.length){state.boundary=d;state.boundarySource='geoBoundaries BGD ADM0';state.boundaryLoad='LIVE';setText('bdmGeoSource','geoBoundaries BGD ADM0 · public boundary dataset');setLive('bdmGeoLive','ok','BOUNDARY DATA CONNECTED');renderAll();return;}}
    }catch(_){}
    try{const d=await json(SRC_REMOTE,9000);if(d?.features?.length){state.boundary=d;state.boundarySource='geoBoundaries BGD ADM0';state.boundaryLoad='LIVE';setText('bdmGeoSource','geoBoundaries BGD ADM0 · public boundary dataset');setLive('bdmGeoLive','ok','BOUNDARY DATA CONNECTED');renderAll();return;}}catch(_){}
    if(state.boundary){setText('bdmGeoSource','Bundled simplified Bangladesh outline · public boundary service unreachable');setLive('bdmGeoLive','warn','MAP READY · PUBLIC SOURCE OFFLINE');return;}
    setLive('bdmGeoLive','offline','OFFLINE · boundary unavailable');setText('bdmGeoSource','Boundary data unavailable');
  }
  function allRings(){
    const out=[];(state.boundary?.features||[]).forEach(f=>{const g=f.geometry;if(!g)return;if(g.type==='Polygon')g.coordinates.forEach(r=>out.push(r));if(g.type==='MultiPolygon')g.coordinates.forEach(poly=>poly.forEach(r=>out.push(r)));});return out.filter(r=>Array.isArray(r)&&r.length>2);
  }
  function allRivers(){const source=state.riverBoundary||state.boundary;return (source?.features||[]).filter(f=>f.properties?.layer==='river'||f.geometry?.type==='LineString').map(f=>f.geometry?.coordinates).filter(r=>Array.isArray(r)&&r.length>1);}
  function centroid(r){let x=0,y=0,n=0;for(const p of r){x+=p[0];y+=p[1];n++;}return n?[x/n,y/n]:[90.4,23.8];}
  function llTo3d(lon,lat,z){const cx=(BD.minLon+BD.maxLon)/2,cy=(BD.minLat+BD.maxLat)/2;const sx=(lon-cx)/(BD.maxLon-BD.minLon),sy=(lat-cy)/(BD.maxLat-BD.minLat);const yaw=state.rotation,cyaw=Math.cos(yaw),syaw=Math.sin(yaw);let x=sx*2.2,y=sy*2.2;const xr=x*cyaw+y*syaw,yr=-x*syaw+y*cyaw;return{x:xr,y:yr,z:z||0};}
  function project(p,w,h,zoom=1){zoom=clamp(zoom*state.zoom,.55,2.25);const depth=1/(1+Math.max(-.65,p.y)*.22);const px=w/2+p.x*w*.32*zoom*depth;const py=h/2-p.y*h*.37*zoom*depth-p.z*95;return[px,py];}
  function drawGeoGrid(ctx,w,h){
    if(!state.layers.outline)return;ctx.save();ctx.strokeStyle='rgba(85,221,255,.17)';ctx.lineWidth=.65;ctx.setLineDash([3,5]);
    for(let lat=21;lat<=26;lat+=1){ctx.beginPath();let first=true;for(let lon=BD.minLon;lon<=BD.maxLon+.001;lon+=.12){const q=project(llTo3d(lon,lat,.005),w,h,1);if(first){ctx.moveTo(q[0],q[1]);first=false;}else ctx.lineTo(q[0],q[1]);}ctx.stroke();}
    for(let lon=88;lon<=93.001;lon+=.5){ctx.beginPath();let first=true;for(let lat=BD.minLat;lat<=BD.maxLat+.001;lat+=.12){const q=project(llTo3d(lon,lat,.005),w,h,1);if(first){ctx.moveTo(q[0],q[1]);first=false;}else ctx.lineTo(q[0],q[1]);}ctx.stroke();}
    ctx.setLineDash([]);ctx.restore();
  }
  function drawBoundary(ctx,w,h){
    const rings=allRings();if(!rings.length||!state.layers.outline)return;
    const base=[],top=[];rings.forEach(r=>{const b=r.map(p=>project(llTo3d(p[0],p[1],0),w,h,1));const t=r.map(p=>project(llTo3d(p[0],p[1],.16),w,h,1));base.push(b);top.push(t);});
    ctx.save();ctx.lineJoin='round';
    for(let i=0;i<base.length;i++){const b=base[i],t=top[i];ctx.fillStyle='rgba(34,94,112,.55)';ctx.strokeStyle='rgba(85,221,255,.35)';ctx.lineWidth=1;ctx.beginPath();t.forEach((p,j)=>j?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();ctx.fill();ctx.stroke();}
    for(let i=0;i<base.length;i++){const b=base[i],t=top[i];ctx.fillStyle='rgba(10,30,41,.96)';ctx.strokeStyle='rgba(85,221,255,.72)';ctx.lineWidth=1.2;ctx.beginPath();b.forEach((p,j)=>j?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();ctx.fill();ctx.stroke();ctx.beginPath();t.forEach((p,j)=>j?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();ctx.fillStyle='rgba(9,27,37,.78)';ctx.fill();ctx.strokeStyle='rgba(138,243,191,.42)';ctx.stroke();}
    ctx.restore();
  }
  function drawRivers(ctx,w,h){if(!state.layers.rivers)return;ctx.save();ctx.strokeStyle='rgba(72,193,232,.82)';ctx.lineWidth=1.1;ctx.shadowColor='rgba(72,193,232,.28)';ctx.shadowBlur=3;allRivers().forEach(r=>{ctx.beginPath();r.forEach((p,i)=>{const q=project(llTo3d(Number(p[0]),Number(p[1]),.03),w,h,1);if(i===0)ctx.moveTo(q[0],q[1]);else ctx.lineTo(q[0],q[1]);});ctx.stroke();});ctx.restore();}
  function pointInApproxBD(a){return a&&Number.isFinite(a.lat)&&Number.isFinite(a.lon)&&a.lat>=BD.minLat&&a.lat<=BD.maxLat&&a.lon>=BD.minLon&&a.lon<=BD.maxLon;}
  function seedNodes(){
    if(state.nodes.length)return;
    const pts=[[26.25,88.35],[25.0,88.15],[23.9,88.2],[22.65,88.25],[21.65,88.55],[20.95,89.3],[21.15,90.8],[21.0,91.9],[22.25,92.35],[23.65,92.45],[25.2,92.2],[26.25,91.55]];
    state.nodes=pts.map((p,i)=>({id:'B-'+String(i+1).padStart(2,'0'),lat:p[0],lon:p[1],status:i===3||i===8?'DEGRADED':'ONLINE',coverage:Math.round(7+((i*7)%10))}));
  }
  function nodeHealth(){return state.nodes.filter(n=>n.status==='ONLINE').length+'/'+state.nodes.length;}
  function renderNodes(ctx,w,h){
    if(!state.layers.nodes)return;state.nodes.forEach((n,i)=>{const pp=project(llTo3d(n.lon,n.lat,.2),w,h,1.0);const col=n.status==='ONLINE'?'#8af3bf':n.status==='DEGRADED'?'#ffd37a':'#ff7777';ctx.save();ctx.strokeStyle=col+'55';ctx.lineWidth=1;for(let k=1;k<=3;k++){ctx.beginPath();ctx.arc(pp[0],pp[1],6+k*7+Math.sin(performance.now()/700+i)*2,0,Math.PI*2);ctx.stroke();}ctx.fillStyle=col;ctx.shadowColor=col;ctx.shadowBlur=15;ctx.beginPath();ctx.arc(pp[0],pp[1],4.5,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.fillStyle='#e9f9ff';ctx.font='9px system-ui';ctx.fillText(n.id,pp[0]+8,pp[1]-8);ctx.restore();});
  }
  function renderTargets(ctx,w,h){
    if(!state.layers.air)return;const pts=state.air.filter(pointInApproxBD);
    pts.forEach(a=>{const p=project(llTo3d(Number(a.lon),Number(a.lat),.25),w,h,1);const unknown=!a.callsign||!a.reg||a.callsign==='Unknown';const col=unknown?'#ffd37a':'#55ddff';ctx.save();ctx.fillStyle=col;ctx.shadowColor=col;ctx.shadowBlur=14;ctx.beginPath();ctx.arc(p[0],p[1],unknown?4.2:3.2,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.strokeStyle=col+'55';ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.lineTo(p[0],p[1]-20);ctx.stroke();ctx.fillStyle='#eaf7fc';ctx.font='9px system-ui';ctx.fillText((unknown?'UNKNOWN':a.callsign).toString().slice(0,14),p[0]+6,p[1]-7);ctx.restore();});
  }
  function renderRadar(ctx,w,h){if(!state.layers.radar)return;const cx=w*.53,cy=h*.47,r=Math.min(w,h)*.29;ctx.save();for(let i=1;i<=4;i++){ctx.strokeStyle='rgba(85,221,255,'+(0.22-i*.035)+')';ctx.beginPath();ctx.arc(cx,cy,r*i/4,0,Math.PI*2);ctx.stroke();}ctx.strokeStyle='rgba(85,221,255,.12)';ctx.beginPath();ctx.moveTo(cx-r,cy);ctx.lineTo(cx+r,cy);ctx.moveTo(cx,cy-r);ctx.lineTo(cx,cy+r);ctx.stroke();const ang=performance.now()/1300;const x=cx+Math.cos(ang)*r,y=cy+Math.sin(ang)*r;const g=ctx.createLinearGradient(cx,cy,x,y);g.addColorStop(0,'rgba(85,221,255,.02)');g.addColorStop(1,'rgba(85,221,255,.62)');ctx.strokeStyle=g;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(x,y);ctx.stroke();ctx.restore();}
  function renderRadarScanner(){
    const c=$('bdmRadar3D'),s=sizeCanvas(c);if(!s)return;const {ctx,w,h}=s;ctx.clearRect(0,0,w,h);
    const cx=w*.5,cy=h*.5,r=Math.min(w,h)*.39,nowMs=performance.now();
    const bg=ctx.createRadialGradient(cx,cy,4,cx,cy,r);bg.addColorStop(0,'rgba(20,72,89,.16)');bg.addColorStop(.55,'rgba(8,28,37,.08)');bg.addColorStop(1,'rgba(0,0,0,.08)');ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);
    ctx.save();ctx.strokeStyle='rgba(85,221,255,.26)';ctx.lineWidth=1;
    for(let i=1;i<=4;i++){ctx.beginPath();ctx.arc(cx,cy,r*i/4,0,Math.PI*2);ctx.stroke();}
    for(const a of [0,45,90,135,180,225,270,315]){const t=rad(a-90);ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(t)*r,cy+Math.sin(t)*r);ctx.stroke();}
    ctx.strokeStyle='rgba(138,243,191,.18)';ctx.setLineDash([4,6]);ctx.beginPath();ctx.arc(cx,cy,r*.72,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);
    const sweep=(nowMs/1200)%(Math.PI*2);const x=cx+Math.cos(sweep)*r,y=cy+Math.sin(sweep)*r;const g=ctx.createLinearGradient(cx,cy,x,y);g.addColorStop(0,'rgba(85,221,255,0)');g.addColorStop(.35,'rgba(85,221,255,.12)');g.addColorStop(1,'rgba(138,243,191,.78)');ctx.strokeStyle=g;ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(x,y);ctx.stroke();
    const pts=state.air.filter(pointInApproxBD);pts.forEach(a=>{const lon=Number(a.lon),lat=Number(a.lat);const nx=(lon-(BD.minLon+BD.maxLon)/2)/(BD.maxLon-BD.minLon),ny=(lat-(BD.minLat+BD.maxLat)/2)/(BD.maxLat-BD.minLat);const px=cx+nx*r*1.35,py=cy-ny*r*1.35;const unknown=!a.callsign||!a.reg||a.callsign==='Unknown';const col=unknown?'#ffd37a':'#55ddff';ctx.fillStyle=col;ctx.shadowColor=col;ctx.shadowBlur=12;ctx.beginPath();ctx.arc(px,py,unknown?4:3,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;});
    ctx.fillStyle='rgba(234,248,255,.8)';ctx.font='9px system-ui';ctx.fillText('PUBLIC ADS-B / RADAR-STYLE SCANNER',12,h-12);ctx.fillStyle='rgba(141,167,182,.8)';ctx.fillText('N',cx-3,cy-r-7);ctx.fillText('E',cx+r+7,cy+3);ctx.fillText('S',cx-3,cy+r+15);ctx.fillText('W',cx-r-15,cy+3);ctx.restore();
    requestAnimationFrame(renderRadarScanner);
  }
  function renderRadarTracks(){
    const box=$('bdmRadarTracks');if(!box)return;const pts=state.air.filter(pointInApproxBD);box.innerHTML='';if(!pts.length){box.innerHTML='<div class="bdm-note">No public ADS-B positions are currently available inside the approximate Bangladesh view.</div>';return;}
    pts.slice(0,14).forEach(a=>{const row=document.createElement('div');row.className='bdm-radar-track';const ident=(a.callsign||a.reg||a.hex||'UNKNOWN').trim();const unknown=!a.callsign||!a.reg||a.callsign==='Unknown';row.innerHTML='<div><b>'+esc(ident)+'</b><span>'+esc((Number.isFinite(a.alt)?Math.round(a.alt).toLocaleString()+' ft':'alt n/a')+' · '+(Number.isFinite(a.speed)?Math.round(a.speed)+' kt':'speed n/a'))+'</span></div><em>'+esc(unknown?'UNVERIFIED':'TRACK')+'</em>';box.appendChild(row);});
  }

  function renderBorder3D(){
    const c=$('bdmBorder3D'),s=sizeCanvas(c);if(!s)return;const {ctx,w,h}=s;ctx.clearRect(0,0,w,h);ctx.fillStyle='#03090d';ctx.fillRect(0,0,w,h);const grd=ctx.createRadialGradient(w*.52,h*.45,10,w*.52,h*.45,Math.min(w,h)*.58);grd.addColorStop(0,'rgba(85,221,255,.08)');grd.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=grd;ctx.fillRect(0,0,w,h);renderRadar(ctx,w,h);drawGeoGrid(ctx,w,h);drawBoundary(ctx,w,h);drawRivers(ctx,w,h);renderNodes(ctx,w,h);renderTargets(ctx,w,h);renderRadarTracks();setText('bdmRadarVisible',String(state.air.filter(pointInApproxBD).length));setText('bdmRadarUnknown',String(state.air.filter(a=>pointInApproxBD(a)&&(!a.callsign||!a.reg||a.callsign==='Unknown')).length));ctx.fillStyle='rgba(234,248,255,.8)';ctx.font='10px system-ui';ctx.fillText('BANGLADESH · DEFENSIVE EARLY-WARNING VIEW',14,h-20);state.rotation+=0.0008;requestAnimationFrame(renderBorder3D);
  }
  function renderAlert(){const e=$('bdmAlert');if(!e)return;if(!state.alert){e.className='bdm-alert ok';e.textContent='No unverified public-data track currently detected inside the approximate Bangladesh monitoring view.';return;}e.className='bdm-alert warn';e.innerHTML='<b>UNVERIFIED TRACK NOTICE</b> · '+esc(state.alert.count)+' public-data track(s) lack sufficient identity fields. This is not evidence of hostile activity; operator verification is required.';}
  function renderZoneList(){const box=$('bdmZoneList');if(!box)return;box.innerHTML=state.nodes.map(n=>'<div class="bdm-zone"><div><b>'+esc(n.id)+' · Virtual border gateway</b><span>Illustrative coverage node · not an actual operator tower location</span></div><em>'+esc(n.status)+' · '+n.coverage+' km</em></div>').join('');}
  function renderAll(){seedNodes();renderZoneList();renderBorder3D();setText('bdmNodeCount',String(state.nodes.length));setText('bdmNetworkHealth',nodeHealth());setText('bdmLastSync',state.lastSync?now():'--');}
  function ageLabel(seconds){
    if(!Number.isFinite(seconds)||seconds<0)return '--';
    return seconds<60?Math.round(seconds)+'s':Math.round(seconds/60)+'m';
  }
  function handleAir(payload){
    const rows=Array.isArray(payload)?payload:[];
    state.air=rows.map(a=>({
      hex:String(a.hex||''),callsign:String(a.callsign||a.flight||'').trim(),reg:String(a.reg||a.r||'').trim(),
      lat:Number(a.lat),lon:Number(a.lon),alt:(a.alt==null||a.alt==='')?NaN:Number(a.alt),
      speed:(a.speed==null||a.speed==='')?NaN:Number(a.speed),squawk:a.squawk,
      seen:Number(a.seen_pos??a.seen)
    }));
    const syncMs=Number(window.__igersAirLastSync);
    if(Number.isFinite(syncMs)&&syncMs>0)state.lastSync=new Date(syncMs);
    const syncAge=state.lastSync?Math.max(0,(Date.now()-state.lastSync.getTime())/1000):Infinity;
    const pts=state.air.filter(pointInApproxBD);
    const observed=pts.map(a=>a.seen).filter(v=>Number.isFinite(v)&&v>=0);
    const positionAge=observed.length?Math.min(...observed):0;
    const ageSeconds=Math.max(syncAge,positionAge);
    const unknown=pts.filter(a=>!a.callsign||!a.reg||a.callsign==='Unknown').length;
    let kind='warn',label='VERIFY · no fresh public feed';
    if(!navigator.onLine){kind='offline';label='OFFLINE · browser network';}
    else if(Number.isFinite(ageSeconds)&&ageSeconds<=45){kind='ok';label=pts.length?'LIVE · PUBLIC ADS-B DATA':'CONNECTED · NO IN-VIEW TRACKS';}
    else if(Number.isFinite(ageSeconds)&&ageSeconds<=120){kind='warn';label='DEGRADED · public feed '+ageLabel(ageSeconds)+' old';}
    else if(Number.isFinite(ageSeconds)){kind='offline';label='STALE · public feed '+ageLabel(ageSeconds)+' old';}
    state.feed=kind==='ok'?'LIVE':kind==='warn'?'DEGRADED':kind==='offline'?'STALE':'VERIFY';
    setLive('bdmRadarLive',kind,label);
    setText('bdmFeedState',state.feed);
    setText('bdmTrackCount',String(pts.length));
    setText('bdmUnknownCount',String(unknown));
    setText('bdmLastSync',state.lastSync?state.lastSync.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',second:'2-digit'}):'--');
    setText('bdmRadarAge',Number.isFinite(ageSeconds)?ageLabel(ageSeconds):'--');
    state.alert=unknown?{level:'UNVERIFIED',count:unknown}:null;
    renderAlert();renderRadarTracks();
    setLive('bdmScannerLive',kind,pts.length&&kind==='ok'?'LIVE · PUBLIC ADS-B POSITIONS':label);
    setText('sysBorderState',kind==='ok'?'LIVE · READ-ONLY':kind==='offline'?'STALE/OFFLINE · READ-ONLY':'VERIFY · READ-ONLY');
  }
  async function refreshPublicAirFeed(force=false){
    if(Array.isArray(window.__igersAirLastPayload) && !force){handleAir(window.__igersAirLastPayload);return;}
    if(typeof window.__igersRefreshAirTraffic==='function'){
      setLive('bdmRadarLive','warn','SYNCING · shared public ADS-B feed');setText('bdmFeedState','SYNCING');
      if(force){try{await window.__igersRefreshAirTraffic();}catch(_){}if(Array.isArray(window.__igersAirLastPayload)){handleAir(window.__igersAirLastPayload);return;}}
      else return;
    }
    setLive('bdmRadarLive','warn','VERIFY · public ADS-B query');
    try{
      const d=await json('https://api.airplanes.live/v2/point/23.8103/90.4125/250',12000);
      const list=(d?.ac||[]).map(a=>({hex:a.hex||'',callsign:(a.flight||'').trim(),reg:a.r||'',lat:Number(a.lat),lon:Number(a.lon),alt:a.alt_baro,speed:a.gs,track:a.track,squawk:a.squawk,seen:a.seen_pos}));
      window.__igersAirLastPayload=list;window.__igersAirProvider='Airplanes.live';window.__igersAirLastSync=Date.now();window.dispatchEvent(new CustomEvent('igers:airtraffic',{detail:list}));handleAir(list);
      setText('bdmFeedState',list.length?'LIVE · PUBLIC ADS-B':'VERIFY · no public tracks');
    }catch(_){setLive('bdmRadarLive','offline','OFFLINE · ADS-B provider unavailable');setText('bdmFeedState','OFFLINE');}
  }
  function bind(){window.addEventListener('igers:airtraffic',e=>handleAir(e.detail||[]));if(Array.isArray(window.__igersAirLastPayload))handleAir(window.__igersAirLastPayload);$('bdmRefresh')?.addEventListener('click',()=>refreshPublicAirFeed(true));$('bdmRadarRefresh')?.addEventListener('click',()=>refreshPublicAirFeed(true));$('bdmReset')?.addEventListener('click',()=>{state.alert=null;state.air=[];setLive('bdmRadarLive','warn','VERIFY · reset');setText('bdmFeedState','VERIFY');renderAlert();});$('bdmTestAlert')?.addEventListener('click',()=>{state.alert={level:'TEST',count:1};const e=$('bdmAlert');if(e){e.className='bdm-alert danger';e.textContent='TEST ALERT · simulated operator notification only. No real emergency action is triggered.';}setText('bdmAlertState','TEST');});$('bdmOperatorAck')?.addEventListener('click',()=>{setText('bdmAlertState','ACKNOWLEDGED · '+now());const e=$('bdmAlert');if(e){e.className='bdm-alert ok';e.textContent='Operator acknowledgement recorded locally. No automatic response is executed.';}});$('bdmMeshCycle')?.addEventListener('click',()=>{state.nodes.forEach((n,i)=>n.status=i%5===0?'DEGRADED':'ONLINE');renderZoneList();setText('bdmNetworkHealth',nodeHealth());setText('bdmMeshState','SIMULATION CYCLE · '+now());});}
  function syncMapLayerControls(){const map=[['bdmLayerOutline','outline'],['bdmLayerRivers','rivers'],['bdmLayerAir','air'],['bdmLayerNodes','nodes'],['bdmLayerRadar','radar']];map.forEach(([id,key])=>{const el=$(id);if(el)el.checked=!!state.layers[key];});const msg=$('bdmLayerSummary');if(msg)msg.textContent='Layers: '+map.filter(([,k])=>state.layers[k]).map(([,k])=>({outline:'boundary',rivers:'rivers',air:'public ADS-B',nodes:'virtual nodes',radar:'radar sweep'}[k])).join(' · ');}
  function inspectBorderMarker(event){const c=$('bdmBorder3D');if(!c)return;const r=c.getBoundingClientRect(),x=event.clientX-r.left,y=event.clientY-r.top;let best=null,dist=Infinity;const consider=(px,py,data)=>{const d=Math.hypot(px-x,py-y);if(d<dist){dist=d;best=data;}};if(state.layers.nodes)state.nodes.forEach(n=>{const p=project(llTo3d(n.lon,n.lat,.2),r.width,r.height,1);consider(p[0],p[1],{type:'node',n});});if(state.layers.air)state.air.filter(pointInApproxBD).forEach(a=>{const p=project(llTo3d(Number(a.lon),Number(a.lat),.25),r.width,r.height,1);consider(p[0],p[1],{type:'air',a});});if(!best||dist>30)return;const out=$('bdmMapSelection');if(!out)return;if(best.type==='node'){const n=best.n;out.textContent='Selected '+n.id+' · virtual gateway simulation · '+n.status+' · approximate coordinate '+n.lat.toFixed(3)+', '+n.lon.toFixed(3)+'. Not a physical sensor or tower.';}else{const a=best.a;out.textContent='Public ADS-B observation '+(a.callsign||a.hex||'UNIDENTIFIED')+' · '+a.lat.toFixed(4)+', '+a.lon.toFixed(4)+' · altitude '+(Number.isFinite(a.alt)?Math.round(a.alt)+' ft':'n/a')+' · observed '+(Number.isFinite(a.seen)?Math.round(a.seen)+' s ago':'age n/a')+'. Public data only; not evidence of hostile activity.';}}
  function bindMapControls(){const c=$('bdmBorder3D');const btn=(id,fn)=>$(id)?.addEventListener('click',fn);btn('bdmZoomIn',()=>{state.zoom=clamp(state.zoom+.15,.7,1.9);});btn('bdmZoomOut',()=>{state.zoom=clamp(state.zoom-.15,.7,1.9);});btn('bdmResetView',()=>{state.zoom=1;state.rotation=.18;const out=$('bdmMapSelection');if(out)out.textContent='View reset · select a highlighted virtual node or public-data marker for details.';});btn('bdmFullscreen',()=>{const box=c?.closest('.bdm-canvas');if(box?.requestFullscreen)box.requestFullscreen().catch(()=>{});});[['bdmLayerOutline','outline'],['bdmLayerRivers','rivers'],['bdmLayerAir','air'],['bdmLayerNodes','nodes'],['bdmLayerRadar','radar']].forEach(([id,key])=>$(id)?.addEventListener('change',e=>{state.layers[key]=!!e.target.checked;syncMapLayerControls();}));c?.addEventListener('click',inspectBorderMarker);syncMapLayerControls();}
  function init(){if(!$('bdmBorder3D'))return;bind();bindMapControls();seedNodes();renderZoneList();setText('bdmNodeCount',String(state.nodes.length));setText('bdmNetworkHealth',nodeHealth());loadBoundary();refreshPublicAirFeed();renderRadarScanner();setInterval(refreshPublicAirFeed,60000);setInterval(()=>{const online=navigator.onLine;setLive('bdmNetLive',online?'ok':'offline',online?'ONLINE · browser network':'OFFLINE · browser network');},5000);setLive('bdmNetLive',navigator.onLine?'ok':'offline',navigator.onLine?'ONLINE · browser network':'OFFLINE · browser network');}
  window.IGERSBorderMonitor={state,loadBoundary,renderBorder3D};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
