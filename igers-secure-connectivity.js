/* IGERS Secure Connectivity Gateway · Progressive enhancement only.
   This static website does not create or control an operating-system VPN tunnel. */
(function () {
  'use strict';
  if (window.__igersSecureConnectivityLoaded) return;
  window.__igersSecureConnectivityLoaded = true;

  var $ = function (id) { return document.getElementById(id); };
  var isAndroid = /Android/i.test(navigator.userAgent || '');
  var isAppleMobile = /iPhone|iPad|iPod/i.test(navigator.userAgent || '');
  var platform = isAndroid ? 'Android device' : isAppleMobile ? 'Apple mobile device' : 'Desktop / laptop';

  function text(id, value) { var el = $(id); if (el) el.textContent = value; }
  function setClass(id, className) { var el = $(id); if (el) el.className = className; }
  function refresh() {
    var online = navigator.onLine === true;
    text('iscNetwork', online ? 'BROWSER ONLINE' : 'BROWSER OFFLINE');
    setClass('iscNetwork', online ? 'isc-good' : 'isc-bad');
    text('iscInternetState', online ? 'BROWSER REPORTS ONLINE' : 'BROWSER OFFLINE');
    text('iscBrowserState', online ? 'NETWORK AVAILABLE · VPN UNKNOWN' : 'BROWSER OFFLINE');
    setClass('iscBrowserState', 'isc-chip ' + (online ? 'isc-chip-warn' : 'isc-chip-bad'));
    text('iscVpn', 'NOT VERIFIED');
    setClass('iscVpn', 'isc-unknown');
    text('iscVpnPathState', 'NOT VERIFIED');
    text('iscPlatform', platform);
    text('iscPlatformInline', platform);
    text('iscLastCheck', 'Last browser check: ' + new Date().toLocaleString());
    text('iscSecurityMessage', online
      ? 'Browser reports network availability. VPN tunnel remains unverified until checked in the VPN client / device OS.'
      : 'Browser reports offline. No VPN tunnel has been verified.');
  }

  function toggleGuide(buttonId, panelId, content, openLabel, closeLabel) {
    var button = $(buttonId), panel = $(panelId);
    if (!button || !panel) return;
    button.addEventListener('click', function () {
      var opening = panel.hidden;
      panel.hidden = !opening;
      button.setAttribute('aria-expanded', opening ? 'true' : 'false');
      button.innerHTML = (opening ? closeLabel : openLabel) + ' <span aria-hidden="true">' + (opening ? '−' : '＋') + '</span>';
      panel.textContent = content;
    });
  }

  var vpnSteps = isAndroid
    ? 'ANDROID CONNECT STEPS: 1) Install WireGuard from the official source / trusted Play Store listing. 2) Obtain a .conf file or QR code from a VPN service or administrator you trust. 3) In WireGuard, add/import that tunnel and inspect the endpoint and allowed routes. 4) Tap the tunnel switch and approve Android’s VPN permission prompt. 5) Confirm “Active” in WireGuard/Android VPN settings. IGERS cannot perform steps 2–5 on its own. Never import unknown configuration files; they may route or monitor your traffic.'
    : 'DESKTOP CONNECT STEPS: 1) Install the official WireGuard client for Windows, macOS or Linux. 2) Obtain a configuration from a VPN service or administrator you trust. 3) Import the .conf file and verify the peer endpoint and allowed IP routes. 4) Activate the tunnel inside the WireGuard client. 5) Confirm the client says Active and test connectivity. IGERS in a browser cannot start or verify the system tunnel on your behalf. Keep the configuration private.';
  var satSteps = 'SATELLITE CHECKLIST: 1) Confirm exact phone / terminal model support. 2) Verify present service coverage for Bangladesh and the intended location. 3) Confirm whether the service is messaging-only or full internet. 4) Confirm antenna/terminal, firmware, activation and subscription requirements. 5) Only mark it active after the provider/device confirms service. Satellite imagery and public orbital data are not device internet access.';

  toggleGuide('iscVpnGuide', 'iscVpnGuideText', vpnSteps, 'Show connection steps', 'Hide connection steps');
  toggleGuide('iscSatGuide', 'iscSatGuideText', satSteps, 'Check requirements', 'Hide requirements');
  var refreshBtn = $('iscRefresh');
  if (refreshBtn) refreshBtn.addEventListener('click', refresh);
  window.addEventListener('online', refresh);
  window.addEventListener('offline', refresh);
  refresh();
})();
