// ============================================
// PORTFOLIO INTERACTIONS
// Clean, purposeful, minimal
// ============================================

class ThemeManager {
  constructor() {
    this.theme = localStorage.getItem('theme') || 'light';
    this.themeToggles = document.querySelectorAll('.theme-toggle');
    this.isInitialLoad = true;
    this.init();
  }

  init() {
    // Theme is already set by inline script in <head>, just sync state
    document.documentElement.setAttribute('data-theme', this.theme);
    this.updateAriaLabels();
    this.updateTurnstileTheme();

    // Listen for theme toggle clicks on all toggle buttons
    this.themeToggles.forEach(toggle => {
      toggle.addEventListener('click', () => this.toggleTheme());
    });

    // Enable transitions after initial render
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.documentElement.classList.remove('no-transitions');
        this.isInitialLoad = false;
      });
    });
  }

  setTheme(theme) {
    this.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    this.updateAriaLabels();
    this.updateTurnstileTheme();
  }

  toggleTheme() {
    const newTheme = this.theme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  updateAriaLabels() {
    this.themeToggles.forEach(toggle => {
      toggle.setAttribute('aria-label',
        this.theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'
      );
    });
  }

  updateTurnstileTheme() {
    const turnstileWidget = document.querySelector('.cf-turnstile');
    if (turnstileWidget) {
      turnstileWidget.setAttribute('data-theme', this.theme);
      // Re-render Turnstile if it's already loaded and this isn't initial load
      if (!this.isInitialLoad && typeof turnstile !== 'undefined') {
        try {
          turnstile.reset();
        } catch (e) {
          // Widget may not be rendered yet
        }
      }
    }
  }
}

// ============================================
// MOBILE NAVIGATION
// ============================================

class MobileNav {
  constructor() {
    this.navToggle = document.querySelector('.nav__toggle');
    this.navMenu = document.querySelector('.nav__menu');
    this.navLinks = document.querySelectorAll('.nav__link');
    this.init();
  }

  init() {
    if (!this.navToggle || !this.navMenu) return;

    this.navToggle.addEventListener('click', () => this.toggleMenu());

    // Close menu when clicking nav links
    this.navLinks.forEach(link => {
      link.addEventListener('click', () => this.closeMenu());
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.navMenu.contains(e.target) &&
          !this.navToggle.contains(e.target) &&
          this.navMenu.classList.contains('active')) {
        this.closeMenu();
      }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.navMenu.classList.contains('active')) {
        this.closeMenu();
      }
    });
  }

  toggleMenu() {
    this.navMenu.classList.toggle('active');
    const isOpen = this.navMenu.classList.contains('active');
    this.navToggle.setAttribute('aria-expanded', isOpen);

    // Prevent body scroll when menu is open
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  closeMenu() {
    this.navMenu.classList.remove('active');
    this.navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
}

// ============================================
// ACTIVE NAVIGATION LINK
// ============================================

class NavHighlighter {
  constructor() {
    this.currentPage = window.location.pathname.split('/').pop() || 'index.html';
    this.navLinks = document.querySelectorAll('.nav__link');
    this.init();
  }

  init() {
    this.navLinks.forEach(link => {
      const linkPage = link.getAttribute('href');
      if (linkPage === this.currentPage ||
         (this.currentPage === '' && linkPage === 'index.html')) {
        link.classList.add('active');
      }
    });
  }
}

// ============================================
// SMOOTH SCROLLING FOR ANCHOR LINKS
// ============================================

class SmoothScroll {
  constructor() {
    this.init();
  }

  init() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      // Skip resume TOC links - handled by ResumeTOC class
      if (anchor.closest('.resume-toc') || anchor.closest('.resume-mobile-nav')) {
        return;
      }

      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();

          // Calculate offset for header
          const header = document.querySelector('.header');
          let totalOffset = header ? header.offsetHeight : 0;

          // Account for sticky mobile nav on resume page
          const mobileNav = document.querySelector('.resume-mobile-nav');
          if (mobileNav && window.innerWidth <= 768) {
            totalOffset += mobileNav.offsetHeight;
          }

          totalOffset += 20; // Buffer space

          const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
          let offsetPosition = elementPosition - totalOffset;

          // Ensure we don't scroll above 0 (for first section)
          offsetPosition = Math.max(0, offsetPosition);

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }
}

