document.getElementById('year').textContent = new Date().getFullYear();

// ---------- Build progress meter + ambient orb parallax (scroll-reactive depth) ----------
const buildMeterFill = document.getElementById('buildMeterFill');
const buildMeterLabel = document.getElementById('buildMeterLabel');
const orb1 = document.getElementById('orb1');
const orb2 = document.getElementById('orb2');

function updateScrollEffects() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? Math.max(0, Math.min(1, scrollTop / docHeight)) : 0;

  buildMeterFill.style.height = (progress * 100) + '%';
  buildMeterLabel.textContent = String(Math.round(progress * 100)).padStart(2, '0') + '%';

  // orbs drift at different speeds as you scroll, layering depth into the page
  orb1.style.setProperty('--parallax', (scrollTop * 0.12) + 'px');
  orb2.style.setProperty('--parallax', (scrollTop * -0.08) + 'px');
}
window.addEventListener('scroll', updateScrollEffects, { passive: true });
window.addEventListener('resize', updateScrollEffects);
updateScrollEffects();

// ---------- Hero 3D phone tilt (smoothed with lerp + rAF for a buttery feel) ----------
const hero3d = document.getElementById('hero3d');
const phone3d = document.getElementById('phone3d');

let targetRotateX = 0, targetRotateY = 0;
let currentRotateX = 0, currentRotateY = 0;
let targetScale = 1, currentScale = 1;
const TILT_SMOOTHING = 0.09; // lower = floatier/smoother, higher = snappier

function tiltLoop() {
  currentRotateX += (targetRotateX - currentRotateX) * TILT_SMOOTHING;
  currentRotateY += (targetRotateY - currentRotateY) * TILT_SMOOTHING;
  currentScale += (targetScale - currentScale) * TILT_SMOOTHING;
  phone3d.style.transform =
    `rotateY(${currentRotateY.toFixed(2)}deg) rotateX(${currentRotateX.toFixed(2)}deg) scale(${currentScale.toFixed(3)}) translateZ(0)`;

  // shadow drifts opposite the tilt direction, like light is fixed and the phone is moving under it
  const shadowX = (-currentRotateY * 1.1).toFixed(1);
  const shadowY = (currentRotateX * 1.1 + 36).toFixed(1);
  document.querySelector('.phone-frame').style.boxShadow =
    `${shadowX}px ${shadowY}px 90px -25px rgba(0,0,0,0.7), 0 0 70px -10px var(--violet-glow), inset 0 0 0 2px #1a1828`;

  requestAnimationFrame(tiltLoop);
}
requestAnimationFrame(tiltLoop);

if (window.matchMedia('(pointer: fine)').matches) {
  hero3d.addEventListener('mousemove', (e) => {
    const rect = hero3d.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    targetRotateY = x * 26;
    targetRotateX = y * -18;
    targetScale = 1.04;
  });
  hero3d.addEventListener('mouseleave', () => {
    targetRotateX = 0;
    targetRotateY = 0;
    targetScale = 1;
  });
} else {
  // gentle ambient float on touch devices — drives the same smoothed target
  let t = 0;
  setInterval(() => {
    t += 0.045;
    targetRotateY = Math.sin(t) * 10;
    targetRotateX = Math.cos(t * 0.8) * 6;
  }, 16);
}

// ---------- Hero phone screen carousel (auto-rotates through SafeStick / TicTic / Expense Tracker) ----------
const appScreens = document.querySelectorAll('.app-screen');
const phoneDots = document.querySelectorAll('.phone-dot');
let currentScreen = 0;
let screenInterval;

function showScreen(idx) {
  appScreens.forEach(s => s.classList.remove('active'));
  phoneDots.forEach(d => d.classList.remove('active'));
  appScreens[idx].classList.add('active');
  phoneDots[idx].classList.add('active');
  currentScreen = idx;
}

function startScreenRotation() {
  screenInterval = setInterval(() => {
    showScreen((currentScreen + 1) % appScreens.length);
  }, 4000);
}
startScreenRotation();

phoneDots.forEach((dot, idx) => {
  dot.addEventListener('click', () => {
    clearInterval(screenInterval);
    showScreen(idx);
    startScreenRotation();
  });
});

