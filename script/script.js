'use strict';

// ── TIME CLOCK: "HH:MM:SS (GMT+5:45), Month DD, YYYY" ──
const timeEl = document.getElementById('ktm-time');
const screenMiniTime = document.getElementById('screen-mini-time');

function updateTime() {
  const now = new Date();

  // Time in 24-hr format
  const timeStr = now.toLocaleTimeString('en-US', {
    hour:     '2-digit',
    minute:   '2-digit',
    second:   '2-digit',
    timeZone: 'Asia/Kathmandu',
    hour12:   false,
  });

  // Date format: "September 28, 2026"
  const dateStr = now.toLocaleDateString('en-US', {
    month:    'long',
    day:      'numeric',
    year:     'numeric',
    timeZone: 'Asia/Kathmandu',
  });

  const formatted = `${timeStr} (GMT+5:45), ${dateStr}`;

  if (timeEl) {
    timeEl.textContent = formatted;
  }

  if (screenMiniTime) {
    screenMiniTime.textContent = timeStr.slice(0, 5);
  }
}
updateTime();
setInterval(updateTime, 1000);

// ── FOOTER YEAR ───────────────────────────────────────
const footerYear = document.getElementById('footer-year');
if (footerYear) {
  footerYear.textContent = new Date().getFullYear();
}

// ── TYPEWRITER EFFECT IN HERO SUBTITLE ────────────────
const typewriterEl = document.getElementById('typewriter-text');

if (typewriterEl) {
  const phrases = [
    "sometimes they work on the first try.",
    "sometimes on the fifth.",
    "always learning, always shipping.",
    "crafting clean web applications.",
    "seeking junior roles & internships."
  ];

  let phraseIdx = 0;
  let charIdx   = 0;
  let isDeleting = false;

  function typeTick() {
    const current = phrases[phraseIdx];

    if (isDeleting) {
      typewriterEl.textContent = current.substring(0, charIdx - 1);
      charIdx--;
    } else {
      typewriterEl.textContent = current.substring(0, charIdx + 1);
      charIdx++;
    }

    let speed = isDeleting ? 28 : 60;

    if (!isDeleting && charIdx === current.length) {
      speed = 2000; // Pause at completed phrase
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      speed = 400; // Pause before typing next phrase
    }

    setTimeout(typeTick, speed);
  }

  typeTick();
}

// ── AMBIENT CURSOR GLOW ───────────────────────────────
const cursorGlow = document.getElementById('cursor-glow');

if (cursorGlow && window.matchMedia('(hover: hover)').matches) {
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let curX = mouseX;
  let curY = mouseY;
  let hasMoved = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!hasMoved) {
      cursorGlow.style.opacity = '1';
      hasMoved = true;
    }
  }, { passive: true });

  document.addEventListener('mouseleave', () => {
    cursorGlow.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    if (hasMoved) cursorGlow.style.opacity = '1';
  });

  function renderCursor() {
    curX += (mouseX - curX) * 0.15;
    curY += (mouseY - curY) * 0.15;
    cursorGlow.style.transform = `translate(${curX}px, ${curY}px) translate(-50%, -50%)`;
    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);
}

// ── HERO TITLE INTERACTIVE SPOTLIGHT ILLUMINATION ──
const heroTitleEl  = document.getElementById('hero-title');
const cursorGlowEl = document.getElementById('cursor-glow');

