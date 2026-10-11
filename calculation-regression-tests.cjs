'use strict';
// Dependency-free regression tests for the active inline calculators in index.html.
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const html = fs.readFileSync(new URL('../index.html', `file://${__filename}`), 'utf8');

function element(value = '') {
  return { value, textContent: '', classList: { add() {}, remove() {}, toggle() {} }, style: { setProperty() {} } };
}
function near(actual, expected, tolerance, message) {
  assert.ok(Number.isFinite(actual) && Math.abs(actual - expected) <= tolerance,
    `${message}: expected ${expected} ± ${tolerance}, got ${actual}`);
}

// Concept Lab — kinetic energy conversion and non-negative input boundaries.
const conceptDefaults = {
  alsC_mass: 900, alsC_v1: 20, alsC_v2: 15, alsC_eta: 20,
  alsC_events: 210000, alsC_locations: 100, alsC_q: 5, alsC_head: 1.5,
  alsC_hydEta: 70, alsC_avail: 40, alsC_pv: 100, alsC_yield: 1400,
  alsC_bat: 1000, alsC_dod: 85, alsC_batEff: 92, alsC_load: 250
};
const conceptElements = Object.fromEntries(Object.entries(conceptDefaults).map(([id, value]) => [id, element(String(value))]));
const conceptOutput = {};
const conceptContext = {
  $: id => conceptElements[id] || null,
  clamp: (n, lo, hi) => Math.min(hi, Math.max(lo, n)),
  state: {},
  setText: (id, value) => { conceptOutput[id] = String(value); },
  fmtNum: (value, digits = 2) => Number(value).toLocaleString('en-US', { maximumFractionDigits: digits, minimumFractionDigits: digits }),
  nowTime: () => 'TEST'
};
const conceptStart = html.indexOf('function computeConcept(){');
const conceptEnd = html.indexOf('\n  function renderConcept3D()', conceptStart);
assert.ok(conceptStart >= 0 && conceptEnd > conceptStart, 'Concept Lab calculator exists');
const conceptFn = html.slice(conceptStart, conceptEnd);
vm.runInNewContext(`${conceptFn}\ncomputeConcept();`, conceptContext);
near(conceptContext.state.concept.eKJ, 6.0763888889, 1e-8, '900 kg, 20→15 km/h kinetic loss in kJ');
near(conceptContext.state.concept.netWh, 0.3375771605, 1e-8, 'net recovered energy per event in Wh');
near(conceptContext.state.concept.annualRoad, 7089.12037, 0.01, 'annual road recovery in kWh');
near(conceptContext.state.concept.totalMWh, 327.55388, 0.01, 'combined modeled generation in MWh/y');
assert.equal(conceptOutput.alsCEk, '6.08 kJ');

conceptElements.alsC_mass.value = '-900';
conceptElements.alsC_q.value = '-5';
conceptElements.alsC_pv.value = '-100';
vm.runInNewContext(`${conceptFn}\ncomputeConcept();`, conceptContext);
near(conceptContext.state.concept.eKJ, 0, 1e-12, 'negative vehicle mass is rejected');
near(conceptContext.state.concept.hydKW, 0, 1e-12, 'negative water flow is rejected');
near(conceptContext.state.concept.solarMWh, 0, 1e-12, 'negative PV capacity is rejected');

// Main energy calculator — average kW must be annual kWh / 8,760 hours.
const calcStart = html.indexOf('function calculate(){const s=state();');
const calcEnd = html.indexOf('\nfunction sync(){', calcStart);
assert.ok(calcStart >= 0 && calcEnd > calcStart, 'main Energy Calculator exists');
const calcElements = Object.fromEntries(Object.entries({
  energyMass: '900', energyV1: '20', energyV2: '15', energyRecovery: '20',
  energyLocations: '100000', energyVehicles: '210000', energyLiveBadge: ''
}).map(([id, value]) => [id, element(value)]));
const calcContext = {
  $: id => calcElements[id] || null,
  num: (id, fallback) => { const value = Number(calcElements[id]?.value); return Number.isFinite(value) ? value : fallback; },
  fmt: (value, digits = 2) => Number(value).toLocaleString('en-US', { maximumFractionDigits: digits, minimumFractionDigits: digits }),
  set: (id, value) => { if (!calcElements[id]) calcElements[id] = element(); calcElements[id].textContent = String(value); },
  state: () => ({ on: true }), Date, Number, Math
};
vm.runInNewContext(`${html.slice(calcStart, calcEnd)}\ncalculate();`, calcContext);
assert.equal(calcElements.energyEvent.textContent, '1.688 Wh');
assert.equal(calcElements.energyNet.textContent, '0.338 Wh/event');
assert.equal(calcElements.energyAnnual.textContent, '7.089 GWh/yr');
assert.equal(calcElements.energyAverage.textContent, '809.3 kW');

// Frame-live model uses the same units and should agree with the main calculator.
const ops = fs.readFileSync(new URL('../igers-live-3d-operations-2026-10-05.js', `file://${__filename}`), 'utf8');
const frameStart = ops.indexOf('function calculations(){');
const frameEnd = ops.indexOf('\nfunction ensureResultsConsole()', frameStart);
assert.ok(frameStart >= 0 && frameEnd > frameStart, 'frame-live calculator exists');
const frameResult = vm.runInNewContext(`${ops.slice(frameStart, frameEnd)}\ncalculations();`, {
  $: id => calcElements[id] || null,
  num: (id, fallback = 0) => { const value = Number(calcElements[id]?.value); return Number.isFinite(value) ? value : fallback; },
  clamp: (value, lo, hi) => Math.min(hi, Math.max(lo, value)), Number, Math, Date
});
near(frameResult.energy.annualGWh, 7.0891203704, 1e-7, 'frame-live annual road energy matches main calculator');
near(frameResult.energy.avgKW, 809.2603, 0.1, 'frame-live average power matches main calculator');
console.log('PASS: Concept Lab SI conversions, annual road energy, combined scenario, non-negative inputs, and consistent main/frame-live energy outputs.');
