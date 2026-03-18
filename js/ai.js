// ============================================
// AI.JS — OpenAI Integration (Chatbot + Insights)
// ============================================

(function() {
  'use strict';

  const chatToggle = document.getElementById('aiChatToggle');
  const chatPanel = document.getElementById('aiChatPanel');
  const chatClose = document.getElementById('aiChatClose');
  const chatMessages = document.getElementById('aiChatMessages');
  const chatInput = document.getElementById('aiChatInput');
  const chatSend = document.getElementById('aiChatSend');

  let chatHistory = [];

  // --- Toggle Chat ---
  chatToggle.addEventListener('click', () => {
    chatPanel.classList.toggle('open');
    if (chatPanel.classList.contains('open')) chatInput.focus();
  });
  chatClose.addEventListener('click', () => chatPanel.classList.remove('open'));

  // --- Build context from portfolio data ---
  function buildSystemPrompt() {
    const p = DataManager.getProfile();
    const projects = DataManager.getProjects();
    const pubs = DataManager.getPublications();
    const exp = DataManager.getExperience();
    const skills = DataManager.getSkills();
    const certs = DataManager.getCertifications();
    const edu = DataManager.getEducation();

    return `You are an AI assistant embedded in the portfolio website of ${p.name}. You answer questions about ${p.name}'s skills, experience, projects, and research as if you are their personal AI representative. Be friendly, professional, and concise. Use emojis occasionally. Here is the full context:

**Profile:** ${p.name}, ${p.title}. ${p.bio}. Located in ${p.location}. Email: ${p.email}. GitHub: ${p.github}.

**Skills:** ${skills.map(c => c.category + ': ' + c.items.map(i => i.name).join(', ')).join('. ')}

**Experience:** ${exp.map(e => e.role + ' at ' + e.company + ' (' + e.period + '). ' + e.highlights.join('. ')).join(' | ')}

**Projects:** ${projects.map(pr => pr.name + ': ' + pr.description.substring(0, 120) + '. Tech: ' + pr.tech.join(', ')).join(' | ')}

**Publications:** ${pubs.map(pb => pb.title + ' (' + pb.venue + ', ' + pb.year + '). ' + pb.description).join(' | ')}

**Certifications:** ${certs.map(c => c.title + ' from ' + c.issuer + ' (' + c.year + ')').join(', ')}

**Education:** ${edu.map(e => e.degree + ' from ' + e.institution + ' (' + e.period + '), CGPA: ' + e.cgpa).join(', ')}

Answer only based on above info. If asked something not covered, say you only know about ${p.name}'s portfolio. Keep answers under 150 words.`;
  }

  // --- Call OpenAI API ---
  async function callOpenAI(messages) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + AI_CONFIG.apiKey
      },
      body: JSON.stringify({
        model: AI_CONFIG.model,
        messages: messages,
        max_tokens: AI_CONFIG.maxTokens,
        temperature: 0.7
      })
    });
    if (!response.ok) {
      const err = await response.text();
      throw new Error('API Error: ' + response.status);
    }
    const data = await response.json();
    return data.choices[0].message.content;
  }

  // --- Add message to chat UI ---
  function addMessage(text, sender) {
    const msg = document.createElement('div');
    msg.className = 'chat-msg ' + sender;
    msg.textContent = text;
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return msg;
  }

  function addTypingIndicator() {
    const msg = document.createElement('div');
    msg.className = 'chat-msg bot typing';
    msg.innerHTML = '<div class="dots"><span></span><span></span><span></span></div>';
    msg.id = 'typingIndicator';
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return msg;
  }

  // --- Send Message ---
  async function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    chatInput.value = '';

    // Check if API key is set
    if (!AI_CONFIG.apiKey) {
      addMessage('⚠️ No OpenAI API key configured. To enable AI chat, go to Admin Panel (⚙️) → Data Backup tab → paste your API key and save.', 'bot');
      return;
    }

    chatInput.disabled = true;
    chatSend.disabled = true;

    chatHistory.push({ role: 'user', content: text });

    const typing = addTypingIndicator();

    try {
      const messages = [
        { role: 'system', content: buildSystemPrompt() },
        ...chatHistory.slice(-10)
      ];
      const reply = await callOpenAI(messages);
      typing.remove();
      addMessage(reply, 'bot');
      chatHistory.push({ role: 'assistant', content: reply });
    } catch (err) {
      typing.remove();
      if (err.message.includes('401')) {
        addMessage('🔑 API key is invalid or expired. Please update it in Admin Panel (⚙️) → Data Backup tab.', 'bot');
      } else {
        addMessage('Sorry, something went wrong. ' + err.message, 'bot');
      }
    }

    chatInput.disabled = false;
    chatSend.disabled = false;
    chatInput.focus();
  }

  chatSend.addEventListener('click', sendMessage);
  chatInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendMessage(); });

  // --- AI Project Insight ---
  window.getAIInsight = async function(projectId) {
    const projects = DataManager.getProjects();
    const project = projects.find(p => p.id === projectId || p.name === projectId);
    if (!project) return;

    const elId = 'insight-' + (project.id || project.name.replace(/\s/g, '-'));
    const el = document.getElementById(elId);
    if (!el) return;

    if (el.classList.contains('show')) { el.classList.remove('show'); return; }

    el.innerHTML = '<em>✨ Generating AI insight...</em>';
    el.classList.add('show');

    try {
      const messages = [
        { role: 'system', content: 'You are a senior AI engineer reviewing a project. Give a brief, insightful analysis (3-4 sentences) covering: technical complexity, innovation, and real-world impact. Be specific and impressive. Use one emoji.' },
        { role: 'user', content: `Project: ${project.name}\nDescription: ${project.description}\nTechnologies: ${project.tech.join(', ')}` }
      ];
      const insight = await callOpenAI(messages);
      el.innerHTML = insight;
    } catch (err) {
      el.innerHTML = 'Could not generate insight. Please try again.';
    }
  };

})();
