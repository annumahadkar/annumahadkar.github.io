/* =========================================================================
 * Antra Mahadkar Patel — Portfolio
 * Plain vanilla JS — no framework, no jQuery. GitHub Pages friendly.
 * ========================================================================= */

(function () {
  'use strict';

  /* ---------- helpers ---------- */
  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const onIdle = (cb) => (window.requestIdleCallback || window.requestAnimationFrame)(cb);

  /* ---------- footer year ---------- */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- typed role rotator ---------- */
  (function typed() {
    const el = $('#typed');
    if (!el) return;
    const roles = [
      'Senior QA Engineer',
      'Automation Developer',
      'Framework Designer',
      'System Sleuth',
    ];
    let i = 0;
    let word = '';
    let pos = 0;
    let deleting = false;

    function tick() {
      const full = roles[i];
      if (!deleting) {
        word = full.slice(0, ++pos);
        if (pos === full.length) {
          deleting = true;
          setTimeout(tick, 1400);
          el.textContent = word;
          return;
        }
      } else {
        word = full.slice(0, --pos);
        if (pos === 0) {
          deleting = false;
          i = (i + 1) % roles.length;
        }
      }
      el.textContent = word;
      setTimeout(tick, deleting ? 35 : 65);
    }
    tick();
  })();

  /* ---------- mobile drawer ---------- */
  (function drawer() {
    const btn   = $('#menuBtn');
    const close = $('#drawerClose');
    const draw  = $('#drawer');
    if (!btn || !draw) return;

    function open() {
      draw.classList.add('is-open');
      draw.setAttribute('aria-hidden', 'false');
      btn.setAttribute('aria-expanded', 'true');
      document.body.classList.add('no-scroll');
    }
    function shut() {
      draw.classList.remove('is-open');
      draw.setAttribute('aria-hidden', 'true');
      btn.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('no-scroll');
    }
    btn.addEventListener('click', open);
    if (close) close.addEventListener('click', shut);
    $$('[data-drawer-link]', draw).forEach((a) => a.addEventListener('click', shut));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && draw.classList.contains('is-open')) shut();
    });
  })();

  /* ---------- smooth anchor scroll with topbar offset ---------- */
  (function anchors() {
    const topbarH = () => {
      const v = getComputedStyle(document.documentElement).getPropertyValue('--topbar-h').trim();
      const n = parseInt(v, 10);
      return Number.isFinite(n) ? n : 64;
    };
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href').slice(1);
      if (!id) return;
      const tgt = document.getElementById(id);
      if (!tgt) return;
      e.preventDefault();
      const top = tgt.getBoundingClientRect().top + window.pageYOffset - topbarH() - 8;
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: Math.max(0, top), behavior: reduce ? 'auto' : 'smooth' });
      history.replaceState(null, '', '#' + id);
    });
  })();

  /* ---------- reveal-on-scroll ---------- */
  (function reveals() {
    const targets = $$('.reveal');
    if (!targets.length || !('IntersectionObserver' in window)) {
      targets.forEach((t) => t.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    targets.forEach((t) => io.observe(t));
  })();

  /* ---------- scroll-spy (highlights active section in topbar + rail) ---------- */
  (function scrollSpy() {
    const railItems = $$('.rail__item');
    const topItems  = $$('#topnav li');
    const progEl    = $('#railProgress');
    const allItems  = [...railItems, ...topItems];
    if (!allItems.length) return;

    // Build a unique ordered list of section ids from whichever nav is present
    const orderSource = railItems.length ? railItems : topItems;
    const sections = orderSource
      .map((li) => ({ id: li.dataset.target, el: document.getElementById(li.dataset.target) }))
      .filter((x) => x.el);

    function topbarH() {
      const v = getComputedStyle(document.documentElement).getPropertyValue('--topbar-h').trim();
      const n = parseInt(v, 10);
      return Number.isFinite(n) ? n : 64;
    }

    let ticking = false;
    function update() {
      ticking = false;
      const probe = window.pageYOffset + topbarH() + 80;

      let activeIdx = 0;
      for (let i = 0; i < sections.length; i++) {
        const top = sections[i].el.getBoundingClientRect().top + window.pageYOffset;
        if (top <= probe) activeIdx = i;
      }
      const activeId = sections[activeIdx].id;

      allItems.forEach((li) => {
        const i = sections.findIndex((s) => s.id === li.dataset.target);
        li.classList.toggle('is-active', i === activeIdx);
        li.classList.toggle('is-done',   i > -1 && i < activeIdx);
      });

      // progress line (only renders if rail is visible)
      if (progEl && railItems.length) {
        const activeLi = railItems.find((li) => li.dataset.target === activeId);
        if (activeLi) {
          const list   = railItems[0].parentNode;
          const listR  = list.getBoundingClientRect();
          const firstR = railItems[0].getBoundingClientRect();
          const activR = activeLi.getBoundingClientRect();
          const startY = (firstR.top - listR.top) + 14;
          const endY   = (activR.top  - listR.top) + 14;
          progEl.style.height = Math.max(0, endY - startY) + 'px';
        }
      }
    }

    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }, { passive: true });
    window.addEventListener('resize', update);
    onIdle(update);
  })();

  /* ---------- prefetch resume PDF on first hover ---------- */
  (function prefetchResume() {
    const link = document.querySelector('a[href="assets/Antra_Mahadkar_CV.pdf"]');
    if (!link) return;
    let done = false;
    link.addEventListener('mouseenter', () => {
      if (done) return;
      done = true;
      const l = document.createElement('link');
      l.rel = 'prefetch';
      l.href = 'assets/Antra_Mahadkar_CV.pdf';
      document.head.appendChild(l);
    }, { once: true });
  })();

})();
