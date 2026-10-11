/* IGERS calculation integrity notice — transparent model assumptions, not a sensor feed. */
(function(){
 'use strict';
 function addNotice(){
   const host=document.getElementById('igersLiveResultsConsole') || document.getElementById('energyLiveUpdate');
   if(!host || document.getElementById('igers-calculation-validity-note')) return;
   const note=document.createElement('aside');
   note.id='igers-calculation-validity-note';
   note.setAttribute('role','note');
   note.style.cssText='margin:12px 0;padding:12px 14px;border:1px solid rgba(255,211,122,.42);border-radius:10px;background:rgba(255,211,122,.07);color:inherit;font-size:12px;line-height:1.55';
   note.innerHTML='<strong>Calculation validity · engineering estimate</strong><br>Results are model-based estimates, not field-validated measurements. Accuracy depends on measured site traffic, actual speed before/after, recovery mechanism efficiency, parasitic loads, additional vehicle fuel/energy penalty, downtime, and maintenance. Validate against calibrated field sensors and a measured energy balance before design or investment decisions.';
   host.appendChild(note);
 }
 if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>setTimeout(addNotice,800),{once:true});
 else setTimeout(addNotice,800);
 const observer=new MutationObserver(addNotice);
 observer.observe(document.documentElement,{childList:true,subtree:true});
})();
