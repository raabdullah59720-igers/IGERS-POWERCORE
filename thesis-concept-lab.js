/* IGERS-BD-01 thesis concept gallery. Local illustrations only; no external library or fabricated telemetry. */
(() => {
  'use strict';
  const root = document.getElementById('thesisVisualLab');
  if (!root || root.dataset.initialized === '1') return;
  root.dataset.initialized = '1';
  const scenes = {
    integrated: {
      src: 'thesis-concept-integrated.svg',
      title: 'Integrated recovery ecosystem',
      label: 'MULTI-SOURCE · SHARED STORAGE',
      desc: 'Conceptual system architecture linking selected road, hydraulic and solar-support inputs through power conditioning to battery storage, monitoring and suitable local loads.',
      model: 'INTEGRATED CONCEPT'
    },
    road: {
      src: 'thesis-concept-road.svg',
      title: 'Transport and roadway recovery node',
      label: 'MECHANICAL INPUT · SITE-DEPENDENT',
      desc: 'Illustrates a possible mechanical recovery interface near controlled vehicle movement, followed by conditioning and local storage. The actual device must be designed to avoid unacceptable traffic, structural or safety effects.',
      model: 'ROAD CONCEPT'
    },
    hydro: {
      src: 'thesis-concept-hydro.svg',
      title: 'Controlled hydraulic recovery node',
      label: 'FLOW + HEAD · CIVIL CHECK REQUIRED',
      desc: 'Illustrates flow/head-driven recovery through a rotor-generator concept. Available hydraulic energy, environmental effects, sediment, gate operation, civil loads and safe bypass must be checked before a real installation.',
      model: 'HYDRAULIC CONCEPT'
    },
    solar: {
      src: 'thesis-concept-solar.svg',
      title: 'Solar and airflow support node',
      label: 'PV SUPPORT · OPTIONAL AIRFLOW',
      desc: 'Illustrates a PV canopy and optional small airflow-recovery component feeding power conditioning, storage and low-power loads. Solar yield and airflow output are site-specific estimates, not measured data.',
      model: 'HYBRID CONCEPT'
    }
  };
  const image = root.querySelector('#thesisConceptVisual');
  const title = root.querySelector('#thesisConceptTitle');
  const desc = root.querySelector('#thesisConceptDescription');
  const label = root.querySelector('#thesisConceptSceneLabel');
  const model = root.querySelector('#thesisConceptModelTag');
  const status = root.querySelector('#thesisConceptStatus');
  const buttons = Array.from(root.querySelectorAll('[data-thesis-scene]'));
  function selectScene(key, focusButton = false) {
    const scene = scenes[key] ? key : 'integrated';
    const item = scenes[scene];
    buttons.forEach(button => {
      const selected = button.dataset.thesisScene === scene;
      button.setAttribute('aria-pressed', String(selected));
      if (selected && focusButton) button.focus();
    });
    if (image) {
      image.onerror = () => {
        image.hidden = true;
        if (status) status.textContent = 'Illustration could not load. Check that all thesis-concept SVG files were uploaded beside index.html.';
      };
      image.onload = () => {
        image.hidden = false;
        if (status) status.textContent = 'Concept illustration loaded locally. No performance telemetry is implied.';
      };
      image.src = item.src;
      image.alt = item.title + '. ' + item.desc;
    }
    if (title) title.textContent = item.title;
    if (desc) desc.textContent = item.desc;
    if (label) label.textContent = item.label;
    if (model) model.textContent = item.model;
    root.dataset.scene = scene;
  }
  buttons.forEach(button => button.addEventListener('click', () => selectScene(button.dataset.thesisScene)));
  root.addEventListener('keydown', event => {
    if (!['ArrowDown', 'ArrowUp'].includes(event.key)) return;
    const active = buttons.indexOf(document.activeElement);
    if (active < 0) return;
    event.preventDefault();
    const delta = event.key === 'ArrowDown' ? 1 : -1;
    const next = (active + delta + buttons.length) % buttons.length;
    selectScene(buttons[next].dataset.thesisScene, true);
  });
  selectScene('integrated');
})();
