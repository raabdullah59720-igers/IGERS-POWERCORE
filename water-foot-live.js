/* IGERS-BD-01 — Water Flow + Foot Harvesting Live Calculation Engine 2026.10.03 */
(function(){
'use strict';
const $=id=>document.getElementById(id);
const STORAGE='igersHarvestModelsV1';
const DEFAULTS={
  water:{on:true,flowLps:500,headM:1.5,eff:70,hours:12,sites:10},
  foot:{on:true,forceN:600,strokeMm:8,eff:35,steps:3000,pads:100}
};
const fmt=(v,d=2)=>Number(v).toLocaleString('en-US',{maximumFractionDigits:d,minimumFractionDigits:d});
const num=(id,f)=>{const v=Number($(id)?.value);return Number.isFinite(v)?v:f};
const set=(id,v)=>{const e=$(id);if(e)e.textContent=v};
function read(){try{return {...DEFAULTS,...JSON.parse(localStorage.getItem(STORAGE)||'{}'),water:{...DEFAULTS.water,...(JSON.parse(localStorage.getItem(STORAGE)||'{}').water||{})},foot:{...DEFAULTS.foot,...(JSON.parse(localStorage.getItem(STORAGE)||'{}').foot||{})}}}catch(_){return JSON.parse(JSON.stringify(DEFAULTS));}}
function save(s){try{localStorage.setItem(STORAGE,JSON.stringify(s))}catch(_){}return s}
function setInputs(prefix,s){const map=prefix==='water'?[['waterFlow',s.flowLps],['waterHead',s.headM],['waterEff',s.eff],['waterHours',s.hours],['waterSites',s.sites]]:[['footForce',s.forceN],['footStroke',s.strokeMm],['footEff',s.eff],['footSteps',s.steps],['footPads',s.pads]];map.forEach(([id,v])=>{const e=$(id);if(e)e.value=v})}
function calcWater(s){
  const rho=1000,g=9.81,Q=Math.max(0,num('waterFlow',s.flowLps))/1000,H=Math.max(0,num('waterHead',s.headM)),eta=Math.min(1,Math.max(0,num('waterEff',s.eff)/100)),hours=Math.max(0,num('waterHours',s.hours)),sites=Math.max(0,num('waterSites',s.sites));
  const hydraulicW=rho*g*Q*H, electricalW=hydraulicW*eta, annualKWh=electricalW/1000*hours*365*sites, annualGWh=annualKWh/1e6, avgKW=annualKWh/8760, volumeM3=Q*3600*hours*365*sites;
  set('waterPowerGross',fmt(hydraulicW/1000,2)+' kW');set('waterPowerNet',fmt(electricalW/1000,2)+' kW');set('waterAnnual',fmt(annualGWh,4)+' GWh/yr');set('waterAverage',fmt(avgKW,2)+' kW');set('waterVolume',fmt(volumeM3/1e6,3)+' million m³/yr');set('waterSitesOut',Math.round(sites).toLocaleString()+' sites');
}
function calcFoot(s){
  const F=Math.max(0,num('footForce',s.forceN)), stroke=Math.max(0,num('footStroke',s.strokeMm))/1000, eta=Math.min(1,Math.max(0,num('footEff',s.eff)/100)), steps=Math.max(0,num('footSteps',s.steps)), pads=Math.max(0,num('footPads',s.pads));
  const mechJ=F*stroke, netJ=mechJ*eta, annualSteps=steps*pads*365, annualKWh=netJ*annualSteps/3600/1000, annualMWh=annualKWh/1000, avgW=annualKWh*1000/8760;
  set('footGross',fmt(mechJ,3)+' J/step');set('footNet',fmt(netJ,3)+' J/step');set('footAnnual',fmt(annualMWh,3)+' MWh/yr');set('footAverage',fmt(avgW,2)+' W');set('footStepsOut',Math.round(annualSteps).toLocaleString()+' steps/yr');set('footPadsOut',Math.round(pads).toLocaleString()+' pads');
}
function render(){const s=read();setInputs('water',s.water);setInputs('foot',s.foot);const wOn=!!s.water.on,fOn=!!s.foot.on;$('waterFlowLive')?.classList.toggle('off',!wOn);$('footLive')?.classList.toggle('off',!fOn);set('waterFlowLiveText',wOn?'LIVE CALCULATION':'ENGINE OFF');set('footLiveText',fOn?'LIVE CALCULATION':'ENGINE OFF');if(wOn)calcWater(s.water);if(fOn)calcFoot(s.foot);set('harvestCombinedState',(wOn&&fOn)?'WATER + FOOT ENGINES LIVE':'HARVEST MODULE PARTIAL');set('sysWaterState',wOn?'LIVE · CALCULATOR':'OFF · DATA PRESERVED');set('sysFootState',fOn?'LIVE · CALCULATOR':'OFF · DATA PRESERVED');set('harvestLast','Updated '+new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',second:'2-digit'}));
  document.dispatchEvent(new CustomEvent('igers:harvest-state',{detail:{water:wOn,foot:fOn}}));
}
function bindInputs(prefix,sKey,fields){fields.forEach(([id,key])=>$(id)?.addEventListener('input',()=>{const state=read();state[sKey][key]=num(id,state[sKey][key]);save(state);render()}))}
function init(){if(!$('waterFootLive'))return;const s=read();save(s);bindInputs('water','water',[['waterFlow','flowLps'],['waterHead','headM'],['waterEff','eff'],['waterHours','hours'],['waterSites','sites']]);bindInputs('foot','foot',[['footForce','forceN'],['footStroke','strokeMm'],['footEff','eff'],['footSteps','steps'],['footPads','pads']]);$('waterRefresh')?.addEventListener('click',render);$('footRefresh')?.addEventListener('click',render);render();setInterval(()=>render(),1000)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
window.IGERS_HARVEST_LIVE='2026.10.03-water-foot1';
})();
