/* IGERS-BD-01 · Defensive Modular Panels
 * Local passive-awareness / civil-resilience workspace. Demo visuals and operator-entered
 * statuses are always identified as simulated/local; no remote asset controls are exposed.
 */
(function () {
  'use strict';
  const root = document.getElementById('defensiveModules');
  if (!root || root.dataset.dmReady === '1') return;
  root.dataset.dmReady = '1';
  const $ = (id) => document.getElementById(id);
  const STORE = {
    modules: 'igers.defmod.modules.v1',
    nodes: 'igers.defmod.nodes.v1',
    log: 'igers.defmod.log.v1'
  };
  const MODULES = ['radar', 'sources', 'infra', 'hazard', 'continuity', 'log'];
  const DEFAULT_NODES = { power: 'normal', telecom: 'normal', transport: 'normal', water: 'normal', response: 'normal' };
  const NODE_INFO = {
    power: { label: 'Power', x: 352, y: 52 },
    telecom: { label: 'Telecom', x: 535, y: 116 },
    transport: { label: 'Transport', x: 470, y: 252 },
    water: { label: 'Water', x: 235, y: 252 },
    response: { label: 'Response', x: 170, y: 116 }
  };
  const SOURCES = [
    { id: 'network', label: 'Browser network', detail: 'Connectivity only; does not prove any data feed is live.' },
    { id: 'adsb', label: 'Public aircraft observation', detail: 'Reads the existing panel payload; coverage varies by provider.' },
    { id: 'marine', label: 'Marine environment panel', detail: 'Reads status text from the existing public-model panel.' },
    { id: 'toll', label: 'Toll / ITS feed', detail: 'Only considered configured when the existing panel reports a configured endpoint.' },
    { id: 'satellite', label: 'Satellite imagery panel', detail: 'Uses the existing panel label; image availability may differ.' }
  ];
  const safeParse = (raw, fallback) => { try { const v = JSON.parse(raw); return v == null ? fallback : v; } catch (_) { return fallback; } };
  const storage = {
    get(key, fallback) { try { return safeParse(localStorage.getItem(key), fallback); } catch (_) { return fallback; } },
    set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch (_) { return false; } }
  };
  const text = (el, value) => { if (el) el.textContent = String(value); };
  const safeNum = (value) => Number.isFinite(Number(value)) ? Number(value) : NaN;
  let moduleState = Object.assign({ radar: true, sources: true, infra: true, hazard: true, continuity: true, log: true }, storage.get(STORE.modules, {}));
  let nodeState = Object.assign({}, DEFAULT_NODES, storage.get(STORE.nodes, {}));
  let logs = storage.get(STORE.log, []);
  if (!Array.isArray(logs)) logs = [];
  logs = logs.filter(item => item && typeof item === 'object').slice(-80);
  let radarRunning = Boolean(moduleState.radar);
  let continuityHoursEstimate = NaN;
  let showDemoEchoes = true;
  let radarAngle = 0;
  let lastFrame = 0;
  let resizeObserver = null;
  const escapeHtml = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[c]);
  const setStatus = (id, message, kind = '') => {
    const el = $(id); if (!el) return;
    el.textContent = message; el.classList.remove('good', 'warn'); if (kind) el.classList.add(kind);
  };

  function getSourceState() {
    const aircraftRows = Array.isArray(window.__igersAirLastPayload) ? window.__igersAirLastPayload : [];
    const marine = $('alsMarineLive')?.textContent?.trim() || '';
    const toll = $('tollNetworkStatus')?.textContent?.trim() || '';
    const sat = $('gibsConnectionStatus')?.textContent?.trim() || $('nasaGibsStatus')?.textContent?.trim() || $('satelliteMonitorStatus')?.textContent?.trim() || '';
    return {
      network: { state: navigator.onLine ? 'BROWSER ONLINE' : 'BROWSER OFFLINE', known: true, good: navigator.onLine, detail: navigator.onLine ? 'Browser network available; feed health not implied.' : 'Browser reports offline.' },
      adsb: { state: aircraftRows.length ? `${aircraftRows.length} OBSERVATION(S)` : 'NO PAYLOAD', known: aircraftRows.length > 0, good: false, detail: aircraftRows.length ? 'Existing app payload found; freshness/coverage must be checked in the original panel.' : 'No public aircraft payload currently exposed to this module.' },
      marine: { state: marine && !/CONNECTING|WAIT|VERIFY/i.test(marine) ? marine.toUpperCase() : 'VERIFY / UNKNOWN', known: Boolean(marine && !/CONNECTING|WAIT|VERIFY/i.test(marine)), good: false, detail: marine ? `Existing marine panel label: ${marine}` : 'Marine panel status label not available.' },
      toll: { state: toll && !/NOT CONFIGURED|UNKNOWN/i.test(toll) ? `${toll.toUpperCase()} · NOT VERIFIED` : 'NOT CONFIGURED', known: Boolean(toll && !/NOT CONFIGURED|UNKNOWN/i.test(toll)), good: false, detail: toll ? `Existing ITS endpoint state: ${toll}; this does not confirm recent records.` : 'No live ITS endpoint state available.' },
      satellite: { state: sat ? sat.toUpperCase().slice(0, 26) : 'REFERENCE / UNKNOWN', known: Boolean(sat), good: false, detail: sat ? `Existing imagery panel state: ${sat}; panel presence alone does not verify data freshness.` : 'No recognized satellite-feed status element; open the original imagery panel.' }
    };
  }

  function updateSourcePanel() {
    const states = getSourceState();
    const list = $('dmSourceList'); if (!list) return;
    list.replaceChildren();
    SOURCES.forEach(source => {
      const info = states[source.id];
      const row = document.createElement('div'); row.className = 'dm-source-row';
      const left = document.createElement('div');
      const name = document.createElement('div'); name.className = 'dm-source-name'; name.textContent = source.label;
      const detail = document.createElement('div'); detail.className = 'dm-source-detail'; detail.textContent = `${info.detail} ${source.detail}`;
      left.append(name, detail);
      const state = document.createElement('div'); state.className = 'dm-source-state'; state.textContent = info.state;
      if (info.good) state.style.color = '#8af3bf'; else state.style.color = '#ffd37a';
      row.append(left, state); list.append(row);
    });
    const dataLinked = ['adsb', 'marine', 'toll', 'satellite'].filter(key => states[key].known).length;
    text($('dmLinkedCount'), `${dataLinked}/4`);
    text($('dmSourceFreshness'), new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    text($('dmSourceFooter'), 'Status audit completed locally. Browser online is not evidence that an external feed is reachable.');
  }

  function syncModuleButtons() {
    root.querySelectorAll('[data-dm-module-toggle]').forEach(button => {
      const key = button.getAttribute('data-dm-module-toggle');
      const article = root.querySelector(`[data-dm-module="${key}"]`);
      const enabled = Boolean(moduleState[key]);
      if (article) article.classList.toggle('dm-is-disabled', !enabled);
      button.textContent = enabled ? 'Module ON' : 'Module OFF';
      button.setAttribute('aria-pressed', String(enabled));
      button.setAttribute('aria-label', `${enabled ? 'Disable' : 'Enable'} ${key} module`);
    });
    text($('dmModuleCount'), `${MODULES.filter(k => moduleState[k]).length} / ${MODULES.length}`);
    storage.set(STORE.modules, moduleState);
  }

  function cycleNodeStatus(key) {
    const seq = ['normal', 'degraded', 'outage'];
    const current = seq.indexOf(nodeState[key]);
    nodeState[key] = seq[(current + 1) % seq.length];
    storage.set(STORE.nodes, nodeState); renderNodes();
  }
  function renderNodes() {
    root.querySelectorAll('[data-dm-node]').forEach(button => {
      const key = button.getAttribute('data-dm-node'); const state = nodeState[key] || 'normal';
      button.dataset.status = state;
      const status = button.querySelector('[data-dm-node-status]');
      if (status) status.textContent = state === 'normal' ? 'AVAILABLE' : state === 'degraded' ? 'DEGRADED' : 'OUTAGE';
      button.setAttribute('aria-label', `${NODE_INFO[key]?.label || key}: local scenario status ${state}. Click to cycle status.`);
      const svgNode = root.querySelector(`[data-dm-svg-node="${key}"]`);
      if (svgNode) {
        const color = state === 'normal' ? '#77efbb' : state === 'degraded' ? '#ffd37a' : '#ff8989';
        svgNode.setAttribute('stroke', color); svgNode.setAttribute('fill', state === 'normal' ? '#0d2c31' : state === 'degraded' ? '#352b19' : '#351a20');
      }
      const meta = root.querySelector(`[data-dm-svg-status="${key}"]`);
      if (meta) { meta.textContent = state.toUpperCase(); meta.setAttribute('fill', state === 'normal' ? '#8af3bf' : state === 'degraded' ? '#ffd37a' : '#ff9898'); }
    });
    const countBad = Object.values(nodeState).filter(s => s !== 'normal').length;
    text($('dmNodeHealth'), countBad === 0 ? '5/5 NORMAL' : `${5 - countBad}/5 NORMAL`);
    text($('dmNodeStatusNote'), countBad === 0 ? 'Local scenario inputs: all five nodes marked available. This is not telemetry.' : `${countBad} of 5 nodes are marked degraded/offline in this browser-only scenario. No external infrastructure was checked or changed.`);
    text($('dmInfraCount'), `${5 - countBad}/5`);
  }

  function calculateContinuity() {
    const capacityEl = $('dmBatteryCapacity');
    const dodEl = $('dmBatteryDod');
    const efficiencyEl = $('dmBatteryEfficiency');
    const loadEl = $('dmCriticalLoad');
    const controls = [capacityEl, dodEl, efficiencyEl, loadEl];
    const controlsValid = controls.every(el => {
      if (!el || String(el.value).trim() === '') return false;
      const value = Number(el.value);
      if (!Number.isFinite(value)) return false;
      const min = el.min !== '' ? Number(el.min) : -Infinity;
      const max = el.max !== '' ? Number(el.max) : Infinity;
      return value >= min && value <= max;
    });
    const capacity = safeNum(capacityEl?.value);
    const dod = safeNum(dodEl?.value) / 100;
    const efficiency = safeNum(efficiencyEl?.value) / 100;
    const load = safeNum(loadEl?.value);
    const valid = controlsValid && [capacity, dod, efficiency, load].every(Number.isFinite) && capacity > 0 && dod > 0 && dod <= 1 && efficiency > 0 && efficiency <= 1 && load > 0;
    const hoursEl = $('dmContinuityHours'); const energyEl = $('dmContinuityEnergy'); const msg = $('dmContinuityStatus');
    if (!valid) {
      continuityHoursEstimate = NaN;
      text(hoursEl, '—'); text(energyEl, '—'); setStatus('dmContinuityStatus', 'Input error: capacity/load must be positive; DoD and efficiency must be 0–100%.', 'warn'); return;
    }
    const usable = capacity * dod * efficiency;
    const hours = usable / load;
    continuityHoursEstimate = hours;
    text(energyEl, `${usable.toLocaleString(undefined, { maximumFractionDigits: 2 })} kWh`);
    text(hoursEl, `${hours.toLocaleString(undefined, { maximumFractionDigits: 2 })} h`);
    setStatus('dmContinuityStatus', 'Scenario estimate only. Assumes a constant load and excludes inverter standby, temperature derating, aging, surge loads and recharge time.', 'good');
  }

  function renderLog() {
    const list = $('dmLogList'); if (!list) return;
    list.replaceChildren();
    if (!logs.length) {
      const empty = document.createElement('div'); empty.className = 'dm-empty'; empty.textContent = 'No locally recorded events. Add an observation below; entries stay in this browser only.'; list.append(empty);
    } else {
      logs.slice().reverse().forEach(entry => {
        const row = document.createElement('div'); row.className = 'dm-log-item';
        const severity = document.createElement('span'); severity.className = `dm-severity ${entry.severity === 'URGENT' ? 'urgent' : entry.severity === 'WATCH' ? 'watch' : ''}`; severity.textContent = entry.severity;
        const body = document.createElement('div'); const strong = document.createElement('strong'); strong.textContent = `${entry.category} · ${entry.title}`;
        const p = document.createElement('p'); p.textContent = entry.note || 'No additional notes.'; body.append(strong, p);
        const time = document.createElement('time'); const date = new Date(entry.timestamp); time.textContent = Number.isNaN(date.getTime()) ? 'time unknown' : date.toLocaleString();
        row.append(severity, body, time); list.append(row);
      });
    }
    text($('dmLogCount'), `${logs.length} local record${logs.length === 1 ? '' : 's'}`);
    storage.set(STORE.log, logs);
  }
  function downloadFile(filename, content, type) {
    const blob = new Blob([content], { type }); const url = URL.createObjectURL(blob); const a = document.createElement('a');
    a.href = url; a.download = filename; a.rel = 'noopener'; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function exportLogs(kind) {
    if (kind === 'json') return downloadFile('igers-defensive-local-event-log.json', JSON.stringify({ exportedAt: new Date().toISOString(), source: 'Browser-local operator entries; not verified telemetry', records: logs }, null, 2), 'application/json;charset=utf-8');
    const rows = [['timestamp', 'category', 'severity', 'title', 'note'], ...logs.map(e => [e.timestamp, e.category, e.severity, e.title, e.note])];
    const csv = rows.map(row => row.map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',')).join('\r\n');
    downloadFile('igers-defensive-local-event-log.csv', '\ufeff' + csv, 'text/csv;charset=utf-8');
  }

  function addLogEntry(event) {
    event.preventDefault(); const form = event.currentTarget; const formData = new FormData(form);
    const title = String(formData.get('title') || '').trim(); const note = String(formData.get('note') || '').trim();
    if (!title) { setStatus('dmLogStatus', 'Add an event title before saving.', 'warn'); $('dmLogTitle')?.focus(); return; }
    if (title.length > 100 || note.length > 500) { setStatus('dmLogStatus', 'Title limit is 100 characters; notes limit is 500 characters.', 'warn'); return; }
    logs.push({ timestamp: new Date().toISOString(), category: String(formData.get('category') || 'Observation'), severity: String(formData.get('severity') || 'INFO'), title, note });
    logs = logs.slice(-80); form.reset(); renderLog(); setStatus('dmLogStatus', 'Saved to this browser only. No server or authority was contacted.', 'good');
  }

  function buildReport() {
    const report = {
      report_type: 'IGERS Defensive Modular Panels local status snapshot',
      generated_at: new Date().toISOString(),
      boundary: 'Not a government or military feed; no remote controls; all scenario states are local inputs.',
      modules: { ...moduleState },
      browser_network: navigator.onLine ? 'online' : 'offline',
      infrastructure_scenario: { ...nodeState },
      continuity_scenario: {
        battery_kwh: safeNum($('dmBatteryCapacity')?.value), usable_dod_percent: safeNum($('dmBatteryDod')?.value), discharge_efficiency_percent: safeNum($('dmBatteryEfficiency')?.value), critical_load_kw: safeNum($('dmCriticalLoad')?.value), estimated_hours: Number.isFinite(continuityHoursEstimate) ? Number(continuityHoursEstimate.toFixed(6)) : null
      },
      source_states: getSourceState(),
      local_event_log_count: logs.length
    };
    downloadFile('igers-defensive-modular-status-report.json', JSON.stringify(report, null, 2), 'application/json;charset=utf-8');
    setStatus('dmReportStatus', 'Local snapshot exported. Unknown feeds remain unknown; no synthetic live telemetry was added.', 'good');
  }

  const canvas = $('dmRadarCanvas');
  const ctx = canvas?.getContext?.('2d');
  const resizeCanvas = () => {
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect(); if (rect.width <= 0) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2); canvas.width = Math.round(rect.width * dpr); canvas.height = Math.round(rect.height * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  function drawRadar(now) {
    if (!ctx || !canvas) return;
    const w = canvas.clientWidth, h = canvas.clientHeight; if (!w || !h) return;
    const cx = w * .5, cy = h * .53, r = Math.min(w * .42, h * .42);
    ctx.clearRect(0, 0, w, h); ctx.fillStyle = '#06141b'; ctx.fillRect(0, 0, w, h);
    // Subtle technical grid.
    ctx.strokeStyle = 'rgba(80,173,196,.09)'; ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 26) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
    for (let y = 0; y < h; y += 26) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
    ctx.save(); ctx.translate(cx, cy);
    for (let i = 1; i <= 4; i++) { ctx.beginPath(); ctx.arc(0, 0, r * i / 4, 0, Math.PI * 2); ctx.strokeStyle = i === 4 ? 'rgba(111,216,234,.42)' : 'rgba(111,216,234,.2)'; ctx.stroke(); }
    ctx.beginPath(); ctx.moveTo(-r, 0); ctx.lineTo(r, 0); ctx.moveTo(0, -r); ctx.lineTo(0, r); ctx.strokeStyle = 'rgba(111,216,234,.23)'; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-r * .7, -r * .7); ctx.lineTo(r * .7, r * .7); ctx.moveTo(-r * .7, r * .7); ctx.lineTo(r * .7, -r * .7); ctx.strokeStyle = 'rgba(111,216,234,.08)'; ctx.stroke();
    // Stylized coast/infrastructure outline, strictly schematic.
    ctx.beginPath(); ctx.moveTo(-r*.74,-r*.22); ctx.lineTo(-r*.58,-r*.29); ctx.lineTo(-r*.48,-r*.12); ctx.lineTo(-r*.28,-r*.19); ctx.lineTo(-r*.12,-r*.04); ctx.lineTo(r*.03,-r*.09); ctx.lineTo(r*.16,r*.04); ctx.lineTo(r*.35,-r*.02); ctx.lineTo(r*.52,r*.14); ctx.lineTo(r*.67,r*.1); ctx.lineWidth = 1.5; ctx.strokeStyle = 'rgba(138,243,191,.35)'; ctx.stroke();
    // Illustrative sweep; fixed sample echoes are deliberately marked as demo.
    if (radarRunning) {
      const sweep = radarAngle;
      const grad = ctx.createConicalGradient ? null : null;
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, r, sweep - .56, sweep); ctx.closePath();
      const wedge = ctx.createLinearGradient(0, 0, Math.cos(sweep) * r, Math.sin(sweep) * r); wedge.addColorStop(0, 'rgba(93,239,190,.02)'); wedge.addColorStop(1, 'rgba(93,239,190,.2)'); ctx.fillStyle = wedge; ctx.fill();
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(sweep)*r, Math.sin(sweep)*r); ctx.strokeStyle = 'rgba(123,255,203,.8)'; ctx.lineWidth = 1.2; ctx.stroke();
    }
    if (showDemoEchoes) {
      const echoes = [[-.55,-.25],[.25,-.37],[.45,.31],[-.1,.55],[.66,-.06]];
      echoes.forEach(([x,y], i) => {
        const px = x*r, py=y*r; const dist=Math.hypot(x,y); if (dist > 1) return;
        ctx.beginPath(); ctx.arc(px,py,3.4,0,Math.PI*2); ctx.fillStyle = i === 2 ? '#ffd37a' : '#62e8ff'; ctx.fill();
        ctx.beginPath(); ctx.arc(px,py,7+((now/180+i*3)%4),0,Math.PI*2); ctx.strokeStyle = i === 2 ? 'rgba(255,211,122,.32)' : 'rgba(98,232,255,.25)'; ctx.stroke();
      });
    }
    ctx.restore();
    ctx.fillStyle = 'rgba(143,196,211,.72)'; ctx.font = '8px ui-monospace,monospace'; ctx.fillText('RANGE RINGS · NOT TO SCALE', 12, h - 13);
    if (radarRunning) radarAngle += .008;
    if (radarRunning && !document.hidden) lastFrame = requestAnimationFrame(drawRadar);
  }
  function startRadar() { if (!ctx) return; cancelAnimationFrame(lastFrame); resizeCanvas(); radarRunning = true; lastFrame = requestAnimationFrame(drawRadar); text($('dmRadarToggle'), 'Pause sweep'); text($('dmRadarState'), 'LOCAL SIMULATION'); }
  function stopRadar() { radarRunning = false; cancelAnimationFrame(lastFrame); drawRadar(performance.now()); text($('dmRadarToggle'), 'Resume sweep'); text($('dmRadarState'), 'PAUSED · LOCAL DEMO'); }

  root.querySelectorAll('[data-dm-module-toggle]').forEach(button => button.addEventListener('click', () => {
    const key = button.getAttribute('data-dm-module-toggle'); if (!MODULES.includes(key)) return; moduleState[key] = !moduleState[key]; syncModuleButtons();
    if (key === 'radar') { if (moduleState[key]) startRadar(); else stopRadar(); }
  }));
  root.querySelectorAll('[data-dm-node]').forEach(button => button.addEventListener('click', () => cycleNodeStatus(button.getAttribute('data-dm-node'))));
  $('dmRefreshSources')?.addEventListener('click', updateSourcePanel);
  $('dmRadarToggle')?.addEventListener('click', () => radarRunning ? stopRadar() : startRadar());
  $('dmDemoEchoes')?.addEventListener('change', event => { showDemoEchoes = Boolean(event.currentTarget.checked); if (!radarRunning) drawRadar(performance.now()); });
  $('dmResetInfra')?.addEventListener('click', () => { nodeState = { ...DEFAULT_NODES }; storage.set(STORE.nodes, nodeState); renderNodes(); setStatus('dmInfraActionStatus', 'Local scenario states reset to available. No actual asset state was changed.', 'good'); });
  ['dmBatteryCapacity', 'dmBatteryDod', 'dmBatteryEfficiency', 'dmCriticalLoad'].forEach(id => $(id)?.addEventListener('input', calculateContinuity));
  $('dmLogForm')?.addEventListener('submit', addLogEntry);
  $('dmExportJson')?.addEventListener('click', () => exportLogs('json'));
  $('dmExportCsv')?.addEventListener('click', () => exportLogs('csv'));
  $('dmClearLog')?.addEventListener('click', () => {
    if (!logs.length) { setStatus('dmLogStatus', 'Local event log is already empty.'); return; }
    if (!window.confirm('Clear the event records saved in this browser only? Export a copy first if needed.')) return;
    logs = []; renderLog(); setStatus('dmLogStatus', 'Browser-local log cleared. No remote records were changed.', 'good');
  });
  $('dmDownloadReport')?.addEventListener('click', buildReport);
  $('dmRefreshAll')?.addEventListener('click', () => { updateSourcePanel(); renderNodes(); calculateContinuity(); renderLog(); text($('dmLastRefresh'), new Date().toLocaleString()); setStatus('dmRefreshStatus', 'Local module state refreshed. External providers were not queried by this button.', 'good'); });
  window.addEventListener('online', updateSourcePanel); window.addEventListener('offline', updateSourcePanel);
  document.addEventListener('visibilitychange', () => { if (document.hidden) { cancelAnimationFrame(lastFrame); } else if (radarRunning) startRadar(); });
  window.addEventListener('resize', () => { resizeCanvas(); if (!radarRunning) drawRadar(performance.now()); }, { passive: true });
  if ('ResizeObserver' in window && canvas) { resizeObserver = new ResizeObserver(() => { resizeCanvas(); if (!radarRunning) drawRadar(performance.now()); }); resizeObserver.observe(canvas); }
  syncModuleButtons(); updateSourcePanel(); renderNodes(); calculateContinuity(); renderLog(); text($('dmLastRefresh'), new Date().toLocaleString());
  if (moduleState.radar) {
    startRadar();
  } else {
    resizeCanvas(); drawRadar(performance.now());
    text($('dmRadarToggle'), 'Resume sweep'); text($('dmRadarState'), 'PAUSED · LOCAL DEMO');
  }
  window.IGERSDefensiveModules = Object.freeze({
    version: '2026-10-14-defensive-modules-v2',
    getStatus: () => ({ localModules: { ...moduleState }, localInfrastructureScenario: { ...nodeState }, localLogCount: logs.length, sourceStates: getSourceState() })
  });
})();
