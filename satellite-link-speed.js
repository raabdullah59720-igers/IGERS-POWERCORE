/* IGERS POWERCORE — Satellite / Internet Link Speed Test panel
 * Release: 2026-10-16-link-speed-v1
 * Adds a client-side throughput test; does NOT establish a VPN tunnel or prove that the path is satellite.
 */
(function () {
  'use strict';
  const RELEASE = '2026-10-16-link-speed-v1';
  const PANEL_ID = 'satLinkSpeedPanel';
  const SPEED_HOST = 'https://speed.cloudflare.com';
  if (window.__IGERS_SAT_LINK_SPEED__ === RELEASE) return;
  window.__IGERS_SAT_LINK_SPEED__ = RELEASE;

  const styles = `
  #${PANEL_ID}{padding:38px 0 56px;color:var(--text,#eef8fc);font:inherit;position:relative;isolation:isolate}
  #${PANEL_ID} .sls-wrap{max-width:1220px;margin:auto;padding:0 22px}
  #${PANEL_ID} .sls-shell{position:relative;overflow:hidden;border:1px solid rgba(85,221,255,.24);border-radius:24px;background:radial-gradient(circle at 85% 4%,rgba(48,177,221,.13),transparent 34%),linear-gradient(145deg,rgba(9,25,35,.97),rgba(4,12,19,.98));box-shadow:0 20px 65px rgba(0,0,0,.25);padding:22px}
  #${PANEL_ID} .sls-shell:before{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(120deg,transparent 0 45%,rgba(85,221,255,.035) 50%,transparent 56%);opacity:.8}
  #${PANEL_ID} .sls-head{position:relative;display:flex;align-items:flex-start;justify-content:space-between;gap:16px;flex-wrap:wrap;margin-bottom:18px}
  #${PANEL_ID} .sls-kicker{font-size:10px;letter-spacing:.16em;color:#65dcff;font-weight:900;text-transform:uppercase}
  #${PANEL_ID} h2{font-size:clamp(24px,3.4vw,38px);line-height:1.08;margin:7px 0 8px;letter-spacing:-.035em}
  #${PANEL_ID} .sls-intro{max-width:760px;color:#97b1bf;font-size:12px;margin:0;line-height:1.65}
  #${PANEL_ID} .sls-badge{display:inline-flex;align-items:center;gap:8px;border:1px solid rgba(138,243,191,.2);background:rgba(138,243,191,.055);color:#9af1bd;padding:7px 10px;border-radius:999px;font-weight:900;font-size:9px;letter-spacing:.1em;white-space:nowrap}
  #${PANEL_ID} .sls-led{width:7px;height:7px;border-radius:50%;background:#8af3bf;box-shadow:0 0 13px #8af3bf}
  #${PANEL_ID} .sls-grid{position:relative;display:grid;grid-template-columns:1.15fr .85fr;gap:14px}
  #${PANEL_ID} .sls-card{border:1px solid rgba(125,180,202,.17);border-radius:18px;background:rgba(5,16,24,.72);padding:17px;min-width:0}
  #${PANEL_ID} .sls-card-title{font-size:10px;text-transform:uppercase;letter-spacing:.13em;color:#9db7c4;font-weight:850}
  #${PANEL_ID} .sls-result-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px;margin-top:12px}
  #${PANEL_ID} .sls-metric{border:1px solid rgba(111,167,190,.16);border-radius:13px;padding:12px;min-width:0;background:linear-gradient(145deg,rgba(14,35,47,.76),rgba(5,17,25,.82))}
  #${PANEL_ID} .sls-metric small{display:block;color:#91aab7;font-size:9px;letter-spacing:.12em;text-transform:uppercase}
  #${PANEL_ID} .sls-number{font-size:clamp(22px,3vw,34px);line-height:1.15;font-weight:900;letter-spacing:-.04em;margin-top:8px;color:#f1fbff;font-variant-numeric:tabular-nums;overflow-wrap:anywhere}
  #${PANEL_ID} .sls-unit{font-size:10px;color:#7e9aa8;font-weight:700;letter-spacing:0}
  #${PANEL_ID} .sls-visual{height:100px;margin-top:12px;border-radius:12px;border:1px solid rgba(85,221,255,.12);background:linear-gradient(180deg,rgba(5,21,30,.8),rgba(3,11,16,.6));overflow:hidden;position:relative;display:flex;align-items:flex-end;gap:5px;padding:12px}
  #${PANEL_ID} .sls-bar{display:block;flex:1;min-width:2px;height:var(--h,25%);border-radius:4px 4px 1px 1px;background:linear-gradient(180deg,#8af3bf,#3f9cce);opacity:.65;transform-origin:bottom;transition:height .25s ease,opacity .25s ease}
  #${PANEL_ID} .sls-shell.sls-running .sls-bar{animation:slsPulse .9s ease-in-out infinite alternate;opacity:.95}
  #${PANEL_ID} .sls-shell.sls-running .sls-bar:nth-child(3n){animation-delay:.15s}#${PANEL_ID} .sls-shell.sls-running .sls-bar:nth-child(2n){animation-delay:.3s}
  @keyframes slsPulse{from{transform:scaleY(.45);filter:brightness(.8)}to{transform:scaleY(1);filter:brightness(1.25)}}
  #${PANEL_ID} .sls-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px}
  #${PANEL_ID} .sls-btn{border:1px solid #264958;border-radius:11px;background:#081924;color:#d9f4fc;font:inherit;font-size:11px;font-weight:850;padding:11px 14px;cursor:pointer;transition:transform .15s ease,border-color .15s ease,background .15s ease}
  #${PANEL_ID} .sls-btn:hover{border-color:#55ddff;transform:translateY(-1px)}#${PANEL_ID} .sls-btn:focus-visible{outline:2px solid #55ddff;outline-offset:3px}
  #${PANEL_ID} .sls-btn.primary{border-color:transparent;background:linear-gradient(130deg,#55ddff,#8af3bf);color:#031116}
  #${PANEL_ID} .sls-btn:disabled{opacity:.5;cursor:not-allowed;transform:none}
  #${PANEL_ID} .sls-choice{display:flex;gap:9px;align-items:center;flex-wrap:wrap;margin-top:12px;color:#a6bdc8;font-size:10px}
  #${PANEL_ID} .sls-choice select{background:#071721;color:#eef8fc;border:1px solid #244653;border-radius:9px;padding:8px 30px 8px 9px;font:inherit;max-width:100%}
  #${PANEL_ID} .sls-state{font-size:11px;color:#a1b9c5;line-height:1.6;margin-top:11px;min-height:36px}
  #${PANEL_ID} .sls-state[data-kind="ok"]{color:#9bf0bd}#${PANEL_ID} .sls-state[data-kind="warn"]{color:#ffd58a}#${PANEL_ID} .sls-state[data-kind="error"]{color:#ffaaa5}
  #${PANEL_ID} .sls-spec{display:grid;gap:0;margin-top:8px}
  #${PANEL_ID} .sls-row{display:flex;justify-content:space-between;gap:10px;padding:11px 0;border-bottom:1px solid rgba(141,181,198,.1);font-size:10px;align-items:flex-start}
  #${PANEL_ID} .sls-row:last-child{border-bottom:0}#${PANEL_ID} .sls-row span{color:#8fa9b6}#${PANEL_ID} .sls-row b{color:#e5f6fb;text-align:right;font-variant-numeric:tabular-nums}
  #${PANEL_ID} .sls-note{position:relative;margin-top:14px;padding:12px 14px;border:1px dashed rgba(255,211,122,.25);border-radius:13px;background:rgba(66,48,14,.16);color:#c3b28b;font-size:10px;line-height:1.65}
  #${PANEL_ID} .sls-note strong{color:#ffda91}
  @media(max-width:850px){#${PANEL_ID} .sls-grid{grid-template-columns:1fr}}
  @media(max-width:600px){#${PANEL_ID} .sls-wrap{padding:0 14px}#${PANEL_ID} .sls-shell{padding:15px;border-radius:18px}#${PANEL_ID} .sls-result-grid{grid-template-columns:1fr 1fr}#${PANEL_ID} .sls-metric:last-child{grid-column:1/-1}#${PANEL_ID} .sls-btn{flex:1}#${PANEL_ID} .sls-visual{height:82px}}
  @media(prefers-reduced-motion:reduce){#${PANEL_ID} *,#${PANEL_ID} *:before,#${PANEL_ID} *:after{animation:none!important;transition:none!important}}
  `;

  function el(tag, attrs, children) {
    const n = document.createElement(tag);
    Object.entries(attrs || {}).forEach(([k, v]) => {
      if (k === 'class') n.className = v;
      else if (k === 'text') n.textContent = v;
      else if (k.startsWith('aria-') || k === 'role' || k === 'type' || k === 'id' || k === 'data-kind') n.setAttribute(k, v);
      else n.setAttribute(k, v);
    });
    (children || []).forEach(c => n.append(c));
    return n;
  }
  function makePanel() {
    const section = document.createElement('section');
    section.id = PANEL_ID;
    section.setAttribute('aria-labelledby', 'slsTitle');
    section.innerHTML = `
      <div class="sls-wrap"><div class="sls-shell" id="slsShell">
        <header class="sls-head"><div><div class="sls-kicker">IGERS · LINK PERFORMANCE LAB · ${RELEASE}</div>
          <h2 id="slsTitle">Satellite / Internet Link Speed Test</h2>
          <p class="sls-intro">Measure the connection currently used by this browser. Results are an end-to-end speed-test estimate, not a carrier certification or a satellite-modem reading.</p></div>
          <span class="sls-badge"><i class="sls-led"></i><span id="slsBadgeText">READY TO TEST</span></span>
        </header>
        <div class="sls-grid">
          <article class="sls-card"><div class="sls-card-title">Measured link throughput</div>
            <div class="sls-result-grid">
              <div class="sls-metric"><small>Download</small><div class="sls-number" id="slsDown">— <span class="sls-unit">Mbps</span></div></div>
              <div class="sls-metric"><small>Upload</small><div class="sls-number" id="slsUp">— <span class="sls-unit">Mbps</span></div></div>
              <div class="sls-metric"><small>Latency / jitter</small><div class="sls-number" id="slsLatency">— <span class="sls-unit">ms</span></div><div style="color:#8fa9b6;font-size:9px;margin-top:5px" id="slsJitter">Jitter: — ms</div></div>
            </div>
            <div class="sls-visual" id="slsVisual" role="img" aria-label="Animated link test activity bars">${Array.from({length:24}, (_, i) => `<i class="sls-bar" style="--h:${18 + ((i * 37) % 70)}%"></i>`).join('')}</div>
            <div class="sls-choice"><label for="slsProfile">Test profile</label><select id="slsProfile"><option value="quick">Quick · lower data</option><option value="standard" selected>Standard · balanced</option><option value="deep">Extended · higher data</option></select><span id="slsDataBudget">Approx. 10 MB total</span></div>
            <div class="sls-actions"><button class="sls-btn primary" id="slsStart" type="button">▶ Run speed test</button><button class="sls-btn" id="slsStop" type="button" disabled>■ Cancel</button><button class="sls-btn" id="slsReset" type="button">Reset results</button></div>
            <div class="sls-state" id="slsState" role="status" aria-live="polite" data-kind="">Ready. Click “Run speed test” to measure this browser's connection.</div>
          </article>
          <aside class="sls-card"><div class="sls-card-title">Connection diagnostics</div>
            <div class="sls-spec"><div class="sls-row"><span>Browser network state</span><b id="slsOnline">Checking…</b></div>
              <div class="sls-row"><span>Browser connection type</span><b id="slsType">Not exposed</b></div>
              <div class="sls-row"><span>Data-saver mode</span><b id="slsSaveData">Not exposed</b></div>
              <div class="sls-row"><span>Test endpoint</span><b>Cloudflare speed-test edge</b></div>
              <div class="sls-row"><span>Last test (local time)</span><b id="slsTime">—</b></div>
              <div class="sls-row"><span>Module release</span><b>${RELEASE}</b></div>
            </div>
            <div class="sls-note"><strong>Important:</strong> Mbps is measured to the test endpoint over the active device/network path. This panel cannot confirm that a satellite provider or VPN tunnel is active. Satellite confirmation requires compatible modem/provider telemetry; a static GitHub Pages site cannot create a system-level VPN tunnel by itself.</div>
          </aside>
        </div>
      </div></div>`;
    return section;
  }

  function install() {
    if (!document.body || document.getElementById(PANEL_ID)) return;
    const style = document.createElement('style');
    style.id = 'sls-inline-styles';
    style.textContent = styles;
    document.head.append(style);
    const panel = makePanel();
    const target = document.getElementById('igersSecureConnectivity') || document.getElementById('satelliteMonitor');
    const footer = document.querySelector('footer');
    if (target && target.parentNode) target.insertAdjacentElement('afterend', panel);
    else if (footer && footer.parentNode) footer.insertAdjacentElement('beforebegin', panel);
    else document.body.append(panel);
    addNavigationLink();
    wireUI(panel);
    refreshNetworkState(panel);
    window.addEventListener('online', () => refreshNetworkState(panel));
    window.addEventListener('offline', () => refreshNetworkState(panel));
  }

  function addNavigationLink() {
    const navGroup = Array.from(document.querySelectorAll('.nav-menu')).find(menu => menu.querySelector('a[href="#satelliteMonitor"]'));
    if (!navGroup || navGroup.querySelector('a[href="#' + PANEL_ID + '"]')) return;
    const link = document.createElement('a');
    link.href = '#' + PANEL_ID;
    link.textContent = 'Link Speed Test (Mbps)';
    navGroup.append(link);
  }

  function refreshNetworkState(panel) {
    const online = panel.querySelector('#slsOnline');
    const type = panel.querySelector('#slsType');
    const save = panel.querySelector('#slsSaveData');
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (online) online.textContent = navigator.onLine ? 'Browser online' : 'Browser offline';
    if (type) type.textContent = conn ? [conn.type || 'connection', conn.effectiveType || ''].filter(Boolean).join(' · ') : 'Not exposed by browser';
    if (save) save.textContent = conn && typeof conn.saveData === 'boolean' ? (conn.saveData ? 'Enabled' : 'Disabled') : 'Not exposed';
  }

  function wireUI(panel) {
    const shell = panel.querySelector('#slsShell');
    const start = panel.querySelector('#slsStart');
    const stop = panel.querySelector('#slsStop');
    const reset = panel.querySelector('#slsReset');
    const profile = panel.querySelector('#slsProfile');
    const budget = panel.querySelector('#slsDataBudget');
    const stateEl = panel.querySelector('#slsState');
    const badge = panel.querySelector('#slsBadgeText');
    let controller = null;
    const budgets = { quick: {down:[1500000,2500000],up:500000}, standard:{down:[2500000,7000000],up:1500000}, deep:{down:[6000000,14000000],up:4000000} };
    function setState(text, kind) { stateEl.textContent = text; stateEl.dataset.kind = kind || ''; }
    function updateBudget() {
      const b = budgets[profile.value] || budgets.standard;
      const approx = (b.down.reduce((a,x)=>a+x,0) + b.up) / 1000000;
      budget.textContent = 'Approx. ' + (approx < 10 ? approx.toFixed(1) : Math.round(approx)) + ' MB transfer';
    }
    profile.addEventListener('change', updateBudget);
    updateBudget();
    function renderNumber(id, value) {
      const node = panel.querySelector('#' + id);
      node.textContent = Number.isFinite(value) ? value.toFixed(value >= 100 ? 0 : value >= 10 ? 1 : 2) : '—';
      const unit = document.createElement('span'); unit.className = 'sls-unit'; unit.textContent = ' Mbps'; node.append(' ', unit);
    }
    function clearMeasuredResults() {
      panel.querySelector('#slsDown').innerHTML = '— <span class="sls-unit">Mbps</span>';
      panel.querySelector('#slsUp').innerHTML = '— <span class="sls-unit">Mbps</span>';
      panel.querySelector('#slsLatency').innerHTML = '— <span class="sls-unit">ms</span>';
      panel.querySelector('#slsJitter').textContent = 'Jitter: — ms';
      panel.querySelector('#slsTime').textContent = '—';
    }
    function resetResults() {
      clearMeasuredResults();
      badge.textContent = 'READY TO TEST'; shell.classList.remove('sls-running');
      setState('Results cleared. Click “Run speed test” to start a new measurement.', '');
    }
    reset.addEventListener('click', () => { if (controller) controller.abort(); controller = null; start.disabled = false; stop.disabled = true; resetResults(); });
    stop.addEventListener('click', () => { if (controller) controller.abort(); setState('Cancellation requested…', 'warn'); });
    start.addEventListener('click', async () => {
      if (controller) controller.abort();
      controller = new AbortController();
      const localController = controller;
      const signal = localController.signal;
      const cfg = budgets[profile.value] || budgets.standard;
      start.disabled = true; stop.disabled = false; profile.disabled = true;
      shell.classList.add('sls-running'); badge.textContent = 'TEST IN PROGRESS';
      panel.querySelector('#slsDown').innerHTML = '— <span class="sls-unit">Mbps</span>';
      panel.querySelector('#slsUp').innerHTML = '— <span class="sls-unit">Mbps</span>';
      panel.querySelector('#slsLatency').innerHTML = '— <span class="sls-unit">ms</span>';
      panel.querySelector('#slsJitter').textContent = 'Jitter: measuring…';
      try {
        if (!navigator.onLine) throw new Error('This browser reports offline. Reconnect and try again.');
        setState('Step 1/3 · Measuring latency to the test edge…', '');
        const pings = [];
        for (let i = 0; i < 3; i++) {
          const t0 = performance.now();
          const res = await fetch(SPEED_HOST + '/__down?bytes=1000&cacheBust=' + Date.now() + '-' + i, { method:'GET', cache:'no-store', mode:'cors', signal });
          if (!res.ok) throw new Error('Test endpoint returned HTTP ' + res.status + '.');
          await res.arrayBuffer();
          pings.push(performance.now() - t0);
        }
        const avgPing = pings.reduce((a,x)=>a+x,0)/pings.length;
        const jitter = Math.max(...pings) - Math.min(...pings);
        panel.querySelector('#slsLatency').innerHTML = avgPing.toFixed(1) + ' <span class="sls-unit">ms</span>';
        panel.querySelector('#slsJitter').textContent = 'Jitter: ' + jitter.toFixed(1) + ' ms';
        setState('Step 2/3 · Measuring download throughput…', '');
        let downBytes = 0; let downStart = performance.now();
        for (let i = 0; i < cfg.down.length; i++) {
          const bytes = cfg.down[i];
          const t0 = performance.now();
          const res = await fetch(SPEED_HOST + '/__down?bytes=' + bytes + '&cacheBust=' + Date.now() + '-' + i, { method:'GET', cache:'no-store', mode:'cors', signal });
          if (!res.ok) throw new Error('Download measurement failed (HTTP ' + res.status + ').');
          const data = await res.arrayBuffer();
          downBytes += data.byteLength;
          const elapsed = Math.max(1, performance.now() - t0);
          const interim = data.byteLength * 8 / elapsed / 1000;
          const bars = panel.querySelectorAll('.sls-bar');
          bars.forEach((bar, j) => bar.style.setProperty('--h', (12 + Math.min(84, interim * 2.7) * (0.25 + ((j * 17) % 70) / 100)) + '%'));
        }
        const downMs = Math.max(1, performance.now() - downStart);
        const downMbps = downBytes * 8 / downMs / 1000;
        renderNumber('slsDown', downMbps);
        setState('Step 3/3 · Measuring upload throughput…', '');
        const upBytes = cfg.up;
        const payload = new Uint8Array(upBytes);
        for (let off = 0; off < payload.length; off += 65536) {
          const chunk = payload.subarray(off, Math.min(payload.length, off + 65536));
          if (window.crypto && crypto.getRandomValues) crypto.getRandomValues(chunk);
          else for (let j = 0; j < chunk.length; j++) chunk[j] = (j * 31 + off) & 255;
        }
        const upStart = performance.now();
        const upRes = await fetch(SPEED_HOST + '/__up?cacheBust=' + Date.now(), { method:'POST', headers:{'Content-Type':'application/octet-stream'}, body:payload, cache:'no-store', mode:'cors', signal });
        if (!upRes.ok) throw new Error('Upload measurement failed (HTTP ' + upRes.status + ').');
        try { await upRes.arrayBuffer(); } catch (_) { /* Some endpoints return no readable body; HTTP success is enough. */ }
        const upMs = Math.max(1, performance.now() - upStart);
        const upMbps = upBytes * 8 / upMs / 1000;
        renderNumber('slsUp', upMbps);
        panel.querySelector('#slsTime').textContent = new Date().toLocaleString();
        badge.textContent = 'TEST COMPLETE';
        setState('Test complete. Download/upload are estimates to the selected public test edge; latency includes browser and network overhead.', 'ok');
      } catch (error) {
        clearMeasuredResults();
        if (error && error.name === 'AbortError') {
          badge.textContent = 'TEST CANCELLED'; setState('Test cancelled. Partial measurements were cleared; no incomplete result is shown as final.', 'warn');
        } else {
          badge.textContent = 'TEST UNAVAILABLE';
          const message = error && error.message ? error.message : 'Unknown network error.';
          setState('Unable to complete the test: ' + message + ' This can be caused by a blocked endpoint, CORS/network policy, or connectivity failure; incomplete measurements were cleared.', 'error');
        }
      } finally {
        if (controller === localController) controller = null;
        start.disabled = false; stop.disabled = true; profile.disabled = false; shell.classList.remove('sls-running');
        refreshNetworkState(panel);
      }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install, { once:true });
  else install();
})();
