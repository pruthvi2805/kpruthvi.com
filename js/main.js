// ============================================
// APPLE-INSPIRED INTERACTIONS
// Smooth, purposeful, delightful
// ============================================

class ThemeManager {
  constructor() {
    this.theme = localStorage.getItem('theme') || 'light';
    this.themeToggle = document.querySelector('.theme-toggle');
    this.init();
  }

  init() {
    // Set initial theme
    this.setTheme(this.theme);
    
    // Listen for theme toggle clicks
    if (this.themeToggle) {
      this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }
  }

  setTheme(theme) {
    this.theme = theme;
    
    // Add smooth transition class
    document.documentElement.classList.add('theme-transitioning');
    
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    this.updateThemeIcon();
    
    // Remove transition class after animation
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transitioning');
    }, 500);
  }

  toggleTheme() {
    const newTheme = this.theme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  updateThemeIcon() {
    if (this.themeToggle) {
      // Using minimal emoji icons for clean feel
      this.themeToggle.textContent = this.theme === 'light' ? '🌙' : '☀️';
      this.themeToggle.setAttribute('aria-label', 
        this.theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'
      );
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
    if (this.navToggle) {
      this.navToggle.addEventListener('click', () => this.toggleMenu());
    }

    // Close menu when clicking nav links
    this.navLinks.forEach(link => {
      link.addEventListener('click', () => this.closeMenu());
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (this.navMenu && 
          !this.navMenu.contains(e.target) && 
          !this.navToggle.contains(e.target)) {
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
    this.navToggle.textContent = isOpen ? '✕' : '☰';
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  closeMenu() {
    this.navMenu.classList.remove('active');
    this.navToggle.setAttribute('aria-expanded', 'false');
    this.navToggle.textContent = '☰';
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
// SCROLL ANIMATIONS - INTERSECTION OBSERVER
// Apple-style staggered reveals
// ============================================

class ScrollAnimations {
  constructor() {
    this.elements = document.querySelectorAll('.fade-in');
    this.init();
  }

  init() {
    if (this.elements.length === 0) return;

    // On resume page, make first two sections visible immediately
    if (document.querySelector('.resume-section-nav')) {
      const resumeSections = document.querySelectorAll('.resume-section.fade-in');
      if (resumeSections.length >= 2) {
        // Show Summary and Experience immediately
        resumeSections[0].classList.add('visible');
        resumeSections[1].classList.add('visible');
      }
    }

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -80px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Add visible class with slight delay for natural feel
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, 100);
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    this.elements.forEach(element => observer.observe(element));
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
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          
          // Calculate total offset for sticky elements
          const header = document.querySelector('.header');
          const sectionNav = document.querySelector('.resume-section-nav');
          
          let totalOffset = 0;
          
          // Add header height
          if (header) {
            totalOffset += header.offsetHeight;
          }
          
          // Add section nav height if it exists
          if (sectionNav) {
            totalOffset += sectionNav.offsetHeight;
          }
          
          // Add extra buffer space for breathing room
          totalOffset += 20;
          
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
// Subtle background change on scroll
// ============================================

class HeaderScroll {
  constructor() {
    this.header = document.querySelector('.header');
    this.lastScroll = 0;
    this.init();
  }

  init() {
    if (!this.header) return;

    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      
      // Add shadow when scrolled
      if (currentScroll > 10) {
        this.header.style.boxShadow = '0 1px 0 0 rgba(0, 0, 0, 0.1)';
      } else {
        this.header.style.boxShadow = 'none';
      }
      
      this.lastScroll = currentScroll;
    });
  }
}

// ============================================
// BUTTON INTERACTION ENHANCEMENTS
// Add subtle feedback to all buttons
// ============================================

class ButtonEnhancements {
  constructor() {
    this.init();
  }

  init() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
      // Add ripple effect on click (subtle)
      button.addEventListener('click', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const ripple = document.createElement('span');
        ripple.style.cssText = `
          position: absolute;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.5);
          left: ${x}px;
          top: ${y}px;
          transform: translate(-50%, -50%) scale(0);
          animation: ripple 0.6s ease-out;
          pointer-events: none;
        `;
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
      });
    });
    
    // Add ripple animation
    if (!document.getElementById('ripple-animation')) {
      const style = document.createElement('style');
      style.id = 'ripple-animation';
      style.textContent = `
        @keyframes ripple {
          to {
            transform: translate(-50%, -50%) scale(4);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }
}

// ============================================
// CARD HOVER ENHANCEMENTS
// Subtle 3D tilt effect on cards (optional, very subtle)
// ============================================

class CardEffects {
  constructor() {
    this.cards = document.querySelectorAll('.card, .project-card, .contact-method');
    this.init();
  }

  init() {
    this.cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
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
      
      // Remove animation classes
      document.querySelectorAll('.fade-in').forEach(el => {
        el.classList.add('visible');
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
    }
  }
}

// ============================================
// SCROLL MORE INDICATOR
// ============================================

class ScrollMoreIndicator {
  constructor() {
    this.indicator = document.querySelector('.scroll-more-indicator');
    this.hasScrolled = false;
    this.init();
  }

  init() {
    if (!this.indicator) return;

    // Don't show on resume page (has section nav instead)
    if (document.querySelector('.resume-section-nav')) {
      return;
    }

    // Show indicator immediately on page load
    setTimeout(() => {
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      
      // Only show if page has scrollable content
      if (scrollHeight > clientHeight + 100) {
        this.indicator.classList.add('visible');
      }
    }, 800);

    // Hide on first scroll
    window.addEventListener('scroll', () => {
      if (!this.hasScrolled && window.pageYOffset > 50) {
        this.hasScrolled = true;
        this.indicator.classList.remove('visible');
      }
    }, { once: false });
  }
}

// ============================================
// RESUME SECTION NAVIGATION
// ============================================

class ResumeSectionNav {
  constructor() {
    this.nav = document.querySelector('.resume-section-nav');
    this.sections = document.querySelectorAll('.resume-section');
    this.init();
  }

  init() {
    if (!this.nav || this.sections.length === 0) return;

    // Show navigation immediately (no header to scroll past)
    this.nav.classList.add('visible');

    // Update active section based on scroll
    window.addEventListener('scroll', () => {
      this.updateActiveSection();
    });
    
    // Initial check - highlight first section on page load
    setTimeout(() => {
      this.updateActiveSection();
      // If no section is active (page top), activate first one
      const hasActive = this.nav.querySelector('.resume-section-nav__link.active');
      if (!hasActive) {
        const firstLink = this.nav.querySelector('.resume-section-nav__link');
        if (firstLink) firstLink.classList.add('active');
      }
    }, 100);
  }

  updateActiveSection() {
    // Calculate offset matching smooth scroll behavior
    const header = document.querySelector('.header');
    const sectionNav = document.querySelector('.resume-section-nav');
    
    let totalOffset = 0;
    
    if (header) {
      totalOffset += header.offsetHeight;
    }
    
    if (sectionNav) {
      totalOffset += sectionNav.offsetHeight;
    }
    
    // Add buffer and extra for better UX
    totalOffset += 30;
    
    const scrollPos = window.pageYOffset + totalOffset;

    this.sections.forEach((section, index) => {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;
      const navLink = this.nav.querySelectorAll('.resume-section-nav__link')[index];

      if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
        navLink?.classList.add('active');
      } else {
        navLink?.classList.remove('active');
      }
    });
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
    const name = formData.get('firstName') || ''; // Using firstName field for name
    
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

    // Disable button and show loading spinner
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
        // Small delay before resetting Turnstile to avoid visual glitch
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
// INITIALIZE ALL MODULES
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // Core functionality
  new ThemeManager();
  new MobileNav();
  new NavHighlighter();
  new ScrollAnimations();
  new SmoothScroll();
  new HeaderScroll();
  new ScrollMoreIndicator();
  new ResumeSectionNav();
  new ContactFormHandler();
  
  // Enhanced interactions
  new ButtonEnhancements();
  new CardEffects();
  
  // Accessibility
  new ReducedMotion();

  // Mark body as loaded to prevent animation on navigation
  setTimeout(() => {
    document.body.classList.add('loaded');
  }, 500);
});
