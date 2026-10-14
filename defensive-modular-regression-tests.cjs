'use strict';
// Dependency-free runtime regression harness for Defensive Modular Panels.
// It executes the shipped module against a small DOM/canvas shim because this
// build environment's browser policy blocks local-host navigation.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = __dirname;
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const source = fs.readFileSync(path.join(ROOT, 'defensive-modular-panels.js'), 'utf8');

class FakeClassList {
  constructor() { this.items = new Set(); }
  add(...items) { items.forEach(x => this.items.add(x)); }
  remove(...items) { items.forEach(x => this.items.delete(x)); }
  contains(item) { return this.items.has(item); }
  toggle(item, force) {
    const next = force === undefined ? !this.items.has(item) : Boolean(force);
    if (next) this.items.add(item); else this.items.delete(item);
    return next;
  }
}
class FakeElement {
  constructor(id = '', tagName = 'div') {
    this.id = id; this.tagName = tagName.toUpperCase(); this.attributes = {}; this.dataset = {};
    this.listeners = {}; this.children = []; this.classList = new FakeClassList(); this.style = {};
    this.textContent = ''; this.value = ''; this.min = ''; this.max = ''; this.checked = false;
    this.className = ''; this.width = 600; this.height = 290; this.clientWidth = 600; this.clientHeight = 290;
    this.formValues = {};
  }
  addEventListener(type, fn) { (this.listeners[type] ||= []).push(fn); }
  trigger(type, event = {}) {
    const e = { currentTarget: this, preventDefault() {}, ...event };
    for (const fn of this.listeners[type] || []) fn(e);
  }
  getAttribute(name) { return this.attributes[name] ?? null; }
  setAttribute(name, value) { this.attributes[name] = String(value); }
  append(...items) { this.children.push(...items); }
  replaceChildren(...items) { this.children = [...items]; }
  remove() { this.removed = true; }
  click() { this.trigger('click'); }
  focus() { this.focused = true; }
  reset() { this.formValues = {}; }
  querySelector(selector) {
    if (selector === '[data-dm-node-status]') return this.statusElement || null;
    return null;
  }
  getBoundingClientRect() { return { width: this.clientWidth || 600, height: this.clientHeight || 290 }; }
  getContext(type) { return type === '2d' ? ctx2d : null; }
}
const noop = () => {};
const ctx2d = {
  clearRect: noop, fillRect: noop, setTransform: noop, beginPath: noop, arc: noop,
  stroke: noop, moveTo: noop, lineTo: noop, save: noop, translate: noop, restore: noop,
  fillText: noop, closePath: noop, fill: noop,
  createLinearGradient() { return { addColorStop: noop }; }
};

