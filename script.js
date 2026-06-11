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
   CUSTOM CURSOR — diamond dot · spinning ring · trail
═══════════════════════════════════════════════════════════ */
(function initCursor() {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  const TRAIL_COUNT = 10;
  const trails = [];

  /* Build trail DOM elements */
  for (let i = 0; i < TRAIL_COUNT; i++) {
    const t = document.createElement('div');
    t.className = 'cursor-trail';
    document.body.appendChild(t);
    trails.push({ el: t, x: 0, y: 0 });
  }

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  function animateAll() {
    /* Ring — smooth lag */
    ringX += (mouseX - ringX) * 0.13;
    ringY += (mouseY - ringY) * 0.13;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';

    /* Trail — each follows the one before it */
    let px = mouseX, py = mouseY;
    trails.forEach((trail, i) => {
      const speed = 0.28 - i * 0.018;
      trail.x += (px - trail.x) * Math.max(speed, 0.06);
      trail.y += (py - trail.y) * Math.max(speed, 0.06);
      trail.el.style.left    = trail.x + 'px';
      trail.el.style.top     = trail.y + 'px';
      trail.el.style.opacity = ((1 - i / TRAIL_COUNT) * 0.38).toFixed(3);
      const s = 1 - i * 0.07;
      trail.el.style.transform = `translate(-50%,-50%) rotate(45deg) scale(${Math.max(s, 0.2)})`;
      px = trail.x;
      py = trail.y;
    });

    requestAnimationFrame(animateAll);
  }
  animateAll();

  /* Hover detection via delegation */
  const HOVER_SEL = 'a, button, .skill-pill, .tech-badge, .project-card, .contact-card, .social-link, input, textarea, .edu-stat-badge, .stat-card';
  document.addEventListener('mouseover', e => {
    const isHover = !!e.target.closest(HOVER_SEL);
    ring.classList.toggle('hovered', isHover);
    dot.classList.toggle('hovered', isHover);
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
   SCROLL PROGRESS BAR
═══════════════════════════════════════════════════════════ */
(function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollTop  = document.documentElement.scrollTop;
        const docHeight  = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        bar.style.width  = (docHeight > 0 ? (scrollTop / docHeight) * 100 : 0) + '%';
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();

/* ═══════════════════════════════════════════════════════════
   ANIMATED COUNTERS
═══════════════════════════════════════════════════════════ */
(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseFloat(el.dataset.count);
      const dur    = 1400;
      const start  = performance.now();

      function step(now) {
        const p = Math.min((now - start) / dur, 1);
        const e = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(target * e) + '+';
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target + '+';
      }
      requestAnimationFrame(step);
      observer.unobserve(el);
    });
  }, { threshold: 0.6 });

  counters.forEach(c => observer.observe(c));
})();

/* ═══════════════════════════════════════════════════════════
   GLITCH EFFECT — fires every 9 seconds on hero heading
═══════════════════════════════════════════════════════════ */
(function initGlitch() {
  const heading = document.querySelector('.hero-heading');
  if (!heading) return;
  setInterval(() => {
    heading.classList.add('glitch');
    setTimeout(() => heading.classList.remove('glitch'), 450);
  }, 9000);
})();

/* ═══════════════════════════════════════════════════════════
   RADAR CHART — Canvas spider chart
═══════════════════════════════════════════════════════════ */
(function initRadarChart() {
  const canvas = document.getElementById('radar-chart');
  if (!canvas) return;

  const dpr   = window.devicePixelRatio || 1;
  const SIZE  = 320;
  canvas.width  = SIZE * dpr;
  canvas.height = SIZE * dpr;
  canvas.style.width  = SIZE + 'px';
  canvas.style.height = SIZE + 'px';

  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  const LABELS  = ['Auto', 'API', 'JS', 'Git', 'TS', 'Docker'];
  const TARGETS = [90, 89, 85, 83, 80, 72];
  const N = LABELS.length;
  const CX = SIZE / 2, CY = SIZE / 2;
  const R  = SIZE / 2 - 52;
  const STEP = (Math.PI * 2) / N;

  function point(i, pct) {
    const angle = i * STEP - Math.PI / 2;
    const r = pct / 100 * R;
    return { x: CX + r * Math.cos(angle), y: CY + r * Math.sin(angle) };
  }

  function draw(vals) {
    ctx.clearRect(0, 0, SIZE, SIZE);

    /* Grid rings */
    for (let ring = 1; ring <= 5; ring++) {
      ctx.beginPath();
      for (let i = 0; i <= N; i++) {
        const angle = i * STEP - Math.PI / 2;
        const rx = CX + (R * ring / 5) * Math.cos(angle);
        const ry = CY + (R * ring / 5) * Math.sin(angle);
        i === 0 ? ctx.moveTo(rx, ry) : ctx.lineTo(rx, ry);
      }
      ctx.closePath();
      ctx.strokeStyle = `rgba(108,99,255,${0.06 + ring * 0.04})`;
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }

    /* Axes */
    for (let i = 0; i < N; i++) {
      const angle = i * STEP - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(CX, CY);
      ctx.lineTo(CX + R * Math.cos(angle), CY + R * Math.sin(angle));
      ctx.strokeStyle = 'rgba(108,99,255,0.18)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    /* Data polygon */
    ctx.beginPath();
    for (let i = 0; i <= N; i++) {
      const { x, y } = point(i % N, vals[i % N]);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();

    const grad = ctx.createLinearGradient(CX - R, CY - R, CX + R, CY + R);
    grad.addColorStop(0, 'rgba(108,99,255,0.38)');
    grad.addColorStop(1, 'rgba(0,212,255,0.38)');
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.strokeStyle = '#6c63ff';
    ctx.lineWidth = 2.2;
    ctx.stroke();

    /* Vertex dots */
    for (let i = 0; i < N; i++) {
      const { x, y } = point(i, vals[i]);
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#00d4ff';
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,212,255,0.3)';
      ctx.lineWidth = 7;
      ctx.stroke();
    }

    /* Labels */
    ctx.font = `bold 11px 'JetBrains Mono', monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(240,240,245,0.88)';
    for (let i = 0; i < N; i++) {
      const angle = i * STEP - Math.PI / 2;
      const lr = R + 28;
      ctx.fillText(LABELS[i], CX + lr * Math.cos(angle), CY + lr * Math.sin(angle));
    }
  }

  /* Animate into view */
  let drawn = false;
  draw([0, 0, 0, 0, 0, 0]);

  const observer = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting || drawn) return;
    drawn = true;
    const dur = 1300;
    const t0  = performance.now();
    function step(now) {
      const p = Math.min((now - t0) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      draw(TARGETS.map(v => v * e));
      if (p < 1) requestAnimationFrame(step);
      else draw(TARGETS);
    }
    requestAnimationFrame(step);
    observer.disconnect();
  }, { threshold: 0.3 });
  observer.observe(canvas);
})();

/* ═══════════════════════════════════════════════════════════
   3D TILT — project cards follow mouse
═══════════════════════════════════════════════════════════ */
(function initTilt() {
  if (window.innerWidth < 1024) return;

  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      card.style.setProperty('--tilt-rx', `${(-y * 10).toFixed(2)}deg`);
      card.style.setProperty('--tilt-ry', `${(x * 10).toFixed(2)}deg`);
    });
    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--tilt-rx', '0deg');
      card.style.setProperty('--tilt-ry', '0deg');
    });
  });
})();
