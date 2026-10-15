/* IGERS-BD-01 Secure Connectivity Gateway v2.
 * Real VPN control is delegated only to a native Android/Electron bridge.
 * This webpage never pretends that browser online status is a VPN tunnel.
 */
(function () {
  'use strict';
  if (window.__igersSecureConnectivityLoaded) return;
  window.__igersSecureConnectivityLoaded = true;

  const $ = id => document.getElementById(id);
  const bridge = window.IGERSVpnBridge || null;
  const ua = navigator.userAgent || '';
  const platform = /Android/i.test(ua) ? 'Android device' : /Windows/i.test(ua) ? 'Windows desktop' : /Macintosh|Mac OS/i.test(ua) ? 'macOS desktop' : /Linux/i.test(ua) ? 'Linux / desktop' : /iPhone|iPad|iPod/i.test(ua) ? 'Apple mobile device' : 'Desktop / browser';
  let profileText = '';
  let profileLabel = '';
  let lastState = 'unknown';
  const maxProfileBytes = 64 * 1024;

  function setText(id, value) { const el = $(id); if (el) el.textContent = String(value ?? ''); }
  function setClass(id, value) { const el = $(id); if (el) el.className = value; }
  function showStatus(message, level = 'info') {
    const el = $('iscVpnStatus');
    if (!el) return;
    el.textContent = message;
    el.className = 'isc-guide isc-state-' + level;
  }
  function statusEvent(state, message) {
    const s = String(state || 'unknown').toLowerCase();
    lastState = s;
    const states = {
      ready: ['READY · IMPORT A PROFILE', 'Native runtime is ready; import a trusted WireGuard profile to begin.'],
      permission_required: ['ANDROID VPN PERMISSION REQUIRED', 'Approve the Android system VPN permission prompt to continue.'],
      connecting: ['CONNECTING · NATIVE TUNNEL', 'The native VPN engine is processing the imported profile.'],
      up: ['TUNNEL INTERFACE ACTIVE', 'The OS tunnel interface is up. Peer handshake and internet routing are not guaranteed by this state alone.'],
      down: ['DISCONNECTED', 'The native VPN tunnel is stopped. Browser internet may still be available.'],
      error: ['CONNECTION ERROR', 'The native connector reported an error. Review the details below.'],
      permission_denied: ['PERMISSION NOT GRANTED', 'VPN permission was not granted. No tunnel was started.'],
      unsupported: ['NATIVE CONNECTOR UNAVAILABLE', 'This browser cannot control an OS-level VPN tunnel.'],
      profile_error: ['INVALID PROFILE', 'The selected profile does not appear to be a valid WireGuard configuration.'],
      service_running: ['TUNNEL SERVICE RUNNING', 'The operating system reports that the WireGuard service is running; peer handshake is not independently verified.'],
      service_stopped: ['SERVICE STOPPED · CLEANUP AVAILABLE', 'The Windows tunnel service is stopped but its protected profile may remain. Use Disconnect to clean it up before importing another profile.']
    };
    const friendly = states[s] || [s.toUpperCase(), message || 'Native VPN status received.'];
    setText('iscVpn', friendly[0]);
    setClass('iscVpn', s === 'up' || s === 'service_running' ? 'isc-good' : (s === 'error' || s === 'permission_denied' || s === 'profile_error' ? 'isc-bad' : 'isc-unknown'));
    setText('iscVpnPathState', s === 'up' || s === 'service_running' ? 'INTERFACE ACTIVE' : (s === 'down' || s === 'service_stopped' ? 'DISCONNECTED' : 'NOT VERIFIED'));
    showStatus(message || friendly[1], s === 'up' || s === 'service_running' ? 'success' : (s === 'error' || s === 'permission_denied' ? 'error' : 'info'));
    setText('iscSecurityMessage', (message || friendly[1]) + (s === 'up' || s === 'service_running' ? ' Verify recent handshake and traffic in the native client.' : ''));
    const connectButton = $('iscConnect');
    const disconnectButton = $('iscDisconnect');
    if (connectButton) connectButton.disabled = ['connecting', 'permission_required', 'up', 'service_running', 'service_stopped'].includes(s);
    if (disconnectButton) disconnectButton.disabled = s === 'down';
    const tag = $('iscRuntimeTag');
    if (tag && s !== 'unsupported') tag.textContent = 'NATIVE RUNTIME';
  }

  window.IGERSVpnNativeResult = function (state, message) { statusEvent(state, message); };

  function hasNativeBridge() {
    return !!(bridge && (typeof bridge.postMessage === 'function' || typeof bridge.connectConfig === 'function'));
  }
  function markRuntime() {
    const available = hasNativeBridge();
    setText('iscRuntimeState', available ? (bridge.platform || (typeof bridge.postMessage === 'function' ? 'Android native bridge' : 'Desktop native bridge')) : 'NOT INSTALLED IN THIS BROWSER');
    setClass('iscRuntimeState', available ? 'isc-good' : 'isc-unknown');
    setText('iscRuntimeTag', available ? 'NATIVE RUNTIME READY' : 'NATIVE APP REQUIRED');
    return available;
  }

  async function invokeNative(action, payload = {}) {
    if (!hasNativeBridge()) {
      statusEvent('unsupported', 'Direct VPN connection is unavailable in a normal browser/PWA because browsers cannot create a system VPN tunnel. Open the native IGERS Android app or the IGERS desktop connector; no profile has been transmitted.');
      return false;
    }
    try {
      if (action === 'connect' && typeof bridge.connectConfig === 'function') {
        const result = await bridge.connectConfig(payload.config);
        if (result && typeof result === 'object') statusEvent(result.state || (result.ok ? 'connecting' : 'error'), result.message || 'Native connector response received.');
        else if (result === false) statusEvent('error', 'Native connector did not accept the profile.');
        else if (typeof bridge.postMessage !== 'function') statusEvent('connecting', 'Connect request sent to the native desktop connector.');
        return true;
      }
      if (action === 'disconnect' && typeof bridge.disconnect === 'function') {
        const result = await bridge.disconnect();
        if (result && typeof result === 'object') statusEvent(result.state || (result.ok ? 'down' : 'error'), result.message || 'Native disconnect response received.');
        return true;
      }
      if (action === 'status' && typeof bridge.getStatus === 'function') {
        const result = await bridge.getStatus();
        if (result && typeof result === 'object') statusEvent(result.state || 'unknown', result.message || 'Native state refreshed.');
        return true;
      }
      if (typeof bridge.postMessage === 'function') {
        bridge.postMessage(JSON.stringify({ action, payload }));
        statusEvent(action === 'connect' ? 'connecting' : (action === 'disconnect' ? 'connecting' : 'ready'), action === 'connect' ? 'Connect request sent to Android native VPN engine. Waiting for OS permission / tunnel result.' : action === 'disconnect' ? 'Disconnect request sent to Android native VPN engine.' : 'Status request sent to Android native VPN engine.');
        return true;
      }
      statusEvent('unsupported', 'The native host is present but does not support this VPN action.');
      return false;
    } catch (error) {
      statusEvent('error', 'Native VPN request failed: ' + (error && error.message ? error.message : String(error)));
      return false;
    }
  }

  function validWireGuardProfile(raw) {
    return raw.length > 0 && raw.length <= maxProfileBytes && /^\s*\[Interface\]\s*$/im.test(raw) && /^\s*\[Peer\]\s*$/im.test(raw) && /^\s*PrivateKey\s*=\s*\S+/im.test(raw) && /^\s*PublicKey\s*=\s*\S+/im.test(raw) && /^\s*AllowedIPs\s*=\s*\S+/im.test(raw);
  }

  const fileInput = $('iscProfileFile');
  const importButton = $('iscImportProfile');
  if (importButton && fileInput) importButton.addEventListener('click', () => fileInput.click());
  if (fileInput) fileInput.addEventListener('change', () => {
    const file = fileInput.files && fileInput.files[0];
    if (!file) return;
    if (file.size > maxProfileBytes) {
      profileText = ''; profileLabel = '';
      setText('iscProfileName', 'Profile rejected'); setText('iscProfileState', 'FILE TOO LARGE'); setClass('iscProfileState', 'isc-bad');
      showStatus('This profile is larger than 64 KB and was rejected. Select a standard WireGuard .conf profile.', 'error');
      fileInput.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => { profileText = ''; showStatus('The profile could not be read; no data was sent.', 'error'); };
    reader.onload = () => {
      const raw = String(reader.result || '');
      if (!validWireGuardProfile(raw)) {
        profileText = ''; profileLabel = '';
        setText('iscProfileName', 'Invalid WireGuard profile'); setText('iscProfileState', 'INVALID'); setClass('iscProfileState', 'isc-bad');
        showStatus('Profile rejected. Expected [Interface], PrivateKey, [Peer], PublicKey and AllowedIPs. Nothing was transmitted.', 'error');
        fileInput.value = '';
        return;
      }
      // Keep the profile in page memory only. Never write it to localStorage or logs.
      profileText = raw; profileLabel = file.name;
      setText('iscProfileName', profileLabel);
      setText('iscProfileState', 'LOADED IN MEMORY'); setClass('iscProfileState', 'isc-good');
      const native = markRuntime();
      showStatus(native ? 'Profile structure checked locally. Tap Connect VPN to send it to the native tunnel engine; Android will request VPN permission when needed.' : 'Profile structure checked locally and kept in memory only. Direct connection needs the native IGERS Android/Desktop app; this browser tab cannot start an OS VPN.', native ? 'success' : 'info');
    };
    reader.readAsText(file);
  });

  const connect = $('iscConnect');
  if (connect) connect.addEventListener('click', () => {
    if (!profileText) {
      showStatus('First import a trusted WireGuard .conf profile using the Import .conf button. This app does not include a VPN server or free credentials.', 'info');
      if (fileInput) fileInput.click();
      return;
    }
    invokeNative('connect', { config: profileText });
  });
  const disconnect = $('iscDisconnect');
  if (disconnect) disconnect.addEventListener('click', () => invokeNative('disconnect'));
  const refresh = $('iscRefresh');
  if (refresh) refresh.addEventListener('click', () => {
    refreshBrowserStatus();
    if (hasNativeBridge()) invokeNative('status');
    else showStatus('Browser status refreshed. A normal browser cannot read or control the device VPN tunnel; use the native IGERS connector to connect or disconnect.', 'info');
  });
  const satButton = $('iscSatGuide');
  const satText = $('iscSatGuideText');
  if (satButton && satText) satButton.addEventListener('click', () => {
    satText.hidden = !satText.hidden;
    satButton.setAttribute('aria-expanded', satText.hidden ? 'false' : 'true');
    satButton.textContent = satText.hidden ? 'Requirements checklist ＋' : 'Hide requirements −';
  });
  if (bridge && typeof bridge.onStatus === 'function') bridge.onStatus(result => {
    if (result) statusEvent(result.state, result.message);
  });

  function refreshBrowserStatus() {
    const online = navigator.onLine === true;
    setText('iscNetwork', online ? 'BROWSER ONLINE' : 'BROWSER OFFLINE');
    setClass('iscNetwork', online ? 'isc-good' : 'isc-bad');
    setText('iscInternetState', online ? 'BROWSER REPORTS ONLINE' : 'BROWSER OFFLINE');
    setText('iscBrowserState', online ? 'NETWORK AVAILABLE · VPN UNKNOWN' : 'BROWSER OFFLINE');
    setClass('iscBrowserState', 'isc-chip ' + (online ? 'isc-chip-warn' : 'isc-chip-bad'));
    setText('iscPlatform', platform);
    setText('iscLastCheck', 'Last browser check: ' + new Date().toLocaleString());
    markRuntime();
  }
  refreshBrowserStatus();
  if (hasNativeBridge()) setTimeout(() => invokeNative('status'), 250);
  window.addEventListener('online', refreshBrowserStatus);
  window.addEventListener('offline', refreshBrowserStatus);
})();
