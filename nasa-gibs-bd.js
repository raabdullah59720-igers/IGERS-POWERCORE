/* IGERS POWERCORE — direct NASA GIBS public imagery panel
 * Uses NASA's documented WMTS tile endpoint. A tile layer is an imagery viewer, not a live sensor feed.
 */
(function () {
  'use strict';
  if (window.__igersNasaGibsBDLoaded) return;
  window.__igersNasaGibsBDLoaded = true;

  const $ = (id) => document.getElementById(id);
  const state = {
    z: 6, lat: 23.685, lon: 90.3563,
    layer: 'VIIRS_SNPP_CorrectedReflectance_TrueColor',
    loaded: 0, failed: 0, total: 0, seq: 0, drawId: 0, candidate: 0,
    dates: [], started: 0
  };

  function dateString(date) {
    return date.toISOString().slice(0, 10);
  }
  function makeCandidates() {
    const now = Date.now();
    const dates = [];
    // Daily satellite products can lag acquisition/processing; try yesterday first,
    // then a bounded recent history. Avoid the ambiguous 'default' time dimension.
    for (let i = 1; i <= 7; i++) dates.push(dateString(new Date(now - 86400000 * i)));
    dates.push(dateString(new Date(now)));
    return dates;
  }
  function xFloat(lon, zoom) {
    return (lon + 180) / 360 * Math.pow(2, zoom);
  }
  function yFloat(lat, zoom) {
    const phi = Math.max(-85.05112878, Math.min(85.05112878, lat)) * Math.PI / 180;
    return (0.5 - Math.log((1 + Math.sin(phi)) / (1 - Math.sin(phi))) / (4 * Math.PI)) * Math.pow(2, zoom);
  }
  function tileUrl(date, z, x, y) {
    return 'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/' +
      encodeURIComponent(state.layer) + '/default/' + date +
      '/GoogleMapsCompatible_Level9/' + z + '/' + y + '/' + x + '.jpg';
  }
  function status(text, kind) {
    const e = $('gibsBDState');
    if (e) {
      e.textContent = text;
      e.className = 'gibs-state ' + (kind || '');
    }
  }
  function updateCount() {
    const e = $('gibsBDCount');
    if (e) e.textContent = state.loaded + '/' + state.total + (state.failed ? ' · ' + state.failed + ' unavailable' : '');
  }
  function drawTiles(date, seq) {
    const box = $('gibsBDTiles');
    const map = $('gibsBDMap');
    if (!box || !map || seq !== state.seq) return;
    box.replaceChildren();
    state.loaded = 0;
    state.failed = 0;
    state.total = 0;
    state.drawId++;
    const drawId = state.drawId;
    const z = state.z;
    const xf = xFloat(state.lon, z), yf = yFloat(state.lat, z);
    const cx = Math.floor(xf), cy = Math.floor(yf);
    const fracX = xf - cx, fracY = yf - cy;
    const width = map.clientWidth || 360;
    const height = map.clientHeight || 230;

    for (let dx = -2; dx <= 2; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const tx = cx + dx, ty = cy + dy;
        const img = document.createElement('img');
        img.className = 'gibs-tile';
        img.alt = 'NASA GIBS public satellite imagery tile';
        img.loading = 'eager';
        img.decoding = 'async';
        img.referrerPolicy = 'no-referrer';
        img.style.left = Math.round(width / 2 + (tx - xf) * 256) + 'px';
        img.style.top = Math.round(height / 2 + (ty - yf) * 256) + 'px';
        img.src = tileUrl(date, z, tx, ty);
        img.addEventListener('load', () => {
          if (seq !== state.seq || drawId !== state.drawId) return;
          state.loaded++;
          updateCount();
          if (state.loaded >= 2) status('NASA GIBS · CONNECTED', 'ok');
        }, { once: true });
        img.addEventListener('error', () => {
          if (seq !== state.seq || drawId !== state.drawId) return;
          state.failed++;
          updateCount();
          if (state.failed === state.total && state.loaded === 0) {
            status('RETRYING IMAGERY DATE', 'warn');
            setTimeout(() => {
              if (seq !== state.seq || drawId !== state.drawId || state.loaded > 0) return;
              if (state.candidate + 1 < state.dates.length) {
                state.candidate++;
                drawTiles(state.dates[state.candidate], seq);
              } else status('NASA GIBS UNAVAILABLE · OPEN PUBLIC VIEWER', 'off');
            }, 200);
          }
        }, { once: true });
        box.appendChild(img);
        state.total++;
      }
    }
    updateCount();
    if ($('gibsBDDate')) $('gibsBDDate').textContent = date === 'default' ? 'NASA default / latest available layer date' : 'Imagery date · ' + date;
    status(date === 'default' ? 'LOADING NASA GIBS' : 'LOADING · ' + date, 'warn');

    // Don't treat a blank/unsupported date as a successful feed; move on to the next bounded candidate.
    const dateTimer = setTimeout(() => {
      if (seq !== state.seq || drawId !== state.drawId) return;
      if (state.loaded < 2) {
        state.candidate++;
        if (state.candidate < state.dates.length) drawTiles(state.dates[state.candidate], seq);
        else status('NASA GIBS UNAVAILABLE · OPEN PUBLIC VIEWER', 'off');
      }
    }, 5000);
    // Ensure timers are harmless on subsequent redraws; seq/drawId guards invalidate them.
    void dateTimer;
  }
  function refresh() {
    state.seq++;
    state.candidate = 0;
    state.dates = makeCandidates();
    state.started = Date.now();
    drawTiles(state.dates[0], state.seq);
  }
  function init() {
    if (!$('gibsBDTiles')) return;
    $('gibsBDRefresh')?.addEventListener('click', refresh);
    $('gibsBDZoomIn')?.addEventListener('click', () => { state.z = Math.min(8, state.z + 1); refresh(); });
    $('gibsBDZoomOut')?.addEventListener('click', () => { state.z = Math.max(5, state.z - 1); refresh(); });
    $('gibsBDLayer')?.addEventListener('change', (e) => { state.layer = e.target.value; refresh(); });
    window.addEventListener('online', refresh);
    window.addEventListener('resize', () => {
      // Reposition tiles for the new viewport without generating another API candidate cycle.
      const date = state.dates[state.candidate] || 'default';
      state.seq++;
      drawTiles(date, state.seq);
    });
    refresh();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