function makeHarness(seedModules = null) {
  const ids = new Set([...html.matchAll(/\bid=["']([^"']+)["']/g)].map(m => m[1]));
  const byId = new Map([...ids].map(id => [id, new FakeElement(id)]));
  const root = byId.get('defensiveModules'); root.dataset = {}; root.dataset.dmReady = '';
  const modules = ['radar', 'sources', 'infra', 'hazard', 'continuity', 'log'];
  const toggles = new Map(modules.map(key => {
    const b = new FakeElement('', 'button'); b.attributes['data-dm-module-toggle'] = key; return [key, b];
  }));
  const articles = new Map(modules.map(key => {
    const e = new FakeElement('', 'article'); e.classList.add('dm-module'); e.attributes['data-dm-module'] = key; return [key, e];
  }));
  const nodeKeys = ['power', 'telecom', 'transport', 'water', 'response'];
  const nodes = new Map(nodeKeys.map(key => {
    const b = new FakeElement('', 'button'); b.attributes['data-dm-node'] = key;
    b.statusElement = new FakeElement(); return [key, b];
  }));
  const svgNodes = new Map(nodeKeys.map(key => [key, new FakeElement('', 'circle')]));
  const svgStatus = new Map(nodeKeys.map(key => [key, new FakeElement('', 'text')]));
  root.querySelectorAll = selector => {
    if (selector === '[data-dm-module-toggle]') return [...toggles.values()];
    if (selector === '[data-dm-node]') return [...nodes.values()];
    return [];
  };
  root.querySelector = selector => {
    let m = selector.match(/^\[data-dm-module="([^"]+)"\]$/); if (m) return articles.get(m[1]) || null;
    m = selector.match(/^\[data-dm-svg-node="([^"]+)"\]$/); if (m) return svgNodes.get(m[1]) || null;
    m = selector.match(/^\[data-dm-svg-status="([^"]+)"\]$/); if (m) return svgStatus.get(m[1]) || null;
    return null;
  };
  byId.get('dmRadarCanvas').getContext = type => type === '2d' ? ctx2d : null;
  const inputDefaults = {
    dmBatteryCapacity: ['100', '0.1', '10000000'], dmBatteryDod: ['80', '1', '100'],
    dmBatteryEfficiency: ['90', '1', '100'], dmCriticalLoad: ['25', '0.01', '10000000']
  };
  for (const [id, [value, min, max]] of Object.entries(inputDefaults)) {
    const e = byId.get(id); e.value = value; e.min = min; e.max = max;
  }
  byId.get('dmLogForm').formValues = { category: 'Infrastructure', severity: 'WATCH', title: 'Test event', note: 'Local regression' };
  const storageValues = new Map();
  if (seedModules) storageValues.set('igers.defmod.modules.v1', JSON.stringify(seedModules));
  const localStorage = {
    getItem(k) { return storageValues.has(k) ? storageValues.get(k) : null; },
    setItem(k, v) { storageValues.set(k, String(v)); },
    removeItem(k) { storageValues.delete(k); }
  };
  const events = []; const frames = new Map(); const downloads = []; let frameId = 0; let confirmResult = true;
  const windowObj = {
    __igersAirLastPayload: [], devicePixelRatio: 1,
    addEventListener(type, fn) { events.push([type, fn]); },
    confirm() { return confirmResult; },
    ResizeObserver: class { constructor(fn) { this.fn = fn; } observe() {} disconnect() {} }
  };
  const documentObj = {
    hidden: false,
    body: new FakeElement('', 'body'),
    getElementById(id) { return byId.get(id) || null; },
    createElement(tag) { return new FakeElement('', tag); },
    addEventListener(type, fn) { events.push([`document:${type}`, fn]); }
  };
  const context = {
    window: windowObj, document: documentObj, navigator: { onLine: true }, localStorage,
    ResizeObserver: windowObj.ResizeObserver,
    requestAnimationFrame(fn) { const n = ++frameId; frames.set(n, fn); return n; },
    cancelAnimationFrame(n) { frames.delete(n); }, performance: { now: () => 1000 },
    FormData: class { constructor(form) { this.form = form; } get(k) { return this.form.formValues[k] ?? null; } },
    Blob: class { constructor(parts, opts) { this.parts = parts; this.type = opts?.type || ''; } },
    URL: { createObjectURL(blob) { const url = `blob:fake-${downloads.length + 1}`; downloads.push({ url, blob }); return url; }, revokeObjectURL() {} },
    setTimeout: noop, clearTimeout: noop, console, Math, Number, Object, String, JSON, Date, Array, Boolean
  };
  vm.createContext(context);
  vm.runInContext(source, context, { filename: 'defensive-modular-panels.js', timeout: 3000 });
  return { byId, root, toggles, articles, nodes, svgNodes, svgStatus, localStorage, frames, downloads, windowObj, context,
    setConfirm(v) { confirmResult = v; } };
}

