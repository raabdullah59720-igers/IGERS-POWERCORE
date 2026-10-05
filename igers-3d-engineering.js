
(function(){
  'use strict';
  const root=document.getElementById('igx3d'); if(!root)return;
  const model=root.querySelector('.ig3d-model');
  const mode=root.querySelector('#ig3dMode');
  const yaw=root.querySelector('#ig3dYaw');
  const reset=root.querySelector('#ig3dReset');
  const stages=root.querySelectorAll('.ig3d-toggle button');
  let angle=0, active='SYSTEM';
  function render(){ model.style.transform=`translate(-50%,-50%) rotateX(58deg) rotateZ(${angle-9}deg)`; if(mode)mode.textContent=active+' VIEW'; }
  yaw?.addEventListener('click',()=>{angle=(angle+45)%360;render()});
  reset?.addEventListener('click',()=>{angle=0;active='SYSTEM';stages.forEach(b=>b.classList.toggle('active',b.dataset.layer==='SYSTEM'));render()});
  stages.forEach(b=>b.addEventListener('click',()=>{active=b.dataset.layer||'SYSTEM';stages.forEach(x=>x.classList.toggle('active',x===b));render()}));
  let dragging=false,lastX=0;
  root.querySelector('.ig3d-stage')?.addEventListener('pointerdown',e=>{dragging=true;lastX=e.clientX;try{e.currentTarget.setPointerCapture(e.pointerId)}catch(_){} });
  root.querySelector('.ig3d-stage')?.addEventListener('pointermove',e=>{if(!dragging)return;const dx=e.clientX-lastX;lastX=e.clientX;angle=(angle+dx*.45)%360;render();});
  root.querySelector('.ig3d-stage')?.addEventListener('pointerup',()=>dragging=false);
  root.querySelector('.ig3d-stage')?.addEventListener('pointercancel',()=>dragging=false);
  render();
})();

/* IGERS Satellite 3D laboratory controls */
(function(){
  'use strict';
  const root=document.getElementById('igxSatelliteLab');
  if(!root || root.dataset.ready==='1') return;
  root.dataset.ready='1';
  const model=root.querySelector('#satlabModel'), state=root.querySelector('#satlabState');
  const mode=root.querySelector('#satlabMode');
  let angle=0, deployed=false, orbiting=false;
  function render(){
    if(!model)return;
    model.style.transform=`translate(-50%,-50%) rotateX(15deg) rotateY(${angle}deg) rotateZ(-8deg)`;
    model.classList.toggle('deployed',deployed);
    root.classList.toggle('satlab-satellite-lab-orbiting',orbiting);
    if(state) state.textContent=orbiting?'ORBIT ANIMATION ACTIVE':(deployed?'SOLAR ARRAYS DEPLOYED':'SATELLITE READY');
    if(mode) mode.textContent=orbiting?'ORBIT MODE':(deployed?'DEPLOYED MODEL':'3D MODEL');
  }
  root.querySelector('#satlabRotate')?.addEventListener('click',()=>{angle=(angle+45)%360;render()});
  root.querySelector('#satlabPanels')?.addEventListener('click',e=>{deployed=!deployed;e.currentTarget.textContent=deployed?'RETRACT PANELS':'DEPLOY PANELS';render()});
  root.querySelector('#satlabOrbit')?.addEventListener('click',e=>{orbiting=!orbiting;e.currentTarget.textContent=orbiting?'STOP ORBIT':'ORBIT ANIMATION';render()});
  root.querySelector('#satlabReset')?.addEventListener('click',()=>{angle=0;deployed=false;orbiting=false;const b=root.querySelector('#satlabPanels'),o=root.querySelector('#satlabOrbit');if(b)b.textContent='DEPLOY PANELS';if(o)o.textContent='ORBIT ANIMATION';render()});
  let drag=false,last=0;
  const stage=root.querySelector('.satlab-space');
  stage?.addEventListener('pointerdown',e=>{drag=true;last=e.clientX;try{stage.setPointerCapture(e.pointerId)}catch(_){} });
  stage?.addEventListener('pointermove',e=>{if(!drag)return;angle=(angle+(e.clientX-last)*.55)%360;last=e.clientX;render()});
  stage?.addEventListener('pointerup',()=>drag=false);stage?.addEventListener('pointercancel',()=>drag=false);
  render();
})();
