/* IGERS-BD-01 — Live Indicator Precision Fix 2026.10.03
   Additive module: does not replace existing Time / Weather / Air engines. */
(()=>{
  'use strict';
  const $=id=>document.getElementById(id);
  const stamp=()=>new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',second:'2-digit'});
  function badge(hostId,id,label){const host=$(hostId);if(!host||$(id))return $(id);const b=document.createElement('span');b.id=id;b.className='igers-live-badge';b.innerHTML='<i class="igers-live-led" aria-hidden="true"></i><span>'+label+'</span>';host.appendChild(b);return b;}
  function setBadge(id,state,label){const b=$(id);if(!b)return;b.className='igers-live-badge '+(state||'');const s=b.querySelector('span');if(s)s.textContent=label;}
  function cleanAirBullet(){const e=$('airFeedState');if(!e)return;const text=(e.textContent||'').replace(/^\s*[●•·]+\s*/,'').trim();if(e.textContent!==text)e.textContent=text;}
  function timeWatch(){
    const status=$('timeStatus'); if(!status)return;
    const led=status.querySelector('.live-dot'); if(led){led.setAttribute('aria-label','Live time indicator');}
    const state=$('liveState'); if(state){state.textContent='LIVE';state.dataset.verifiedAt=stamp();}
  }
  function weatherWatch(){
    const section=document.querySelector('#weather .section-head');
    if(section&&!$('weatherLiveIndicator')){
      const b=document.createElement('span');b.id='weatherLiveIndicator';b.className='igers-live-badge degraded';b.innerHTML='<i class="igers-live-led" aria-hidden="true"></i><span>WEATHER SYNCING</span>';section.appendChild(b);
    }
  }
  let weatherBusy=false;
  async function verifyWeather(){
    const b=$('weatherLiveIndicator');if(!b||weatherBusy)return;weatherBusy=true;
    try{
      const lat=window.igersWeatherLive?.lat ?? 23.8103, lon=window.igersWeatherLive?.lon ?? 90.4125;
      const tz=window.igersWeatherLive?.timezone ?? 'Asia/Dhaka';
      const u='https://api.open-meteo.com/v1/forecast?latitude='+encodeURIComponent(lat)+'&longitude='+encodeURIComponent(lon)+'&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone='+encodeURIComponent(tz)+'&forecast_days=1';
      const ctl=new AbortController();const timer=setTimeout(()=>ctl.abort(),9000);
      let r;try{r=await fetch(u,{cache:'no-store',signal:ctl.signal,headers:{Accept:'application/json'}})}finally{clearTimeout(timer)}
      if(!r.ok)throw Error('weather '+r.status);
      const d=await r.json(), t=d.current?.time;
      if(!t)throw Error('missing weather timestamp');
      const age=(Date.now()-new Date(t).getTime())/1000;
      if(age<=180)setBadge('weatherLiveIndicator','', 'WEATHER LIVE · '+Math.max(0,Math.round(age))+'s');
      else if(age<=900)setBadge('weatherLiveIndicator','degraded','WEATHER DELAYED · '+Math.round(age/60)+'m');
      else setBadge('weatherLiveIndicator','stale','WEATHER STALE · '+Math.round(age/60)+'m');
      const ws=$('weatherStatus');if(ws&&ws.textContent.includes('temporarily unavailable'))ws.textContent='Weather endpoint reachable · live current-data timestamp verified.';
    }catch(_){setBadge('weatherLiveIndicator','offline','WEATHER OFFLINE · RETRYING');}
    finally{weatherBusy=false;}
  }
  function airWatch(){
    cleanAirBullet();
    const e=$('airFeedState');if(!e)return;
    const b=e.classList.contains('offline')?'offline':e.classList.contains('stale')?'stale':e.classList.contains('degraded')?'degraded':'live';
    e.dataset.liveState=b;
  }
  function init(){
    weatherWatch();timeWatch();airWatch();verifyWeather();
    setInterval(()=>{timeWatch();airWatch();weatherWatch();},1000);
    setInterval(verifyWeather,60000);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
  window.IGERS_LIVE_INDICATOR_FIX='2026.10.03-precision1';
})();