// ============================================
// ENHANCED HEADER BEHAVIOR
// Subtle border change on scroll
// ============================================

class HeaderScroll {
  constructor() {
    this.header = document.querySelector('.header');
    this.init();
  }

  init() {
    if (!this.header) return;

    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;

      // Subtle shadow when scrolled
      if (currentScroll > 10) {
        this.header.style.boxShadow = '0 1px 0 0 rgba(0, 0, 0, 0.08)';
      } else {
        this.header.style.boxShadow = 'none';
      }
    });
  }
}

// ============================================
// PERFORMANCE OPTIMIZATION
// Reduce motion for users who prefer it
// ============================================

class ReducedMotion {
  constructor() {
    this.init();
  }

  init() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (prefersReducedMotion.matches) {
      // Disable animations for accessibility
      document.documentElement.style.setProperty('--transition-fast', '0ms');
      document.documentElement.style.setProperty('--transition-base', '0ms');
      document.documentElement.style.setProperty('--transition-slow', '0ms');
    }
  }
}

// ============================================
// CONTACT FORM HANDLER
// ============================================

class ContactFormHandler {
  constructor() {
    this.form = document.getElementById('contact-form');
    this.statusDiv = document.getElementById('form-status');
    this.init();
  }

  init() {
    if (!this.form) return;
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  async handleSubmit(e) {
    e.preventDefault();

    const submitBtn = this.form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    // Get form data
    const formData = new FormData(this.form);
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const name = `${firstName} ${lastName}`;

    // Get Turnstile token
    let turnstileResponse = '';
    try {
      if (typeof turnstile !== 'undefined') {
        turnstileResponse = turnstile.getResponse();
      }
    } catch (error) {
      console.error('Turnstile error:', error);
    }

    if (!turnstileResponse) {
      this.showStatus('Please complete the security check.', 'error');
      return;
    }

    // Disable button and show loading
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    submitBtn.innerHTML = 'Sending...<span class="btn-spinner"></span>';
    this.clearStatus();

    try {
      const response = await fetch('https://contact-worker.kautikwarpruthvi.workers.dev', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          email: formData.get('email'),
          message: formData.get('message'),
          'cf-turnstile-response': turnstileResponse,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        this.showStatus('Message sent! I\'ll get back to you soon.', 'success');
        this.form.reset();
        setTimeout(() => turnstile.reset(), 100);
      } else {
        this.showStatus(data.error || 'Failed to send message. Please try again.', 'error');
        turnstile.reset();
      }
    } catch (error) {
      console.error('Form submission error:', error);
      this.showStatus('Network error. Please check your connection and try again.', 'error');
      turnstile.reset();
    } finally {
      submitBtn.disabled = false;
      submitBtn.classList.remove('loading');
      submitBtn.innerHTML = originalText;
    }
  }

  showStatus(message, type) {
    // Clear any existing timeout
    if (this.statusTimeout) {
      clearTimeout(this.statusTimeout);
    }

    this.statusDiv.textContent = message;
    this.statusDiv.className = `form-status form-status-${type}`;
    this.statusDiv.style.display = 'block';

    // Auto-dismiss success messages after 4 seconds
    if (type === 'success') {
      this.statusTimeout = setTimeout(() => {
        this.statusDiv.classList.add('fade-out');
        setTimeout(() => this.clearStatus(), 300);
      }, 4000);
    }
  }

  clearStatus() {
    if (this.statusTimeout) {
      clearTimeout(this.statusTimeout);
    }
    this.statusDiv.style.display = 'none';
    this.statusDiv.textContent = '';
    this.statusDiv.className = 'form-status';
  }
}

// ============================================
// RESUME TABLE OF CONTENTS
// Tracks scroll position, highlights active section
// ============================================

class ResumeTOC {
  constructor() {
    this.toc = document.querySelector('.resume-toc');
    this.mobileNav = document.querySelector('.resume-mobile-nav');
    this.desktopLinks = document.querySelectorAll('.resume-toc__link');
    this.mobileLinks = document.querySelectorAll('.resume-mobile-nav__link');
    this.sections = [];
    this.currentActiveId = null;
    this.isProgrammaticScroll = false;
    this.init();
  }

