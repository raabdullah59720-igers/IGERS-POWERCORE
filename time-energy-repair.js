/* IGERS-BD-01 — Emergency Time + Energy visibility repair 2026-10-03 */
(function(){
  'use strict';
  const $ = id => document.getElementById(id);
  const zones = [
    ['Dhaka, Bangladesh','Asia/Dhaka'],['London, United Kingdom','Europe/London'],
    ['New York, USA','America/New_York'],['Los Angeles, USA','America/Los_Angeles'],
    ['Toronto, Canada','America/Toronto'],['Dubai, UAE','Asia/Dubai'],
    ['Riyadh, Saudi Arabia','Asia/Riyadh'],['Delhi, India','Asia/Kolkata'],
    ['Singapore','Asia/Singapore'],['Tokyo, Japan','Asia/Tokyo'],['Seoul, South Korea','Asia/Seoul'],
    ['Sydney, Australia','Australia/Sydney'],['Paris, France','Europe/Paris'],['Berlin, Germany','Europe/Berlin'],
    ['Moscow, Russia','Europe/Moscow'],['Cape Town, South Africa','Africa/Johannesburg'],
    ['Nairobi, Kenya','Africa/Nairobi'],['São Paulo, Brazil','America/Sao_Paulo'],
    ['Mexico City, Mexico','America/Mexico_City'],['UTC','UTC']
  ];
  const safeZone = z => { try { new Intl.DateTimeFormat('en-GB',{timeZone:z}).format(); return z; } catch(_) { return 'UTC'; } };
  const localZone = safeZone(Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC');
  const format = (zone, opts) => new Intl.DateTimeFormat('en-GB', Object.assign({timeZone:safeZone(zone)},opts)).format(new Date());
  const time = z => format(z,{hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false});
  const date = z => format(z,{weekday:'long',day:'2-digit',month:'long',year:'numeric'});
  const zoneLabel = z => { try { return new Intl.DateTimeFormat('en-US',{timeZone:safeZone(z),timeZoneName:'long'}).formatToParts(new Date()).find(p=>p.type==='timeZoneName')?.value || z; } catch(_) { return z; } };
  const set = (id,v) => { const e=$(id); if(e) e.textContent=v; };

  function initTime(){
    const required=['bdTime','localTime','worldTime','liveTick','liveState'];
    if(!required.some(id=>$(id))) return;
    const select=$('zoneSelect');
    if(select && !select.dataset.repairPopulated){
      const existing=new Set(Array.from(select.options).map(o=>o.value));
      zones.forEach(([name,z])=>{ if(!existing.has(z)){ const o=document.createElement('option'); o.value=z; o.textContent=name+' · '+z; select.appendChild(o); }});
      try { const saved=localStorage.getItem('igersWorldZone'); if(saved) select.value=safeZone(saved); } catch(_) {}
      select.dataset.repairPopulated='1';
      select.addEventListener('change',()=>{ try{localStorage.setItem('igersWorldZone',select.value);}catch(_){}; tick(); });
    }
    function tick(){
      const selected=select?.value || 'Asia/Dhaka';
      set('bdTime',time('Asia/Dhaka')); set('bdDate',date('Asia/Dhaka'));
      set('localTime',time(localZone)); set('localDate',date(localZone)); set('localTz','Timezone: '+localZone+' · '+zoneLabel(localZone));
      set('worldTime',time(selected)); set('worldDate',date(selected)+' · '+zoneLabel(selected));
      set('liveTick',time(localZone)); set('liveState','LIVE');
      const panel=$('timeStatus'); if(panel) panel.dataset.clockRepair='active';
    }
    tick();
    if(!window.__IGERS_TIME_REPAIR_TIMER) window.__IGERS_TIME_REPAIR_TIMER=setInterval(tick,1000);
  }

  function ensureEnergyVisible(){
    const section=$('energyLiveUpdate');
    if(!section) return;
    section.hidden=false;
    section.style.removeProperty('display');
    section.setAttribute('aria-hidden','false');
    const badge=$('energyLiveBadge'); if(badge){ badge.hidden=false; badge.style.removeProperty('display'); }
    // Re-initialize the existing calculation engine if another script loaded before its DOM was ready.
    if(typeof window.IGERS_ENERGY_REPAIR_HOOK==='function') window.IGERS_ENERGY_REPAIR_HOOK();
  }

  function syncUnifiedEnergy(){
    const toggle=$('energyEngineToggle'), state=$('energyEngineState');
    const status=$('sysEnergyState');
    if(status){
      const on=toggle ? String(toggle.textContent).trim()==='ON' : true;
      status.textContent=on?'ON · CALCULATOR':'OFF · DATA PRESERVED';
    }
    if(state && !state.textContent.trim()) state.textContent='ENGINE ACTIVE';
  }

  function init(){ initTime(); ensureEnergyVisible(); syncUnifiedEnergy(); setTimeout(syncUnifiedEnergy,500); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true}); else init();
  window.IGERS_TIME_ENERGY_REPAIR='2026.10.03-emergency1';
})();
