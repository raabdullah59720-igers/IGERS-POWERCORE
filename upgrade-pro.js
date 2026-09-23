/* IGERS-BD-01 Professional Upgrade Panels
   Additive, dependency-free, GitHub Pages safe. Existing modules are not replaced. */
(function(){
  'use strict';
  if (window.__IGERS_UPGRADE_PRO_INITIALIZED__) return;
  window.__IGERS_UPGRADE_PRO_INITIALIZED__ = true;
  const $=id=>document.getElementById(id);
  const safe=(n,d=0)=>{ const v=Number(n); return Number.isFinite(v)?v:d; };
  const fmt=(n,d=2)=>Number(n).toLocaleString('en-US',{maximumFractionDigits:d});

  function addLog(message,type='ok'){
    const box=$('igxSystemLog'); if(!box)return;
    const row=document.createElement('div'); row.className=type; row.textContent=`[${new Date().toLocaleTimeString('en-GB')}] ${message}`;
    box.prepend(row); while(box.children.length>30)box.lastChild.remove();
  }

  function energyCalc(){
    const flow=safe($('igxFlow')?.value), head=safe($('igxHead')?.value), eta=Math.min(1,Math.max(0,safe($('igxEff')?.value)/100)), units=Math.max(1,Math.floor(safe($('igxUnits')?.value,1))), hours=Math.max(0,safe($('igxHours')?.value,24));
    const kw=1000*9.81*flow*head*eta*units/1000, kwh=kw*hours, monthly=kwh*30;
    $('igxPower').textContent=`${fmt(kw,2)} kW`; $('igxDaily').textContent=`${fmt(kwh,1)} kWh/day`; $('igxMonthly').textContent=`${fmt(monthly,0)} kWh/month`;
    $('igxMeter').style.width=Math.min(100,Math.max(3,kw/100))*1+'%'; addLog(`Energy model recalculated: ${fmt(kw,2)} kW estimated output.`);
  }
  function roadCalc(){
    const length=Math.max(0,safe($('igxRoadLength')?.value)), width=Math.max(0,safe($('igxPanelWidth')?.value)), eta=Math.min(1,Math.max(.01,safe($('igxSolarEff')?.value)/100)), sun=Math.max(0,safe($('igxSunHours')?.value)), density=Math.max(.01,safe($('igxCoverage')?.value)/100);
    const area=length*1000*width*density, peak=area*1*eta/1000, daily=peak*sun, monthly=daily*30;
    $('igxRoadArea').textContent=`${fmt(area,0)} m²`; $('igxRoadPeak').textContent=`${fmt(peak,1)} kW`; $('igxRoadDaily').textContent=`${fmt(daily,1)} kWh/day`; $('igxRoadMonthly').textContent=`${fmt(monthly,0)} kWh/month`;
    addLog(`Road energy model recalculated: ${fmt(peak,1)} kW nominal estimate.`);
  }
  function runHealth(){
    const checks=[['Core interface',!!document.querySelector('#home')],['Weather module',!!$('weather')],['Earth monitor',!!$('environment')],['Air traffic',!!$('airtraffic')],['NASA data',!!$('nasaPanel')],['Time engine',!!$('time')],['Upgrade panels',!!$('igxCommand')]];
    let good=0; const list=$('igxHealthList'); if(!list)return;
    list.innerHTML=''; checks.forEach(([name,ok])=>{if(ok)good++; const row=document.createElement('div');row.className='igx-health-row';row.innerHTML=`<span>${name}</span><small style="color:${ok?'var(--igx-green)':'var(--igx-red)'}">${ok?'READY':'MISSING'}</small>`;list.appendChild(row);});
    $('igxHealthScore').textContent=`${good}/${checks.length}`; $('igxHealthState').textContent=good===checks.length?'SYSTEM READY':'CHECK REQUIRED'; addLog(`Integrity scan completed: ${good}/${checks.length} core modules present.` ,good===checks.length?'ok':'warn');
  }
  function refreshPage(){
    addLog('Manual refresh requested. Reloading current GitHub Pages application…');
    setTimeout(()=>location.reload(),250);
  }
  function wire(){
    try {
    $('igxEnergyRun')?.addEventListener('click',energyCalc); ['igxFlow','igxHead','igxEff','igxUnits','igxHours'].forEach(id=>$(id)?.addEventListener('input',energyCalc));
    $('igxRoadRun')?.addEventListener('click',roadCalc); ['igxRoadLength','igxPanelWidth','igxSolarEff','igxSunHours','igxCoverage'].forEach(id=>$(id)?.addEventListener('input',roadCalc));
    $('igxHealthRun')?.addEventListener('click',runHealth); $('igxRefresh')?.addEventListener('click',refreshPage);
    $('igxExport')?.addEventListener('click',()=>{const payload={project:'IGERS-BD-01',timestamp:new Date().toISOString(),energy:{power:$('igxPower')?.textContent,daily:$('igxDaily')?.textContent,monthly:$('igxMonthly')?.textContent},road:{area:$('igxRoadArea')?.textContent,peak:$('igxRoadPeak')?.textContent,daily:$('igxRoadDaily')?.textContent,monthly:$('igxRoadMonthly')?.textContent}};const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='igers-analysis-snapshot.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);addLog('Analysis snapshot exported as JSON.');});
    energyCalc();roadCalc();runHealth();addLog('Professional upgrade layer initialized. Existing modules preserved.');
    } catch (err) {
      console.error('IGERS Professional Upgrade initialization failed:', err);
      addLog('Upgrade panel encountered an initialization error; core website remains available.', 'warn');
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wire,{once:true});else wire();
})();

/* IGERS-BD-01 v2 additive upgrade controllers */
(function(){
  'use strict';
  const $=id=>document.getElementById(id);
  function num(id, fallback){const n=Number($(id)?.value);return Number.isFinite(n)?n:fallback;}
  function updateStorage(){
    const cap=Math.max(1,num('igxCap',100)), soc=Math.min(100,Math.max(0,num('igxSoc',62))), load=Math.max(.1,num('igxLoad',10));
    const stored=cap*soc/100, backup=stored/load;
    if($('igxStoragePct'))$('igxStoragePct').textContent=soc.toFixed(0)+'%';
    if($('igxStorageFill'))$('igxStorageFill').style.width=soc+'%';
    if($('igxStorageKwh'))$('igxStorageKwh').textContent=`${stored.toFixed(1)} kWh of ${cap.toFixed(1)} kWh model capacity`;
    if($('igxLoadRate'))$('igxLoadRate').textContent=load.toFixed(1)+' kW';
    if($('igxBackup'))$('igxBackup').textContent=backup.toFixed(1)+' h';
    if($('igxChargeRate'))$('igxChargeRate').textContent=Math.max(1,load*2.5).toFixed(1)+' kW';
  }
  function qa(){
    const tests=[
      ['Core home','#home'],['Energy module','#energy'],['Environment monitor','#environment'],['Weather','#weather'],['Time engine','#time'],['Air traffic','#airtraffic'],['Satellite intelligence','#satelliteIntel'],['NASA data','#nasaPanel'],['Command Center','#igxCommand'],['Engineering Lab','#igxLab'],['Magazine panel','#igxMagazine'],['Storage panel','#igxStorage'],['Architecture panel','#igxArchitecture'],['Deployment Hub','#igxDeployment'],['System QA','#igxQA']
    ];
    const box=$('igxStatusGrid'); if(!box)return;
    box.innerHTML=''; let ok=0;
    tests.forEach(([name,sel])=>{const present=!!document.querySelector(sel);if(present)ok++;const a=document.createElement('article');a.className='igx-status-item';a.innerHTML=`<strong>${name}</strong><span>${present?'READY · detected':'MISSING · review package'}</span>`;box.appendChild(a);});
    const magazinePdf='./magazine/IGERS-BD-01_Professional_Engineering_Magazine.pdf';
    fetch(magazinePdf,{method:'HEAD',cache:'no-store'}).then(r=>{const a=document.createElement('article');a.className='igx-status-item';a.innerHTML=`<strong>Magazine PDF asset</strong><span>${r.ok?'READY · file reachable':'MISSING · add magazine PDF'}</span>`;box.appendChild(a); if(r.ok)ok++; const total=tests.length+1; if($('igxQABadge')){$('igxQABadge').innerHTML=`<i></i>${ok===total?'ALL CHECKS READY':ok+'/'+total+' CHECKS READY'}`;}}).catch(()=>{const a=document.createElement('article');a.className='igx-status-item';a.innerHTML='<strong>Magazine PDF asset</strong><span>CHECK · browser blocked local HEAD request</span>';box.appendChild(a);if($('igxQABadge'))$('igxQABadge').innerHTML='<i></i>LOCAL ASSET CHECK NEEDED';});
  }
  function boot(){
    $('igxStorageRun')?.addEventListener('click',updateStorage);
    ['igxCap','igxSoc','igxLoad'].forEach(id=>$(id)?.addEventListener('input',updateStorage));
    $('igxQARun')?.addEventListener('click',qa); $('igxQAClear')?.addEventListener('click',()=>{if($('igxStatusGrid'))$('igxStatusGrid').innerHTML='';if($('igxQABadge'))$('igxQABadge').innerHTML='<i></i>READY TO SCAN';});
    updateStorage();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