  init() {
    // Need either desktop or mobile nav to function
    if (this.desktopLinks.length === 0 && this.mobileLinks.length === 0) return;

    // Gather sections from whichever nav exists
    const links = this.desktopLinks.length > 0 ? this.desktopLinks : this.mobileLinks;
    links.forEach(link => {
      const id = link.getAttribute('href').slice(1);
      const section = document.getElementById(id);
      if (section) this.sections.push({ id, element: section });
    });

    // Handle clicks on mobile nav links
    this.mobileLinks.forEach(link => {
      link.addEventListener('click', (e) => this.handleTabClick(e, link));
    });

    // Handle clicks on desktop TOC links
    this.desktopLinks.forEach(link => {
      link.addEventListener('click', (e) => this.handleTabClick(e, link));
    });

    // Only update on manual scroll (detect scroll stop)
    let scrollTimer = null;
    window.addEventListener('scroll', () => {
      if (this.isProgrammaticScroll) return;

      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        this.updateActiveFromScroll();
      }, 100);
    });

    // Initial check
    this.updateActiveFromScroll();
  }

  handleTabClick(e, link) {
    const id = link.getAttribute('href').slice(1);
    const targetElement = document.getElementById(id);
    if (!targetElement) return;

    e.preventDefault();

    // Set active immediately
    this.setActiveLink(id);

    // Scroll to section
    this.isProgrammaticScroll = true;

    const header = document.querySelector('.header');
    let offset = header ? header.offsetHeight : 0;

    if (this.mobileNav && window.innerWidth <= 768) {
      offset += this.mobileNav.offsetHeight;
    }
    offset += 20;

    const top = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;

    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });

    // Re-enable scroll tracking after animation
    setTimeout(() => {
      this.isProgrammaticScroll = false;
    }, 1000);
  }

  setActiveLink(id) {
    this.currentActiveId = id;

    // Update all links
    [...this.desktopLinks, ...this.mobileLinks].forEach(link => {
      const isActive = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('active', isActive);
    });

    // Scroll mobile nav to show active tab
    const activeLink = [...this.mobileLinks].find(l => l.getAttribute('href') === `#${id}`);
    if (activeLink && this.mobileNav) {
      activeLink.scrollIntoView({ behavior: 'auto', inline: 'center', block: 'nearest' });
    }
  }

  updateActiveFromScroll() {
    const scrollPos = window.scrollY + 150;
    let activeSection = this.sections[0];

    for (const section of this.sections) {
      if (section.element.offsetTop <= scrollPos) {
        activeSection = section;
      }
    }

    if (this.currentActiveId !== activeSection.id) {
      this.setActiveLink(activeSection.id);
    }
  }
}

// ============================================
// INITIALIZE ALL MODULES
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // Core functionality
  new ThemeManager();
  new MobileNav();
  new NavHighlighter();
  new SmoothScroll();
  new HeaderScroll();
  new ContactFormHandler();
  new ResumeTOC();

  // Accessibility
  new ReducedMotion();

  // Mark body as loaded
  setTimeout(() => {
    document.body.classList.add('loaded');
  }, 100);
});
