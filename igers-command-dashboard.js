/* IGERS POWERCORE command dashboard. Provider-backed metrics only; no fabricated telemetry. */
(function () {
  'use strict';
  if (window.__igersCommandDashboardLoaded) return;
  window.__igersCommandDashboardLoaded = true;
  const $ = (id) => document.getElementById(id);
  const state = { weather: null, weatherAt: 0, quakes: null, quakeAt: 0, aircraft: null, aircraftAt: 0, map: null, mapMode: 'imagery', imageryOk: false, imageryError: false, energy: 'not-connected', timers: [], leaflet: false };
  const esc = (value) => String(value == null ? '' : value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const setText = (id, value) => { const el = $(id); if (el) el.textContent = value == null ? '—' : String(value); };
  const stamp = (time = Date.now()) => new Date(time).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'Asia/Dhaka' });
  const dateStamp = (time = Date.now()) => new Date(time).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Dhaka' });
  function setBadge(id, text, kind) { const e = $(id); if (!e) return; e.className = (id === 'igdOverallStatus' ? 'igd-live-pill' : 'igd-feed-badge') + ' status-' + (kind || 'pending'); const label = e.querySelector('span'); if (label) label.textContent = text; else e.textContent = text; }
  function setDot(id, kind) { const e = $(id); if (e) e.className = 'igd-status-dot' + (kind ? ' ' + kind : ''); }
  function timeoutFetch(url, timeoutMs = 10000) {
    const controller = new AbortController(); const timer = setTimeout(() => controller.abort(), timeoutMs);
    return fetch(url, { cache: 'no-store', mode: 'cors', signal: controller.signal, headers: { Accept: 'application/json' } }).then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); }).finally(() => clearTimeout(timer));
  }
  function updateClock() {
    setText('igdDhakaClock', stamp()); setText('igdDhakaDate', dateStamp());
    setText('igdNetworkText', navigator.onLine ? 'Browser online' : 'Browser offline'); setDot('igdNetworkDot', navigator.onLine ? '' : 'offline');
    if (!navigator.onLine) setBadge('igdOverallStatus', 'NETWORK OFFLINE', 'offline'); else refreshOverall();
  }
  function refreshOverall() {
    const checks = [state.weatherAt, state.quakeAt, state.aircraftAt, state.imageryOk ? Date.now() : 0];
    const active = checks.filter(Boolean).length;
    setText('igdFeedsConnected', active + ' / 4');
    setText('igdFeedsLabel', active ? 'Successful public provider responses' : 'Waiting for public provider responses');
    if (active >= 3) setBadge('igdOverallStatus', 'PUBLIC DATA CONNECTED', 'live');
    else if (active > 0) setBadge('igdOverallStatus', 'PARTIAL DATA', 'pending');
    else setBadge('igdOverallStatus', navigator.onLine ? 'CONNECTING' : 'NETWORK OFFLINE', navigator.onLine ? 'pending' : 'offline');
  }
  function weatherLabel(code) {
    const map = {0:'Clear sky',1:'Mainly clear',2:'Partly cloudy',3:'Overcast',45:'Fog',48:'Depositing rime fog',51:'Light drizzle',53:'Drizzle',55:'Dense drizzle',56:'Freezing drizzle',57:'Freezing drizzle',61:'Light rain',63:'Rain',65:'Heavy rain',66:'Freezing rain',67:'Freezing rain',71:'Light snow',73:'Snow',75:'Heavy snow',77:'Snow grains',80:'Rain showers',81:'Rain showers',82:'Heavy rain showers',85:'Snow showers',86:'Heavy snow showers',95:'Thunderstorm',96:'Thunderstorm with hail',99:'Thunderstorm with hail'};
    return map[Number(code)] || 'Condition code ' + String(code);
  }
  function weatherIcon(code) { code = Number(code); if (code === 0) return '☀'; if ([1,2,3,45,48].includes(code)) return '☁'; if ([51,53,55,56,57,61,63,65,66,67,80,81,82].includes(code)) return '☂'; if ([95,96,99].includes(code)) return 'ϟ'; return '☼'; }
  async function loadWeather() {
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=23.8103&longitude=90.4125&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,precipitation,weather_code&hourly=precipitation_probability&forecast_days=1&timezone=Asia%2FDhaka';
    try {
      const data = await timeoutFetch(url, 10000); const c = data && data.current; if (!c || !Number.isFinite(Number(c.temperature_2m))) throw new Error('No current weather fields');
      state.weather = data; state.weatherAt = Date.now(); const temp = Math.round(Number(c.temperature_2m)) + '°C'; const hum = Math.round(Number(c.relative_humidity_2m)) + '%';
      setText('igdHeaderTemp', temp); setText('igdWeatherTemp', temp); setText('igdWeatherNow', temp); setText('igdWeatherHumidity', 'Humidity ' + hum); setText('igdWeatherHum2', hum); setText('igdWeatherWind', Math.round(Number(c.wind_speed_10m)) + ' km/h'); setText('igdWeatherRain', Number(c.precipitation).toLocaleString('en-US', { maximumFractionDigits: 1 }) + ' mm');
      const label = weatherLabel(c.weather_code); setText('igdHeaderWeather', label); setText('igdWeatherCondition', label); setText('igdWeatherIcon', weatherIcon(c.weather_code)); setText('igdWeatherBigIcon', weatherIcon(c.weather_code));
      setText('igdWeatherTime', c.time ? String(c.time).replace('T', ' ') + ' · Asia/Dhaka' : 'Provider timestamp unavailable');
      setBadge('igdWeatherState', 'SOURCE OK', 'live');
    } catch (error) {
      state.weatherAt = 0; setBadge('igdWeatherState', 'OFFLINE / STALE', 'offline'); setText('igdHeaderWeather', 'Weather source unavailable'); setText('igdWeatherCondition', 'Weather source unavailable'); setText('igdWeatherTime', 'No successful response');
    }
    refreshOverall();
  }
  function isAsia(feature) {
    const coords = feature && feature.geometry && feature.geometry.coordinates;
    if (!Array.isArray(coords) || coords.length < 2) return false;
    const lon = Number(coords[0]), lat = Number(coords[1]); return Number.isFinite(lon) && Number.isFinite(lat) && lat >= -10 && lat <= 80 && lon >= 25 && lon <= 180;
  }
  async function loadQuakes() {
    try {
      const data = await timeoutFetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson', 10000);
      if (!Array.isArray(data.features)) throw new Error('USGS GeoJSON did not contain features');
      const asia = data.features.filter(isAsia).sort((a,b) => Number(b.properties && b.properties.time || 0) - Number(a.properties && a.properties.time || 0));
      state.quakes = asia; state.quakeAt = Date.now(); setText('igdQuakeCount', asia.length); setText('igdQuakeUpdated', 'Past 24 h · response received ' + stamp()); setText('igdQuakeTime', stamp()); setBadge('igdQuakeState', 'SOURCE OK', 'live');
      const box = $('igdQuakeList'); if (box) {
        const rows = asia.slice(0, 5).map(f => {
          const p = f.properties || {}; const coords = (f.geometry && f.geometry.coordinates) || []; const mag = Number(p.mag); const when = Number(p.time);
          const magText = Number.isFinite(mag) ? mag.toFixed(1) : '—'; const place = esc(p.place || 'Location not reported'); const dt = Number.isFinite(when) ? new Date(when).toLocaleString('en-GB',{ day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit',timeZone:'Asia/Dhaka' }) : 'Time unavailable';
          const url = /^https:\/\//i.test(p.url || '') ? p.url : 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/'; const depth = Number(coords[2]);
          return '<a class="igd-quake-row" href="' + esc(url) + '" target="_blank" rel="noopener noreferrer"><span class="igd-quake-mag">M ' + magText + '</span><span class="igd-quake-copy"><b>' + place + '</b><small>' + esc(dt) + ' · depth ' + (Number.isFinite(depth) ? Math.round(depth) + ' km' : 'n/a') + '</small></span><span class="igd-quake-arrow">↗</span></a>';
        });
        box.innerHTML = rows.join('') || '<div class="igd-empty-state">No Asia-region records returned in the USGS past-day feed.</div>';
      }
    } catch (error) {
      state.quakeAt = 0; setBadge('igdQuakeState', 'OFFLINE / STALE', 'offline'); setText('igdQuakeUpdated', 'USGS provider unavailable'); setText('igdQuakeTime', 'No successful response');
      const box = $('igdQuakeList'); if (box && !state.quakes) box.innerHTML = '<div class="igd-empty-state">USGS feed unavailable. No synthetic events are shown.</div>';
    }
    refreshOverall();
  }
  function ageLabel(seconds) { if (!Number.isFinite(seconds) || seconds < 0) return 'age n/a'; return seconds < 60 ? Math.round(seconds) + ' s ago' : Math.round(seconds/60) + ' min ago'; }
  function handleAirRows(rows, receivedAt) {
    if (!Array.isArray(rows)) return; state.aircraft = rows; state.aircraftAt = Number(receivedAt) || Number(window.__igersAirLastSync) || Date.now();
    const positioned = rows.filter(a => Number.isFinite(Number(a.lat)) && Number.isFinite(Number(a.lon)) && a.lat !== '' && a.lon !== '');
    const ages = rows.map(a => Number(a.seen_pos ?? a.seen)).filter(n => Number.isFinite(n) && n >= 0);
    setText('igdAirCount', positioned.length); setText('igdAirTotal', rows.length); setText('igdAirPositionTotal', positioned.length); setText('igdAirAge', 'Observed ' + ageLabel(ages.length ? Math.min(...ages) : NaN)); setText('igdAirNewest', ageLabel(ages.length ? Math.min(...ages) : NaN));
    const ok = rows.length > 0; setBadge('igdAirState', ok ? 'PUBLIC FEED OK' : 'NO TARGETS', ok ? 'live' : 'pending'); setText('igdAirProviderState', ok ? 'SOURCE OK' : 'NO TARGETS'); setDot('igdAirDot', ok ? '' : 'amber'); refreshOverall();
  }
  let airFallbackTried = false;
  async function fallbackAircraft() {
    if (Array.isArray(window.__igersAirLastPayload)) { handleAirRows(window.__igersAirLastPayload, window.__igersAirLastSync); return; }
    if (typeof window.__igersRefreshAirTraffic === 'function') { try { await window.__igersRefreshAirTraffic(); } catch (_) {} if (Array.isArray(window.__igersAirLastPayload)) handleAirRows(window.__igersAirLastPayload, window.__igersAirLastSync); return; }
    if (airFallbackTried) return; airFallbackTried = true;
    try {
      const data = await timeoutFetch('https://api.airplanes.live/v2/point/23.8103/90.4125/250', 9000);
      const rows = (data.ac || []).map(a => ({ hex:a.hex, callsign:String(a.flight || '').trim(), lat:a.lat == null ? NaN : Number(a.lat), lon:a.lon == null ? NaN : Number(a.lon), alt:a.alt_baro, speed:a.gs, track:a.track, seen:a.seen_pos }));
      window.__igersAirLastPayload = rows; window.__igersAirProvider = 'Airplanes.live'; window.__igersAirLastSync = Date.now(); window.dispatchEvent(new CustomEvent('igers:airtraffic', { detail: rows })); handleAirRows(rows, window.__igersAirLastSync);
    } catch (error) { state.aircraftAt = 0; setBadge('igdAirState', 'PROVIDER OFFLINE', 'offline'); setText('igdAirAge', 'No successful response'); setText('igdAirProviderState', 'OFFLINE'); setDot('igdAirDot', 'offline'); }
    refreshOverall();
  }
  function loadCss(url) { return new Promise(resolve => { if (Array.from(document.styleSheets).some(s => s.href && s.href.includes('leaflet@1.9.4'))) return resolve(true); const link = document.createElement('link'); link.rel = 'stylesheet'; link.href = url; link.onload = () => resolve(true); link.onerror = () => resolve(false); document.head.appendChild(link); }); }
  function loadScript(url) { return new Promise(resolve => { if (window.L && window.L.map) return resolve(true); const script = document.createElement('script'); script.src = url; script.async = true; script.onload = () => resolve(!!(window.L && window.L.map)); script.onerror = () => resolve(false); document.head.appendChild(script); setTimeout(() => resolve(!!(window.L && window.L.map)), 9000); }); }
  function mapFallback(message) {
    const host = $('igdSatelliteMap'); if (!host) return;
    host.innerHTML = '<iframe title="OpenStreetMap reference view around Bangladesh" loading="lazy" referrerpolicy="no-referrer" src="https://www.openstreetmap.org/export/embed.html?bbox=88.0%2C20.3%2C92.7%2C26.7&amp;layer=mapnik&amp;marker=23.685%2C90.3563"></iframe><div class="igd-map-fallback-label">' + esc(message || 'Interactive imagery library unavailable. Showing public street map fallback.') + '</div>';
    setBadge('igdMapState', 'MAP FALLBACK', 'pending'); setText('igdImageryStatus', 'Street map fallback'); setDot('igdImageryDot', 'amber'); setText('igdImageryDate', 'Base map · OpenStreetMap');
  }
  function initMap() {
    const host = $('igdSatelliteMap'); if (!host) return;
    Promise.all([loadCss('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'), loadScript('https://unpkg.com/leaflet@1.9.4/dist/leaflet.js')]).then(async result => {
      if (!result[1] || !window.L) { mapFallback('Map library could not load. Public OpenStreetMap fallback is active.'); return; }
      state.leaflet = true; const L = window.L;
      try {
        host.innerHTML = '';
        const map = L.map(host, { zoomControl: true, preferCanvas: true, minZoom: 4, maxZoom: 17 }).setView([23.685, 90.3563], 6); state.map = map;
        const esri = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom: 18, attribution: 'Imagery © Esri, Maxar, Earthstar Geographics, and the GIS User Community', crossOrigin: true });
        const streets = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '© OpenStreetMap contributors', crossOrigin: true });
        esri.addTo(map); esri.on('tileload', () => { if (!state.imageryOk) { state.imageryOk = true; setBadge('igdMapState', 'IMAGERY CONNECTED', 'live'); setText('igdImageryStatus', 'Public satellite/aerial tiles received'); setDot('igdImageryDot', ''); setText('igdImageryDate', 'Provider does not expose a per-tile acquisition timestamp'); refreshOverall(); } });
        esri.on('tileerror', () => { if (!state.imageryOk) { state.imageryError = true; setText('igdImageryStatus', 'Some imagery tiles unavailable'); } });
        let nasaLayer = null; let nasaTimer = null; let nasaDateIndex = 0; const nasaDates = Array.from({length:8}, (_, i) => { const d = new Date(); d.setUTCDate(d.getUTCDate() - i - 1); return d.toISOString().slice(0,10); });
        function beginNasa(dateIndex = 0) {
          nasaDateIndex = dateIndex; if (nasaLayer) { map.removeLayer(nasaLayer); nasaLayer = null; } if (nasaTimer) clearTimeout(nasaTimer);
          let loaded = 0, failed = 0; const date = nasaDates[nasaDateIndex];
          nasaLayer = L.tileLayer('https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_SNPP_CorrectedReflectance_TrueColor/default/' + date + '/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg', { minZoom: 0, maxZoom: 9, maxNativeZoom: 9, opacity: 0.96, attribution: 'NASA Global Imagery Browse Services (GIBS) · VIIRS SNPP', crossOrigin: true });
          nasaLayer.on('tileload', () => { loaded++; if (state.mapMode === 'nasa') { setText('igdImageryStatus', 'NASA GIBS tiles loaded for ' + date); setText('igdImageryDate', 'Daily Earth-observation date: ' + date); setBadge('igdMapState', 'NASA GIBS CONNECTED', 'live'); setDot('igdImageryDot', ''); state.imageryOk = true; refreshOverall(); } });
          nasaLayer.on('tileerror', () => { failed++; });
          if (state.mapMode === 'nasa') nasaLayer.addTo(map);
          nasaTimer = setTimeout(() => {
            if (state.mapMode !== 'nasa' || nasaLayer === null) return;
            if (loaded < 2 && failed > 0 && nasaDateIndex < nasaDates.length - 1) beginNasa(nasaDateIndex + 1);
            else if (loaded < 2) { setBadge('igdMapState', 'NASA LAYER UNAVAILABLE', 'offline'); setText('igdImageryStatus', 'NASA GIBS did not return enough tiles; switch to satellite/aerial basemap'); setDot('igdImageryDot', 'offline'); }
            else if (failed) setText('igdImageryStatus', 'NASA GIBS partial coverage · ' + date);
          }, 4500);
        }
        const borderRefs = [
          ['Benapole · reference',23.0389,88.8920],['Burimari · reference',26.3580,89.0230],['Banglabandha · reference',26.6260,88.3860],['Hili · reference',25.2850,88.9900],['Akhaura · reference',23.8820,91.1980],['Tamabil · reference',25.1510,92.0400],['Bhomra · reference',22.6820,88.9400],['Teknaf · reference',20.8630,92.2980]
        ];
        const referenceGroup = L.layerGroup(); borderRefs.forEach(([name, lat, lon]) => { const icon = L.divIcon({ className:'igd-map-pin-wrap', html:'<span class="igd-map-pin" aria-hidden="true"></span>', iconSize:[14,14], iconAnchor:[7,7] }); L.marker([lat,lon], {icon}).bindTooltip(name + '<br>Reference marker only · no live crossing status').addTo(referenceGroup); }); referenceGroup.addTo(map);
        // Fetch the bundled Bangladesh outline if present; failure must not break the map.
        try { const response = await fetch('bangladesh-boundary-fallback.geojson', {cache:'force-cache'}); if (response.ok) { const boundary = await response.json(); L.geoJSON(boundary, {style:{color:'#54e7ff',weight:2,opacity:.88,fillOpacity:.025,fillColor:'#54e7ff'}}).addTo(map); } } catch (_) {}
        map.on('load', () => { const e=$('igdRoadState'); if(e)e.textContent='MAP READY'; });
        const setMode = mode => {
          state.mapMode = mode; document.querySelectorAll('[data-igd-map]').forEach(b => b.classList.toggle('selected', b.getAttribute('data-igd-map') === mode));
          if (mode === 'imagery') { if(nasaLayer && map.hasLayer(nasaLayer)) map.removeLayer(nasaLayer); if(map.hasLayer(streets)) map.removeLayer(streets); if(!map.hasLayer(esri)) esri.addTo(map); map.setMaxZoom(18); setBadge('igdMapState', 'SATELLITE / AERIAL', 'live'); setText('igdMapSubtitle','Public imagery basemap · acquisition date varies by tile'); if(state.imageryOk){setText('igdImageryStatus','Esri satellite/aerial basemap displayed');setDot('igdImageryDot','');} }
          else if (mode === 'street') { if(nasaLayer && map.hasLayer(nasaLayer)) map.removeLayer(nasaLayer); if(!map.hasLayer(streets)) streets.addTo(map); if(map.hasLayer(esri)) map.removeLayer(esri); map.setMaxZoom(19); setBadge('igdMapState','STREET MAP','live'); setText('igdMapSubtitle','OpenStreetMap street and place layer'); setText('igdImageryStatus','Street map displayed · not satellite imagery'); setText('igdImageryDate','© OpenStreetMap contributors'); setDot('igdImageryDot',''); }
          else { if(map.hasLayer(esri)) map.removeLayer(esri); if(map.hasLayer(streets)) map.removeLayer(streets); beginNasa(0); setBadge('igdMapState','NASA GIBS CONNECTING','pending'); setText('igdMapSubtitle','NASA VIIRS daily Earth-observation imagery · may lag acquisition'); }
        };
        document.querySelectorAll('[data-igd-map]').forEach(b => b.addEventListener('click', () => setMode(b.getAttribute('data-igd-map'))));
        setText('igdRoadState','MAP READY'); setBadge('igdMapState','SATELLITE / AERIAL','pending'); setText('igdMapSubtitle','Public imagery basemap · acquisition date varies by tile');
        window.addEventListener('resize', () => { try { map.invalidateSize({pan:false}); } catch (_) {} });
        document.addEventListener('click', event => { if (event.target.closest('[data-igers-home]')) setTimeout(() => { try { map.invalidateSize({pan:false}); } catch (_) {} }, 450); });
        window.addEventListener('popstate', () => setTimeout(() => { try { map.invalidateSize({pan:false}); } catch (_) {} }, 450));
        setTimeout(() => { try { map.invalidateSize({pan:false}); } catch (_) {} }, 350);
        if (location.hash === '#igersAppDashboard' || !location.hash) setTimeout(() => { try { map.invalidateSize({pan:false}); } catch (_) {} }, 900);
      } catch (_) { mapFallback('Interactive map initialization failed. A public street map fallback is active.'); }
    });
  }
  function groundMetric(value) {
    if (value === null || value === undefined || value === '') return null;
    const n = Number(value);
    return Number.isFinite(n) && n >= 0 ? n : null;
  }
  function setGroundState(text, kind) {
    const status = $('igdBorderFeedState');
    if (status) {
      status.className = 'igd-feed-badge status-' + (kind || 'pending');
      const label = status.querySelector('span'); if (label) label.textContent = text; else status.textContent = text;
    }
    const msg = $('igdGroundFeedMessage');
    if (msg) { msg.textContent = text; msg.className = 'igd-ground-feed-message' + (kind === 'live' ? ' status-connected' : kind === 'offline' ? ' status-error' : ''); }
    setDot('igdGroundGatewayDot', kind === 'live' ? '' : kind === 'offline' ? 'offline' : 'amber');
  }
  function setGroundNumbers(metrics) {
    setText('igdGroundVehicles', metrics.vehicles == null ? '—' : metrics.vehicles.toLocaleString('en-US'));
    setText('igdGroundQueue', metrics.queueLength == null ? '—' : metrics.queueLength.toLocaleString('en-US'));
    setText('igdGroundLanes', metrics.lanesOpen == null ? '—' : metrics.lanesOpen.toLocaleString('en-US'));
    setText('igdGroundCameras', metrics.camerasOnline == null ? '—' : (metrics.camerasTotal == null ? metrics.camerasOnline.toLocaleString('en-US') : metrics.camerasOnline.toLocaleString('en-US') + ' / ' + metrics.camerasTotal.toLocaleString('en-US')));
  }
  function dhakaTimestamp(value) {
    const t = Date.parse(value || '');
    return Number.isFinite(t) ? new Date(t).toLocaleString('en-GB', { timeZone:'Asia/Dhaka', day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:false }) + ' BST' : 'Not supplied by source';
  }
  async function refreshAuthorizedGroundFeed() {
    const cfg = window.IGERS_AUTHORIZED_FEEDS || {};
    const endpoint = String(cfg.operationsStatusUrl || '').trim();
    const meta = $('igdGroundFeedMeta');
    if (!endpoint) {
      setGroundNumbers({}); setGroundState('NOT CONFIGURED · No approved agency endpoint is configured.', 'offline');
      setText('igdGroundFeedMeta', 'Set operationsStatusUrl in authorized-feed-config.js only after the private backend is deployed behind agency SSO/VPN. Never put credentials in this public file.');
      setText('igdCctvState', 'NOT CONFIGURED'); setText('igdGroundSensorState', 'NOT CONFIGURED'); setDot('igdCctvDot', 'amber'); setDot('igdGroundDot', 'amber');
      return false;
    }
    let url;
    try { url = new URL(endpoint, window.location.href); }
    catch (_) { setGroundNumbers({}); setGroundState('INVALID CONFIGURATION · endpoint URL cannot be parsed.', 'offline'); return false; }
    if (url.origin !== window.location.origin || url.username || url.password || (url.protocol !== 'https:' && !['localhost','127.0.0.1'].includes(url.hostname))) {
      setGroundNumbers({}); setGroundState('BLOCKED CONFIGURATION · use a same-origin HTTPS endpoint behind approved access controls.', 'offline');
      setText('igdGroundFeedMeta', 'The public browser will not send credentials or operational data to a cross-origin endpoint. Proxy the private API on the same authenticated application origin.');
      return false;
    }
    const controller = new AbortController(); const timer = setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch(url.href, { method:'GET', cache:'no-store', credentials:'same-origin', headers:{ Accept:'application/json' }, signal:controller.signal });
      if (!response.ok) throw new Error('Gateway HTTP ' + response.status);
      const data = await response.json();
      if (!data || data.status !== 'connected' || !data.metrics || typeof data.metrics !== 'object') throw new Error('Unexpected gateway schema / feed not connected');
      const m = data.metrics;
      const metrics = {
        vehicles: groundMetric(m.vehicles), queueLength: groundMetric(m.queueLength), lanesOpen: groundMetric(m.lanesOpen),
        camerasOnline: groundMetric(m.camerasOnline), camerasTotal: groundMetric(m.camerasTotal)
      };
      setGroundNumbers(metrics); setGroundState('CONNECTED · ' + String(data.source || 'Authorized ground feed') + ' · aggregate data only.', 'live');
      const observed = dhakaTimestamp(data.observedAt);
      setText('igdGroundFeedMeta', 'Source observed: ' + observed + ' · response checked: ' + stamp() + ' Asia/Dhaka. Counts are provider-supplied aggregates, not inferred from satellite imagery.');
      const camsReported = metrics.camerasTotal != null || metrics.camerasOnline != null;
      setText('igdCctvState', camsReported ? (metrics.camerasOnline != null && metrics.camerasOnline > 0 ? 'STATUS REPORTED' : 'OFFLINE / UNKNOWN') : 'NOT REPORTED');
      setDot('igdCctvDot', camsReported && metrics.camerasOnline > 0 ? '' : 'amber');
      const sensorReported = metrics.vehicles != null || metrics.queueLength != null || metrics.lanesOpen != null;
      setText('igdGroundSensorState', sensorReported ? 'AGGREGATES RECEIVED' : 'NOT REPORTED');
      setDot('igdGroundDot', sensorReported ? '' : 'amber');
      return true;
    } catch (error) {
      setGroundNumbers({}); setGroundState('UNAVAILABLE · ' + (error && error.name === 'AbortError' ? 'request timed out' : String(error && error.message || 'gateway request failed')) + '.', 'offline');
      setText('igdGroundFeedMeta', 'No successful authorized source response. No previous count is retained as live.');
      setText('igdCctvState', 'UNVERIFIED'); setText('igdGroundSensorState', 'UNVERIFIED'); setDot('igdCctvDot', 'offline'); setDot('igdGroundDot', 'offline');
      return false;
    } finally { clearTimeout(timer); }
  }
  function setupAuthorizedGroundFeed() {
    $('igdGroundFeedTest')?.addEventListener('click', () => { setText('igdGroundFeedMeta', 'Checking configured source · ' + stamp() + ' Asia/Dhaka…'); refreshAuthorizedGroundFeed(); });
    const seconds = Number((window.IGERS_AUTHORIZED_FEEDS || {}).pollIntervalMs);
    const interval = Number.isFinite(seconds) ? Math.max(15000, Math.min(600000, seconds)) : 60000;
    refreshAuthorizedGroundFeed(); setInterval(refreshAuthorizedGroundFeed, interval);
  }

  function bindControls() {
    const refresh = () => { setText('igdLastRefresh', 'Refreshing · ' + stamp()); loadWeather(); loadQuakes(); refreshAuthorizedGroundFeed(); if (Array.isArray(window.__igersAirLastPayload)) handleAirRows(window.__igersAirLastPayload, window.__igersAirLastSync); else { airFallbackTried = false; fallbackAircraft(); } if (state.map && state.mapMode === 'nasa') { const btn = document.querySelector('[data-igd-map="nasa"]'); if (btn) btn.click(); } setTimeout(() => setText('igdLastRefresh', 'Last dashboard refresh: ' + stamp()), 250); };
    $('igdRefreshAll')?.addEventListener('click', refresh); $('igdRefreshFooter')?.addEventListener('click', refresh); $('igdOpenDirectory')?.addEventListener('click', () => { const d = $('iasLegacyDirectory'); if (d) { d.open = !d.open; if (d.open) d.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'}); } });
    window.addEventListener('online', () => { updateClock(); loadWeather(); loadQuakes(); refreshAuthorizedGroundFeed(); airFallbackTried = false; fallbackAircraft(); }); window.addEventListener('offline', updateClock);
    window.addEventListener('igers:airtraffic', event => handleAirRows(event.detail || [], window.__igersAirLastSync));
    if (Array.isArray(window.__igersAirLastPayload)) handleAirRows(window.__igersAirLastPayload, window.__igersAirLastSync);
    else setTimeout(() => { if (!state.aircraftAt) fallbackAircraft(); }, 7500);
    setText('igdLastRefresh', 'Last dashboard refresh: ' + stamp());
  }
  let initializeAttempts = 0;
  function initialize() {
    if (!$('igdShell')) {
      // app-shell must create the dashboard host. Stop polling after 4 s rather than
      // leave an endless 100 ms retry loop if a future script failure prevents it.
      if (initializeAttempts++ < 40) setTimeout(initialize, 100);
      return;
    }
    initializeAttempts = 0;
    updateClock(); setInterval(updateClock, 1000); bindControls(); setupAuthorizedGroundFeed(); initMap(); loadWeather(); loadQuakes();
    state.timers.push(setInterval(loadWeather, 10 * 60 * 1000), setInterval(loadQuakes, 5 * 60 * 1000));
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, {once:true}); else initialize();
})();
