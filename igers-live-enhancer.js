/* IGERS-BD-01 | Safe presentation + live-status enhancer */
(() => {
  'use strict';
  const VERSION='2026.09.13-flag-safe1';
  const FLAG='bangladesh-flag-overlay.svg';
  function css(){
    if(document.getElementById('igers-safe-style')) return;
    const st=document.createElement('style'); st.id='igers-safe-style';
    st.textContent=`
      #home.hero{position:relative;isolation:isolate;overflow:hidden}
      #home.hero>.wrap{position:relative;z-index:3}
      #home.hero>.igers-bd-flag-layer{position:absolute;inset:0;z-index:0;pointer-events:none;display:block;background-image:url('./${FLAG}');background-repeat:no-repeat;background-position:center;background-size:cover;opacity:.16;mix-blend-mode:screen}
      #home.hero>.igers-bd-flag-glow{position:absolute;width:min(32vw,360px);height:min(32vw,360px);min-width:150px;min-height:150px;left:3%;top:9%;z-index:1;border-radius:50%;pointer-events:none;background:radial-gradient(circle,rgba(244,42,65,.22),rgba(244,42,65,.04) 48%,transparent 72%)}
      .igers-bd-mark{display:inline-block!important;width:20px!important;height:12px!important;object-fit:cover!important;margin-right:7px;vertical-align:-1px;border-radius:2px}
      #igers-safe-status{position:fixed;right:12px;bottom:12px;z-index:2147483000;pointer-events:none;padding:6px 9px;border:1px solid rgba(138,243,191,.2);border-radius:999px;background:rgba(4,12,18,.72);color:#8af3bf;font:700 9px/1 system-ui,sans-serif;letter-spacing:.12em;text-transform:uppercase;backdrop-filter:blur(7px)}
      @media(max-width:650px){#home.hero>.igers-bd-flag-layer{opacity:.12;background-size:auto 560px}#igers-safe-status{right:8px;bottom:8px}}
    `; document.head.appendChild(st);
  }
  function start(){
    css(); const hero=document.querySelector('#home.hero'); if(!hero) return;
    if(!hero.querySelector('.igers-bd-flag-layer')){const layer=document.createElement('div');layer.className='igers-bd-flag-layer';layer.setAttribute('aria-hidden','true');hero.prepend(layer)}
    if(!hero.querySelector('.igers-bd-flag-glow')){const glow=document.createElement('div');glow.className='igers-bd-flag-glow';glow.setAttribute('aria-hidden','true');hero.prepend(glow)}
    const brand=document.querySelector('.brand');
    if(brand&&!brand.querySelector('.igers-bd-mark')){const img=document.createElement('img');img.className='igers-bd-mark';img.src=FLAG;img.alt='Bangladesh flag';brand.prepend(img)}
    if(!document.getElementById('igers-safe-status')){const x=document.createElement('div');x.id='igers-safe-status';x.textContent='IGERS LIVE';document.body.appendChild(x)}
    window.IGERS_LIVE_ENHANCER_VERSION=VERSION;
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true}); else start();
})();
