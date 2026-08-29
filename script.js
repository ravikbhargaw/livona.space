/* ==========================================================================
   LIVONA SPACE — SHARED JAVASCRIPT (script.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  highlightActiveNavLink();
  initFaqAccordions();
  initGalleryFilters();
  initFormHandler();
  initAiChatbot();
});

/* --------------------------------------------------------------------------
   1. MOBILE MENU TOGGLE
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener('click', () => {
      const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
      mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
      mobileMenu.classList.toggle('is-active');
    });

    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('is-active');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

/* --------------------------------------------------------------------------
   2. ACTIVE NAV HIGHLIGHTING
   -------------------------------------------------------------------------- */
function highlightActiveNavLink() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    const isHome = currentPath === '/' || currentPath.endsWith('index.html');
    
    if (isHome && (href === 'index.html' || href === '/index.html' || href === '/')) {
      link.classList.add('active-nav');
    } else if (!isHome && href.length > 1 && currentPath.includes(href.replace('./', '').replace('/', ''))) {
      link.classList.add('active-nav');
    } else {
      link.classList.remove('active-nav');
    }
  });
}

/* Auto-select plan title in form when navigating to contact */
function selectPlanInForm(planTitle) {
  sessionStorage.setItem('selectedPlan', planTitle);
}

/* --------------------------------------------------------------------------
   3. FAQ ACCORDION TOGGLES
   -------------------------------------------------------------------------- */
function initFaqAccordions() {
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      if (item) {
        item.classList.toggle('active');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   4. GALLERY FILTER TABS
   -------------------------------------------------------------------------- */
function initGalleryFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item[data-category]');

  if (!filterBtns.length || !galleryItems.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const itemCat = item.getAttribute('data-category');
        if (filterValue === 'all' || itemCat === filterValue) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   5. ENHANCED FORM HANDLER (STRICT 10-DIGIT PHONE VALIDATION)
   -------------------------------------------------------------------------- */
function initFormHandler() {
  const quoteForm = document.getElementById('quoteForm');
  const serviceSelect = document.getElementById('serviceSelect');
  const userNotes = document.getElementById('userNotes');
  const userPhone = document.getElementById('userPhone');

  if (userPhone) {
    userPhone.addEventListener('input', () => {
      userPhone.setCustomValidity('');
      let digits = userPhone.value.replace(/\D/g, '');
      if (digits.length > 10) {
        digits = digits.slice(0, 10);
      }
      userPhone.value = digits;
    });
  }

  const savedPlan = sessionStorage.getItem('selectedPlan');
  if (savedPlan && serviceSelect && userNotes) {
    if (savedPlan.includes('Complete Home')) {
      serviceSelect.value = 'Complete Home Renovation';
    } else if (savedPlan.includes('Interior')) {
      serviceSelect.value = 'Interior Fit-Out';
    } else if (savedPlan.includes('Bathroom')) {
      serviceSelect.value = 'Bathroom Renovation';
    }
    userNotes.value = `Interested in the ${savedPlan} scope.`;
    sessionStorage.removeItem('selectedPlan');
  }

  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('userName')?.value.trim() || '';
      const rawPhone = document.getElementById('userPhone')?.value.trim() || '';
      const location = document.getElementById('userLocation')?.value.trim() || '';
      const service = document.getElementById('serviceSelect')?.value || '';
      const budget = document.getElementById('userBudget')?.value || '';
      const notes = document.getElementById('userNotes')?.value.trim() || '';

      const phoneDigits = rawPhone.replace(/\D/g, '');
      const isValidTenDigits = /^[6-9]\d{9}$/.test(phoneDigits) || /^\d{10}$/.test(phoneDigits);

      if (!isValidTenDigits || phoneDigits.length !== 10) {
        if (userPhone) {
          userPhone.setCustomValidity('Please enter a valid 10-digit mobile number (e.g. 8317493619)');
          userPhone.reportValidity();
          userPhone.focus();
        }
        return;
      }

      const enquiryData = {
        name,
        phone: phoneDigits,
        location,
        service,
        budget,
        notes,
        timestamp: new Date().toISOString()
      };

      try {
        const existingEnquiries = JSON.parse(localStorage.getItem('livona_enquiries') || '[]');
        existingEnquiries.push(enquiryData);
        localStorage.setItem('livona_enquiries', JSON.stringify(existingEnquiries));
      } catch (err) {
        console.warn('LocalStorage save skipped:', err);
      }

      const successMsg = document.getElementById('formSuccessMsg');
      if (successMsg) {
        successMsg.classList.add('show');
      }

      // Send via FormData for max FormSubmit compatibility
      const fd = new FormData();
      fd.append('Name', name);
      fd.append('Phone', phoneDigits);
      fd.append('Location', location);
      fd.append('Service', service);
      fd.append('Budget', budget || 'Not specified');
      fd.append('Notes', notes || 'None');
      fd.append('_subject', `New Livona Space Lead: ${name} (${service})`);

      fetch('https://formsubmit.co/ajax/ravi.bhargaw@meaven.in', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: fd
      }).catch(err => console.warn('Email dispatch:', err));

      const waText = encodeURIComponent(
        `*New Site Visit Request — Livona Space*\n\n` +
        `*Name:* ${name}\n` +
        `*Phone:* ${phoneDigits}\n` +
        `*Location:* ${location}\n` +
        `*Service:* ${service}\n` +
        `*Budget:* ${budget || 'Not specified'}\n` +
        `*Notes:* ${notes || 'None'}`
      );

      setTimeout(() => {
        window.open(`https://wa.me/918317493619?text=${waText}`, '_blank');
        quoteForm.reset();
      }, 800);
    });
  }
}

