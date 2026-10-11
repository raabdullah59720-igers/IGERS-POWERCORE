/* IGERS-BD-01 — Live Energy Calculation & Admin Control additive module.
 * Model results are input-based estimates, not live electrical telemetry.
 */
(function(){
'use strict';
const PASS='MIM2005';
const AUTH='igersEnergyAdminV1';
const STATE='igersEnergyEngineV1';
const $=id=>document.getElementById(id);
const fmt=(v,d=2)=>Number(v).toLocaleString('en-US',{maximumFractionDigits:d,minimumFractionDigits:d});
const readNumber=id=>{const e=$(id);if(!e)return NaN;const raw=String(e.value??'').trim();if(raw==='')return NaN;const n=Number(raw);return Number.isFinite(n)?n:NaN;};
function admin(){try{return sessionStorage.getItem(AUTH)==='1'}catch(_){return false}}
function state(){try{return {...{on:true,mass:900,v1:20,v2:15,recovery:.20,locations:100000,vehicles:210000},...JSON.parse(localStorage.getItem(STATE)||'{}')}}catch(_){return {on:true,mass:900,v1:20,v2:15,recovery:.20,locations:100000,vehicles:210000}}}
function save(s){try{localStorage.setItem(STATE,JSON.stringify(s))}catch(_){} }
function set(id,t){const e=$(id);if(e)e.textContent=t}
function setInputs(s){[['energyMass',s.mass],['energyV1',s.v1],['energyV2',s.v2],['energyRecovery',s.recovery*100],['energyLocations',s.locations],['energyVehicles',s.vehicles]].forEach(([id,v])=>{const e=$(id);if(e)e.value=v})}
function calculateModel(input){
  const {mass,v1Kmh,v2Kmh,recoveryPct,locations,vehicles}=input;
  const values=[mass,v1Kmh,v2Kmh,recoveryPct,locations,vehicles];
  if(values.some(v=>!Number.isFinite(v))||mass<=0||mass>1e7||v1Kmh<0||v1Kmh>500||v2Kmh<0||v2Kmh>v1Kmh||recoveryPct<0||recoveryPct>100||locations<0||locations>1e12||vehicles<0||vehicles>1e12){
    return {ok:false,error:'Check inputs: mass must be > 0 and ≤ 10,000,000 kg; speed 0–500 km/h with exit ≤ entry; recovery efficiency 0–100%; and locations/vehicles per year must each be 0–1e12. Blank or non-finite values are rejected.'};
  }
  const vi=v1Kmh/3.6,vo=v2Kmh/3.6;
  const deltaJ=.5*mass*(vi*vi-vo*vo);
  const grossWh=deltaJ/3600;
  const netWh=grossWh*(recoveryPct/100);
  const events=locations*vehicles;
  const annualKWh=netWh*events/1000;
  const annualGWh=annualKWh/1e6;
  const avgKW=annualKWh/8760;
  if([deltaJ,grossWh,netWh,events,annualKWh,annualGWh,avgKW].some(v=>!Number.isFinite(v)||v<0))return {ok:false,error:'Output exceeded the supported numeric range; reduce the inputs and retry.'};
  return {ok:true,deltaJ,grossWh,netWh,events,annualKWh,annualGWh,avgKW,assumption:'Model estimate only; assumes the entered traffic count and recovery efficiency apply to all modeled passages.'};
}
window.IGERS_ENERGY_MATH=Object.freeze({calculate:calculateModel,version:'energy-units-v2'});
function calculate(){
  const s=state();
  if(!s.on){set('energyEngineState','ENGINE OFF · SETTINGS PRESERVED');set('energyLiveBadge','ENGINE OFF');$('energyLiveBadge')?.classList.add('off');return;}
  $('energyLiveBadge')?.classList.remove('off');
  const result=calculateModel({mass:readNumber('energyMass'),v1Kmh:readNumber('energyV1'),v2Kmh:readNumber('energyV2'),recoveryPct:readNumber('energyRecovery'),locations:readNumber('energyLocations'),vehicles:readNumber('energyVehicles')});
  if(!result.ok){set('energyLiveBadge','CHECK INPUTS');set('energyEngineState','INPUT ERROR · LOCAL MODEL');set('energyEvent','—');set('energyNet','—');set('energyAnnual','—');set('energyAverage','—');set('energyEvents','—');set('energyDelta','—');set('energyLast',result.error);return;}
  set('energyLiveBadge','LOCAL MODEL · AUTO-CALCULATED');set('energyEngineState','ENGINE ACTIVE · INPUT-BASED MODEL');
  set('energyEvent',fmt(result.grossWh,3)+' Wh');set('energyAnnual',fmt(result.annualGWh,3)+' GWh/yr');set('energyAverage',fmt(result.avgKW,3)+' kW');set('energyEvents',Math.round(result.events).toLocaleString());set('energyDelta',fmt(result.deltaJ,1)+' J/event');set('energyNet',fmt(result.netWh,6)+' Wh/event');set('energyLast','Updated '+new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',second:'2-digit'})+' · model estimate, not sensor data. '+result.assumption);
}
function sync(){const s=state();setInputs(s);const a=admin();$('energyLoginBox')?.classList.toggle('hidden',a);$('energyControlBox')?.classList.toggle('hidden',!a);set('energyAdminState',a?'ADMIN UNLOCKED':'ADMIN LOCKED');set('energyEngineToggle',s.on?'ON':'OFF');calculate()}
function needAdmin(){if(admin())return true;set('energyAdminMsg','Administrator login required for energy-engine controls.');$('energyPassword')?.focus();return false}
function bind(){
  ['energyMass','energyV1','energyV2','energyRecovery','energyLocations','energyVehicles'].forEach(id=>$(id)?.addEventListener('input',()=>{
    if(!state().on)return;
    const s=state(), map={energyMass:'mass',energyV1:'v1',energyV2:'v2',energyRecovery:'recovery',energyLocations:'locations',energyVehicles:'vehicles'};
    const value=readNumber(id);if(Number.isFinite(value))s[map[id]]=id==='energyRecovery'?value/100:value;
    save(s);calculate();
  }));
  $('energyLogin')?.addEventListener('click',()=>{if($('energyPassword')?.value===PASS){sessionStorage.setItem(AUTH,'1');set('energyAdminMsgLogin','Administrator session active.');sync()}else set('energyAdminMsgLogin','Incorrect administrator password.')});
  $('energyLogout')?.addEventListener('click',()=>{sessionStorage.removeItem(AUTH);sync()});
  $('energyEngineOn')?.addEventListener('click',()=>{if(!needAdmin())return;const s=state();s.on=true;save(s);sync()});
  $('energyEngineOff')?.addEventListener('click',()=>{if(!needAdmin())return;if(confirm('Turn the local energy model OFF? Existing calculation settings will be preserved.')){const s=state();s.on=false;save(s);sync()}});
  $('energyReset')?.addEventListener('click',()=>{if(!needAdmin())return;if(confirm('Reset the energy model to the IGERS reference assumptions?')){save({on:true,mass:900,v1:20,v2:15,recovery:.20,locations:100000,vehicles:210000});sync()}});
  $('energyRefresh')?.addEventListener('click',()=>calculate());
}
function init(){if(!$('energyLiveUpdate'))return;sync();bind();setInterval(()=>{if(state().on)calculate()},1000)}
window.IGERS_ENERGY_REPAIR_HOOK=init;
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
