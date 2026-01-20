/**
 * Templates for the generated portfolio
 */

/**
 * Escape HTML special characters
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Generate the HTML template for the portfolio
 * @param {Object} data - Form data
 * @returns {string} HTML content
 */
function generateHTML(data) {
  const initials = data.fullName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  const experienceHTML = data.experiences.map(exp => `
          <article class="timeline-item">
            <div class="timeline-item__header">
              <div>
                <h3 class="timeline-item__title">${escapeHtml(exp.title)}</h3>
                <p class="timeline-item__subtitle">${escapeHtml(exp.company)}${exp.location ? ` · ${escapeHtml(exp.location)}` : ''}</p>
              </div>
              <span class="timeline-item__date">${escapeHtml(exp.dates)}</span>
            </div>
            <div class="timeline-item__description">
              <ul class="timeline-item__list">
                ${exp.bullets.filter(b => b.trim()).map(bullet => `
                <li>${escapeHtml(bullet)}</li>
                `).join('')}
              </ul>
            </div>
          </article>
  `).join('');

  const skillsHTML = data.skills && data.skills.length > 0 ? `
      <section id="skills" class="resume-section">
        <h2 class="resume-section__title">Skills</h2>
        <div class="skills-list">
          ${data.skills.map(skill => `<span class="skill-pill">${escapeHtml(skill.trim())}</span>`).join('')}
        </div>
      </section>
  ` : '';

  const educationHTML = data.education && data.education.length > 0 ? `
      <section id="education" class="resume-section">
        <h2 class="resume-section__title">Education</h2>
        <div class="education-list">
          ${data.education.map(edu => `
          <div class="education-item">
            <h3 class="education-item__title">${escapeHtml(edu.degree)}</h3>
            ${edu.school ? `<p class="education-item__subtitle">${escapeHtml(edu.school)}</p>` : ''}
            ${edu.year ? `<span class="education-item__date">${escapeHtml(edu.year)}</span>` : ''}
          </div>
          `).join('')}
        </div>
      </section>
  ` : '';

  const certificationsHTML = data.certifications && data.certifications.length > 0 ? `
      <section id="certifications" class="resume-section">
        <h2 class="resume-section__title">Certifications</h2>
        <div class="certifications-list">
          ${data.certifications.map(cert => `
          <div class="certification-item">
            <span class="certification-item__title">${escapeHtml(cert.name)}</span>
            <span class="certification-item__meta">${escapeHtml(cert.issuer)}${cert.year ? ` · ${escapeHtml(cert.year)}` : ''}</span>
          </div>
          `).join('')}
        </div>
      </section>
  ` : '';

  // Build contact links with icons
  const contactLinksHTML = [];

  // Email (always shown if provided)
  if (data.email) {
    contactLinksHTML.push(`<a href="mailto:${escapeHtml(data.email)}" class="contact-item" title="Email">
      <svg class="contact-item__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2"></rect>
        <path d="M22 7l-10 6L2 7"></path>
      </svg>
      <span>${escapeHtml(data.email)}</span>
    </a>`);
  }

  // Phone
  if (data.phone) {
    contactLinksHTML.push(`<a href="tel:${escapeHtml(data.phone.replace(/\s/g, ''))}" class="contact-item" title="Phone">
      <svg class="contact-item__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
      </svg>
      <span>${escapeHtml(data.phone)}</span>
    </a>`);
  }

  // Website
  if (data.website) {
    const websiteUrl = data.website.startsWith('http') ? data.website : `https://${data.website}`;
    const websiteDisplay = data.website.replace(/^https?:\/\//, '').replace(/\/$/, '');
    contactLinksHTML.push(`<a href="${escapeHtml(websiteUrl)}" target="_blank" rel="noopener noreferrer" class="contact-item" title="Website">
      <svg class="contact-item__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="2" y1="12" x2="22" y2="12"></line>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
      </svg>
      <span>${escapeHtml(websiteDisplay)}</span>
    </a>`);
  }

  // LinkedIn
  if (data.linkedin) {
    const linkedinUrl = data.linkedin.startsWith('http') ? data.linkedin : `https://${data.linkedin}`;
    contactLinksHTML.push(`<a href="${escapeHtml(linkedinUrl)}" target="_blank" rel="noopener noreferrer" class="contact-item" title="LinkedIn">
      <svg class="contact-item__icon" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
      <span>LinkedIn</span>
    </a>`);
  }

  // GitHub
  if (data.github) {
    const githubUrl = data.github.startsWith('http') ? data.github : `https://${data.github}`;
    contactLinksHTML.push(`<a href="${escapeHtml(githubUrl)}" target="_blank" rel="noopener noreferrer" class="contact-item" title="GitHub">
      <svg class="contact-item__icon" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
      <span>GitHub</span>
    </a>`);
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script>
    (function() {
      var theme = localStorage.getItem('theme');
      if (theme) {
        document.documentElement.setAttribute('data-theme', theme);
      }
    })();
  </script>
  <meta name="description" content="${escapeHtml(data.role)} - ${escapeHtml(data.fullName)}. ${escapeHtml(data.intro.substring(0, 150))}">
  <meta name="author" content="${escapeHtml(data.fullName)}">

  <title>${escapeHtml(data.fullName)} - ${escapeHtml(data.role)}</title>

  <meta name="theme-color" content="#FAFAF8" media="(prefers-color-scheme: light)">
  <meta name="theme-color" content="#1A1A1A" media="(prefers-color-scheme: dark)">

  <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${initials}</text></svg>">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <a href="#main-content" class="skip-to-content">Skip to main content</a>

  <header class="header">
    <nav class="nav">
      <a href="#" class="nav__brand">
        <span class="brand-badge">${initials}</span>
        <span class="brand-name">${escapeHtml(data.fullName)}</span>
      </a>
      <button class="theme-toggle" aria-label="Toggle dark mode">
        <span class="theme-toggle__icon"></span>
      </button>
    </nav>
  </header>

  <main id="main-content">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero__container">
        <p class="hero__greeting">Hi, I'm</p>
        <h1 class="hero__name">${escapeHtml(data.fullName)}</h1>
        <p class="hero__role">${escapeHtml(data.role)}${data.location ? ` · ${escapeHtml(data.location)}` : ''}</p>
        <div class="hero__intro">
          <p>${escapeHtml(data.intro)}</p>
        </div>
        ${contactLinksHTML.length > 0 ? `<div class="hero__contact">${contactLinksHTML.join('')}</div>` : ''}
      </div>
    </section>

    <!-- Resume Content -->
    <div class="resume-content">
      <section id="experience" class="resume-section">
        <h2 class="resume-section__title">Experience</h2>
        <div class="timeline">
${experienceHTML}
        </div>
      </section>

${skillsHTML}
${educationHTML}
${certificationsHTML}
    </div>
  </main>

  <footer class="footer">
    <div class="footer__content">
      <div class="footer__row">
        <p class="footer__text">&copy; ${new Date().getFullYear()} ${escapeHtml(data.fullName)}</p>
        <button class="theme-toggle theme-toggle--footer" aria-label="Toggle dark mode">
          <span class="theme-toggle__icon"></span>
        </button>
      </div>
    </div>
  </footer>

  <script>
    // Theme toggle functionality
    document.querySelectorAll('.theme-toggle').forEach(function(toggle) {
      toggle.addEventListener('click', function() {
        var currentTheme = document.documentElement.getAttribute('data-theme');
        var newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        if (newTheme === 'light') {
          document.documentElement.removeAttribute('data-theme');
          localStorage.removeItem('theme');
        } else {
          document.documentElement.setAttribute('data-theme', newTheme);
          localStorage.setItem('theme', newTheme);
        }
      });
    });
  </script>
</body>
</html>`;
}

/**
 * Generate the CSS template for the portfolio
 * @param {string} themeId - Selected theme ID
 * @returns {string} CSS content
 */
function generateCSS(themeId) {
  const themeCSS = generateThemeCSS(themeId);

  return `/* ============================================
   PORTFOLIO STYLES
   Generated by Portfolio Generator
   ============================================ */

${themeCSS}

/* Typography */
:root {
  --font-sans: "Inter", -apple-system, BlinkMacSystemFont, "Helvetica Neue", "Arial", sans-serif;

  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 2rem;
  --font-size-4xl: 2.5rem;

  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --space-4: 0.25rem;
  --space-8: 0.5rem;
  --space-12: 0.75rem;
  --space-16: 1rem;
  --space-20: 1.25rem;
  --space-24: 1.5rem;
  --space-32: 2rem;
  --space-40: 2.5rem;
  --space-48: 3rem;
  --space-64: 4rem;
  --space-80: 5rem;

  /* Layout */
  --max-width-content: 720px;
  --header-height: 56px;

  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-full: 9999px;

  /* Transitions */
  --ease-out: cubic-bezier(0.4, 0, 0.2, 1);
  --transition-fast: 0.2s var(--ease-out);
  --transition-base: 0.3s var(--ease-out);
}

/* Reset */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
  scroll-behavior: smooth;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-family: var(--font-sans);
  font-size: var(--font-size-base);
  line-height: 1.6;
  color: var(--color-text);
  background-color: var(--color-bg);
  transition: background-color 0.3s var(--ease-out), color 0.3s var(--ease-out);
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
  padding-top: var(--header-height);
}

a {
  color: var(--color-primary);
  text-decoration: none;
  transition: color var(--transition-fast);
}

a:hover {
  color: var(--color-primary-dark);
}

ul, ol {
  list-style: none;
}

/* Skip Link */
.skip-to-content {
  position: absolute;
  top: -100px;
  left: var(--space-16);
  z-index: 9999;
  background-color: var(--color-primary);
  color: white;
  padding: var(--space-12) var(--space-24);
  border-radius: var(--radius-md);
  font-weight: var(--font-weight-semibold);
  text-decoration: none;
  transition: top var(--transition-fast);
}

.skip-to-content:focus {
  top: var(--space-16);
}

/* Header */
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--header-height);
  background-color: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
  z-index: 100;
  transition: background-color var(--transition-base);
}

