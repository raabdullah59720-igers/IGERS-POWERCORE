/* IGERS-BD-01 Admin Machine Control
   Browser prototype only: commands are local UI state and do not actuate physical hardware. */
(function(){
  'use strict';
  const PASSWORD='MIM2005';
  const SESSION_KEY='igers-admin-session-v1';
  const STATE_KEY='igers-machine-states-v1';
  const $=id=>document.getElementById(id);
  const machines=['solar','air','hydraulic','storage','radar','weather','satellite','sensor'];
  const labels={solar:'Solar Recovery Unit',air:'Airflow Recovery Unit',hydraulic:'Hydraulic Recovery Unit',storage:'Energy Storage System',radar:'Radar / Sensor Grid',weather:'Weather Node',satellite:'Satellite Intelligence',sensor:'Infrastructure Sensor Network'};
  const defaults=Object.fromEntries(machines.map(x=>[x,'OFF']));
  let states=defaults;
  try{const x=JSON.parse(localStorage.getItem(STATE_KEY)||'null');if(x&&typeof x==='object')states={...defaults,...x};}catch(_){ }
  const isAdmin=()=>sessionStorage.getItem(SESSION_KEY)==='1';
  function persist(){try{localStorage.setItem(STATE_KEY,JSON.stringify(states));}catch(_){} render();}
  function render(){
    const logged=isAdmin();
    document.querySelectorAll('[data-admin-only]').forEach(e=>e.hidden=!logged);
    if($('igxAdminLogin'))$('igxAdminLogin').hidden=logged;
    if($('igxAdminLogout'))$('igxAdminLogout').hidden=!logged;
    machines.forEach(id=>{
      const el=$('igxState-'+id); if(el){el.textContent=states[id];el.className='igx-machine-state '+states[id].toLowerCase();}
      document.querySelectorAll('[data-machine="'+id+'"]').forEach(b=>b.disabled=!logged);
    });
    const on=machines.filter(x=>states[x]==='ON').length;
    if($('igxMachineCount'))$('igxMachineCount').textContent=on+'/'+machines.length+' ON';
    if($('igxAdminState'))$('igxAdminState').textContent=logged?'ADMIN AUTHORIZED':'VIEW ONLY';
    if($('igxMasterState'))$('igxMasterState').textContent=states.__master==='ON'?'SYSTEM ON':'SYSTEM OFF';
  }
  function login(){
    const input=$('igxAdminPassword'); if(!input)return;
    if(input.value===PASSWORD){sessionStorage.setItem(SESSION_KEY,'1');input.value='';if($('igxAdminError'))$('igxAdminError').textContent='Access granted. Machine controls unlocked.';log('Admin authenticated');render();}
    else{if($('igxAdminError'))$('igxAdminError').textContent='Incorrect password.';log('Failed admin authentication','warn');input.value='';}
  }
  function logout(){sessionStorage.removeItem(SESSION_KEY);log('Admin session closed');render();}
  function setMachine(id,state){if(!isAdmin()){log('Unauthorized control attempt blocked','warn');return;}states[id]=state;persist();log(labels[id]+' → '+state);}
  function master(state){if(!isAdmin()){log('Unauthorized master-control attempt blocked','warn');return;}states.__master=state;machines.forEach(x=>states[x]=state);persist();log('MASTER SYSTEM → '+state);}
  function emergency(){if(!isAdmin()){log('Unauthorized emergency-control attempt blocked','warn');return;}machines.forEach(x=>states[x]='OFF');states.__master='OFF';persist();log('EMERGENCY STOP executed','warn');}
  function log(msg,type='ok'){const box=$('igxAdminLog');if(!box)return;const r=document.createElement('div');r.className=type;r.textContent='['+new Date().toLocaleTimeString('en-GB')+'] '+msg;box.prepend(r);while(box.children.length>25)box.lastChild.remove();}
  function wire(){
    $('igxAdminLogin')?.addEventListener('click',login);$('igxAdminLogout')?.addEventListener('click',logout);$('igxAdminPassword')?.addEventListener('keydown',e=>{if(e.key==='Enter')login();});
    $('igxMasterOn')?.addEventListener('click',()=>master('ON'));$('igxMasterOff')?.addEventListener('click',()=>master('OFF'));$('igxEmergency')?.addEventListener('click',emergency);
    machines.forEach(id=>document.querySelectorAll('[data-machine="'+id+'"]').forEach(b=>b.addEventListener('click',()=>setMachine(id,b.dataset.state))));
    render();log('Admin Control initialized · view-only until authenticated');
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wire,{once:true});else wire();
})();
