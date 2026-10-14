/* IGERS-BD-01 · Scenario Vault v7. Transaction-safe local scenarios, schema validation, formula-safe CSV. */
(() => {
  'use strict';
  const root = document.getElementById('liveConceptSilo');
  if (!root || document.getElementById('lcsScenarioVault')) return;

  const inputIds = ['lcsMass','lcsV1','lcsV2','lcsCaptureKJ','lcsRoadEff','lcsEvents','lcsSites','lcsPointsKm','lcsRoadDays','lcsRoadAvailability','lcsRoadAux','lcsFlow','lcsHead','lcsHydEff','lcsHydHours','lcsPv','lcsYield','lcsBattery','lcsDod','lcsBatEff','lcsLoad'];
  const metricDefs = [['lcsRoadAnnual','Road annual energy'],['lcsHydPower','Hydraulic power'],['lcsPvAnnual','PV annual energy'],['lcsBatteryHours','Battery autonomy'],['lcsHydAnnual','Hydraulic annual energy'],['lcsCombined','Combined modeled annual energy']];
  const validScenes = new Set(['integrated','road','hydro','solar','sluice','roadharvest','bridge','footstep','thermal','vibration','station']);
  const storageKey = 'igersLcsScenarioVaultV1';
  const maxScenarios = 30;
  const maxCompare = 4;
  const maxImportBytes = 2 * 1024 * 1024;
  const $ = id => document.getElementById(id);
  const csvCell = value => {
    let textValue = String(value ?? '');
    // Spreadsheet formula injection mitigation for user-derived text cells.
    if (typeof value === 'string' && /^[\u0000-\u0020]*[=+@-]/.test(textValue)) textValue = "'" + textValue;
    return '"' + textValue.replace(/"/g, '""') + '"';
  };
  function safeStore(recordsToWrite) {
    try { localStorage.setItem(storageKey, JSON.stringify(recordsToWrite)); return true; }
    catch (_) { return false; }
  }
  const limits = Object.fromEntries(inputIds.map(id => {
    const input = $(id);
    return [id, [Number(input?.min ?? -Infinity), Number(input?.max ?? Infinity)]];
  }));
  function validInputs(inputs) {
    if (!inputs || typeof inputs !== 'object' || Array.isArray(inputs)) return false;
    for (const id of inputIds) {
      const value = inputs[id];
      const range = limits[id];
      if (typeof value !== 'number' || !Number.isFinite(value) || value < range[0] || value > range[1]) return false;
    }
    return inputs.lcsV2 <= inputs.lcsV1 && Number.isInteger(inputs.lcsEvents) && Number.isInteger(inputs.lcsRoadDays);
  }
  function validRecord(item) {
    if (!item || typeof item !== 'object' || Array.isArray(item)) return false;
    if (typeof item.id !== 'string' || !/^[a-zA-Z0-9-]{8,100}$/.test(item.id)) return false;
    if (typeof item.name !== 'string' || !item.name.trim() || item.name.length > 80) return false;
    if (typeof item.createdAt !== 'string' || !Number.isFinite(Date.parse(item.createdAt))) return false;
    if (typeof item.scene !== 'string' || !validScenes.has(item.scene)) return false;
    if (!validInputs(item.inputs) || !item.metrics || typeof item.metrics !== 'object' || Array.isArray(item.metrics)) return false;
    return metricDefs.every(([id]) => typeof item.metrics[id] === 'string' && item.metrics[id].length > 0 && item.metrics[id].length <= 90 && !/NaN|undefined/i.test(item.metrics[id]));
  }
  function migrateLegacyRecord(item) {
    if (!item || typeof item !== 'object' || !item.inputs || typeof item.inputs !== 'object') return item;
    const hasV2 = typeof item.inputs.lcsCaptureKJ === 'number' && typeof item.inputs.lcsPointsKm === 'number';
    if (hasV2) return item;
    // Preserve older user scenarios instead of deleting them. Old event/site values are reinterpreted
    // as AADT and corridor length, then results are recalculated under the thesis-referenced model.
    const old=item.inputs, inputs={...old,
      lcsCaptureKJ:2,
      lcsRoadEff:Number.isFinite(old.lcsRoadEff)?old.lcsRoadEff:70,
      lcsEvents:Number.isFinite(old.lcsEvents)?Math.min(5000000,Math.max(0,Math.round(old.lcsEvents))):210000,
      lcsSites:Number.isFinite(old.lcsSites)?Math.min(100000,Math.max(0,old.lcsSites)):100,
      lcsPointsKm:1,lcsRoadDays:365,lcsRoadAvailability:100,lcsRoadAux:0
    };
    const record={...item,inputs,formatVersion:2};
    try {
      const r=window.IGERSCalcCore.road({massKg:inputs.lcsMass,entryKph:inputs.lcsV1,exitKph:inputs.lcsV2,captureKJ:inputs.lcsCaptureKJ,electricalEfficiencyPct:inputs.lcsRoadEff,aadt:inputs.lcsEvents,lengthKm:inputs.lcsSites,pointsPerKm:inputs.lcsPointsKm,operatingDays:inputs.lcsRoadDays,availabilityPct:inputs.lcsRoadAvailability,auxiliaryWhPerEvent:inputs.lcsRoadAux,addedTractionKJPerEvent:0,drivetrainEfficiencyPct:25});
      const h=window.IGERSCalcCore.hydraulic({flowM3s:inputs.lcsFlow,netHeadM:inputs.lcsHead,efficiencyPct:inputs.lcsHydEff,operatingHours:inputs.lcsHydHours});
      const pv=window.IGERSCalcCore.solarPV({capacityKWp:inputs.lcsPv,specificYieldKWhPerKWpYear:inputs.lcsYield});
      const b=window.IGERSCalcCore.battery({capacityKWh:inputs.lcsBattery,depthOfDischargePct:inputs.lcsDod,dischargeEfficiencyPct:inputs.lcsBatEff,loadKW:inputs.lcsLoad});
      record.metrics={...item.metrics,lcsRoadAnnual:`${r.annualNetGWh.toFixed(4)} GWh/y`,lcsHydPower:`${h.powerKW.toFixed(2)} kW`,lcsPvAnnual:`${(pv.annualKWh/1000).toFixed(2)} MWh/y`,lcsBatteryHours:b.autonomyHours===null?'NO LOAD':`${b.autonomyHours.toFixed(2)} h`,lcsHydAnnual:`${(h.annualKWh/1000).toFixed(2)}`,lcsCombined:`${((r.annualNetKWh+h.annualKWh+pv.annualKWh)/1000).toFixed(2)}`};
    } catch (_) {
      // Keep the saved scenario and flag it for review if the older inputs conflict with the new physical ceiling.
      record.metrics={...item.metrics,lcsRoadAnnual:'CHECK INPUT',lcsHydPower:'CHECK INPUT',lcsPvAnnual:'CHECK INPUT',lcsBatteryHours:'CHECK INPUT',lcsHydAnnual:'CHECK INPUT',lcsCombined:'CHECK INPUT'};
    }
    return record;
  }
  function readStore() {
    try {
      const value = JSON.parse(localStorage.getItem(storageKey) || '[]');
      if (!Array.isArray(value)) return [];
      const result = [], ids = new Set();
      for (const rawItem of value) {
        const item=migrateLegacyRecord(rawItem);
        if (!validRecord(item) || ids.has(item.id)) continue;
        ids.add(item.id); result.push(item);
        if (result.length >= maxScenarios) break;
      }
      return result;
    } catch (_) { return []; }
  }
  function text(el, value) { if (el) el.textContent = String(value ?? ''); }
  function status(message, error=false) { const el=$('lcsvStatus'); if (el) { text(el,message); el.style.color=error?'#ffb9b9':''; } }
  function nowLabel(iso) { try { return new Intl.DateTimeFormat(undefined,{dateStyle:'medium',timeStyle:'short'}).format(new Date(iso)); } catch (_) { return iso; } }
  function currentInputs() { const result={}; for (const id of inputIds) result[id]=Number($(id)?.value); return result; }
  function currentMetrics() { const result={}; for (const [id] of metricDefs) result[id]=String($(id)?.textContent || '—').trim().slice(0,90); return result; }
  function activeScene() {
    const id = root.querySelector('[data-lcs-scene][aria-pressed="true"]')?.dataset.lcsScene || 'integrated';
    return validScenes.has(id) ? id : 'integrated';
  }
  function newId() {
    try { if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID(); } catch (_) {}
    return 'scn-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2,12);
  }
  let records = readStore();
  let comparison = [];

  root.insertAdjacentHTML('beforeend', `
    <section id="lcsScenarioVault" class="lcsv" aria-labelledby="lcsvHeading">
      <div class="lcsv-head"><div><div class="lcsv-eyebrow">ENGINEERING WORKBENCH · LOCAL SCENARIO LIBRARY</div><h3 id="lcsvHeading">Scenario Vault &amp; Comparison</h3><p>Save the current calculator assumptions, restore a previous scenario, and compare up to four cases side by side. Records stay in this browser until exported.</p></div><span class="lcsv-local-badge">LOCAL ONLY · NO TELEMETRY</span></div>
      <div class="lcsv-toolbar"><div class="lcsv-field"><label for="lcsScenarioName">Scenario name</label><input id="lcsScenarioName" type="text" maxlength="80" placeholder="e.g. Teesta site – preliminary case" autocomplete="off"></div><div class="lcsv-actions"><button id="lcsScenarioSave" class="lcsv-btn primary" type="button">Save current scenario</button><button id="lcsScenarioJson" class="lcsv-btn" type="button">Export JSON</button><button id="lcsScenarioCsv" class="lcsv-btn" type="button">Export CSV</button><label class="lcsv-btn lcsv-import-label" for="lcsScenarioImport">Import JSON<input id="lcsScenarioImport" type="file" accept="application/json,.json"></label></div></div>
      <div id="lcsvStatus" class="lcsv-status" role="status" aria-live="polite">No scenarios saved yet. Recalculate the current model before saving.</div><div id="lcsvList" class="lcsv-list" aria-live="polite"></div>
      <div class="lcsv-compare"><h4>Side-by-side comparison <span id="lcsvCompareCount" aria-label="scenarios selected">(0 selected)</span></h4><div id="lcsvCompareTable" class="lcsv-table-wrap"><div class="lcsv-empty">Select two to four saved scenarios using the Compare checkbox.</div></div></div>
      <div class="lcsv-footer"><span class="lcsv-note">These are conceptual estimates, not verified field measurements or guaranteed generation. Use site-survey data and independent engineering review before design decisions.</span><div class="lcsv-actions"><button id="lcsvVaultClear" class="lcsv-btn danger" type="button">Clear local scenarios</button></div></div>
    </section>`);

  function renderComparison() {
    const chosen=records.filter(r=>comparison.includes(r.id));
    text($('lcsvCompareCount'),`(${chosen.length} selected)`);
    const host=$('lcsvCompareTable'); host.replaceChildren();
    if(chosen.length<2){const empty=document.createElement('div');empty.className='lcsv-empty';empty.textContent=chosen.length===1?'Select at least one more saved scenario to compare.':'Select two to four saved scenarios using the Compare checkbox.';host.append(empty);return;}
    const table=document.createElement('table'),thead=document.createElement('thead'),trh=document.createElement('tr');
    ['Metric',...chosen.map(r=>r.name)].forEach(label=>{const th=document.createElement('th');th.scope='col';th.textContent=label;trh.append(th);});thead.append(trh);table.append(thead);
    const tb=document.createElement('tbody');
    const rows=[...metricDefs.map(([id,label])=>[label,id]),['Entry speed (km/h)','lcsV1'],['Exit speed (km/h)','lcsV2'],['Mechanical capture / event (kJ)','lcsCaptureKJ'],['Electrical-chain efficiency (%)','lcsRoadEff'],['AADT / passages per day','lcsEvents'],['Corridor length (km)','lcsSites'],['Harvesting points / km','lcsPointsKm'],['Operating days / year','lcsRoadDays'],['Road availability (%)','lcsRoadAvailability'],['Hydraulic flow (m³/s)','lcsFlow'],['Hydraulic head (m)','lcsHead'],['PV size (kWp)','lcsPv'],['Battery size (kWh)','lcsBattery'],['Average load (kW)','lcsLoad']];
    for(const [label,key] of rows){const tr=document.createElement('tr'),th=document.createElement('th');th.scope='row';th.textContent=label;tr.append(th);for(const record of chosen){const td=document.createElement('td');td.textContent=Object.prototype.hasOwnProperty.call(record.metrics,key)?record.metrics[key]:String(record.inputs[key]);tr.append(td);}tb.append(tr);}table.append(tb);host.append(table);
  }
  function render() {
    const list=$('lcsvList'); list.replaceChildren();
    if(!records.length){const empty=document.createElement('div');empty.className='lcsv-empty';empty.textContent='Your saved scenarios will appear here. Saving a scenario creates a browser-local snapshot of inputs, results and selected visual.';list.append(empty);}
    for(const record of records){
      const card=document.createElement('article');card.className='lcsv-card';
      const top=document.createElement('div');top.className='lcsv-card-top';
      const titleBox=document.createElement('div'),title=document.createElement('div');title.className='lcsv-card-title';title.textContent=record.name;const date=document.createElement('div');date.className='lcsv-date';date.textContent=nowLabel(record.createdAt)+' · '+record.scene.toUpperCase();titleBox.append(title,date);
      const compareLabel=document.createElement('label');compareLabel.className='lcsv-select';const check=document.createElement('input');check.type='checkbox';check.checked=comparison.includes(record.id);check.setAttribute('aria-label','Compare '+record.name);compareLabel.append(check,document.createTextNode('Compare'));
      check.addEventListener('change',()=>{if(check.checked){if(comparison.length>=maxCompare){check.checked=false;status('You can compare up to four scenarios at a time.',true);return;}comparison.push(record.id);}else comparison=comparison.filter(id=>id!==record.id);render();});top.append(titleBox,compareLabel);card.append(top);
      const grid=document.createElement('div');grid.className='lcsv-metrics';for(const [id,label] of metricDefs.slice(0,4)){const metric=document.createElement('div');metric.className='lcsv-metric';const b=document.createElement('b');b.textContent=record.metrics[id];const span=document.createElement('span');span.textContent=label;metric.append(b,span);grid.append(metric);}card.append(grid);
      const actions=document.createElement('div');actions.className='lcsv-card-actions';const restore=document.createElement('button');restore.type='button';restore.className='lcsv-btn';restore.textContent='Restore inputs';restore.addEventListener('click',()=>restoreRecord(record));const remove=document.createElement('button');remove.type='button';remove.className='lcsv-btn danger';remove.textContent='Delete';remove.addEventListener('click',()=>{if(!window.confirm(`Delete saved scenario “${record.name}” from this browser?`))return;const next=records.filter(r=>r.id!==record.id);commitRecords(next,`Deleted “${record.name}”.`,comparison.filter(id=>id!==record.id));});actions.append(restore,remove);card.append(actions);list.append(card);
    }
    $('lcsScenarioJson').disabled=!records.length;$('lcsScenarioCsv').disabled=!records.length;$('lcsvVaultClear').disabled=!records.length;renderComparison();
  }
  function commitRecords(nextRecords, message, nextComparison=comparison) {
    if(!safeStore(nextRecords)){status('Storage write failed. Nothing was changed. Export a JSON backup or free browser storage, then retry.',true);return false;}
    records=nextRecords;
    comparison=nextComparison.filter(id=>records.some(r=>r.id===id));
    render();status(message || `${records.length} scenario(s) saved locally.`);return true;
  }
  function download(name,mime,content){try{const blob=new Blob([content],{type:mime});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);return true;}catch(_){return false;}}
  function restoreRecord(record){
    if(!validRecord(record)){status('This saved record failed validation and was not restored.',true);return;}
    for(const id of inputIds){const el=$(id);if(el){el.value=String(record.inputs[id]);el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));}}
    const scene=Array.from(root.querySelectorAll('[data-lcs-scene]')).find(button=>button.dataset.lcsScene===record.scene);if(scene)scene.click();$('lcsRecalc')?.click();status(`Restored “${record.name}”. Review assumptions and calculated outputs before using them.`);root.querySelector('.lcs-fields')?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'center'});
  }
  $('lcsScenarioSave').addEventListener('click',()=>{
    if(records.length>=maxScenarios){status(`The local vault limit is ${maxScenarios} scenarios. Export your vault, then delete old entries.`,true);return;}
    $('lcsRecalc')?.click();const inputs=currentInputs();if(!validInputs(inputs)){status('Cannot save: inputs are empty/out of range, or exit speed exceeds entry speed.',true);return;}
    const metrics=currentMetrics();if(metricDefs.some(([id])=>!metrics[id]||/CHECK INPUT|NaN|undefined/i.test(metrics[id]))){status('Calculation output is not valid yet. Correct inputs and recalculate first.',true);return;}
    const typedName=$('lcsScenarioName').value.trim();const name=typedName||`IGERS scenario ${new Date().toLocaleString()}`;if(name.length>80){status('Scenario name must be 80 characters or fewer.',true);return;}
    const record={id:newId(),name,createdAt:new Date().toISOString(),scene:activeScene(),inputs,metrics};
    if(commitRecords([record,...records],`Saved “${name}” locally.`))$('lcsScenarioName').value='';
  });
  $('lcsScenarioJson').addEventListener('click',()=>{const payload={format:'IGERS-Scenario-Vault',version:2,exportedAt:new Date().toISOString(),note:'Conceptual calculator snapshots only; not field telemetry.',scenarios:records};const ok=download(`igers-scenario-vault-${new Date().toISOString().slice(0,10)}.json`,'application/json;charset=utf-8',JSON.stringify(payload,null,2));status(ok?'JSON export started. Keep a copy outside this browser for backup.':'JSON download is unavailable in this browser.',!ok);});
  $('lcsScenarioCsv').addEventListener('click',()=>{const headers=['Name','Created At','Selected Scene',...metricDefs.map(([,label])=>label),...inputIds];const rows=[headers];for(const record of records)rows.push([record.name,record.createdAt,record.scene,...metricDefs.map(([id])=>record.metrics[id]),...inputIds.map(id=>record.inputs[id])]);const csv='\uFEFF'+rows.map(row=>row.map(csvCell).join(',')).join('\r\n');const ok=download(`igers-scenario-vault-${new Date().toISOString().slice(0,10)}.csv`,'text/csv;charset=utf-8',csv);status(ok?'CSV export started. Spreadsheet-safe text escaping was applied.':'CSV download is unavailable in this browser.',!ok);});
  $('lcsScenarioImport').addEventListener('change',async(event)=>{
    const file=event.target.files?.[0];if(!file)return;if(file.size>maxImportBytes){status('Import blocked: JSON file exceeds 2 MB.',true);event.target.value='';return;}
    try{const payload=JSON.parse(await file.text());const incoming=Array.isArray(payload)?payload:payload?.scenarios;if(!Array.isArray(incoming))throw new Error('Expected a scenario array.');
      const valid=incoming.filter(validRecord);if(!valid.length)throw new Error('No valid scenario records were found.');
      const available=maxScenarios-records.length;if(available<=0)throw new Error('Vault is full. Export and remove old scenarios first.');
      const additions=valid.slice(0,available).map(record=>({...record,id:newId()}));if(!additions.length)throw new Error('No scenarios were added.');
      const next=[...records,...additions];if(commitRecords(next,`Imported ${additions.length} validated scenario(s).`))status(`Imported ${additions.length} scenario(s); each record was validated and assigned a new local ID.`);
    }catch(error){status(`Import failed: ${String(error?.message||'invalid JSON').slice(0,180)}`,true);}finally{event.target.value='';}
  });
  $('lcsvVaultClear').addEventListener('click',()=>{if(!records.length)return;if(!window.confirm('Clear all locally saved IGERS Scenario Vault records? Export a backup first if needed.'))return;if(commitRecords([], 'Local scenario vault cleared. Calculators and all other panels are unchanged.',[]))comparison=[];});

  render();
})();