.nav {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-24);
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav__brand {
  display: flex;
  align-items: center;
  gap: var(--space-12);
  text-decoration: none;
  transition: opacity var(--transition-fast);
}

.nav__brand:hover {
  opacity: 0.7;
}

.brand-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  color: white;
  font-size: 14px;
  font-weight: var(--font-weight-bold);
  border-radius: 50%;
}

.brand-name {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
}

/* Theme Toggle */
.theme-toggle {
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--space-12);
  min-width: 44px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  transition: all var(--transition-fast);
  border-radius: var(--radius-full);
}

.theme-toggle:hover {
  color: var(--color-text);
  background-color: var(--color-bg-tertiary);
}

.theme-toggle__icon {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid currentColor;
  position: relative;
}

.theme-toggle__icon::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 6px;
  height: 6px;
  background: currentColor;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

[data-theme="dark"] .theme-toggle__icon::before {
  width: 14px;
  height: 14px;
  background: var(--color-bg);
  top: -2px;
  left: 6px;
  transform: none;
}

.theme-toggle--footer {
  background: none;
  border: 1px solid var(--color-border);
  width: 36px;
  height: 36px;
  border-radius: var(--radius-full);
}

.theme-toggle--footer:hover {
  border-color: var(--color-border-hover);
}

/* Hero Section */
.hero {
  min-height: calc(100vh - var(--header-height));
  min-height: calc(100dvh - var(--header-height));
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-64) var(--space-24);
  text-align: center;
}

