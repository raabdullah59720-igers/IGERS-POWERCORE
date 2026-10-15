/* IGERS Visual Command Deck + Admin Machine Control
 * Additive, browser-side prototype interface. No physical machinery is actuated.
 * Admin login delegates to the existing IGERS administrator gate to avoid a second password store.
 */
(function () {
  'use strict';
  if (window.__igersVisualCommandDeckV1) return;
  window.__igersVisualCommandDeckV1 = true;
  const $ = id => document.getElementById(id);
  const AUTH_KEYS = ['igersAirWarnAdminV1', 'igersEnergyAdminV1', 'igersAdvancedAdminV1'];
  const TOUCH_KEY = 'igersAirWarnAdminTouch';
  const MACHINE_KEY = 'igers-machine-states-v2';
  const LOG_KEY = 'igers-machine-audit-v2';
  const machineDefs = [
    { id: 'solar', name: 'Solar Recovery Unit', short: 'SOLAR', desc: 'Illustrative photovoltaic recovery subsystem.', glyph: 'solar' },
    { id: 'air', name: 'Airflow Recovery Unit', short: 'AIRFLOW', desc: 'Conceptual airflow or wind-energy subsystem.', glyph: 'air' },
    { id: 'hydraulic', name: 'Hydraulic Recovery Unit', short: 'HYDRAULIC', desc: 'Conceptual water-flow energy recovery.', glyph: 'water' },
    { id: 'storage', name: 'Energy Storage System', short: 'STORAGE', desc: 'Battery/storage interface simulation.', glyph: 'battery' },
    { id: 'radar', name: 'Radar / Sensor Grid', short: 'SENSORS', desc: 'Visualization and sensor-state controls only.', glyph: 'radar' },
    { id: 'weather', name: 'Weather Node', short: 'WEATHER', desc: 'Weather feed display, not a weather instrument.', glyph: 'weather' },
    { id: 'satellite', name: 'Satellite Intelligence', short: 'SATELLITE', desc: 'Public satellite viewer and metadata panel.', glyph: 'satellite' },
    { id: 'sensor', name: 'Infrastructure Sensor Network', short: 'NETWORK', desc: 'Conceptual pole/tower/infrastructure network.', glyph: 'network' }
  ];
  const defaultStates = Object.fromEntries(machineDefs.map(m => [m.id, 'OFF']));
  defaultStates.__master = 'OFF';
  let states = loadStates();
  let selectedNode = 'converter';
  let lastAction = 'No command in this browser session yet';
  let wasAuthorized = false;

  function safeParse(raw, fallback) { try { const v = JSON.parse(raw); return v && typeof v === 'object' ? v : fallback; } catch (_) { return fallback; } }
  function loadStates() {
    let stored = {};
    try { stored = safeParse(localStorage.getItem(MACHINE_KEY), {}); } catch (_) {}
    const result = { ...defaultStates };
    for (const machine of machineDefs) if (['ON', 'OFF', 'AUTO'].includes(stored[machine.id])) result[machine.id] = stored[machine.id];
    result.__master = ['ON', 'OFF'].includes(stored.__master) ? stored.__master : machineDefs.every(m => result[m.id] === 'ON') ? 'ON' : 'OFF';
    return result;
  }
  function saveStates() { try { localStorage.setItem(MACHINE_KEY, JSON.stringify(states)); } catch (_) {} }
  function isAuthorized() { try { return AUTH_KEYS.some(key => sessionStorage.getItem(key) === '1'); } catch (_) { return false; } }
  function timeStamp() { return new Date().toLocaleString([], { hour12: false, month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }); }
  function readLog() { try { const value = JSON.parse(localStorage.getItem(LOG_KEY) || '[]'); return Array.isArray(value) ? value.slice(0, 60) : []; } catch (_) { return []; } }
  function record(message, type = 'ok') {
    const entries = readLog(); entries.unshift({ t: timeStamp(), message: String(message).slice(0, 220), type });
    try { localStorage.setItem(LOG_KEY, JSON.stringify(entries.slice(0, 60))); } catch (_) {}
    lastAction = message; renderLog(); renderSummary();
  }
  const glyphs = {
    solar: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="2.5"/><path d="M18 1v1M18 8v1M14 5h-1M22 5h1M3 12h14l2 8H5zM6 12l1 8M10 12v8M14 12l1 8M4 16h14"/></svg>',
    air: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7h12c3 0 3-4 0-4-1.3 0-2 .8-2.2 1.8M2 12h17c3 0 3 4 0 4-.9 0-1.7-.5-2-1.3M4 17h6"/></svg>',
    water: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2S5 10 5 14a7 7 0 0 0 14 0c0-4-7-12-7-12zM7 15c.4 2 1.8 3.2 4 3.5"/></svg>',
    battery: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="7" width="17" height="12" rx="2"/><path d="M20 11h2v4h-2M12 9l-3 5h3l-1 3 4-6h-3z"/></svg>',
    radar: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><path d="M12 12l6-6M12 3v2M21 12h-2M12 21v-2M3 12h2"/></svg>',
    weather: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 18h10a4 4 0 0 0 .2-8A6 6 0 0 0 5.5 9.5 4.3 4.3 0 0 0 7 18zM8 21l-1 1M13 21l-1 1M18 21l-1 1"/></svg>',
    satellite: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 8l8 8M5 4l5 1-5 5zM19 14l1 5-5-1zM12 4l8 8M14 3l7 7M3 14l7 7"/></svg>',
    network: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="5" r="2.5"/><circle cx="5" cy="19" r="2.5"/><circle cx="19" cy="19" r="2.5"/><path d="M10.8 7.3L6.2 16.6M13.2 7.3l4.6 9.3M7.5 19h9"/></svg>'
  };

  function setNode(id) {
    selectedNode = id;
    document.querySelectorAll('#visualCommandDeck [data-vcd-node]').forEach(node => {
      const active = node.getAttribute('data-vcd-node') === id;
      node.classList.toggle('is-selected', active);
      if (active) node.setAttribute('aria-pressed', 'true'); else node.setAttribute('aria-pressed', 'false');
    });
    const content = {
      solar: ['Solar photovoltaic recovery', 'Photovoltaic conversion supplies DC-side electrical energy. The real yield depends on irradiance, module temperature, orientation, shading, and conversion loss.', ['SOURCE · SOLAR PV', 'UNIT · kW', 'DATA · SCENARIO']],
      airflow: ['Airflow recovery', 'A proposed airflow/turbine source. Net recovery must account for the original flow system, pressure drop, turbine efficiency, and auxiliary power.', ['SOURCE · AIRFLOW', 'UNIT · kW', 'DATA · SCENARIO']],
      hydraulic: ['Hydraulic recovery', 'A conceptual flow-recovery path. Any installation needs measured head and flow, hydraulic-loss analysis, environmental review, and verified output.', ['SOURCE · HYDRAULIC', 'UNIT · kW', 'DATA · SCENARIO']],
      transport: ['Transport / vibration recovery', 'Regenerative braking, vibration, footstep, or transport-related recovery are distinct cases. Only energy that is genuinely recoverable is counted.', ['SOURCE · MECHANICAL', 'UNIT · kW', 'DATA · SCENARIO']],
      converter: ['Power conversion hub', 'The conceptual power-electronics layer conditions source output, manages DC/AC conversion, and routes energy subject to protection, efficiency, and load requirements.', ['STAGE · CONVERSION', 'LOSS · MUST BE MODELLED', 'CONTROL · CONCEPT']],
      storage: ['Battery energy storage', 'The storage model is a planning illustration. Real state of charge, temperature, current limits, and health require a BMS and authenticated live telemetry.', ['STAGE · STORAGE', 'UNIT · kWh', 'DATA · SCENARIO']],
      load: ['Local application / load', 'Local demand can include auxiliaries, lighting, sensors, monitoring, or approved loads. Export and islanding behavior require a protection and interconnection design.', ['STAGE · APPLICATION', 'UNIT · kW', 'DATA · SCENARIO']]
    };
    const item = content[id] || content.converter;
    const title = $('vcdNodeTitle'), body = $('vcdNodeDescription'), chips = $('vcdNodeChips');
    if (title) title.textContent = item[0]; if (body) body.textContent = item[1];
    if (chips) chips.innerHTML = item[2].map(x => '<span class="vcd-chip">' + x + '</span>').join('');
  }

  function renderMachineGrid() {
    const grid = $('amcMachineGrid'); if (!grid) return;
    const authorized = isAuthorized();
    grid.innerHTML = machineDefs.map(machine => {
      const state = states[machine.id] || 'OFF';
      const pillClass = state.toLowerCase();
      return '<article class="amc-machine" data-machine-card="' + machine.id + '" data-state="' + state + '">' +
        '<div class="amc-machine-head"><span class="amc-icon">' + glyphs[machine.glyph] + '</span><span class="amc-pill ' + pillClass + '" id="amcPill-' + machine.id + '">' + state + '</span></div>' +
        '<h3>' + machine.name + '</h3><p>' + machine.desc + '</p>' +
        '<div class="amc-machine-controls" role="group" aria-label="' + machine.name + ' simulated state">' + ['ON', 'AUTO', 'OFF'].map(s => '<button type="button" data-amc-machine="' + machine.id + '" data-amc-state="' + s + '" aria-pressed="' + String(s === state) + '"' + (authorized ? '' : ' disabled') + '>' + s + '</button>').join('') + '</div></article>';
    }).join('');
  }
  function renderSummary() {
    const on = machineDefs.filter(m => states[m.id] === 'ON').length;
    const auto = machineDefs.filter(m => states[m.id] === 'AUTO').length;
    const off = machineDefs.length - on - auto;
    if ($('amcOnCount')) $('amcOnCount').textContent = String(on).padStart(2, '0');
    if ($('amcAutoCount')) $('amcAutoCount').textContent = String(auto).padStart(2, '0');
    if ($('amcOffCount')) $('amcOffCount').textContent = String(off).padStart(2, '0');
    if ($('amcLastAction')) $('amcLastAction').textContent = lastAction.length > 34 ? lastAction.slice(0, 31) + '…' : lastAction;
    const master = $('amcMasterStatus'); if (master) { master.textContent = states.__master === 'ON' ? 'MASTER · ON' : 'MASTER · OFF'; master.classList.toggle('amc-unlocked', states.__master === 'ON'); master.classList.toggle('amc-locked', states.__master !== 'ON'); }
  }
  function renderLog() {
    const list = $('amcLogList'); if (!list) return;
    const rows = readLog(); list.innerHTML = rows.length ? rows.slice(0, 25).map(row => '<div class="amc-log-row ' + (row.type === 'warn' ? 'warn' : '') + '"><span>' + escapeHTML(row.t) + '</span> · ' + escapeHTML(row.message) + '</div>').join('') : '<div class="amc-log-row">No local admin commands recorded yet.</div>';
  }
  function escapeHTML(s) { return String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c])); }
  function renderAuth() {
    const ok = isAuthorized();
    const adminSection = $('adminMachineControl');
    if (adminSection) {
      adminSection.dataset.adminLocked = String(!ok);
      adminSection.setAttribute('aria-label', ok ? 'Admin machine control, authenticated session' : 'Admin machine control, locked');
    }
    if ($('amcLoginForm')) $('amcLoginForm').hidden = ok;
    if ($('amcLogout')) $('amcLogout').hidden = !ok;
    if ($('amcAdminBadge')) { $('amcAdminBadge').textContent = ok ? 'ADMIN SESSION ACTIVE' : 'ADMIN LOCKED'; $('amcAdminBadge').classList.toggle('amc-unlocked', ok); $('amcAdminBadge').classList.toggle('amc-locked', !ok); }
    if ($('amcLoginHeadline')) $('amcLoginHeadline').textContent = ok ? 'Administrator session active' : 'Authenticate to unlock controls';
    if ($('amcLoginBody')) $('amcLoginBody').textContent = ok ? 'The current IGERS admin gate authorized this browser session. Simulated controls are now enabled.' : 'Uses the existing IGERS administrator verifier. The password is not duplicated in this new module.';
    const loginButton = $('amcLoginButton'); if (loginButton) loginButton.hidden = ok;
    const controls = document.querySelectorAll('#adminMachineControl [data-amc-machine],#adminMachineControl [data-amc-master],#amcEmergencyStop,#amcClearLog');
    controls.forEach(el => { if (el.hasAttribute('data-amc-master') || el.id === 'amcEmergencyStop') el.disabled = !ok; else el.disabled = !ok; });
    if (ok && !wasAuthorized) { wasAuthorized = true; record('Administrator session recognized'); }
    if (!ok && wasAuthorized) { wasAuthorized = false; record('Administrator session locked', 'warn'); }
    renderMachineGrid(); renderSummary(); renderLog();
  }
  function tryExistingAdminGate(password) {
    if (isAuthorized()) return Promise.resolve(true);
    const legacyInput = $('ad3dAdminPassword'), legacyButton = $('ad3dAdminUnlock');
    if (!legacyInput || !legacyButton) return Promise.resolve(false);
    legacyInput.value = password;
    legacyButton.click();
    legacyInput.value = '';
    return new Promise(resolve => window.setTimeout(() => resolve(isAuthorized()), 80));
  }
  async function login() {
    const input = $('amcPassword'); if (!input) return;
    const button = $('amcLoginButton'); if (button) { button.disabled = true; button.textContent = 'CHECKING…'; }
    const accepted = await tryExistingAdminGate(input.value);
    input.value = '';
    if ($('amcLoginMessage')) $('amcLoginMessage').textContent = accepted ? 'Authentication accepted by the existing IGERS admin gate.' : 'Access denied. Check the password configured for the existing IGERS administrator gate.';
    if (button) { button.disabled = false; button.textContent = 'Unlock controls'; }
    if (accepted) { try { sessionStorage.setItem(TOUCH_KEY, String(Date.now())); } catch (_) {} record('Administrator authenticated through existing IGERS gate'); }
    renderAuth();
  }
  function requireAdmin() {
    if (isAuthorized()) { try { sessionStorage.setItem(TOUCH_KEY, String(Date.now())); } catch (_) {} return true; }
    if ($('amcLoginMessage')) $('amcLoginMessage').textContent = 'Locked: authenticate before sending a simulated command.';
    renderAuth(); return false;
  }
  function setMachine(id, state) {
    if (!requireAdmin()) { record('Blocked unauthorized machine command: ' + id, 'warn'); return; }
    if (!machineDefs.some(m => m.id === id) || !['ON', 'OFF', 'AUTO'].includes(state)) return;
    states[id] = state;
    states.__master = machineDefs.every(m => states[m.id] === 'ON') ? 'ON' : 'OFF';
    saveStates(); record(machineDefs.find(m => m.id === id).name + ' set to ' + state); renderAuth();
  }
  function master(state, isEmergency = false) {
    if (!requireAdmin()) return;
    if (!window.confirm(isEmergency ? 'EMERGENCY STOP simulated controls? All prototype machine states will be set to OFF. No physical equipment is controlled.' : 'Set all simulated IGERS machine states to ' + state + '?')) return;
    machineDefs.forEach(m => { states[m.id] = state; }); states.__master = state; saveStates();
    record((isEmergency ? 'EMERGENCY STOP' : 'MASTER SYSTEM') + ' → ' + state, isEmergency || state === 'OFF' ? 'warn' : 'ok'); renderAuth();
    if ($('amcLoginMessage')) $('amcLoginMessage').textContent = isEmergency ? 'Emergency-stop state applied to this browser prototype only.' : 'Master prototype state set to ' + state + '.';
  }
  function logout() {
    try { AUTH_KEYS.forEach(key => sessionStorage.removeItem(key)); sessionStorage.removeItem(TOUCH_KEY); } catch (_) {}
    record('Admin session closed', 'warn'); wasAuthorized = false; renderAuth();
    if ($('amcLoginMessage')) $('amcLoginMessage').textContent = 'Admin session locked.';
  }

  function calculateScenario() {
    const readBoundedNumber = (id, max) => {
      const field = $(id); const raw = field ? String(field.value ?? '').trim() : '';
      const parsed = raw === '' ? 0 : Number(raw);
      return Number.isFinite(parsed) ? Math.min(max, Math.max(0, parsed)) : 0;
    };
    const fields = ['solar', 'air', 'hydraulic', 'transport'];
    const vals = fields.map(name => readBoundedNumber('vcdInput-' + name, 99999));
    const load = readBoundedNumber('vcdInput-load', 99999);
    const capacity = readBoundedNumber('vcdInput-capacity', 999999);
    const total = vals.reduce((a, b) => a + b, 0); const surplus = total - load;
    if ($('vcdOutputTotal')) $('vcdOutputTotal').textContent = total.toFixed(1) + ' kW';
    if ($('vcdOutputBalance')) $('vcdOutputBalance').textContent = (surplus >= 0 ? '+' : '') + surplus.toFixed(1) + ' kW';
    if ($('vcdOutputStorage')) $('vcdOutputStorage').textContent = capacity.toFixed(1) + ' kWh';
    if ($('vcdScenarioStatus')) $('vcdScenarioStatus').textContent = surplus >= 0 ? 'Illustrative balance: source total exceeds selected load by ' + surplus.toFixed(1) + ' kW before conversion/storage losses.' : 'Illustrative balance: selected load exceeds source total by ' + Math.abs(surplus).toFixed(1) + ' kW; an external source or load reduction is required.';
    if ($('vcdMetricTotal')) $('vcdMetricTotal').textContent = total.toFixed(1);
    if ($('vcdMetricLoad')) $('vcdMetricLoad').textContent = load.toFixed(1);
    if ($('vcdMetricBalance')) $('vcdMetricBalance').textContent = (surplus >= 0 ? '+' : '') + surplus.toFixed(1);
  }
  function bindVisualDeck() {
    const section = $('visualCommandDeck'); if (!section || section.dataset.vcdBound === '1') return; section.dataset.vcdBound = '1';
    section.querySelectorAll('[data-vcd-node]').forEach(node => {
      node.addEventListener('click', () => setNode(node.getAttribute('data-vcd-node')));
      node.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setNode(node.getAttribute('data-vcd-node')); } });
    });
    $('vcdPauseMotion')?.addEventListener('click', () => { const paused = section.classList.toggle('vcd-paused'); const button = $('vcdPauseMotion'); if (button) { button.textContent = paused ? '▶ Resume motion' : 'Ⅱ Pause motion'; button.setAttribute('aria-pressed', String(paused)); } });
    $('vcdRecenter')?.addEventListener('click', () => { setNode('converter'); calculateScenario(); if ($('vcdScenarioStatus')) $('vcdScenarioStatus').textContent = 'Illustrative scenario recalculated. No live meter or hardware feed is connected.'; });
    $('vcdCalculate')?.addEventListener('click', calculateScenario);
    $('vcdResetScenario')?.addEventListener('click', () => { const values = { solar: 4.2, air: 2.4, hydraulic: 1.8, transport: 0.8, load: 6.5, capacity: 24 }; Object.entries(values).forEach(([key, value]) => { const input = $('vcdInput-' + key); if (input) input.value = value; }); calculateScenario(); });
    ['solar','air','hydraulic','transport','load','capacity'].forEach(key => $('vcdInput-' + key)?.addEventListener('change', calculateScenario));
    setNode('converter'); calculateScenario();
  }
  function bindAdmin() {
    if (!$('adminMachineControl') || $('adminMachineControl').dataset.amcBound === '1') return; $('adminMachineControl').dataset.amcBound = '1';
    $('amcLoginButton')?.addEventListener('click', login);
    $('amcPassword')?.addEventListener('keydown', e => { if (e.key === 'Enter') login(); });
    $('amcLogout')?.addEventListener('click', logout);
    $('amcMasterOn')?.addEventListener('click', () => master('ON'));
    $('amcMasterOff')?.addEventListener('click', () => master('OFF'));
    $('amcEmergencyStop')?.addEventListener('click', () => master('OFF', true));
    $('amcMachineGrid')?.addEventListener('click', e => { const button = e.target.closest('[data-amc-machine]'); if (button) setMachine(button.dataset.amcMachine, button.dataset.amcState); });
    $('amcClearLog')?.addEventListener('click', () => { if (!requireAdmin()) return; if (!window.confirm('Clear this browser’s local admin activity log?')) return; try { localStorage.removeItem(LOG_KEY); } catch (_) {} record('Admin activity log cleared'); });
    const touch = () => { if (!isAuthorized()) return; try { sessionStorage.setItem(TOUCH_KEY, String(Date.now())); } catch (_) {} };
    ['click','keydown','input'].forEach(type => $('adminMachineControl')?.addEventListener(type, touch, { passive: true }));
    window.addEventListener('storage', e => { if (e.key === MACHINE_KEY) { states = loadStates(); renderAuth(); } });
    renderAuth();
    window.setInterval(() => { const ok = isAuthorized(); if (ok) { let touchTime = 0; try { touchTime = Number(sessionStorage.getItem(TOUCH_KEY) || sessionStorage.getItem('igersAirWarnAdminTouch') || 0); } catch (_) {} if (touchTime && Date.now() - touchTime > 15 * 60 * 1000) logout(); } renderAuth(); }, 5000);
  }
  function boot() { bindVisualDeck(); bindAdmin(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true }); else boot();
})();
