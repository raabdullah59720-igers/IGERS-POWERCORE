/* IGERS POWERCORE — NASA GIBS public imagery tile view.
 * Tile requests are verified individually; the viewer never presents failed requests as imagery.
 * This is Earth-observation imagery, not live satellite sensor telemetry.
 */
(function () {
  'use strict';
  if (window.__igersNasaGibsBDLoaded) return;
  window.__igersNasaGibsBDLoaded = true;
  const $ = id => document.getElementById(id);
  const state = {z:6,lat:23.685,lon:90.3563,layer:'VIIRS_SNPP_CorrectedReflectance_TrueColor',loaded:0,failed:0,total:0,seq:0,drawId:0,candidate:0,dates:[],currentDate:'',requestedDate:'',tileRecords:[],fallbackScheduledFor:0};
  const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
  function dateString(d){return d.toISOString().slice(0,10);}
  function makeCandidates(){
    const field=$('gibsBDDateInput');const raw=field?.value||'';let base=raw?new Date(raw+'T12:00:00Z'):new Date(Date.now()-86400000);
    if(Number.isNaN(base.getTime()))base=new Date(Date.now()-86400000);
    base=new Date(Date.UTC(base.getUTCFullYear(),base.getUTCMonth(),base.getUTCDate(),12));
    state.requestedDate=dateString(base);const dates=[];
    for(let i=0;i<=7;i++)dates.push(dateString(new Date(base.getTime()-i*86400000)));
    state.dates=[...new Set(dates)];return state.dates;
  }
  function xFloat(lon,z){return (lon+180)/360*Math.pow(2,z);}
  function yFloat(lat,z){const phi=clamp(lat,-85.05112878,85.05112878)*Math.PI/180;return (0.5-Math.log((1+Math.sin(phi))/(1-Math.sin(phi)))/(4*Math.PI))*Math.pow(2,z);}
  function yInverse(y,z){const n=Math.PI-2*Math.PI*y/Math.pow(2,z);return 180/Math.PI*Math.atan(Math.sinh(n));}
  function tileUrl(date,z,x,y){return 'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/'+encodeURIComponent(state.layer)+'/default/'+date+'/GoogleMapsCompatible_Level9/'+z+'/'+y+'/'+x+'.jpg';}
  function status(text,kind){const e=$('gibsBDState');if(e){e.textContent=text;e.className='gibs-state '+(kind||'');}}
  function updateCount(){const e=$('gibsBDCount');if(e)e.textContent=state.loaded+'/'+state.total+' loaded · '+state.failed+' failed';const p=$('gibsBDMap');if(p)p.setAttribute('aria-label','NASA GIBS tile view centered at '+state.lat.toFixed(3)+', '+state.lon.toFixed(3)+', requested '+(state.currentDate||state.requestedDate||'date pending')+'. '+state.loaded+' tiles loaded and '+state.failed+' failed.');}
  function positionTiles(){const box=$('gibsBDTiles'),map=$('gibsBDMap');if(!box||!map)return;box.style.transform='';const xf=xFloat(state.lon,state.z),yf=yFloat(state.lat,state.z),w=map.clientWidth||360,h=map.clientHeight||230;state.tileRecords.forEach(({img,tx,ty})=>{img.style.left=Math.round(w/2+(tx-xf)*256)+'px';img.style.top=Math.round(h/2+(ty-yf)*256)+'px';});}
  function finishIfComplete(seq,drawId){if(seq!==state.seq||drawId!==state.drawId||state.loaded+state.failed<state.total)return;if(state.loaded>=2){status(state.failed?'PARTIAL · NASA GIBS · '+state.loaded+'/'+state.total+' tiles loaded':'NASA GIBS · CONNECTED',''+(state.failed?'warn':'ok'));}else advanceDate(seq,drawId);}
  function advanceDate(seq,drawId){if(seq!==state.seq||drawId!==state.drawId||state.loaded>=2||state.fallbackScheduledFor===drawId)return;state.fallbackScheduledFor=drawId;if(state.candidate+1<state.dates.length){state.candidate++;status('RETRYING · '+state.dates[state.candidate],'warn');setTimeout(()=>{if(seq===state.seq)drawTiles(state.dates[state.candidate],seq);},180);}else{if(state.loaded>0)status('PARTIAL · only '+state.loaded+' tiles loaded','warn');else status('NASA GIBS UNAVAILABLE · all bounded date attempts failed','off');}}
  function drawTiles(date,seq){
    const box=$('gibsBDTiles'),map=$('gibsBDMap');if(!box||!map||seq!==state.seq)return;
    box.replaceChildren();state.loaded=0;state.failed=0;state.total=0;state.tileRecords=[];state.drawId++;const drawId=state.drawId;state.fallbackScheduledFor=0;state.currentDate=date;
    const z=state.z,n=Math.pow(2,z),xf=xFloat(state.lon,z),yf=yFloat(state.lat,z),cx=Math.floor(xf),cy=Math.floor(yf);
    for(let dx=-2;dx<=2;dx++)for(let dy=-1;dy<=1;dy++){
      const txRaw=cx+dx,ty=cy+dy;if(ty<0||ty>=n)continue;const tx=((txRaw%n)+n)%n;const img=document.createElement('img');img.className='gibs-tile';img.alt='NASA GIBS '+state.layer+' imagery tile, date '+date;img.loading='eager';img.decoding='async';img.referrerPolicy='no-referrer';img.draggable=false;img.src=tileUrl(date,z,tx,ty);
      img.addEventListener('load',()=>{if(seq!==state.seq||drawId!==state.drawId)return;state.loaded++;updateCount();if(state.loaded>=2)status(state.failed?'PARTIAL · NASA GIBS · '+state.loaded+'/'+state.total:'NASA GIBS · CONNECTED',''+(state.failed?'warn':'ok'));finishIfComplete(seq,drawId);},{once:true});
      img.addEventListener('error',()=>{if(seq!==state.seq||drawId!==state.drawId)return;state.failed++;updateCount();finishIfComplete(seq,drawId);},{once:true});
      box.appendChild(img);state.tileRecords.push({img,tx:txRaw,ty});state.total++;
    }
    positionTiles();updateCount();const dateLabel=$('gibsBDDate');if(dateLabel)dateLabel.textContent='Imagery date · '+date+' · requested '+state.requestedDate;
    status('LOADING NASA GIBS · '+date,'warn');
    setTimeout(()=>{if(seq!==state.seq||drawId!==state.drawId||state.loaded>=2)return;advanceDate(seq,drawId);},7000);
  }
  function refresh(){state.seq++;state.candidate=0;makeCandidates();drawTiles(state.dates[0],state.seq);}
  function moveByTiles(dx,dy){const factor=Math.pow(2,state.z);const x=xFloat(state.lon,state.z)+dx,y=yFloat(state.lat,state.z)+dy;state.lon=clamp(x/factor*360-180,-179.9,179.9);state.lat=clamp(yInverse(clamp(y,0,factor-0.00001),state.z),-84,84);refresh();}
  function zoom(delta){state.z=clamp(state.z+delta,5,8);refresh();}
  function resetView(){state.z=6;state.lat=23.685;state.lon=90.3563;refresh();}
  function init(){
    const map=$('gibsBDMap');if(!$('gibsBDTiles')||!map)return;
    const dateInput=$('gibsBDDateInput');if(dateInput){const today=dateString(new Date()),yesterday=dateString(new Date(Date.now()-86400000));dateInput.max=today;if(!dateInput.value)dateInput.value=yesterday;dateInput.addEventListener('change',refresh);}
    $('gibsBDRefresh')?.addEventListener('click',refresh);$('gibsBDZoomIn')?.addEventListener('click',()=>zoom(1));$('gibsBDZoomOut')?.addEventListener('click',()=>zoom(-1));$('gibsBDPanN')?.addEventListener('click',()=>moveByTiles(0,-.55));$('gibsBDPanS')?.addEventListener('click',()=>moveByTiles(0,.55));$('gibsBDPanW')?.addEventListener('click',()=>moveByTiles(-.55,0));$('gibsBDPanE')?.addEventListener('click',()=>moveByTiles(.55,0));$('gibsBDReset')?.addEventListener('click',resetView);$('gibsBDFullscreen')?.addEventListener('click',()=>{if(map.requestFullscreen)map.requestFullscreen().catch(()=>{});});$('gibsBDLayer')?.addEventListener('change',e=>{state.layer=e.target.value;refresh();});
    let drag=null;map.addEventListener('pointerdown',e=>{if(e.target.closest('button,input,select,a'))return;drag={x:e.clientX,y:e.clientY,dx:0,dy:0};try{map.setPointerCapture(e.pointerId);}catch(_){};});map.addEventListener('pointermove',e=>{if(!drag)return;drag.dx=e.clientX-drag.x;drag.dy=e.clientY-drag.y;const box=$('gibsBDTiles');if(box)box.style.transform='translate('+drag.dx+'px,'+drag.dy+'px)';});const finish=e=>{if(!drag)return;const dx=drag.dx,dy=drag.dy;const moved=Math.abs(dx)+Math.abs(dy)>6;drag=null;if(moved){const x=xFloat(state.lon,state.z)-dx/256,y=yFloat(state.lat,state.z)-dy/256,n=Math.pow(2,state.z);state.lon=clamp(x/n*360-180,-179.9,179.9);state.lat=clamp(yInverse(clamp(y,0,n-.00001),state.z),-84,84);refresh();}else{const box=$('gibsBDTiles');if(box)box.style.transform='';}};map.addEventListener('pointerup',finish);map.addEventListener('pointercancel',finish);
    window.addEventListener('online',refresh);window.addEventListener('resize',()=>{positionTiles();});if(document.fonts?.ready)document.fonts.ready.then(positionTiles).catch(()=>{});refresh();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
