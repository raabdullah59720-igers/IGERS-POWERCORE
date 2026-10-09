/* IGERS POWERCORE · unified local master UI state.
 * This is an administrative prototype indicator only. It does not control hardware
 * or stop live public-data feeds. Uses an existing IGERS admin session and does
 * not create a new password or weaken the existing gate.
 */
(function () {
  'use strict';
  if (window.__igersMasterControlBound) return;
  window.__igersMasterControlBound = true;

  const $ = id => document.getElementById(id);
  const STORAGE_KEY = 'igers-master-ui-state-v1';
  const ADMIN_KEYS = ['igersAirWarnAdminV1', 'igersEnergyAdminV1', 'igersAdvancedAdminV1'];

  function isAuthorized() {
    try { return ADMIN_KEYS.some(key => sessionStorage.getItem(key) === '1'); }
    catch (_) { return false; }
  }

  function readState() {
    try { return localStorage.getItem(STORAGE_KEY) === 'OFF' ? 'OFF' : 'ON'; }
    catch (_) { return 'ON'; }
  }

  function render(state, message) {
    const stateEl = $('unifiedSystemState');
    if (stateEl) {
      stateEl.textContent = state === 'ON' ? 'MASTER UI · ON' : 'MASTER UI · OFF';
      stateEl.dataset.masterUiState = state.toLowerCase();
      stateEl.classList.toggle('ifu-off', state === 'OFF');
      stateEl.setAttribute('aria-label', 'Master UI state ' + state + '. Simulation status only.');
    }
    const future = $('sysFutureState');
    if (future) future.textContent = state === 'ON' ? 'UI READY · SIMULATION' : 'UI STANDBY · SIMULATION';
    const machine = $('sysMachineState');
    if (machine) machine.textContent = state === 'ON' ? 'MASTER UI ON · NO HARDWARE' : 'MASTER UI OFF · NO HARDWARE';
    const msg = $('unifiedSystemMsg');
    if (msg && message) msg.textContent = message;
    document.dispatchEvent(new CustomEvent('igers:master-ui-state', { detail: { state, simulationOnly: true } }));
  }

  function changeState(next) {
    if (!isAuthorized()) {
      const msg = $('unifiedSystemMsg');
      if (msg) msg.textContent = 'Administrator authorization required. Unlock the existing gate in the 3D Air · Ground · Maritime panel first. No state was changed.';
      const gate = $('ad3dAdminPassword');
      if (gate) {
        $('airDefense3d')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        window.setTimeout(() => gate.focus(), 250);
      }
      return;
    }
    try { localStorage.setItem(STORAGE_KEY, next); } catch (_) {}
    const message = next === 'ON'
      ? 'Master UI state set to ON. This is a local prototype status; live feeds continue to follow their own provider state.'
      : 'Master UI state set to OFF. Only the master UI status changed; live feeds remain read-only and continue independently. No physical hardware is controlled.';
    render(next, message);
  }

  function init() {
    if (!$('systemControl')) return;
    $('unifiedSystemOn')?.addEventListener('click', () => changeState('ON'));
    $('unifiedSystemOff')?.addEventListener('click', () => changeState('OFF'));
    render(readState(), 'Master UI state is local to this browser. Live public-data panels are read-only; no hardware is controlled.');
    window.IGERS_MASTER_UI_CONTROL = Object.freeze({
      getState: readState,
      isAuthorized,
      setState: changeState
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