// ---------- Project data ----------
const projects = [
  {
    name: 'SafeStick App',
    platform: 'Android · IoT',
    desc: 'An Android accessibility solution for visually impaired users — integrating Bluetooth IoT hardware, real-time speech recognition, obstacle alerts, and an emergency SOS service.',
    tags: ['Android', 'Bluetooth IoT', 'Speech Recognition', 'Accessibility'],
    repo: 'https://github.com/25it063-cpu/SafeStickApp.git' // paste your GitHub repo URL here, e.g. 'https://github.com/yourname/safestick'
  },
  {
    name: 'TicTic App',
    platform: 'Android',
    desc: 'A modern Android time management app combining a clock, stopwatch, and timer into one clean, fast interface.',
    tags: ['Android', 'Kotlin', 'UI/UX'],
    repo: 'https://github.com/25it063-cpu/TicTic.git'
  },
  {
    name: 'Expense Tracker',
    platform: 'Android',
    desc: 'A straightforward expense tracker for managing income, spending, and personal finances at a glance.',
    tags: ['Android', 'Personal Finance', 'Data Persistence'],
    repo: 'https://github.com/25it063-cpu/ExpenseTracker.git'
  },
  {
    name: 'Recipe Finder App',
    platform: 'Android',
    desc: 'A recipe browsing app with search and favoriting, built to make finding your next meal effortless.',
    tags: ['Android', 'Search', 'Local Storage'],
    repo: 'https://github.com/25it063-cpu/RecipeFinder.git'
  },
  {
    name: 'Todo App',
    platform: 'Android',
    desc: 'A simple, intuitive to-do app for adding, updating, and tracking daily tasks without friction.',
    tags: ['Android', 'Task Management', 'CRUD'],
    repo: 'https://github.com/25it063-cpu/ToDoApp.git'
  },
  {
    name: 'Responsive Landing Page',
    platform: 'Web',
    desc: 'A fully responsive e-commerce landing page showcasing products through a modern, conversion-focused UI.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Responsive'],
    repo: 'https://github.com/25it063-cpu/Codsoft_internship.git',
    live: 'https://codsoft-internship-gepk.vercel.app/' // paste your deployed site URL here if it's live, e.g. on Vercel
  },
  {
    name: 'College Website + Login',
    platform: 'Web',
    desc: 'A responsive multi-page college website featuring full site navigation and a secure user login interface.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Authentication'],
    repo: 'https://github.com/25it063-cpu/CAMS.git',
    live: 'https://cams-henna.vercel.app/'
  }
];

const nodesContainer = document.getElementById('timelineNodes');

projects.forEach((p, i) => {
  const node = document.createElement('div');
  node.className = 't-node reveal';
  const num = `#${String(i + 1).padStart(3, '0')}`;

  let linksHtml = '';
  if (p.repo) {
    linksHtml += `<a href="${p.repo}" target="_blank" rel="noopener" class="t-link" onclick="event.stopPropagation()">View Code →</a>`;
  }
  if (p.live) {
    linksHtml += `<a href="${p.live}" target="_blank" rel="noopener" class="t-link t-link-live" onclick="event.stopPropagation()">Live Site →</a>`;
  }
  if (!p.repo && !p.live) {
    linksHtml = `<span class="t-link t-link-soon">Repo coming soon</span>`;
  }

  node.innerHTML = `
    <div class="t-dot"></div>
    <div class="t-card" tabindex="0">
      <div class="t-head">
        <div class="t-head-left">
          <span class="t-index">${num}</span>
          <span class="t-name">${p.name}</span>
        </div>
        <div style="display:flex; align-items:center; gap:14px;">
          <span class="t-platform">${p.platform}</span>
          <svg class="t-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
      <div class="t-body">
        <div class="t-body-inner">
          <p class="t-desc">${p.desc}</p>
          <div class="t-tags">
            ${p.tags.map(t => `<span class="t-tag">${t}</span>`).join('')}
          </div>
          <div class="t-links">${linksHtml}</div>
        </div>
      </div>
    </div>
  `;
  nodesContainer.appendChild(node);

  // Hover-to-expand on devices with a real pointer; tap-to-toggle as a fallback on touch
  const cardEl = node.querySelector('.t-card');
  const isTouch = !window.matchMedia('(pointer: fine)').matches;

  if (isTouch) {
    cardEl.addEventListener('click', () => {
      const isOpen = node.classList.contains('open');
      document.querySelectorAll('.t-node.open').forEach(openNode => {
        if (openNode !== node) openNode.classList.remove('open');
      });
      node.classList.toggle('open', !isOpen);
    });
  } else {
    node.addEventListener('mouseenter', () => node.classList.add('open'));
    node.addEventListener('mouseleave', () => node.classList.remove('open'));
    cardEl.addEventListener('focus', () => node.classList.add('open'));
    cardEl.addEventListener('blur', () => node.classList.remove('open'));
  }
});

// ---------- Timeline scroll fill ----------
const timeline = document.getElementById('timeline');
const timelineFill = document.getElementById('timelineFill');

function updateTimelineFill() {
  const rect = timeline.getBoundingClientRect();
  const viewportH = window.innerHeight;
  const total = rect.height;
  let progress = (viewportH * 0.75 - rect.top) / total;
  progress = Math.max(0, Math.min(1, progress));
  timelineFill.style.height = (progress * 100) + '%';
}
window.addEventListener('scroll', updateTimelineFill, { passive: true });
window.addEventListener('resize', updateTimelineFill);
updateTimelineFill();

// ---------- Scroll reveal (handles both fade-up reveals and depth-layer stacking) ----------
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal, .depth-layer').forEach(el => observer.observe(el));

// ---------- Contact form — sends to mirdhulasree7@gmail.com via Formspree ----------
document.getElementById('contactForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const form = this;
  const status = document.getElementById('formStatus');
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const message = document.getElementById('message').value;

  status.textContent = 'Sending...';

  fetch('https://formspree.io/f/mirdhulasree78@gmail.com', {
    method: 'POST',
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, message, _subject: `Portfolio message from ${name}` })
  })
    .then((res) => {
      if (res.ok) {
        status.textContent = "✓ Message sent — I'll get back to you soon.";
        form.reset();
      } else {
        status.textContent = "Hmm, that didn't go through. Try emailing me directly instead.";
      }
    })
    .catch(() => {
      status.textContent = "Hmm, that didn't go through. Try emailing me directly instead.";
    });
});