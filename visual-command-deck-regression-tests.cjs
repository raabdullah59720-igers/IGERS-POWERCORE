'use strict';
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');

class StorageMock {
  constructor() { this.data = new Map(); }
  getItem(key) { return this.data.has(key) ? this.data.get(key) : null; }
  setItem(key, value) { this.data.set(String(key), String(value)); }
  removeItem(key) { this.data.delete(String(key)); }
  clear() { this.data.clear(); }
}
class ElementMock {
  constructor(id = '') {
    this.id = id; this.value = ''; this.textContent = ''; this.innerHTML = ''; this.hidden = false;
    this.disabled = false; this.dataset = {}; this.className = ''; this.attributes = {}; this.listeners = {};
    this.classList = {
      toggle: (name, force) => { const s = new Set(String(this.className).split(/\s+/).filter(Boolean));
        const add = force === undefined ? !s.has(name) : Boolean(force); if (add) s.add(name); else s.delete(name);
        this.className = [...s].join(' '); return add; },
      add: name => { if (!String(this.className).split(/\s+/).includes(name)) this.className = (this.className + ' ' + name).trim(); },
      remove: name => { this.className = String(this.className).split(/\s+/).filter(x => x && x !== name).join(' '); },
      contains: name => String(this.className).split(/\s+/).includes(name)
    };
  }
  addEventListener(type, fn) { (this.listeners[type] ||= []).push(fn); }
  dispatch(type, event = {}) { for (const fn of this.listeners[type] || []) fn({ target: this, key: undefined, preventDefault() {}, ...event }); }
  setAttribute(k, v) { this.attributes[k] = String(v); }
  getAttribute(k) { return this.attributes[k] ?? null; }
  hasAttribute(k) { return Object.prototype.hasOwnProperty.call(this.attributes, k); }
  querySelectorAll(selector) { if (this.id === 'visualCommandDeck' && selector === '[data-vcd-node]') return visualNodes; return []; }
  click() {
    if (this.id === 'ad3dAdminUnlock') {
      const password = els.get('ad3dAdminPassword')?.value || '';
      if (password === 'TEST_OK') session.setItem('igersAirWarnAdminV1', '1');
      else { const msg = els.get('ad3dAdminLoginMsg'); if (msg) msg.textContent = 'Incorrect administrator password.'; }
      return;
    }
    this.dispatch('click');
  }
  closest(selector) { return this.closestResult || null; }
}
const els = new Map();
const getEl = id => { if (!els.has(id)) els.set(id, new ElementMock(id)); return els.get(id); };
const session = new StorageMock();
const local = new StorageMock();
const inputDefaults = { 'vcdInput-solar':'4.2', 'vcdInput-air':'2.4', 'vcdInput-hydraulic':'1.8', 'vcdInput-transport':'0.8', 'vcdInput-load':'6.5', 'vcdInput-capacity':'24' };
Object.entries(inputDefaults).forEach(([id, value]) => { getEl(id).value = value; });
const navNode = id => { const el = new ElementMock('node-' + id); el.attributes['data-vcd-node'] = id; return el; };
const visualNodes = ['solar','airflow','hydraulic','transport','converter','storage','load'].map(navNode);
const documentMock = {
  readyState: 'complete',
  getElementById: getEl,
  addEventListener() {},
  querySelectorAll(selector) {
    if (selector === '#visualCommandDeck [data-vcd-node]') return visualNodes;
    if (selector === '#adminMachineControl [data-amc-machine],#adminMachineControl [data-amc-master],#amcEmergencyStop,#amcClearLog') {
      return ['amcMasterOn','amcMasterOff','amcEmergencyStop','amcClearLog'].map(getEl);
    }
    return [];
  }
};
const windowMock = {
  __igersVisualCommandDeckV1: false,
  confirm: () => true,
  setTimeout: fn => { fn(); return 1; },
  setInterval: () => 1,
  addEventListener() {}
};
const source = fs.readFileSync('visual-command-deck.js', 'utf8');
const context = { window: windowMock, document: documentMock, localStorage: local, sessionStorage: session,
  console, Date, Math, Object, String, Number, Array, Promise, JSON, setTimeout: windowMock.setTimeout,
  setInterval: windowMock.setInterval, clearInterval() {} };
vm.runInNewContext(source, context, { filename: 'visual-command-deck.js' });

