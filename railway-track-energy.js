/* IGERS-BD-01 · Railway Track Energy Recovery concept module.
 * Canvas is an illustrative browser simulation; the calculator uses explicit user assumptions.
 * It is not connected to railway telemetry and must not be used for operational rail decisions.
 */
(function () {
  'use strict';
  if (window.__igersRailwayTrackEnergyV1) return;
  window.__igersRailwayTrackEnergyV1 = true;

  const root = document.getElementById('railwayEnergy3d');
  const canvas = document.getElementById('rteRailCanvas');
  if (!root || !canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    const status = document.getElementById('rteSimStatus');
    if (status) status.textContent = 'CANVAS UNAVAILABLE';
    return;
  }

  const byId = (id) => document.getElementById(id);
  const fieldIds = ['rteWhPerPass', 'rteEfficiency', 'rteAvailability', 'rtePassesDay', 'rteOperatingDays', 'rteModules', 'rteLoadW', 'rteBatteryKwh', 'rteBatteryDod', 'rteBatteryEfficiency'];
  let width = 800, height = 380, dpr = 1, frame = 0, elapsed = 0, lastStamp = 0, playing = true;
  let reducedMotion = false;
  try { reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (_) {}

  function val(id, min, max) {
    const el = byId(id);
    if (!el || String(el.value).trim() === '') return null;
    const n = Number(el.value);
    if (!Number.isFinite(n) || n < min || n > max) return null;
    return n;
  }
  function fmt(n, maxDigits = 1) {
    if (!Number.isFinite(n)) return '—';
    return n.toLocaleString(undefined, { maximumFractionDigits: maxDigits, minimumFractionDigits: 0 });
  }
  function put(id, value) { const el = byId(id); if (el) el.textContent = value; }
  function recalculate() {
    const specs = {
      rteWhPerPass: [0, 1000000], rteEfficiency: [0, 100], rteAvailability: [0, 100],
      rtePassesDay: [0, 10000], rteOperatingDays: [0, 365], rteModules: [1, 1000],
      rteLoadW: [0.1, 100000], rteBatteryKwh: [0, 1000000], rteBatteryDod: [0, 100], rteBatteryEfficiency: [0, 100]
    };
    const inputs = {};
    let valid = true;
    for (const [id, [min, max]] of Object.entries(specs)) {
      const el = byId(id);
      const n = val(id, min, max);
      inputs[id] = n;
      const isValid = n !== null && (id !== 'rtePassesDay' || Number.isInteger(n)) && (id !== 'rteOperatingDays' || Number.isInteger(n)) && (id !== 'rteModules' || Number.isInteger(n));
      if (el) {
        el.setAttribute('aria-invalid', String(!isValid));
        el.classList.toggle('rte-invalid', !isValid);
      }
      if (!isValid) valid = false;
    }
    if (!valid) {
      ['rteMetricPass','rteMetricDay','rteMetricYear','rteMetricAverage','rteMetricDeviceHours','rteMetricBatteryHours'].forEach(id => put(id, 'CHECK INPUT'));
      put('rteFormulaDaily', 'Enter values inside the shown limits; passages, operating days and module count must be whole numbers.');
      put('rteFormulaAnnual', 'No result calculated until all inputs are valid.');
      put('rteResultNote', 'One or more inputs are blank or outside the accepted range. Correct highlighted fields to recalculate.');
      return;
    }
    const wh = inputs.rteWhPerPass;
    const eff = inputs.rteEfficiency / 100;
    const availability = inputs.rteAvailability / 100;
    const passes = inputs.rtePassesDay;
    const operatingDays = inputs.rteOperatingDays;
    const modules = inputs.rteModules;
    const loadW = inputs.rteLoadW;
    const batteryKwh = inputs.rteBatteryKwh;
    const batteryDod = inputs.rteBatteryDod / 100;
    const batteryEfficiency = inputs.rteBatteryEfficiency / 100;
    const recoveredPerPass = wh * eff;
    const dailyWh = recoveredPerPass * passes * modules * availability;
    const yearKwh = dailyWh * operatingDays / 1000;
    const avgW = yearKwh * 1000 / (365 * 24);
    const deviceHours = dailyWh / loadW;
    const usableBatteryKwh = batteryKwh * batteryDod * batteryEfficiency;
    const autonomyHours = usableBatteryKwh * 1000 / loadW;

    put('rteMetricPass', `${fmt(recoveredPerPass, 3)} Wh`);
    put('rteMetricDay', `${fmt(dailyWh, 1)} Wh`);
    put('rteMetricYear', `${fmt(yearKwh, 2)} kWh`);
    put('rteMetricAverage', `${fmt(avgW, 2)} W`);
    put('rteMetricDeviceHours', `${fmt(deviceHours, 1)} h/day`);
    put('rteMetricBatteryHours', `${fmt(autonomyHours, 1)} h`);
    put('rteFormulaDaily', `${fmt(wh, 2)} Wh/pass × ${fmt(eff * 100, 1)}% conversion × ${fmt(availability * 100, 1)}% availability × ${fmt(passes, 0)} passages/day/module × ${fmt(modules, 0)} modules`);
    put('rteFormulaAnnual', `${fmt(dailyWh, 1)} Wh/operating day × ${fmt(operatingDays, 0)} days ÷ 1,000 = ${fmt(yearKwh, 2)} kWh/year`);
    const note = byId('rteResultNote');
    if (note) {
      note.textContent = dailyWh === 0
        ? 'The current assumptions produce zero estimated recovery. Edit the inputs to explore another scenario.'
        : `Scenario estimate: ${fmt(dailyWh, 1)} Wh/day and ${fmt(yearKwh, 2)} kWh/year across ${fmt(modules, 0)} module(s), after ${fmt(availability * 100, 1)}% assumed availability and ${fmt(operatingDays, 0)} operating days/year. Not a measured field result.`;
    }
  }

  // Isometric projection for a lightweight, dependency-free 3D-style schematic.
  function project(x, y, z) {
    const s = Math.min(width / 1000, height / 470);
    return { x: width * 0.47 + (x + y * 0.92) * s, y: height * 0.49 + (x * 0.25 - y * 0.43 - z) * s };
  }
  function path(points, fill, stroke, lineWidth = 1) {
    ctx.beginPath();
    points.forEach((p, i) => { const q = project(p[0], p[1], p[2]); if (i === 0) ctx.moveTo(q.x, q.y); else ctx.lineTo(q.x, q.y); });
    ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lineWidth; ctx.stroke(); }
  }
  function line(points, color, lineWidth = 1, alpha = 1) {
    ctx.save(); ctx.globalAlpha = alpha; ctx.beginPath();
    points.forEach((p, i) => { const q = project(p[0], p[1], p[2]); if (!i) ctx.moveTo(q.x, q.y); else ctx.lineTo(q.x, q.y); });
    ctx.strokeStyle = color; ctx.lineWidth = lineWidth; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke(); ctx.restore();
  }
  function cuboid(x, y, z, w, d, h, colors) {
    const x0 = x - w / 2, x1 = x + w / 2, y0 = y - d / 2, y1 = y + d / 2, z1 = z + h;
    path([[x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1]], colors.top, colors.edge, .8);
    path([[x0,y0,z],[x1,y0,z],[x1,y0,z1],[x0,y0,z1]], colors.front, colors.edge, .8);
    path([[x1,y0,z],[x1,y1,z],[x1,y1,z1],[x1,y0,z1]], colors.side, colors.edge, .8);
    return { x0, x1, y0, y1, z, z1 };
  }
  function label(text, x, y, color = '#91bdcc', align = 'left') {
    const p = project(x, y, 3);
    ctx.save(); ctx.font = '700 9px ui-monospace, SFMono-Regular, Consolas, monospace'; ctx.textAlign = align; ctx.fillStyle = color; ctx.shadowColor = color; ctx.shadowBlur = 6; ctx.fillText(text, p.x, p.y); ctx.restore();
  }
  function circleAt(x, y, z, radius, fill, stroke) {
    const p = project(x, y, z); const s = Math.min(width / 1000, height / 470);
    ctx.beginPath(); ctx.ellipse(p.x, p.y, Math.max(2, radius * s), Math.max(2, radius * s * .72), -.16, 0, Math.PI * 2);
    ctx.fillStyle = fill; ctx.fill(); if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1.5; ctx.stroke(); }
  }
  function drawBackground() {
    const g = ctx.createLinearGradient(0, 0, 0, height); g.addColorStop(0, '#0b202c'); g.addColorStop(1, '#06121b'); ctx.fillStyle = g; ctx.fillRect(0, 0, width, height);
    ctx.save(); ctx.strokeStyle = 'rgba(92,166,189,.095)'; ctx.lineWidth = 1;
    const spacing = Math.max(24, Math.min(34, width / 26));
    for (let x = -width; x < width * 2; x += spacing) { ctx.beginPath(); ctx.moveTo(x, height * .18); ctx.lineTo(x - height * .3, height); ctx.stroke(); }
    for (let y = height * .22; y < height; y += spacing) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke(); }
    ctx.restore();
    const glow = ctx.createRadialGradient(width * .46, height * .52, 10, width * .46, height * .52, width * .6); glow.addColorStop(0, 'rgba(19,135,147,.17)'); glow.addColorStop(1, 'rgba(5,15,23,0)'); ctx.fillStyle = glow; ctx.fillRect(0, 0, width, height);
  }
  function drawRailway(nowSeconds) {
    // Ballast bed / track foundation.
    path([[-465,-57,0],[465,-57,0],[465,57,0],[-465,57,0]], '#162c38', '#244858', 1);
    path([[-465,-53,2],[465,-53,2],[465,53,2],[-465,53,2]], '#1b3542', 'rgba(114,174,194,.24)', .6);
    // Sleepers are separated so the moving train and rails remain visible.
    for (let x = -445; x <= 445; x += 43) {
      path([[x-6,-47,3],[x+6,-47,3],[x+6,47,3],[x-6,47,3]], '#536a73', '#70868e', .7);
      path([[x-6,-47,3],[x+6,-47,3],[x+6,-47,8],[x-6,-47,8]], '#71858b', '#8ca2a7', .5);
    }
    // Steel rails with dark edges and cyan specular glint.
    for (const y of [-27, 27]) {
      line([[-465,y,10],[465,y,10]], '#263b44', 9, .95);
      line([[-465,y,11],[465,y,11]], '#8da6b0', 4, .95);
      line([[-465,y-2,12],[465,y-2,12]], '#d7f0f4', 1.1, .8);
    }
    // Trackside vibration / small-deflection energy harvesting modules (concept).
    const moduleXs = [-215, -120, -25, 70];
    moduleXs.forEach((x, i) => {
      cuboid(x, -82, 4, 27, 22, 17, { top: '#ffc46b', front: '#9b6d30', side: '#704b26', edge: '#ffda91' });
      const p = project(x, -82, 23);
      ctx.save(); ctx.fillStyle = '#fff0bf'; ctx.shadowColor = '#ffc46b'; ctx.shadowBlur = 8; ctx.beginPath(); ctx.arc(p.x, p.y, 2.3, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      line([[x,-70,5],[x,-70,9]], '#ffcf7f', 1.2, .8);
    });
    // Cable route from the modules to power conditioning/storage.
    line([[-215,-96,7],[-170,-112,7],[-95,-112,7],[-20,-112,7],[55,-112,7],[135,-127,7],[215,-145,7]], '#1a6e77', 4, .92);
    line([[-215,-96,8],[-170,-112,8],[-95,-112,8],[-20,-112,8],[55,-112,8],[135,-127,8],[215,-145,8]], '#4de0d1', 1.3, .8);
    // Energy packets travel toward the wayside converter while simulation is running.
    for (let i = 0; i < 7; i++) {
      const t = ((nowSeconds * .19 + i / 7) % 1);
      const pathNodes = [[-215,-96,11],[-170,-112,11],[-95,-112,11],[-20,-112,11],[55,-112,11],[135,-127,11],[215,-145,11]];
      const scaled = t * (pathNodes.length - 1); const idx = Math.min(pathNodes.length - 2, Math.floor(scaled)); const f = scaled - idx;
      const a = pathNodes[idx], b = pathNodes[idx + 1]; circleAt(a[0] + (b[0]-a[0])*f, a[1] + (b[1]-a[1])*f, a[2] + (b[2]-a[2])*f, 3.5, '#c2fff5', '#4de0d1');
    }
    // Wayside DC conditioner and battery bank.
    cuboid(260, -154, 3, 72, 54, 62, { top: '#3c6a7d', front: '#214a5d', side: '#153443', edge: '#6fb8cb' });
    cuboid(260, -185, 12, 37, 5, 30, { top: '#5dc8c4', front: '#1d7c81', side: '#105359', edge: '#8bf5e5' });
    for (let i = 0; i < 3; i++) {
      const p = project(245 + i * 14, -125, 31);
      ctx.save(); ctx.fillStyle = i === 0 ? '#4de0d1' : '#68bdf1'; ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = 7; ctx.fillRect(p.x - 2, p.y - 2, 4, 4); ctx.restore();
    }
    label('TRACKSIDE HARVESTERS', -290, -111, '#ffc46b');
    label('DC / STORAGE NODE', 220, -206, '#75ded6');
    // Low-power rail condition sensor node at the trackside.
    cuboid(350, -80, 3, 34, 26, 34, { top: '#67bde8', front: '#255b78', side: '#173c56', edge: '#a2ddf7' });
    line([[295,-150,18],[330,-105,18],[350,-95,18]], '#65cde6', 1.6, .85);
    label('WAYSIDE SENSOR', 310, -111, '#9bdcff');
    // Train: long locomotive body, raised cab, windows and rotating wheel faces.
    const trainX = ((nowSeconds * 42 + 280) % 1120) - 560;
    cuboid(trainX, 0, 17, 150, 43, 38, { top: '#327c8d', front: '#16556b', side: '#10374c', edge: '#68cedc' });
    cuboid(trainX + 42, 0, 55, 49, 41, 26, { top: '#f2bd67', front: '#b97739', side: '#81502d', edge: '#ffe0a0' });
    // A short nose plate and front light at the direction of travel (+ track axis).
    path([[trainX+75,-15,24],[trainX+75,15,24],[trainX+75,15,44],[trainX+75,-15,44]], '#f2aa55', '#ffe0a0', .8);
    for (let wx = trainX + 26; wx <= trainX + 52; wx += 13) {
      path([[wx,-21,66],[wx+8,-21,66],[wx+8,-21,78],[wx,-21,78]], '#0a2d40', '#83dbe7', .8);
    }
    const wheelXs = [trainX - 49, trainX - 16, trainX + 18, trainX + 53];
    wheelXs.forEach((x, i) => {
      circleAt(x, -25, 15, 11, '#0a1219', '#80a6b2'); circleAt(x, 25, 15, 11, '#0a1219', '#80a6b2');
      circleAt(x, -25, 15, 4.1, '#446d7b', '#a3d1da'); circleAt(x, 25, 15, 4.1, '#446d7b', '#a3d1da');
      const angle = playing ? nowSeconds * 4.8 + i : i;
      const cx = project(x, -25, 15); const s = Math.min(width / 1000, height / 470);
      ctx.save(); ctx.translate(cx.x, cx.y); ctx.rotate(angle); ctx.strokeStyle = 'rgba(166,228,236,.75)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-4*s,0); ctx.lineTo(4*s,0); ctx.moveTo(0,-3*s); ctx.lineTo(0,3*s); ctx.stroke(); ctx.restore();
    });
    const lamp = project(trainX + 77, 0, 32); ctx.save(); ctx.fillStyle = '#fff5bd'; ctx.shadowColor = '#ffcf78'; ctx.shadowBlur = 13; ctx.beginPath(); ctx.arc(lamp.x, lamp.y, Math.max(2, 2.4 * Math.min(width/1000,height/470)), 0, Math.PI * 2); ctx.fill(); ctx.restore();
    // Contactless informational labels and direction hint.
    label('MOVING TRAIN · CONCEPT', trainX - 35, 91, '#b9e5ef');
    const directionA = project(-360, 79, 8), directionB = project(-290, 79, 8);
    ctx.save(); ctx.strokeStyle = '#7dabbc'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(directionA.x, directionA.y); ctx.lineTo(directionB.x, directionB.y); ctx.stroke(); ctx.fillStyle = '#7dabbc'; ctx.beginPath(); ctx.moveTo(directionB.x, directionB.y); ctx.lineTo(directionB.x-6, directionB.y-4); ctx.lineTo(directionB.x-6, directionB.y+4); ctx.closePath(); ctx.fill(); ctx.restore();
  }
  function render(stamp = 0) {
    frame = 0;
    if (!width || !height) return;
    drawBackground();
    const time = playing && !reducedMotion ? elapsed : Math.floor(elapsed * 2) / 2;
    drawRailway(time);
    if (playing && !reducedMotion) frame = window.requestAnimationFrame(tick);
  }
  function tick(stamp) {
    frame = 0;
    if (!lastStamp) lastStamp = stamp;
    const dt = Math.min(.05, Math.max(0, (stamp - lastStamp) / 1000));
    lastStamp = stamp;
    if (playing && !reducedMotion) elapsed += dt;
    drawBackground(); drawRailway(elapsed);
    frame = window.requestAnimationFrame(tick);
  }
  function resize() {
    const rect = canvas.getBoundingClientRect();
    if (rect.width < 2) return;
    width = rect.width; height = rect.height || 380; dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!frame) render();
  }
  const resizeObserver = typeof ResizeObserver === 'function' ? new ResizeObserver(resize) : null;
  if (resizeObserver) resizeObserver.observe(canvas); else window.addEventListener('resize', resize, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { if (frame) window.cancelAnimationFrame(frame); frame = 0; lastStamp = 0; }
    else if (playing && !reducedMotion && !frame) { lastStamp = 0; frame = window.requestAnimationFrame(tick); }
  });

  fieldIds.forEach((id) => byId(id)?.addEventListener('input', recalculate));
  byId('rteSimToggle')?.addEventListener('click', () => {
    playing = !playing;
    const button = byId('rteSimToggle');
    if (button) button.innerHTML = `<span class="rte-btn-dot"></span>${playing ? 'Pause simulation' : 'Resume simulation'}`;
    put('rteSimStatus', playing ? 'SIMULATION RUNNING' : 'SIMULATION PAUSED');
    put('rteAnimBadge', playing ? 'ANIMATION RUNNING' : 'ANIMATION PAUSED');
    if (frame) window.cancelAnimationFrame(frame);
    frame = 0; lastStamp = 0;
    if (playing && !reducedMotion) frame = window.requestAnimationFrame(tick); else render();
  });
  byId('rteSimReset')?.addEventListener('click', () => {
    elapsed = 0; lastStamp = 0;
    put('rteSimStatus', playing ? 'SIMULATION RUNNING' : 'SIMULATION PAUSED');
    if (!frame) render();
  });

  recalculate();
  resize();
  if (playing && !reducedMotion && !frame) frame = window.requestAnimationFrame(tick);
})();
