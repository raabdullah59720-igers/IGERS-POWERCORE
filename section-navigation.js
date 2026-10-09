/* IGERS POWERCORE section navigation controller. UI-only: preserves every existing panel and control. */
(function () {
  'use strict';
  const menu = document.getElementById('igersNavLinks');
  const toggle = document.getElementById('navSectionToggle');
  if (!menu || !toggle || menu.dataset.sectionController === 'ready') return;
  menu.dataset.sectionController = 'ready';
  const isMobile = () => window.matchMedia('(max-width: 820px)').matches;
  const setMenu = (open) => {
    menu.classList.toggle('is-open', Boolean(open));
    toggle.setAttribute('aria-expanded', String(Boolean(open)));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    toggle.textContent = open ? '×' : '☰';
  };
  toggle.addEventListener('click', () => setMenu(!menu.classList.contains('is-open')));
  menu.querySelectorAll('details.nav-group > summary').forEach((summary) => {
    summary.addEventListener('click', () => {
      const current = summary.parentElement;
      if (!current) return;
      window.setTimeout(() => {
        if (current.open) {
          menu.querySelectorAll('details.nav-group[open]').forEach((other) => {
            if (other !== current) other.removeAttribute('open');
          });
        }
      }, 0);
    });
  });
  menu.addEventListener('click', (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    link.closest('details.nav-group')?.removeAttribute('open');
    if (isMobile()) setMenu(false);
  });
  document.addEventListener('click', (event) => {
    if (isMobile() && menu.classList.contains('is-open') && !menu.contains(event.target) && !toggle.contains(event.target)) setMenu(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      menu.querySelectorAll('details.nav-group[open]').forEach((group) => group.removeAttribute('open'));
      if (isMobile()) setMenu(false);
    }
  });
  window.addEventListener('resize', () => { if (!isMobile()) setMenu(false); }, { passive: true });
})();
