/* IGERS-BD-01 thesis concept gallery + animated concept-flow overlay.
 * The moving paths are an illustrative simulation, never live sensor telemetry or measured power.
 * All visuals are local assets; no external runtime library is required.
 */
(() => {
  'use strict';
  const root = document.getElementById('thesisVisualLab');
  if (!root || root.dataset.initialized === '1') return;
  root.dataset.initialized = '1';

  const scenes = {
    integrated: {
      src: 'thesis-concept-integrated.svg', title: 'Integrated recovery ecosystem',
      label: 'MULTI-SOURCE · SHARED STORAGE', desc: 'Conceptual system architecture linking selected road, hydraulic and solar-support inputs through power conditioning to battery storage, monitoring and suitable local loads.',
      model: 'INTEGRATED CONCEPT', phases: ['SOURCE → RECOVERY', 'RECOVERY → CONVERSION', 'CONVERSION → CONDITIONING', 'CONDITIONING → STORAGE', 'STORAGE → LOCAL LOADS'],
      paths: [
        { p:[330,235,390,275,430,312,493,330], c:'#54ddff', n:4, o:0 },
        { p:[116,378,252,438,360,402,486,356], c:'#78efff', n:4, o:.19 },
        { p:[820,203,760,250,690,295,621,314], c:'#8af3bf', n:4, o:.37 },
        { p:[615,348,674,365,738,388,802,399], c:'#54ddff', n:4, o:.12 },
        { p:[906,349,936,303,969,223,978,133], c:'#8af3bf', n:3, o:.31 }
      ], nodes:[[330,235,'#54ddff'],[116,378,'#78efff'],[820,203,'#8af3bf'],[550,340,'#54ddff'],[820,399,'#8af3bf'],[978,133,'#8af3bf']]
    },
    road: {
      src: 'thesis-concept-road.svg', title: 'Transport and roadway recovery node',
      label: 'MECHANICAL INPUT · SITE-DEPENDENT', desc: 'Illustrates a possible mechanical recovery interface near controlled vehicle movement, followed by conditioning and local storage. A real device must avoid unacceptable traffic, structural or safety effects.',
      model: 'ROAD CONCEPT', phases: ['VEHICLE MOTION → RECOVERY', 'RECOVERY → GENERATOR', 'GENERATOR → CONDITIONER', 'CONDITIONER → STORAGE', 'STORAGE → LOCAL LOADS'],
      paths: [
        { p:[480,268,530,278,578,307,630,322], c:'#54ddff', n:5, o:0 },
        { p:[630,322,704,348,814,391,906,423], c:'#8af3bf', n:4, o:.24 },
        { p:[906,423,943,393,965,324,978,265], c:'#54ddff', n:4, o:.1 },
        { p:[972,257,838,292,502,500,205,291], c:'#8af3bf', n:4, o:.32 }
      ], nodes:[[480,268,'#54ddff'],[630,322,'#54ddff'],[906,423,'#8af3bf'],[978,265,'#54ddff'],[205,291,'#8af3bf']]
    },
    hydro: {
      src: 'thesis-concept-hydro.svg', title: 'Controlled hydraulic recovery node',
      label: 'FLOW + HEAD · CIVIL CHECK REQUIRED', desc: 'Illustrates flow/head-driven recovery through a rotor-generator concept. Available hydraulic energy, environmental effects, sediment, gate operation, civil loads and safe bypass must be assessed before real installation.',
      model: 'HYDRAULIC CONCEPT', phases: ['FLOW + HEAD → ROTOR', 'ROTOR → GENERATOR', 'GENERATOR → CONDITIONER', 'CONDITIONER → STORAGE', 'STORAGE → LOCAL LOADS'],
      paths: [
        { p:[190,264,293,285,410,325,514,315], c:'#54ddff', n:5, o:0 },
        { p:[514,315,548,304,574,309,610,326], c:'#78efff', n:4, o:.22 },
        { p:[610,326,690,352,798,408,910,432], c:'#8af3bf', n:4, o:.1 },
        { p:[910,432,938,397,953,330,968,263], c:'#54ddff', n:4, o:.3 },
        { p:[965,260,956,320,941,367,910,411], c:'#8af3bf', n:3, o:.41 }
      ], nodes:[[190,264,'#54ddff'],[514,315,'#78efff'],[610,326,'#8af3bf'],[910,432,'#54ddff'],[968,263,'#8af3bf']]
    },
    solar: {
      src: 'thesis-concept-solar.svg', title: 'Solar and airflow support node',
      label: 'PV SUPPORT · OPTIONAL AIRFLOW', desc: 'Illustrates a PV canopy and optional small airflow-recovery component feeding power conditioning, storage and low-power loads. Solar yield and airflow output are site-specific estimates, not measured data.',
      model: 'HYBRID CONCEPT', phases: ['SOLAR INPUT → PV', 'PV → CONDITIONER', 'AIRFLOW → OPTIONAL ROTOR', 'CONDITIONER → STORAGE', 'STORAGE → LOCAL LOADS'],
      paths: [
        { p:[365,263,408,305,464,379,510,430], c:'#8af3bf', n:5, o:0 },
        { p:[740,220,700,289,620,367,540,430], c:'#54ddff', n:4, o:.35 },
        { p:[540,430,628,427,727,415,842,422], c:'#54ddff', n:4, o:.12 },
        { p:[918,393,949,354,968,296,974,245], c:'#8af3bf', n:4, o:.31 }
      ], nodes:[[365,263,'#8af3bf'],[740,220,'#54ddff'],[510,430,'#54ddff'],[842,422,'#8af3bf'],[974,245,'#8af3bf']]
    },
    sluice: {
      src: 'thesis-concept-sluice-gate.jpg', kind: 'photo', title: 'Sluice-gate hydraulic energy recovery',
      label: 'WATER FLOW + LOW HEAD · CONCEPT', desc: 'Your sluice-gate concept image with an animated illustrative flow path from channel to rotor/generator. The downstream converter and battery indication are explanatory overlays; the image does not prove a measured output or a validated turbine design.',
      model: 'HYDRAULIC CONCEPT', phases: ['WATER FLOW → ROTOR', 'ROTOR → GENERATOR', 'GENERATOR → CONDITIONING', 'CONDITIONING → STORAGE', 'STORAGE → LOCAL LOAD'],
      paths: [
        { p:[920,285,820,296,690,309,520,318], c:'#54ddff', n:6, o:0 },
        { p:[520,318,490,282,465,235,470,165], c:'#78efff', n:5, o:.18 },
        { p:[470,165,522,155,580,186,635,219], c:'#8af3bf', n:4, o:.36 }
      ], nodes:[[920,285,'#54ddff'],[690,309,'#54ddff'],[520,318,'#78efff'],[470,165,'#8af3bf'],[635,219,'#8af3bf']]
    },
    roadharvest: {
      src: 'thesis-concept-road-harvester.jpg', kind: 'photo', title: 'Roadway kinetic energy-harvester concept',
      label: 'VEHICLE MOTION · CONCEPTUAL RECOVERY', desc: 'Your roadway image with animated paths illustrating vehicle-associated mechanical input and optional airflow/solar support converging at power electronics and storage. Actual recoverable energy depends on design, vehicle interaction, losses and safe road integration.',
      model: 'ROAD / KINETIC CONCEPT', phases: ['VEHICLE → RECOVERY INTERFACE', 'INTERFACE → GENERATOR', 'GENERATOR → CONDITIONING', 'CONDITIONING → STORAGE', 'STORAGE → LOCAL LOAD'],
      paths: [
        { p:[135,333,250,350,380,405,520,430], c:'#54ddff', n:5, o:0 },
        { p:[965,334,840,356,700,405,566,430], c:'#78efff', n:5, o:.22 },
        { p:[520,430,565,455,650,486,760,516], c:'#8af3bf', n:5, o:.12 },
        { p:[760,516,822,516,870,492,918,462], c:'#54ddff', n:4, o:.32 }
      ], nodes:[[135,333,'#54ddff'],[965,334,'#78efff'],[520,430,'#54ddff'],[760,516,'#8af3bf'],[918,462,'#8af3bf']]
    }
  };

  const image = root.querySelector('#thesisConceptVisual');
  const title = root.querySelector('#thesisConceptTitle');
  const desc = root.querySelector('#thesisConceptDescription');
  const label = root.querySelector('#thesisConceptSceneLabel');
  const model = root.querySelector('#thesisConceptModelTag');
  const imageStatus = root.querySelector('#thesisConceptStatus');
  const buttons = Array.from(root.querySelectorAll('[data-thesis-scene]'));
  const frame = root.querySelector('#thesisSceneVisualFrame');
  const canvas = root.querySelector('#thesisConceptEnergyCanvas');
  const toggle = root.querySelector('#thesisSimToggle');
  const reset = root.querySelector('#thesisSimReset');
  const speedSelect = root.querySelector('#thesisSimSpeed');
  const stateLabel = root.querySelector('#thesisSimStateLabel');
  const lamp = root.querySelector('#thesisSimLamp');
  const clockLabel = root.querySelector('#thesisSimClock');
  const phaseLabel = root.querySelector('#thesisSimActivePath');
  const rateLabel = root.querySelector('#thesisSimRate');
  const storageLabel = root.querySelector('#thesisSimStorage');
  const storageMeter = root.querySelector('#thesisSimStorageMeter');
  const storageBar = root.querySelector('#thesisSimStorageBar');
  const announcement = root.querySelector('#thesisSimAnnouncement');
  const ctx = canvas && canvas.getContext ? canvas.getContext('2d', { alpha: true }) : null;
  const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let selectedScene = 'integrated';
  let speed = 1;
  let playing = !reducedMotion;
  let elapsedMs = 0;
  let lastFrameMs = 0;
  let rafId = 0;
  let cssWidth = 0;
  let cssHeight = 0;
  let lastClockUpdate = 0;
  const CYCLE_MS = 15000;

  function announce(message) { if (announcement) announcement.textContent = message; }
  function updateControls() {
    if (toggle) {
      toggle.textContent = playing ? 'Pause animation' : 'Play animation';
      toggle.setAttribute('aria-pressed', String(playing));
    }
    if (stateLabel) stateLabel.textContent = playing ? 'SIMULATION RUNNING' : (reducedMotion && elapsedMs === 0 ? 'PAUSED · REDUCED MOTION' : 'SIMULATION PAUSED');
    if (lamp) lamp.classList.toggle('is-paused', !playing);
    if (rateLabel) rateLabel.textContent = speed.toFixed(speed % 1 ? 1 : 0) + '×';
  }
  function updateClock() {
    if (clockLabel) {
      const seconds = elapsedMs / 1000;
      const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
      const secs = (seconds % 60).toFixed(1).padStart(4, '0');
      clockLabel.textContent = `${mins}:${secs}`;
    }
    const scene = scenes[selectedScene];
    if (phaseLabel && scene) {
      const phaseIndex = Math.min(scene.phases.length - 1, Math.floor((elapsedMs % CYCLE_MS) / CYCLE_MS * scene.phases.length));
      phaseLabel.textContent = scene.phases[phaseIndex];
    }
    // This is a deterministic illustrative charge cycle, never measured battery telemetry.
    const simulatedStorage = Math.round(28 + 52 * (0.5 - 0.5 * Math.cos((elapsedMs / 24000) * Math.PI * 2)));
    if (storageLabel) storageLabel.textContent = `${simulatedStorage}% · SIMULATED`;
    if (storageBar) storageBar.style.width = `${simulatedStorage}%`;
    if (storageMeter) storageMeter.setAttribute('aria-valuenow', String(simulatedStorage));
  }
  function sizeCanvas() {
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) return;
    cssWidth = rect.width;
    cssHeight = rect.height;
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const width = Math.round(cssWidth * dpr);
    const height = Math.round(cssHeight * dpr);
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    ctx.setTransform(width / 1100, 0, 0, height / 620, 0, 0);
  }
  function bezier(path, t) {
    const [x0,y0,x1,y1,x2,y2,x3,y3] = path;
    const u = 1 - t;
    const uu = u * u, tt = t * t;
    return {
      x: uu*u*x0 + 3*uu*t*x1 + 3*u*tt*x2 + tt*t*x3,
      y: uu*u*y0 + 3*uu*t*y1 + 3*u*tt*y2 + tt*t*y3
    };
  }
  function drawScene() {
    if (!canvas || !ctx || cssWidth < 1 || cssHeight < 1) return;
    ctx.clearRect(0, 0, 1100, 620);
    const scene = scenes[selectedScene];
    if (!scene) return;
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    scene.paths.forEach((track, trackIndex) => {
      const p = track.p;
      ctx.beginPath();
      ctx.moveTo(p[0], p[1]);
      ctx.bezierCurveTo(p[2], p[3], p[4], p[5], p[6], p[7]);
      ctx.setLineDash([8, 10]);
      ctx.lineDashOffset = -(elapsedMs * 0.018 + trackIndex * 11);
      ctx.lineWidth = 2.2;
      ctx.strokeStyle = track.c;
      ctx.globalAlpha = 0.36;
      ctx.shadowColor = track.c;
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;
      const count = track.n || 4;
      const phase = ((elapsedMs / 4300) + track.o) % 1;
      for (let i = 0; i < count; i++) {
        const t = (phase + i / count) % 1;
        const pos = bezier(p, t);
        const tail = bezier(p, Math.max(0, t - 0.035));
        const alpha = 0.48 + 0.52 * Math.sin(Math.PI * t);
        const grad = ctx.createLinearGradient(tail.x, tail.y, pos.x, pos.y);
        grad.addColorStop(0, 'rgba(85,221,255,0)');
        grad.addColorStop(1, track.c);
        ctx.globalAlpha = alpha;
        ctx.lineWidth = 3.2;
        ctx.strokeStyle = grad;
        ctx.shadowBlur = 13;
        ctx.beginPath();
        ctx.moveTo(tail.x, tail.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 3.1 + 1.2 * (0.5 + 0.5 * Math.sin(elapsedMs / 190 + i)), 0, Math.PI * 2);
        ctx.fillStyle = '#e7fdff';
        ctx.shadowColor = track.c;
        ctx.shadowBlur = 16;
        ctx.fill();
      }
    });
    scene.nodes.forEach((node, i) => {
      const pulse = 5 + 2.4 * (0.5 + 0.5 * Math.sin(elapsedMs / 340 + i * 1.6));
      ctx.globalAlpha = 0.65;
      ctx.beginPath(); ctx.arc(node[0], node[1], pulse * 2.1, 0, Math.PI * 2);
      ctx.strokeStyle = node[2]; ctx.lineWidth = 1.4; ctx.shadowBlur = 12; ctx.shadowColor = node[2]; ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.beginPath(); ctx.arc(node[0], node[1], 3.2, 0, Math.PI * 2); ctx.fillStyle = '#efffff'; ctx.fill();
    });
    // A faint moving scan line reinforces the animated visualization without implying sensor readings.
    const scanY = (elapsedMs % 9000) / 9000 * 620;
    const scan = ctx.createLinearGradient(0, scanY - 18, 0, scanY + 18);
    scan.addColorStop(0, 'rgba(85,221,255,0)'); scan.addColorStop(.5, 'rgba(85,221,255,.10)'); scan.addColorStop(1, 'rgba(85,221,255,0)');
    ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = .75; ctx.fillStyle = scan; ctx.fillRect(0, scanY - 18, 1100, 36);
    ctx.restore();
    updateClock();
  }
  function frameLoop(timestamp) {
    rafId = 0;
    if (!playing || document.hidden) return;
    const dt = lastFrameMs ? Math.min(50, Math.max(0, timestamp - lastFrameMs)) : 16.67;
    lastFrameMs = timestamp;
    elapsedMs += dt * speed;
    sizeCanvas();
    drawScene();
    if (timestamp - lastClockUpdate > 1000) lastClockUpdate = timestamp;
    rafId = window.requestAnimationFrame(frameLoop);
  }
  function startLoop() {
    if (!playing || document.hidden || rafId || !ctx) return;
    lastFrameMs = 0;
    rafId = window.requestAnimationFrame(frameLoop);
  }
  function stopLoop() {
    if (rafId) window.cancelAnimationFrame(rafId);
    rafId = 0;
    lastFrameMs = 0;
  }
  function selectScene(key, focusButton = false) {
    const sceneKey = scenes[key] ? key : 'integrated';
    const item = scenes[sceneKey];
    selectedScene = sceneKey;
    buttons.forEach(button => {
      const selected = button.dataset.thesisScene === sceneKey;
      button.setAttribute('aria-pressed', String(selected));
      if (selected && focusButton) button.focus();
    });
    if (image) {
      image.onerror = () => {
        image.hidden = true;
        if (imageStatus) imageStatus.textContent = 'Concept image unavailable. The animated overlay is illustrative; keep all thesis-concept SVG/JPG assets beside index.html.';
      };
      image.onload = () => {
        image.hidden = false;
        if (imageStatus) imageStatus.textContent = 'Local concept illustration loaded · animated paths are illustrative only.';
      };
      image.src = item.src;
      image.alt = item.title + '. ' + item.desc;
    }
    if (title) title.textContent = item.title;
    if (desc) desc.textContent = item.desc;
    if (label) label.textContent = item.label;
    if (model) model.textContent = item.model;
    root.dataset.scene = sceneKey;
    elapsedMs = 0;
    // Recompute canvas dimensions immediately because the two supplied photo scenes use different aspect ratios.
    sizeCanvas();
    updateClock();
    drawScene();
    announce(`${item.title} selected. Animated concept flow only; no measured output.`);
  }

  buttons.forEach(button => button.addEventListener('click', () => selectScene(button.dataset.thesisScene)));
  root.addEventListener('keydown', event => {
    if (!['ArrowDown', 'ArrowUp'].includes(event.key)) return;
    const active = buttons.indexOf(document.activeElement);
    if (active < 0) return;
    event.preventDefault();
    const delta = event.key === 'ArrowDown' ? 1 : -1;
    const next = (active + delta + buttons.length) % buttons.length;
    selectScene(buttons[next].dataset.thesisScene, true);
  });
  if (toggle) toggle.addEventListener('click', () => {
    playing = !playing;
    updateControls();
    if (playing) startLoop(); else { stopLoop(); drawScene(); }
    announce(playing ? 'Concept simulation resumed.' : 'Concept simulation paused.');
  });
  if (reset) reset.addEventListener('click', () => {
    elapsedMs = 0;
    updateClock(); drawScene();
    announce('Simulation clock and animated paths reset. This is not a real-world sensor reset.');
  });
  if (speedSelect) speedSelect.addEventListener('change', () => {
    const value = Number(speedSelect.value);
    speed = Number.isFinite(value) && value >= 0.5 && value <= 2 ? value : 1;
    updateControls(); drawScene(); announce(`Illustration animation speed set to ${speed} times.`);
  });
  if (frame && window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches && !reducedMotion) {
    frame.addEventListener('pointermove', event => {
      const rect = frame.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      frame.style.setProperty('--thesis-tilt-x', `${(-y * 2.5).toFixed(2)}deg`);
      frame.style.setProperty('--thesis-tilt-y', `${(x * 2.5).toFixed(2)}deg`);
    });
    frame.addEventListener('pointerleave', () => {
      frame.style.setProperty('--thesis-tilt-x', '0deg');
      frame.style.setProperty('--thesis-tilt-y', '0deg');
    });
  }
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopLoop();
    else if (playing) startLoop();
  });
  window.addEventListener('resize', () => { sizeCanvas(); drawScene(); }, { passive: true });
  if (window.ResizeObserver && frame) new ResizeObserver(() => { sizeCanvas(); drawScene(); }).observe(frame);

  sizeCanvas();
  updateControls();
  updateClock();
  selectScene('integrated');
  if (!ctx) {
    if (imageStatus) imageStatus.textContent = 'Canvas animation is unavailable in this browser; static concept illustration remains available.';
    if (toggle) { toggle.disabled = true; toggle.textContent = 'Animation unsupported'; }
    if (stateLabel) stateLabel.textContent = 'STATIC CONCEPT VIEW';
  } else if (playing) startLoop();
  else drawScene();
})();
