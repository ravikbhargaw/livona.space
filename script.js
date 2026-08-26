/* ==========================================================================
   LIVONA SPACE — SHARED JAVASCRIPT (script.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  highlightActiveNavLink();
  initFaqAccordions();
  initGalleryFilters();
  initFormHandler();
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
   5. ENHANCED FORM HANDLER (WHATSAPP + EMAIL TO HEY@LIVONA.SPACE)
   -------------------------------------------------------------------------- */
function initFormHandler() {
  const quoteForm = document.getElementById('quoteForm');
  const serviceSelect = document.getElementById('serviceSelect');
  const userNotes = document.getElementById('userNotes');

  // Pre-fill selected plan from session storage if redirected from pricing
  const savedPlan = sessionStorage.getItem('selectedPlan');
  if (savedPlan && serviceSelect && userNotes) {
    if (savedPlan.includes('Interior')) {
      serviceSelect.value = 'Interior Fit-Out';
    } else if (savedPlan.includes('Bathroom')) {
      serviceSelect.value = 'Bathroom Renovation';
    }
    userNotes.value = `Interested in the ${savedPlan} package scope.`;
    sessionStorage.removeItem('selectedPlan');
  }

  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('userName')?.value || '';
      const phone = document.getElementById('userPhone')?.value || '';
      const location = document.getElementById('userLocation')?.value || '';
      const service = document.getElementById('serviceSelect')?.value || '';
      const budget = document.getElementById('userBudget')?.value || '';
      const notes = document.getElementById('userNotes')?.value || '';

      const enquiryData = {
        name,
        phone,
        location,
        service,
        budget,
        notes,
        timestamp: new Date().toISOString()
      };

      // 1. Save locally into browser storage backup
      try {
        const existingEnquiries = JSON.parse(localStorage.getItem('livona_enquiries') || '[]');
        existingEnquiries.push(enquiryData);
        localStorage.setItem('livona_enquiries', JSON.stringify(existingEnquiries));
      } catch (err) {
        console.warn('LocalStorage save skipped:', err);
      }

      // 2. Show UI Success message
      const successMsg = document.getElementById('formSuccessMsg');
      if (successMsg) {
        successMsg.classList.add('show');
      }

      // 3. Email Form Forwarding to livona.space@gmail.com via FormSubmit AJAX
      fetch('https://formsubmit.co/ajax/livona.space@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          Name: name,
          Phone: phone,
          Location: location,
          Service: service,
          Budget: budget || 'Not specified',
          Notes: notes || 'None',
          _subject: `New Livona Space Lead: ${name} (${service})`
        })
      }).catch(err => console.warn('Email dispatch:', err));

      // 4. Open pre-filled WhatsApp message directly to 8317493619
      const waText = encodeURIComponent(
        `*New Site Visit Request — Livona Space*\n\n` +
        `*Name:* ${name}\n` +
        `*Phone:* ${phone}\n` +
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