if (heroTitleEl) {
  window.addEventListener('mousemove', (e) => {
    const rect = heroTitleEl.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check proximity to title (120px padding)
    const pad = 120;
    const isNear = (
      e.clientX >= rect.left - pad &&
      e.clientX <= rect.right + pad &&
      e.clientY >= rect.top - pad &&
      e.clientY <= rect.bottom + pad
    );

    if (isNear) {
      heroTitleEl.style.setProperty('--mouse-title-x', `${x}px`);
      heroTitleEl.style.setProperty('--mouse-title-y', `${y}px`);
      heroTitleEl.style.setProperty('--title-glow-opacity', '1');

      if (cursorGlowEl) {
        cursorGlowEl.classList.add('glow-intensified');
      }
    } else {
      heroTitleEl.style.setProperty('--title-glow-opacity', '0');
      if (cursorGlowEl) {
        cursorGlowEl.classList.remove('glow-intensified');
      }
    }
  }, { passive: true });

  document.addEventListener('mouseleave', () => {
    heroTitleEl.style.setProperty('--title-glow-opacity', '0');
    if (cursorGlowEl) {
      cursorGlowEl.classList.remove('glow-intensified');
    }
  });
}

// ── SCROLL EFFECT: HERO NAME MOVES & SHRINKS TO NAVBAR ──
const siteHeader  = document.getElementById('site-header');
const heroTitle   = document.getElementById('hero-title');
const navLogoText = document.getElementById('nav-logo-text');

function handleScrollNameDock() {
  const scrollY = window.scrollY;

  // Header background shadow
  if (siteHeader) {
    siteHeader.classList.toggle('scrolled', scrollY > 24);
  }

  if (heroTitle) {
    // Start transition when scrollY exceeds 90px, complete around 360px
    const startY = 90;
    const endY   = 360;

    if (scrollY <= startY) {
      // Resting at original hero position
      heroTitle.style.transform = 'translate(0, 0) scale(1)';
      heroTitle.style.opacity = '1';
      if (siteHeader) siteHeader.classList.remove('name-docked');
    } else if (scrollY > startY && scrollY < endY) {
      // In-flight progress between 0 and 1
      const progress = (scrollY - startY) / (endY - startY);

      // Hero title slowly moves upward, shifts toward top-left, and shrinks
      const moveUp  = progress * 160;
      const shiftLeft = progress * 40;
      const scaleVal  = 1 - (progress * 0.65); // Scales down gradually

      heroTitle.style.transform = `translate(${-shiftLeft}px, ${-moveUp}px) scale(${scaleVal})`;

      if (progress >= 0.82) {
        // Hand off opacity to navbar
        const fadeRatio = (progress - 0.82) / 0.18;
        heroTitle.style.opacity = `${Math.max(0, 1 - fadeRatio)}`;
        if (siteHeader) siteHeader.classList.add('name-docked');
      } else {
        heroTitle.style.opacity = '1';
        if (siteHeader) siteHeader.classList.remove('name-docked');
      }
    } else {
      // Past endY: fully settled in navbar
      heroTitle.style.opacity = '0';
      heroTitle.style.transform = 'translate(-40px, -160px) scale(0.35)';
      if (siteHeader) siteHeader.classList.add('name-docked');
    }
  }
}

window.addEventListener('scroll', handleScrollNameDock, { passive: true });
handleScrollNameDock();

// ── MAC PROJECT SHOWCASE CONTROLLER ────────────────────
const macTimeEl = document.getElementById('mac-menubar-time');

// Keep the menubar clock ticking (short HH:MM format)
function updateMacTime() {
  if (!macTimeEl) return;
  const now = new Date();
  const h = now.toLocaleString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Kathmandu'
  });
  macTimeEl.textContent = h;
}
updateMacTime();
setInterval(updateMacTime, 30000);

// ── ACADEMIC & MOBILE PROJECTS ACCORDION ──────────────────
// Only one project open at a time; all collapsed by default
function setupAccordion(selector) {
  const items = document.querySelectorAll(selector);
  items.forEach(item => {
    const summary = item.querySelector('summary');
    if (!summary) return;
    summary.addEventListener('click', () => {
      // If this item is currently closed, close all others in this group first
      if (!item.open) {
        items.forEach(other => {
          if (other !== item && other.open) {
            other.open = false;
          }
        });
      }
    });
  });
}

setupAccordion('.academic-project-item');
setupAccordion('.mobile-project-item');


