// ============================================
// ADMIN.JS — Admin Panel Logic (Firebase enabled)
// ============================================

(function() {
  'use strict';

  const adminModal = document.getElementById('adminModal');
  const adminLoginView = document.getElementById('adminLoginView');
  const adminDashboard = document.getElementById('adminDashboard');
  let isLoggedIn = false;

  // --- SHA-256 helper ---
  async function sha256(str) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // --- Safe saving handler (now Async for Firebase) ---
  async function safeSave(key, data) {
    try {
      await DataManager.set(key, data);
      return true;
    } catch (e) {
      if (e.message && e.message.includes('permission')) {
        alert('Permission denied. Make sure you are logged in or database rules allow writes.');
      } else {
        alert('Error saving to cloud: ' + e.message);
      }
      return false;
    }
  }

  // --- Compress image to reduce storage usage ---
  function compressImage(dataUrl, maxWidth, quality) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let w = img.width, h = img.height;
        if (w > maxWidth) { h = (maxWidth / w) * h; w = maxWidth; }
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', quality || 0.7));
      };
      img.src = dataUrl;
    });
  }

  // --- Open/Close Admin ---
  document.getElementById('adminToggle').addEventListener('click', () => {
    adminModal.classList.add('open');
    if (isLoggedIn) { adminLoginView.style.display = 'none'; adminDashboard.style.display = 'block'; }
    else { adminLoginView.style.display = ''; adminDashboard.style.display = 'none'; }
  });
  document.getElementById('adminClose').addEventListener('click', () => adminModal.classList.remove('open'));

  // --- Login ---
  document.getElementById('adminLoginBtn').addEventListener('click', async () => {
    const pwd = document.getElementById('adminPassword').value;
    const hash = await sha256(pwd);
    if (hash === ADMIN_PASSWORD_HASH) {
      isLoggedIn = true;
      adminLoginView.style.display = 'none';
      adminDashboard.style.display = 'block';
      document.getElementById('adminLoginError').style.display = 'none';
      loadAdminData();
    } else {
      document.getElementById('adminLoginError').style.display = 'block';
    }
  });
  document.getElementById('adminPassword').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') document.getElementById('adminLoginBtn').click();
  });

  // --- Tabs ---
  document.querySelectorAll('.admin-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.admin-panel-content').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
    });
  });

  // --- Load admin data ---
  function loadAdminData() {
    const p = DataManager.getProfile();
    document.getElementById('adminName').value = p.name || '';
    document.getElementById('adminTitle').value = p.title || '';
    document.getElementById('adminTagline').value = p.tagline || '';
    document.getElementById('adminBio').value = p.bio || '';
    document.getElementById('adminEmail').value = p.email || '';
    document.getElementById('adminPhone').value = p.phone || '';
    document.getElementById('adminLocation').value = p.location || '';
    document.getElementById('adminGithub').value = p.github || '';
    document.getElementById('adminLinkedin').value = p.linkedin || '';
    renderAdminProjects();
    renderAdminPubs();
    // Load API key
    document.getElementById('adminApiKey').value = AI_CONFIG.apiKey;
  }

  // --- Save API Key ---
  document.getElementById('saveApiKey').addEventListener('click', async () => {
    const key = document.getElementById('adminApiKey').value.trim();
    document.getElementById('saveApiKey').textContent = 'Saving...';
    if (await safeSave('apiKey', key)) {
      alert(key ? 'API key saved to cloud! AI features active across all devices.' : 'API key cleared.');
    }
    document.getElementById('saveApiKey').textContent = '🔑 Save API Key';
  });

  // --- Save Profile ---
  document.getElementById('saveProfile').addEventListener('click', async () => {
    document.getElementById('saveProfile').textContent = 'Saving...';
    const p = DataManager.getProfile();
    p.name = document.getElementById('adminName').value;
    p.title = document.getElementById('adminTitle').value;
    p.tagline = document.getElementById('adminTagline').value;
    p.bio = document.getElementById('adminBio').value;
    p.email = document.getElementById('adminEmail').value;
    p.phone = document.getElementById('adminPhone').value;
    p.location = document.getElementById('adminLocation').value;
    p.github = document.getElementById('adminGithub').value;
    p.linkedin = document.getElementById('adminLinkedin').value;
    if (await safeSave('profile', p)) {
      renderAll();
      alert('Profile saved to cloud!');
    }
    document.getElementById('saveProfile').textContent = '💾 Save Profile';
  });

  // --- Photo Upload & Remove ---
  document.getElementById('adminPhotoUpload').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const compressed = await compressImage(ev.target.result, 400, 0.8);
        const p = DataManager.getProfile();
        p.profileImage = compressed;
        if (await safeSave('profile', p)) {
          renderAll();
          alert('Photo updated and saved to cloud!');
        }
      } catch (err) {
        alert('Error processing image: ' + err.message);
      }
    };
    reader.readAsDataURL(file);
  });

  document.getElementById('removePhoto').addEventListener('click', async () => {
    const p = DataManager.getProfile();
    p.profileImage = '';
    if (await safeSave('profile', p)) {
      renderAll();
      alert('Photo removed from cloud!');
    }
  });

  // --- Projects CRUD ---
  function renderAdminProjects() {
    const projects = DataManager.getProjects();
    const list = document.getElementById('adminProjectsList');
    list.innerHTML = projects.length === 0 ? '<p style="color:var(--text-muted);font-size:0.9rem;">No projects yet.</p>' :
      projects.map((p, i) => `
      <div class="admin-item">
        <span class="admin-item-title">${p.name}</span>
        <div class="admin-item-actions" style="display:flex;gap:5px;">
          ${i > 0 ? `<button class="btn-sm" data-move-proj-up="${i}">⬆️</button>` : ''}
          ${i < projects.length - 1 ? `<button class="btn-sm" data-move-proj-down="${i}">⬇️</button>` : ''}
          <button class="btn-sm btn-danger" data-delete-project="${i}">🗑️ Delete</button>
        </div>
      </div>
    `).join('');

    // Attach handlers
    list.querySelectorAll('[data-delete-project]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const idx = parseInt(btn.dataset.deleteProject);
        const projects = DataManager.getProjects();
        projects.splice(idx, 1);
        await safeSave('projects', projects);
        renderAdminProjects();
        renderAll();
      });
    });

    list.querySelectorAll('[data-move-proj-up]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const idx = parseInt(btn.dataset.moveProjUp);
        const projects = DataManager.getProjects();
        [projects[idx - 1], projects[idx]] = [projects[idx], projects[idx - 1]];
        await safeSave('projects', projects);
        renderAdminProjects();
        renderAll();
      });
    });

    list.querySelectorAll('[data-move-proj-down]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const idx = parseInt(btn.dataset.moveProjDown);
        const projects = DataManager.getProjects();
        [projects[idx], projects[idx + 1]] = [projects[idx + 1], projects[idx]];
        await safeSave('projects', projects);
        renderAdminProjects();
        renderAll();
      });
    });
  }

  document.getElementById('addProject').addEventListener('click', async () => {
    const name = document.getElementById('newProjName').value.trim();
    const desc = document.getElementById('newProjDesc').value.trim();
    
    if (!name || !desc) { alert('Name and description are required'); return; }
    
    document.getElementById('addProject').textContent = 'Saving...';
    
    const techStr = document.getElementById('newProjTech').value;
    const tech = techStr.split(',').map(t => t.trim()).filter(Boolean);
    const github = document.getElementById('newProjGithub').value.trim();
    const demo = document.getElementById('newProjDemo').value.trim();

    const proj = { id: 'proj_' + Date.now(), name, description: desc, tech, github, demo, image: '' };

    // Handle image
    const fileInput = document.getElementById('newProjImage');
    if (fileInput.files[0]) {
      try {
        const dataUrl = await readFileAsDataURL(fileInput.files[0]);
        proj.image = await compressImage(dataUrl, 600, 0.7);
      } catch (err) {
        alert('Error processing image, project will be saved without image.');
      }
    }

    const projects = DataManager.getProjects();
    projects.push(proj);
    if (await safeSave('projects', projects)) {
      renderAdminProjects();
      renderAll();
      // Clear form
      ['newProjName','newProjDesc','newProjTech','newProjGithub','newProjDemo'].forEach(id => document.getElementById(id).value = '');
      document.getElementById('newProjImage').value = '';
      alert('Project added to cloud!');
    }
    document.getElementById('addProject').textContent = '➕ Add Project';
  });

  function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (ev) => resolve(ev.target.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // --- Publications CRUD ---
  function renderAdminPubs() {
    const pubs = DataManager.getPublications();
    const list = document.getElementById('adminPubsList');
    list.innerHTML = pubs.length === 0 ? '<p style="color:var(--text-muted);font-size:0.9rem;">No publications yet.</p>' :
      pubs.map((p, i) => `
      <div class="admin-item">
        <span class="admin-item-title">${p.title.substring(0, 60)}${p.title.length > 60 ? '...' : ''}</span>
        <div class="admin-item-actions" style="display:flex;gap:5px;">
          ${i > 0 ? `<button class="btn-sm" data-move-pub-up="${i}">⬆️</button>` : ''}
          ${i < pubs.length - 1 ? `<button class="btn-sm" data-move-pub-down="${i}">⬇️</button>` : ''}
          <button class="btn-sm btn-danger" data-delete-pub="${i}">🗑️ Delete</button>
        </div>
      </div>
    `).join('');

    // Attach handlers
    list.querySelectorAll('[data-delete-pub]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const idx = parseInt(btn.dataset.deletePub);
        const pubs = DataManager.getPublications();
        pubs.splice(idx, 1);
        await safeSave('publications', pubs);
        renderAdminPubs();
        renderAll();
      });
    });

    list.querySelectorAll('[data-move-pub-up]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const idx = parseInt(btn.dataset.movePubUp);
        const pubs = DataManager.getPublications();
        [pubs[idx - 1], pubs[idx]] = [pubs[idx], pubs[idx - 1]];
        await safeSave('publications', pubs);
        renderAdminPubs();
        renderAll();
      });
    });

    list.querySelectorAll('[data-move-pub-down]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const idx = parseInt(btn.dataset.movePubDown);
        const pubs = DataManager.getPublications();
        [pubs[idx], pubs[idx + 1]] = [pubs[idx + 1], pubs[idx]];
        await safeSave('publications', pubs);
        renderAdminPubs();
        renderAll();
      });
    });
  }

  document.getElementById('addPub').addEventListener('click', async () => {
    const title = document.getElementById('newPubTitle').value.trim();
    const authors = document.getElementById('newPubAuthors').value.trim();
    if (!title || !authors) { alert('Title and authors are required'); return; }
    
    document.getElementById('addPub').textContent = 'Saving...';
    
    const pub = {
      id: 'pub_' + Date.now(),
      title,
      authors,
      venue: document.getElementById('newPubVenue').value.trim(),
      year: document.getElementById('newPubYear').value.trim(),
      description: document.getElementById('newPubDescription').value.trim(),
      link: document.getElementById('newPubLink').value.trim(),
      status: document.getElementById('newPubStatus').value.trim()
    };
    const pubs = DataManager.getPublications();
    pubs.push(pub);
    if (await safeSave('publications', pubs)) {
      renderAdminPubs();
      renderAll();
      ['newPubTitle','newPubAuthors','newPubVenue','newPubYear','newPubDescription','newPubLink','newPubStatus']
        .forEach(id => document.getElementById(id).value = '');
      alert('Publication added to cloud!');
    }
    document.getElementById('addPub').textContent = '➕ Add Publication';
  });

  // --- Data Export/Import ---
  document.getElementById('exportData').addEventListener('click', () => {
    const data = DataManager.exportAll();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'portfolio_backup.json'; a.click();
    URL.revokeObjectURL(url);
  });

  document.getElementById('importData').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        await DataManager.importAll(data);
        loadAdminData();
        renderAll();
        alert('Data imported to cloud successfully!');
      } catch (err) {
        alert('Error: ' + err.message);
      }
    };
    reader.readAsText(file);
  });

  document.getElementById('resetData').addEventListener('click', async () => {
    if (!confirm('Reset ALL cloud data to defaults? This cannot be undone.')) return;
    await DataManager.resetAll();
    loadAdminData();
    renderAll();
    alert('Cloud Data reset to defaults!');
  });

})();
