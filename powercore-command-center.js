/* IGERS POWERCORE · additive 12-module suite. No legacy panel handlers are replaced. */
(function () {
  'use strict';
  if (window.__igersPowercoreSuite12Loaded) return;
  window.__igersPowercoreSuite12Loaded = true;

  const $ = (id) => document.getElementById(id);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const nowISO = () => new Date().toISOString();
  const timeLabel = (value = Date.now()) => new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const esc = (value) => String(value == null ? '' : value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const validNum = (value) => value !== null && value !== undefined && String(value).trim() !== '' && Number.isFinite(Number(value));
  const number = (id, fallback = 0) => { const el = $(id); return el && validNum(el.value) ? Number(el.value) : fallback; };
  const fmt = (value, digits = 2) => Number.isFinite(value) ? value.toLocaleString(undefined, { maximumFractionDigits: digits }) : '—';
  const readStore = (key, fallback) => { try { const v = localStorage.getItem(key); return v == null ? fallback : JSON.parse(v); } catch (_) { return fallback; } };
  const writeStore = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch (_) { return false; } };
  const removeStore = (key) => { try { localStorage.removeItem(key); } catch (_) {} };
  const setText = (id, value) => { const el = $(id); if (el) el.textContent = String(value); };
  const mainSection = (selector) => $(selector.replace(/^#/, ''));
  const prefKeys = { favorites: 'igersPcSuiteFavoritesV1', compact: 'igersPcSuiteCompactV1', lowMotion: 'igersPcSuiteLowMotionV1', ack: 'igersPcSuiteAlertAckV1', audit: 'igersPcSuiteAuditV1', last: 'igersPcSuiteLastSnapshotV1' };
  let runtimeErrors = readStore('igersPcSuiteRuntimeErrorsV1', []);
  let currentServices = [];
  let activeAlerts = [];
  let deferredInstallPrompt = null;
  let geoFeatures = [];
  let geoStatus = 'GeoJSON not loaded yet.';
  let globeRaf = 0;
  let mapRaf = 0;
  let globeInView = false;
  let mapLayer = { airports: true, aircraft: true };
  let lastEnergy = null;
  let diagnosticsBusy = false;

  const services = [
    { key: 'weather', name: 'Weather', section: '#weather', ids: ['weatherDigitalState', 'weatherLiveIndicator', 'weatherUpdated'], source: 'Existing weather panel' },
    { key: 'seismic', name: 'Earthquake / seismic', section: '#seismic3d', ids: ['quakeFeedState', 'quakeStatus', 'seismicStatus', 'seismicLiveState', 'seismicUpdated', 'quakeUpdated'], source: 'Existing seismic panel' },
    { key: 'air', name: 'Public aircraft', section: '#liveTraffic3d', ids: ['brsLiveFeedState', 'airTrafficStatus', 'airFeedState', 'airLiveStatus'], source: 'Public ADS-B payload when available' },
    { key: 'satellite', name: 'Satellite imagery', section: '#satelliteMonitor', ids: ['gibsStatus', 'gibsState', 'nasaStatus', 'satelliteStatus', 'satelliteState'], source: 'Existing NASA / satellite panel' },
    { key: 'border', name: 'Border visualization', section: '#airDefense3d', ids: ['ad3dNetwork', 'ad3dAircraft', 'bdmFeedState', 'bzmFeedState'], source: 'Local radar visualization + exposed public data' },
    { key: 'energy', name: 'Energy model', section: '#energyLiveUpdate', ids: ['energyEngineState', 'energyLiveBadge', 'energyLast'], source: 'Local engineering calculator' }
  ];

  const airportRefs = [
    ['DAC', 'Dhaka', 90.397783, 23.843347], ['CGP', 'Chattogram', 91.813301, 22.249599], ['ZYL', 'Sylhet', 91.864749, 24.963993],
    ['CXB', "Cox's Bazar", 91.963275, 21.457498], ['RJH', 'Rajshahi', 88.616501, 24.437201], ['JSR', 'Jashore', 89.160797, 23.1838],
    ['SPD', 'Saidpur', 88.908897, 25.759199], ['BZL', 'Barishal', 90.301201, 22.801001], ['TEJ', 'Tejgaon', 90.3827, 23.7788],
    ['BGR', 'Bogura', 89.3673, 24.8493], ['SMR', 'Shamshernagar', 91.9167, 24.3989], ['IRD', 'Ishurdi', 89.0494, 24.1525],
    ['CLA', 'Cumilla', 91.188685, 23.440133], ['THK', 'Thakurgaon', 88.4036, 26.0164], ['LLJ', 'Lalmonirhat', 89.4331, 25.8837],
    ['BAG', 'Khan Jahan Ali (proposed)', 89.78, 22.65]
  ];
  const mapBounds = { minLon: 87.4, maxLon: 93.0, minLat: 20.45, maxLat: 26.45 };

  function textFrom(ids) {
    for (const id of ids) {
      const el = $(id);
      if (!el) continue;
      const text = (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim();
      if (text && !/^(-+|n\/a|unknown|loading\.\.\.)$/i.test(text)) return { id, text: text.slice(0, 220) };
    }
    return null;
  }

  function classifyText(text) {
    const value = String(text || '').toLowerCase();
    if (!value || /^[-—]+$/.test(value) || /^(unknown|n\/a|not exposed|not reported|no data)$/i.test(value)) return 'unknown';
    if (/\b(error|failed|offline|disconnected|unavailable|http\s*4\d\d|http\s*5\d\d)\b/.test(value)) return 'bad';
    if (/\b(stale|fallback|degraded|limited|waiting|syncing|loading|not verified|not available|reference only|unknown)\b/.test(value)) return 'warn';
    if (/\b(live|online|connected|updated|nominal|ready|loaded|active|ok)\b/.test(value)) return 'good';
    return 'unknown';
  }

  function airPayloadInfo() {
    const payload = window.__igersAirLastPayload;
    if (!Array.isArray(payload)) return { hasPayload: false, valid: [], timestamp: Number(window.__igersAirLastSync) || null, age: null };
    const valid = payload.filter((row) => {
      const lat = row && (row.lat ?? row.latitude ?? row.lat_deg);
      const lon = row && (row.lon ?? row.lng ?? row.longitude ?? row.lon_deg);
      return validNum(lat) && validNum(lon) && Number(lat) >= -90 && Number(lat) <= 90 && Number(lon) >= -180 && Number(lon) <= 180;
    });
    const timestamp = Number(window.__igersAirLastSync) || null;
    return { hasPayload: true, valid, timestamp, age: timestamp ? Math.max(0, Date.now() - timestamp) : null };
  }

  function observeService(item) {
    const section = mainSection(item.section);
    if (!section) return { ...item, state: 'bad', stateLabel: 'PANEL MISSING', detail: 'Expected panel section was not found.', observedAt: null, age: null };
    if (item.key === 'air') {
      const air = airPayloadInfo();
      if (air.hasPayload && air.timestamp && air.age <= 120000) return { ...item, state: 'good', stateLabel: 'RECENT PUBLIC FEED', detail: `${air.valid.length} coordinate-valid aircraft record(s); provider ${window.__igersAirProvider || 'not exposed'}.`, observedAt: air.timestamp, age: air.age, count: air.valid.length };
      if (air.hasPayload && air.timestamp) return { ...item, state: 'warn', stateLabel: 'STALE OBSERVATION', detail: `Last public payload age ${Math.round(air.age / 1000)}s; ${air.valid.length} valid coordinate record(s).`, observedAt: air.timestamp, age: air.age, count: air.valid.length };
      const signal = textFrom(item.ids);
      return { ...item, state: signal ? classifyText(signal.text) : 'unknown', stateLabel: signal ? classifyText(signal.text).toUpperCase() : 'NO CURRENT PAYLOAD', detail: signal ? `${signal.id}: ${signal.text}` : 'No public aircraft payload timestamp is exposed in this session. This does not prove the provider is down.', observedAt: null, age: null, count: 0 };
    }
    if (item.key === 'border') return { ...item, state: 'simulation', stateLabel: 'SIMULATION / READ-ONLY', detail: 'The animated radar sweep is a visualization. No verified private border-sensor telemetry is connected.', observedAt: null, age: null };
    if (item.key === 'energy') return { ...item, state: 'model', stateLabel: 'LOCAL MODEL', detail: 'Calculator state only; this is not measured energy generation telemetry.', observedAt: null, age: null };
    const signal = textFrom(item.ids);
    if (item.key === 'weather') {
      const last = $('weatherUpdated')?.textContent?.trim();
      const parsed = last ? Date.parse(last) : NaN;
      if (Number.isFinite(parsed) && parsed > Date.now() - 10 * 365 * 86400000 && parsed < Date.now() + 86400000) {
        const age = Math.max(0, Date.now() - parsed);
        return { ...item, state: age < 2 * 3600000 ? 'good' : 'warn', stateLabel: age < 2 * 3600000 ? 'RECENT TIMESTAMP' : 'OLD TIMESTAMP', detail: `Displayed weather timestamp: ${last}; age approximately ${Math.round(age / 60000)} minute(s).`, observedAt: parsed, age };
      }
    }
    return { ...item, state: signal ? classifyText(signal.text) : 'unknown', stateLabel: signal ? classifyText(signal.text).toUpperCase() : 'STATUS NOT EXPOSED', detail: signal ? `${signal.id}: ${signal.text}` : 'Panel exists, but no explicit provider-state element is exposed to this monitor.', observedAt: null, age: null };
  }

  function collectServices() {
    currentServices = services.map(observeService);
    renderServices();
    renderSummary();
    renderAlerts(false);
    return currentServices;
  }

  function stateClass(state) {
    if (state === 'good' || state === 'model') return 'good';
    if (state === 'warn' || state === 'simulation') return 'warn';
    if (state === 'bad') return 'bad';
    return 'unknown';
  }

  function renderServices() {
    const target = $('pcDataMatrix');
    if (!target) return;
    target.innerHTML = currentServices.map((service) => {
      const ageText = service.age == null ? 'Age n/a' : service.age < 60000 ? `${Math.max(0, Math.round(service.age / 1000))}s ago` : `${Math.round(service.age / 60000)}m ago`;
      return `<div class="pc-data-row"><strong>${esc(service.name)}</strong><p>${esc(service.detail)}<br><span class="pc-micro-label">${esc(service.source)} · ${esc(ageText)}</span></p><span class="pc-state-pill ${stateClass(service.state)}"><i class="pc-state-dot ${stateClass(service.state)}"></i>${esc(service.stateLabel)}</span></div>`;
    }).join('');
  }

  function renderSummary() {
    const explicit = currentServices.filter((s) => s.state !== 'unknown').length;
    const degraded = currentServices.filter((s) => ['warn', 'bad'].includes(s.state)).length;
    const errorCount = runtimeErrors.length;
    setText('pcKnownCount', `${explicit} / ${currentServices.length}`);
    setText('pcDegradedCount', String(degraded));
    setText('pcLastRefresh', timeLabel());
    setText('pcNetworkSummary', navigator.onLine ? 'Browser network: online · external feeds still separately verified' : 'Browser network: offline');
    setText('pcReportSourceCount', String(currentServices.length));
    setText('pcErrorCount', String(errorCount));
    updateRuntimeStatus();
  }

  function keyForAlert(item) { return `${item.key}:${item.state}:${String(item.detail || '').slice(0, 50)}`; }
  function getAlerts() {
    const ack = readStore(prefKeys.ack, []);
    const alerts = [];
    currentServices.forEach((service) => {
      if (service.state === 'bad') alerts.push({ key: keyForAlert(service), level: 'error', title: `${service.name}: error / offline state`, message: service.detail, source: service.name });
      else if (service.state === 'warn') alerts.push({ key: keyForAlert(service), level: 'warning', title: `${service.name}: stale / degraded state`, message: service.detail, source: service.name });
    });
    if (!navigator.onLine) alerts.push({ key: 'browser:offline', level: 'warning', title: 'Browser network is offline', message: 'Online maps and external providers may be unavailable. Bundled panels can still render where assets are already loaded.', source: 'Browser runtime' });
    runtimeErrors.slice(-3).forEach((err) => alerts.push({ key: `runtime:${err.key}`, level: 'error', title: 'JavaScript runtime error observed', message: err.message, source: err.source || 'Current browser session' }));
    activeAlerts = alerts.map((a) => ({ ...a, acknowledged: ack.includes(a.key) }));
    return activeAlerts;
  }

  function renderAlerts(runScan = true) {
    const target = $('pcAlertList');
    if (!target) return;
    const alerts = getAlerts();
    const unacked = alerts.filter((a) => !a.acknowledged).length;
    setText('pcAlertCount', String(unacked));
    if (!alerts.length) {
      target.innerHTML = '<div class="pc-empty">No explicit error, stale or offline state was detected in the exposed indicators. Unknown providers remain unknown, not “verified healthy”.</div>';
      setText('pcAlertSummary', runScan ? `State scan completed · ${timeLabel()}. No remote system was contacted.` : 'No unacknowledged state-derived alerts at the last scan.');
      return;
    }
    target.innerHTML = alerts.map((a) => `<article class="pc-alert ${a.level}"><i></i><div><strong>${esc(a.title)}${a.acknowledged ? ' · ACKNOWLEDGED' : ''}</strong><p>${esc(a.message)}</p></div><small>${a.acknowledged ? 'LOCAL ACK' : esc(timeLabel())}</small></article>`).join('');
    setText('pcAlertSummary', `${alerts.length} source-state alert(s), ${unacked} unacknowledged. Records are local; no remote emergency action is triggered.`);
  }

  function xy(lon, lat, w, h) {
    const px = Math.max(16, w * 0.055), py = 26;
    return [px + (lon - mapBounds.minLon) / (mapBounds.maxLon - mapBounds.minLon) * (w - 2 * px), py + (mapBounds.maxLat - lat) / (mapBounds.maxLat - mapBounds.minLat) * (h - py - 18)];
  }
  function geomRings(geometry) {
    if (!geometry) return [];
    if (geometry.type === 'Polygon') return (geometry.coordinates || []).map((ring) => ({ ring, close: true, kind: 'area' }));
    if (geometry.type === 'MultiPolygon') return (geometry.coordinates || []).flatMap((polygon) => (polygon || []).map((ring) => ({ ring, close: true, kind: 'area' })));
    if (geometry.type === 'LineString') return [{ ring: geometry.coordinates || [], close: false, kind: 'line' }];
    if (geometry.type === 'MultiLineString') return (geometry.coordinates || []).map((ring) => ({ ring, close: false, kind: 'line' }));
    return [];
  }
  function drawMap() {
    const canvas = $('pcUnifiedMapCanvas');
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = rect.width, h = rect.height;
    if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) { canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr); }
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const grad = ctx.createLinearGradient(0, 0, w, h); grad.addColorStop(0, '#061b29'); grad.addColorStop(1, '#020912');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(103,210,226,.08)'; ctx.lineWidth = 1;
    for (let lon = 88; lon < 93; lon += 1) { const [x] = xy(lon, 23, w, h); ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
    for (let lat = 21; lat < 27; lat += 1) { const [, y] = xy(90, lat, w, h); ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
    let boundaryFound = false;
    geoFeatures.forEach((feature) => {
      const props = feature.properties || {};
      const isLine = /river|waterway|river/i.test(String(props.layer || props.name || props.type || '')) || feature.geometry?.type?.includes('Line');
      const isRelevant = !props.layer || /national-boundary|bangladesh|river|water/i.test(String(props.layer)) || /bangladesh|river/i.test(String(props.name || ''));
      if (!isRelevant) return;
      for (const entry of geomRings(feature.geometry)) {
        if (!entry.ring || entry.ring.length < 2) continue;
        ctx.beginPath(); entry.ring.forEach((point, index) => { if (!Array.isArray(point) || point.length < 2) return; const p = xy(Number(point[0]), Number(point[1]), w, h); if (!index) ctx.moveTo(p[0], p[1]); else ctx.lineTo(p[0], p[1]); });
        if (entry.close) { ctx.closePath(); ctx.fillStyle = 'rgba(27,122,128,.12)'; ctx.fill(); ctx.strokeStyle = 'rgba(119,232,220,.68)'; ctx.lineWidth = 1.25; ctx.stroke(); boundaryFound = true; }
        else { ctx.strokeStyle = isLine ? 'rgba(89,184,219,.34)' : 'rgba(89,184,219,.22)'; ctx.lineWidth = isLine ? 1 : .7; ctx.stroke(); }
      }
    });
    if (!boundaryFound) {
      const fallback = [[88.02,25.19],[88.42,26.42],[89.05,26.25],[89.72,25.95],[90.4,25.2],[91.1,25.15],[92.1,24.9],[92.62,24.1],[92.3,23.5],[91.9,22.4],[91.55,21.65],[90.65,21.58],[90.2,21.85],[89.7,22.2],[89.2,22.2],[88.7,22.5],[88.1,23.1],[88.15,24.1]];
      ctx.beginPath(); fallback.forEach((p, i) => { const pos = xy(p[0], p[1], w, h); if (!i) ctx.moveTo(pos[0], pos[1]); else ctx.lineTo(pos[0], pos[1]); }); ctx.closePath(); ctx.fillStyle = 'rgba(27,122,128,.12)'; ctx.fill(); ctx.strokeStyle = 'rgba(119,232,220,.55)'; ctx.stroke();
    }
    if (mapLayer.airports) airportRefs.forEach((airport) => {
      if (airport[2] < mapBounds.minLon || airport[2] > mapBounds.maxLon || airport[3] < mapBounds.minLat || airport[3] > mapBounds.maxLat) return;
      const [x, y] = xy(airport[2], airport[3], w, h); ctx.beginPath(); ctx.fillStyle = airport[0] === 'BAG' ? '#cbb0ff' : '#8af3bf'; ctx.strokeStyle = 'rgba(3,15,23,.9)'; ctx.lineWidth = 1; ctx.arc(x, y, airport[0] === 'DAC' ? 4.5 : 3, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      if (w > 550 || airport[0] === 'DAC' || airport[0] === 'CGP' || airport[0] === 'ZYL' || airport[0] === 'RJH') { ctx.font = '700 8px system-ui'; ctx.fillStyle = '#d7f4f7'; ctx.fillText(airport[0], x + 5, y - 4); }
    });
    let aircraftCount = 0;
    if (mapLayer.aircraft) {
      const info = airPayloadInfo();
      info.valid.forEach((aircraft) => {
        const lat = Number(aircraft.lat ?? aircraft.latitude ?? aircraft.lat_deg), lon = Number(aircraft.lon ?? aircraft.lng ?? aircraft.longitude ?? aircraft.lon_deg);
        if (lat < mapBounds.minLat || lat > mapBounds.maxLat || lon < mapBounds.minLon || lon > mapBounds.maxLon) return;
        const [x, y] = xy(lon, lat, w, h); ctx.beginPath(); ctx.fillStyle = '#ffd28a'; ctx.shadowColor = '#ffd28a'; ctx.shadowBlur = 8; ctx.arc(x, y, 3.6, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0; aircraftCount++;
      });
    }
    setText('pcMapStatus', `${geoStatus} · ${boundaryFound ? 'Bundled GeoJSON layer drawn' : 'Schematic fallback outline drawn'} · ${mapLayer.airports ? airportRefs.length + ' airport reference markers' : 'airport layer off'} · ${mapLayer.aircraft ? aircraftCount + ' valid public aircraft coordinate(s) in view' : 'aircraft layer off'}. Aircraft are drawn only from the existing public payload; airport markers are reference locations, not live movement.`);
    setText('pcMapFeedBadge', aircraftCount ? `MAP + ${aircraftCount} PUBLIC COORDINATE(S)` : 'REFERENCE MAP · NO VALID AIRCRAFT IN VIEW');
  }

  function globeDrawOnce() {
    const canvas = $('pcGlobeCanvas'); if (!canvas) return;
    const rect = canvas.getBoundingClientRect(); if (!rect.width || !rect.height) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1), w = rect.width, h = rect.height;
    if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) { canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr); }
    const ctx = canvas.getContext('2d'); if (!ctx) return; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h);
    const radius = Math.min(w * .22, h * .35, 118), cx = w * .5, cy = h * .45;
    const g = ctx.createRadialGradient(cx - radius * .38, cy - radius * .48, radius * .08, cx, cy, radius * 1.24); g.addColorStop(0, 'rgba(79,192,210,.5)'); g.addColorStop(.55, 'rgba(12,65,91,.67)'); g.addColorStop(1, 'rgba(2,13,26,.96)');
    ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, radius, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill(); ctx.clip();
    ctx.strokeStyle = 'rgba(131,228,236,.25)'; ctx.lineWidth = .7;
    for (let k = -3; k <= 3; k++) { const ry = radius * Math.sqrt(Math.max(0.06, 1 - (k / 4) ** 2)) * .32; const y = cy + k * radius * .22; ctx.beginPath(); ctx.ellipse(cx, y, radius * Math.sqrt(Math.max(.04, 1 - (k / 4) ** 2)), ry, 0, 0, Math.PI * 2); ctx.stroke(); }
    const angle = (Date.now() / 15000) % (Math.PI * 2);
    for (let i = 0; i < 7; i++) { const phase = angle + i * Math.PI / 7; ctx.beginPath(); ctx.ellipse(cx, cy, Math.max(1, Math.abs(Math.cos(phase)) * radius), radius, 0, 0, Math.PI * 2); ctx.stroke(); }
    // A stylized locator glow; not a globally accurate Earth texture.
    const bx = cx + radius * .17, by = cy + radius * .16; const glow = ctx.createRadialGradient(bx, by, 0, bx, by, radius * .3); glow.addColorStop(0, 'rgba(131,214,179,.8)'); glow.addColorStop(1, 'rgba(131,214,179,0)'); ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(bx, by, radius * .3, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    ctx.strokeStyle = 'rgba(103,210,226,.72)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(cx, cy, radius, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = 'rgba(103,210,226,.17)'; ctx.beginPath(); ctx.ellipse(cx, cy, radius * 1.32, radius * .36, -.2, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = '#a9eaf0'; ctx.font = '700 9px ui-monospace,monospace'; ctx.fillText('BD-01 / SYSTEM CONTEXT', Math.max(10, cx - 81), Math.min(h - 30, cy + radius + 30));
  }
  function globeLoop() {
    if (document.hidden || !globeInView || document.body.classList.contains('pc-low-motion') || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) { globeRaf = 0; globeDrawOnce(); return; }
    globeDrawOnce(); globeRaf = requestAnimationFrame(globeLoop);
  }

  function energyModeChanged() {
    const mode = $('pcEnergySource')?.value || 'kinetic';
    ['kinetic', 'wind', 'hydro', 'solar'].forEach((name) => $(`pc${name.charAt(0).toUpperCase()}${name.slice(1)}Inputs`)?.classList.toggle('pc-hidden', name !== mode));
    calculateEnergy();
  }
  function calculatePowerModel(mode, p) {
    let primaryValue = NaN, primaryUnit = '', primaryLabel = '', annual = NaN, formula = '', basis = '', detail = '';
    if (mode === 'kinetic') {
      const mass = p.pcMass, vin = p.pcVin, vout = p.pcVout, eff = p.pcEffKinetic / 100, events = p.pcAnnualEvents;
      if ([mass, vin, vout, eff, events].some((x) => !Number.isFinite(x) || x < 0) || vin > 500 || vout > 500 || eff > 1) return { ok: false, error: 'Inputs must be finite and non-negative; vehicle speeds must be ≤ 500 km/h and efficiency must be 0–100%.' };
      const vi = vin / 3.6, vo = vout / 3.6;
      const grossJ = Math.max(0, .5 * mass * (vi * vi - vo * vo));
      const netJ = grossJ * eff;
      // Kinetic scenario output is energy per event, NOT power. Keep the physical unit explicit.
      primaryValue = netJ / 1000; primaryUnit = 'kJ/event'; primaryLabel = 'Estimated recoverable energy per event'; annual = netJ * events / 3600000;
      formula = 'E = ½m(vin² − vout²) × η'; basis = 'kJ/event';
      detail = `Gross kinetic-energy reduction ${fmt(grossJ / 1000)} kJ/event; estimated recovered ${fmt(primaryValue)} kJ/event at ${fmt(eff * 100, 1)}% net efficiency, with ${fmt(events)} assumed events/year. ${vout > vin ? 'Exit speed exceeds entry speed; recoverable deceleration energy is set to zero.' : ''}`;
    } else if (mode === 'wind') {
      const area = p.pcWindArea, rho = p.pcAirDensity, v = p.pcWindSpeed, cp = p.pcCp, eff = p.pcEffWind / 100, hours = p.pcWindHours;
      if ([area, rho, v, cp, eff, hours].some((x) => !Number.isFinite(x) || x < 0) || rho > 2 || v > 120 || cp > .593 || eff > 1 || hours > 8760) return { ok: false, error: 'Check wind inputs. Air density must be ≤ 2 kg/m³, Cp is capped at 0.593 (ideal Betz limit), efficiency must be 0–100% and hours/year ≤ 8760.' };
      primaryValue = .5 * rho * area * v ** 3 * cp * eff / 1000; primaryUnit = 'kW'; primaryLabel = 'Estimated electrical power'; annual = primaryValue * hours; formula = 'P = ½ρAv³Cpη'; basis = 'kW at entered wind speed';
      detail = `Using air density ${fmt(rho, 3)} kg/m³, area ${fmt(area)} m², speed ${fmt(v)} m/s, Cp ${fmt(cp, 3)}, electrical efficiency ${fmt(eff * 100, 1)}% and assumed operating hours ${fmt(hours)} h/year.`;
    } else if (mode === 'hydro') {
      const q = p.pcFlow, head = p.pcHead, eff = p.pcEffHydro / 100, rho = p.pcWaterDensity, hours = p.pcHydroHours;
      if ([q, head, eff, rho, hours].some((x) => !Number.isFinite(x) || x < 0) || eff > 1 || hours > 8760) return { ok: false, error: 'Hydraulic inputs must be non-negative; efficiency must be 0–100% and operating hours/year ≤ 8760.' };
      primaryValue = rho * 9.80665 * q * head * eff / 1000; primaryUnit = 'kW'; primaryLabel = 'Estimated electrical power'; annual = primaryValue * hours; formula = 'P = ρgQHη'; basis = 'kW at entered flow/head';
      detail = `Using ρ=${fmt(rho)} kg/m³, g=9.80665 m/s², Q=${fmt(q, 4)} m³/s, net head ${fmt(head)} m, efficiency ${fmt(eff * 100, 1)}% and assumed operating hours ${fmt(hours)} h/year.`;
    } else if (mode === 'solar') {
      const irradiance = p.pcIrradiance, area = p.pcSolarArea, eff = p.pcSolarEff / 100, derate = p.pcSolarDerate / 100, sunHours = p.pcSunHours, days = p.pcSolarDays;
      if ([irradiance, area, eff, derate, sunHours, days].some((x) => !Number.isFinite(x) || x < 0) || irradiance > 1600 || eff > 1 || derate > 1 || sunHours > 24 || days > 366) return { ok: false, error: 'Solar inputs must be non-negative; efficiencies/derate must be 0–100%, sun hours/day ≤ 24 and days/year ≤ 366.' };
      primaryValue = irradiance * area * eff * derate / 1000; primaryUnit = 'kW'; primaryLabel = 'Estimated DC-equivalent power'; annual = primaryValue * sunHours * days; formula = 'P = G × A × ηmodule × derate'; basis = 'kW at entered irradiance';
      detail = `Using irradiance ${fmt(irradiance)} W/m², area ${fmt(area)} m², module efficiency ${fmt(eff * 100, 1)}%, system derate ${fmt(derate * 100, 1)}%, ${fmt(sunHours, 2)} assumed peak-sun-hours/day × ${fmt(days)} days/year.`;
    } else return { ok: false, error: 'Choose a supported model.' };
    if (!Number.isFinite(primaryValue) || !Number.isFinite(annual)) return { ok: false, error: 'Output is outside the supported numeric range. Reduce inputs and retry.' };
    return { ok: true, mode, primaryValue, primaryUnit, primaryLabel, estimatedAnnualKWh: annual, formula, basis, detail, dataClass: 'user-input model estimate; not measured telemetry' };
  }

  function calculateEnergy() {
    const mode = $('pcEnergySource')?.value || 'kinetic';
    const result = calculatePowerModel(mode, readEnergyInputs());
    if (!result.ok) return energyError(result.error);
    lastEnergy = { ...result, assumptions: readEnergyInputs(), generatedAt: nowISO() };
    setText('pcEnergyPower', `${fmt(result.primaryValue, 5)} ${result.primaryUnit}`);
    setText('pcEnergyPrimaryLabel', result.primaryLabel);
    setText('pcEnergyAnnual', `${fmt(result.estimatedAnnualKWh, 3)} kWh/y`);
    setText('pcEnergyFormulaLabel', result.basis);
    setText('pcEnergyFormula', `${result.formula}. ${result.detail} Annual energy is based on user-entered event count / operating hours / solar exposure. This is a theoretical model estimate, not measured output or a feasibility certification.`);
    setText('pcEnergyConfidence', 'INPUT-BASED ESTIMATE'); drawEnergyGraph(result.primaryValue); return lastEnergy;
  }
  function energyError(message) { setText('pcEnergyPower', 'Invalid'); setText('pcEnergyAnnual', '—'); setText('pcEnergyFormulaLabel', 'Input error'); setText('pcEnergyFormula', message); setText('pcEnergyConfidence', 'CHECK INPUTS'); lastEnergy = { error: message, mode: $('pcEnergySource')?.value || 'unknown', generatedAt: nowISO(), dataClass: 'calculation rejected' }; drawEnergyGraph(0); return null; }
  function readEnergyInputs() {
    const ids = ['pcMass','pcVin','pcVout','pcEffKinetic','pcAnnualEvents','pcWindArea','pcAirDensity','pcWindSpeed','pcCp','pcEffWind','pcWindHours','pcFlow','pcHead','pcEffHydro','pcWaterDensity','pcHydroHours','pcIrradiance','pcSolarArea','pcSolarEff','pcSolarDerate','pcSunHours','pcSolarDays'];
    return Object.fromEntries(ids.filter((id) => $(id)).map((id) => [id, number(id, NaN)]));
  }
  function drawEnergyGraph(value) {
    const canvas = $('pcEnergyGraph'); if (!canvas) return; const rect = canvas.getBoundingClientRect(); if (!rect.width || !rect.height) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1), w = rect.width, h = rect.height; canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr); const ctx = canvas.getContext('2d'); if (!ctx) return; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(103,210,226,.11)'; ctx.lineWidth = 1; for (let i = 1; i < 5; i++) { const y = h * i / 5; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
    ctx.fillStyle = 'rgba(158,184,199,.8)'; ctx.font = '9px ui-monospace,monospace'; ctx.fillText('CURRENT MODEL OUTPUT · LOG SCALE IN DISPLAYED UNIT', 12, 16);
    const barMax = Math.max(0, Number(value) || 0), width = Math.min(w - 34, (Math.log10(1 + barMax) / Math.log10(1 + Math.max(1000, barMax))) * (w - 40));
    const grad = ctx.createLinearGradient(14, 0, Math.max(15, 14 + width), 0); grad.addColorStop(0, '#357f9e'); grad.addColorStop(1, '#8ce7c2'); ctx.fillStyle = grad; ctx.fillRect(14, h - 39, Math.max(2, width), 20); ctx.fillStyle = '#dffaff'; ctx.font = '700 10px ui-monospace,monospace'; ctx.fillText(`${fmt(barMax, 5)} kW`, 14, h - 47);
  }
  function resetEnergyInputs() {
    const defaults = { pcMass:900,pcVin:20,pcVout:15,pcEffKinetic:20,pcAnnualEvents:210000,pcWindArea:4,pcAirDensity:1.225,pcWindSpeed:6,pcCp:.35,pcEffWind:85,pcWindHours:2000,pcFlow:.1,pcHead:3,pcEffHydro:70,pcWaterDensity:1000,pcHydroHours:4000,pcIrradiance:800,pcSolarArea:2,pcSolarEff:20,pcSolarDerate:85,pcSunHours:4.5,pcSolarDays:300 };
    Object.entries(defaults).forEach(([id, value]) => { if ($(id)) $(id).value = String(value); }); calculateEnergy();
  }

  function download(filename, type, content) {
    try { const blob = new Blob([content], { type }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = filename; a.style.display = 'none'; document.body.appendChild(a); a.click(); setTimeout(() => { a.remove(); URL.revokeObjectURL(url); }, 1200); return true; }
    catch (error) { setText('pcReportState', `Download could not be started: ${error.message}`); return false; }
  }
  function snapshot() {
    const snapshot = { application: 'IGERS POWERCORE', generatedAt: nowISO(), version: 'powercore-12-upgrades-v2', browser: { online: navigator.onLine !== false, standalone: !!window.matchMedia?.('(display-mode: standalone)').matches, visibility: document.visibilityState }, integrity: currentServices.map((s) => ({ name: s.name, state: s.state, label: s.stateLabel, source: s.source, detail: s.detail, observedAt: s.observedAt ? new Date(s.observedAt).toISOString() : null, ageMilliseconds: s.age })), alerts: getAlerts().map((a) => ({ level: a.level, title: a.title, message: a.message, acknowledged: a.acknowledged, source: a.source })), energyModel: lastEnergy || { state: 'not calculated yet' }, diagnostics: { runtimeErrors: runtimeErrors.slice(-20), localResourcesOnly: true }, notes: ['Unknown data sources are not classified as healthy.', 'Simulations are not live telemetry.', 'No credentials or form contents are included.'] };
    writeStore(prefKeys.last, snapshot); setText('pcReportGenerated', timeLabel()); return snapshot;
  }
  function reportJSON() { const snap = snapshot(); const ok = download(`igers-powercore-snapshot-${new Date().toISOString().replace(/[:.]/g, '-')}.json`, 'application/json;charset=utf-8', JSON.stringify(snap, null, 2)); setText('pcReportState', ok ? 'JSON snapshot download started. Includes data class, timestamps, unknown states and assumptions.' : 'Download unavailable in this browser.'); audit('report exported', 'JSON status snapshot'); }
  function reportCSV() {
    const snap = snapshot(); const rows = [['Type','Name','State','Source','Detail','Observed At','Age ms']]; snap.integrity.forEach((s) => rows.push(['source',s.name,s.label,s.source,s.detail,s.observedAt || '',s.ageMilliseconds ?? ''])); snap.alerts.forEach((a) => rows.push(['alert',a.title,a.acknowledged ? 'acknowledged' : a.level,a.source,a.message,'','']));
    if (snap.energyModel && !snap.energyModel.error) rows.push(['model',snap.energyModel.mode,snap.energyModel.dataClass,'user inputs',`${snap.energyModel.formula}; ${snap.energyModel.detail || ''}`,snap.energyModel.generatedAt || '', '']);
    const csv = rows.map((r) => r.map((v) => { const text = String(v == null ? '' : v); return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text; }).join(',')).join('\r\n');
    const ok = download(`igers-powercore-snapshot-${new Date().toISOString().replace(/[:.]/g, '-')}.csv`, 'text/csv;charset=utf-8', csv); setText('pcReportState', ok ? 'CSV snapshot download started.' : 'Download unavailable in this browser.'); audit('report exported', 'CSV status snapshot');
  }
  function printReport(button) {
    const section = button.closest('section'); if (section) { $$('main>section[data-pc-print-active="true"]').forEach((el) => el.removeAttribute('data-pc-print-active')); section.setAttribute('data-pc-print-active', 'true'); }
    document.body.classList.add('pc-printing-report'); audit('print report opened', section?.id || 'current section');
    const clean = () => { document.body.classList.remove('pc-printing-report'); $$('main>section[data-pc-print-active="true"]').forEach((el) => el.removeAttribute('data-pc-print-active')); window.removeEventListener('afterprint', clean); };
    window.addEventListener('afterprint', clean, { once: true }); window.print(); setTimeout(clean, 30000);
  }

  const favoriteOptions = [
    ['#weather','Weather'],['#seismic3d','Earthquake / Seismic 3D'],['#liveTraffic3d','3D Flight Monitor'],['#airDefense3d','3D Early Warning'],['#borderMonitor','Border Monitor'],['#satelliteMonitor','Satellite Monitor'],['#energyLiveUpdate','Energy Calculation'],['#analytics','Data Analysis'],['#systemControl','System Control'],['#tollNationalPro','Toll Intelligence'],['#commandCenter','Command Center'],['#engineeringLab','Engineering Lab'],['#operationsHealth','Operations & App Health']
  ];
  function loadFavorites() { const favorites = readStore(prefKeys.favorites, []); renderFavorites(Array.isArray(favorites) ? favorites : []); }
  function renderFavorites(favorites) {
    const target = $('pcFavoriteList'); if (!target) return;
    const valid = favorites.filter((f) => favoriteOptions.some(([id]) => id === f) && mainSection(f));
    if (!valid.length) { target.innerHTML = '<div class="pc-empty">No pinned panels yet. Choose a panel above and pin it for quick access.</div>'; return; }
    target.innerHTML = valid.map((id) => { const opt = favoriteOptions.find(([x]) => x === id); return `<a class="pc-favorite-link" href="${id}">✦ ${esc(opt ? opt[1] : id)}</a>`; }).join('');
  }
  function pinFavorite() {
    const id = $('pcFavoriteSelect')?.value; if (!id || !mainSection(id)) { setText('pcPersonalizeState', 'That panel is not available in this build.'); return; }
    const list = readStore(prefKeys.favorites, []); const favorites = Array.isArray(list) ? list : [];
    if (!favorites.includes(id)) favorites.push(id);
    if (!writeStore(prefKeys.favorites, favorites.slice(0, 12))) { setText('pcPersonalizeState', 'Browser storage is unavailable; pin was not saved.'); return; }
    renderFavorites(favorites.slice(0, 12)); setText('pcPersonalizeState', `${favoriteOptions.find(([x]) => x === id)?.[1] || id} pinned locally.`); audit('panel pinned', id);
  }

  function adminSessionActive() {
    try { return ['igersAirWarnAdminV1','igersEnergyAdminV1','igersAdvancedAdminV1'].some((key) => sessionStorage.getItem(key) === '1'); } catch (_) { return false; }
  }
  function audit(action, detail) {
    const items = readStore(prefKeys.audit, []); const logs = Array.isArray(items) ? items : [];
    const sensitive = /password|credential|token|secret|email|message content/i.test(`${action} ${detail}`);
    if (sensitive) return;
    logs.unshift({ at: nowISO(), action: String(action).slice(0, 90), detail: String(detail || '').slice(0, 180), adminSession: adminSessionActive() });
    writeStore(prefKeys.audit, logs.slice(0, 100)); renderAudit();
  }
  function renderAudit() {
    const target = $('pcAuditList'); if (!target) return;
    const logs = readStore(prefKeys.audit, []); const list = Array.isArray(logs) ? logs : [];
    if (!list.length) { target.innerHTML = '<div class="pc-empty">No local actions recorded yet.</div>'; return; }
    target.innerHTML = list.slice(0, 35).map((row) => `<div class="pc-audit-row"><time>${esc(timeLabel(Date.parse(row.at) || Date.now()))}</time><div><strong>${esc(row.action)}</strong><br><span>${esc(row.detail || 'No detail')}</span></div></div>`).join('');
  }

  function drawSimulationState() {
    const scenario = $('pcSimScenario')?.value || 'runway', stage = $('pcSimStage');
    if (!stage) return;
    stage.classList.toggle('pc-scenario-energy', scenario === 'energy'); stage.classList.toggle('pc-scenario-map', scenario === 'map');
    if ($('pcSimPlane')) $('pcSimPlane').textContent = scenario === 'energy' ? 'ϟ' : scenario === 'map' ? '◉' : '✈';
    const descriptions = {
      runway: 'Airport runway movement is a schematic animation. It is not to scale, not linked to ATC and not for navigation or pilot training.',
      energy: 'Energy conversion scenario: flow → converter → storage → load. The moving symbol is illustrative; no physical machine telemetry is connected.',
      map: 'Geospatial scan scenario. A decorative scan ring moves over the scene; it is not live border-sensor coverage or a real radar sweep.'
    };
    setText('pcSimDescription', descriptions[scenario]);
    const links = { runway: ['#liveTraffic3d','Open airport/runway panel ↗'], energy: ['#energyLiveUpdate','Open energy calculator ↗'], map: ['#airDefense3d','Open early-warning panel ↗'] };
    const a = $('pcSimOpenLive'); if (a) { a.href = links[scenario][0]; a.textContent = links[scenario][1]; }
  }
  function simRun() { const stage = $('pcSimStage'); if (stage) stage.classList.add('running'); setText('pcSimRun', '▶ Running'); audit('simulation started', $('pcSimScenario')?.value || 'runway'); }
  function simPause() { const stage = $('pcSimStage'); if (stage) stage.classList.remove('running'); setText('pcSimRun', '▶ Run scenario'); audit('simulation paused', $('pcSimScenario')?.value || 'runway'); }
  function simReset() {
    simPause();
    const plane = $('pcSimPlane');
    if (plane) { plane.style.left = ''; plane.style.top = ''; }
    drawSimulationState();
    setText('pcSimDescription', `Scenario reset. ${$('pcSimDescription')?.textContent || 'Animation returned to its initial state.'} Simulation only.`);
    audit('simulation reset', $('pcSimScenario')?.value || 'runway');
  }

  async function runDiagnostics() {
    if (diagnosticsBusy) return;
    diagnosticsBusy = true;
    setText('pcDiagBadge', 'RUNNING…');
    const list = $('pcDiagnosticList');
    if (list) list.innerHTML = '<li><span class="pc-check-icon">…</span><span>Checking local resources…</span><small>RUNNING</small></li>';
    const checks = [];
    try {
      const anchors = $$('a[href^="#"]');
      const broken = anchors.filter((a) => {
        const raw = (a.getAttribute('href') || '').slice(1);
        if (!raw) return false;
        let id;
        try { id = decodeURIComponent(raw); } catch (_) { return true; }
        return !!id && !$(id);
      });
      checks.push({ name: 'In-page navigation targets', state: broken.length ? 'warn' : 'good', detail: broken.length ? `${broken.length} hash link(s) without matching IDs or with malformed encoding` : `${anchors.length} hash links resolve` });

      const duplicateIds = [...document.querySelectorAll('[id]')].map((el) => el.id).filter((id, i, arr) => arr.indexOf(id) !== i);
      checks.push({ name: 'Unique DOM IDs', state: duplicateIds.length ? 'bad' : 'good', detail: duplicateIds.length ? [...new Set(duplicateIds)].slice(0, 5).join(', ') : 'No duplicate IDs detected' });
      const criticalSections = ['home','weather','seismic3d','airtraffic','liveTraffic3d','airDefense3d','borderMonitor','satelliteMonitor','energyLiveUpdate','analytics','systemControl','commandCenter','engineeringLab','operationsHealth'];
      const absent = criticalSections.filter((id) => !$(id));
      checks.push({ name: 'Core / upgrade sections', state: absent.length ? 'bad' : 'good', detail: absent.length ? `Missing: ${absent.join(', ')}` : `${criticalSections.length} sections present` });
      const scriptNames = ['section-navigation.js','airport-runway-sim.js','border-monitor.js','nasa-gibs-bd.js','system-master-control.js','powercore-command-center.js'];
      const missingScripts = scriptNames.filter((file) => !$$('script[src]').some((script) => {
        try { return new URL(script.src, location.href).pathname.endsWith('/' + file); } catch (_) { return false; }
      }));
      checks.push({ name: 'Core script references', state: missingScripts.length ? 'bad' : 'good', detail: missingScripts.length ? `Missing tags: ${missingScripts.join(', ')}` : `${scriptNames.length} required script tags present` });

      const sameOriginFiles = ['powercore-command-center.css','powercore-command-center.js','data/bangladesh-boundary-fallback.geojson','sw.js','manifest.webmanifest'];
      const results = await Promise.all(sameOriginFiles.map(async (file) => {
        const controller = typeof AbortController === 'function' ? new AbortController() : null;
        const timer = window.setTimeout(() => controller?.abort(), 8000);
        try {
          const response = await fetch(new URL(file, document.baseURI).href, { cache: 'no-store', ...(controller ? { signal: controller.signal } : {}) });
          return { file, ok: response.ok, status: response.status };
        } catch (error) {
          return { file, ok: false, status: error?.name === 'AbortError' ? 'timeout' : 'network-error' };
        } finally { window.clearTimeout(timer); }
      }));
      results.forEach((result) => checks.push({ name: `Local resource: ${result.file}`, state: result.ok ? 'good' : 'bad', detail: result.ok ? `HTTP ${result.status}` : `Request failed (${result.status})` }));
      const swSupported = 'serviceWorker' in navigator;
      checks.push({ name: 'Service Worker API', state: swSupported ? 'good' : 'warn', detail: swSupported ? 'Browser supports the API; registration result is checked separately.' : 'This context cannot register a service worker.' });
      checks.push({ name: 'External provider status', state: 'unknown', detail: 'Not probed by this static check; inspect each panel’s own source / freshness indicator.' });
      if (list) list.innerHTML = checks.map((check) => `<li><span class="pc-check-icon">${check.state === 'good' ? '✓' : check.state === 'bad' ? '!' : '·'}</span><span>${esc(check.name)}<br><span style="color:var(--ui-muted)">${esc(check.detail)}</span></span><small>${check.state.toUpperCase()}</small></li>`).join('');
      const bad = checks.filter((check) => check.state === 'bad').length;
      const warn = checks.filter((check) => check.state === 'warn').length;
      setText('pcDiagBadge', bad ? 'ISSUES FOUND' : warn ? 'CHECK WARNINGS' : 'CHECKS COMPLETE');
      setText('pcDiagnosticSummary', `${checks.length} local checks completed · ${bad} failed · ${warn} warning(s). External provider availability and full browser rendering are not verified by these checks.`);
      audit('diagnostics run', `${checks.length} checks; ${bad} failed, ${warn} warnings`);
    } catch (error) {
      const message = String(error?.message || error || 'Unexpected diagnostic error').slice(0, 180);
      if (list) list.innerHTML = `<li><span class="pc-check-icon">!</span><span>Diagnostics could not complete<br><span style="color:var(--ui-muted)">${esc(message)}</span></span><small>ERROR</small></li>`;
      setText('pcDiagBadge', 'CHECK FAILED');
      setText('pcDiagnosticSummary', 'The local diagnostic run failed safely. Retry after reloading the page.');
    } finally {
      diagnosticsBusy = false;
    }
  }

  function updateRuntimeStatus() {
    setText('pcNetworkState', navigator.onLine ? 'ONLINE' : 'OFFLINE');
    setText('pcMobileNetwork', navigator.onLine ? 'Online' : 'Offline');
    setText('pcVisibilityState', document.visibilityState || 'Unknown');
    setText('pcViewportSize', `${window.innerWidth} × ${window.innerHeight}`);
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    setText('pcDataSavingState', conn ? (conn.saveData ? 'Enabled by browser' : (conn.effectiveType || 'Browser network')) : 'Not exposed');
    setText('pcDisplayMode', window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone ? 'Standalone' : 'Browser');
    setText('pcServiceWorkerState', 'serviceWorker' in navigator ? (navigator.serviceWorker.controller ? 'Controlled' : 'Supported · checking') : 'Not supported');
    const note = !navigator.onLine ? 'Offline: external services are expected to be unavailable. Cached app assets may still render; live feeds cannot be assumed.' : 'Online browser connection detected. This does not verify reachability of every external provider.';
    setText('pcPerformanceState', note);
  }
  async function updateServiceWorkerState() {
    if (!('serviceWorker' in navigator)) { setText('pcServiceWorkerState', 'Not supported'); return; }
    try { const reg = await navigator.serviceWorker.getRegistration(); setText('pcServiceWorkerState', reg ? (reg.active ? 'Active' : reg.installing ? 'Installing' : 'Registered') : 'Not registered'); }
    catch (_) { setText('pcServiceWorkerState', 'Query failed'); }
  }
  async function installPwa() {
    if (deferredInstallPrompt) {
      try { await deferredInstallPrompt.prompt(); const choice = await deferredInstallPrompt.userChoice; setText('pcInstallState', choice?.outcome === 'accepted' ? 'Install accepted by browser.' : 'Install was dismissed. You can use the browser menu → Add to Home Screen.'); audit('PWA install prompt', choice?.outcome || 'choice unknown'); }
      catch (_) { setText('pcInstallState', 'Browser did not complete the install prompt. Use its menu → Add to Home Screen.'); }
      deferredInstallPrompt = null; return;
    }
    if (window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone) { setText('pcInstallState', 'IGERS is already running in installed / standalone mode.'); return; }
    setText('pcInstallState', 'No install prompt is exposed here. On Android Chrome, open ⋮ → Install app / Add to Home Screen. This is the web app install path, not an APK download.');
  }

  function renderAuditOnStart() { renderAudit(); }
  function bindEvents() {
    $('pcRefreshAll')?.addEventListener('click', () => { collectServices(); drawMap(); globeDrawOnce(); audit('command center refresh', 'Read current page-exposed status'); });
    $('pcCheckIntegrity')?.addEventListener('click', () => { collectServices(); setText('pcAlertSummary', `Integrity resampled at ${timeLabel()}; unknown values remain unverified.`); audit('integrity re-check', 'Read current page-exposed signals'); });
    $('pcScanAlerts')?.addEventListener('click', () => { collectServices(); renderAlerts(true); audit('alert scan', `${activeAlerts.length} state-derived alert(s)`); });
    $('pcAckAlerts')?.addEventListener('click', () => { const keys = activeAlerts.map((a) => a.key); const ack = readStore(prefKeys.ack, []); writeStore(prefKeys.ack, [...new Set([...(Array.isArray(ack) ? ack : []), ...keys])].slice(-200)); renderAlerts(false); setText('pcAlertSummary', `${keys.length} current alert(s) acknowledged in this browser only. No remote action was taken.`); audit('alerts acknowledged locally', `${keys.length} alert(s)`); });
    $('pcShowAirportLayer')?.addEventListener('change', (event) => { mapLayer.airports = !!event.target.checked; drawMap(); });
    $('pcShowLiveAirLayer')?.addEventListener('change', (event) => { mapLayer.aircraft = !!event.target.checked; drawMap(); });
    $('pcRedrawMap')?.addEventListener('click', () => { drawMap(); audit('unified map redrawn', 'Reference geography + available valid public coordinates'); });
    window.addEventListener('igers:airtraffic', () => { collectServices(); drawMap(); });
    $('pcEnergySource')?.addEventListener('change', energyModeChanged);
    ['pcMass','pcVin','pcVout','pcEffKinetic','pcAnnualEvents','pcWindArea','pcAirDensity','pcWindSpeed','pcCp','pcEffWind','pcWindHours','pcFlow','pcHead','pcEffHydro','pcWaterDensity','pcHydroHours','pcIrradiance','pcSolarArea','pcSolarEff','pcSolarDerate','pcSunHours','pcSolarDays'].forEach((id) => $(id)?.addEventListener('input', () => { setText('pcEnergyConfidence', 'INPUTS CHANGED · RECALCULATE'); }));
    $('pcCalculateEnergy')?.addEventListener('click', calculateEnergy); $('pcResetEnergy')?.addEventListener('click', resetEnergyInputs);
    $('pcReportJson')?.addEventListener('click', reportJSON); $('pcReportCsv')?.addEventListener('click', reportCSV); $('pcReportPrint')?.addEventListener('click', (e) => printReport(e.currentTarget));
    $('pcPinFavorite')?.addEventListener('click', pinFavorite);
    $('pcClearFavorites')?.addEventListener('click', () => { removeStore(prefKeys.favorites); renderFavorites([]); setText('pcPersonalizeState', 'Pinned panels cleared from this browser.'); audit('favorites cleared', 'Local preferences'); });
    const applyCompact = (enabled) => { document.body.classList.toggle('pc-compact-ui', !!enabled); if ($('pcCompactToggle')) { $('pcCompactToggle').setAttribute('aria-pressed', String(!!enabled)); $('pcCompactToggle').textContent = enabled ? 'Disable compact layout' : 'Enable compact layout'; } if ($('pcCompactModeToggle')) $('pcCompactModeToggle').checked = !!enabled; writeStore(prefKeys.compact, !!enabled); };
    $('pcCompactToggle')?.addEventListener('click', () => { const enabled = !document.body.classList.contains('pc-compact-ui'); applyCompact(enabled); setText('pcPersonalizeState', `Compact layout ${enabled ? 'enabled' : 'disabled'} on this device.`); audit('compact layout changed', String(enabled)); });
    $('pcCompactModeToggle')?.addEventListener('change', (e) => { applyCompact(e.target.checked); audit('compact layout changed', String(e.target.checked)); });
    $('pcSimScenario')?.addEventListener('change', drawSimulationState); $('pcSimRun')?.addEventListener('click', simRun); $('pcSimPause')?.addEventListener('click', simPause); $('pcSimReset')?.addEventListener('click', simReset);
    $('pcSimSpeed')?.addEventListener('input', (event) => { const speed = Math.max(1, Math.min(10, Number(event.target.value) || 5)); $('pcSimStage')?.style.setProperty('--pc-sim-duration', `${12 - speed * .95}s`); });
    $('pcRunDiagnostics')?.addEventListener('click', runDiagnostics);
    $('pcInstallApp')?.addEventListener('click', installPwa);
    window.addEventListener('beforeinstallprompt', (event) => { event.preventDefault(); deferredInstallPrompt = event; setText('pcInstallBadge', 'INSTALL AVAILABLE'); setText('pcInstallState', 'Browser install prompt is available on this device.'); });
    window.addEventListener('appinstalled', () => { deferredInstallPrompt = null; setText('pcInstallBadge', 'INSTALLED'); setText('pcInstallState', 'Browser reports IGERS installed.'); audit('PWA app installed', 'Browser appinstalled event'); });
    $('pcExportAudit')?.addEventListener('click', () => { const list = readStore(prefKeys.audit, []); download(`igers-local-audit-${new Date().toISOString().slice(0,10)}.json`, 'application/json;charset=utf-8', JSON.stringify({ exportedAt: nowISO(), scope: 'local browser only', records: Array.isArray(list) ? list : [] }, null, 2)); });
    $('pcClearAudit')?.addEventListener('click', () => { if (!window.confirm('Clear this browser’s local IGERS audit log? This does not affect the website or other users.')) return; removeStore(prefKeys.audit); renderAudit(); setText('pcAuditState', 'Local audit history cleared.'); });
    const setLowMotion = (enabled) => { document.body.classList.toggle('pc-low-motion', !!enabled); if ($('pcLowMotionToggle')) $('pcLowMotionToggle').checked = !!enabled; writeStore(prefKeys.lowMotion, !!enabled); if (enabled) { if (globeRaf) cancelAnimationFrame(globeRaf); globeRaf = 0; globeDrawOnce(); simPause(); } else if (globeInView && !globeRaf) globeRaf = requestAnimationFrame(globeLoop); };
    $('pcLowMotionToggle')?.addEventListener('change', (event) => { setLowMotion(event.target.checked); audit('low-motion preference changed', String(event.target.checked)); });
    $('pcClearRuntimeErrors')?.addEventListener('click', () => { runtimeErrors = []; writeStore('igersPcSuiteRuntimeErrorsV1', runtimeErrors); setText('pcErrorCount', '0'); setText('pcPerformanceState', 'Local runtime error counter cleared. This does not clear errors recorded by providers or servers.'); audit('runtime error counter cleared', 'Local-only'); });
    $('pcRefreshRuntime')?.addEventListener('click', () => { updateRuntimeStatus(); updateServiceWorkerState(); collectServices(); drawMap(); });
    window.addEventListener('online', () => { updateRuntimeStatus(); collectServices(); drawMap(); audit('network state changed', 'Browser online event'); });
    window.addEventListener('offline', () => { updateRuntimeStatus(); collectServices(); drawMap(); audit('network state changed', 'Browser offline event'); });
    document.addEventListener('visibilitychange', () => { updateRuntimeStatus(); if (document.hidden && globeRaf) { cancelAnimationFrame(globeRaf); globeRaf = 0; } else if (!document.hidden && globeInView && !document.body.classList.contains('pc-low-motion') && !globeRaf) globeRaf = requestAnimationFrame(globeLoop); });
    window.addEventListener('resize', () => { drawMap(); globeDrawOnce(); }, { passive: true });
    window.addEventListener('error', (event) => {
      const item = { key: `${Date.now()}-${String(event.message || 'error').slice(0,40)}`, at: nowISO(), message: String(event.message || 'Script error').slice(0,180), source: String(event.filename || 'page script').split('/').pop().slice(0,100) };
      runtimeErrors = [...runtimeErrors, item].slice(-50); writeStore('igersPcSuiteRuntimeErrorsV1', runtimeErrors); setText('pcErrorCount', String(runtimeErrors.length));
    });
    window.addEventListener('unhandledrejection', (event) => {
      const raw = event.reason?.message || event.reason || 'Unhandled promise rejection'; const item = { key: `${Date.now()}-${String(raw).slice(0,40)}`, at: nowISO(), message: String(raw).slice(0,180), source: 'unhandled promise' };
      runtimeErrors = [...runtimeErrors, item].slice(-50); writeStore('igersPcSuiteRuntimeErrorsV1', runtimeErrors); setText('pcErrorCount', String(runtimeErrors.length));
    });
    // A small, allow-listed audit of state-changing controls. No password field or form content is read.
    document.addEventListener('click', (event) => {
      const control = event.target.closest('button[id]'); if (!control) return;
      const allowed = new Set(['unifiedSystemOn','unifiedSystemOff','energyEngineOn','energyEngineOff','energyReset','energyRefresh','iaRefresh','bdmOperatorAck','bdmTestAlert','alsEmergencyPublish','alsEmergencyClear','ad3dTestAlert','ad3dAck','brsRunwayPause','brsRunwayReverse','brsRoutePause','brsRouteReset']);
      if (!allowed.has(control.id)) return;
      window.setTimeout(() => { const state = $('unifiedSystemState')?.textContent || $('energyEngineState')?.textContent || ''; audit(`control clicked: ${control.id}`, `Resulting visible state: ${state.trim()}`); }, 0);
    }, true);
    return setLowMotion(readStore(prefKeys.lowMotion, false));
  }

  async function loadGeography() {
    try {
      const response = await fetch(new URL('data/bangladesh-boundary-fallback.geojson', document.baseURI).href, { cache: 'no-cache' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const geo = await response.json(); if (geo.type !== 'FeatureCollection' || !Array.isArray(geo.features)) throw new Error('Invalid GeoJSON FeatureCollection');
      geoFeatures = geo.features; geoStatus = `Bundled GeoJSON loaded · ${geoFeatures.length} feature(s)`;
    } catch (error) { geoFeatures = []; geoStatus = `GeoJSON unavailable (${error.message}); schematic outline fallback in use.`; }
    drawMap();
  }

  // Safe read-only helpers: useful for diagnostics/testing; no provider credentials or mutable module internals exposed.
  window.IGERSPowercoreSuite = Object.freeze({ version: 'powercore-12-upgrades-v2', classifyText, calculatePowerModel, validateCoordinate: (row) => { const lat = row && (row.lat ?? row.latitude ?? row.lat_deg); const lon = row && (row.lon ?? row.lng ?? row.longitude ?? row.lon_deg); return validNum(lat) && validNum(lon) && Number(lat) >= -90 && Number(lat) <= 90 && Number(lon) >= -180 && Number(lon) <= 180; } });

  function init() {
    if (!$('commandCenter') || !$('engineeringLab') || !$('operationsHealth')) return;
    bindEvents(); collectServices(); loadFavorites(); renderAuditOnStart(); updateRuntimeStatus(); updateServiceWorkerState(); drawSimulationState(); calculateEnergy(); loadGeography();
    const observer = ('IntersectionObserver' in window) ? new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target.id === 'pcGlobeCanvas') {
          globeInView = entry.isIntersecting;
          if (globeInView && !document.hidden && !document.body.classList.contains('pc-low-motion') && !globeRaf) globeRaf = requestAnimationFrame(globeLoop);
          else if (!globeInView && globeRaf) { cancelAnimationFrame(globeRaf); globeRaf = 0; }
        }
      });
    }, { rootMargin: '120px' }) : null;
    if (observer && $('pcGlobeCanvas')) observer.observe($('pcGlobeCanvas'));
    else { globeInView = true; globeRaf = requestAnimationFrame(globeLoop); }
    if ('ResizeObserver' in window && $('pcUnifiedMapCanvas')) new ResizeObserver(() => drawMap()).observe($('pcUnifiedMapCanvas'));
    setText('pcMapStatus', geoStatus);
    // Retain a modest local snapshot; no background network polling is introduced.
    window.setInterval(() => { collectServices(); updateRuntimeStatus(); }, 30000);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true }); else init();
})();
