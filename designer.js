(function(){
  'use strict';
  const $=s=>document.querySelector(s);
  const $$=s=>Array.from(document.querySelectorAll(s));
  const nav=document.querySelector('.nav');
  const links=document.querySelector('.navlinks');
  if(nav&&links){
    const btn=document.createElement('button');
    btn.className='designer-menu'; btn.type='button'; btn.setAttribute('aria-label','Open navigation'); btn.setAttribute('aria-expanded','false'); btn.textContent='☰';
    nav.querySelector('.navin')?.appendChild(btn);
    btn.addEventListener('click',()=>{const open=links.classList.toggle('is-open');btn.setAttribute('aria-expanded',String(open));btn.textContent=open?'✕':'☰';});
    links.addEventListener('click',e=>{if(e.target.closest('a')){links.classList.remove('is-open');btn.setAttribute('aria-expanded','false');btn.textContent='☰';}});
  }
  const dock=document.createElement('div');
  dock.className='designer-dock';
  dock.innerHTML='<span class="dock-live"><i class="dot"></i> IGERS CONTROL SURFACE</span><i class="sep"></i><span>PUBLIC DATA LAYER</span><i class="sep"></i><span id="designerClock">--:--:--</span>';
  document.body.appendChild(dock);
  const hero=document.querySelector('#home .hero-grid');
  if(hero){
    const left=hero.querySelector(':scope > div:first-child');
    if(left){
      const meta=document.createElement('div');
      meta.className='hero-meta';
      meta.innerHTML='<span><strong>IGERS-BD-01</strong></span><span>Integrated Energy Recovery &amp; Storage</span><span>Bangladesh-focused engineering concept</span><span>Public-data monitoring layer</span>';
      left.appendChild(meta);
    }
    const grid=document.createElement('div'); grid.className='designer-status-grid';
    const items=[['LIVE DATA','Weather / Earth / Air','MULTI-SOURCE'],['ENGINEERING','Road / Water / Solar','CONCEPT + VALIDATION'],['OBSERVATION','NASA / Orbital / ADS-B','PUBLIC DATA'],['IDENTITY','Inventor · Author · Project','IGERS-BD-01']];
    grid.innerHTML=items.map(x=>`<div class="designer-status-card"><div class="ds-top"><span class="ds-label">${x[0]}</span><span class="ds-state">${x[2]}</span></div><div class="ds-value">${x[1]}</div></div>`).join('');
    hero.parentElement?.appendChild(grid);
  }
  const flag=document.createElement('div'); flag.className='flag-designer'; flag.setAttribute('aria-hidden','true'); document.body.appendChild(flag);
  const top=document.createElement('button'); top.id='designerBackTop'; top.type='button'; top.title='Back to top'; top.setAttribute('aria-label','Back to top'); top.textContent='↑'; document.body.appendChild(top);
  top.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
  const clock=$('#designerClock');
  const tick=()=>{if(clock)clock.textContent=new Date().toLocaleTimeString('en-GB',{hour12:false});}; tick(); setInterval(tick,1000);
  const sections=$$('main section[id], section[id]');
  const navLinks=$$('.navlinks a[href^="#"]');
  const byId=new Map(navLinks.map(a=>[a.getAttribute('href').slice(1),a]));
  const io=('IntersectionObserver' in window)?new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('is-visible');});
  },{threshold:.10}):null;
  sections.forEach(s=>{s.classList.add('designer-reveal'); io?.observe(s);});
  if(io){document.querySelectorAll('.card,.feedback-card,.clock-card,.weather-hour,.nasa-meta-card').forEach((el,i)=>{el.style.transitionDelay=((i%6)*35)+'ms';el.classList.add('designer-reveal');io.observe(el);});}
  const spy=('IntersectionObserver' in window)?new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting){navLinks.forEach(a=>a.classList.remove('active'));byId.get(e.target.id)?.classList.add('active');}});
  },{rootMargin:'-28% 0px -60% 0px',threshold:0}):null;
  sections.forEach(s=>spy?.observe(s));
  const onScroll=()=>{top.classList.toggle('is-visible',window.scrollY>520);};
  window.addEventListener('scroll',onScroll,{passive:true}); onScroll();
  const footer=document.querySelector('footer.footer');
  if(footer&&!footer.querySelector('.designer-footer-bar')){
    const bar=document.createElement('div'); bar.className='designer-footer-bar'; bar.innerHTML='<span><strong>IGERS-BD-01</strong> · Engineering presentation interface</span><span>Public-data services are labeled; conceptual modules are not operational claims.</span>';
    footer.appendChild(bar);
  }
})();
