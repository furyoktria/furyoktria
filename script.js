// =============================================================
// Maskit landing page — micro-interactions
// =============================================================

(function () {
  'use strict';

  // Sticky nav state
  const nav = document.getElementById('nav');
  if (nav) {
    const onScroll = () => {
      if (window.scrollY > 8) nav.classList.add('is-scrolled');
      else nav.classList.remove('is-scrolled');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Mobile menu toggle (simple)
  const burger = document.querySelector('.nav__burger');
  const menu = document.querySelector('.nav__menu');
  if (burger && menu) {
    burger.addEventListener('click', () => {
      const open = menu.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(open));
      if (open) {
        Object.assign(menu.style, {
          display: 'flex',
          flexDirection: 'column',
          position: 'absolute',
          top: '100%',
          left: '0',
          right: '0',
          background: '#fff',
          padding: '20px 24px',
          borderBottom: '1px solid #e5ece9',
          boxShadow: '0 8px 24px rgba(7,32,58,.08)',
          gap: '14px',
          alignItems: 'flex-start'
        });
      } else {
        menu.removeAttribute('style');
      }
    });
  }

  // Reveal on scroll
  const targets = document.querySelectorAll(
    '.section-head, .pillar, .bcard, .metric, .story, .innov__copy, .innov__visual, .voices__quote, .cta__inner > *, .purpose__body'
  );
  targets.forEach((el) => el.classList.add('reveal'));

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    targets.forEach((el) => io.observe(el));
  } else {
    targets.forEach((el) => el.classList.add('is-in'));
  }

  // Animated counters in metrics
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    const animate = (el) => {
      const target = parseFloat(el.dataset.count);
      const duration = 1500;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        const value = target * eased;
        el.textContent = target >= 100 ? Math.round(value) : value.toFixed(0);
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = String(target);
      };
      requestAnimationFrame(tick);
    };

    const cio = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            animate(e.target);
            cio.unobserve(e.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach((c) => cio.observe(c));
  }

  // Subtle hero parallax on pointer move
  const hero = document.querySelector('.hero');
  const blobA = document.querySelector('.hero__blob--a');
  const blobB = document.querySelector('.hero__blob--b');
  const stack = document.querySelector('.card-stack');
  if (hero && blobA && blobB && window.matchMedia('(pointer: fine)').matches) {
    hero.addEventListener('pointermove', (e) => {
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      blobA.style.transform = `translate(${x * -30}px, ${y * -20}px)`;
      blobB.style.transform = `translate(${x * 30}px, ${y * 20}px)`;
      if (stack) stack.style.transform = `translate(${x * 8}px, ${y * 8}px)`;
    });
  }

  // Smooth focus on anchor click (respect prefers-reduced-motion)
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id && id.length > 1) {
        const t = document.querySelector(id);
        if (t) {
          e.preventDefault();
          t.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // Close mobile menu if open
          if (menu && menu.classList.contains('is-open')) {
            menu.classList.remove('is-open');
            menu.removeAttribute('style');
            if (burger) burger.setAttribute('aria-expanded', 'false');
          }
        }
      }
    });
  });
})();
