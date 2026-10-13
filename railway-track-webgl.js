/* IGERS-BD-01 Railway Live 3D WebGL Scene
 * Self-contained WebGL 1 scene: no CDN, no model download, no external dependency.
 * All motion is conceptual/simulated; never operational railway telemetry.
 */
(function () {
  'use strict';
  if (window.__igersRailwayWebGLV1) return;
  window.__igersRailwayWebGLV1 = true;

  const canvas = document.getElementById('rteRailWebglCanvas');
  const stage = canvas && canvas.closest('.rte-stage');
  const fallback = document.getElementById('rteRailCanvas');
  if (!canvas || !stage) return;

  let gl = null;
  try {
    gl = canvas.getContext('webgl', { alpha: true, antialias: true, powerPreference: 'high-performance' }) ||
         canvas.getContext('experimental-webgl', { alpha: true, antialias: true });
  } catch (_) { gl = null; }
  if (!gl) {
    const status = document.getElementById('rteSimStatus');
    if (status) status.textContent = '2D FALLBACK · WEBGL UNAVAILABLE';
    return;
  }

  const VS = `
    attribute vec3 aPosition;
    attribute vec3 aNormal;
    attribute vec4 aColor;
    uniform mat4 uMvp;
    varying vec3 vNormal;
    varying vec4 vColor;
    void main(){ gl_Position=uMvp*vec4(aPosition,1.0); vNormal=aNormal; vColor=aColor; }
  `;
  const FS = `
    precision mediump float;
    varying vec3 vNormal;
    varying vec4 vColor;
    uniform vec3 uLightDir;
    void main(){
      float diffuse=max(dot(normalize(vNormal),normalize(uLightDir)),0.0);
      float light=0.38+0.72*diffuse;
      vec3 color=vColor.rgb*light + vColor.rgb*vColor.a*0.85;
      gl_FragColor=vec4(color,1.0);
    }
  `;
  function compile(type, source) {
    const shader = gl.createShader(type); gl.shaderSource(shader, source); gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const error = gl.getShaderInfoLog(shader); gl.deleteShader(shader); throw new Error(error || 'Shader compile error');
    }
    return shader;
  }
  let program;
  try {
    program = gl.createProgram();
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VS));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) || 'WebGL program link error');
  } catch (error) {
    const status = document.getElementById('rteSimStatus');
    if (status) status.textContent = '2D FALLBACK · WEBGL INIT ERROR';
    console.warn('[IGERS railway WebGL]', error);
    return;
  }

  const aPosition = gl.getAttribLocation(program, 'aPosition');
  const aNormal = gl.getAttribLocation(program, 'aNormal');
  const aColor = gl.getAttribLocation(program, 'aColor');
  const uMvp = gl.getUniformLocation(program, 'uMvp');
  const uLightDir = gl.getUniformLocation(program, 'uLightDir');
  const buffer = gl.createBuffer();
  const padPixelLocations = [-230, -101, 28, 157];
  const padXs = padPixelLocations.map(x => x / 120);
  const TRACK_END = 10.5;
  let width = 900, height = 440, raf = 0, disposed = false, renderErrorShown = false;
  let inViewport = typeof IntersectionObserver !== 'function';
  let observer = null;
  let lastState = { trainX: 0, distanceTravelled: 0, elapsed: 0, padIntensities: [0,0,0,0], activePadCount: 0, slipRatio: .01, forceKn: 6, powerKw: 1.2, speedKph: 72, compressionMm: 2, physicsInputsValid: true };
  let cameraYaw = 0.275, cameraPitch = 0.39, cameraDistance = 15.1, dragPoint = null;

  function vecNorm(v) { const d = Math.hypot(v[0],v[1],v[2]) || 1; return [v[0]/d,v[1]/d,v[2]/d]; }
  function sub(a,b){return [a[0]-b[0],a[1]-b[1],a[2]-b[2]];}
  function dot(a,b){return a[0]*b[0]+a[1]*b[1]+a[2]*b[2];}
  function cross(a,b){return [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];}
  function perspective(fovy, aspect, near, far) {
    const f=1/Math.tan(fovy/2), nf=1/(near-far), o=new Float32Array(16);
    o[0]=f/aspect; o[5]=f; o[10]=(far+near)*nf; o[11]=-1; o[14]=2*far*near*nf; return o;
  }
  function lookAt(eye, center, up) {
    const z=vecNorm(sub(eye,center)), x=vecNorm(cross(up,z)), y=cross(z,x), o=new Float32Array(16);
    o[0]=x[0];o[1]=y[0];o[2]=z[0];o[3]=0;
    o[4]=x[1];o[5]=y[1];o[6]=z[1];o[7]=0;
    o[8]=x[2];o[9]=y[2];o[10]=z[2];o[11]=0;
    o[12]=-dot(x,eye);o[13]=-dot(y,eye);o[14]=-dot(z,eye);o[15]=1;return o;
  }
  function multiply(a,b) {
    const o=new Float32Array(16);
    for(let c=0;c<4;c++) for(let r=0;r<4;r++) o[c*4+r]=a[r]*b[c*4]+a[4+r]*b[c*4+1]+a[8+r]*b[c*4+2]+a[12+r]*b[c*4+3];
    return o;
  }
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  function hexColor(hex, glow=0) {
    const h=hex.replace('#',''); return [parseInt(h.slice(0,2),16)/255,parseInt(h.slice(2,4),16)/255,parseInt(h.slice(4,6),16)/255,glow];
  }
  function mixColor(base, factor, glow=0) { return [clamp(base[0]*factor,0,1),clamp(base[1]*factor,0,1),clamp(base[2]*factor,0,1),glow]; }

  // Per-frame dynamic mesh builder. Vertices are already in world coordinates.
  let vertices=[];
  function triangle(p1,p2,p3,n,color) {
    for (const p of [p1,p2,p3]) vertices.push(p[0],p[1],p[2],n[0],n[1],n[2],color[0],color[1],color[2],color[3]);
  }
  function quad(p1,p2,p3,p4,n,color) { triangle(p1,p2,p3,n,color); triangle(p1,p3,p4,n,color); }
  function rotatePoint(x,y,z,cx,cy,cz,rz=0) {
    const co=Math.cos(rz), si=Math.sin(rz); return [cx+x*co-y*si,cy+x*si+y*co,cz+z];
  }
  function box(x,y,z,sx,sy,sz,color,rz=0,glow=0) {
    const c=Array.isArray(color)?color:hexColor(color,glow), hx=sx/2,hy=sy/2,hz=sz/2;
    const p=(a,b,d)=>rotatePoint(a,b,d,x,y,z,rz);
    const faces=[
      {v:[p(-hx,hy,-hz),p(hx,hy,-hz),p(hx,hy,hz),p(-hx,hy,hz)],n:[0,1,0],f:1.18},
      {v:[p(-hx,-hy,hz),p(hx,-hy,hz),p(hx,hy,hz),p(-hx,hy,hz)],n:[0,0,1],f:.88},
      {v:[p(hx,-hy,-hz),p(-hx,-hy,-hz),p(-hx,hy,-hz),p(hx,hy,-hz)],n:[0,0,-1],f:.53},
      {v:[p(-hx,-hy,-hz),p(-hx,-hy,hz),p(-hx,hy,hz),p(-hx,hy,-hz)],n:[-1,0,0],f:.66},
      {v:[p(hx,-hy,hz),p(hx,-hy,-hz),p(hx,hy,-hz),p(hx,hy,hz)],n:[1,0,0],f:.76},
      {v:[p(-hx,-hy,-hz),p(hx,-hy,-hz),p(hx,-hy,hz),p(-hx,-hy,hz)],n:[0,-1,0],f:.45}
    ];
    faces.forEach(face=>quad(...face.v,face.n,mixColor(c,face.f, c[3]||glow)));
  }
  function cylinderZ(x,y,z,r,depth,color,rotation=0,glow=0,segments=22) {
    const c=Array.isArray(color)?color:hexColor(color,glow), z0=z-depth/2,z1=z+depth/2;
    for(let i=0;i<segments;i++){
      const a=rotation+i/segments*Math.PI*2,b=rotation+(i+1)/segments*Math.PI*2;
      const p0=[x+Math.cos(a)*r,y+Math.sin(a)*r,z0],p1=[x+Math.cos(b)*r,y+Math.sin(b)*r,z0];
      const q0=[p0[0],p0[1],z1],q1=[p1[0],p1[1],z1];
      const n=vecNorm([Math.cos((a+b)/2),Math.sin((a+b)/2),0]);
      quad(p0,p1,q1,q0,n,mixColor(c,.72,c[3]||glow));
      triangle([x,y,z0],p1,p0,[0,0,-1],mixColor(c,.52,c[3]||glow));
      triangle([x,y,z1],q0,q1,[0,0,1],mixColor(c,1.18,c[3]||glow));
    }
  }
  function sphereLike(x,y,z,size,color,glow=0) { box(x,y,z,size,size,size,color,0,glow); }
  function wireTap(x,z1,z2,color='#286d73') { box(x,-.103,(z1+z2)/2,.034,.027,Math.abs(z2-z1),color,0,.12); }
  function wheel(x,z,angle) {
    const y=.332, r=.185;
    cylinderZ(x,y,z,r,.105,'#243943',angle,.04,26);
    cylinderZ(x,y,z+Math.sign(z)*.055,r*.79,.012,'#98b3bd',angle,.05,24);
    cylinderZ(x,y,z+Math.sign(z)*.063,r*.37,.016,'#344f5c',angle,.08,20);
    // Spokes are intentionally visible on the near (camera-facing) wheel face.
    const faceZ=z+Math.sign(z)*.073;
    for(let s=0;s<4;s++) box(x,y,faceZ,.205,.022,.009,'#c4d9df',angle+s*Math.PI/2,.02);
    cylinderZ(x,y,z+Math.sign(z)*.081,.035,.012,'#d7eef3',angle,.05,16);
  }
  function addTrain(trainX, travelled) {
    const rotation=travelled*(4.8/42);
    const coachPalette=[['#b84451','#f0818a'],['#147d70','#51ddc0'],['#316cb3','#75bfff']];
    // Three separate passenger coaches, with glass, end doors and bogies.
    const offsets=[-1.25,-2.50,-3.75];
    offsets.forEach((off,i)=>{
      const x=trainX+off, c=coachPalette[i];
      box(x,.76,0,.98,.48,.72,c[0]);
      box(x,.53,0,.97,.055,.73,'#273a46');
      box(x,1.015,0,.96,.035,.74,'#203743');
      box(x,.88,.372,.78,.22,.014,'#b5ecf4',0,.08);
      box(x,.88,-.372,.78,.22,.014,'#7dbed1',0,.06);
      for(let k=0;k<4;k++){
        const wx=x-.32+k*.21;
        box(wx,.81,.381,.10,.12,.014,'#123447',0,.05);
        box(wx,.81,-.381,.10,.12,.014,'#102e40');
      }
      box(x+.39,.69,.384,.09,.16,.018,'#f3b55f');
      [-.34,.34].forEach(dx=>[-.54,.54].forEach(z=>wheel(x+dx,z,rotation+dx*3)));
    });
    // Locomotive underframe and deep-blue/teal livery.
    box(trainX,.78,0,1.65,.46,.82,'#116e88');
    box(trainX-.02,1.035,0,1.58,.055,.80,'#1da7bf',0,.05);
    box(trainX+.43,1.13,0,.65,.42,.78,'#f0a13c');
    box(trainX+.43,1.15,.402,.46,.25,.018,'#bcecf5',0,.12);
    box(trainX+.43,1.15,-.402,.46,.25,.018,'#8fd3e3',0,.06);
    box(trainX+.88,.77,0,.30,.31,.82,'#e66b36');
    box(trainX+1.03,.78,.0,.08,.25,.74,'#ffc85d',0,.06);
    // Roof equipment, headlights and front grille.
    box(trainX-.10,1.30,0,.35,.08,.42,'#c7d6db');
    box(trainX+.22,1.29,0,.17,.07,.38,'#4a6775');
    box(trainX+1.04,.84,.32,.035,.08,.10,'#fff2b5',0,.75);
    box(trainX+1.04,.84,-.32,.035,.08,.10,'#fff2b5',0,.75);
    for(let k=0;k<5;k++) box(trainX+.78+k*.035,.69,.42,.014,.12,.012,'#583d37');
    [-49/120,-16/120,18/120,53/120].forEach(dx=>[-.55,.55].forEach(z=>wheel(trainX+dx,z,rotation+dx*2)));
    // Couplers between cars and locomotive.
    [-.68,-1.88,-3.13].forEach(off=>box(trainX+off,.54,0,.19,.055,.08,'#9aaeb7'));
  }
  function makeScene(state) {
    vertices=[];
    // Ballast/foundation slab.
    box(0,-.245,0,21.4,.20,2.72,'#182a35');
    box(0,-.135,0,21.0,.045,2.46,'#243a45');
    // Small ballast blocks along both shoulders give the roadbed actual depth.
    for(let i=0;i<74;i++){
      const x=-10.4+i*.285;
      box(x,-.105, i%2?1.17:-1.17,.20,.07,.22,i%3?'#48555a':'#59656a');
    }
    // Position of the four real conceptual energy pads is below selected sleepers.
    const active=state.padIntensities||[0,0,0,0];
    const sleeperXs=[];
    for(let x=-10.2;x<=10.2;x+=.55) sleeperXs.push(Number(x.toFixed(2)));
    padXs.forEach(x=>{if(!sleeperXs.some(s=>Math.abs(s-x)<.19)) sleeperXs.push(x);});
    sleeperXs.sort((a,b)=>a-b);
    // Sleepers cross beneath both rails; selected sleeper zones visibly sag slightly as pad compresses.
    sleeperXs.forEach(x=>{
      let load=0; padXs.forEach((px,i)=>{if(Math.abs(px-x)<.05) load=active[i]||0;});
      box(x,-.062-load*.012,0,.19,.135,1.68,load>.08?'#665f52':'#4a5559');
      box(x,-.012-load*.012,0,.16,.019,1.62,load>.08?'#b1a88f':'#687b82');
      if(load>.08) box(x,-.126,0,.205,.024,1.52,'#7bffe8',0,.52*load);
    });
    // Two steel rails: dark web, polished head and bright running surface.
    [-.55,.55].forEach(z=>{
      box(0,.058,z,21.0,.105,.145,'#526977');
      box(0,.121,z,21.0,.035,.18,'#b3c6cd');
      box(0,.141,z,21.0,.012,.128,'#e5f1f4',0,.02);
      // Repeating steel joints/clip fasteners help the track read like a real assembly.
      sleeperXs.forEach(x=>{
        box(x,.092,z-.135,.075,.025,.055,'#92a7ae');
        box(x,.092,z+.135,.075,.025,.055,'#92a7ae');
      });
    });
    // Harvest transducers underneath the pad sleepers: compressed height shrinks toward the underside.
    padXs.forEach((x,i)=>{
      const a=clamp(active[i]||0,0,1);
      const compression=(state.physicsInputsValid===false?0:(state.compressionMm||2))*a;
      const squash=clamp(compression*.012,0,.075);
      const h=.095-squash;
      const padTop=-.1295-a*.012; // exactly follows the loaded sleeper underside
      const y=padTop-h/2; // preserve physical contact as the pad compresses
      const bodyColor=a>.08?'#18b9a5':'#b7833a';
      box(x,y,0,.34,h,1.34,bodyColor,0,a>.08?.55:.02);
      // Visible near-side indicator lip, so the under-sleeper pad is still readable from the camera.
      box(x,y,.69,.30,Math.max(.025,h*.45),.08,a>.08?'#5cffe8':'#f1b65e',0,a>.08?.85:.04);
      if(a>.05){
        box(x,-.215,0,.23,.018,1.05,'#94fff0',0,.95*a);
        for(let k=0;k<2;k++) box(x+(k?1:-1)*.06,-.205,.83,.025,.025,.025,'#e9fff9',0,1.2*a);
      }
    });
    // Track-side cable harness, DC conditioner and storage bank.
    box(1.75,-.13,1.10,7.6,.035,.035,'#126c70',0,.12);
    padXs.forEach(x=>wireTap(x,.72,1.10,'#217b7b'));
    box(6.0,.24,1.50,.82,.72,.64,'#245164');
    box(5.99,.65,1.50,.74,.15,.60,'#3a8193');
    box(6.0,.28,1.837,.43,.36,.026,'#102f3d');
    box(6.0,.31,1.86,.34,.22,.018,'#45e0c8',0,.15);
    box(7.15,.20,1.47,.86,.60,.82,'#193a4d');
    for(let b=0;b<3;b++){
      const bx=6.84+b*.30;
      box(bx,.56,1.47,.22,.08,.68,'#73929e');
      box(bx,.23,1.90,.17,.36,.025,b%2?'#49d4bb':'#64b5e6',0,.08);
      box(bx,.22,1.922,.09,.20,.01,'#e2fbff',0,.08);
    }
    // Live cyan energy packets travel from any loaded pad toward the storage converter.
    // Mechanical pad compression remains visible even if the calculator inputs are invalid,
    // but electrical energy packets must stop until the energy assumptions are valid again.
    const electricalOutputValid = state.energyInputsValid !== false;
    const anyActive=electricalOutputValid && active.some(a=>a>.06);
    if(anyActive){
      padXs.forEach((x,i)=>{
        const intensity=electricalOutputValid ? (active[i]||0) : 0; if(intensity<.06)return;
        for(let k=0;k<3;k++){
          const t=((state.elapsed*.62+k/3+i*.13)%1);
          const px=x+(6.0-x)*t;
          sphereLike(px,-.105,1.10,.075,intensity>.4?'#b5fff7':'#4de0d1',.9*intensity);
        }
      });
    }
    // Wayside rail sensor and a small telemetry mast.
    box(8.32,.10,1.48,.50,.40,.46,'#244a61');
    box(8.32,.36,1.48,.34,.09,.32,'#5ba6c4');
    box(8.32,.51,1.48,.035,.24,.035,'#83dcf1');
    box(8.32,.64,1.48,.12,.025,.12,'#5fe3d3',0,.3);

    const trainX=(Number.isFinite(state.trainX)?state.trainX:0)/120;
    addTrain(trainX, state.distanceTravelled||0);
    // Friction/heat is deliberately separate from harvested energy.
    const slip=state.physicsInputsValid===false?0:(state.slipRatio||0);
    const force=state.physicsInputsValid===false?0:(state.forceKn||0);
    const heat=clamp(.18+((state.powerKw||0)/8),0,.95);
    if(slip>0 && force>0){
      const contactXs=[trainX-49/120,trainX-16/120,trainX+18/120,trainX+53/120];
      contactXs.forEach((x,idx)=>[-.55,.55].forEach((z,zi)=>{
        box(x,.145,z,.17,.018,.19,'#f34b32',0,heat*.65);
        for(let p=0;p<2;p++){
          const q=((state.elapsed*7+p*.47+idx*.19+zi*.31)%1);
          box(x+.025+q*.12,.17+q*.08,z+(p?-.045:.045),.025,.025,.025,p?'#ff8045':'#ffe4a0',0,.85*heat);
        }
      }));
    }
  }

  function drawLabelOverlay() {
    // Lightweight scene annotations live in HTML so all labels stay crisp at any zoom.
    let overlay=document.getElementById('rteWebglLegend');
    if(!overlay){
      overlay=document.createElement('div'); overlay.id='rteWebglLegend'; overlay.className='rte-webgl-legend';
      overlay.innerHTML='<span><i class="rte-legend-train"></i>COLOURED TRAIN</span><span><i class="rte-legend-pad"></i>UNDER-SLEEPER ENERGY PAD</span><span><i class="rte-legend-flow"></i>ENERGY → STORAGE</span><span><i class="rte-legend-heat"></i>WHEEL / RAIL HEAT LOSS</span><span><i class="rte-legend-view"></i>DRAG TO ROTATE 3D VIEW</span>';
      stage.appendChild(overlay);
    }
  }
  function resize() {
    const rect=stage.getBoundingClientRect();
    if(rect.width<2)return;
    width=rect.width; height=rect.height||440;
    const dpr=Math.min(window.devicePixelRatio||1,2);
    const targetW=Math.max(1,Math.round(width*dpr)), targetH=Math.max(1,Math.round(height*dpr));
    if(canvas.width!==targetW || canvas.height!==targetH){ canvas.width=targetW; canvas.height=targetH; }
    gl.viewport(0,0,canvas.width,canvas.height);
  }
  function stageVisible() {
    if (document.visibilityState === 'hidden') return false;
    if (observer) return inViewport;
    const rect=stage.getBoundingClientRect();
    return rect.width>1 && rect.height>1;
  }
  function scheduleFrame() {
    if (!disposed && !raf && stageVisible()) raf=window.requestAnimationFrame(frame);
  }
  function frame() {
    raf=0;
    if(disposed || !stageVisible()) return;
    const state=window.__igersRailwayVisualState;
    if(state) lastState={...lastState,...state};
    try {
      resize(); vertices=[]; makeScene(lastState);
      const data=new Float32Array(vertices);
      gl.viewport(0,0,canvas.width,canvas.height);
      gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LEQUAL); gl.disable(gl.CULL_FACE);
      gl.clearColor(.018,.052,.075,0); gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
      gl.useProgram(program); gl.bindBuffer(gl.ARRAY_BUFFER,buffer); gl.bufferData(gl.ARRAY_BUFFER,data,gl.DYNAMIC_DRAW);
      const stride=10*4;
      gl.enableVertexAttribArray(aPosition);gl.vertexAttribPointer(aPosition,3,gl.FLOAT,false,stride,0);
      gl.enableVertexAttribArray(aNormal);gl.vertexAttribPointer(aNormal,3,gl.FLOAT,false,stride,3*4);
      gl.enableVertexAttribArray(aColor);gl.vertexAttribPointer(aColor,4,gl.FLOAT,false,stride,6*4);
      const aspect=Math.max(.5,canvas.width/canvas.height);
      const proj=perspective(47*Math.PI/180,aspect,.1,80);
      const horizontal=cameraDistance*Math.cos(cameraPitch);
      const eye=[Math.sin(cameraYaw)*horizontal, .22+cameraDistance*Math.sin(cameraPitch), Math.cos(cameraYaw)*horizontal];
      const view=lookAt(eye,[0,.22,0],[0,1,0]);
      gl.uniformMatrix4fv(uMvp,false,multiply(proj,view));
      gl.uniform3f(uLightDir,-.35,.88,.55);
      gl.drawArrays(gl.TRIANGLES,0,data.length/10);
      if(!stage.classList.contains('rte-webgl-enabled')){
        stage.classList.add('rte-webgl-enabled');
        if(fallback) fallback.style.display='none';
        canvas.style.display='block';
        drawLabelOverlay();
        const tag=stage.parentElement && stage.parentElement.querySelector('.rte-card-top .rte-tag');
        if(tag) tag.textContent='LIVE WEBGL · 3D CONCEPT';
        const status=document.getElementById('rteSimStatus');
        if(status)status.textContent=lastState.animating===false?'3D WEBGL DEMO PAUSED':'3D WEBGL DEMO RUNNING';
      }
    } catch(error) {
      if(!renderErrorShown){console.warn('[IGERS Railway WebGL render]',error);renderErrorShown=true;}
      // Stop retrying a broken GPU path every animation frame; the canvas fallback remains active.
      disposed=true;
      if(raf)window.cancelAnimationFrame(raf);raf=0;
      if(fallback)fallback.style.display='block';
      canvas.style.display='none';stage.classList.remove('rte-webgl-enabled');
      const status=document.getElementById('rteSimStatus');if(status)status.textContent='2D FALLBACK · 3D RENDER ERROR';
      return;
    }
    // Continuous GPU rendering is needed only while visible and animating. Paused panels draw on changes.
    if(lastState.animating!==false) raf=window.requestAnimationFrame(frame);
  }
  canvas.addEventListener('webglcontextlost',event=>{
    event.preventDefault();disposed=true;if(raf)window.cancelAnimationFrame(raf);raf=0;
    if(fallback)fallback.style.display='block';canvas.style.display='none';stage.classList.remove('rte-webgl-enabled');
    const status=document.getElementById('rteSimStatus');if(status)status.textContent='2D FALLBACK · WEBGL CONTEXT LOST';
  });
  window.addEventListener('resize',()=>{resize();scheduleFrame();},{passive:true});
  window.addEventListener('igers:railway-statechange',()=>{
    const state=window.__igersRailwayVisualState; if(state) lastState={...lastState,...state};
    scheduleFrame();
  });
  document.addEventListener('visibilitychange',()=>{
    if(document.visibilityState==='hidden'){if(raf)window.cancelAnimationFrame(raf);raf=0;}
    else scheduleFrame();
  });
  if(typeof IntersectionObserver==='function') {
    observer=new IntersectionObserver(entries=>{
      const entry=entries[entries.length-1]; inViewport=Boolean(entry&&entry.isIntersecting);
      if(inViewport){resize();scheduleFrame();}
      else if(raf){window.cancelAnimationFrame(raf);raf=0;}
    },{threshold:0.01});
    observer.observe(stage);
  }
  canvas.tabIndex = 0;
  canvas.style.cursor = 'grab';
  canvas.addEventListener('pointerdown', event => {
    dragPoint={x:event.clientX,y:event.clientY,id:event.pointerId};
    try { canvas.setPointerCapture(event.pointerId); } catch (_) {}
    canvas.style.cursor='grabbing';
  });
  canvas.addEventListener('pointermove', event => {
    if(!dragPoint || dragPoint.id!==event.pointerId)return;
    const dx=event.clientX-dragPoint.x, dy=event.clientY-dragPoint.y;
    dragPoint={x:event.clientX,y:event.clientY,id:event.pointerId};
    cameraYaw-=dx*.008; cameraPitch=clamp(cameraPitch+dy*.005,.18,1.05); scheduleFrame();
  });
  const releaseDrag=()=>{dragPoint=null;canvas.style.cursor='grab';};
  canvas.addEventListener('pointerup',releaseDrag);canvas.addEventListener('pointercancel',releaseDrag);canvas.addEventListener('lostpointercapture',releaseDrag);
  canvas.addEventListener('keydown',event=>{
    const step=.08;
    if(event.key==='ArrowLeft'){cameraYaw-=step;event.preventDefault();}
    else if(event.key==='ArrowRight'){cameraYaw+=step;event.preventDefault();}
    else if(event.key==='ArrowUp'){cameraPitch=clamp(cameraPitch-.05,.18,1.05);event.preventDefault();}
    else if(event.key==='ArrowDown'){cameraPitch=clamp(cameraPitch+.05,.18,1.05);event.preventDefault();}
    scheduleFrame();
  });
  resize();
  scheduleFrame();
})();
