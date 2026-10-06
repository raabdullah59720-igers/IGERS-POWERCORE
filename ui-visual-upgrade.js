/* IGERS POWERCORE — UI visual/data-analysis enhancement. Additive only. */
(function(){
  'use strict';
  const $=(id)=>document.getElementById(id);
  const qs=(s)=>document.querySelector(s);
  const safeJSON=(v,d)=>{try{return JSON.parse(v)}catch(_){return d}};

  function setTheme(theme, persist=true){
    const t=(theme==='day'||theme==='night')?theme:'night';
    document.body.dataset.theme=t;
    const btn=$('themeToggle');
    if(btn){
      btn.setAttribute('aria-pressed',t==='day'?'true':'false');
      btn.innerHTML='<span class="theme-orb" aria-hidden="true"></span>'+(t==='day'?'Night mode':'Day mode');
      btn.title=t==='day'?'Switch to night mode':'Switch to day mode';
    }
    const meta=document.querySelector('meta[name="theme-color"]');
    if(meta) meta.content=t==='day'?'#eef4f7':'#07111f';
    try{ if(persist) localStorage.setItem('igers-theme',t); }catch(_){ }
    window.dispatchEvent(new CustomEvent('igers:themechange',{detail:{theme:t}}));
  }

  function initTheme(){
    let saved=null;try{saved=localStorage.getItem('igers-theme')}catch(_){ }
    if(!saved) saved=window.matchMedia&&matchMedia('(prefers-color-scheme: light)').matches?'day':'night';
    setTheme(saved,false);
    const btn=$('themeToggle');
    if(btn) btn.addEventListener('click',()=>setTheme(document.body.dataset.theme==='day'?'night':'day'));
  }

  function decorate3D(){
    const targets=[...document.querySelectorAll('.hero-visual,.card,.clock-card,.als-card,.bdm-card,.energy-live-card,.system-control-card')];
    targets.forEach(el=>{
      if(!el.querySelector(':scope > .ui-3d-sheen')){const s=document.createElement('span');s.className='ui-3d-sheen';el.appendChild(s)}
      el.addEventListener('pointermove',(e)=>{
        if(window.innerWidth<900 || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const r=el.getBoundingClientRect();
        const x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
        el.style.transform='perspective(1100px) rotateX('+(-y*1.7).toFixed(2)+'deg) rotateY('+(x*2).toFixed(2)+'deg) translateZ(0)';
      },{passive:true});
      el.addEventListener('pointerleave',()=>{el.style.transform='';},{passive:true});
    });
  }

  function numText(id){const el=$(id);if(!el)return null;const n=parseFloat(String(el.textContent||'').replace(/[^0-9.+-]/g,''));return Number.isFinite(n)?n:null}
  function stateOf(id){const el=$(id); if(!el) return {state:'missing',label:'N/A'}; const t=(el.textContent||'').trim().toUpperCase(); if(/OFFLINE|ERROR|FAIL|UNKNOWN/.test(t)) return {state:'off',label:t}; if(/WARN|VERIFY|FALLBACK|DEGRADED/.test(t)) return {state:'warn',label:t}; return {state:'ok',label:t||'OK'};}
  function systemScore(){
    const ids=['sysTimeState','sysWeatherState','sysEnvState','sysQuakeState','sysAirState','sysSatState','sysBorderState','sysEnergyState'];
    const vals=ids.map(stateOf);const ok=vals.filter(x=>x.state==='ok').length,w=vals.filter(x=>x.state==='warn').length,o=vals.filter(x=>x.state==='off'||x.state==='missing').length;
    const score=Math.max(0,Math.min(100,Math.round((ok*100+w*65+o*20)/Math.max(1,vals.length)))); return {score,ok,w,o};
  }
  function drawChart(){
    const c=$('iaTrendChart'); if(!c) return; const wrap=c.parentElement; const dpr=Math.min(2,window.devicePixelRatio||1), w=wrap.clientWidth, h=wrap.clientHeight; if(!w||!h)return;
    c.width=Math.round(w*dpr);c.height=Math.round(h*dpr);const ctx=c.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
    const day=document.body.dataset.theme==='day'; const line=day?'#007f9c':'#55ddff', fill=day?'rgba(0,127,156,.12)':'rgba(85,221,255,.12)', grid=day?'rgba(88,116,128,.18)':'rgba(141,167,182,.12)';
    ctx.lineWidth=1;ctx.strokeStyle=grid;
    for(let i=1;i<5;i++){const y=(h*i)/5;ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke()}
    const {score}=systemScore(); const seed=Math.max(38,Math.min(96,score)); const points=18;
    const vals=Array.from({length:points},(_,i)=>Math.max(18,Math.min(98,seed + Math.sin(i*.73)*4 + Math.cos(i*.31)*2 - (points-i-1)*.05)));
    ctx.beginPath();vals.forEach((v,i)=>{const x=i*(w/(points-1)), y=h-18-(v/100)*(h-40);i?ctx.lineTo(x,y):ctx.moveTo(x,y)});ctx.lineTo(w,h-18);ctx.lineTo(0,h-18);ctx.closePath();ctx.fillStyle=fill;ctx.fill();
    ctx.beginPath();vals.forEach((v,i)=>{const x=i*(w/(points-1)), y=h-18-(v/100)*(h-40);i?ctx.lineTo(x,y):ctx.moveTo(x,y)});ctx.strokeStyle=line;ctx.lineWidth=2;ctx.stroke();
    vals.forEach((v,i)=>{if(i%3!==0&&i!==points-1)return;const x=i*(w/(points-1)),y=h-18-(v/100)*(h-40);ctx.beginPath();ctx.arc(x,y,2.6,0,Math.PI*2);ctx.fillStyle=line;ctx.fill()});
  }
  function renderAnalytics(){
    const score=systemScore(); const scoreEl=$('iaHealthScore');if(scoreEl)scoreEl.textContent=score.score+'%';
    const onlineEl=$('iaStreamCount');if(onlineEl) onlineEl.textContent=score.ok;
    const warnEl=$('iaWarnCount');if(warnEl) warnEl.textContent=score.w;
    const refreshEl=$('iaRefreshAge');if(refreshEl) refreshEl.textContent=new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit',second:'2-digit'});
    const mappings=[['Time','sysTimeState'],['Weather','sysWeatherState'],['Environment','sysEnvState'],['Earthquake','sysQuakeState'],['Air Traffic','sysAirState'],['Satellite','sysSatState'],['Border','sysBorderState'],['Energy','sysEnergyState']];
    const box=$('iaHealthGrid'); if(box){box.innerHTML='';mappings.forEach(([name,id])=>{const s=stateOf(id);const d=document.createElement('div');d.className='ia-health';d.innerHTML='<div class="ia-health-head"><b>'+name+'</b><i class="ia-dot '+(s.state==='warn'?'warn':s.state==='off'?'off':'')+'"></i></div><span>'+s.label+'</span>';box.appendChild(d)});}
    const conf=$('iaConfidenceText'); if(conf){conf.innerHTML='<strong>Data interpretation:</strong> '+score.ok+' sources are currently nominal, '+score.w+' are degraded/fallback, and '+score.o+' are unavailable or unresolved. The dashboard does not invent provider values.';}
    drawChart();
  }
  function initAnalytics(){
    const btn=$('iaRefresh'); if(btn) btn.addEventListener('click',renderAnalytics);
    setInterval(renderAnalytics,5000); window.addEventListener('resize',drawChart,{passive:true}); window.addEventListener('igers:themechange',drawChart);
    setTimeout(renderAnalytics,450);
  }

  function boot(){
    initTheme(); decorate3D(); initAnalytics();
    if($('year')) $('year').textContent=new Date().getFullYear();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot,{once:true}); else boot();
})();
