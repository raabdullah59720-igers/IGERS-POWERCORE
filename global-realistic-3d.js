/* IGERS POWERCORE — lightweight global 3D scene, no external dependency */
(function(){
  'use strict';
  const canvas=document.getElementById('global3DCanvas');
  if(!canvas) return;
  const ctx=canvas.getContext('2d',{alpha:true});
  if(!ctx) return;
  const motionOK=()=>!(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  let W=0,H=0,D=1,raf=0,t0=performance.now();
  const stars=Array.from({length:90},()=>({x:Math.random(),y:Math.random(),z:Math.random(),s:.4+Math.random()*1.8,p:.2+Math.random()}));
  function resize(){D=Math.min(2,window.devicePixelRatio||1);W=window.innerWidth;H=window.innerHeight;canvas.width=Math.round(W*D);canvas.height=Math.round(H*D);canvas.style.width=W+'px';canvas.style.height=H+'px';ctx.setTransform(D,0,0,D,0,0);}
  function draw(now){
    if(!canvas.isConnected)return;
    const tm=(now-t0)/1000, night=document.body?.dataset?.theme!=='day';
    const bg=night?'rgba(4,8,12,.18)':'rgba(241,247,249,.11)'; ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
    const horizon=H*.62;
    const glow=ctx.createRadialGradient(W*.5,horizon,0,W*.5,horizon,Math.min(W,H)*.62);
    if(night){glow.addColorStop(0,'rgba(85,221,255,.10)');glow.addColorStop(.45,'rgba(26,101,125,.05)');glow.addColorStop(1,'rgba(0,0,0,0)');}
    else{glow.addColorStop(0,'rgba(0,127,156,.06)');glow.addColorStop(.5,'rgba(0,127,156,.025)');glow.addColorStop(1,'rgba(0,0,0,0)');}
    ctx.fillStyle=glow;ctx.fillRect(0,0,W,H);
    // perspective floor grid
    ctx.lineWidth=1;ctx.strokeStyle=night?'rgba(85,221,255,.095)':'rgba(0,110,140,.08)';
    for(let i=0;i<15;i++){let y=horizon+Math.pow(i/14,1.85)*(H-horizon+40);ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
    const center=W*.5;
    for(let i=-18;i<=18;i++){ctx.beginPath();ctx.moveTo(center+i*18,horizon);ctx.lineTo(center+i*92,H+20);ctx.stroke();}
    // orbital arcs
    ctx.save();ctx.translate(W*.5,H*.37);ctx.rotate(Math.sin(tm*.16)*.08);
    for(let k=0;k<4;k++){ctx.beginPath();ctx.ellipse(0,0,Math.min(W,H)*(.18+k*.045),Math.min(W,H)*(.055+k*.016),k*.14,0,Math.PI*2);ctx.strokeStyle=night?'rgba(138,243,191,.055)':'rgba(0,127,156,.055)';ctx.stroke();}
    ctx.restore();
    // depth stars / data particles
    for(const s of stars){const q=(s.z+(tm*.018*s.p))%1;const scale=.25+q*1.5;const x=(s.x-.5)*W*scale+W*.5;const y=(s.y-.5)*H*scale+H*.5;if(x<-10||x>W+10||y<-10||y>H+10)continue;ctx.beginPath();ctx.arc(x,y,s.s*(.45+q),0,Math.PI*2);ctx.fillStyle=night?'rgba(210,245,255,.33)':'rgba(24,83,102,.16)';ctx.fill();}
    // central horizon line
    ctx.strokeStyle=night?'rgba(85,221,255,.16)':'rgba(0,127,156,.10)';ctx.beginPath();ctx.moveTo(0,horizon);ctx.lineTo(W,horizon);ctx.stroke();
    if(motionOK()) raf=requestAnimationFrame(draw);
  }
  resize();window.addEventListener('resize',resize,{passive:true});window.addEventListener('igers:themechange',()=>{ctx.clearRect(0,0,W,H);});
  draw(t0);
})();
