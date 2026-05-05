/* Kawantax Consulting — Landing Page Interactions */

(function () {
  'use strict';

  // ── Year in footer ────────────────────────────────────────────────────────
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ── Header scroll state ───────────────────────────────────────────────────
  const header = document.getElementById('header');
  const onScroll = () => {
    if (window.scrollY > 8) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ── Mobile nav toggle ─────────────────────────────────────────────────────
  const navToggle = document.getElementById('navToggle');
  const nav = document.querySelector('.nav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('active');
      navToggle.classList.toggle('active', open);
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('active');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ── FAQ: only one open at a time ──────────────────────────────────────────
  const faqs = document.querySelectorAll('.faq-item');
  faqs.forEach(item => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        faqs.forEach(other => { if (other !== item) other.open = false; });
      }
    });
  });

  // ── Animated stat counters ────────────────────────────────────────────────
  const statNums = document.querySelectorAll('.stat-num');
  const animateCount = (el) => {
    const target = parseInt(el.dataset.count, 10) || 0;
    const duration = 1600;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.firstChild.nodeValue = Math.floor(target * eased).toLocaleString('id-ID');
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  // ── Reveal on scroll + lazy stats ─────────────────────────────────────────
  if ('IntersectionObserver' in window) {
    const revealEls = document.querySelectorAll(
      '.service-card, .industry-card, .why-item, .testi-card, .price-card, .process li'
    );
    revealEls.forEach(el => el.classList.add('reveal'));

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => io.observe(el));

    const statsIo = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          statNums.forEach(animateCount);
          statsIo.disconnect();
        }
      });
    }, { threshold: 0.3 });

    if (statNums.length) statsIo.observe(statNums[0].closest('.stats'));
  } else {
    statNums.forEach(animateCount);
  }

  // ── Smooth scroll offset for sticky header ────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id.length <= 1) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = header.offsetHeight + 12;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ── Lead form handling (Netlify Forms compatible) ─────────────────────────
  const form = document.getElementById('leadForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      // If hosted on Netlify, the platform intercepts the POST automatically.
      // If running locally / static elsewhere, give the user friendly feedback.
      const isNetlify = window.location.host.includes('netlify') ||
                        document.querySelector('meta[name="netlify"]');
      if (isNetlify) return; // let Netlify handle

      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      const summary =
        `Halo Kawantax, saya ${data.nama || ''} dari ${data.perusahaan || 'pribadi'}. ` +
        `Saya tertarik dengan layanan: ${data.layanan || '-'}. ` +
        `Catatan: ${data.pesan || '-'}. ` +
        `Email: ${data.email || '-'} | WA: ${data.telepon || '-'}.`;
      const wa = `https://wa.me/6281100100100?text=${encodeURIComponent(summary)}`;
      window.open(wa, '_blank', 'noopener');
      form.reset();
    });
  }
})();