// Default first-load boot and primary output.
const h = makeHarness();
assert.equal(h.byId.get('dmLastRefresh').textContent.length > 0, true, 'workspace boots and stamps local refresh time');
assert.equal(h.byId.get('dmContinuityHours').textContent, '2.88 h', 'battery autonomy default case');
assert.equal(h.byId.get('dmContinuityEnergy').textContent, '72 kWh', 'battery usable energy default case');
assert.equal(h.byId.get('dmSourceList').children.length, 5, 'five source states render');
assert.equal(h.windowObj.IGERSDefensiveModules.version, '2026-10-14-defensive-modules-v2');

// Bounds must be enforced, not merely advisory HTML attributes.
const cap = h.byId.get('dmBatteryCapacity');
cap.value = '10000001'; cap.trigger('input');
assert.equal(h.byId.get('dmContinuityHours').textContent, '—', 'out-of-range battery capacity rejected');
assert.match(h.byId.get('dmContinuityStatus').textContent, /Input error/);
cap.value = '200'; h.byId.get('dmBatteryDod').value = '50'; h.byId.get('dmBatteryEfficiency').value = '80'; h.byId.get('dmCriticalLoad').value = '20'; cap.trigger('input');
assert.equal(h.byId.get('dmContinuityHours').textContent, '4 h', 'valid changed inputs recompute autonomy');
assert.equal(h.byId.get('dmContinuityEnergy').textContent, '80 kWh');
cap.value = ''; cap.trigger('input');
assert.equal(h.byId.get('dmContinuityHours').textContent, '—', 'blank input rejected');

// Infrastructure scenario cycles locally and reset restores defaults.
h.nodes.get('power').click();
assert.equal(h.nodes.get('power').statusElement.textContent, 'DEGRADED');
h.nodes.get('power').click();
assert.equal(h.nodes.get('power').statusElement.textContent, 'OUTAGE');
h.byId.get('dmResetInfra').click();
assert.equal(h.nodes.get('power').statusElement.textContent, 'AVAILABLE');
assert.match(h.byId.get('dmNodeStatusNote').textContent, /not telemetry/i);

// The event log saves only local operator inputs and exports records.
h.byId.get('dmLogForm').trigger('submit');
assert.equal(h.byId.get('dmLogCount').textContent, '1 local record');
assert.match(h.byId.get('dmLogStatus').textContent, /browser only/i);
h.byId.get('dmExportJson').click(); h.byId.get('dmExportCsv').click();
assert.equal(h.downloads.length, 2, 'JSON and CSV exports trigger');
h.byId.get('dmClearLog').click();
assert.equal(h.byId.get('dmLogCount').textContent, '0 local records', 'confirmed clear updates local log');

// Disable the radar, then verify its stored OFF state remains OFF on page reload.
h.toggles.get('radar').click();
assert.equal(h.toggles.get('radar').textContent, 'Module OFF');
assert.equal(h.articles.get('radar').classList.contains('dm-is-disabled'), true);
assert.equal(h.frames.size, 0, 'pause cancels the tracked animation frame');
const persisted = JSON.parse(h.localStorage.getItem('igers.defmod.modules.v1'));
assert.equal(persisted.radar, false);
const reload = makeHarness(persisted);
assert.equal(reload.toggles.get('radar').textContent, 'Module OFF', 'persisted disabled UI state restored');
assert.equal(reload.byId.get('dmRadarToggle').textContent, 'Resume sweep');
assert.equal(reload.byId.get('dmRadarState').textContent, 'PAUSED · LOCAL DEMO');
assert.equal(reload.frames.size, 0, 'bugfix: disabled radar does not restart animation after reload');
reload.toggles.get('radar').click();
assert.equal(reload.toggles.get('radar').textContent, 'Module ON');
assert.equal(reload.frames.size, 1, 're-enabled radar starts one scheduled frame');
reload.toggles.get('radar').click();
assert.equal(reload.frames.size, 0, 'pause again clears the scheduled frame');

console.log('PASS: Defensive module runtime harness — boot, source list, battery defaults/recompute/range/blank validation, infrastructure cycle/reset, local log save/export/clear, persistent module OFF state, and radar pause/resume frame handling.');
