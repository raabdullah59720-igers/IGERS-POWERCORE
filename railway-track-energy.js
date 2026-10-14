/* IGERS-BD-01 · Railway Track Energy Recovery concept module.
 * A self-contained WebGL perspective renderer consumes the shared state; this file keeps
 * the canvas fallback, cutaway and assumption-based calculator synchronized.
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
  const physicsFieldIds = ['rteSpeedKph', 'rteWheelLoadKn', 'rteAdhesionMu', 'rteTractionUsePct', 'rteSlipPct', 'rtePadCompressionMm'];
  const railPadXs = [-230, -101, 28, 157]; // selected recovery zones aligned with sleeper centres
  const CONTACT_LENGTH_M = 0.50; // explicitly assumed visual contact length, not a measured contact patch
  const mechCanvas = byId('rteMechanismCanvas');
  const mechCtx = mechCanvas && mechCanvas.getContext ? mechCanvas.getContext('2d') : null;
  let width = 800, height = 380, dpr = 1, frame = 0, elapsed = 0, lastStamp = 0, playing = true;
  let mechWidth = 800, mechHeight = 270, mechDpr = 1;
  let distanceTravelled = 380, previousTrainX = null;
  let padVisitLatched = railPadXs.map(() => false);
  let padIntensities = railPadXs.map(() => 0), activePadCount = 0, peakPadIntensity = 0;
  let liveModulePassEvents = 0, liveEnergyWh = 0, recoveredPerPassWh = 1.75;
  let lastEnergyScenarioSignature = null;
  let energyInputsValid = true, physicsInputsValid = true;
  let frictionState = { speedKph: 72, wheelLoadKn: 80, mu: 0.25, forceUse: 0.30, slipRatio: 0.01, compressionMm: 2, forceKn: 6, powerKw: 1.2, energyJ: 30, contactMs: 25 };
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
  // Keep the WebGL scene's read-only state fresh even while the animation is paused.
  function syncVisualStateInputs() {
    const state = window.__igersRailwayVisualState;
    if (!state) return;
    state.energyInputsValid = energyInputsValid;
    state.physicsInputsValid = physicsInputsValid;
    state.speedKph = frictionState.speedKph;
    state.compressionMm = frictionState.compressionMm;
    state.slipRatio = frictionState.slipRatio;
    state.forceKn = frictionState.forceKn;
    state.powerKw = frictionState.powerKw;
    state.liveModulePassEvents = liveModulePassEvents;
    state.liveEnergyWh = liveEnergyWh;
    state.animating = Boolean(playing && !reducedMotion);
    window.dispatchEvent(new CustomEvent('igers:railway-statechange'));
  }
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
      // Suppress totals that were accumulated under a now-invalid or mixed scenario.
      if (energyInputsValid) {
        liveModulePassEvents = 0;
        liveEnergyWh = 0;
        padVisitLatched = railPadXs.map((_, i) => (padIntensities[i] || 0) > 0.001);
        put('rteLivePulseCount', '0');
        put('rteLiveEnergyWh', 'CHECK INPUT');
      }
      lastEnergyScenarioSignature = null;
      energyInputsValid = false;
      syncVisualStateInputs();
      recoveredPerPassWh = 0;
      ['rteMetricPass','rteMetricDay','rteMetricYear','rteMetricAverage','rteMetricDeviceHours','rteMetricBatteryHours'].forEach(id => put(id, 'CHECK INPUT'));
      put('rteFormulaDaily', 'Enter values inside the shown limits; passages, operating days and module count must be whole numbers.');
      put('rteFormulaAnnual', 'No result calculated until all inputs are valid.');
      put('rteResultNote', 'One or more inputs are blank or outside the accepted range. Correct highlighted fields to recalculate.');
      return;
    }
    const scenarioSignature = fieldIds.map(id => `${id}=${inputs[id]}`).join('|');
    if (lastEnergyScenarioSignature !== null && scenarioSignature !== lastEnergyScenarioSignature) {
      // Do not mix session Wh from different model assumptions in one counter.
      liveModulePassEvents = 0;
      liveEnergyWh = 0;
      padVisitLatched = railPadXs.map((_, i) => (padIntensities[i] || 0) > 0.001);
      put('rteLivePulseCount', '0');
      put('rteLiveEnergyWh', '0.000 Wh');
    }
    lastEnergyScenarioSignature = scenarioSignature;
    energyInputsValid = true;
    syncVisualStateInputs();
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
    let calculation;
    try {
      calculation = window.IGERSCalcCore.railway({grossWhPerPass:wh,electricalEfficiencyPct:inputs.rteEfficiency,availabilityPct:inputs.rteAvailability,passesPerDayPerModule:passes,operatingDays,modules,loadW,batteryCapacityKWh:batteryKwh,batteryDoDPercent:inputs.rteBatteryDod,batteryEfficiencyPct:inputs.rteBatteryEfficiency});
    } catch (error) {
      energyInputsValid = false;
      recoveredPerPassWh = 0;
      ['rteMetricPass','rteMetricDay','rteMetricYear','rteMetricAverage','rteMetricDeviceHours','rteMetricBatteryHours'].forEach(id => put(id, 'CHECK INPUT'));
      put('rteFormulaDaily', String(error?.message || 'Calculation error'));
      put('rteFormulaAnnual', 'Outputs suppressed until invalid inputs are corrected.');
      put('rteResultNote', 'Calculation blocked. This is an estimate model, not field telemetry.');
      syncVisualStateInputs();
      return;
    }
    const recoveredPerPass=calculation.netWhPerPass, dailyWh=calculation.dailyWh, yearKwh=calculation.annualKWh, avgW=calculation.averageCalendarW, deviceHours=calculation.deviceHoursPerDay, usableBatteryKwh=calculation.usableBatteryKWh, autonomyHours=calculation.batteryAutonomyHours;
    recoveredPerPassWh = recoveredPerPass;

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

  function updatePhysicsModel() {
    const specs = {
      rteSpeedKph: [20, 160], rteWheelLoadKn: [10, 200], rteAdhesionMu: [0.05, 0.6],
      rteTractionUsePct: [0, 100], rteSlipPct: [0, 10], rtePadCompressionMm: [0.1, 5]
    };
    const values = {};
    let valid = true;
    for (const [id, [min, max]] of Object.entries(specs)) {
      const el = byId(id), n = val(id, min, max);
      values[id] = n;
      const isValid = n !== null;
      if (el) {
        el.setAttribute('aria-invalid', String(!isValid));
        el.classList.toggle('rte-invalid', !isValid);
      }
      if (!isValid) valid = false;
    }
    if (!valid) {
      // Suppress stale force/heat indicators while any physics input is invalid.
      physicsInputsValid = false;
      frictionState = { ...frictionState, slipRatio: 0, compressionMm: 0, forceKn: 0, powerKw: 0, energyJ: 0, contactMs: 0 };
      syncVisualStateInputs();
      ['rteFrictionForce', 'rteFrictionPower', 'rteFrictionEnergy', 'rteContactTime'].forEach(id => put(id, 'CHECK INPUT'));
      put('rteMechanismState', 'CHECK PHYSICS INPUTS · OUTPUT SUPPRESSED');
      if (!frame) { drawBackground(); drawRailway(elapsed); drawMechanism(elapsed); }
      return;
    }
    physicsInputsValid = true;
    const speedKph = values.rteSpeedKph;
    const speedMps = speedKph / 3.6;
    const wheelLoadKn = values.rteWheelLoadKn;
    const mu = values.rteAdhesionMu;
    const forceUse = values.rteTractionUsePct / 100;
    const slipRatio = values.rteSlipPct / 100;
    const compressionMm = values.rtePadCompressionMm;
    // Upper-limit model: Ft is an editable fraction of μN; dissipation is Ft × relative slip speed.
    const forceKn = mu * wheelLoadKn * forceUse;
    const powerKw = forceKn * speedMps * slipRatio; // kN × m/s = kW
    const energyJ = forceKn * 1000 * slipRatio * CONTACT_LENGTH_M;
    const contactMs = CONTACT_LENGTH_M / speedMps * 1000;
    frictionState = { speedKph, wheelLoadKn, mu, forceUse, slipRatio, compressionMm, forceKn, powerKw, energyJ, contactMs };
    syncVisualStateInputs();
    put('rteSpeedReadout', `${fmt(speedKph, 0)} km/h`);
    put('rteFrictionForce', `${fmt(forceKn, 2)} kN`);
    put('rteFrictionPower', `${fmt(powerKw, 3)} kW`);
    put('rteFrictionEnergy', `${fmt(energyJ, 2)} J`);
    put('rteContactTime', `${fmt(contactMs, 1)} ms`);
    put('rteFrictionEquation', `Fₜ = μN × use = ${fmt(mu, 2)} × ${fmt(wheelLoadKn, 1)} kN × ${fmt(forceUse * 100, 0)}% = ${fmt(forceKn, 2)} kN · v_slip = ${(speedMps * slipRatio).toFixed(3)} m/s · P_loss = ${fmt(powerKw, 3)} kW · E_loss/contact = ${fmt(energyJ, 2)} J (assumed ${CONTACT_LENGTH_M.toFixed(2)} m contact length)`);
    put('rteMechanismState', peakPadIntensity > 0.08 ? `PAD LOADED · ${activePadCount}/${railPadXs.length} ZONES · FRICTION ${fmt(powerKw, 2)} kW` : `PAD IDLE · FRICTION MODEL ${fmt(powerKw, 2)} kW`);
    if (!frame) { drawBackground(); drawRailway(elapsed); drawMechanism(elapsed); }
  }

  // Isometric projection for a lightweight, dependency-free 3D-style schematic.
  function project(x, y, z) {
    // Horizontal fit is slightly wider than vertical scale so the full train remains visible in fallback mode.
    const sx = Math.min(width / 1280, height / 470);
    const sy = Math.min(width / 1000, height / 470);
    return { x: width * 0.50 + (x + y * 0.92) * sx, y: height * 0.50 + (x * 0.25 - y * 0.43 - z) * sy };
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
  function getTrainX() { return (distanceTravelled % 1440) - 720; }
  function updateLiveSimulation(trainX, wheelXs, nowSeconds) {
    if (previousTrainX !== null && trainX < previousTrainX - 500) padVisitLatched = railPadXs.map(() => false);
    previousTrainX = trainX;
    padIntensities = railPadXs.map((x) => {
      const nearest = Math.min(...wheelXs.map(wheelX => Math.abs(wheelX - x)));
      return Math.max(0, Math.min(1, (25 - nearest) / 9));
    });
    activePadCount = padIntensities.filter(v => v > 0.05).length;
    peakPadIntensity = padIntensities.length ? Math.max(...padIntensities) : 0;
    // Count one module passage only when an axle actually loads that pad zone.
    // The latch suppresses duplicate counts from the remaining axles of the same train.
    railPadXs.forEach((x, i) => {
      if (!padVisitLatched[i] && padIntensities[i] > 0.08) {
        padVisitLatched[i] = true;
        // Invalid assumptions can still show pad compression, but cannot create a credited energy event.
        if (energyInputsValid) {
          liveModulePassEvents += 1;
          liveEnergyWh += recoveredPerPassWh;
        }
      }
    });
    put('rteLivePadState', `${activePadCount} / ${railPadXs.length}`);
    const padLabel = activePadCount ? `${activePadCount} zone(s) under wheel load · simulated` : 'Train not over a recovery zone';
    put('rteLivePadLabel', energyInputsValid ? padLabel : `${padLabel} · energy estimate paused: correct calculator inputs`);
    put('rteLivePulseCount', fmt(liveModulePassEvents, 0));
    put('rteLiveEnergyWh', energyInputsValid ? `${fmt(liveEnergyWh, 3)} Wh` : 'CHECK INPUT');
    put('rteLiveCompression', `${fmt(frictionState.compressionMm * peakPadIntensity, 2)} mm`);
    put('rteMechanismState', !physicsInputsValid ? 'PHYSICS INPUTS INVALID · OUTPUT SUPPRESSED' : activePadCount ? `PAD LOADED · ${activePadCount}/${railPadXs.length} ZONES · FRICTION ${fmt(frictionState.powerKw, 2)} kW` : `PAD IDLE · FRICTION MODEL ${fmt(frictionState.powerKw, 2)} kW`);
    // Shared read-only frame state for the GPU scene. No hardware/live telemetry is implied.
    window.__igersRailwayVisualState = {
      trainX, elapsed: nowSeconds, distanceTravelled, padIntensities: padIntensities.slice(),
      activePadCount, liveModulePassEvents, liveEnergyWh, speedKph: frictionState.speedKph,
      compressionMm: frictionState.compressionMm, slipRatio: frictionState.slipRatio,
      forceKn: frictionState.forceKn, powerKw: frictionState.powerKw,
      physicsInputsValid, energyInputsValid, playing, animating: Boolean(playing && !reducedMotion)
    };
    if (!playing || reducedMotion) window.dispatchEvent(new CustomEvent('igers:railway-statechange'));
  }

  function drawRailway(nowSeconds) {
    const trainX = getTrainX();
    const wheelXs = [trainX - 49, trainX - 16, trainX + 18, trainX + 53];
    updateLiveSimulation(trainX, wheelXs, nowSeconds);
    // Ballast bed / track foundation.
    path([[-465,-57,0],[465,-57,0],[465,57,0],[-465,57,0]], '#162c38', '#244858', 1);
    path([[-465,-53,2],[465,-53,2],[465,53,2],[-465,53,2]], '#1b3542', 'rgba(114,174,194,.24)', .6);
    // Conceptual transducer pads are BELOW selected sleepers, never on top of the rail.
    railPadXs.forEach((x, i) => {
      const pulse = padIntensities[i] || 0;
      const padH = 2.7 - pulse * 0.55;
      const padZ = 3 - padH; // cuboid() takes the lower z face: pad top now touches sleeper underside z=3
      const active = pulse > 0.08;
      cuboid(x, 0, padZ, 25, 22, padH, { top: active ? '#39d9c3' : '#b98746', front: active ? '#168d7e' : '#805825', side: active ? '#12665f' : '#5a3b1c', edge: active ? '#b5fff5' : '#ffd58c' });
      // Exposed near-side indicator lip makes the hidden under-sleeper pad readable from this camera angle.
      cuboid(x, -14, 2.0, 17, 3, 1.1, { top: active ? '#85fff0' : '#f1bd70', front: active ? '#16aa9a' : '#8c5d2a', side: active ? '#117367' : '#63421d', edge: active ? '#e0fff9' : '#ffe2a8' });
      if (active) {
        const p = project(x, -14, 2.7);
        ctx.save(); ctx.globalAlpha = .35 + pulse * .65; ctx.fillStyle = '#7dfff0'; ctx.shadowColor = '#4de0d1'; ctx.shadowBlur = 12; ctx.beginPath(); ctx.arc(p.x, p.y, 3 + pulse * 3, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      }
    });
    // Selected recovery sleepers align exactly with the pad centres.
    const sleeperXs = [];
    for (let x = -445; x <= 445; x += 43) sleeperXs.push(x);
    railPadXs.forEach(x => { if (!sleeperXs.some(s => Math.abs(s - x) < 5)) sleeperXs.push(x); });
    sleeperXs.sort((a,b)=>a-b);
    for (const x of sleeperXs) {
      const padIndex = railPadXs.findIndex(px => Math.abs(px-x) < 5);
      const pulse = padIndex >= 0 ? (padIntensities[padIndex] || 0) : 0;
      path([[x-6,-47,3],[x+6,-47,3],[x+6,47,3],[x-6,47,3]], pulse > .08 ? '#718f91' : '#536a73', '#8ca2a7', .7);
      path([[x-6,-47,3],[x+6,-47,3],[x+6,-47,8-pulse*.25],[x-6,-47,8-pulse*.25]], pulse > .08 ? '#a6c5c6' : '#71858b', '#8ca2a7', .5);
    }
    // Steel rails with dark edges and cyan specular glint.
    for (const y of [-27, 27]) {
      line([[-465,y,10],[465,y,10]], '#263b44', 9, .95);
      line([[-465,y,11],[465,y,11]], '#8da6b0', 4, .95);
      line([[-465,y-2,12],[465,y-2,12]], '#d7f0f4', 1.1, .8);
      sleeperXs.forEach(x => {
        line([[x-2,y-5,8],[x+2,y-5,8]], '#b8c9cc', 1, .8);
      });
    }
    // Trackside vibration / small-deflection energy harvesting modules (concept).
    const moduleXs = railPadXs;
    moduleXs.forEach((x, i) => {
      cuboid(x, -82, 4, 27, 22, 17, { top: '#ffc46b', front: '#9b6d30', side: '#704b26', edge: '#ffda91' });
      const p = project(x, -82, 23);
      ctx.save(); ctx.fillStyle = '#fff0bf'; ctx.shadowColor = '#ffc46b'; ctx.shadowBlur = 8; ctx.beginPath(); ctx.arc(p.x, p.y, 2.3, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      line([[x,-70,5],[x,-70,9]], '#ffcf7f', 1.2, .8);
    });
    // Cable route from the modules to power conditioning/storage.
    line([[-230,-96,7],[-170,-112,7],[-101,-112,7],[28,-112,7],[157,-112,7],[215,-127,7],[260,-145,7]], '#1a6e77', 4, .92);
    line([[-230,-96,8],[-170,-112,8],[-101,-112,8],[28,-112,8],[157,-112,8],[215,-127,8],[260,-145,8]], '#4de0d1', 1.3, .8);
    // Energy packets are shown only while a wheel is loading at least one recovery zone.
    if (energyInputsValid && peakPadIntensity > 0.05) {
      ctx.save(); ctx.globalAlpha = Math.min(1, 0.25 + peakPadIntensity * 0.75);
      for (let i = 0; i < 7; i++) {
        const t = ((nowSeconds * .45 + i / 7) % 1);
        const pathNodes = [[-230,-96,11],[-170,-112,11],[-101,-112,11],[28,-112,11],[157,-112,11],[215,-127,11],[260,-145,11]];
        const scaled = t * (pathNodes.length - 1); const idx = Math.min(pathNodes.length - 2, Math.floor(scaled)); const f = scaled - idx;
        const a = pathNodes[idx], b = pathNodes[idx + 1]; circleAt(a[0] + (b[0]-a[0])*f, a[1] + (b[1]-a[1])*f, a[2] + (b[2]-a[2])*f, 3.5, '#c2fff5', '#4de0d1');
      }
      ctx.restore();
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
    // Three short coloured passenger cars plus the locomotive form a legible train consist.
    const wagonColors = [
      { top: '#bd4b59', front: '#7d2637', side: '#4c1c2b', edge: '#ed8994' },
      { top: '#3c9b82', front: '#236b5c', side: '#174438', edge: '#7de3c5' },
      { top: '#4e87ca', front: '#2c5689', side: '#183657', edge: '#8dc2ff' }
    ];
    [-118, -202, -286].forEach((offset, i) => {
      const wx = trainX + offset;
      cuboid(wx, 0, 18, 68, 39, 31, wagonColors[i]);
      cuboid(wx, 0, 48, 62, 34, 2, { top: wagonColors[i].top, front: wagonColors[i].front, side: wagonColors[i].side, edge: wagonColors[i].edge });
      for (let j = 0; j < 4; j++) {
        const winX = wx - 24 + j * 15;
        path([[winX,-20,36],[winX+8,-20,36],[winX+8,-20,45],[winX,-20,45]], '#bdeef9', '#e4fbff', .5);
      }
      [wx-22, wx+22].forEach((axleX, ai) => {
        circleAt(axleX, -25, 15, 10, '#0a1219', '#9bb7c2'); circleAt(axleX, 25, 15, 10, '#0a1219', '#9bb7c2');
        circleAt(axleX, -25, 15, 3.5, '#547989', '#d9f5fa'); circleAt(axleX, 25, 15, 3.5, '#547989', '#d9f5fa');
      });
    });
    cuboid(trainX, 0, 17, 150, 43, 38, { top: '#2e8fb6', front: '#126b8b', side: '#0b3f5a', edge: '#7ce8ff' });
    cuboid(trainX + 42, 0, 55, 49, 41, 26, { top: '#ffd86a', front: '#ec842d', side: '#a34821', edge: '#fff0aa' });
    // A short nose plate and front light at the direction of travel (+ track axis).
    path([[trainX+75,-15,24],[trainX+75,15,24],[trainX+75,15,44],[trainX+75,-15,44]], '#f2aa55', '#ffe0a0', .8);
    for (let wx = trainX + 26; wx <= trainX + 52; wx += 13) {
      path([[wx,-21,66],[wx+8,-21,66],[wx+8,-21,78],[wx,-21,78]], '#0a2d40', '#83dbe7', .8);
    }
    // Steel wheel / rail contact heat glow and short slip sparks; this is a loss indicator, not a recovery source.
    const slipRatio = frictionState.slipRatio;
    const heatAlpha = Math.max(0, Math.min(0.9, 0.16 + frictionState.powerKw / 8));
    if (slipRatio > 0 && frictionState.forceKn > 0) {
      wheelXs.forEach((x, i) => {
        [-25, 25].forEach((y, railIndex) => {
          circleAt(x, y, 11.5, 8 + Math.min(7, frictionState.powerKw), `rgba(255,101,48,${heatAlpha})`, 'rgba(255,185,93,.8)');
          if (((nowSeconds * 9 + i * 0.43 + railIndex * 0.29) % 1) < 0.72) {
            const flicker = 0.4 + 0.6 * Math.abs(Math.sin(nowSeconds * 17 + i * 2 + railIndex));
            line([[x-4,y,13],[x+3 + flicker*4,y-5-flicker*2,17]], '#ffb454', 1.3, flicker);
            line([[x+2,y+1,13],[x+7+flicker*3,y+4+flicker*2,16]], '#ff7043', 1.1, flicker * 0.9);
          }
        });
      });
    }
    wheelXs.forEach((x, i) => {
      circleAt(x, -25, 15, 11, '#0a1219', '#80a6b2'); circleAt(x, 25, 15, 11, '#0a1219', '#80a6b2');
      circleAt(x, -25, 15, 4.1, '#446d7b', '#a3d1da'); circleAt(x, 25, 15, 4.1, '#446d7b', '#a3d1da');
      const angle = distanceTravelled * (4.8 / 42) + i;
      const cx = project(x, -25, 15); const s = Math.min(width / 1000, height / 470);
      ctx.save(); ctx.translate(cx.x, cx.y); ctx.rotate(angle); ctx.strokeStyle = 'rgba(166,228,236,.75)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-4*s,0); ctx.lineTo(4*s,0); ctx.moveTo(0,-3*s); ctx.lineTo(0,3*s); ctx.stroke(); ctx.restore();
    });
    const lamp = project(trainX + 77, 0, 32); ctx.save(); ctx.fillStyle = '#fff5bd'; ctx.shadowColor = '#ffcf78'; ctx.shadowBlur = 13; ctx.beginPath(); ctx.arc(lamp.x, lamp.y, Math.max(2, 2.4 * Math.min(width/1000,height/470)), 0, Math.PI * 2); ctx.fill(); ctx.restore();
    // Contactless informational labels and direction hint.
    label(`MOVING TRAIN · ${Math.round(frictionState.speedKph)} km/h SCENARIO`, trainX - 35, 91, '#b9e5ef');
    const directionA = project(-360, 79, 8), directionB = project(-290, 79, 8);
    ctx.save(); ctx.strokeStyle = '#7dabbc'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(directionA.x, directionA.y); ctx.lineTo(directionB.x, directionB.y); ctx.stroke(); ctx.fillStyle = '#7dabbc'; ctx.beginPath(); ctx.moveTo(directionB.x, directionB.y); ctx.lineTo(directionB.x-6, directionB.y-4); ctx.lineTo(directionB.x-6, directionB.y+4); ctx.closePath(); ctx.fill(); ctx.restore();
  }
  function drawMechanism(nowSeconds) {
    if (!mechCtx || !mechCanvas || mechWidth < 2 || mechHeight < 2) return;
    const c = mechCtx, w = mechWidth, h = mechHeight, split = w / 2;
    c.clearRect(0, 0, w, h);
    const bg = c.createLinearGradient(0, 0, 0, h); bg.addColorStop(0, '#0b202b'); bg.addColorStop(1, '#06121a'); c.fillStyle = bg; c.fillRect(0, 0, w, h);
    c.strokeStyle = 'rgba(112,196,220,.15)'; c.lineWidth = 1; c.beginPath(); c.moveTo(split, 0); c.lineTo(split, h); c.stroke();
    const active = Math.max(0, Math.min(1, padIntensities[0] || 0)); // close-up cutaway follows module 01
    const forceIntensity = Math.max(0, Math.min(1, frictionState.powerKw / 6));
    const txt = (text, x, y, size=9, color='#c6e8f1', weight='700') => { c.fillStyle=color; c.font=`${weight} ${size}px ui-monospace, SFMono-Regular, Consolas, monospace`; c.fillText(text, x, y); };
    const arrow = (x1,y1,x2,y2,color,width=2) => { c.strokeStyle=color;c.lineWidth=width;c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.stroke();const a=Math.atan2(y2-y1,x2-x1);c.fillStyle=color;c.beginPath();c.moveTo(x2,y2);c.lineTo(x2-7*Math.cos(a-.45),y2-7*Math.sin(a-.45));c.lineTo(x2-7*Math.cos(a+.45),y2-7*Math.sin(a+.45));c.closePath();c.fill(); };
    // LEFT CUTAWAY: a wheel loads rail + sleeper, which compresses an illustrative transducer layer below.
    c.fillStyle='rgba(77,224,209,.035)';c.fillRect(0,0,split,h);
    txt('A · MODULE 01 PAD RECOVERY', 12, 18, 9, '#6ce7d9');
    const leftW=split, railY=76, railW=Math.max(126,leftW*.72), padPixelX=railPadXs[0], railStart=10, railSpan=leftW-20, padX=railStart+((padPixelX+720)/1440)*railSpan, movingTrainX=getTrainX(), movingWheelPixels=[movingTrainX-49,movingTrainX-16,movingTrainX+18,movingTrainX+53].reduce((best,x)=>Math.abs(x-padPixelX)<Math.abs(best-padPixelX)?x:best,movingTrainX), wheelX=railStart+((movingWheelPixels+720)/1440)*railSpan;
    const wheelR=Math.max(15,Math.min(26,leftW*.068));
    const wheelGrad=c.createRadialGradient(wheelX-wheelR*.3,railY-wheelR*.8,2,wheelX,railY-wheelR*.3,wheelR*1.5); wheelGrad.addColorStop(0,'#cfe7ed');wheelGrad.addColorStop(.5,'#607d8a');wheelGrad.addColorStop(1,'#1b303a');
    c.beginPath();c.arc(wheelX,railY-wheelR+5,wheelR,0,Math.PI*2);c.fillStyle=wheelGrad;c.fill();c.strokeStyle='#cdeaf1';c.lineWidth=2;c.stroke();
    c.beginPath();c.arc(wheelX,railY-wheelR+5,wheelR*.28,0,Math.PI*2);c.fillStyle='#233e4c';c.fill();
    c.save();c.translate(wheelX,railY-wheelR+5);c.rotate(distanceTravelled*(4.8/42));c.strokeStyle='#d8f7fa';c.lineWidth=1.2;c.beginPath();c.moveTo(-wheelR*.65,0);c.lineTo(wheelR*.65,0);c.moveTo(0,-wheelR*.65);c.lineTo(0,wheelR*.65);c.stroke();c.restore();
    c.fillStyle='#536c78';c.fillRect(10,railY,railW-20,9);c.fillStyle='#d5e7ed';c.fillRect(10,railY,railW-20,3);c.fillStyle='#263f4a';c.fillRect(18,railY+9,railW-36,17);c.fillStyle='#617d87';c.fillRect(18,railY+9,railW-36,4);
    // Sensor pad under the sleeper; movement is exaggerated for visibility, not to scale.
    const padY=railY+28, stroke=Math.min(13,frictionState.compressionMm*5*active);
    c.fillStyle='#152a35';c.fillRect(padX-25,padY-2,50,27);c.strokeStyle=active>.05?'#76ffe8':'#b98746';c.lineWidth=1.4;c.strokeRect(padX-25,padY-2,50,27);
    for(let k=0;k<4;k++){const yy=padY+2+k*4+stroke*.30;c.fillStyle=active>.05?(k%2?'#1eaa9c':'#8bffed'):'#82643f';c.fillRect(padX-17,yy,34,2.2);}
    arrow(padX,railY+30,padX,railY+35+stroke*.15,active>.05?'#ffc46b':'#7995a2',1.5);
    txt(active>.05?`COMPRESSION ${fmt(frictionState.compressionMm*active,1)} mm`:'PAD READY · NO LOAD',12,padY+43,8,active>.05?'#ffc46b':'#829eac');
    const convX=leftW-52, convY=padY+1;
    c.strokeStyle=active>.05?'#4de0d1':'#27606c';c.lineWidth=2;c.beginPath();c.moveTo(padX+25,padY+10);c.lineTo(convX-10,padY+10);c.stroke();
    if(energyInputsValid && active>.05){for(let i=0;i<4;i++){const fx=((nowSeconds*.75+i*.25)%1);c.fillStyle='#c0fff7';c.shadowColor='#4de0d1';c.shadowBlur=7;c.beginPath();c.arc(padX+25+(convX-padX-35)*fx,padY+10,2.1,0,Math.PI*2);c.fill();}c.shadowBlur=0;}
    c.fillStyle='#214d5d';c.fillRect(convX-12,convY-8,48,31);c.strokeStyle='#4de0d1';c.strokeRect(convX-12,convY-8,48,31);txt('DC',convX+1,convY+10,9,'#c8fff7');txt('STORE',convX-3,convY+35,7,'#90b7c5');
    txt(energyInputsValid?'WHEEL → RAIL → SLEEPER → PAD → RECTIFIER / STORE':'INVALID INPUT · ENERGY PULSE PAUSED',12,h-12,7,energyInputsValid?'#91afbc':'#ffbf75','600');
    // RIGHT CUTAWAY: slip contact heat is dissipated energy and is not counted in the harvester output.
    c.fillStyle='rgba(255,147,73,.025)';c.fillRect(split,0,split,h);
    txt('B · STEEL WHEEL / RAIL FRICTION', split+12,18,9,'#ffbf75');
    const rightX=split, wheelCX=split+Math.max(42,Math.min(split-36,split*.40)), rr=Math.max(18,Math.min(31,split*.075)), wheelCY=106-rr+1;
    c.fillStyle='#4d626d';c.fillRect(split+10,106,split-20,13);c.fillStyle='#cbdce2';c.fillRect(split+10,106,split-20,3);c.fillStyle='#223b47';c.fillRect(split+10,119,split-20,11);
    // Heat halo tracks selected slip/force; this indicates dissipation only.
    const hx=wheelCX, hy=105;const heatCoreAlpha=physicsInputsValid&&frictionState.slipRatio>0&&frictionState.forceKn>0?Math.min(.78,.16+forceIntensity*.6):0;const hg=c.createRadialGradient(hx,hy,1,hx,hy,rr*1.9);hg.addColorStop(0,`rgba(255,91,45,${heatCoreAlpha})`);hg.addColorStop(1,'rgba(255,91,45,0)');c.fillStyle=hg;c.fillRect(hx-rr*2,hy-rr*2,rr*4,rr*4);
    const metal=c.createRadialGradient(wheelCX-rr*.3,wheelCY-rr*.3,2,wheelCX,wheelCY,rr*1.3);metal.addColorStop(0,'#d4e0e5');metal.addColorStop(.48,'#607984');metal.addColorStop(1,'#1e3039');c.beginPath();c.arc(wheelCX,wheelCY,rr,0,Math.PI*2);c.fillStyle=metal;c.fill();c.strokeStyle='#d6e7ec';c.lineWidth=2;c.stroke();c.beginPath();c.arc(wheelCX,wheelCY,rr*.34,0,Math.PI*2);c.fillStyle='#203b49';c.fill();c.strokeStyle='#a4c2ce';c.stroke();
    c.save();c.translate(wheelCX,wheelCY);c.rotate(distanceTravelled*(4.8/42));c.strokeStyle='#e8f8fc';c.lineWidth=1.4;c.beginPath();c.moveTo(-rr*.72,0);c.lineTo(rr*.72,0);c.moveTo(0,-rr*.72);c.lineTo(0,rr*.72);c.stroke();c.restore();
    if(frictionState.slipRatio>0 && frictionState.forceKn>0){for(let i=0;i<7;i++){const phase=(nowSeconds*8+i*.19)%1;const sx=wheelCX-7+(phase*18);const sy=101-((phase*16+ i*2)%17);c.strokeStyle=i%2?'#ff7d49':'#ffe09a';c.globalAlpha=.35+.65*Math.abs(Math.sin(nowSeconds*19+i));c.lineWidth=1.4;c.beginPath();c.moveTo(sx,sy);c.lineTo(sx+4+(i%3)*2,sy-4-(i%2)*3);c.stroke();}c.globalAlpha=1;}
    arrow(split+18,150,split+Math.max(55,split*.48),150,'#9ab7c3',1.5);txt(`TRAIN ${Math.round(frictionState.speedKph)} km/h`,split+14,166,8,'#b9d3de');
    arrow(wheelCX+rr+2,94,wheelCX+rr+15,94,'#ff9c55',1.5);txt(`SLIP ${fmt(frictionState.slipRatio*100,1)}%`,split+14,185,8,'#ffbd75');
    txt(`Fₜ ${fmt(frictionState.forceKn,2)} kN`,split+14,204,8,'#f8e3cf');txt(`P_loss ${fmt(frictionState.powerKw,3)} kW`,split+14,219,8,'#ffad70');
    txt('FRICTION = HEAT / LOSS, NOT GENERATED Wh',split+14,h-12,7,'#ffb875','600');
  }

  function resizeMechanismCanvas() {
    if (!mechCanvas || !mechCtx) return;
    const rect = mechCanvas.getBoundingClientRect();
    if (rect.width < 2) return;
    mechWidth = rect.width; mechHeight = rect.height || 270; mechDpr = Math.min(window.devicePixelRatio || 1, 2);
    mechCanvas.width = Math.round(mechWidth * mechDpr); mechCanvas.height = Math.round(mechHeight * mechDpr);
    mechCtx.setTransform(mechDpr,0,0,mechDpr,0,0); drawMechanism(elapsed);
  }

  function render(stamp = 0) {
    frame = 0;
    if (!width || !height) return;
    drawBackground();
    const time = playing && !reducedMotion ? elapsed : Math.floor(elapsed * 2) / 2;
    drawRailway(time); drawMechanism(time);
    if (playing && !reducedMotion) frame = window.requestAnimationFrame(tick);
  }
  function tick(stamp) {
    frame = 0;
    if (!lastStamp) lastStamp = stamp;
    const dt = Math.min(.05, Math.max(0, (stamp - lastStamp) / 1000));
    lastStamp = stamp;
    if (playing && !reducedMotion) {
      elapsed += dt;
      distanceTravelled += dt * (frictionState.speedKph / 72) * 42;
    }
    drawBackground(); drawRailway(elapsed); drawMechanism(elapsed);
    frame = window.requestAnimationFrame(tick);
  }
  function resize() {
    const rect = canvas.getBoundingClientRect();
    if (rect.width < 2) return;
    width = rect.width; height = rect.height || 380; dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!frame) render();
  }
  const resizeObserver = typeof ResizeObserver === 'function' ? new ResizeObserver((entries) => {
    entries.forEach((entry) => { if (entry.target === canvas) resize(); else if (entry.target === mechCanvas) resizeMechanismCanvas(); });
  }) : null;
  if (resizeObserver) { resizeObserver.observe(canvas); if (mechCanvas) resizeObserver.observe(mechCanvas); }
  else window.addEventListener('resize', () => { resize(); resizeMechanismCanvas(); }, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { if (frame) window.cancelAnimationFrame(frame); frame = 0; lastStamp = 0; }
    else if (playing && !reducedMotion && !frame) { lastStamp = 0; frame = window.requestAnimationFrame(tick); }
  });

  fieldIds.forEach((id) => byId(id)?.addEventListener('input', recalculate));
  physicsFieldIds.forEach((id) => byId(id)?.addEventListener('input', updatePhysicsModel));
  byId('rteSimToggle')?.addEventListener('click', () => {
    playing = !playing;
    const button = byId('rteSimToggle');
    if (button) button.innerHTML = `<span class="rte-btn-dot"></span>${playing ? 'Pause simulation' : 'Resume simulation'}`;
    put('rteSimStatus', playing ? (reducedMotion ? 'STATIC PREVIEW · REDUCED MOTION' : 'SIMULATION RUNNING') : 'SIMULATION PAUSED');
    put('rteAnimBadge', playing ? (reducedMotion ? 'MOTION REDUCED BY DEVICE SETTING' : 'ANIMATION RUNNING') : 'ANIMATION PAUSED');
    if (frame) window.cancelAnimationFrame(frame);
    frame = 0; lastStamp = 0;
    if (playing && !reducedMotion) frame = window.requestAnimationFrame(tick); else render();
  });
  byId('rteSimReset')?.addEventListener('click', () => {
    elapsed = 0; distanceTravelled = 380; previousTrainX = null; lastStamp = 0;
    padVisitLatched = railPadXs.map((_, i) => (padIntensities[i] || 0) > 0.001); liveModulePassEvents = 0; liveEnergyWh = 0;
    put('rteSimStatus', playing ? (reducedMotion ? 'STATIC PREVIEW · REDUCED MOTION' : 'SIMULATION RUNNING') : 'SIMULATION PAUSED');
    put('rteLivePulseCount', '0'); put('rteLiveEnergyWh', energyInputsValid ? '0.000 Wh' : 'CHECK INPUT');
    if (!frame) { render(); drawMechanism(elapsed); }
  });

  recalculate();
  updatePhysicsModel();
  if (reducedMotion) { put('rteSimStatus', 'STATIC PREVIEW · REDUCED MOTION'); put('rteAnimBadge', 'MOTION REDUCED BY DEVICE SETTING'); }
  resize();
  resizeMechanismCanvas();
  if (playing && !reducedMotion && !frame) frame = window.requestAnimationFrame(tick);
})();
