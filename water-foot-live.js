/* IGERS-BD-01 — Water Flow + Foot Harvesting Live Calculation Engine 2026.10.11 */
(function(){
'use strict';
const $=id=>document.getElementById(id);
const STORAGE='igersHarvestModelsV1';
const DEFAULTS={water:{on:true,flowLps:500,headM:1.5,eff:70,hours:12,sites:10},foot:{on:true,forceN:600,strokeMm:8,eff:35,steps:3000,pads:100}};
const fmt=(v,d=2)=>Number(v).toLocaleString('en-US',{maximumFractionDigits:d,minimumFractionDigits:d});
const num=(id)=>{const el=$(id);if(!el)return NaN;const raw=String(el.value??'').trim();if(raw==='')return NaN;const v=Number(raw);return Number.isFinite(v)?v:NaN;};
const set=(id,v)=>{const e=$(id);if(e)e.textContent=v};
function read(){try{const stored=JSON.parse(localStorage.getItem(STORAGE)||'{}');return {...DEFAULTS,...stored,water:{...DEFAULTS.water,...(stored.water||{})},foot:{...DEFAULTS.foot,...(stored.foot||{})}}}catch(_){return JSON.parse(JSON.stringify(DEFAULTS));}}
function save(s){try{localStorage.setItem(STORAGE,JSON.stringify(s));return true}catch(_){return false}}
function setInputs(prefix,s){const map=prefix==='water'?[['waterFlow',s.flowLps],['waterHead',s.headM],['waterEff',s.eff],['waterHours',s.hours],['waterSites',s.sites]]:[['footForce',s.forceN],['footStroke',s.strokeMm],['footEff',s.eff],['footSteps',s.steps],['footPads',s.pads]];map.forEach(([id,v])=>{const e=$(id);if(e)e.value=v})}
function calcWater(){
  const flowLps=num('waterFlow'),H=num('waterHead'),effPct=num('waterEff'),hours=num('waterHours'),sites=num('waterSites');
  if([flowLps,H,effPct,hours,sites].some(v=>!Number.isFinite(v))||flowLps<0||flowLps>1e8||H<0||H>10000||effPct<0||effPct>100||hours<0||hours>24||sites<0||sites>1e9){['waterPowerGross','waterPowerNet','waterAnnual','waterAverage','waterVolume','waterSitesOut'].forEach(id=>set(id,'—'));set('waterFlowLiveText','CHECK INPUTS · Water model estimate withheld');return false;}
  const rho=1000,g=9.80665,Q=flowLps/1000,eta=effPct/100;
  const hydraulicW=rho*g*Q*H,electricalW=hydraulicW*eta,annualKWh=electricalW/1000*hours*365*sites,annualGWh=annualKWh/1e6,avgKW=annualKWh/8760,volumeM3=Q*3600*hours*365*sites;
  if([hydraulicW,electricalW,annualKWh,annualGWh,avgKW,volumeM3].some(v=>!Number.isFinite(v))){['waterPowerGross','waterPowerNet','waterAnnual','waterAverage','waterVolume','waterSitesOut'].forEach(id=>set(id,'—'));set('waterFlowLiveText','CHECK INPUTS · Numeric range exceeded');return false;}
  set('waterPowerGross',fmt(hydraulicW/1000,3)+' kW');set('waterPowerNet',fmt(electricalW/1000,3)+' kW');set('waterAnnual',fmt(annualGWh,6)+' GWh/yr');set('waterAverage',fmt(avgKW,3)+' kW');set('waterVolume',fmt(volumeM3/1e6,5)+' million m³/yr');set('waterSitesOut',Math.round(sites).toLocaleString()+' sites');set('waterFlowLiveText','MODEL ESTIMATE · INPUTS VALID');return true;
}
function calcFoot(){
  const F=num('footForce'),strokeMm=num('footStroke'),effPct=num('footEff'),steps=num('footSteps'),pads=num('footPads');
  if([F,strokeMm,effPct,steps,pads].some(v=>!Number.isFinite(v))||F<0||F>1e7||strokeMm<0||strokeMm>10000||effPct<0||effPct>100||steps<0||steps>1e9||pads<0||pads>1e8){['footGross','footNet','footAnnual','footAverage','footStepsOut','footPadsOut'].forEach(id=>set(id,'—'));set('footLiveText','CHECK INPUTS · Footstep model estimate withheld');return false;}
  const stroke=strokeMm/1000,eta=effPct/100,mechJ=F*stroke,netJ=mechJ*eta,annualSteps=steps*pads*365,annualKWh=netJ*annualSteps/3.6e6,annualMWh=annualKWh/1000,avgW=annualKWh*1000/8760;
  if([mechJ,netJ,annualSteps,annualKWh,annualMWh,avgW].some(v=>!Number.isFinite(v))){['footGross','footNet','footAnnual','footAverage','footStepsOut','footPadsOut'].forEach(id=>set(id,'—'));set('footLiveText','CHECK INPUTS · Numeric range exceeded');return false;}
  set('footGross',fmt(mechJ,6)+' J/step');set('footNet',fmt(netJ,6)+' J/step');set('footAnnual',fmt(annualMWh,6)+' MWh/yr');set('footAverage',fmt(avgW,4)+' W');set('footStepsOut',Math.round(annualSteps).toLocaleString()+' steps/yr');set('footPadsOut',Math.round(pads).toLocaleString()+' pads');set('footLiveText','MODEL ESTIMATE · INPUTS VALID');return true;
}
function refreshFromCurrentInputs(){
  const s=read(),wOn=!!s.water.on,fOn=!!s.foot.on;
  $('waterFlowLive')?.classList.toggle('off',!wOn);$('footLive')?.classList.toggle('off',!fOn);
  const wOk=wOn?calcWater():false,fOk=fOn?calcFoot():false;
  if(!wOn){set('waterFlowLiveText','ENGINE OFF · SETTINGS PRESERVED');['waterPowerGross','waterPowerNet','waterAnnual','waterAverage','waterVolume','waterSitesOut'].forEach(id=>set(id,'—'));}
  if(!fOn){set('footLiveText','ENGINE OFF · SETTINGS PRESERVED');['footGross','footNet','footAnnual','footAverage','footStepsOut','footPadsOut'].forEach(id=>set(id,'—'));}
  set('harvestCombinedState',wOn&&fOn&&wOk&&fOk?'WATER + FOOT MODELS VALID':(!wOn&&!fOn?'HARVEST MODULES OFF':'HARVEST MODELS PARTIAL · CHECK STATUS'));
  set('sysWaterState',!wOn?'OFF · SETTINGS PRESERVED':wOk?'MODEL VALID · ESTIMATE':'CHECK INPUTS');set('sysFootState',!fOn?'OFF · SETTINGS PRESERVED':fOk?'MODEL VALID · ESTIMATE':'CHECK INPUTS');
  set('harvestLast','Updated '+new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',second:'2-digit'})+' · model estimates, not measured telemetry');
  document.dispatchEvent(new CustomEvent('igers:harvest-state',{detail:{water:wOn&&wOk,foot:fOn&&fOk,simulationOnly:true}}));
}
function render(){const s=read();setInputs('water',s.water);setInputs('foot',s.foot);refreshFromCurrentInputs();}
function bindInputs(prefix,sKey,fields){fields.forEach(([id,key])=>$(id)?.addEventListener('input',()=>{const state=read(),el=$(id),raw=String(el?.value??'').trim(),value=raw===''?NaN:Number(raw);if(Number.isFinite(value))state[sKey][key]=value;save(state);refreshFromCurrentInputs();}));}
function init(){if(!$('waterFootLive'))return;const s=read();save(s);setInputs('water',s.water);setInputs('foot',s.foot);bindInputs('water','water',[['waterFlow','flowLps'],['waterHead','headM'],['waterEff','eff'],['waterHours','hours'],['waterSites','sites']]);bindInputs('foot','foot',[['footForce','forceN'],['footStroke','strokeMm'],['footEff','eff'],['footSteps','steps'],['footPads','pads']]);$('waterRefresh')?.addEventListener('click',refreshFromCurrentInputs);$('footRefresh')?.addEventListener('click',refreshFromCurrentInputs);refreshFromCurrentInputs();setInterval(refreshFromCurrentInputs,1000);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
window.IGERS_HARVEST_LIVE='2026.10.11-validation-v3';
window.IGERS_HARVEST_MATH=Object.freeze({water:(flowLps,headM,effPct,hoursPerDay,sites)=>{if(![flowLps,headM,effPct,hoursPerDay,sites].every(Number.isFinite)||flowLps<0||flowLps>1e8||headM<0||headM>10000||effPct<0||effPct>100||hoursPerDay<0||hoursPerDay>24||sites<0||sites>1e9)return null;const q=flowLps/1000,powerKw=9.80665*q*headM*effPct/100,annualKWh=powerKw*hoursPerDay*365*sites,averageKw=annualKWh/8760,volumeM3PerYear=q*3600*hoursPerDay*365*sites;return [powerKw,annualKWh,averageKw,volumeM3PerYear].every(Number.isFinite)?{powerKw,annualKWh,averageKw,volumeM3PerYear}:null;},foot:(forceN,strokeMm,effPct,stepsPerDayPerPad,pads)=>{if(![forceN,strokeMm,effPct,stepsPerDayPerPad,pads].every(Number.isFinite)||forceN<0||forceN>1e7||strokeMm<0||strokeMm>10000||effPct<0||effPct>100||stepsPerDayPerPad<0||stepsPerDayPerPad>1e9||pads<0||pads>1e8)return null;const joulesPerStep=forceN*strokeMm/1000*effPct/100,annualSteps=stepsPerDayPerPad*pads*365,annualKWh=joulesPerStep*annualSteps/3.6e6,annualMWh=annualKWh/1000,averageW=annualKWh*1000/8760;return [joulesPerStep,annualSteps,annualKWh,annualMWh,averageW].every(Number.isFinite)?{joulesPerStep,annualSteps,annualKWh,annualMWh,averageW}:null;}});
})();