// ── SCROLL REVEAL ─────────────────────────────────────
const revealEls = document.querySelectorAll(
  '.section-inner, .about-stats, .macbook-wrapper, .mobile-projects-wrapper, .contact-cta-link, .contact-links-grid'
);

revealEls.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
);

revealEls.forEach(el => revealObserver.observe(el));

// ── AMBIENT WINDBLOWN / FALLING PARTICLES SIMULATION ──
(function initAmbientParticles() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let dpr = 1;
  let animId = null;
  let lastTime = 0;
  let windBoost = 0;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
  }

  window.addEventListener('resize', resize, { passive: true });
  resize();

  // Reduced particle count by an additional 40% (only 9 on desktop, 4 on mobile)
  const particleCount = width < 768 ? 4 : 9;
  const particles = [];
  const macbookEl = document.querySelector('.macbook-wrapper');

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 0.5 + 0.8, // 0.8px to 1.3px (subtle, non-bright)
      vy: Math.random() * 0.45 + 0.3, // Gentle drift
      vx: (Math.random() - 0.25) * 0.3,
      swayAmp: Math.random() * 0.5 + 0.3,
      swayFreq: Math.random() * 0.01 + 0.005,
      phase: Math.random() * Math.PI * 2,
      alpha: Math.random() * 0.16 + 0.2, // Low opacity to keep dark atmosphere intact
      isAccent: Math.random() < 0.25 // Subtle mint tint
    });
  }

  // Wind gust on mousemove or scroll
  window.addEventListener('mousemove', (e) => {
    windBoost = Math.max(windBoost, Math.min(0.8, Math.abs(e.movementX || 0) * 0.025));
  }, { passive: true });

  window.addEventListener('scroll', () => {
    windBoost = Math.max(windBoost, 0.5);
  }, { passive: true });

  function render(time) {
    if (!lastTime) lastTime = time;
    const dt = Math.min(32, time - lastTime);
    lastTime = time;

    // Decay wind gust smoothly back to 0
    windBoost *= 0.96;

    // Base wind oscillation (subtle breeze swaying across the page)
    const baseWind = Math.sin(time * 0.0006) * 0.4 + 0.25 + windBoost;

    ctx.clearRect(0, 0, width, height);

    // Get live bounding rect of emulated Mac so particles never render over it
    const macRect = macbookEl ? macbookEl.getBoundingClientRect() : null;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      p.phase += p.swayFreq;
      const sway = Math.sin(p.phase) * p.swayAmp;

      // Update positions
      p.x += (p.vx + baseWind + sway) * (dt / 16);
      p.y += p.vy * (dt / 16);

      // Boundaries & wrap-around
      if (p.y > height + 8) {
        p.y = -6;
        p.x = Math.random() * width;
      }
      if (p.x > width + 10) {
        p.x = -6;
        p.y = Math.random() * height;
      } else if (p.x < -10) {
        p.x = width + 6;
      }

      // Check if particle overlaps with emulated Mac screen/body - skip if so
      if (
        macRect &&
        p.x >= macRect.left - 4 &&
        p.x <= macRect.right + 4 &&
        p.y >= macRect.top - 4 &&
        p.y <= macRect.bottom + 4
      ) {
        continue;
      }

      // Draw subtle particle without bloom to preserve pure dark background
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      if (p.isAccent) {
        ctx.fillStyle = `rgba(184, 255, 87, ${p.alpha * 0.8})`;
      } else {
        ctx.fillStyle = `rgba(220, 225, 240, ${p.alpha})`;
      }
      ctx.fill();
    }

    animId = requestAnimationFrame(render);
  }

  animId = requestAnimationFrame(render);

  // Pause when tab is hidden to save 100% of battery/resources
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (animId) cancelAnimationFrame(animId);
      animId = null;
    } else {
      lastTime = 0;
      if (!animId) animId = requestAnimationFrame(render);
    }
  });
})();
