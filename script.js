/* ═══════════════════════════════════════════════════════════
   LOADING SCREEN
═══════════════════════════════════════════════════════════ */
(function initLoader() {
  const loader = document.getElementById('loading-screen');
  document.body.classList.add('loading');

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('fade-out');
      document.body.classList.remove('loading');
    }, 1800);
  });
})();

/* ═══════════════════════════════════════════════════════════
   CUSTOM CURSOR
═══════════════════════════════════════════════════════════ */
(function initCursor() {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;
  let raf;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.14;
    ringY += (mouseY - ringY) * 0.14;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    raf = requestAnimationFrame(animateRing);
  }
  animateRing();

  const hoverTargets = 'a, button, .skill-pill, .tech-badge, .project-card, .contact-card, .social-link, input, textarea';
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
  });
})();

/* ═══════════════════════════════════════════════════════════
   NAVBAR — scroll behaviour + active section
═══════════════════════════════════════════════════════════ */
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  const allLinks  = document.querySelectorAll('.nav-link');

  /* Glass on scroll */
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        navbar.classList.toggle('scrolled', window.scrollY > 20);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  /* Hamburger */
  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    navLinks.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
  });

  /* Close menu when link clicked */
  allLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  /* Active section highlighting via IntersectionObserver */
  const sections = document.querySelectorAll('section[id]');
  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        allLinks.forEach(link => {
          const active = link.getAttribute('href') === '#' + entry.target.id;
          link.classList.toggle('active', active);
          if (active) link.setAttribute('aria-current', 'page');
          else link.removeAttribute('aria-current');
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => navObserver.observe(s));
})();

/* ═══════════════════════════════════════════════════════════
   SCROLL-REVEAL ANIMATIONS
═══════════════════════════════════════════════════════════ */
(function initReveal() {
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => observer.observe(el));
})();

/* ═══════════════════════════════════════════════════════════
   TYPING ANIMATION
═══════════════════════════════════════════════════════════ */
(function initTyping() {
  const el = document.getElementById('typing-text');
  if (!el) return;

  const phrases = [
    'SDET',
    'API Quality Engineer',
    'Test Automation Expert',
    'NIT Durgapur \'26',
    'Release Engineer',
  ];

  let phraseIdx = 0;
  let charIdx   = 0;
  let deleting  = false;
  let pauseTicks = 0;
  const PAUSE = 18;

  function tick() {
    const current = phrases[phraseIdx];

    if (!deleting) {
      el.textContent = current.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        deleting = true;
        pauseTicks = PAUSE;
        setTimeout(tick, 80 * pauseTicks);
        return;
      }
      setTimeout(tick, 80);
    } else {
      el.textContent = current.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        setTimeout(tick, 400);
        return;
      }
      setTimeout(tick, 40);
    }
  }

  setTimeout(tick, 2800);
})();

