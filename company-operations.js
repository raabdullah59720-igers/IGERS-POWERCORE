/* IGERS POWERCORE · Company Operations & Engineering.
 * Local-first records; optional authenticated backend for multi-device company data and device-reported telemetry.
 * No API key is persisted. No synthetic measurements are generated. No hardware commands are exposed.
 */
(function () {
  'use strict';
  if (window.__igersCompanyOperationsLoaded) return;
  window.__igersCompanyOperationsLoaded = true;

  const $ = (id) => document.getElementById(id);
  const STORE_KEY = 'igers-company-operations-v1';
  const API_BASE_KEY = 'igers-company-api-base-v1';
  const COLLECTIONS = ['projects', 'assets', 'sites', 'work-orders', 'design-versions', 'team-tasks', 'service-requests', 'finance-scenarios'];
  const COLLECTION_LABELS = {
    projects: 'Projects', assets: 'Energy assets', sites: 'Site surveys', 'work-orders': 'Work orders',
    'design-versions': 'Design revisions', 'team-tasks': 'Team tasks', 'service-requests': 'Service requests', 'finance-scenarios': 'Financial scenarios'
  };
  const LISTS = {
    projects: 'coProjectsList', assets: 'coAssetsList', sites: 'coSitesList', 'work-orders': 'coWorkOrdersList',
    'design-versions': 'coDesignList', 'team-tasks': 'coTasksList', 'service-requests': 'coRequestsList', 'finance-scenarios': 'coFinanceList'
  };
  const FORMS = {
    projects: 'coProjectForm', assets: 'coAssetForm', sites: 'coSiteForm', 'work-orders': 'coWorkOrderForm',
    'design-versions': 'coDesignForm', 'team-tasks': 'coTaskForm', 'service-requests': 'coRequestForm'
  };
  const MEASUREMENTS = {
    voltage_v: ['Voltage', 'V'], current_a: ['Current', 'A'], power_w: ['Power', 'W'], energy_wh: ['Energy', 'Wh'],
    temperature_c: ['Temperature', '°C'], soc_pct: ['Battery state of charge', '%'], vibration_mm_s: ['Vibration', 'mm/s'],
    flow_m3_s: ['Water flow', 'm³/s'], head_m: ['Net head', 'm'], solar_irradiance_w_m2: ['Solar irradiance', 'W/m²'], wind_speed_m_s: ['Wind speed', 'm/s']
  };
  const DEFAULTS = Object.fromEntries(COLLECTIONS.map((kind) => [kind, []]));
  const initialLocalStore = loadLocal();
  const state = {
    local: initialLocalStore, cloud: Object.fromEntries(COLLECTIONS.map((kind) => [kind, []])), apiBase: loadApiBase(), adminKey: '',
    apiReachable: false, cloudEnabled: false, telemetry: [], telemetryFetchedAt: null, telemetryState: 'not-configured', telemetryError: '',
    lastApiHealth: null, cloudFetchedAt: null, audit: Array.isArray(initialLocalStore.audit) ? initialLocalStore.audit.slice(-200) : [], pollHandle: 0, activeTab: 'projects', financeEditing: null,
  };

  function loadLocal() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORE_KEY) || '{}');
      const result = { ...DEFAULTS };
      for (const kind of COLLECTIONS) if (Array.isArray(parsed[kind])) result[kind] = parsed[kind].filter((x) => x && typeof x === 'object');
      result.audit = Array.isArray(parsed.audit) ? parsed.audit.slice(-200) : [];
      return result;
    } catch (_) { return { ...DEFAULTS, audit: [] }; }
  }
  function loadApiBase() { try { return localStorage.getItem(API_BASE_KEY) || ''; } catch (_) { return ''; } }
  function saveLocal() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state.local)); return true; }
    catch (_) { setStatus('coWorkspaceStatus', 'This browser could not save the workspace. Storage may be full or disabled; export your data before continuing.', 'error'); return false; }
  }
  function esc(value) { return String(value == null ? '' : value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
  function validNumber(value) { return value !== null && value !== undefined && String(value).trim() !== '' && Number.isFinite(Number(value)); }
  function fmt(value, digits = 2) { return Number.isFinite(Number(value)) ? Number(value).toLocaleString(undefined, { maximumFractionDigits: digits }) : '—'; }
  function stamp(value = Date.now()) { try { return new Date(value).toLocaleString(); } catch (_) { return 'Unknown time'; } }
  function setStatus(id, message, mode = 'info') { const el = $(id); if (el) { el.textContent = String(message); el.dataset.state = mode; } }
  function randomId() { return window.crypto?.randomUUID ? crypto.randomUUID() : `igers-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`; }
  function audit(action, detail = '') {
    state.audit.push({ id: randomId(), at: new Date().toISOString(), action: String(action).slice(0, 100), detail: String(detail).slice(0, 260) });
    state.audit = state.audit.slice(-200);
    state.local.audit = state.audit;
    saveLocal();
    renderAudit();
  }
  function localRecords(kind) { return state.local[kind] || []; }
  function cloudRecords(kind) { return state.cloud[kind] || []; }
  function allRecords(kind) { return [...cloudRecords(kind), ...localRecords(kind)]; }
  function recordTitle(item) { return String(item.title || item.name || item.device_id || item.id || 'Untitled record'); }
  function recordSummary(kind, item) {
    const candidates = kind === 'projects' ? [item.technology, item.stage, item.owner, item.status] :
      kind === 'assets' ? [item.asset_type, item.site, item.status, item.serial] :
      kind === 'sites' ? [item.latitude != null ? `${item.latitude}, ${item.longitude}` : '', item.status || 'Survey draft'] :
      kind === 'work-orders' ? [item.priority, item.status, item.asset_ref] :
      kind === 'design-versions' ? [item.model, item.version, item.author] :
      kind === 'team-tasks' ? [item.assigned_to, item.role, item.status] :
      kind === 'service-requests' ? [item.category, item.priority, item.status] :
      [item.basis, item.payback_years != null ? `${fmt(item.payback_years)} y payback` : '', item.status];
    return candidates.filter((x) => x !== undefined && x !== null && String(x).trim()).map(String).join(' · ');
  }
  function sourceBadge(item) { return item._source === 'cloud' ? '<span class="co-badge measured">CLOUD RECORD</span>' : '<span class="co-badge estimated">LOCAL ONLY</span>'; }

  function renderCollection(kind) {
    const target = $(LISTS[kind]);
    if (!target) return;
    const items = allRecords(kind).slice().sort((a, b) => String(b.updatedAt || b.updated_at || b.createdAt || '').localeCompare(String(a.updatedAt || a.updated_at || a.createdAt || '')));
    if (!items.length) {
      target.innerHTML = `<div class="co-empty">No ${esc(COLLECTION_LABELS[kind].toLowerCase())} recorded yet. Add one above. Local records stay on this device until the company API is connected.</div>`;
      return;
    }
    target.innerHTML = items.map((item) => {
      const id = esc(item.id || '');
      const summary = esc(recordSummary(kind, item));
      const description = esc(item.notes || item.description || item.symptom || item.details || item.change_summary || '');
      const updated = item.updatedAt || item.updated_at || item.createdAt || item.created_at;
      return `<article class="co-record"><div class="co-record-top"><div><h4>${esc(recordTitle(item))}</h4><p>${summary || 'Details not supplied'}</p></div>${sourceBadge(item)}</div>${description ? `<p>${description}</p>` : ''}<div class="co-record-meta"><span class="co-badge">${esc(COLLECTION_LABELS[kind])}</span><span class="co-small">Updated ${esc(updated ? stamp(updated) : '—')}</span></div><div class="co-record-actions"><button class="co-btn" type="button" data-co-action="edit" data-co-kind="${esc(kind)}" data-co-id="${id}" data-co-source="${esc(item._source || 'local')}">Edit</button><button class="co-btn danger" type="button" data-co-action="delete" data-co-kind="${esc(kind)}" data-co-id="${id}" data-co-source="${esc(item._source || 'local')}">Delete</button></div></article>`;
    }).join('');
  }
  function renderAudit() {
    const list = $('coAuditList'); if (!list) return;
    if (!state.audit.length) { list.innerHTML = '<div class="co-empty">No actions recorded yet. This audit list is local to this browser and never contains API keys.</div>'; return; }
    list.innerHTML = state.audit.slice().reverse().slice(0, 40).map((row) => `<article class="co-record"><div class="co-record-top"><h4>${esc(row.action)}</h4><span class="co-small">${esc(stamp(row.at))}</span></div><p>${esc(row.detail)}</p></article>`).join('');
  }
  function refreshKpis() {
    const set = (id, value) => { if ($(id)) $(id).textContent = String(value); };
    set('coKpiProjects', allRecords('projects').length); set('coKpiAssets', allRecords('assets').length);
    set('coKpiWorkOrders', allRecords('work-orders').filter((x) => !/closed|complete|resolved/i.test(String(x.status || ''))).length);
    set('coKpiSites', allRecords('sites').length);
    set('coWorkspaceMode', state.cloudEnabled ? 'CLOUD CONNECTED' : state.apiReachable ? 'API FOUND · LOCAL RECORDS' : 'LOCAL WORKSPACE');
    set('coWorkspaceLast', state.cloudEnabled && state.cloudFetchedAt ? `Last successful company-record sync: ${stamp(state.cloudFetchedAt)}. Local-only records are not shared.` : `Local workspace view refreshed ${stamp()}. No shared company sync is active.`);
  }
  function renderAll() {
    for (const kind of COLLECTIONS) renderCollection(kind);
    renderAudit(); renderTelemetry(); renderMaintenanceScreen(); renderSiteEstimates(); refreshKpis();
  }
  function setTab(tab) {
    if (!COLLECTIONS.some((kind) => kind === tab) && !['telemetry', 'engineering', 'economics', 'maintenance', 'sites', 'research', 'team', 'security'].includes(tab)) return;
    state.activeTab = tab;
    document.querySelectorAll('[data-co-tab]').forEach((button) => {
      const active = button.dataset.coTab === tab;
      button.setAttribute('aria-selected', String(active)); button.tabIndex = active ? 0 : -1;
    });
    document.querySelectorAll('[data-co-tabpanel]').forEach((panel) => { panel.hidden = panel.dataset.coTabpanel !== tab; });
  }
  function validateApiBase(value) {
    let url;
    try { url = new URL(String(value || '').trim()); } catch (_) { throw new Error('Enter a valid backend origin, for example https://api.example.com.'); }
    if (!['https:', 'http:'].includes(url.protocol)) throw new Error('Backend URL must use HTTPS (HTTP is permitted only for localhost testing).');
    if (url.username || url.password || url.search || url.hash) throw new Error('Backend URL must not contain credentials, query strings or fragments.');
    const loopback = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
    if (url.protocol !== 'https:' && !loopback) throw new Error('A hosted backend must use HTTPS; plain HTTP is allowed only for localhost testing.');
    return url.origin + url.pathname.replace(/\/+$/, '');
  }
  async function apiRequest(path, options = {}, auth = true) {
    if (!state.apiBase) throw new Error('Backend URL is not configured.');
    const headers = new Headers(options.headers || {}); headers.set('Accept', 'application/json');
    if (options.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
    if (auth && state.adminKey) headers.set('X-IGERS-Admin-Key', state.adminKey);
    const controller = new AbortController(); const timer = setTimeout(() => controller.abort(), 9000);
    try {
      const response = await fetch(state.apiBase + path, { ...options, headers, signal: controller.signal, cache: 'no-store', mode: 'cors' });
      const text = await response.text(); let data = {};
      if (text) { try { data = JSON.parse(text); } catch (_) { data = { detail: text.slice(0, 200) }; } }
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${String(data.detail || response.statusText || 'request failed').slice(0, 220)}`);
      return data;
    } catch (error) {
      if (error.name === 'AbortError') throw new Error('Backend request timed out after 9 seconds.');
      if (error instanceof TypeError) throw new Error('Could not reach backend. Check HTTPS, CORS, URL and service availability.');
      throw error;
    } finally { clearTimeout(timer); }
  }
  async function connectApi() {
    const baseInput = $('coApiBase'); const keyInput = $('coAdminKey');
    stopTelemetryPolling();
    state.adminKey = '';
    state.cloudEnabled = false;
    state.apiReachable = false;
    state.lastApiHealth = null; state.cloudFetchedAt = null;
    state.cloud = Object.fromEntries(COLLECTIONS.map((kind) => [kind, []]));
    state.telemetry = []; state.telemetryFetchedAt = null; state.telemetryState = 'not-connected'; state.telemetryError = '';
    updateApiBadges(); renderAll();
    try {
      const base = validateApiBase(baseInput?.value || '');
      state.apiBase = base; try { localStorage.setItem(API_BASE_KEY, base); } catch (_) { /* Backend can still be used for this session. */ }
      state.adminKey = String(keyInput?.value || '').trim(); if (keyInput) keyInput.value = '';
      setStatus('coApiStatus', 'Checking backend health…');
      const health = await apiRequest('/api/health', {}, false); state.lastApiHealth = health; state.apiReachable = health.status === 'ok';
      if (!state.apiReachable) throw new Error('Backend answered but reports degraded storage status.');
      if (!state.adminKey) {
        state.cloudEnabled = false;
        setStatus('coApiStatus', 'Backend health is reachable. Enter the admin API key and reconnect to load company records and telemetry. Key is never saved in browser storage.', 'warn');
        updateApiBadges(); audit('backend health checked', 'Public health endpoint reachable; no admin session created.');
        refreshKpis(); renderAll(); return;
      }
      const probe = await apiRequest('/api/records/projects?limit=1');
      if (!Array.isArray(probe.items)) throw new Error('Backend response does not match the IGERS Operations API contract.');
      state.cloudEnabled = true;
      setStatus('coApiStatus', `Connected to IGERS Operations API v${String(health.version || 'unknown')}. Company record requests are authenticated.`, 'ok');
      await loadCloudRecords(); await refreshTelemetry(false);
      if (!state.cloudEnabled) throw new Error('The backend rejected the authenticated session during telemetry verification. Reconnect with a valid admin key.');
      startTelemetryPolling();
      audit('company API connected', 'API endpoint health checked; admin key held in memory only.'); updateApiBadges(); renderAll();
    } catch (error) {
      stopTelemetryPolling();
      state.cloudEnabled = false;
      state.cloud = Object.fromEntries(COLLECTIONS.map((kind) => [kind, []])); state.cloudFetchedAt = null;
      state.telemetry = []; state.telemetryFetchedAt = null; state.telemetryState = 'error'; state.telemetryError = 'Authenticated backend connection failed.';
      setStatus('coApiStatus', error.message || 'Could not connect to company backend.', 'error');
      state.adminKey = ''; updateApiBadges(); renderAll(); refreshKpis();
    }
  }
  function startTelemetryPolling() {
    if (state.pollHandle || !state.cloudEnabled || document.hidden) return;
    state.pollHandle = setInterval(() => {
      if (state.cloudEnabled && navigator.onLine && !document.hidden) refreshTelemetry(false);
    }, 30_000);
  }
  function stopTelemetryPolling() {
    if (state.pollHandle) clearInterval(state.pollHandle);
    state.pollHandle = 0;
  }
  function updateApiBadges() {
    const badge = $('coCloudBadge'); if (badge) { badge.textContent = state.cloudEnabled ? 'AUTHENTICATED API' : state.apiReachable ? 'HEALTH ONLY' : 'LOCAL ONLY'; badge.className = 'co-pill ' + (state.cloudEnabled ? 'good' : state.apiReachable ? 'warn' : ''); }
    if ($('coTelemetryStatus')) $('coTelemetryStatus').textContent = state.cloudEnabled ? 'Authenticated gateway · waiting for latest device data' : 'Not connected to an authenticated telemetry source';
    if ($('coSecurityApi')) $('coSecurityApi').textContent = state.cloudEnabled ? 'Authenticated backend connected' : state.apiReachable ? 'Health endpoint reachable; admin session not active' : 'Not connected';
    if ($('coSecurityStatus')) setStatus('coSecurityStatus', state.cloudEnabled ? 'Authenticated API session is active in this tab; the admin key is memory-only.' : state.apiReachable ? 'Backend health is reachable, but company records and telemetry are not authenticated.' : 'No backend connection has been verified in this session.', state.cloudEnabled ? 'ok' : state.apiReachable ? 'warn' : 'info');
  }
  async function disconnectApi() {
    stopTelemetryPolling();
    state.adminKey = ''; state.cloudEnabled = false; state.apiReachable = false; state.lastApiHealth = null; state.cloudFetchedAt = null;
    state.cloud = Object.fromEntries(COLLECTIONS.map((kind) => [kind, []])); state.telemetry = []; state.telemetryFetchedAt = null; state.telemetryState = 'not-connected'; state.telemetryError = '';
    setStatus('coApiStatus', 'Disconnected. Local records remain on this device. API keys are not retained.', 'warn');
    updateApiBadges(); renderAll(); audit('company API disconnected', 'Browser-local records remain available.');
  }
  function fromCloud(row) { return { ...(row.payload || {}), id: row.id, createdAt: row.created_at, updatedAt: row.updated_at, _source: 'cloud' }; }
  async function loadCloudRecords() {
    // Build a complete snapshot off-screen; never leave half the collections updated if one request fails.
    const pairs = await Promise.all(COLLECTIONS.map(async (kind) => {
      const response = await apiRequest(`/api/records/${encodeURIComponent(kind)}?limit=200`);
      if (!Array.isArray(response.items)) throw new Error(`Backend returned an invalid ${kind} collection response.`);
      return [kind, response.items.map(fromCloud)];
    }));
    state.cloud = Object.fromEntries(pairs);
    state.cloudFetchedAt = Date.now();
  }
  function formPayload(form) {
    const payload = {};
    for (const field of form.querySelectorAll('input[name],select[name],textarea[name]')) {
      if (['record_id', 'record_source'].includes(field.name)) continue;
      if (field.type === 'checkbox') payload[field.name] = field.checked;
      else if (field.type === 'number') payload[field.name] = field.value.trim() === '' ? null : Number(field.value);
      else payload[field.name] = field.value.trim();
    }
    return payload;
  }
  function setFormState(form, record = null) {
    if (!form) return;
    form.reset();
    const idField = form.querySelector('[name="record_id"]'); const sourceField = form.querySelector('[name="record_source"]');
    if (idField) idField.value = record?.id || ''; if (sourceField) sourceField.value = record?._source || 'local';
    if (record) for (const field of form.querySelectorAll('[name]')) {
      if (['record_id', 'record_source'].includes(field.name) || !(field.name in record)) continue;
      if (field.type === 'checkbox') field.checked = !!record[field.name];
      else field.value = record[field.name] == null ? '' : String(record[field.name]);
    }
    const submit = form.querySelector('[type="submit"]'); if (submit) submit.textContent = record ? 'Save changes' : 'Add record';
    const cancel = form.querySelector('[data-co-cancel]'); if (cancel) cancel.hidden = !record;
  }
  async function saveRecord(kind, payload, id = '', source = 'local') {
    const now = new Date().toISOString();
    if (state.cloudEnabled && state.adminKey && (!id || source === 'cloud')) {
      try {
        let result;
        if (id && source === 'cloud') result = await apiRequest(`/api/records/${encodeURIComponent(kind)}/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify({ payload }) });
        else result = await apiRequest(`/api/records/${encodeURIComponent(kind)}`, { method: 'POST', body: JSON.stringify({ payload }) });
        const row = fromCloud(result); const arr = state.cloud[kind]; const index = arr.findIndex((item) => item.id === row.id);
        if (index >= 0) arr[index] = row; else arr.unshift(row);
        setStatus('coWorkspaceStatus', `${COLLECTION_LABELS[kind]} saved to the connected company API.`, 'ok');
        audit('cloud record saved', `${kind}: ${recordTitle(row)}`); renderAll(); return true;
      } catch (error) {
        setStatus('coWorkspaceStatus', `Cloud save failed (${error.message}). No record was silently marked as cloud-saved. Disconnect to save locally or restore the backend, then retry.`, 'error');
        return false;
      }
    }
    const arr = state.local[kind] || [];
    const record = { ...payload, id: id && source === 'local' ? id : randomId(), createdAt: id && source === 'local' ? (arr.find((x) => x.id === id)?.createdAt || now) : now, updatedAt: now, _source: 'local' };
    const index = arr.findIndex((item) => item.id === record.id);
    if (index >= 0) arr[index] = record; else arr.unshift(record);
    if (!saveLocal()) return false;
    setStatus('coWorkspaceStatus', `${COLLECTION_LABELS[kind]} saved in this browser only. Connect the secured API to share across company devices.`, 'warn');
    audit('local record saved', `${kind}: ${recordTitle(record)}`); renderAll(); return true;
  }
  async function deleteRecord(kind, id, source) {
    const record = allRecords(kind).find((item) => item.id === id && (item._source || 'local') === source);
    if (!record || !confirm(`Delete ${recordTitle(record)}? This cannot be undone from this workspace.`)) return;
    if (source === 'cloud') {
      if (!state.cloudEnabled || !state.adminKey) { setStatus('coWorkspaceStatus', 'Reconnect to the company API to delete a cloud record.', 'error'); return; }
      try {
        await apiRequest(`/api/records/${encodeURIComponent(kind)}/${encodeURIComponent(id)}`, { method: 'DELETE' });
        state.cloud[kind] = state.cloud[kind].filter((item) => item.id !== id);
        audit('cloud record deleted', `${kind}: ${recordTitle(record)}`); setStatus('coWorkspaceStatus', 'Cloud record deleted.', 'ok'); renderAll();
      } catch (error) { setStatus('coWorkspaceStatus', `Cloud delete failed: ${error.message}`, 'error'); }
      return;
    }
    state.local[kind] = state.local[kind].filter((item) => item.id !== id);
    if (!saveLocal()) return;
    audit('local record deleted', `${kind}: ${recordTitle(record)}`); setStatus('coWorkspaceStatus', 'Local record deleted.', 'warn'); renderAll();
  }
  function editRecord(kind, id, source) {
    const record = allRecords(kind).find((item) => item.id === id && (item._source || 'local') === source);
    if (!record) { setStatus('coWorkspaceStatus', 'The record was not found in the current snapshot.', 'error'); return; }
    if (kind === 'finance-scenarios') {
      state.financeEditing = { id, source };
      setTab('economics');
      const fields = {
        coFinanceName: record.title, coFinanceCapex: record.capex_bdt, coFinanceOpex: record.annual_opex_bdt,
        coFinanceTariff: record.tariff_bdt_kwh, coFinanceAnnual: record.annual_energy_kwh, coFinanceBasis: record.basis,
        coFinanceMeterRef: record.meter_reference, coFinanceDiscount: record.discount_pct, coFinanceLife: record.life_years,
      };
      for (const [fieldId, value] of Object.entries(fields)) if ($(fieldId) && value !== undefined && value !== null) $(fieldId).value = String(value);
      if ($('coFinanceSave')) $('coFinanceSave').textContent = 'Save changes';
      if ($('coFinanceCancel')) $('coFinanceCancel').hidden = false;
      calculateEconomics(false);
      setStatus('coFinanceStatus', `Editing ${recordTitle(record)}. Calculate and save to update this ${source === 'cloud' ? 'shared cloud' : 'browser-local'} scenario.`, 'warn');
      $('coFinanceName')?.focus({ preventScroll: true });
      return;
    }
    const form = $(FORMS[kind]);
    if (!form) { setStatus('coWorkspaceStatus', 'The record form was not found.', 'error'); return; }
    setTab(kind === 'sites' ? 'sites' : kind === 'work-orders' ? 'maintenance' : kind === 'design-versions' ? 'research' : ['team-tasks', 'service-requests'].includes(kind) ? 'team' : 'projects');
    setFormState(form, record); form.scrollIntoView({ behavior: 'smooth', block: 'center' });
    const first = form.querySelector('input:not([type="hidden"]),select,textarea'); first?.focus({ preventScroll: true });
  }
  function bindForms() {
    document.querySelectorAll('#companyOperations .co-record-form').forEach((form) => {
      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (!form.reportValidity()) return;
        const payload = formPayload(form); const id = form.querySelector('[name="record_id"]')?.value || ''; const source = form.querySelector('[name="record_source"]')?.value || 'local';
        for (const [key, value] of Object.entries(payload)) if (typeof value === 'string') payload[key] = value.slice(0, 12_000);
        const ok = await saveRecord(form.dataset.collection, payload, id, source);
        if (ok) setFormState(form, null);
      });
      form.querySelector('[data-co-cancel]')?.addEventListener('click', () => setFormState(form, null));
    });
  }
  function numericField(form, name) {
    const field = form.querySelector(`[name="${name}"]`);
    if (!field || String(field.value).trim() === '') return null;
    const number = Number(field.value); return Number.isFinite(number) ? number : null;
  }
  function optionalNumber(value) {
    if (value === null || value === undefined || String(value).trim() === '') return null;
    const number = Number(value);
    return Number.isFinite(number) ? number : null;
  }
  function numberOrDefault(value, fallback) {
    const parsed = optionalNumber(value);
    return { value: parsed === null ? fallback : parsed, assumed: parsed === null };
  }
  function estimateSite(site) {
    const result = [];
    const q = optionalNumber(site.flow_m3_s), head = optionalNumber(site.head_m);
    const hydroEfficiency = numberOrDefault(site.water_efficiency_pct, 70);
    const he = hydroEfficiency.value / 100;
    const hydroHours = optionalNumber(site.hydro_hours_year);
    if (q !== null && head !== null && q > 0 && q <= 1_000_000 && head > 0 && head <= 100_000 && he >= 0 && he <= 1) {
      const watts = 1000 * 9.80665 * q * head * he;
      const annual = hydroHours !== null && hydroHours >= 0 && hydroHours <= 8760 ? watts * hydroHours / 1000 : null;
      result.push({ name: 'Hydraulic', power: watts, annual, assumptions: `ρ=1000 kg/m³, η=${fmt(he * 100, 1)}%${hydroEfficiency.assumed ? ' (default because blank)' : ''}${annual === null ? '; add valid annual operating hours for yearly energy' : `; ${fmt(hydroHours, 0)} h/y`}` });
    }
    const windSpeed = optionalNumber(site.wind_speed_m_s), area = optionalNumber(site.wind_area_m2);
    const windCp = numberOrDefault(site.wind_cp, 0.35), cp = windCp.value;
    const windEfficiency = numberOrDefault(site.wind_efficiency_pct, 85), we = windEfficiency.value / 100;
    const windHours = optionalNumber(site.wind_hours_year);
    if (windSpeed !== null && area !== null && windSpeed >= 0 && windSpeed <= 150 && area > 0 && cp >= 0 && cp <= 0.593 && we >= 0 && we <= 1) {
      const watts = 0.5 * 1.225 * area * (windSpeed ** 3) * cp * we;
      const annual = windHours !== null && windHours >= 0 && windHours <= 8760 ? watts * windHours / 1000 : null;
      result.push({ name: 'Wind', power: watts, annual, assumptions: `ρair=1.225 kg/m³, Cp=${fmt(cp, 3)}${windCp.assumed ? ' (default because blank)' : ''}, η=${fmt(we * 100, 1)}%${windEfficiency.assumed ? ' (default because blank)' : ''}${annual === null ? '; add valid annual operating hours for yearly energy' : `; ${fmt(windHours, 0)} h/y`}` });
    }
    const g = optionalNumber(site.solar_irradiance_w_m2), solarArea = optionalNumber(site.solar_area_m2);
    const solarEfficiency = numberOrDefault(site.solar_efficiency_pct, 20), se = solarEfficiency.value / 100;
    const derateSetting = numberOrDefault(site.solar_derate_pct, 85), derate = derateSetting.value / 100;
    const sunHours = optionalNumber(site.solar_hours_day), solarDays = optionalNumber(site.solar_days_year);
    if (g !== null && solarArea !== null && g >= 0 && g <= 2000 && solarArea > 0 && se >= 0 && se <= 1 && derate >= 0 && derate <= 1) {
      const watts = g * solarArea * se * derate;
      const annual = sunHours !== null && sunHours >= 0 && sunHours <= 24 && solarDays !== null && solarDays >= 0 && solarDays <= 366 ? watts * sunHours * solarDays / 1000 : null;
      result.push({ name: 'Solar PV', power: watts, annual, assumptions: `ηmodule=${fmt(se * 100, 1)}%${solarEfficiency.assumed ? ' (default because blank)' : ''}, derate=${fmt(derate * 100, 1)}%${derateSetting.assumed ? ' (default because blank)' : ''}${annual === null ? '; add valid peak-sun hours/day and equivalent days/year' : `; ${fmt(sunHours, 1)} h/day × ${fmt(solarDays, 0)} days/year`}` });
    }
    const mass = optionalNumber(site.vehicle_mass_kg), entrySpeed = optionalNumber(site.entry_speed_kmh), exitSpeed = optionalNumber(site.exit_speed_kmh);
    const vin = entrySpeed === null ? null : entrySpeed / 3.6, vout = exitSpeed === null ? null : exitSpeed / 3.6;
    const kineticEfficiency = numberOrDefault(site.kinetic_efficiency_pct, 20), ke = kineticEfficiency.value / 100;
    const events = optionalNumber(site.traffic_events_year);
    if (mass !== null && entrySpeed !== null && exitSpeed !== null && events !== null && mass > 0 && entrySpeed >= 0 && entrySpeed <= 500 && exitSpeed >= 0 && exitSpeed <= 500 && vin >= vout && ke >= 0 && ke <= 1 && events >= 0) {
      const joules = 0.5 * mass * (vin ** 2 - vout ** 2) * ke;
      result.push({ name: 'Kinetic recovery', power: null, annual: joules * events / 3_600_000, event_kj: joules / 1000, assumptions: `η=${fmt(ke * 100, 1)}%${kineticEfficiency.assumed ? ' (default because blank)' : ''}, ${fmt(events, 0)} events/y; net gain needs field verification` });
    }
    return result;
  }
  function renderSiteEstimates() {
    const target = $('coSiteEstimates'); if (!target) return;
    const sites = allRecords('sites');
    if (!sites.length) { target.innerHTML = '<div class="co-empty">Save a site survey first. Any values shown here will be estimates calculated only from that site’s entered assumptions.</div>'; return; }
    target.innerHTML = sites.slice(0, 8).map((site) => {
      const estimates = estimateSite(site);
      return `<article class="co-record"><div class="co-record-top"><div><h4>${esc(recordTitle(site))}</h4><p>Site-specific model estimates · not measured production</p></div>${sourceBadge(site)}</div>${estimates.length ? estimates.map((item) => {
        const powerText = item.power == null ? 'Energy per event model' : `${fmt(item.power, 1)} W`;
        const annualText = item.annual == null ? '<p class="co-small">Annual energy estimate unavailable until operating-time/usage assumptions are supplied.</p>' : `<p class="co-small">Annual energy estimate: <strong>${fmt(item.annual, 2)} kWh/y</strong></p>`;
        return `<div class="co-equation" style="margin-top:8px"><b>${esc(item.name)}</b><strong>${powerText}</strong>${annualText}<code>${esc(item.assumptions)}</code>${item.event_kj != null ? `<p>${fmt(item.event_kj, 5)} kJ/event</p>` : ''}</div>`;
      }).join('') : '<div class="co-empty">Insufficient or invalid inputs for calculation. Enter positive area/flow/head/speed and valid efficiency assumptions.</div>'}</article>`;
    }).join('');
  }
  function calculateEconomics(shouldSave = false) {
    const rawFinance = ['coFinanceCapex', 'coFinanceOpex', 'coFinanceTariff', 'coFinanceAnnual'].map((id) => $(id)?.value ?? '');
    const rawDiscount = String($('coFinanceDiscount')?.value ?? '').trim();
    const rawLife = String($('coFinanceLife')?.value ?? '').trim();
    const [capex, opex, tariff, annual] = rawFinance.map(Number);
    const discount = Number(rawDiscount); const life = Number(rawLife);
    const validFinancials = rawFinance.every((value) => String(value).trim() !== '' && Number.isFinite(Number(value)) && Number(value) >= 0);
    const validAnalysis = rawDiscount !== '' && Number.isFinite(discount) && discount >= 0 && discount <= 100 && rawLife !== '' && Number.isInteger(life) && life >= 1 && life <= 50;
    const output = $('coFinanceResults'); if (!output) return false;
    if (!validFinancials || !validAnalysis) {
      output.textContent = 'Enter valid non-negative financial inputs, a discount rate from 0 to 100%, and an integer analysis life from 1 to 50 years. Blank fields are not silently treated as zero.';
      setStatus('coFinanceStatus', 'Please correct the finance inputs before calculating.', 'error'); return false;
    }
    const gross = annual * tariff; const net = gross - opex; const payback = net > 0 ? capex / net : null;
    $('coFinanceRevenue').textContent = `৳ ${fmt(gross, 2)}`; $('coFinanceNet').textContent = `৳ ${fmt(net, 2)}`;
    $('coFinancePayback').textContent = payback == null ? 'No positive payback' : `${fmt(payback, 2)} years`;
    const npv = calculateNpv(capex, net, discount / 100, life);
    $('coFinanceNPV').textContent = Number.isFinite(npv) ? `${life}-year NPV: ৳ ${fmt(npv, 2)}` : 'NPV: unavailable';
    output.textContent = `Calculated with ${life}-year life and ${fmt(discount, 2)}% discount rate. Gross annual value = annual kWh × tariff; net annual savings = gross value − OPEX. This is a scenario model, not a guarantee.`;
    const basis = $('coFinanceBasis')?.value || 'model-estimate'; const evidence = basis === 'meter-reading' ? `User-entered meter value (${String($('coFinanceMeterRef')?.value || '').trim() || 'meter reference missing'})` : 'Engineering estimate entered by user';
    setStatus('coFinanceStatus', `${evidence}. Not independently verified. Revenue assumes the entire entered annual kWh is deliverable at the tariff; actual economics must include outages, degradation, taxes, financing, service life and export/import rules.`, 'warn');
    if (shouldSave) {
      const payload = { title: ($('coFinanceName')?.value || 'Finance scenario').trim(), capex_bdt: capex, annual_opex_bdt: opex, tariff_bdt_kwh: tariff, annual_energy_kwh: annual, basis, meter_reference: String($('coFinanceMeterRef')?.value || '').trim(), discount_pct: discount, life_years: life, gross_annual_revenue_bdt: gross, net_annual_savings_bdt: net, payback_years: payback, npv_bdt: npv, modelled_at: new Date().toISOString() };
      const editing = state.financeEditing ? { ...state.financeEditing } : null;
      saveRecord('finance-scenarios', payload, editing?.id || '', editing?.source || 'local').then((ok) => {
        if (!ok) return;
        if (editing) {
          state.financeEditing = null;
          if ($('coFinanceSave')) $('coFinanceSave').textContent = 'Save scenario';
          if ($('coFinanceCancel')) $('coFinanceCancel').hidden = true;
        }
        setStatus('coFinanceStatus', `${editing ? 'Scenario updated.' : 'Scenario saved.'} ` + (basis === 'meter-reading' ? 'Meter value is user-entered, not independently verified.' : 'Results are model estimates.'), 'warn');
      });
    }
    return true;
  }
  function calculateNpv(capex, netAnnual, rate, life) {
    if (!Number.isFinite(capex) || !Number.isFinite(netAnnual) || !Number.isFinite(rate) || !Number.isFinite(life) || life < 1 || life > 50 || rate < 0 || rate > 1) return NaN;
    let npv = -capex; for (let year = 1; year <= Math.floor(life); year++) npv += netAnnual / ((1 + rate) ** year); return npv;
  }
  function renderMaintenanceScreen() {
    const out = $('coMaintenanceScreening'); if (!out) return;
    const records = state.telemetry.slice().sort((a, b) => String(b.observed_at).localeCompare(String(a.observed_at)));
    if (!state.cloudEnabled || state.telemetryState !== 'ok' || !records.length) {
      out.textContent = 'No fresh authenticated device telemetry is available. Maintenance screening is unavailable; do not infer equipment health from simulated graphics or absent readings.';
      out.className = 'co-status warn'; out.dataset.state = 'warn'; return;
    }
    const fresh = records.filter((row) => Number(row.age_seconds) <= 300);
    if (!fresh.length) { out.textContent = 'Latest device-reported readings are older than 5 minutes. Status is stale; screening was not run.'; out.className = 'co-status warn'; out.dataset.state = 'warn'; return; }
    const tempLimit = Number($('coTempLimit')?.value || 80), vibLimit = Number($('coVibrationLimit')?.value || 7.1); const findings = [];
    for (const row of fresh) {
      const m = row.measurements || [];
      if (validNumber(m.temperature_c) && Number(m.temperature_c) > tempLimit) findings.push(`${row.device_id}: temperature ${fmt(m.temperature_c)} °C exceeds the configured ${fmt(tempLimit)} °C screening threshold`);
      if (validNumber(m.vibration_mm_s) && Number(m.vibration_mm_s) > vibLimit) findings.push(`${row.device_id}: vibration ${fmt(m.vibration_mm_s)} mm/s exceeds the configured ${fmt(vibLimit)} mm/s screening threshold`);
    }
    out.textContent = findings.length ? `Threshold screening found ${findings.length} finding(s): ${findings.join('; ')}. These generic thresholds are not a failure prediction; replace with manufacturer/site engineering limits and investigate.` : 'Fresh device-reported readings are available; no configured generic threshold was exceeded. This is not a safety certification or a guarantee of equipment health.';
    out.className = 'co-status ' + (findings.length ? 'warn' : 'ok'); out.dataset.state = findings.length ? 'warn' : 'ok';
  }
  function renderTelemetry() {
    const target = $('coTelemetryList'); if (!target) return;
    const status = $('coTelemetryStatus');
    if (status) {
      status.textContent = state.telemetryState === 'ok' ? `Device-reported readings received ${state.telemetryFetchedAt ? stamp(state.telemetryFetchedAt) : ''}. Metrology/calibration has not been independently verified.` :
        state.telemetryState === 'offline' ? `Backend unavailable. ${state.telemetryError || 'No current sensor readings can be verified.'}` :
        state.telemetryState === 'empty' ? 'Backend connected, but no device telemetry has been ingested. No synthetic values are shown.' :
        state.telemetryState === 'not-connected' ? 'Not connected to an authenticated telemetry source.' :
        state.telemetryState === 'error' ? `Telemetry is unavailable after a connection or authentication error. ${state.telemetryError || 'Reconnect and verify the backend.'}` :
        'Telemetry becomes available only after a real gateway ingests device readings to the configured backend.';
    }
    if (!state.telemetry.length) { target.innerHTML = '<div class="co-empty">No device-reported telemetry available. Connect the company API and ingest actual sensor data; illustrative simulations elsewhere in the app are not used here.</div>'; return; }
    target.innerHTML = state.telemetry.slice(0, 50).map((item) => {
      const m = item.measurements || {}; const age = item.age_seconds != null && String(item.age_seconds).trim() !== '' && Number.isFinite(Number(item.age_seconds)) ? Number(item.age_seconds) : null;
      const ageText = age == null ? 'age unknown' : age > 300 ? `STALE · ${Math.round(age / 60)} min old` : `${age}s old`;
      const stale = age != null && age > 300;
      const metrics = Object.entries(m).map(([key, value]) => `<div class="co-reading"><span>${esc(MEASUREMENTS[key]?.[0] || key)}</span><strong>${fmt(value, 3)} ${esc(item.units?.[key] || MEASUREMENTS[key]?.[1] || '')}</strong><small>DEVICE-REPORTED</small></div>`).join('');
      return `<article class="co-record"><div class="co-record-top"><div><h4>${esc(item.device_id || 'Unknown device')} · ${esc(item.site_id || 'No site')}</h4><p>Observed ${esc(item.observed_at ? stamp(item.observed_at) : 'timestamp unavailable')} · received ${esc(item.received_at ? stamp(item.received_at) : '—')}</p></div><span class="co-badge ${stale ? 'offline' : 'measured'}">${esc(ageText)}</span></div><div class="co-telemetry-grid">${metrics}</div><div class="co-source-note">Device-reported via authenticated gateway. Sensor calibration and physical installation have not been independently verified.</div></article>`;
    }).join('');
  }
  async function refreshTelemetry(reportError = true) {
    if (!state.apiBase || !state.adminKey || !state.cloudEnabled) {
      state.telemetryState = 'not-connected'; renderTelemetry(); renderMaintenanceScreen(); return false;
    }
    try {
      const result = await apiRequest('/api/telemetry/latest?limit=50');
      state.telemetry = Array.isArray(result.items) ? result.items : [];
      state.telemetryState = state.telemetry.length ? 'ok' : 'empty'; state.telemetryFetchedAt = Date.now(); state.telemetryError = '';
      renderTelemetry(); renderMaintenanceScreen(); return true;
    } catch (error) {
      state.telemetryState = 'offline'; state.telemetryError = error.message || 'No provider response';
      // Do not keep old readings presented as live after a failed refresh.
      state.telemetry = []; renderTelemetry(); renderMaintenanceScreen();
      if (/HTTP 401|HTTP 403/.test(state.telemetryError)) {
        stopTelemetryPolling(); state.cloudEnabled = false; state.adminKey = '';
        state.cloud = Object.fromEntries(COLLECTIONS.map((kind) => [kind, []])); state.cloudFetchedAt = null;
        setStatus('coApiStatus', 'The backend rejected the admin session. Cloud records were cleared from this view; reconnect with a valid key.', 'error');
        updateApiBadges(); refreshKpis(); renderAll();
      } else if (reportError) setStatus('coApiStatus', `Telemetry request failed: ${state.telemetryError}`, 'error');
      return false;
    }
  }
  function fillDefaultApiBase() { if ($('coApiBase')) $('coApiBase').value = state.apiBase; }
  function exportBackup() {
    const payload = {
      export_kind: 'IGERS_POWERCORE_COMPANY_WORKSPACE_BACKUP', exported_at: new Date().toISOString(),
      data_scope: 'Local browser records and audit only. Cloud records are not included unless separately exported from backend.',
      local_records: Object.fromEntries(COLLECTIONS.map((kind) => [kind, state.local[kind]])), audit: state.audit,
      last_telemetry_status: state.telemetryState, telemetry: state.telemetry,
      api_base: state.apiBase || null,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const anchor = document.createElement('a'); anchor.href = url; anchor.download = `igers-company-backup-${new Date().toISOString().slice(0, 10)}.json`; document.body.append(anchor); anchor.click(); anchor.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    audit('workspace backup exported', 'Local company records and local audit; no API key included.'); setStatus('coWorkspaceStatus', 'Workspace backup download started. API keys are not included.', 'ok');
  }
  function runWorkspaceIntegrity() {
    const root = $('companyOperations'); if (!root) return;
    const ids = new Map(); root.querySelectorAll('[id]').forEach((el) => ids.set(el.id, (ids.get(el.id) || 0) + 1));
    const duplicate = [...ids.entries()].filter(([, count]) => count > 1).map(([id]) => id);
    const badLinks = [];
    root.querySelectorAll('a[href^="#"]').forEach((a) => { const id = a.getAttribute('href').slice(1); if (id && !document.getElementById(id)) badLinks.push('#' + id); });
    const result = duplicate.length || badLinks.length ? `Workspace check found ${duplicate.length} duplicate id(s) and ${badLinks.length} broken anchor(s).` : `Company Operations workspace passed local structural check: ${ids.size} unique ids; internal anchors resolve. External services and sensor hardware were not tested by this check.`;
    setStatus('coWorkspaceStatus', result, duplicate.length || badLinks.length ? 'error' : 'ok'); audit('workspace integrity scan', result);
  }
  async function resetCounters() {
    if (state.cloudEnabled) {
      try {
        await loadCloudRecords();
        renderAll();
        setStatus('coWorkspaceStatus', `Company records refreshed successfully at ${stamp(state.cloudFetchedAt)}. Telemetry freshness is reported separately.`, 'ok');
        audit('company records refreshed', 'All allowed collections loaded as one complete authenticated snapshot.');
        return;
      } catch (error) {
        if (/HTTP 401|HTTP 403/.test(String(error.message || ''))) {
          stopTelemetryPolling(); state.cloudEnabled = false; state.adminKey = ''; state.cloud = Object.fromEntries(COLLECTIONS.map((kind) => [kind, []]));
          state.cloudFetchedAt = null; state.telemetry = []; state.telemetryFetchedAt = null; state.telemetryState = 'error';
          updateApiBadges(); renderAll(); refreshKpis();
          setStatus('coWorkspaceStatus', 'Backend rejected the admin session. Cloud records were cleared from this view; reconnect using a valid key.', 'error');
          return;
        }
        // Keep the last successful snapshot visible, but expose exactly when it was fetched.
        refreshKpis(); renderAll();
        setStatus('coWorkspaceStatus', `Company record refresh failed. The visible cloud records are only the last successful snapshot${state.cloudFetchedAt ? ` from ${stamp(state.cloudFetchedAt)}` : ''}. ${error.message || ''}`, 'error');
        return;
      }
    }
    refreshKpis(); renderAll();
    const online = navigator.onLine ? 'browser online' : 'browser offline';
    setStatus('coWorkspaceStatus', `Local overview refreshed (${online}). Records remain local to this browser; no shared company sync is active.`, 'info');
  }
  function handleCollectionAction(event) {
    const button = event.target.closest('[data-co-action]'); if (!button) return;
    const { coAction: action, coKind: kind, coId: id, coSource: source } = button.dataset;
    if (!COLLECTIONS.includes(kind) || !id) return;
    if (action === 'edit') editRecord(kind, id, source || 'local');
    if (action === 'delete') deleteRecord(kind, id, source || 'local');
  }
  function selectTabFromEvent(event) {
    const button = event.target.closest('[data-co-tab]'); if (!button) return;
    setTab(button.dataset.coTab);
  }
  function bindTabKeyboard() {
    document.querySelectorAll('[data-co-tab]').forEach((button) => button.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault(); const buttons = [...document.querySelectorAll('[data-co-tab]')]; const index = buttons.indexOf(button);
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + buttons.length) % buttons.length;
      buttons[next]?.focus(); setTab(buttons[next]?.dataset.coTab);
    }));
  }
  function bindFinance() {
    $('coFinanceCalc')?.addEventListener('click', () => calculateEconomics(false));
    $('coFinanceSave')?.addEventListener('click', () => calculateEconomics(true));
    $('coFinanceCancel')?.addEventListener('click', () => { state.financeEditing = null; if ($('coFinanceSave')) $('coFinanceSave').textContent = 'Save scenario'; if ($('coFinanceCancel')) $('coFinanceCancel').hidden = true; setStatus('coFinanceStatus', 'Edit cancelled. Current inputs remain as a draft; saving will create a new scenario.', 'warn'); });
    ['coFinanceCapex', 'coFinanceOpex', 'coFinanceTariff', 'coFinanceAnnual', 'coFinanceDiscount', 'coFinanceLife', 'coFinanceBasis', 'coFinanceMeterRef'].forEach((id) => $(id)?.addEventListener('input', () => setStatus('coFinanceStatus', 'Inputs changed. Recalculate before relying on the figures.', 'warn')));
  }
  function bindEvents() {
    $('coConnectApi')?.addEventListener('click', connectApi); $('coDisconnectApi')?.addEventListener('click', disconnectApi);
    $('coRefreshTelemetry')?.addEventListener('click', () => refreshTelemetry(true));
    $('coExportBackup')?.addEventListener('click', exportBackup); $('coExportBackupResearch')?.addEventListener('click', exportBackup); $('coRunWorkspaceCheck')?.addEventListener('click', runWorkspaceIntegrity);
    $('coExportAudit')?.addEventListener('click', () => { const blob = new Blob([JSON.stringify({ exported_at: new Date().toISOString(), scope: 'local browser audit only', records: state.audit }, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `igers-local-audit-${new Date().toISOString().slice(0,10)}.json`; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000); audit('local audit exported', 'Audit keys and API secrets are not included.'); });
    $('coRefreshOverview')?.addEventListener('click', resetCounters);
    $('coClearAudit')?.addEventListener('click', () => { if (!confirm('Clear local audit history on this browser? This cannot clear the remote backend audit or restore previous entries.')) return; state.audit = []; state.local.audit = []; saveLocal(); renderAudit(); setStatus('coWorkspaceStatus', 'Local audit history cleared.', 'warn'); });
    $('coCheckTelemetry')?.addEventListener('click', () => refreshTelemetry(true));
    $('coApiBase')?.addEventListener('change', () => { try { $('coApiBase').value = validateApiBase($('coApiBase').value); } catch (_) {} });
    $('companyOperations')?.addEventListener('click', (event) => { selectTabFromEvent(event); handleCollectionAction(event); });
    bindTabKeyboard(); bindForms(); bindFinance();
    $('coTempLimit')?.addEventListener('input', renderMaintenanceScreen); $('coVibrationLimit')?.addEventListener('input', renderMaintenanceScreen);
    window.addEventListener('online', () => { if (state.cloudEnabled && !document.hidden) refreshTelemetry(false); });
    window.addEventListener('offline', () => { if (state.cloudEnabled) { state.telemetryState = 'offline'; state.telemetryError = 'Browser is offline.'; state.telemetry = []; renderTelemetry(); renderMaintenanceScreen(); } });
    document.addEventListener('visibilitychange', () => { if (document.hidden) stopTelemetryPolling(); else if (state.cloudEnabled) { refreshTelemetry(false); startTelemetryPolling(); } });
  }
  function init() {
    if (!$('companyOperations')) return;
    fillDefaultApiBase();
    if ($('coWorkspaceMode')) $('coWorkspaceMode').textContent = 'LOCAL WORKSPACE';
    for (const form of document.querySelectorAll('#companyOperations .co-record-form')) setFormState(form, null);
    setTab('projects'); bindEvents(); renderAll();
    if (state.apiBase) setStatus('coApiStatus', 'Saved backend URL is available. Reconnect using your admin key to load shared records. The key is not saved.', 'warn');
    else setStatus('coApiStatus', 'Local mode is ready. Company records are saved on this device until a separately hosted, authenticated backend is connected.', 'warn');
    // A default timer never starts remote traffic when no authenticated backend is configured.
  }
  window.IGERSCompanyOperations = Object.freeze({
    getStatus: () => ({ apiReachable: state.apiReachable, cloudEnabled: state.cloudEnabled, telemetryState: state.telemetryState, localCounts: Object.fromEntries(COLLECTIONS.map((kind) => [kind, state.local[kind].length])) }),
    refreshTelemetry: () => refreshTelemetry(true), runWorkspaceIntegrity,
  });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true }); else init();
})();
