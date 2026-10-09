/* IGERS-BD-01 — Time + Weather Premium Update Layer
   Drop-in enhancement. Does not replace the existing time/weather engines. */
(function(){
  'use strict';
  const $=id=>document.getElementById(id);
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function addAssets(){
    if(!document.querySelector('link[data-twx-css]')){const l=document.createElement('link');l.rel='stylesheet';l.href='time-weather-update.css';l.dataset.twxCss='1';document.head.appendChild(l)}
  }
  function build(sectionId,type){
    const section=$(sectionId); if(!section||section.querySelector('.twx-shell')) return;
    const wrap=section.querySelector('.wrap'); if(!wrap)return;
    const shell=document.createElement('div'); shell.className='twx-shell';
    const isWeather=type==='weather';
    shell.innerHTML=`<div class="twx-head"><div><div class="twx-kicker">IGERS LIVE UPDATE PACKAGE</div><div class="twx-title">${isWeather?'ATMOSPHERIC WEATHER MONITOR':'PRECISION TIME ENGINE'}</div><div class="twx-sub">${isWeather?'Public forecast feed · browser-location aware · forecast estimates are informational':'Browser-native IANA timezone engine · no time API required'}</div></div><div class="twx-toolbar"><button class="twx-btn primary" type="button" data-twx-refresh="${isWeather?'weather':'time'}">${isWeather?'↻ UPDATE WEATHER':'↻ SYNC TIME'}</button>${isWeather?'<button class="twx-btn" type="button" data-twx-location>⌖ USE LOCATION</button>':''}</div></div><div class="twx-age"><span class="twx-chip"><i class="twx-dot" data-twx-dot="${type}"></i><span data-twx-status="${type}">${isWeather?'CONNECTING':'LIVE'}</span></span><span class="twx-chip">DATA AGE <b class="twx-value" data-twx-age="${type}">${isWeather?'--':'0s'}</b></span><span class="twx-chip">LAST SYNC <b class="twx-value" data-twx-sync="${type}">${isWeather?'--:--:--':'--:--:--'}</b></span></div>`;
    const anchor=isWeather?wrap.querySelector('.weather'):wrap.querySelector('.time-wrap');
    if(anchor) anchor.parentNode.insertBefore(shell,anchor); else wrap.appendChild(shell);
    return shell;
  }
  function clickExisting(id){const el=$(id);if(el)el.click();}
  function now(){return new Date()}
  let weatherLast=0,timeLast=Date.now(),weatherKnown=false;
  function set(type,status,age,sync,mode){
    const st=document.querySelector(`[data-twx-status="${type}"]`), ag=document.querySelector(`[data-twx-age="${type}"]`), sy=document.querySelector(`[data-twx-sync="${type}"]`), dot=document.querySelector(`[data-twx-dot="${type}"]`);
    if(st)st.textContent=status;if(ag)ag.textContent=age;if(sy)sy.textContent=sync;if(dot){dot.classList.toggle('warn',mode==='warn');dot.classList.toggle('off',mode==='off')}
  }
  function syncTimeUI(){
    timeLast=Date.now();
    const d=now(); const t=d.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',second:'2-digit'});
    set('time','LIVE','0s',t,'ok');
  }
  function updateWeatherAge(){
    if(weatherLast){const sec=Math.max(0,Math.floor((Date.now()-weatherLast)/1000));const label=sec<60?sec+'s':Math.floor(sec/60)+'m';set('weather',weatherKnown?'LIVE':'WAITING',label,weatherKnown?new Date(weatherLast).toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',second:'2-digit'}):'--:--:--',weatherKnown?'ok':'warn')}
  }
  function watchWeather(){
    const target=$('weatherUpdated'); if(!target)return;
    let last=target.textContent;
    const check=()=>{const cur=target.textContent;if(cur&&cur!==last&&cur!=='--'){last=cur;weatherLast=Date.now();weatherKnown=true;updateWeatherAge();const st=document.querySelector('[data-twx-status="weather"]');if(st)st.textContent='LIVE'}};
    new MutationObserver(check).observe(target,{childList:true,characterData:true,subtree:true}); check();
  }
  function init(){
    addAssets(); build('time','time'); build('weather','weather');
    document.querySelectorAll('[data-twx-refresh="time"]').forEach(b=>b.addEventListener('click',()=>{syncTimeUI();b.classList.add('twx-refreshing');setTimeout(()=>b.classList.remove('twx-refreshing'),450)}));
    document.querySelectorAll('[data-twx-refresh="weather"]').forEach(b=>b.addEventListener('click',()=>{b.classList.add('twx-refreshing');clickExisting('useMyLocation');setTimeout(()=>b.classList.remove('twx-refreshing'),9000)}));
    document.querySelectorAll('[data-twx-location]').forEach(b=>b.addEventListener('click',()=>clickExisting('useMyLocation')));
    syncTimeUI();watchWeather();setInterval(syncTimeUI,1000);setInterval(updateWeatherAge,1000);
    // Weather data refresh: use the existing weather engine, never invent values.
    setInterval(()=>{const u=$('useMyLocation'); if(document.visibilityState==='visible'){const status=$('weatherStatus')?.textContent||'';if(status&&!/temporarily unavailable/i.test(status)){const hiddenRefresh=document.createElement('button');hiddenRefresh.type='button';hiddenRefresh.style.display='none';document.body.appendChild(hiddenRefresh);/* existing engine has no public refresh method; page's initial load remains authoritative */hiddenRefresh.remove();}}},600000);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
