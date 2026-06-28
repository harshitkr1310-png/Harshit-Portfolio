/* ================================================================
   HARSHIT KUMAR — PORTFOLIO SCRIPT
   Loader · Particles · Typed text · Theme · Nav · Scroll reveal
   Skill bars · Counters · Project filter · Form validation
================================================================ */

'use strict';

/* ---------------------------------------------------------------
   1. HELPERS
--------------------------------------------------------------- */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ---------------------------------------------------------------
   2. LOADING SCREEN
--------------------------------------------------------------- */
window.addEventListener('load', () => {
  const loader = $('#loader');
  if (!loader) return;
  // Give a brief moment of branding, then fade out
  setTimeout(() => loader.classList.add('hidden'), 900);
});

/* ---------------------------------------------------------------
   3. PARTICLE CANVAS
--------------------------------------------------------------- */
(function initParticles() {
  const canvas = $('#particles');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  const COUNT = 60;
  const theme = () => document.documentElement.dataset.theme;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function Particle() {
    this.x  = Math.random() * W;
    this.y  = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.r  = Math.random() * 1.8 + 0.6;
    this.alpha = Math.random() * 0.5 + 0.15;
  }

  Particle.prototype.update = function () {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W) this.vx *= -1;
    if (this.y < 0 || this.y > H) this.vy *= -1;
  };

  Particle.prototype.draw = function () {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = theme() === 'dark'
      ? `rgba(168,85,247,${this.alpha})`
      : `rgba(124,58,237,${this.alpha * 0.6})`;
    ctx.fill();
  };

  function connect() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.hypot(dx, dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          const alpha = (1 - dist / 120) * 0.12;
          ctx.strokeStyle = theme() === 'dark'
            ? `rgba(168,85,247,${alpha})`
            : `rgba(124,58,237,${alpha * 0.5})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    connect();
    requestAnimationFrame(loop);
  }

  resize();
  particles = Array.from({ length: COUNT }, () => new Particle());
  window.addEventListener('resize', resize);
  loop();
})();

/* ---------------------------------------------------------------
   4. TYPED TEXT EFFECT
--------------------------------------------------------------- */
(function initTyped() {
  const el = $('#typedText');
  if (!el) return;

  const words = ['Full-Stack Developer', 'CS Student', 'Problem Solver', 'Web Developer'];
  let wIndex = 0, cIndex = 0, deleting = false;

  function type() {
    const word = words[wIndex];
    if (!deleting) {
      el.textContent = word.slice(0, ++cIndex);
      if (cIndex === word.length) {
        deleting = true;
        setTimeout(type, 1600);
        return;
      }
      setTimeout(type, 90);
    } else {
      el.textContent = word.slice(0, --cIndex);
      if (cIndex === 0) {
        deleting = false;
        wIndex = (wIndex + 1) % words.length;
        setTimeout(type, 400);
        return;
      }
      setTimeout(type, 45);
    }
  }
  setTimeout(type, 700);
})();

/* ---------------------------------------------------------------
   5. THEME TOGGLE
--------------------------------------------------------------- */
(function initTheme() {
  const btn  = $('#themeToggle');
  const root = document.documentElement;
  const saved = localStorage.getItem('hk-theme');

  if (saved) root.dataset.theme = saved;

  btn?.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    localStorage.setItem('hk-theme', next);
  });
})();

/* ---------------------------------------------------------------
   6. NAV — scroll spy + mobile drawer
--------------------------------------------------------------- */
(function initNav() {
  const nav    = $('.nav');
  const burger = $('#burger');
  const menu   = $('#mobileMenu');
  const links  = $$('.nav__link');
  const sections = $$('section[id]');

  // Mobile drawer toggle
  burger?.addEventListener('click', () => {
    const open = burger.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
    menu.classList.toggle('open', open);
    menu.setAttribute('aria-hidden', !open);
  });

  // Close on link click (mobile)
  $$('[data-close]').forEach(el => {
    el.addEventListener('click', () => {
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', false);
      menu.classList.remove('open');
      menu.setAttribute('aria-hidden', true);
    });
  });

  // Scroll spy — highlight active nav link
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute('id');
      links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${id}`));
    });
  }, { rootMargin: '-45% 0px -45% 0px' });

  sections.forEach(s => observer.observe(s));
})();