(async () => {
  assert.equal(getEl('visualCommandDeck').dataset.vcdBound, '1', 'visual deck boots once');
  assert.equal(getEl('adminMachineControl').dataset.amcBound, '1', 'admin console boots once');
  assert.match(getEl('amcMachineGrid').innerHTML, /Solar Recovery Unit/, 'machine cards render');
  assert.equal((getEl('amcMachineGrid').innerHTML.match(/data-amc-machine=/g) || []).length, 24, 'eight machines expose ON/AUTO/OFF states');
  assert.equal(getEl('amcOnCount').textContent, '00', 'default machine states are OFF');
  assert.equal(getEl('amcMasterOn').disabled, true, 'global controls are locked before admin authentication');

  getEl('vcdInput-solar').value = '5'; getEl('vcdCalculate').dispatch('click');
  assert.equal(getEl('vcdOutputTotal').textContent, '10.0 kW', 'scenario sums source power');
  assert.equal(getEl('vcdOutputBalance').textContent, '+3.5 kW', 'scenario derives selected load balance');
  assert.equal(getEl('vcdMetricLoad').textContent, '6.5', 'headline load metric is synchronized');
  visualNodes.find(n => n.getAttribute('data-vcd-node') === 'storage').dispatch('click');
  assert.equal(getEl('vcdNodeTitle').textContent, 'Battery energy storage', 'node selection updates engineering detail');
  getEl('vcdPauseMotion').dispatch('click');
  assert.ok(getEl('visualCommandDeck').classList.contains('vcd-paused'), 'motion toggle pauses animations');

  getEl('amcPassword').value = 'TEST_OK';
  await getEl('amcLoginButton').listeners.click[0]();
  assert.equal(session.getItem('igersAirWarnAdminV1'), '1', 'new panel delegates to the existing admin verifier');
  assert.equal(getEl('amcMasterOn').disabled, false, 'global controls unlock only after auth');
  getEl('amcMasterOn').dispatch('click');
  const allOn = JSON.parse(local.getItem('igers-machine-states-v2'));
  assert.ok(['solar','air','hydraulic','storage','radar','weather','satellite','sensor'].every(k => allOn[k] === 'ON'), 'master ON switches all prototype modules');
  assert.equal(getEl('amcOnCount').textContent, '08', 'master ON updates the summary');

  const grid = getEl('amcMachineGrid');
  grid.dispatch('click', { target: { closest: () => ({ dataset: { amcMachine: 'solar', amcState: 'OFF' } }) } });
  assert.equal(JSON.parse(local.getItem('igers-machine-states-v2')).solar, 'OFF', 'individual module state can be changed');
  assert.equal(getEl('amcOnCount').textContent, '07', 'individual command updates machine count');

  getEl('amcEmergencyStop').dispatch('click');
  const allOff = JSON.parse(local.getItem('igers-machine-states-v2'));
  assert.ok(['solar','air','hydraulic','storage','radar','weather','satellite','sensor'].every(k => allOff[k] === 'OFF'), 'emergency-stop simulation turns all prototype modules OFF');
  assert.ok((JSON.parse(local.getItem('igers-machine-audit-v2')) || []).some(r => /EMERGENCY STOP/.test(r.message)), 'audit log records emergency stop');
  getEl('amcLogout').dispatch('click');
  assert.equal(session.getItem('igersAirWarnAdminV1'), null, 'logout clears admin session');
  assert.equal(getEl('amcMasterOn').disabled, true, 'logout locks controls again');

  const html = fs.readFileSync('index.html', 'utf8');
  const css = fs.readFileSync('visual-command-deck.css', 'utf8');
  assert.match(html, /href="#visualCommandDeck">Visual Command Deck/, 'visual deck is discoverable from navigation');
  assert.match(html, /href="#adminMachineControl">Admin Machine Control/, 'admin panel is discoverable from navigation');
  assert.match(html, /visual-command-deck\.css\?v=20261014-v1/, 'versioned stylesheet is linked');
  assert.match(html, /visual-command-deck\.js\?v=20261014-v2/, 'versioned script is linked');
  assert.match(css, /prefers-reduced-motion/, 'reduced-motion accessibility style exists');
  const polish = fs.readFileSync('visual-polish-v2.css', 'utf8');
  assert.match(polish, /data-admin-locked/, 'locked master controls have an explicit visual lock state');
  assert.match(polish, /scroll-padding-top/, 'navigation has sticky-header-aware scroll padding');
  assert.match(polish, /\.global-3d-canvas\{opacity:\.36!important\}/, 'global 3D backdrop is subdued to protect foreground readability');
  assert.match(source, /adminSection\.dataset\.adminLocked = String\(!ok\)/, 'admin auth state is reflected on the control panel for accessible styling');
  console.log('PASS: Visual Command Deck + Admin Machine Control regression — source-balance calculation, node selection, motion toggle, eight module cards, locked controls, existing-gate auth delegation, master ON, individual OFF, emergency-stop simulation, activity audit and logout locking.');
})().catch(error => { console.error(error); process.exitCode = 1; });
