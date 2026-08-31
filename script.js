/* ==========================================================================
   LIVONA SPACE — SHARED JAVASCRIPT (script.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initWordRevealHeadlines();
  initHeroAnimations();
  initMobileMenu();
  highlightActiveNavLink();
  initFaqAccordions();
  initGalleryFilters();
  initFormHandler();
  initAiChatbot();
  initScrollReveals();
  initStatCounters();
  initProcessProgressLine();
  initStickyEngagementBar();
  initStackedCards();
  initBeforeAfterReveal();
  initPinnedProcessStrip();
  initProcessAccordion();
  initParallaxEffects();
  initPricingDealtAnimation();
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
   4. PRICING TAB SWITCHING (Index Page / SaaS view with Smooth Fade & Slide)
   -------------------------------------------------------------------------- */
function switchPricingTab(tabName) {
  const tabInteriors = document.getElementById('tabInteriors');
  const tabBathrooms = document.getElementById('tabBathrooms');
  const gridInteriors = document.getElementById('gridInteriors');
  const gridBathrooms = document.getElementById('gridBathrooms');

  if (!tabInteriors || !tabBathrooms || !gridInteriors || !gridBathrooms) return;

  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const currentGrid = gridInteriors.classList.contains('hidden') ? gridBathrooms : gridInteriors;
  const targetGrid = tabName === 'interiors' ? gridInteriors : gridBathrooms;

  if (currentGrid === targetGrid) return;

  if (tabName === 'interiors') {
    tabInteriors.classList.add('active-tab', 'active-tab-brass');
    tabBathrooms.classList.remove('active-tab', 'active-tab-brass', 'active-tab-verdigris');
  } else {
    tabBathrooms.classList.add('active-tab', 'active-tab-verdigris');
    tabInteriors.classList.remove('active-tab', 'active-tab-brass', 'active-tab-verdigris');
  }

  if (isReducedMotion) {
    gridInteriors.classList.toggle('hidden', tabName !== 'interiors');
    gridBathrooms.classList.toggle('hidden', tabName !== 'bathrooms');
    return;
  }

  currentGrid.classList.add('tab-anim-out');
  setTimeout(() => {
    currentGrid.classList.add('hidden');
    currentGrid.classList.remove('tab-anim-out');
    targetGrid.classList.remove('hidden');
    targetGrid.classList.add('tab-anim-out');
    requestAnimationFrame(() => {
      targetGrid.classList.remove('tab-anim-out');
    });
  }, 220);
}

/* --------------------------------------------------------------------------
   5. GALLERY FILTER TABS WITH SMOOTH FADE & SCALE TRANSITIONS
   -------------------------------------------------------------------------- */
function initGalleryFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item[data-category]');

  if (!filterBtns.length || !galleryItems.length) return;

  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const itemCat = item.getAttribute('data-category');
        const shouldShow = filterValue === 'all' || itemCat === filterValue;

        if (isReducedMotion) {
          item.classList.toggle('hidden', !shouldShow);
          return;
        }

        if (shouldShow) {
          item.classList.remove('hidden');
          item.classList.add('filter-anim-in');
          setTimeout(() => item.classList.remove('filter-anim-in'), 350);
        } else {
          item.classList.add('filter-anim-out');
          setTimeout(() => {
            item.classList.add('hidden');
            item.classList.remove('filter-anim-out');
          }, 220);
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

      // Honeypot Spam Protection Check
      const honeypot = document.getElementById('website_url_hp')?.value;
      if (honeypot && honeypot.trim() !== '') {
        console.warn('Bot detected via honeypot field. Silently cancelling submission.');
        if (successMsg) successMsg.classList.add('show');
        quoteForm.reset();
        return;
      }

      // Send via FormData for max FormSubmit compatibility
      const fd = new FormData();
      fd.append('Name', name);
      fd.append('Phone', phoneDigits);
      fd.append('Location', location);
      fd.append('Service', service);
      fd.append('Budget', budget || 'Not specified');
      fd.append('Notes', notes || 'None');
      fd.append('_honey', ''); // FormSubmit built-in honeypot
      fd.append('_subject', `New Livona Space Lead: ${name} (${service})`);

      fetch('https://formsubmit.co/ajax/livona.space@gmail.com', {
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

  initChatbotIdlePulse();

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
      fd.append('_honey', ''); // FormSubmit built-in honeypot
      fd.append('_subject', `New AI Chatbot Lead: ${userLeadName} (${userLeadPhone})`);

      fetch('https://formsubmit.co/ajax/livona.space@gmail.com', {
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
      • Email: <strong>livona.space@gmail.com</strong><br><br>
      <a href="${waLink}" target="_blank" rel="noopener" style="color: var(--brass); font-weight:700;">👉 Request a Consultation via WhatsApp 💬</a>`;
    }

    setTimeout(() => {
      appendMsg(reply, false);
    }, 400);
  }
}

/* --------------------------------------------------------------------------
   7. HERO ENTRANCE STAGGER ANIMATIONS
   -------------------------------------------------------------------------- */
function initHeroAnimations() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const heroHeadline = document.querySelector('.hero-headline, .page-hero .hero-headline');
  const heroSubtext = document.querySelector('.hero-subtext, .page-hero .hero-subtext');
  const heroCtas = document.querySelector('.hero-cta-group, .page-hero-grid .hero-cta-group');
  const heroImg = document.querySelector('.page-hero .img-card, .hero-visual, .page-hero-grid > div:last-child');

  if (heroHeadline) heroHeadline.classList.add('hero-animate-1');
  if (heroSubtext) heroSubtext.classList.add('hero-animate-2');
  if (heroCtas) heroCtas.classList.add('hero-animate-3');
  if (heroImg) heroImg.classList.add('hero-animate-4');
}

/* --------------------------------------------------------------------------
   8. SCROLL-TRIGGERED REVEAL OBSERVER
   -------------------------------------------------------------------------- */
function initScrollReveals() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.reveal-on-scroll').forEach(el => el.classList.add('is-visible'));
    return;
  }

  const selector = '.product-showcase-card, .pricing-card, .gallery-item, .process-card, .blog-card, .product-supporting-card, .trust-stat-item, .disambiguation-box, .process-callout-box';
  const targets = document.querySelectorAll(selector);

  const containers = document.querySelectorAll('.product-supporting-grid, .pricing-grid, .process-grid-5, .gallery-grid, .blog-grid, .trust-grid, .form-group-row');
  containers.forEach(c => c.classList.add('reveal-stagger-container'));

  targets.forEach(el => {
    if (!el.classList.contains('reveal-on-scroll')) {
      el.classList.add('reveal-on-scroll');
    }
  });

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   9. ANIMATED COUNTERS FOR TRUST STATS
   -------------------------------------------------------------------------- */
function initStatCounters() {
  const statNums = document.querySelectorAll('.trust-stat-num');
  if (!statNums.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateSingleCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  statNums.forEach(el => {
    const rawText = el.innerText.trim();
    const match = rawText.match(/^(\d+)(.*)$/);
    if (match) {
      el.setAttribute('data-count', match[1]);
      el.setAttribute('data-suffix', match[2] || '');
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        el.innerText = '0' + (match[2] || '');
      }
      observer.observe(el);
    }
  });
}

function animateSingleCounter(el) {
  const target = parseInt(el.getAttribute('data-count'), 10);
  const suffix = el.getAttribute('data-suffix') || '';
  if (isNaN(target)) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.innerText = target + suffix;
    return;
  }

  const duration = 1800;
  const startTime = performance.now();

  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(easeProgress * target);

    el.innerText = current + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.innerText = target + suffix;
    }
  }

  requestAnimationFrame(update);
}

/* --------------------------------------------------------------------------
   10. 5-STEP PROCESS ANIMATED SCROLL PROGRESSION LINE
   -------------------------------------------------------------------------- */
function initProcessProgressLine() {
  const processGrid = document.querySelector('.process-grid-5');
  const processSection = document.querySelector('.process-section');
  if (!processGrid || !processSection) return;

  if (!processGrid.querySelector('.process-progress-line-track')) {
    const track = document.createElement('div');
    track.className = 'process-progress-line-track';
    track.innerHTML = '<div class="process-progress-line-bar"></div>';
    processGrid.prepend(track);
  }

  const progressBar = processGrid.querySelector('.process-progress-line-bar');
  if (!progressBar) return;

  function updateProgress() {
    const rect = processSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    const startPoint = windowHeight - 100;
    const endPoint = windowHeight * 0.2;
    const totalDist = startPoint - endPoint + rect.height;
    const currentDist = startPoint - rect.top;
    const progress = Math.min(Math.max(currentDist / totalDist, 0), 1);

    progressBar.style.width = (progress * 100) + '%';
  }

  window.addEventListener('scroll', () => {
    requestAnimationFrame(updateProgress);
  }, { passive: true });
  updateProgress();
}

/* --------------------------------------------------------------------------
   11. STICKY / PERSISTENT ENGAGEMENT FLOATING BAR
   -------------------------------------------------------------------------- */
function initStickyEngagementBar() {
  if (sessionStorage.getItem('sticky_dismissed') === 'true') return;

  const bar = document.createElement('div');
  bar.className = 'sticky-engagement-bar';
  bar.id = 'stickyEngagementBar';
  bar.innerHTML = `
    <span class="sticky-engagement-text">💡 Planning a home or room renovation?</span>
    <a href="contact.html" class="sticky-engagement-btn">Get Free Quote →</a>
    <button class="sticky-engagement-close" id="closeStickyBar" aria-label="Dismiss sticky notification">&times;</button>
  `;
  document.body.appendChild(bar);

  const closeBtn = document.getElementById('closeStickyBar');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      bar.classList.remove('is-visible');
      sessionStorage.setItem('sticky_dismissed', 'true');
    });
  }

  let scrollTicking = false;
  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      requestAnimationFrame(() => {
        if (sessionStorage.getItem('sticky_dismissed') !== 'true') {
          if (window.scrollY > 380) {
            bar.classList.add('is-visible');
          } else {
            bar.classList.remove('is-visible');
          }
        }
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  });
}

/* --------------------------------------------------------------------------
   12. CHATBOT IDLE PULSE
   -------------------------------------------------------------------------- */
function initChatbotIdlePulse() {
  const launcher = document.getElementById('aiLauncher');
  if (!launcher) return;

  if (!sessionStorage.getItem('ai_interacted') && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    launcher.classList.add('idle-pulse');
  }

  launcher.addEventListener('click', () => {
    launcher.classList.remove('idle-pulse');
    sessionStorage.setItem('ai_interacted', 'true');
  });
}

/* --------------------------------------------------------------------------
   13. STACKED CATEGORY CARDS (HOMEPAGE DECK EFFECT)
   -------------------------------------------------------------------------- */
function initStackedCards() {
  const cards = document.querySelectorAll('.stacked-card-item');
  if (!cards.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  function updateCardStack() {
    const windowHeight = window.innerHeight;

    cards.forEach((card, index) => {
      if (index === cards.length - 1) return;

      const nextCard = cards[index + 1];
      const nextRect = nextCard.getBoundingClientRect();

      if (nextRect.top < windowHeight && nextRect.top > 100) {
        const overlapProgress = 1 - ((nextRect.top - 100) / (windowHeight - 100));
        const scale = 1 - (overlapProgress * 0.06);
        const translateY = overlapProgress * -10;
        card.style.transform = `scale(${scale}) translateY(${translateY}px)`;
        card.style.opacity = `${1 - (overlapProgress * 0.15)}`;
      } else if (nextRect.top <= 100) {
        card.style.transform = 'scale(0.94) translateY(-10px)';
        card.style.opacity = '0.85';
      } else {
        card.style.transform = 'scale(1) translateY(0)';
        card.style.opacity = '1';
      }
    });
  }

  window.addEventListener('scroll', () => {
    requestAnimationFrame(updateCardStack);
  }, { passive: true });

  updateCardStack();
}

/* --------------------------------------------------------------------------
   14. SCROLL-DRIVEN BEFORE/AFTER REVEAL
   -------------------------------------------------------------------------- */
function initBeforeAfterReveal() {
  const section = document.getElementById('beforeAfterSection');
  const afterLayer = document.getElementById('afterLayer');
  const handle = document.getElementById('revealHandle');

  if (!section || !afterLayer || !handle) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    afterLayer.style.clipPath = 'inset(0 0 0 0%)';
    handle.style.left = '100%';
    return;
  }

  function onScroll() {
    const rect = section.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const scrollDistance = rect.height - windowHeight;

    if (scrollDistance <= 0) return;

    const currentPos = -rect.top;
    const progress = Math.min(Math.max(currentPos / scrollDistance, 0), 1);

    const revealPercent = (1 - progress) * 100;

    afterLayer.style.clipPath = `inset(0 0 0 ${revealPercent}%)`;
    handle.style.left = `${progress * 100}%`;
  }

  window.addEventListener('scroll', () => {
    requestAnimationFrame(onScroll);
  }, { passive: true });

  onScroll();
}

/* --------------------------------------------------------------------------
   15. PINNED PROCESS STRIP & SEQUENTIAL LIGHT-UP
   -------------------------------------------------------------------------- */
function initPinnedProcessStrip() {
  const processSection = document.querySelector('.process-section');
  const processGrid = document.querySelector('.process-grid-5');
  const stepCards = document.querySelectorAll('.process-card');
  const progressBar = document.querySelector('.process-progress-line-bar');

  if (!processSection || !processGrid || !stepCards.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    stepCards.forEach(card => card.classList.add('active-step-lit'));
    if (progressBar) progressBar.style.width = '100%';
    return;
  }

  function updateProcessScroll() {
    const rect = processSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    const startPoint = windowHeight - 150;
    const totalDist = rect.height - 180;
    if (totalDist <= 0) return;

    const currentDist = startPoint - rect.top;
    const progress = Math.min(Math.max(currentDist / totalDist, 0), 1);

    if (progressBar) {
      progressBar.style.width = `${progress * 100}%`;
    }

    const activeIndex = Math.min(Math.floor(progress * 5), 4);

    stepCards.forEach((card, idx) => {
      if (idx <= activeIndex && progress > 0.05) {
        card.classList.add('active-step-lit');
      } else {
        card.classList.remove('active-step-lit');
      }
    });
  }

  window.addEventListener('scroll', () => {
    requestAnimationFrame(updateProcessScroll);
  }, { passive: true });

  updateProcessScroll();
}

/* --------------------------------------------------------------------------
   16. PARALLAX HERO & CROSSING PARALLAX SECTIONS
   -------------------------------------------------------------------------- */
function initParallaxEffects() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const heroVisual = document.querySelector('.hero-visual-card, .page-hero-grid .img-card');
  const alternatingRows = document.querySelectorAll('.feature-subrow, .product-grid');

  function updateParallax() {
    const scrollY = window.scrollY;

    if (heroVisual && scrollY < 900) {
      heroVisual.style.transform = `translateY(${scrollY * 0.14}px)`;
    }

    alternatingRows.forEach(row => {
      const rect = row.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (rect.top < windowHeight && rect.bottom > 0) {
        const offset = (rect.top - (windowHeight / 2)) * 0.06;
        const imgCol = row.querySelector('.img-card, .product-collage');
        const textCol = row.querySelector('.product-details, div:not(.img-card)');

        if (imgCol) imgCol.style.transform = `translateY(${offset}px)`;
        if (textCol) textCol.style.transform = `translateY(${-offset * 0.5}px)`;
      }
    });
  }

  window.addEventListener('scroll', () => {
    requestAnimationFrame(updateParallax);
  }, { passive: true });

  updateParallax();
}

/* --------------------------------------------------------------------------
   17. PRICING CARDS "DEALT" ANIMATION
   -------------------------------------------------------------------------- */
function initPricingDealtAnimation() {
  const pricingGrids = document.querySelectorAll('.pricing-grid');
  if (!pricingGrids.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const cards = entry.target.querySelectorAll('.pricing-card');
        cards.forEach((card, idx) => {
          card.classList.add('dealt-active');
          card.style.transitionDelay = `${idx * 150}ms`;
        });
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  pricingGrids.forEach(grid => {
    const cards = grid.querySelectorAll('.pricing-card');
    cards.forEach((card, idx) => {
      card.classList.add('dealt-card');
      if (idx === 0) card.classList.add('dealt-left');
      if (idx === 1) card.classList.add('dealt-center');
      if (idx === 2) card.classList.add('dealt-right');
    });
    observer.observe(grid);
  });
}

/* --------------------------------------------------------------------------
   18. WORD-REVEAL HERO HEADLINE (SAFE DOM TEXT NODE TRAVERSAL)
   -------------------------------------------------------------------------- */
function initWordRevealHeadlines() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const headlines = document.querySelectorAll('.hero-headline');
  headlines.forEach(headline => {
    if (headline.querySelector('.word-span')) return;

    let globalWordIdx = 0;

    function wrapNode(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent;
        if (!text.trim()) return;

        const fragment = document.createDocumentFragment();
        const words = text.split(/(\s+)/);

        words.forEach(w => {
          if (/\s+/.test(w) || w === '') {
            fragment.appendChild(document.createTextNode(w));
          } else {
            const span = document.createElement('span');
            span.className = 'word-span';
            span.style.animationDelay = `${globalWordIdx * 50}ms`;
            span.textContent = w;
            fragment.appendChild(span);
            globalWordIdx++;
          }
        });

        if (node.parentNode) {
          node.parentNode.replaceChild(fragment, node);
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        Array.from(node.childNodes).forEach(wrapNode);
      }
    }

    Array.from(headline.childNodes).forEach(wrapNode);
  });
}

/* --------------------------------------------------------------------------
   19. PROCESS CARD ACCORDION EXPAND/COLLAPSE
   -------------------------------------------------------------------------- */
function initProcessAccordion() {
  const processCards = document.querySelectorAll('.process-card');
  if (!processCards.length) return;

  processCards.forEach(card => {
    card.addEventListener('click', () => {
      const isAlreadyExpanded = card.classList.contains('is-expanded');
      const parentGrid = card.closest('.process-grid-5');
      
      if (parentGrid) {
        parentGrid.querySelectorAll('.process-card').forEach(otherCard => {
          otherCard.classList.remove('is-expanded');
          otherCard.setAttribute('aria-expanded', 'false');
        });
      } else {
        card.classList.remove('is-expanded');
        card.setAttribute('aria-expanded', 'false');
      }

      if (!isAlreadyExpanded) {
        card.classList.add('is-expanded');
        card.setAttribute('aria-expanded', 'true');
      }
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });
}

