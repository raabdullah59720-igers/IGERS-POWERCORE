
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