/* ---------------------------------------------------------------
   7. SCROLL REVEAL
--------------------------------------------------------------- */
(function initReveal() {
  const els = $$('.reveal');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  els.forEach(el => obs.observe(el));
})();

/* ---------------------------------------------------------------
   8. SKILL BARS — animate on scroll into view
--------------------------------------------------------------- */
(function initSkillBars() {
  const fills = $$('.skill-card__fill');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const w = e.target.dataset.width;
        e.target.style.width = w + '%';
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  fills.forEach(f => obs.observe(f));
})();

/* ---------------------------------------------------------------
   9. ANIMATED COUNTERS
--------------------------------------------------------------- */
(function initCounters() {
  const counters = $$('.stat__num');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el     = e.target;
      const target = +el.dataset.target;
      const dur    = 1200;
      const step   = dur / target;
      let cur = 0;
      const tick = () => {
        cur++;
        el.textContent = cur;
        if (cur < target) setTimeout(tick, step);
      };
      tick();
      obs.unobserve(el);
    });
  }, { threshold: 0.7 });
  counters.forEach(c => obs.observe(c));
})();

/* ---------------------------------------------------------------
   10. PROJECT FILTER
--------------------------------------------------------------- */
(function initFilter() {
  const btns  = $$('.filter-btn');
  const cards = $$('.project-card');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      cards.forEach(card => {
        const cats = card.dataset.category || '';
        const show = filter === 'all' || cats.split(' ').includes(filter);
        card.classList.toggle('hidden', !show);
      });
    });
  });
})();

/* ---------------------------------------------------------------
   11. CONTACT FORM VALIDATION
--------------------------------------------------------------- */
(function initForm() {
  const form    = $('#contactForm');
  if (!form) return;

  const nameEl    = $('#name');
  const emailEl   = $('#email');
  const msgEl     = $('#message');
  const nameErr   = $('#nameError');
  const emailErr  = $('#emailError');
  const msgErr    = $('#messageError');
  const success   = $('#formSuccess');

  function setError(el, errEl, msg) {
    el.style.borderColor = msg ? '#f87171' : '';
    errEl.textContent = msg;
  }

  function validateEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  // Live clear errors on input
  nameEl?.addEventListener('input', () => setError(nameEl, nameErr, ''));
  emailEl?.addEventListener('input', () => setError(emailEl, emailErr, ''));
  msgEl?.addEventListener('input',  () => setError(msgEl,  msgErr,  ''));

  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;
    success.textContent = '';

    if (!nameEl.value.trim()) {
      setError(nameEl, nameErr, 'Please enter your name.');
      valid = false;
    }
    if (!validateEmail(emailEl.value.trim())) {
      setError(emailEl, emailErr, 'Please enter a valid email address.');
      valid = false;
    }
    if (msgEl.value.trim().length < 10) {
      setError(msgEl, msgErr, 'Message must be at least 10 characters.');
      valid = false;
    }

    if (valid) {
      // Simulate submission (replace with real endpoint or EmailJS)
      const btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending…';

      setTimeout(() => {
        form.reset();
        btn.disabled = false;
        btn.innerHTML = 'Send Message <i class="fa-solid fa-paper-plane"></i>';
        success.textContent = '✅ Message sent! I\'ll get back to you soon.';
        setTimeout(() => success.textContent = '', 5000);
      }, 1400);
    }
  });
})();

/* ---------------------------------------------------------------
   12. BACK TO TOP BUTTON
--------------------------------------------------------------- */
(function initBackToTop() {
  const btn = $('#backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* ---------------------------------------------------------------
   13. FOOTER — dynamic year
--------------------------------------------------------------- */
const yearEl = $('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
