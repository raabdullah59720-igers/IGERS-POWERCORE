/*
 IGERS-BD-01 | Final Safe Presentation Enhancer
 Drop-in visual-only layer for the existing IGERS-POWERCORE static site.

 IMPORTANT:
 This file deliberately does NOT create a second weather, earthquake, air-traffic,
 or clock polling loop. The existing IGERS scripts remain the single source of live data.

 It only adds:
  1) Bangladesh flag visual inside #home.hero;
  2) small Bangladesh identity mark beside the existing brand;
  3) a tiny non-blocking "IGERS LIVE" status badge.
*/
(() => {
  'use strict';

  const VERSION = '2026.09.12-final-safe2';

  function makeFlagDataURI() {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 720" role="img" aria-label="Bangladesh flag"><rect width="1200" height="720" fill="#006a4e"/><circle cx="650" cy="360" r="176" fill="#f42a41"/></svg>';
    return 'data:image/svg+xml;base64,' + btoa(svg);
  }

  function injectStyles() {
    if (document.getElementById('igers-safe-style')) return;
    const style = document.createElement('style');
    style.id = 'igers-safe-style';
    style.textContent = `
      /* All styles are strictly scoped to enhancer-owned IDs/classes. */
      #home.hero { position: relative; isolation: isolate; }
      #home.hero > .wrap { position: relative; z-index: 2; }
      #home.hero > .igers-bd-flag-layer {
        position: absolute;
        inset: 0;
        z-index: 0;
        pointer-events: none;
        background-repeat: no-repeat;
        background-position: center center;
        background-size: cover;
        opacity: .18;
        mix-blend-mode: screen;
      }
      #home.hero > .igers-bd-flag-glow {
        position: absolute;
        width: min(30vw, 320px);
        height: min(30vw, 320px);
        min-width: 150px;
        min-height: 150px;
        left: 4%;
        top: 12%;
        z-index: 1;
        border-radius: 50%;
        pointer-events: none;
        background: radial-gradient(circle, rgba(244,42,65,.24), rgba(244,42,65,.06) 45%, transparent 72%);
      }
      .igers-bd-mark {
        display: inline-block;
        width: 19px;
        height: 12px;
        margin-right: 7px;
        vertical-align: -1px;
        border-radius: 2px;
      }
      #igers-safe-status {
        position: fixed;
        right: 12px;
        bottom: 12px;
        z-index: 2147483000;
        pointer-events: none;
        padding: 6px 9px;
        border: 1px solid rgba(138,243,191,.20);
        border-radius: 999px;
        background: rgba(4,12,18,.68);
        color: #8af3bf;
        font: 700 9px/1 system-ui, sans-serif;
        letter-spacing: .12em;
        text-transform: uppercase;
        backdrop-filter: blur(7px);
      }
      @media (max-width: 650px) {
        #home.hero > .igers-bd-flag-layer { opacity: .14; background-size: auto 560px; }
        #home.hero > .igers-bd-flag-glow { width: 180px; height: 180px; left: 3%; top: 8%; }
        #igers-safe-status { right: 8px; bottom: 8px; }
      }
    `;
    document.head.appendChild(style);
  }

  function installFlag() {
    const hero = document.querySelector('#home.hero');
    if (!hero) return;

    const flagURI = makeFlagDataURI();

    if (!hero.querySelector('.igers-bd-flag-layer')) {
      const layer = document.createElement('div');
      layer.className = 'igers-bd-flag-layer';
      layer.setAttribute('aria-hidden', 'true');
      layer.style.backgroundImage = `url("${flagURI}")`;
      hero.prepend(layer);
    }

    if (!hero.querySelector('.igers-bd-flag-glow')) {
      const glow = document.createElement('div');
      glow.className = 'igers-bd-flag-glow';
      glow.setAttribute('aria-hidden', 'true');
      hero.prepend(glow);
    }

    const brand = document.querySelector('.brand');
    if (brand && !brand.querySelector('.igers-bd-mark')) {
      const mark = document.createElement('img');
      mark.className = 'igers-bd-mark';
      mark.alt = 'Bangladesh flag';
      mark.src = flagURI;
      brand.prepend(mark);
    }
  }

  function installStatus() {
    if (document.getElementById('igers-safe-status')) return;
    const status = document.createElement('div');
    status.id = 'igers-safe-status';
    status.textContent = 'IGERS LIVE';
    document.body.appendChild(status);
  }

  function start() {
    injectStyles();
    installFlag();
    installStatus();
    window.IGERS_LIVE_ENHANCER_VERSION = VERSION;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