.hero__container {
  max-width: 600px;
}

.hero__greeting {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-8);
}

.hero__name {
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(2.5rem, 8vw, 3.5rem);
  font-weight: 400;
  font-style: italic;
  color: var(--color-primary);
  letter-spacing: -0.01em;
  line-height: 1.1;
  margin-bottom: var(--space-16);
}

.hero__name::after {
  content: '';
  display: block;
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, var(--color-primary), var(--color-primary-light));
  margin: var(--space-16) auto 0;
  border-radius: 2px;
}

.hero__role {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
  margin-bottom: var(--space-32);
}

.hero__intro {
  margin-bottom: var(--space-40);
}

.hero__intro p {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  line-height: 1.7;
}

.hero__contact {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-16) var(--space-24);
  margin-top: var(--space-8);
}

.contact-item {
  display: inline-flex;
  align-items: center;
  gap: var(--space-8);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  text-decoration: none;
  padding: var(--space-8) var(--space-12);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.contact-item:hover {
  color: var(--color-primary);
  background: var(--color-bg-secondary);
}

.contact-item__icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-8);
  padding: var(--space-12) var(--space-24);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  font-family: inherit;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  min-height: 44px;
  border: none;
  text-decoration: none;
}

.btn--primary {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  color: white;
}

.btn--primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  color: white;
}

