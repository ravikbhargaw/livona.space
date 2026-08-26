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

    // Handle home vs sub-pages
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

/* --------------------------------------------------------------------------
   3. PRICING TAB SWITCHING (Index Page / SaaS view)
   -------------------------------------------------------------------------- */
function switchPricingTab(tabName) {
  const tabInteriors = document.getElementById('tabInteriors');
  const tabBathrooms = document.getElementById('tabBathrooms');
  const gridInteriors = document.getElementById('gridInteriors');
  const gridBathrooms = document.getElementById('gridBathrooms');

  if (!tabInteriors || !tabBathrooms || !gridInteriors || !gridBathrooms) return;

  if (tabName === 'interiors') {
    tabInteriors.classList.add('active-tab', 'active-tab-brass');
    tabBathrooms.classList.remove('active-tab', 'active-tab-brass', 'active-tab-verdigris');
    gridInteriors.classList.remove('hidden');
    gridBathrooms.classList.add('hidden');
  } else if (tabName === 'bathrooms') {
    tabBathrooms.classList.add('active-tab', 'active-tab-verdigris');
    tabInteriors.classList.remove('active-tab', 'active-tab-brass', 'active-tab-verdigris');
    gridBathrooms.classList.remove('hidden');
    gridInteriors.classList.add('hidden');
  }
}

/* Auto-select plan title in form when navigating to contact */
function selectPlanInForm(planTitle) {
  sessionStorage.setItem('selectedPlan', planTitle);
}

/* --------------------------------------------------------------------------
   4. FAQ ACCORDION TOGGLES
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
   5. GALLERY FILTER TABS
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
   6. FORM HANDLER
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
      const successMsg = document.getElementById('formSuccessMsg');
      if (successMsg) {
        successMsg.classList.add('show');
        setTimeout(() => {
          quoteForm.reset();
        }, 600);
      }
    });
  }
}
