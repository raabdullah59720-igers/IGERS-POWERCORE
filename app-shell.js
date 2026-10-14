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

  const iconMap = ['⌘', '◌', '✈', '▤', 'ϟ', '✚', '⬡', '⛨'];
  const descMap = [
    'Project identity, concept architecture, research visualizers and engineering boundaries.',
    'Environmental context, weather, local time, seismic and coastal monitoring.',
    'Public aviation visualization, airspace awareness and border-monitor interfaces.',
    'Transport infrastructure, toll intelligence, satellite and connectivity views.',
    'Energy recovery calculations, analysis tools and system controls.',
    'Emergency tools, feedback and customer-support interfaces.',
    'Integrated command, engineering simulation and operations health.',
    'Passive awareness, public-source integrity, infrastructure continuity and browser-local incident drills.'
  ];
  const workspaceColors = ['cyan', 'mint', 'blue', 'amber', 'violet', 'rose', 'steel', 'mint'];
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
  window.__igersAppShell = {
    version: '2.1.0',
    categories: categoryData.map((category) => ({ title: category.title, features: category.links.length })),
    showDashboard: () => showDashboard(true),
    showCategory: (index) => showCategory(index, true),
    openFeature: (id) => showPanelById(id, { push: true, scroll: true }),
    goBack: goBackOneLevel,
    getState: () => ({ view: body.dataset.igersView, activePanel: main.querySelector(':scope > section[data-igers-active-panel="true"]')?.id || null, targetId: currentState?.targetId || null, category: currentState?.category ?? null, categoryCount: categoryData.length, featureCount: allFeatureCount, historyIndex: currentState?.index ?? 0 }),
    getPanelIds: () => allFeatures.map((feature) => feature.id)
  };
})();