/* Resume Content */
.resume-content {
  max-width: var(--max-width-content);
  margin: 0 auto;
  padding: var(--space-64) var(--space-24);
}

.resume-section {
  margin-bottom: var(--space-64);
}

.resume-section:last-child {
  margin-bottom: 0;
}

.resume-section__title {
  font-size: 13px;
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: var(--space-24);
  padding-bottom: var(--space-12);
  border-bottom: 2px solid var(--color-primary);
  display: inline-block;
}

/* Timeline */
.timeline {
  display: flex;
  flex-direction: column;
  gap: var(--space-40);
}

.timeline-item {
  position: relative;
  padding-left: var(--space-40);
  padding-right: var(--space-16);
  padding-top: var(--space-8);
  padding-bottom: var(--space-8);
  margin-left: calc(var(--space-8) * -1);
  border-radius: var(--radius-lg);
  transition: background-color var(--transition-fast);
}

.timeline-item:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

[data-theme="dark"] .timeline-item:hover {
  background-color: rgba(255, 255, 255, 0.03);
}

.timeline-item::before {
  content: '';
  position: absolute;
  left: var(--space-8);
  top: 14px;
  width: 10px;
  height: 10px;
  background-color: var(--color-primary);
  border-radius: 50%;
  box-shadow: 0 0 0 3px var(--color-bg), 0 0 0 4px rgba(0, 0, 0, 0.1);
}

.timeline-item::after {
  content: '';
  position: absolute;
  left: calc(var(--space-8) + 4px);
  top: 30px;
  width: 2px;
  height: calc(100% + var(--space-24));
  background: linear-gradient(to bottom, var(--color-border) 0%, transparent 100%);
  border-radius: 1px;
}

.timeline-item:last-child::after {
  display: none;
}

.timeline-item__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-16);
  flex-wrap: wrap;
  gap: var(--space-12);
}

.timeline-item__title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
  margin-bottom: var(--space-4);
}

.timeline-item__subtitle {
  font-size: var(--font-size-base);
  color: var(--color-primary);
  font-weight: var(--font-weight-medium);
}

.timeline-item__date {
  font-size: var(--font-size-sm);
  color: var(--color-text-tertiary);
  white-space: nowrap;
}

.timeline-item__description {
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin-top: var(--space-16);
}

.timeline-item__list {
  margin-top: var(--space-20);
}

.timeline-item__list li {
  position: relative;
  padding-left: var(--space-20);
  margin-bottom: var(--space-12);
  color: var(--color-text-secondary);
  line-height: 1.6;
}

.timeline-item__list li::before {
  content: '';
  position: absolute;
  left: var(--space-8);
  top: 10px;
  width: 4px;
  height: 4px;
  background-color: var(--color-primary);
  border-radius: 50%;
}

/* Skills */
.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.skill-pill {
  display: inline-flex;
  align-items: center;
  padding: 6px 14px;
  background-color: var(--color-bg-secondary);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: 13px;
  font-weight: var(--font-weight-medium);
}

/* Education */
.education-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

.education-item {
  padding: var(--space-16);
  margin: 0 calc(var(--space-16) * -1);
  border-radius: var(--radius-lg);
  transition: background-color var(--transition-fast);
}

.education-item:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

[data-theme="dark"] .education-item:hover {
  background-color: rgba(255, 255, 255, 0.03);
}

.education-item__title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
  margin-bottom: var(--space-4);
}

.education-item__subtitle {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-4);
}

.education-item__date {
  font-size: var(--font-size-sm);
  color: var(--color-text-tertiary);
}