/* --------------------------------------------------------------------------
   6. LIVONA AI ASSISTANT (ROBUST FORMDATA DISPATCH & WHATSAPP REDIRECT)
   -------------------------------------------------------------------------- */
function initAiChatbot() {
  const hour = new Date().getHours();
  let timeGreeting = 'Good evening! 🌙';
  if (hour >= 5 && hour < 12) timeGreeting = 'Good morning! ☀️';
  else if (hour >= 12 && hour < 17) timeGreeting = 'Good afternoon! 🌤️';

  const widgetContainer = document.createElement('div');
  widgetContainer.id = 'aiChatbotApp';
  widgetContainer.innerHTML = `
    <button class="ai-widget-launcher" id="aiLauncher" aria-label="Open Livona AI Assistant">
      <span class="ai-sparkle-dot"></span>
      <span>✨ Ask Livona AI</span>
    </button>

    <div class="ai-chat-drawer" id="aiDrawer">
      <div class="ai-chat-header">
        <div class="ai-chat-title">
          <span>✨ Livona AI Assistant</span>
        </div>
        <button class="ai-chat-close" id="aiClose">&times;</button>
      </div>

      <div class="ai-chat-body" id="aiChatBody">
        <div class="ai-msg ai-msg-bot">
          ${timeGreeting} Welcome to Livona Space.<br><br>To connect you with the right project engineer, may I please have your <strong>Full Name</strong>?
        </div>
      </div>

      <div class="ai-chat-footer">
        <div style="display: flex; gap: 8px; width: 100%;">
          <input type="text" id="aiInput" class="ai-chat-input" placeholder="Type your Full Name to begin...">
          <button class="ai-chat-send" id="aiSend">Next →</button>
        </div>
        <p style="font-size: 0.72rem; color: var(--ink-soft); margin-top: 6px; line-height: 1.3; text-align: center;">
          By submitting, you agree to our <a href="privacy.html" target="_blank" style="color: var(--brass); text-decoration: underline;">Privacy Policy</a> & to be contacted regarding your enquiry.
        </p>
      </div>
    </div>
  `;
  document.body.appendChild(widgetContainer);

  const launcher = document.getElementById('aiLauncher');
  const drawer = document.getElementById('aiDrawer');
  const closeBtn = document.getElementById('aiClose');
  const chatBody = document.getElementById('aiChatBody');
  const input = document.getElementById('aiInput');
  const sendBtn = document.getElementById('aiSend');

  if (!launcher || !drawer || !closeBtn || !chatBody || !input || !sendBtn) return;

  let leadState = 'NEEDS_NAME';
  let userLeadName = '';
  let userLeadPhone = '';

  launcher.addEventListener('click', () => {
    drawer.classList.toggle('open');
    if (drawer.classList.contains('open') && leadState === 'NEEDS_NAME') {
      input.focus();
    }
  });

  closeBtn.addEventListener('click', () => {
    drawer.classList.remove('open');
  });

  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('ai-pill-btn')) {
      const query = e.target.getAttribute('data-query');
      handleAiQuery(query, e.target.innerText);
    }
  });

  sendBtn.addEventListener('click', () => {
    processInput();
  });

  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      processInput();
    }
  });

  function processInput() {
    const val = input.value.trim();
    if (!val) return;

    if (leadState === 'NEEDS_NAME') {
      userLeadName = val;
      appendMsg(userLeadName, true);
      input.value = '';
      leadState = 'NEEDS_PHONE';

      input.placeholder = 'Enter 10-digit mobile number...';
      input.type = 'tel';
      input.maxLength = 10;

      setTimeout(() => {
        appendMsg(`Nice to meet you, <strong>${userLeadName}</strong>! 👋<br><br>Please enter your <strong>10-digit mobile number</strong> to unlock instant AI pricing & scope breakdowns.<br><br><small style="opacity:0.85;">By submitting, you agree to our <a href="privacy.html" target="_blank" style="color:var(--brass); text-decoration:underline;">Privacy Policy</a> and to be contacted regarding your enquiry.</small>`);
      }, 400);

    } else if (leadState === 'NEEDS_PHONE') {
      const phoneDigits = val.replace(/\D/g, '');
      appendMsg(val, true);
      input.value = '';

      if (phoneDigits.length !== 10 || !/^[6-9]\d{9}$/.test(phoneDigits)) {
        setTimeout(() => {
          appendMsg(`⚠️ Please enter a valid <strong>10-digit mobile number</strong> (e.g. 8317493619) to proceed.`);
        }, 400);
        return;
      }

      userLeadPhone = phoneDigits;
      leadState = 'UNLOCKED';

      // 1. Save lead to localStorage
      const enquiry = {
        name: userLeadName,
        phone: userLeadPhone,
        source: 'AI Assistant Chatbot',
        timestamp: new Date().toISOString()
      };

      try {
        const existing = JSON.parse(localStorage.getItem('livona_enquiries') || '[]');
        existing.push(enquiry);
        localStorage.setItem('livona_enquiries', JSON.stringify(existing));
      } catch (err) {}

      // 2. Dispatch via FormData for maximum FormSubmit reliability
      const fd = new FormData();
      fd.append('Name', userLeadName);
      fd.append('Phone', userLeadPhone);
      fd.append('Source', 'AI Assistant Chatbot');
      fd.append('_subject', `New AI Chatbot Lead: ${userLeadName} (${userLeadPhone})`);

      fetch('https://formsubmit.co/ajax/ravi.bhargaw@meaven.in', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: fd
      }).catch(err => console.warn('Chatbot email error:', err));

      setTimeout(() => {
        appendMsg(`🎉 Thank you, <strong>${userLeadName}</strong>! Your details have been logged.<br><br>What would you like to explore today? Select an option below:`, false, [
          { text: '🏡 Complete Home Renovation', query: 'home-renovation' },
          { text: '🛋️ Interiors & Room Packages', query: 'interiors' },
          { text: '🛁 Bathroom Packages', query: 'bathroom' },
          { text: '📋 Process & Site Visit Rule', query: 'process' }
        ]);

        // Hide input footer once unlocked
        const footer = document.querySelector('.ai-chat-footer');
        if (footer) footer.style.display = 'none';
      }, 500);
    } else {
      handleAiQuery('general', val);
      input.value = '';
    }
  }

  function appendMsg(text, isUser = false, pills = null) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `ai-msg ${isUser ? 'ai-msg-user' : 'ai-msg-bot'}`;
    msgDiv.innerHTML = text;
    chatBody.appendChild(msgDiv);

    if (pills && Array.isArray(pills)) {
      const pillGroup = document.createElement('div');
      pillGroup.className = 'ai-pill-group';
      pills.forEach(p => {
        const btn = document.createElement('button');
        btn.className = 'ai-pill-btn';
        btn.setAttribute('data-query', p.query);
        btn.innerText = p.text;
        pillGroup.appendChild(btn);
      });
      chatBody.appendChild(pillGroup);
    }

    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function handleAiQuery(queryType, labelText) {
    if (labelText) {
      appendMsg(labelText, true);
    }

    const q = queryType.toLowerCase();
    let reply = '';

    const waLink = `https://wa.me/918317493619?text=` + encodeURIComponent(`Hi Livona Space! I am ${userLeadName || 'a visitor'} (${userLeadPhone || ''}). I would like to request a consultation.`);

    if (q.includes('full home') || q.includes('complete home') || q.includes('bespoke') || q.includes('civil') || q.includes('entire')) {
      reply = `<strong>Complete Home Renovation (Bespoke Offering):</strong><br>
      • Single-vendor coverage: civil work, electrical rewiring, plumbing overhaul, flooring, false ceiling, painting, modular kitchen, wardrobes, and bathrooms.<br>
      • <strong>Pricing:</strong> Typically ranges between <strong>₹2,400 – ₹2,800/sq.ft</strong> depending on civil/MEP scope & finishes (custom-quoted after free site assessment).<br><br>
      <a href="${waLink}" target="_blank" rel="noopener" style="color: var(--brass); font-weight:700;">👉 Request a Free Site Visit & Custom Quote via WhatsApp 💬</a>`;
    } else if (q.includes('bathroom') || q.includes('wet')) {
      reply = `<strong>Bathroom Renovation Packages (4'x7' Standard):</strong><br>
      • <strong>Essential Tier:</strong> ₹1,25,000 + GST<br>
      • <strong>Signature Tier (Most Popular):</strong> ₹1,55,000 + GST<br>
      • <strong>Elite Tier:</strong> ₹2,05,000 + GST<br><br>
      Includes 7-10 day delivery, 3-layer waterproofing, and fixture installation!<br><br>
      <a href="${waLink}" target="_blank" rel="noopener" style="color: var(--brass); font-weight:700;">👉 View Bathroom Pricing Plans via WhatsApp 💬</a>`;
    } else if (q.includes('interior') || q.includes('fit-out') || q.includes('kitchen') || q.includes('bedroom') || q.includes('living')) {
      reply = `<strong>Room & Interior Packages:</strong><br>
      • <strong>Basic Tier:</strong> ₹1,450 / sq.ft.<br>
      • <strong>Pro Tier:</strong> ₹2,100 / sq.ft.<br><br>
      Includes factory precision modular kitchens, wardrobes, false ceiling, and 45-day guaranteed handover.<br><br>
      <a href="${waLink}" target="_blank" rel="noopener" style="color: var(--brass); font-weight:700;">👉 See Interior Pricing Plans via WhatsApp 💬</a>`;
    } else if (q.includes('process') || q.includes('step') || q.includes('visit') || q.includes('quote')) {
      reply = `<strong>Our Standard 5-Step Process:</strong><br>
      01 — Virtual Consultation<br>
      02 — Mood Board & Preliminary Quote<br>
      03 — Design Token<br>
      04 — Design Phase<br>
      05 — Execution<br><br>
      💡 <strong>Site Visit Rule:</strong> For standardized packages (Bathroom Renovation, Kitchen Package, Bedroom Package, Living Room Package), your quote is finalized remotely based on your floor plan — no site visit needed until execution. For fully customized or bespoke projects, we offer a free in-person site visit before you commit to the design token.`;
    } else if (q.includes('waterproof') || q.includes('leak') || q.includes('guarantee')) {
      reply = `<strong>100% Multi-Layer Waterproofing Guarantee:</strong><br>
      We apply polymer-modified cementitious slurry + elastomeric membrane coating across wet areas and wall corners, backed by an official 5-year warranty against seepage.`;
    } else if (q.includes('book') || q.includes('meeting') || q.includes('whatsapp')) {
      reply = `Click below to chat directly with our project engineer on WhatsApp:<br><br>
      <a href="${waLink}" target="_blank" rel="noopener" style="background: var(--ink); color: #fff; padding: 8px 14px; border-radius: 20px; text-decoration: none; display: inline-block; font-size: 0.85rem; font-weight: 700;">💬 Open WhatsApp Chat (+91 83174 93619)</a>`;
    } else {
      reply = `Livona Space delivers standardized room packages and full home bespoke renovations.<br><br>
      • Call/WhatsApp: <strong>+91 83174 93619</strong><br>
      • Email: <strong>hey@livona.space</strong><br><br>
      <a href="${waLink}" target="_blank" rel="noopener" style="color: var(--brass); font-weight:700;">👉 Request a Consultation via WhatsApp 💬</a>`;
    }

    setTimeout(() => {
      appendMsg(reply, false);
    }, 400);
  }
}
