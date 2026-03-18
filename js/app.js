// ============================================
// APP.JS — Core Application Logic
// ============================================

(function() {
  'use strict';

  // --- Firebase Configuration ---
  const firebaseConfig = {
    apiKey: "AIzaSyCf-0TpYlOrxFIG4wtNkFY60cYp5di75SE",
    authDomain: "tamal-s-website-485ba.firebaseapp.com",
    projectId: "tamal-s-website-485ba",
    storageBucket: "tamal-s-website-485ba.firebasestorage.app",
    messagingSenderId: "645082102583",
    appId: "1:645082102583:web:867e61b45fe001d00cf8b2",
    measurementId: "G-0BRQF1V64M"
  };
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();

  // --- Data Manager (Firebase Sync) ---
  const DataManager = {
    cache: null,

    async init() {
      try {
        const docRef = db.collection('portfolio').doc('data');
        const docSnap = await docRef.get();
        if (docSnap.exists) {
          this.cache = docSnap.data();
        } else {
          this.cache = this.getDefaults();
          await docRef.set(this.cache); // initialize new database
        }
      } catch (err) {
        console.error("Firebase initialization failed:", err);
        this.cache = this.getDefaults();
      }
    },

    getDefaults() {
      return {
        profile: DEFAULT_PROFILE, projects: DEFAULT_PROJECTS, publications: DEFAULT_PUBLICATIONS,
        certifications: DEFAULT_CERTIFICATIONS, education: DEFAULT_EDUCATION,
        experience: DEFAULT_EXPERIENCE, skills: DEFAULT_SKILLS
      };
    },

    get(key, defaultVal) {
      if (!this.cache) return defaultVal;
      return this.cache[key] || defaultVal;
    },

    async set(key, val) {
      this.cache[key] = val;
      await db.collection('portfolio').doc('data').set({ [key]: val }, { merge: true });
    },

    async remove(key) {
      delete this.cache[key];
      await db.collection('portfolio').doc('data').update({ [key]: firebase.firestore.FieldValue.delete() });
    },

    getProfile() { return this.get('profile', DEFAULT_PROFILE); },
    getProjects() { return this.get('projects', DEFAULT_PROJECTS); },
    getPublications() { return this.get('publications', DEFAULT_PUBLICATIONS); },
    getCertifications() { return this.get('certifications', DEFAULT_CERTIFICATIONS); },
    getEducation() { return this.get('education', DEFAULT_EDUCATION); },
    getExperience() { return this.get('experience', DEFAULT_EXPERIENCE); },
    getSkills() { return this.get('skills', DEFAULT_SKILLS); },

    exportAll() { return this.cache; },
    
    async importAll(data) {
      const allowedKeys = ['profile','projects','publications','certifications','education','experience','skills'];
      this.cache = { ...this.cache };
      allowedKeys.forEach(k => { if (data[k]) this.cache[k] = data[k]; });
      await db.collection('portfolio').doc('data').set(this.cache);
    },
    
    async resetAll() {
      this.cache = this.getDefaults();
      await db.collection('portfolio').doc('data').set(this.cache);
    }
  };
  window.DataManager = DataManager;

  // --- Theme ---
  const themeToggle = document.getElementById('themeToggle');
  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio_theme', theme);
    themeToggle.textContent = theme === 'dark' ? '🌙' : '☀️';
  }
  setTheme(localStorage.getItem('portfolio_theme') || 'dark');
  themeToggle.addEventListener('click', () => {
    setTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });

  // --- Clock ---
  function updateClock() {
    const now = new Date();
    document.getElementById('clockTime').textContent = now.toLocaleTimeString('en-US', { hour12: true });
    document.getElementById('clockDate').textContent = now.toLocaleDateString('en-US', 
      { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  }
  updateClock();
  setInterval(updateClock, 1000);

  // --- Navbar scroll ---
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  // --- Hamburger ---
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => { hamburger.classList.remove('active'); navLinks.classList.remove('open'); });
  });

  // --- Active nav link ---
  const sections = document.querySelectorAll('.section, .hero');
  const navAnchors = navLinks.querySelectorAll('a');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 200) current = s.getAttribute('id'); });
    navAnchors.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  });

  // --- Typing Animation ---
  const typingPhrases = [
    "Specializing in NLP & Transformer architectures",
    "Building RAG pipelines with LangChain & LangGraph",
    "Fine-tuning LLMs for real-world applications",
    "Developing Computer Vision solutions with YOLO & ViT",
    "Passionate about AI research & innovation"
  ];
  let phraseIndex = 0, charIndex = 0, isDeleting = false;
  const typingEl = document.getElementById('typingText');
  function typeEffect() {
    const phrase = typingPhrases[phraseIndex];
    typingEl.textContent = phrase.substring(0, charIndex);
    if (!isDeleting) {
      charIndex++;
      if (charIndex > phrase.length) { isDeleting = true; setTimeout(typeEffect, 2000); return; }
    } else {
      charIndex--;
      if (charIndex === 0) { isDeleting = false; phraseIndex = (phraseIndex + 1) % typingPhrases.length; }
    }
    setTimeout(typeEffect, isDeleting ? 30 : 60);
  }
  typeEffect();

  // --- Particles ---
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.radius = Math.random() * 2 + 0.5;
      this.opacity = Math.random() * 0.5 + 0.1;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 212, 255, ${this.opacity})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 80; i++) particles.push(new Particle());

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 212, 255, ${0.1 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  // --- Scroll Reveal ---
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // --- Render Functions ---
  function renderProfile() {
    const p = DataManager.getProfile();
    document.getElementById('heroName').textContent = p.name;
    document.getElementById('heroTitle').textContent = p.title;
    document.getElementById('aboutName').textContent = p.name;
    document.getElementById('aboutBio').textContent = p.bio;
    document.getElementById('aboutLocation').textContent = p.location;
    document.getElementById('aboutEmail').textContent = p.email;
    const photoEl = document.getElementById('profilePhoto');
    if (p.profileImage) {
      photoEl.innerHTML = `<img src="${p.profileImage}" alt="${p.name}">`;
    } else {
      photoEl.innerHTML = '👨‍💻';
    }
  }

  function renderSkills() {
    const skills = DataManager.getSkills();
    const grid = document.getElementById('skillsGrid');
    grid.innerHTML = skills.map(cat => `
      <div class="skill-card reveal">
        <div class="skill-card-header">
          <span class="skill-card-icon">${cat.icon}</span>
          <span class="skill-card-title">${cat.category}</span>
        </div>
        ${cat.items.map(s => `
          <div class="skill-item">
            <div class="skill-item-header">
              <span class="skill-name">${s.name}</span>
              <span class="skill-level">${s.level}%</span>
            </div>
            <div class="skill-bar"><div class="skill-bar-fill" data-width="${s.level}"></div></div>
          </div>
        `).join('')}
      </div>
    `).join('');
    // Re-observe reveals
    grid.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    // Animate skill bars on scroll
    const barObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
            bar.style.width = bar.dataset.width + '%';
          });
        }
      });
    }, { threshold: 0.3 });
    grid.querySelectorAll('.skill-card').forEach(el => barObserver.observe(el));
  }

  function renderExperience() {
    const exp = DataManager.getExperience();
    const tl = document.getElementById('experienceTimeline');
    tl.innerHTML = exp.map(e => `
      <div class="timeline-item reveal">
        <div class="timeline-dot"></div>
        <div class="timeline-content">
          <div class="timeline-role">${e.role}</div>
          <div class="timeline-company">${e.company}</div>
          <div class="timeline-period">📅 ${e.period} · 📍 ${e.location}</div>
          <ul class="timeline-highlights">
            ${e.highlights.map(h => `<li>${h}</li>`).join('')}
          </ul>
        </div>
      </div>
    `).join('');
    tl.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  function renderProjects() {
    const projects = DataManager.getProjects();
    const grid = document.getElementById('projectsGrid');
    // Collect all unique techs for filters
    const allTech = new Set();
    projects.forEach(p => p.tech.forEach(t => allTech.add(t)));
    const filtersEl = document.getElementById('projectFilters');
    filtersEl.innerHTML = `<button class="filter-btn active" data-filter="all">All</button>` +
      [...allTech].slice(0, 8).map(t => `<button class="filter-btn" data-filter="${t}">${t}</button>`).join('');

    function showProjects(filter) {
      const filtered = filter === 'all' ? projects : projects.filter(p => p.tech.includes(filter));
      grid.innerHTML = filtered.map(p => `
        <div class="project-card reveal" data-tech='${JSON.stringify(p.tech)}'>
          <div class="project-image">
            ${p.image ? `<img src="${p.image}" alt="${p.name}">` : `<span class="placeholder-icon">🧠</span>`}
          </div>
          <div class="project-body">
            <h3 class="project-name">${p.name}</h3>
            <p class="project-desc">${p.description.substring(0, 180)}${p.description.length > 180 ? '...' : ''}</p>
            <div class="project-tech">${p.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}</div>
            <div class="project-links">
              ${p.github ? `<a href="${p.github}" target="_blank" class="project-link">⚡ GitHub</a>` : ''}
              ${p.demo ? `<a href="${p.demo}" target="_blank" class="project-link">🌐 Demo</a>` : ''}
              <button class="ai-insight-btn" onclick="getAIInsight('${p.id || p.name}')">✨ AI Insight</button>
            </div>
            <div class="ai-insight-result" id="insight-${p.id || p.name.replace(/\s/g,'-')}"></div>
          </div>
        </div>
      `).join('');
      grid.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    }

    showProjects('all');
    filtersEl.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        filtersEl.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        showProjects(btn.dataset.filter);
      });
    });
  }

  function renderPublications() {
    const pubs = DataManager.getPublications();
    const container = document.getElementById('publicationsContainer');
    container.innerHTML = pubs.map(p => `
      <div class="pub-card reveal">
        ${p.status ? `<span class="pub-status">${p.status}</span>` : ''}
        <div class="pub-title">${p.title}</div>
        <div class="pub-authors">${p.authors}</div>
        <div class="pub-venue">${p.venue} · ${p.year}</div>
        <p class="pub-desc">${p.description}</p>
        ${p.link ? `<a href="${p.link}" target="_blank" style="display:inline-block;margin-top:10px;" class="project-link">📄 View Paper</a>` : ''}
      </div>
    `).join('');
    container.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  function renderCertifications() {
    const certs = DataManager.getCertifications();
    const grid = document.getElementById('certsGrid');
    grid.innerHTML = certs.map(c => `
      <div class="cert-card reveal">
        <div class="cert-year">${c.year}</div>
        <div class="cert-title">${c.title}</div>
        <div class="cert-issuer">${c.issuer}</div>
        <p class="cert-desc">${c.description}</p>
        ${c.link ? `<a href="${c.link}" target="_blank" style="display:inline-block;margin-top:10px;font-size:0.85rem;">View Certificate →</a>` : ''}
      </div>
    `).join('');
    grid.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  function renderEducation() {
    const edu = DataManager.getEducation();
    const container = document.getElementById('educationContainer');
    container.innerHTML = edu.map(e => `
      <div class="edu-card reveal">
        <div class="edu-icon">🎓</div>
        <div class="edu-degree">${e.degree}</div>
        <div class="edu-institution">${e.institution}</div>
        <div class="edu-period">${e.period} · ${e.location}</div>
        <div class="edu-cgpa">CGPA: ${e.cgpa}</div>
      </div>
    `).join('');
    container.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  function renderContact() {
    const p = DataManager.getProfile();
    const grid = document.getElementById('contactGrid');
    grid.innerHTML = `
      <a href="mailto:${p.email}" class="contact-card reveal">
        <span class="contact-icon">📧</span>
        <div><div class="contact-label">Email</div><div class="contact-value">${p.email}</div></div>
      </a>
      <a href="tel:${p.phone}" class="contact-card reveal">
        <span class="contact-icon">📱</span>
        <div><div class="contact-label">Phone</div><div class="contact-value">${p.phone}</div></div>
      </a>
      <a href="${p.github}" target="_blank" class="contact-card reveal">
        <span class="contact-icon">💻</span>
        <div><div class="contact-label">GitHub</div><div class="contact-value">${p.github.replace('https://github.com/','')}</div></div>
      </a>
      ${p.linkedin && p.linkedin !== '#' ? `
      <a href="${p.linkedin}" target="_blank" class="contact-card reveal">
        <span class="contact-icon">🔗</span>
        <div><div class="contact-label">LinkedIn</div><div class="contact-value">LinkedIn Profile</div></div>
      </a>` : ''}
      <div class="contact-card reveal">
        <span class="contact-icon">📍</span>
        <div><div class="contact-label">Location</div><div class="contact-value">${p.location}</div></div>
      </div>
    `;
    grid.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  // --- Render All ---
  window.renderAll = function() {
    renderProfile(); renderSkills(); renderExperience();
    renderProjects(); renderPublications();
    renderCertifications(); renderEducation(); renderContact();
    // Update project count stat
    const projects = DataManager.getProjects();
    document.getElementById('statProjects').textContent = projects.length + '+';
  };
  // --- Initialize App ---
  DataManager.init().then(() => {
    // Reveal main app container + remove loading spinner if we had one
    renderAll();
  });

})();