/* Certifications */
.certifications-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
}

.certification-item {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: var(--space-16);
  padding: var(--space-12) var(--space-16);
  margin: 0 calc(var(--space-16) * -1);
  border-bottom: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  transition: background-color var(--transition-fast);
}

.certification-item:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

[data-theme="dark"] .certification-item:hover {
  background-color: rgba(255, 255, 255, 0.03);
}

.certification-item:last-child {
  border-bottom: none;
}

.certification-item__title {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
}

.certification-item__meta {
  font-size: var(--font-size-sm);
  color: var(--color-text-tertiary);
  white-space: nowrap;
}

/* Footer */
.footer {
  background-color: var(--color-bg-secondary);
  border-top: 1px solid var(--color-border);
  padding: var(--space-40) var(--space-24);
}

.footer__content {
  max-width: var(--max-width-content);
  margin: 0 auto;
  text-align: center;
}

.footer__row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-16);
}

.footer__text {
  color: var(--color-text-tertiary);
  font-size: var(--font-size-sm);
}

/* Focus States */
*:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

*:focus:not(:focus-visible) {
  outline: none;
}

*:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Responsive */
@media (max-width: 768px) {
  .hero {
    padding: var(--space-48) var(--space-16);
  }

  .hero__name {
    font-size: clamp(2rem, 10vw, 2.5rem);
  }

  .hero__role {
    font-size: var(--font-size-base);
    margin-bottom: var(--space-24);
  }

  .hero__intro p {
    font-size: var(--font-size-base);
  }

  .hero__contact {
    flex-direction: column;
    align-items: center;
    gap: var(--space-8);
  }

  .contact-item {
    width: 100%;
    max-width: 280px;
    justify-content: center;
  }

  .nav {
    padding: 0 var(--space-16);
  }

  .resume-content {
    padding: var(--space-40) var(--space-16);
  }

  .timeline-item {
    padding-left: var(--space-24);
  }

  .timeline-item__header {
    flex-direction: column;
  }

  .certification-item {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-4);
  }
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero__greeting,
.hero__name,
.hero__role,
.hero__intro,
.hero__contact {
  animation: fadeInUp 0.5s var(--ease-out) both;
}

.hero__greeting { animation-delay: 0.1s; }
.hero__name { animation-delay: 0.2s; }
.hero__role { animation-delay: 0.3s; }
.hero__intro { animation-delay: 0.4s; }
.hero__contact { animation-delay: 0.5s; }

@media (prefers-reduced-motion: reduce) {
  .hero__greeting,
  .hero__name,
  .hero__role,
  .hero__intro,
  .hero__contact {
    animation: none;
  }
}
`;
}

/**
 * Generate README content with hosting instructions
 * @param {Object} data - Form data
 * @returns {string} README content
 */
function generateREADME(data) {
  return `# ${data.fullName}'s Portfolio

A professional portfolio website generated with Portfolio Generator.

## Quick Start

1. **Open locally**: Simply open \`index.html\` in your browser to preview.

2. **Host on GitHub Pages** (Free):
   - Create a new repository on GitHub
   - Upload all files from this folder
   - Go to Settings > Pages
   - Select "Deploy from a branch" and choose \`main\`
   - Your site will be live at \`https://[username].github.io/[repo-name]\`

3. **Custom domain** (Optional):
   - In repository Settings > Pages, add your custom domain
   - Update DNS records with your domain provider
   - HTTPS will be automatically enabled

## Files

\`\`\`
portfolio/
├── index.html    <- Your portfolio
├── css/
│   └── style.css <- Theme and styling
└── README.md     <- This file
\`\`\`

## Features

- Responsive design (mobile-friendly)
- Dark/light mode toggle
- Clean, professional layout
- Fast loading (no external dependencies except fonts)

## Customization

- **Colors**: Edit CSS variables in \`css/style.css\` under \`:root\` and \`[data-theme="dark"]\`
- **Content**: Edit \`index.html\` directly
- **Fonts**: Change the Google Fonts link in \`index.html\`

---

Generated with [Portfolio Generator](https://kpruthvi.com/generator/)
`;
}