/* ═══════════════════════════════════════════════════════════
   HERO CANVAS — PARTICLE FIELD
═══════════════════════════════════════════════════════════ */
(function initCanvas() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [], mouse = { x: -1000, y: -1000 };
  const COUNT  = 110;
  const COLORS = ['rgba(108,99,255,', 'rgba(0,212,255,', 'rgba(240,240,245,'];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  class Particle {
    constructor() { this.reset(true); }

    reset(init) {
      this.x   = Math.random() * W;
      this.y   = init ? Math.random() * H : (Math.random() > 0.5 ? -4 : H + 4);
      this.vx  = (Math.random() - 0.5) * 0.35;
      this.vy  = (Math.random() - 0.5) * 0.35;
      this.r   = Math.random() * 1.6 + 0.4;
      this.col = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.a   = Math.random() * 0.55 + 0.15;
    }

    update() {
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        const force = (120 - dist) / 120 * 0.4;
        this.vx += (dx / dist) * force;
        this.vy += (dy / dist) * force;
      }
      this.vx *= 0.98;
      this.vy *= 0.98;
      this.x  += this.vx;
      this.y  += this.vy;

      if (this.x < -4 || this.x > W + 4 || this.y < -4 || this.y > H + 4) {
        this.reset(false);
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.col + this.a + ')';
      ctx.fill();
    }
  }

  function drawConnections() {
    const maxDist = 100;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < maxDist) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(108,99,255,${0.12 * (1 - d / maxDist)})`;
          ctx.lineWidth   = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function init() {
    resize();
    particles = Array.from({ length: COUNT }, () => new Particle());
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', () => {
    resize();
    particles.forEach(p => p.reset(true));
  }, { passive: true });

  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  }, { passive: true });

  canvas.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  init();
  loop();
})();

/* ═══════════════════════════════════════════════════════════
   SKILL BARS — animate on scroll
═══════════════════════════════════════════════════════════ */
(function initSkillBars() {
  const bars = document.querySelectorAll('.bar-fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill  = entry.target;
        const width = fill.dataset.width;
        fill.style.width = width + '%';
        fill.classList.add('animated');
        observer.unobserve(fill);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => observer.observe(bar));
})();

/* ═══════════════════════════════════════════════════════════
   TIMELINE BULLETS — stagger in on reveal
═══════════════════════════════════════════════════════════ */
(function initTimelineBullets() {
  const cards = document.querySelectorAll('.timeline-card');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bullets = entry.target.querySelectorAll('.tl-bullet');
        bullets.forEach((b, i) => {
          b.style.opacity   = '0';
          b.style.transform = 'translateX(-16px)';
          b.style.transition = `opacity 0.4s ${i * 0.1 + 0.2}s ease, transform 0.4s ${i * 0.1 + 0.2}s ease`;
          setTimeout(() => {
            b.style.opacity   = '1';
            b.style.transform = 'translateX(0)';
          }, 80);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  cards.forEach(c => observer.observe(c));
})();

/* ═══════════════════════════════════════════════════════════
   CONTACT FORM — frontend validation + fake submit
═══════════════════════════════════════════════════════════ */
(function initContactForm() {
  const form   = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if (!form || !status) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const name    = form.querySelector('#form-name').value.trim();
    const email   = form.querySelector('#form-email').value.trim();
    const message = form.querySelector('#form-message').value.trim();
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !email || !message) {
      setStatus('Please fill in all fields.', 'error');
      return;
    }
    if (!emailRe.test(email)) {
      setStatus('Please enter a valid email address.', 'error');
      return;
    }

    const btn = form.querySelector('.form-submit');
    btn.disabled    = true;
    btn.textContent = 'Sending…';

    setTimeout(() => {
      setStatus('Message sent! I\'ll get back to you soon.', 'success');
      form.reset();
      btn.disabled    = false;
      btn.innerHTML   = 'Send Message <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
    }, 1400);
  });

  function setStatus(msg, type) {
    status.textContent = msg;
    status.className   = 'form-status ' + type;
    setTimeout(() => {
      status.textContent = '';
      status.className   = 'form-status';
    }, 5000);
  }
})();

/* ═══════════════════════════════════════════════════════════
   BACK TO TOP BUTTON
═══════════════════════════════════════════════════════════ */
(function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        btn.classList.toggle('visible', window.scrollY > 400);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ═══════════════════════════════════════════════════════════
   SCROLL INDICATOR — hide on first scroll
═══════════════════════════════════════════════════════════ */
(function initScrollIndicator() {
  const indicator = document.querySelector('.scroll-indicator');
  if (!indicator) return;

  const hide = () => {
    if (window.scrollY > 80) {
      indicator.style.opacity   = '0';
      indicator.style.transform = 'translateX(-50%) translateY(10px)';
      window.removeEventListener('scroll', hide);
    }
  };
  indicator.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
  window.addEventListener('scroll', hide, { passive: true });
})();

/* ═══════════════════════════════════════════════════════════
   HERO BADGE "OPEN" PULSE — ensure cursor interaction tracked
═══════════════════════════════════════════════════════════ */
(function dynamicHoverTargets() {
  const ring = document.getElementById('cursor-ring');
  if (!ring) return;

  document.addEventListener('mouseover', e => {
    if (e.target.closest('a, button, .skill-pill, .tech-badge, .project-card, .contact-card, .social-link, input, textarea')) {
      ring.classList.add('hovered');
    } else {
      ring.classList.remove('hovered');
    }
  });
})();
