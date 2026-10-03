/* IGERS-BD-01 — Live Energy Calculation & Admin Control additive module */
(function(){
'use strict';
const PASS='MIM2005';
const AUTH='igersEnergyAdminV1';
const STATE='igersEnergyEngineV1';
const $=id=>document.getElementById(id);
const num=(id,fallback)=>{const v=Number($(id)?.value);return Number.isFinite(v)?v:fallback};
const fmt=(v,d=2)=>Number(v).toLocaleString('en-US',{maximumFractionDigits:d,minimumFractionDigits:d});
function admin(){try{return sessionStorage.getItem(AUTH)==='1'}catch(_){return false}}
function state(){try{return {...{on:true,mass:900,v1:20,v2:15,recovery:.20,locations:100000,vehicles:210000},...JSON.parse(localStorage.getItem(STATE)||'{}')}}catch(_){return {on:true,mass:900,v1:20,v2:15,recovery:.20,locations:100000,vehicles:210000}}}
function save(s){try{localStorage.setItem(STATE,JSON.stringify(s))}catch(_){} }
function set(id,t){const e=$(id);if(e)e.textContent=t}
function setInputs(s){[['energyMass',s.mass],['energyV1',s.v1],['energyV2',s.v2],['energyRecovery',s.recovery*100],['energyLocations',s.locations],['energyVehicles',s.vehicles]].forEach(([id,v])=>{const e=$(id);if(e)e.value=v})}
function calculate(){const s=state(); if(!s.on){set('energyEngineState','ENGINE OFF · DATA PRESERVED');set('energyLiveBadge','ENGINE OFF');$('energyLiveBadge')?.classList.add('off');return}
$('energyLiveBadge')?.classList.remove('off');set('energyLiveBadge','LIVE CALCULATION');set('energyEngineState','ENGINE ACTIVE · REAL-TIME MODEL');
const m=Math.max(0,num('energyMass',900)), v1=Math.max(0,num('energyV1',20))/3.6, v2=Math.max(0,num('energyV2',15))/3.6, eta=Math.min(1,Math.max(0,num('energyRecovery',20)/100)), loc=Math.max(0,num('energyLocations',100000)), veh=Math.max(0,num('energyVehicles',210000));
const deltaJ=.5*m*Math.max(0,v1*v1-v2*v2), eventWh=deltaJ/3600, netWh=eventWh*eta, events=loc*veh, annualKWh=netWh*events/1000, annualGWh=annualKWh/1e6, avgKW=annualKWh*1000/8760;
set('energyEvent',''+fmt(eventWh,3)+' Wh');set('energyAnnual',''+fmt(annualGWh,3)+' GWh/yr');set('energyAverage',''+fmt(avgKW,1)+' kW');set('energyEvents',''+Math.round(events).toLocaleString());set('energyDelta',''+fmt(deltaJ,1)+' J/event');set('energyNet',''+fmt(netWh,3)+' Wh/event');set('energyLast','Updated '+new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',second:'2-digit'}));
}
function sync(){const s=state();setInputs(s);const a=admin();$('energyLoginBox')?.classList.toggle('hidden',a);$('energyControlBox')?.classList.toggle('hidden',!a);set('energyAdminState',a?'ADMIN UNLOCKED':'ADMIN LOCKED');set('energyEngineToggle',s.on?'ON':'OFF');calculate()}
function needAdmin(){if(admin())return true;set('energyAdminMsg','Administrator login required for energy-engine controls.');$('energyPassword')?.focus();return false}
function bind(){
['energyMass','energyV1','energyV2','energyRecovery','energyLocations','energyVehicles'].forEach(id=>$(id)?.addEventListener('input',()=>{if(!state().on)return;const s=state();s.mass=num('energyMass',s.mass);s.v1=num('energyV1',s.v1);s.v2=num('energyV2',s.v2);s.recovery=num('energyRecovery',s.recovery*100)/100;s.locations=num('energyLocations',s.locations);s.vehicles=num('energyVehicles',s.vehicles);save(s);calculate()}));
$('energyLogin')?.addEventListener('click',()=>{if($('energyPassword')?.value===PASS){sessionStorage.setItem(AUTH,'1');set('energyAdminMsgLogin','Administrator session active.');sync()}else set('energyAdminMsgLogin','Incorrect administrator password.')});
$('energyLogout')?.addEventListener('click',()=>{sessionStorage.removeItem(AUTH);sync()});
$('energyEngineOn')?.addEventListener('click',()=>{if(!needAdmin())return;const s=state();s.on=true;save(s);sync()});
$('energyEngineOff')?.addEventListener('click',()=>{if(!needAdmin())return;if(confirm('Turn the energy calculation engine OFF? Existing calculation data and settings will be preserved.')){const s=state();s.on=false;save(s);sync()}});
$('energyReset')?.addEventListener('click',()=>{if(!needAdmin())return;if(confirm('Reset the energy model to the IGERS reference assumptions?')){save({on:true,mass:900,v1:20,v2:15,recovery:.20,locations:100000,vehicles:210000});sync()}});
$('energyRefresh')?.addEventListener('click',()=>calculate());
}
function init(){if(!$('energyLiveUpdate'))return;sync();bind();setInterval(()=>{if(state().on)calculate()},1000)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
