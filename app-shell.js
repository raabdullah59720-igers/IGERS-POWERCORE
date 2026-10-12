/* IGERS POWERCORE SMART APP SHELL · navigation-only layer. Original panels/modules remain intact. */
(function () {
  'use strict';
  if (window.__igersAppShellV2) return;
  window.__igersAppShellV2 = true;

  const main = document.querySelector('main');
  const nav = document.getElementById('igersNavLinks');
  if (!main || !nav) return;

  const groups = Array.from(nav.querySelectorAll('details.nav-group'));
  if (!groups.length) return;

  const iconMap = ['⌘', '◌', '✈', '▤', 'ϟ', '✚', '⬡'];
  const descMap = [
    'Project identity, concept architecture, research visualizers and engineering boundaries.',
    'Environmental context, weather, local time, seismic and coastal monitoring.',
    'Public aviation visualization, airspace awareness and border-monitor interfaces.',
    'Transport infrastructure, toll intelligence, satellite and connectivity views.',
    'Energy recovery calculations, analysis tools and system controls.',
    'Emergency tools, feedback and customer-support interfaces.',
    'Integrated command, engineering simulation and operations health.'
  ];
  const workspaceColors = ['cyan', 'mint', 'blue', 'amber', 'violet', 'rose', 'steel'];
  const safeText = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
  const decodeHash = (hash) => {
    try { return decodeURIComponent(String(hash || '').replace(/^#/, '')); }
    catch (_) { return String(hash || '').replace(/^#/, ''); }
  };
  const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scrollToElement = (element, behavior = 'smooth') => {
    if (!element || typeof element.scrollIntoView !== 'function') return;
    element.scrollIntoView({ block: 'start', behavior: reduceMotion() ? 'auto' : behavior });
  };

  function getPanelTarget(link) {
    const href = (link.getAttribute('href') || '').trim();
    if (!href.startsWith('#')) return null;
    const id = decodeHash(href);
    const element = document.getElementById(id);
    if (!element) return null;
    let section = element;
    while (section && section.parentElement !== main) section = section.parentElement;
    if (!section || section.tagName !== 'SECTION' || section.id === 'igersAppDashboard') return null;
    return { id, element, section, sectionId: section.id || id };
  }

  // Deduplicate by actual top-level panel, not just anchor ID. Some old menu items are
  // sub-anchors inside a single large section (e.g. Concept / Thesis 3D Lab / FEAS).
  const seenPanels = new Map();
  const categoryData = groups.map((group, groupIndex) => {
    const rawTitle = group.querySelector(':scope > summary')?.textContent || `Workspace ${groupIndex + 1}`;
    const title = rawTitle.replace(/^\s*\d+\s*[·.:-]\s*/, '').trim();
    const links = [];
    for (const anchor of Array.from(group.querySelectorAll('.nav-menu a'))) {
      const target = getPanelTarget(anchor);
      if (!target) continue;
      const label = anchor.textContent.trim();
      if (seenPanels.has(target.sectionId)) {
        const existing = seenPanels.get(target.sectionId);
        if (existing.groupIndex === groupIndex && existing.label !== label) {
          if (!existing.aliases.includes(label)) existing.aliases.push(label);
          if (target.id !== existing.id && !existing.aliasTargets.some((item) => item.id === target.id)) existing.aliasTargets.push({ label, id: target.id });
        }
        continue;
      }
      const entry = {
        id: target.id,
        sectionId: target.sectionId,
        label,
        element: target.element,
        section: target.section,
        href: `#${encodeURIComponent(target.id)}`,
        groupIndex,
        aliases: [],
        aliasTargets: []
      };
      seenPanels.set(target.sectionId, entry);
      links.push(entry);
    }
    return {
      title,
      links,
      icon: iconMap[groupIndex % iconMap.length],
      tone: workspaceColors[groupIndex % workspaceColors.length],
      description: descMap[groupIndex] || 'Open the related IGERS POWERCORE tools and panels.'
    };
  });

  // Keep the alias labels visible as small context on the one canonical panel card.
  const panelById = new Map();
  const panelBySection = new Map();
  for (const category of categoryData) {
    for (const item of category.links) {
      panelById.set(item.id, item);
      panelBySection.set(item.sectionId, item);
    }
  }
  // Include aliases from links collapsed inside each category. The original DOM is untouched.
  for (const group of groups) {
    for (const anchor of Array.from(group.querySelectorAll('.nav-menu a'))) {
      const target = getPanelTarget(anchor);
      if (!target) continue;
      const canonical = panelBySection.get(target.sectionId);
      const label = anchor.textContent.trim();
      if (canonical && label !== canonical.label) {
        if (!canonical.aliases.includes(label)) canonical.aliases.push(label);
        if (target.id !== canonical.id && !canonical.aliasTargets.some((item) => item.id === target.id)) canonical.aliasTargets.push({ label, id: target.id });
      }
    }
  }
  const allFeatures = categoryData.flatMap((category, categoryIndex) => category.links.map((feature) => ({
    ...feature,
    category: category.title,
    categoryIndex,
    icon: category.icon,
    tone: category.tone
  })));
  const allFeatureCount = allFeatures.length;

  const dashboard = document.createElement('section');
  dashboard.id = 'igersAppDashboard';
  dashboard.setAttribute('aria-label', 'IGERS POWERCORE app dashboard');
  dashboard.innerHTML = `
    <div class="ias-wrap">
      <header class="ias-topline">
        <a class="ias-brandline" href="#igersAppDashboard" data-igers-home aria-label="Return to IGERS POWERCORE dashboard"><span class="ias-brandmark" aria-hidden="true"><span>IG</span><i></i></span><span><strong>IGERS POWERCORE</strong><small>INTEGRATED SYSTEMS WORKSPACE</small></span></a>
        <div class="ias-top-meta"><span class="ias-localstate"><i aria-hidden="true"></i><span>INTERFACE READY</span></span><span class="ias-id-chip">IGERS-BD-01</span></div>
      </header>

      <div class="ias-home-view" id="iasHomeView">
        <section class="ias-hero" aria-labelledby="iasHeroTitle">
          <div class="ias-hero-copy">
            <div class="ias-kicker"><span class="ias-kicker-line"></span> ENGINEERING · MONITORING · ENERGY</div>
            <h1 class="ias-title" id="iasHeroTitle">One command space.<br><span>Every system, in order.</span></h1>
            <p class="ias-lead">A unified workspace for the IGERS concept, environmental views, infrastructure tools and engineering systems. Open a workspace, then enter its original panel.</p>
            <div class="ias-hero-actions"><label class="ias-searchbox" for="iasGlobalSearch"><span aria-hidden="true">⌕</span><input id="iasGlobalSearch" type="search" autocomplete="off" placeholder="Find a panel or tool…" aria-label="Find a panel or tool"><kbd>Ctrl K</kbd></label><span class="ias-search-help">Searches unique panels only</span></div>
            <div class="ias-statrow" aria-label="Application structure">
              <div class="ias-stat"><strong>${String(categoryData.length).padStart(2, '0')}</strong><span>Workspaces</span></div>
              <div class="ias-stat"><strong>${String(allFeatureCount).padStart(2, '0')}</strong><span>Unique panels</span></div>
              <div class="ias-stat"><strong>01</strong><span>Project system</span></div>
            </div>
          </div>
          <div class="ias-hero-visual" aria-hidden="true">
            <div class="ias-visual-label"><span>IGERS SYSTEM MAP</span><span>01 / CORE</span></div>
            <div class="ias-orbit ias-orbit-a"><span class="ias-orbit-node n1"></span><span class="ias-orbit-node n2"></span><span class="ias-orbit-node n3"></span><span class="ias-orbit-node n4"></span><span class="ias-orbit-node n5"></span><div class="ias-orbit ias-orbit-b"><div class="ias-core"><b>IGERS</b><span>POWERCORE</span></div></div></div>
            <div class="ias-visual-legend"><span><i class="ias-dot cyan"></i> RECOVERY</span><span><i class="ias-dot mint"></i> SYSTEMS</span><span><i class="ias-dot amber"></i> ANALYSIS</span></div>
            <div class="ias-visual-foot"><span>INTEGRATED ENERGY RECOVERY</span><span>BD · 01</span></div>
          </div>
        </section>

        <div class="ias-dashboard-bar"><div><span class="ias-overline">NAVIGATION CONTROL</span><h2>Choose your workspace</h2><p>Each panel appears once in the workspace list. Related tools remain together inside their original section.</p></div><div class="ias-panel-count"><span class="ias-panel-count-number">${String(allFeatureCount).padStart(2, '0')}</span><span>panel destinations</span></div></div>
        <section class="ias-telemetry" aria-label="Data quality and source status">
          <div class="ias-telemetry-head"><span class="ias-overline">SYSTEM PULSE</span><span class="ias-telemetry-note">Interface status is separate from provider-feed status</span></div>
          <div class="ias-telemetry-grid">
            <article class="ias-telemetry-card"><span class="ias-telemetry-icon">◉</span><div><strong id="iasNetState">CHECKING</strong><span>Network connection</span></div><i id="iasNetDot" class="ias-state-dot"></i></article>
            <article class="ias-telemetry-card"><span class="ias-telemetry-icon">◷</span><div><strong id="iasLocalClock">--:--:--</strong><span>Device local time</span></div><i class="ias-state-dot mint"></i></article>
            <article class="ias-telemetry-card"><span class="ias-telemetry-icon">◎</span><div><strong>PUBLIC FEEDS</strong><span>Coverage may be delayed or incomplete</span></div><i class="ias-state-dot amber"></i></article>
            <article class="ias-telemetry-card"><span class="ias-telemetry-icon">⌁</span><div><strong>CONCEPT MODELS</strong><span>Simulations are labelled, not telemetry</span></div><i class="ias-state-dot blue"></i></article>
          </div>
          <p class="ias-data-integrity"><b>Data integrity:</b> Satellite imagery, public aircraft observations, weather and seismic feeds have different update cycles. This dashboard does not claim access to classified satellite sensors, border CCTV, ground-vehicle tracking or military radar. Treat simulated overlays and concept calculations as illustrative until validated by authorized sensors and measured field data. <span class="ias-source-links">Sources: <a href="https://worldview.earthdata.nasa.gov/" target="_blank" rel="noopener noreferrer">NASA Worldview</a> · <a href="https://api.adsb.lol/" target="_blank" rel="noopener noreferrer">adsb.lol public ADS-B</a> · <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer">Open-Meteo</a> · <a href="https://earthquake.usgs.gov/earthquakes/feed/v1.0/" target="_blank" rel="noopener noreferrer">USGS earthquakes</a> · <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>.</span></p>
        </section>
        <div class="ias-search-status" id="iasSearchStatus" aria-live="polite"></div>
        <div class="ias-search-results" id="iasSearchResults" hidden></div>
        <div class="ias-grid" id="iasCategoryGrid">${categoryData.map((category, index) => `
          <button class="ias-category tone-${category.tone}" type="button" data-ias-category="${index}" aria-label="Open ${safeText(category.title)} workspace">
            <span class="ias-category-top"><span class="ias-icon" aria-hidden="true">${category.icon}</span><span class="ias-count">${String(category.links.length).padStart(2, '0')} PANELS</span></span>
            <span class="ias-category-body"><span class="ias-category-index">WORKSPACE ${String(index + 1).padStart(2, '0')}</span><h3>${safeText(category.title)}</h3><p>${safeText(category.description)}</p></span>
            <span class="ias-open"><span>ENTER WORKSPACE</span><span class="ias-arrow" aria-hidden="true">↗</span></span>
            <span class="ias-card-shine" aria-hidden="true"></span>
          </button>`).join('')}</div>
        <div class="ias-bottom-strip"><div class="ias-bottom-icon" aria-hidden="true">◈</div><div><strong>Designed for focused operation</strong><p>Navigation is reorganized; original calculation logic, controls and module content are retained.</p></div><span class="ias-bottom-tag">IGERS POWERCORE TECHNOLOGIES LTD.</span></div>
        <footer class="ias-footnote"><span>IGERS-BD-01 · ENGINEERING CONCEPT INTERFACE</span><span>Provider availability varies by module. A ready interface does not imply every external feed is live.</span></footer>
      </div>

      <div class="ias-category-view" id="iasCategoryView" hidden>
        <div class="ias-breadcrumb"><span>WORKSPACES</span><span aria-hidden="true">/</span><strong id="iasBreadcrumbCurrent">Workspace</strong></div>
        <div class="ias-workspace-head"><div><span class="ias-overline" id="iasWorkspaceOverline">WORKSPACE 01</span><h1 class="ias-view-title" id="iasCategoryTitle"></h1><p class="ias-view-desc" id="iasCategoryDesc"></p></div><span class="ias-workspace-mark" id="iasWorkspaceMark" aria-hidden="true">⌘</span></div>
        <div class="ias-feature-bar"><div><strong>Available panels</strong><span id="iasFeatureCount">00 destinations</span></div><label class="ias-category-filter" for="iasFeatureFilter"><span aria-hidden="true">⌕</span><input id="iasFeatureFilter" type="search" autocomplete="off" placeholder="Filter this workspace…" aria-label="Filter this workspace panels"></label></div>
        <div class="ias-feature-grid" id="iasFeatureGrid"></div><div class="ias-no-results" id="iasNoFeatures" hidden>No panels match this filter.</div>
        <footer class="ias-footnote"><span>Use Back to return one level.</span><span>Original module contents and controls stay in place.</span></footer>
      </div>
    </div>`;
  main.insertBefore(dashboard, main.firstElementChild);

  const backButton = document.createElement('button');
  backButton.id = 'igersAppBackButton';
  backButton.type = 'button';
  backButton.setAttribute('aria-label', 'Go back one level');
  backButton.innerHTML = '<span class="ias-nav-back-arrow" aria-hidden="true">←</span><span class="ias-nav-back-label">Back</span>';
  const toggle = document.getElementById('navSectionToggle');
  if (toggle?.parentElement && !document.getElementById('igersAppBackButton')) toggle.parentElement.insertBefore(backButton, toggle);

  const body = document.body;
  body.classList.add('igers-app-shell');
  const homeView = dashboard.querySelector('#iasHomeView');
  // Replace the generic landing hero with a data-provenance-aware command dashboard.
  const commandDashboardMarkup = `<div class="igd-shell" id="igdShell" aria-label="IGERS live command dashboard">
  <header class="igd-topbar">
    <a class="igd-brand" href="#igersAppDashboard" data-igers-home aria-label="Return to IGERS dashboard">
      <span class="igd-flag" aria-hidden="true"><i></i></span>
      <span class="igd-brand-copy"><strong>IGERS-BD-01</strong><small>Integrated Gradient-Based Energy Recovery and Storage System</small></span>
    </a>
    <div class="igd-meta"><span class="igd-overline">INVENTOR &amp; AUTHOR</span><b>Abdullah Al Rafi [BD]</b><small>BAUST · L/T: 3-II</small></div>
    <div class="igd-meta"><span class="igd-overline">CONCEPT / INVENTION DATE</span><b>14 August 2026</b><small>Engineering concept · not a certified installation</small></div>
    <div class="igd-motto"><b>Smarter Energy</b><b>Safer Monitoring</b><small>A sustainable Bangladesh</small></div>
    <div class="igd-clockbox"><span>Bangladesh Time</span><b id="igdDhakaClock">--:--:--</b><small id="igdDhakaDate">Loading date…</small></div>
    <div class="igd-weather-mini"><span class="igd-weather-icon" id="igdWeatherIcon">◌</span><span><b id="igdHeaderTemp">--°C</b><small id="igdHeaderWeather">Weather syncing…</small></span></div>
    <div class="igd-live-pill status-pending" id="igdOverallStatus"><i></i><span>SYNCING</span></div>
  </header>
  <div class="igd-layout">
    <aside class="igd-sidebar" aria-label="IGERS workspaces">
      <nav class="igd-nav">
        <a class="active" href="#igersAppDashboard" data-igers-home><span>⌂</span>Dashboard</a>
        <a href="#borderMonitor"><span>◉</span>Border Command Center</a>
        <a href="#satelliteMonitor"><span>✧</span>Satellite &amp; Monitor</a>
        <a href="#tower3d"><span>♧</span>Tower Network</a>
        <a href="#airtraffic"><span>⌁</span>Air Track &amp; Radar</a>
        <a href="#seismic3d"><span>♒</span>Earthquake Monitor</a>
        <a href="#weather"><span>☼</span>Weather &amp; Climate</a>
        <a href="#energyLiveUpdate"><span>ϟ</span>Energy &amp; Recovery</a>
        <a href="#sentinel"><span>▤</span>Storage &amp; Grid</a>
        <a href="#applications"><span>◇</span>Applications</a>
        <a href="#concept3d"><span>⬡</span>3D Infrastructure</a>
        <a href="IGERS-BD-01_Professional_Engineering_Magazine.pdf" target="_blank" rel="noopener noreferrer"><span>▣</span>Library / Magazine</a>
        <a href="#systemControl"><span>⚙</span>Settings &amp; Controls</a>
      </nav>
      <div class="igd-flag-note"><div class="igd-flag large" aria-hidden="true"><i></i></div><b>আমার সোনার বাংলা</b><small>Public feeds · engineering concept · source-visible data</small></div>
      <div class="igd-sidebar-status"><div class="igd-side-status-row"><i class="igd-status-dot" id="igdNetworkDot"></i><span><b id="igdNetworkText">Checking network</b><small>Browser connectivity only</small></span></div><div class="igd-side-status-row"><i class="igd-status-dot amber"></i><span><b>Energy telemetry</b><small id="igdEnergyStatus">No hardware feed connected</small></span></div><div class="igd-side-foot"><span>BUILD 2.3.0 · BD-01</span><button type="button" id="igdRefreshAll">↻ Refresh feeds</button></div></div>
      <button class="igd-workspace-button" id="igdOpenDirectory" type="button">▦ &nbsp; All workspaces &amp; panels</button>
    </aside>
    <div class="igd-main" role="region" aria-label="Dashboard content">
      <div class="igd-mainbar"><div><span class="igd-overline">COMMAND OVERVIEW · BANGLADESH</span><h2>Integrated monitoring dashboard</h2><p>One view for public observations, engineering concepts and data-source health.</p></div><div class="igd-searchslot" aria-label="Search panels"></div></div>
      <section class="igd-kpis" aria-label="Live data summary">
        <article class="igd-kpi cyan"><div class="igd-kpi-icon">◎</div><div><span>Public feeds connected</span><strong id="igdFeedsConnected">0 / 4</strong><small id="igdFeedsLabel">Awaiting provider responses</small></div></article>
        <article class="igd-kpi blue"><div class="igd-kpi-icon">☼</div><div><span>Dhaka temperature</span><strong id="igdWeatherTemp">--°C</strong><small id="igdWeatherHumidity">Humidity --%</small></div></article>
        <article class="igd-kpi amber"><div class="igd-kpi-icon">⌁</div><div><span>Asia earthquakes · 24 h</span><strong id="igdQuakeCount">--</strong><small id="igdQuakeUpdated">USGS feed connecting</small></div></article>
        <article class="igd-kpi violet"><div class="igd-kpi-icon">✈</div><div><span>Aircraft with positions</span><strong id="igdAirCount">--</strong><small id="igdAirAge">Public ADS-B · connecting</small></div></article>
        <article class="igd-kpi green"><div class="igd-kpi-icon">ϟ</div><div><span>Energy / grid telemetry</span><strong id="igdEnergyKpi">NOT CONNECTED</strong><small>Requires installed meters or authorized endpoint</small></div></article>
      </section>
      <div class="igd-core-grid">
        <section class="igd-panel igd-map-panel" aria-label="Satellite and geographic map">
          <div class="igd-panel-head"><div><span class="igd-panel-icon">⌖</span><div><h3>Bangladesh · Satellite / Map View</h3><small id="igdMapSubtitle">Public geospatial layers · no live ground tracking</small></div></div><span class="igd-feed-badge status-pending" id="igdMapState"><i></i><span>CONNECTING</span></span></div>
          <div class="igd-map-tools" role="group" aria-label="Map layer selection"><button class="selected" data-igd-map="imagery" type="button">Satellite / aerial</button><button data-igd-map="nasa" type="button">NASA daily imagery</button><button data-igd-map="street" type="button">Street map</button><a href="https://worldview.earthdata.nasa.gov/?v=88,20,93,27" target="_blank" rel="noopener noreferrer">Open NASA Worldview ↗</a></div>
          <div id="igdSatelliteMap" class="igd-map-canvas" role="application" aria-label="Interactive public satellite and map layers around Bangladesh"><div class="igd-map-placeholder"><div class="igd-map-radar"></div><b>Connecting to public imagery…</b><small>Satellite/aerial imagery is not a real-time border camera.</small></div></div>
          <div class="igd-map-footer"><span><i class="igd-status-dot" id="igdImageryDot"></i><span id="igdImageryStatus">Imagery layer loading</span></span><span id="igdImageryDate">Imagery date: provider dependent</span></div>
          <div class="igd-map-note">Reference geography only. Border posts are not monitored for person-level movement; no border-vehicle counts are inferred from imagery.</div>
        </section>
        <section class="igd-panel igd-traffic-panel" aria-label="Border traffic feed status">
          <div class="igd-panel-head"><div><span class="igd-panel-icon amber-icon">▤</span><div><h3>Border Traffic &amp; Feed Status</h3><small>Ground traffic requires a real authorized feed</small></div></div><span class="igd-feed-badge status-offline" id="igdBorderFeedState"><i></i><span>NOT CONNECTED</span></span></div>
          <div class="igd-border-alert"><div class="igd-alert-symbol">!</div><div><b>Authorized ground-feed connector</b><p>Real vehicle/queue telemetry appears only after the agency or sensor owner provisions a private, authenticated endpoint. This public demo does not invent crossing counts.</p></div></div>
          <section class="igd-authorized-feed" aria-label="Authorized ground traffic gateway status">
            <div class="igd-authorized-feed-head"><span><i class="igd-status-dot amber" id="igdGroundGatewayDot"></i><b>GROUND TRAFFIC GATEWAY</b></span><button type="button" id="igdGroundFeedTest">Check connection</button></div>
            <div class="igd-ground-metrics"><div><span>Vehicles</span><strong id="igdGroundVehicles">—</strong></div><div><span>Queue length</span><strong id="igdGroundQueue">—</strong></div><div><span>Lanes open</span><strong id="igdGroundLanes">—</strong></div><div><span>Cameras online</span><strong id="igdGroundCameras">—</strong></div></div>
            <p class="igd-ground-feed-message" id="igdGroundFeedMessage" role="status">NOT CONFIGURED · No approved agency endpoint has been configured.</p>
            <small id="igdGroundFeedMeta">Source timestamp, freshness and gateway status will be shown when a valid feed responds.</small>
          </section>
          <div class="igd-source-status-list"><div><span class="igd-status-dot" id="igdRoadDot"></span><span><b>Road / place map</b><small>OpenStreetMap / imagery basemap</small></span><strong id="igdRoadState">CONNECTING</strong></div><div><span class="igd-status-dot amber" id="igdCctvDot"></span><span><b>Border CCTV</b><small>Camera status only; video stays on its approved private system</small></span><strong id="igdCctvState">NOT CONFIGURED</strong></div><div><span class="igd-status-dot amber" id="igdGroundDot"></span><span><b>Vehicle counter / gate sensor</b><small>Hardware or agency aggregate feed</small></span><strong id="igdGroundSensorState">NOT CONFIGURED</strong></div><div><span class="igd-status-dot" id="igdAirDot"></span><span><b>Public aircraft observations</b><small>ADS-B provider · not ground traffic</small></span><strong id="igdAirProviderState">CONNECTING</strong></div></div>
          <div class="igd-panel-actions"><a href="#borderMonitor">Open Border Monitor →</a><a href="#airtraffic">Open public air traffic →</a></div>
          <div class="igd-mini-table"><div class="igd-table-title">Checkpoint reference list <small>counts are not available</small></div><table><thead><tr><th>Reference area</th><th>Live status</th><th>Count</th></tr></thead><tbody><tr><td>Benapole</td><td><span class="igd-neutral-tag">No feed</span></td><td>—</td></tr><tr><td>Burimari</td><td><span class="igd-neutral-tag">No feed</span></td><td>—</td></tr><tr><td>Akhaura</td><td><span class="igd-neutral-tag">No feed</span></td><td>—</td></tr><tr><td>Teknaf</td><td><span class="igd-neutral-tag">No feed</span></td><td>—</td></tr></tbody></table><small class="igd-table-foot">Named places are reference locations, not a complete official registry or live status report.</small></div>
        </section>
        <div class="igd-right-rail">
          <section class="igd-panel igd-weather-panel" aria-label="Current weather from Open-Meteo"><div class="igd-panel-head"><div><span class="igd-panel-icon blue-icon">☁</span><div><h3>Weather &amp; Climate</h3><small>Open-Meteo current conditions</small></div></div><span class="igd-feed-badge status-pending" id="igdWeatherState"><i></i><span>SYNCING</span></span></div><div class="igd-weather-main"><div class="igd-weather-big-icon" id="igdWeatherBigIcon">☁</div><div><b id="igdWeatherNow">--°C</b><span id="igdWeatherCondition">Waiting for current conditions</span><small>Dhaka, Bangladesh · 23.81°N, 90.41°E</small></div></div><div class="igd-weather-metrics"><div><span>Humidity</span><b id="igdWeatherHum2">--%</b></div><div><span>Wind</span><b id="igdWeatherWind">-- km/h</b></div><div><span>Precipitation</span><b id="igdWeatherRain">-- mm</b></div></div><div class="igd-data-stamp">Updated <b id="igdWeatherTime">--</b></div><a class="igd-panel-link" href="#weather">Open full weather workspace ↗</a></section>
          <section class="igd-panel igd-quake-panel" aria-label="Recent Asian earthquakes from USGS"><div class="igd-panel-head"><div><span class="igd-panel-icon red-icon">♒</span><div><h3>Earthquake Monitor · Asia</h3><small>USGS GeoJSON · past-day feed</small></div></div><span class="igd-feed-badge status-pending" id="igdQuakeState"><i></i><span>SYNCING</span></span></div><div class="igd-quake-list" id="igdQuakeList"><div class="igd-empty-state">Connecting to USGS earthquake feed…</div></div><div class="igd-data-stamp">Last successful query <b id="igdQuakeTime">--</b></div><a class="igd-panel-link" href="#seismic3d">Open seismic monitor ↗</a></section>
        </div>
      </div>
      <div class="igd-lower-grid">
        <section class="igd-panel igd-energy-panel"><div class="igd-panel-head"><div><span class="igd-panel-icon green-icon">ϟ</span><div><h3>Energy Recovery System</h3><small>Engineering concept · sensor connection required</small></div></div><span class="igd-concept-badge">CONCEPT</span></div><div class="igd-energy-art"><div class="igd-flow-pipe"><i></i><i></i><i></i></div><div class="igd-energy-flow-copy"><b>No live energy meter connected</b><p>Flow rate, generator output, storage and conversion efficiency need measured inputs before a real-time result can be reported.</p></div></div><div class="igd-formula"><span>Expected electrical output</span><b>P = η × ρ × g × Q × H</b><small>Hydraulic example only · measure Q, head H and efficiency η before using.</small></div><a class="igd-panel-link" href="#energyLiveUpdate">Open calculation and recovery models ↗</a></section>
        <section class="igd-panel igd-storage-panel"><div class="igd-panel-head"><div><span class="igd-panel-icon blue-icon">▣</span><div><h3>Storage &amp; Grid</h3><small>Telemetry status</small></div></div><span class="igd-concept-badge">NO SENSOR</span></div><div class="igd-storage-visual"><div class="igd-battery-icon"><i></i></div><div><b>State of charge: —</b><p>Battery management system not connected</p></div></div><div class="igd-meter-rows"><div><span>Grid output</span><b>— MW</b><small>Not measured</small></div><div><span>CO₂ reduction</span><b>— kg</b><small>Requires measured generation + grid factor</small></div></div><div class="igd-integrity-note">No sample values are shown as live readings. Connect an authorized meter/API to activate these metrics.</div><a class="igd-panel-link" href="#sentinel">Open energy, storage &amp; grid panels ↗</a></section>
        <section class="igd-panel igd-network-panel"><div class="igd-panel-head"><div><span class="igd-panel-icon violet-icon">♧</span><div><h3>Communication Network</h3><small>Reference-only infrastructure</small></div></div><span class="igd-concept-badge">REFERENCE</span></div><div class="igd-tower-visual"><div class="igd-tower-glyph">♜</div><div><b>Mobile tower network</b><p>Network coverage and tower counts should come from a dated BTRC dataset or authorized operator API.</p></div></div><div class="igd-network-facts"><div><b>46,567</b><span>Historical reference cited in project notes · Feb 2026</span></div><div><b>Not live</b><span>No operator connection is configured</span></div></div><a class="igd-panel-link" href="#tower3d">Open tower network module ↗</a></section>
        <section class="igd-panel igd-radar-panel"><div class="igd-panel-head"><div><span class="igd-panel-icon cyan-icon">⌁</span><div><h3>Air Track &amp; Radar View</h3><small>Public ADS-B only</small></div></div><span class="igd-feed-badge status-pending" id="igdAirState"><i></i><span>CONNECTING</span></span></div><div class="igd-radar-layout"><div class="igd-radar-scope"><span class="igd-radar-ring r1"></span><span class="igd-radar-ring r2"></span><span class="igd-radar-ring r3"></span><span class="igd-radar-sweep"></span><span class="igd-radar-cross"></span><b>ADS-B</b></div><div class="igd-radar-metrics"><div><span>Position-bearing ADS-B entries</span><b id="igdAirTotal">—</b></div><div><span>With position</span><b id="igdAirPositionTotal">—</b></div><div><span>Newest position age</span><b id="igdAirNewest">—</b></div><p>Sweep is decorative; it is not a physical radar. Target counts come only from public ADS-B records.</p></div></div><a class="igd-panel-link" href="#airtraffic">Open live aircraft map ↗</a></section>
      </div>
      <footer class="igd-footer"><span>IGERS-BD-01 · INTEGRATED ENERGY RECOVERY &amp; STORAGE</span><span id="igdLastRefresh">Last dashboard refresh: --</span><button type="button" id="igdRefreshFooter">↻ Refresh</button></footer>
      <section class="igd-sourcebar"><div><b>Sources &amp; interpretation</b><p>Public weather and seismic providers supply observations; NASA GIBS supplies Earth-observation imagery; Airplanes.live supplies public ADS-B-derived aircraft positions. Ground-border traffic, CCTV and IGERS energy output remain unavailable until an authorized feed or physical sensor is connected.</p></div><div class="igd-source-links"><a href="https://nasa-gibs.github.io/gibs-api-docs/" target="_blank" rel="noopener noreferrer">NASA GIBS documentation</a><a href="https://open-meteo.com/en/docs" target="_blank" rel="noopener noreferrer">Open-Meteo API</a><a href="https://earthquake.usgs.gov/earthquakes/feed/v1.0/" target="_blank" rel="noopener noreferrer">USGS earthquake feeds</a><a href="https://airplanes.live/api-docs/" target="_blank" rel="noopener noreferrer">Airplanes.live API docs</a><a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap attribution</a><a href="https://www.esri.com/en-us/legal/terms/full-master-agreement" target="_blank" rel="noopener noreferrer">Esri terms</a></div></section>
    </div>
  </div>
</div>`;
  homeView.insertAdjacentHTML('afterbegin', commandDashboardMarkup);
  const legacyDirectory = document.createElement('details');
  legacyDirectory.id = 'iasLegacyDirectory';
  legacyDirectory.className = 'igd-directory';
  const legacySummary = document.createElement('summary');
  legacySummary.textContent = 'WORKSPACE DIRECTORY · ALL ORIGINAL PANELS';
  const legacyContent = document.createElement('div');
  legacyContent.className = 'igd-directory-content';
  legacyDirectory.append(legacySummary, legacyContent);
  const originalSearchBox = homeView.querySelector('#iasGlobalSearch')?.closest('.ias-searchbox');
  const searchSlot = homeView.querySelector('.igd-searchslot');
  if (originalSearchBox && searchSlot) searchSlot.appendChild(originalSearchBox);
  const legacySelectors = ['.ias-hero', '.ias-dashboard-bar', '.ias-search-status', '.ias-search-results', '#iasCategoryGrid', '.ias-bottom-strip', '.ias-footnote'];
  legacySelectors.forEach((selector) => {
    const item = homeView.querySelector(selector);
    if (item) legacyContent.appendChild(item);
  });
  homeView.appendChild(legacyDirectory);
  originalSearchBox?.querySelector('input')?.addEventListener('input', () => {
    if (originalSearchBox.querySelector('input')?.value.trim()) legacyDirectory.open = true;
  });
  const categoryView = dashboard.querySelector('#iasCategoryView');
  const categoryGrid = dashboard.querySelector('#iasCategoryGrid');
  const featureGrid = dashboard.querySelector('#iasFeatureGrid');
  const globalSearch = dashboard.querySelector('#iasGlobalSearch');
  const searchResults = dashboard.querySelector('#iasSearchResults');
  const searchStatus = dashboard.querySelector('#iasSearchStatus');
  const featureFilter = dashboard.querySelector('#iasFeatureFilter');
  const noFeatures = dashboard.querySelector('#iasNoFeatures');
  const STATE_KEY = 'igersAppShellV2';
  let currentState = null;
  let panelResizeTimer = null;

  // A panel reveal needs one layout notification for canvases/maps. Debounce it so
  // rapid navigation cannot trigger repeated full-app resize work in hidden modules.
  function schedulePanelLayoutRefresh() {
    if (panelResizeTimer !== null) window.clearTimeout(panelResizeTimer);
    panelResizeTimer = window.setTimeout(() => {
      panelResizeTimer = null;
      window.dispatchEvent(new Event('resize'));
    }, 110);
  }

  function createState(view, data = {}, index = 0, parentView = null) {
    return { ...data, [STATE_KEY]: true, view, index, parentView };
  }
  function getState() {
    const state = history.state;
    return state && state[STATE_KEY] === true && ['dashboard', 'category', 'panel'].includes(state.view) ? state : null;
  }
  function setActiveSection(section) {
    main.querySelectorAll(':scope > section').forEach((item) => item.removeAttribute('data-igers-active-panel'));
    if (section && section !== dashboard) section.setAttribute('data-igers-active-panel', 'true');
  }
  function updateBackLabel(state) {
    const label = backButton.querySelector('.ias-nav-back-label');
    let text = 'Back';
    if (state?.view === 'panel') {
      text = state.parentView === 'category' ? 'Back to workspace' : (state.parentView === 'panel' ? 'Back to previous panel' : 'Back to dashboard');
    } else if (state?.view === 'category') text = 'Back to dashboard';
    if (label) label.textContent = text;
    backButton.setAttribute('aria-label', text + ', one level');
  }
  function updateView(view) {
    body.dataset.igersView = view;
    homeView.hidden = view !== 'dashboard';
    categoryView.hidden = view !== 'category';
    dashboard.hidden = view === 'panel';
    dashboard.style.display = view === 'panel' ? 'none' : 'block';
    homeView.style.display = view === 'dashboard' ? 'block' : 'none';
    categoryView.style.display = view === 'category' ? 'block' : 'none';
    backButton.style.display = view === 'dashboard' ? 'none' : 'inline-flex';
    setActiveSection(null);
  }
  function writeHistory(nextState, mode, hash) {
    const url = hash ? `#${String(hash).replace(/^#/, '')}` : '#igersAppDashboard';
    if (mode === 'replace') history.replaceState(nextState, '', url);
    else if (mode === 'push') history.pushState(nextState, '', url);
    currentState = nextState;
  }
  function applyDashboard(state) {
    updateView('dashboard');
    dashboard.querySelector('#iasSearchStatus').textContent = '';
    if (!globalSearch.value.trim()) {
      searchResults.hidden = true;
      categoryGrid.hidden = false;
    }
    updateBackLabel(state);
    if (state?.view === 'dashboard') scrollToElement(dashboard, 'auto');
  }
  function renderCategory(index, state) {
    const category = categoryData[index];
    if (!category) return false;
    updateView('category');
    dashboard.querySelector('#iasCategoryTitle').textContent = category.title;
    dashboard.querySelector('#iasCategoryDesc').textContent = category.description;
    dashboard.querySelector('#iasBreadcrumbCurrent').textContent = category.title;
    dashboard.querySelector('#iasWorkspaceOverline').textContent = `WORKSPACE ${String(index + 1).padStart(2, '0')} · ${category.links.length} PANELS`;
    dashboard.querySelector('#iasWorkspaceMark').textContent = category.icon;
    dashboard.querySelector('#iasFeatureCount').textContent = `${String(category.links.length).padStart(2, '0')} unique destinations`;
    featureFilter.value = '';
    renderFeatureCards(category.links, category);
    updateBackLabel(state);
    scrollToElement(dashboard, 'auto');
    return true;
  }
  function renderFeatureCards(features, category) {
    featureGrid.innerHTML = features.map((feature) => {
      const aliases = feature.aliases.length ? `<span class="ias-feature-alias">Includes: ${safeText(feature.aliases.join(' · '))}</span>` : '';
      return `<a class="ias-feature tone-${category.tone}" href="${safeText(feature.href)}" data-ias-target="${safeText(feature.id)}" aria-label="Open ${safeText(feature.label)} panel"><span class="ias-feature-icon" aria-hidden="true">${category.icon}</span><span class="ias-feature-copy"><span class="ias-feature-name">${safeText(feature.label)}</span><span class="ias-feature-category">${safeText(category.title)}</span>${aliases}</span><span class="ias-feature-arrow" aria-hidden="true">↗</span></a>`;
    }).join('');
    noFeatures.hidden = features.length !== 0;
  }
  function renderPanel(target, state, shouldScroll = true) {
    if (!target || !target.section || !document.contains(target.section)) return false;
    updateView('panel');
    target.section.setAttribute('data-igers-active-panel', 'true');
    backButton.style.display = 'inline-flex';
    updateBackLabel(state);
    if (shouldScroll) {
      requestAnimationFrame(() => {
        scrollToElement(target.element, 'auto');
        schedulePanelLayoutRefresh();
      });
    } else {
      schedulePanelLayoutRefresh();
    }
    return true;
  }
  function renderState(state, options = {}) {
    if (!state || !state.view) return false;
    currentState = state;
    let ok = false;
    if (state.view === 'dashboard') {
      applyDashboard(state);
      ok = true;
    } else if (state.view === 'category') {
      ok = renderCategory(Number(state.category), state);
    } else if (state.view === 'panel') {
      const feature = panelById.get(state.targetId) || panelBySection.get(state.sectionId);
      let target = feature ? { id: state.targetId || feature.id, element: document.getElementById(state.targetId || feature.id) || feature.element, section: feature.section } : null;
      // Support original sub-anchors and deep links which are not listed as canonical cards.
      if (!target && state.targetId) {
        const el = document.getElementById(state.targetId);
        if (el) {
          let section = el;
          while (section && section.parentElement !== main) section = section.parentElement;
          if (section?.tagName === 'SECTION' && section !== dashboard) target = { id: state.targetId, element: el, section };
        }
      }
      ok = renderPanel(target, state, options.scroll !== false);
    }
    if (!ok && options.fallback !== false) {
      const fallback = createState('dashboard', {}, Number(state.index) || 0, state.view);
      writeHistory(fallback, 'replace');
      applyDashboard(fallback);
      return false;
    }
    return ok;
  }
  function navigate(view, data = {}, hash = null) {
    const previous = getState() || currentState || createState('dashboard');
    const index = Math.max(0, Number(previous.index) || 0) + 1;
    const next = createState(view, data, index, previous.view);
    writeHistory(next, 'push', hash || (view === 'category' ? `igersWorkspace-${data.category}` : view === 'panel' ? encodeURIComponent(data.targetId) : 'igersAppDashboard'));
    renderState(next);
  }
  function showDashboard(push = true) {
    const state = createState('dashboard', {}, Math.max(0, Number((getState() || currentState || {}).index) || 0) + (push ? 1 : 0), (getState() || currentState || {}).view || null);
    writeHistory(state, push ? 'push' : 'replace', 'igersAppDashboard');
    applyDashboard(state);
  }
  function showCategory(index, push = true) {
    const category = categoryData[index];
    if (!category) return;
    if (push) navigate('category', { category: index }, `igersWorkspace-${index}`);
    else {
      const state = createState('category', { category: index }, Math.max(0, Number((getState() || currentState || {}).index) || 0), (getState() || currentState || {}).parentView || 'dashboard');
      writeHistory(state, 'replace', `igersWorkspace-${index}`);
      renderState(state);
    }
  }
  function showPanelById(id, options = {}) {
    const decoded = decodeHash(id);
    const existing = document.getElementById(decoded);
    if (!existing) return false;
    let section = existing;
    while (section && section.parentElement !== main) section = section.parentElement;
    if (!section || section.tagName !== 'SECTION' || section === dashboard) return false;
    const feature = panelById.get(decoded) || panelBySection.get(section.id) || null;
    const canonicalId = feature ? feature.id : decoded;
    if (options.push === false) {
      const previous = getState() || currentState || createState('dashboard');
      const state = createState('panel', { targetId: decoded, sectionId: section.id || decoded }, Number(previous.index) || 0, previous.parentView || (decoded === 'home' ? 'dashboard' : null));
      writeHistory(state, 'replace', encodeURIComponent(decoded));
      return renderPanel({ id: decoded, element: existing, section }, state, options.scroll !== false);
    }
    navigate('panel', { targetId: decoded, sectionId: section.id || decoded, canonicalId }, encodeURIComponent(decoded));
    return true;
  }
  function goBackOneLevel() {
    const state = getState() || currentState;
    if (state && Number(state.index) > 0) {
      // Let the browser restore the actual parent state and hash. This also enables Forward.
      history.back();
      return;
    }
    // When someone opens a panel URL directly, there may be no in-app parent entry.
    // Replace this entry rather than accidentally leaving the app or jumping outside it.
    const fallback = createState('dashboard', {}, 0, null);
    writeHistory(fallback, 'replace', 'igersAppDashboard');
    applyDashboard(fallback);
  }
  function stateFromLocation() {
    const id = decodeHash(location.hash);
    if (!id || id === 'igersAppDashboard') return createState('dashboard', {}, 0, null);
    const match = id.match(/^igersWorkspace-(\d+)$/);
    if (match && categoryData[Number(match[1])]) return createState('category', { category: Number(match[1]) }, 0, null);
    if (document.getElementById(id)) return createState('panel', { targetId: id, sectionId: getPanelTarget({ getAttribute: () => '#' + id })?.sectionId || id }, 0, null);
    return createState('dashboard', {}, 0, null);
  }

  categoryGrid.addEventListener('click', (event) => {
    const button = event.target.closest('[data-ias-category]');
    if (button) showCategory(Number(button.dataset.iasCategory), true);
  });
  backButton.addEventListener('click', goBackOneLevel);
  dashboard.querySelector('#iasBackToCategories')?.addEventListener('click', goBackOneLevel);
  featureGrid.addEventListener('click', (event) => {
    const anchor = event.target.closest('a[data-ias-target]');
    if (!anchor) return;
    const id = anchor.getAttribute('data-ias-target');
    if (!id || !document.getElementById(id)) return;
    event.preventDefault();
    showPanelById(id, { push: true, scroll: true });
  });
  // All old in-page links continue to work but are folded into the app-shell history stack.
  document.addEventListener('click', (event) => {
    const anchor = event.target.closest('a[href^="#"]');
    if (!anchor || anchor.hasAttribute('data-ias-target')) return;
    const raw = anchor.getAttribute('href');
    if (!raw || raw === '#') return;
    const id = decodeHash(raw);
    if (id === 'igersAppDashboard' || anchor.hasAttribute('data-igers-home')) {
      event.preventDefault(); showDashboard(true); return;
    }
    if (id.match(/^igersWorkspace-(\d+)$/)) {
      event.preventDefault(); showCategory(Number(id.split('-').pop()), true); return;
    }
    const target = document.getElementById(id);
    if (!target) return;
    let section = target;
    while (section && section.parentElement !== main) section = section.parentElement;
    if (!section || section.tagName !== 'SECTION' || section === dashboard) return;
    event.preventDefault();
    showPanelById(id, { push: true, scroll: true });
  });

  function globalSearchUpdate() {
    const query = globalSearch.value.trim().toLocaleLowerCase();
    searchResults.innerHTML = '';
    if (!query) {
      searchResults.hidden = true;
      categoryGrid.hidden = false;
      searchStatus.textContent = '';
      return;
    }
    const hits = allFeatures.filter((item) => [item.label, item.category, item.aliases.join(' '), item.id, item.sectionId].join(' ').toLocaleLowerCase().includes(query));
    categoryGrid.hidden = true;
    searchResults.hidden = false;
    searchStatus.textContent = `${hits.length} unique panel${hits.length === 1 ? '' : 's'} found`;
    if (!hits.length) {
      searchResults.innerHTML = '<div class="ias-empty-state"><span aria-hidden="true">⌕</span><strong>No matching panels</strong><p>Try a shorter name, workspace or tool keyword.</p></div>';
      return;
    }
    searchResults.innerHTML = `<div class="ias-result-head"><span>SEARCH RESULTS</span><span>${String(hits.length).padStart(2, '0')} MATCHES</span></div>` + hits.map((feature) => {
      const alias = feature.aliasTargets.find((item) => [item.label, item.id].join(' ').toLocaleLowerCase().includes(query));
      const resultId = alias ? alias.id : feature.id;
      const resultLabel = alias ? alias.label : feature.label;
      const context = alias ? `Subview in ${feature.label} · ${feature.category}` : `${feature.category}${feature.aliases.length ? ' · Includes ' + feature.aliases.join(', ') : ''}`;
      return `<a class="ias-search-result tone-${feature.tone}" href="#${safeText(encodeURIComponent(resultId))}" data-ias-target="${safeText(resultId)}"><span class="ias-feature-icon" aria-hidden="true">${feature.icon}</span><span class="ias-feature-copy"><span class="ias-feature-name">${safeText(resultLabel)}</span><span class="ias-feature-category">${safeText(context)}</span></span><span class="ias-feature-arrow" aria-hidden="true">↗</span></a>`;
    }).join('');
  }
  globalSearch.addEventListener('input', globalSearchUpdate);
  searchResults.addEventListener('click', (event) => {
    const anchor = event.target.closest('a[data-ias-target]');
    if (!anchor) return;
    event.preventDefault();
    showPanelById(anchor.getAttribute('data-ias-target'), { push: true, scroll: true });
    globalSearch.value = '';
    globalSearchUpdate();
  });
  featureFilter.addEventListener('input', () => {
    const state = getState() || currentState;
    if (!state || state.view !== 'category') return;
    const category = categoryData[Number(state.category)];
    if (!category) return;
    const q = featureFilter.value.trim().toLocaleLowerCase();
    const filtered = category.links.filter((feature) => [feature.label, feature.aliases.join(' '), feature.id].join(' ').toLocaleLowerCase().includes(q));
    renderFeatureCards(filtered, category);
  });

  document.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      if (body.dataset.igersView === 'panel') showDashboard(true);
      globalSearch.focus();
      return;
    }
    const target = event.target;
    const editing = target && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));
    if (!editing && event.key === '/' && body.dataset.igersView === 'dashboard') {
      event.preventDefault(); globalSearch.focus();
    }
    if (!editing && event.key === 'Escape' && body.dataset.igersView !== 'dashboard' && !document.getElementById('igersNavLinks')?.classList.contains('is-open')) goBackOneLevel();
  });
  window.addEventListener('popstate', (event) => {
    const state = event.state && event.state[STATE_KEY] ? event.state : stateFromLocation();
    if (event.state && event.state[STATE_KEY]) renderState(state, { scroll: true });
    else {
      writeHistory(state, 'replace', decodeHash(location.hash));
      renderState(state, { scroll: true });
    }
  });
  window.addEventListener('hashchange', () => {
    // Ignore the companion hashchange that follows popstate, but honour a hash changed
    // independently by a legacy module or manually in the address bar.
    const active = getState();
    if (active) {
      const hashId = decodeHash(location.hash);
      const matches = active.view === 'dashboard' ? hashId === 'igersAppDashboard'
        : active.view === 'category' ? hashId === `igersWorkspace-${active.category}`
        : hashId === String(active.targetId || '');
      if (matches) return;
    }
    const state = stateFromLocation();
    writeHistory(state, 'replace', decodeHash(location.hash));
    renderState(state, { scroll: true });
  });

  // Keep the original brand navigation concept, but make it a dashboard action.
  const brand = document.querySelector('.nav .brand');
  if (brand) {
    brand.setAttribute('href', '#igersAppDashboard');
    brand.setAttribute('aria-label', 'Return to IGERS POWERCORE dashboard');
  }
  const initialState = stateFromLocation();
  writeHistory(initialState, 'replace', decodeHash(location.hash) || 'igersAppDashboard');
  renderState(initialState, { scroll: Boolean(location.hash), fallback: true });
  if (initialState.view === 'panel') {
    // A direct deep link is the first in-app state, so Back safely returns to the dashboard.
    currentState = createState('panel', { ...initialState }, 0, 'dashboard');
    history.replaceState(currentState, '', location.hash);
  }
  // Resolve the first-paint guard only after the shell has selected the correct view.
  document.documentElement.classList.add('igers-shell-ready');
  const netState = document.getElementById('iasNetState');
  const netDot = document.getElementById('iasNetDot');
  const localClock = document.getElementById('iasLocalClock');
  function updateShellTelemetry() {
    const online = navigator.onLine;
    if (netState) netState.textContent = online ? 'BROWSER ONLINE' : 'OFFLINE';
    if (netDot) { netDot.classList.toggle('offline', !online); netDot.setAttribute('aria-label', online ? 'Browser reports online' : 'Browser reports offline'); }
    if (localClock) localClock.textContent = new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(new Date());
  }
  updateShellTelemetry();
  window.addEventListener('online', updateShellTelemetry);
  window.addEventListener('offline', updateShellTelemetry);
  window.setInterval(updateShellTelemetry, 1000);

  window.__igersAppShell = {
    version: '2.2.0',
    categories: categoryData.map((category) => ({ title: category.title, features: category.links.length })),
    showDashboard: () => showDashboard(true),
    showCategory: (index) => showCategory(index, true),
    openFeature: (id) => showPanelById(id, { push: true, scroll: true }),
    goBack: goBackOneLevel,
    getState: () => ({ view: body.dataset.igersView, activePanel: main.querySelector(':scope > section[data-igers-active-panel="true"]')?.id || null, targetId: currentState?.targetId || null, category: currentState?.category ?? null, categoryCount: categoryData.length, featureCount: allFeatureCount, historyIndex: currentState?.index ?? 0 }),
    getPanelIds: () => allFeatures.map((feature) => feature.id)
  };
})();
