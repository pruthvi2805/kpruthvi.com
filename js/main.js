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
          const headerOffset = 60;
          const elementPosition = targetElement.offsetTop;
          const offsetPosition = elementPosition - headerOffset;

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
// SCROLL INDICATOR
// Shows users there's more content below
// ============================================

class ScrollIndicator {
  constructor() {
    this.indicators = document.querySelectorAll('.scroll-indicator');
    this.init();
  }

  init() {
    if (this.indicators.length === 0) return;

    // Hide on scroll
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      
      if (window.scrollY > 100) {
        this.indicators.forEach(indicator => {
          indicator.classList.add('hidden');
        });
      }
      
      // Show again if scrolled back to top
      if (window.scrollY < 50) {
        this.indicators.forEach(indicator => {
          indicator.classList.remove('hidden');
        });
      }
    });

    // Smooth scroll on click
    this.indicators.forEach(indicator => {
      indicator.addEventListener('click', () => {
        const targetSelector = indicator.getAttribute('data-scroll-to');
        if (targetSelector) {
          const target = document.querySelector(targetSelector);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        } else {
          // Default: scroll one viewport down
          window.scrollBy({ top: window.innerHeight - 80, behavior: 'smooth' });
        }
      });
    });
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
  new ScrollIndicator();
  
  // Enhanced interactions
  new ButtonEnhancements();
  new CardEffects();
  
  // Accessibility
  new ReducedMotion();

  // Mark body as loaded to prevent animation on navigation
  setTimeout(() => {
    document.body.classList.add('loaded');
  }, 500);

  // Hide loading animation if present
  const loader = document.querySelector('.loader');
  if (loader) {
    setTimeout(() => {
      loader.style.opacity = '0';
      setTimeout(() => loader.remove(), 300);
    }, 500);
  }
});

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Debounce function for performance
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function for scroll events
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Export for use in other scripts if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ThemeManager,
    MobileNav,
    NavHighlighter,
    ScrollAnimations,
    SmoothScroll,
    HeaderScroll
  };
}
