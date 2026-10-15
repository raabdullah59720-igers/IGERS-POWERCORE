/* IGERS-BD-01 Secure Connectivity Companion v1.0
 * Honest status only: this web module does not create a VPN or satellite link.
 * Requires an installed/configured OS VPN client and a real internet provider.
 */
(function () {
  'use strict';
  if (window.__igersSecureConnectivityLoaded) return;
  window.__igersSecureConnectivityLoaded = true;
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const isAndroid = /Android/i.test(navigator.userAgent);
  const isAppleMobile = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isDesktop = !isAndroid && !isAppleMobile;
  const platform = isAndroid ? 'Android device' : isAppleMobile ? 'Apple mobile device' : isDesktop ? 'Desktop / laptop' : 'Unidentified device';
  const section = document.createElement('section');
  section.id = 'igersSecureConnectivity';
  section.setAttribute('aria-labelledby', 'iscTitle');
  section.innerHTML = `
    <div class="isc-wrap">
      <header class="isc-head"><div><span class="isc-kicker">IGERS · DEFENSIVE MODULAR SYSTEM · ADD-ON</span><h2 id="iscTitle">Secure Connectivity & Satellite Access</h2><p>Cross-platform readiness panel for Android and desktop. The panel checks browser connectivity and provides safe setup paths; it does not impersonate an active VPN or satellite modem.</p></div><span class="isc-chip" id="iscBrowserState">CHECKING</span></header>
      <div class="isc-notice"><strong>Security boundary</strong> A satellite catalogue or satellite image is not an internet connection. A VPN encrypts traffic only after a valid VPN tunnel is established. No free satellite bandwidth is unlocked by this app.</div>
      <div class="isc-grid">
        <article class="isc-card"><div class="isc-card-top"><span class="isc-icon">⌁</span><div><h3>VPN readiness</h3><p>WireGuard / OS VPN client</p></div></div><div class="isc-status"><span>Browser network</span><b id="iscNetwork">Checking…</b></div><div class="isc-status"><span>VPN tunnel</span><b class="isc-unknown" id="iscVpn">NOT DETECTABLE FROM WEB</b></div><p class="isc-note">A web page cannot securely switch on a system-wide VPN. Install the client, import a configuration from a trusted VPN administrator, then connect in device settings/client.</p><a class="isc-link" href="https://www.wireguard.com/install/" target="_blank" rel="noopener noreferrer">Official WireGuard installation ↗</a><button class="isc-btn" id="iscVpnGuide" type="button">Show setup guide for this device</button><div id="iscVpnGuideText" class="isc-guide" hidden></div></article>
        <article class="isc-card"><div class="isc-card-top"><span class="isc-icon">◉</span><div><h3>Satellite-to-device</h3><p>Compatibility & provider access</p></div></div><div class="isc-status"><span>Device detected</span><b id="iscPlatform"></b></div><div class="isc-status"><span>Satellite internet</span><b class="isc-unknown">NOT VERIFIED</b></div><p class="isc-note">Direct satellite connectivity depends on compatible hardware, a supported carrier/provider, local coverage and service terms. Ordinary satellite imagery APIs do not provide device internet.</p><a class="isc-link" href="https://www.starlink.com/" target="_blank" rel="noopener noreferrer">Check provider availability ↗</a><button class="isc-btn" id="iscSatGuide" type="button">Check requirements</button><div id="iscSatGuideText" class="isc-guide" hidden></div></article>
        <article class="isc-card isc-wide"><div class="isc-card-top"><span class="isc-icon">⛨</span><div><h3>Security & administrator controls</h3><p>Safe defaults for web and native app deployments</p></div></div><div class="isc-security-list"><div><b>Credentials</b><span>No administrator password is embedded in this public JavaScript module.</span></div><div><b>Connection claims</b><span>VPN and satellite links remain “unverified” until a trusted native client/provider confirms them.</span></div><div><b>Data handling</b><span>This module does not collect VPN keys, passwords, or traffic content.</span></div></div><p class="isc-note">For real admin protection, configure server-side authentication (or a native app's OS-protected credential store). A password placed in public HTML/JavaScript can be extracted and must not be treated as secure.</p></article>
      </div>
      <footer class="isc-footer"><span id="iscLastCheck">Last browser check: —</span><button class="isc-btn" id="iscRefresh" type="button">Refresh status</button><span>Readiness panel · no remote controls</span></footer>
    </div>`;
  const style = document.createElement('link'); style.rel = 'stylesheet'; style.href = 'igers-secure-connectivity.css?v=20261015-v1';
  document.head.appendChild(style);
  function mount() {
    const defensive = document.getElementById('defensiveModules');
    if (defensive && defensive.parentNode) defensive.insertAdjacentElement('afterend', section);
    else document.body.appendChild(section);
    const $ = id => document.getElementById(id);
    $('iscPlatform').textContent = platform;
    function refresh() {
      const online = navigator.onLine;
      $('iscNetwork').textContent = online ? 'BROWSER ONLINE' : 'BROWSER OFFLINE';
      $('iscNetwork').className = online ? 'isc-good' : 'isc-bad';
      $('iscBrowserState').textContent = online ? 'BROWSER ONLINE · VPN UNKNOWN' : 'OFFLINE';
      $('iscBrowserState').className = 'isc-chip ' + (online ? 'isc-chip-warn' : 'isc-chip-bad');
      $('iscLastCheck').textContent = 'Last browser check: ' + new Date().toLocaleString();
    }
    $('iscRefresh').addEventListener('click', refresh);
    window.addEventListener('online', refresh);
    window.addEventListener('offline', refresh);
    $('iscVpnGuide').addEventListener('click', () => {
      const panel = $('iscVpnGuideText'); panel.hidden = !panel.hidden;
      panel.textContent = isAndroid
        ? 'Android: install WireGuard from its official source or use the trusted Play Store listing; obtain a configuration from a VPN provider you trust; import it into WireGuard; review the endpoint and allowed routes; connect and verify the VPN key icon / Android VPN status. Do not import unknown .conf files.'
        : isDesktop
          ? 'Desktop: install the official WireGuard client for your OS; obtain a configuration from a trusted VPN administrator/provider; import it; verify the peer endpoint and routes; connect, then check the client status. A configuration file contains sensitive network details—do not publish it.'
          : 'Install a VPN client supported by your operating system, obtain a configuration from a trusted provider, and confirm the active tunnel in the OS VPN settings. This page cannot enable it directly.';
      $('iscVpnGuide').textContent = panel.hidden ? 'Show setup guide for this device' : 'Hide setup guide';
    });
    $('iscSatGuide').addEventListener('click', () => {
      const panel = $('iscSatGuideText'); panel.hidden = !panel.hidden;
      panel.textContent = 'Confirm these items with the provider: (1) exact phone/device model support, (2) country and current coverage, (3) whether service is messaging-only or full internet, (4) required antenna/terminal or firmware, (5) activation and subscription requirements. If any item is not confirmed, do not label satellite internet as active.';
      $('iscSatGuide').textContent = panel.hidden ? 'Check requirements' : 'Hide requirements';
    });
    refresh();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, {once:true}); else mount();
})();
