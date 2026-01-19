// ============================================
// PORTFOLIO INTERACTIONS
// Clean, purposeful, minimal
// ============================================

class ThemeManager {
  constructor() {
    this.theme = localStorage.getItem('theme') || 'light';
    this.themeToggles = document.querySelectorAll('.theme-toggle');
    this.init();
  }

  init() {
    // Set initial theme
    this.setTheme(this.theme);

    // Listen for theme toggle clicks on all toggle buttons
    this.themeToggles.forEach(toggle => {
      toggle.addEventListener('click', () => this.toggleTheme());
    });
  }

  setTheme(theme) {
    this.theme = theme;

    // Add smooth transition class
    document.documentElement.classList.add('theme-transitioning');

    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    this.updateAriaLabels();

    // Remove transition class after animation
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transitioning');
    }, 500);
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
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();

          // Calculate offset for header
          const header = document.querySelector('.header');
          let totalOffset = header ? header.offsetHeight : 0;
          totalOffset += 20; // Buffer space

          const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = elementPosition - totalOffset;

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
    this.statusDiv.textContent = message;
    this.statusDiv.className = `form-status form-status-${type}`;
    this.statusDiv.style.display = 'block';
  }

  clearStatus() {
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
    this.links = document.querySelectorAll('.resume-toc__link');
    this.sections = [];
    this.init();
  }

  init() {
    if (!this.toc || this.links.length === 0) return;

    // Gather sections
    this.links.forEach(link => {
      const id = link.getAttribute('href').slice(1);
      const section = document.getElementById(id);
      if (section) this.sections.push({ id, element: section, link });
    });

    // Scroll listener with throttle
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.updateActiveLink();
          ticking = false;
        });
        ticking = true;
      }
    });

    // Initial check
    this.updateActiveLink();
  }

  updateActiveLink() {
    const scrollPos = window.scrollY + 120; // Offset for header

    let activeSection = this.sections[0];

    for (const section of this.sections) {
      if (section.element.offsetTop <= scrollPos) {
        activeSection = section;
      }
    }

    this.links.forEach(link => link.classList.remove('active'));
    if (activeSection) {
      activeSection.link.classList.add('active');
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
