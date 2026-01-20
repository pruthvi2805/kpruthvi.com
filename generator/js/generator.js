/**
 * Portfolio Generator - Main Application
 */

// ============================================
// STORAGE MANAGER
// ============================================

const StorageManager = {
  DRAFT_KEY: 'portfolio-generator-draft',

  save(data) {
    try {
      localStorage.setItem(this.DRAFT_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Could not save draft:', e);
    }
  },

  load() {
    try {
      const data = localStorage.getItem(this.DRAFT_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.warn('Could not load draft:', e);
      return null;
    }
  },

  clear() {
    try {
      localStorage.removeItem(this.DRAFT_KEY);
    } catch (e) {
      console.warn('Could not clear draft:', e);
    }
  }
};

// ============================================
// TOAST MANAGER
// ============================================

const ToastManager = {
  element: null,
  timeout: null,

  init() {
    this.element = document.getElementById('toast');
  },

  show(message, type = 'info') {
    if (!this.element) return;

    // Clear any existing timeout
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    // Reset classes
    this.element.className = 'toast';
    this.element.textContent = message;

    if (type === 'success') {
      this.element.classList.add('toast--success');
    } else if (type === 'error') {
      this.element.classList.add('toast--error');
    }

    // Show toast
    this.element.classList.add('show');

    // Auto hide after 4 seconds
    this.timeout = setTimeout(() => {
      this.element.classList.remove('show');
    }, 4000);
  }
};

// ============================================
// THEME PREVIEW MANAGER
// ============================================

const ThemePreviewManager = {
  originalTheme: null,
  styleElement: null,

  init() {
    // Store the original page theme
    this.originalTheme = document.documentElement.getAttribute('data-theme');

    // Create a style element for theme preview
    this.styleElement = document.createElement('style');
    this.styleElement.id = 'theme-preview-styles';
    document.head.appendChild(this.styleElement);

    // Set up theme card click handlers
    this.setupThemeCards();

    // Apply initial theme (warm is the default for this page, but check selected)
    const selectedTheme = document.querySelector('input[name="theme"]:checked');
    if (selectedTheme) {
      this.applyThemePreview(selectedTheme.value);
      this.updateThemeNameDisplay(selectedTheme.value);
    }
  },

  setupThemeCards() {
    const themeCards = document.querySelectorAll('.theme-card input[name="theme"]');
    themeCards.forEach(input => {
      input.addEventListener('change', (e) => {
        this.applyThemePreview(e.target.value);
        this.updateThemeNameDisplay(e.target.value);
      });
    });
  },

  updateThemeNameDisplay(themeId) {
    const themeNameElement = document.getElementById('selected-theme-name');
    if (!themeNameElement) return;

    const themeNames = {
      'minimal-light': 'Minimal Light',
      'forest': 'Forest Green',
      'warm': 'Warm Terracotta',
      'cool': 'Cool Blue'
    };

    themeNameElement.textContent = themeNames[themeId] || themeId;
  },

  applyThemePreview(themeId) {
    const theme = THEMES[themeId];
    if (!theme) return;

    // Determine if we're in dark mode or light mode for preview
    const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
    const vars = isDarkMode ? theme.dark : theme.light;

    // Build CSS variables string
    const cssVars = Object.entries(vars)
      .map(([key, value]) => `${key}: ${value};`)
      .join('\n  ');

    // Apply to root
    this.styleElement.textContent = `
      :root {
        ${Object.entries(theme.light).map(([key, value]) => `${key}: ${value};`).join('\n        ')}
      }
      [data-theme="dark"] {
        ${Object.entries(theme.dark).map(([key, value]) => `${key}: ${value};`).join('\n        ')}
      }
    `;
  }
};

// ============================================
// FORM MANAGER
// ============================================

const FormManager = {
  form: null,
  experienceContainer: null,
  educationContainer: null,
  certificationContainer: null,
  experienceCount: 0,
  educationCount: 0,
  certificationCount: 0,
  saveTimeout: null,

  init() {
    this.form = document.getElementById('portfolio-form');
    this.experienceContainer = document.getElementById('experience-entries');
    this.educationContainer = document.getElementById('education-entries');
    this.certificationContainer = document.getElementById('certification-entries');

    this.setupEventListeners();
    this.restoreDraft();
    this.setupAutoSave();
  },

  setupEventListeners() {
    // Add experience button
    document.getElementById('add-experience').addEventListener('click', () => {
      this.addExperienceEntry();
    });

    // Add education button
    document.getElementById('add-education').addEventListener('click', () => {
      this.addEducationEntry();
    });

    // Add certification button
    document.getElementById('add-certification').addEventListener('click', () => {
      this.addCertificationEntry();
    });

    // Form submission
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });

    // Preview button
    document.getElementById('preview-btn').addEventListener('click', () => {
      this.handlePreview();
    });

    // Remove entry handlers (delegated)
    this.experienceContainer.addEventListener('click', (e) => {
      if (e.target.closest('.entry-card__remove')) {
        const card = e.target.closest('.entry-card');
        if (card && this.experienceContainer.children.length > 1) {
          card.remove();
          this.renumberEntries(this.experienceContainer, 'Experience');
          this.saveDraft();
        }
      }
    });

    this.educationContainer.addEventListener('click', (e) => {
      if (e.target.closest('.entry-card__remove')) {
        const card = e.target.closest('.entry-card');
        if (card) {
          card.remove();
          this.renumberEntries(this.educationContainer, 'Education');
          this.saveDraft();
        }
      }
    });

    this.certificationContainer.addEventListener('click', (e) => {
      if (e.target.closest('.entry-card__remove')) {
        const card = e.target.closest('.entry-card');
        if (card) {
          card.remove();
          this.renumberEntries(this.certificationContainer, 'Certification');
          this.saveDraft();
        }
      }
    });
  },

  setupAutoSave() {
    // Save draft on input change (debounced)
    this.form.addEventListener('input', () => {
      if (this.saveTimeout) {
        clearTimeout(this.saveTimeout);
      }
      this.saveTimeout = setTimeout(() => {
        this.saveDraft();
      }, 1000);
    });
  },

  saveDraft() {
    const data = this.collectFormData();
    StorageManager.save(data);
  },

  restoreDraft() {
    const draft = StorageManager.load();

    if (draft) {
      // Restore basic fields
      const fields = ['fullName', 'role', 'location', 'intro', 'email', 'phone', 'website', 'linkedin', 'github', 'skills'];
      fields.forEach(field => {
        const input = document.getElementById(field);
        if (input && draft[field]) {
          input.value = draft[field];
        }
      });

      // Restore experiences
      if (draft.experiences && draft.experiences.length > 0) {
        draft.experiences.forEach((exp) => {
          this.addExperienceEntry(exp);
        });
      } else {
        this.addExperienceEntry();
      }

      // Restore education entries
      if (draft.education && draft.education.length > 0) {
        draft.education.forEach((edu) => {
          this.addEducationEntry(edu);
        });
      }

      // Restore certifications
      if (draft.certifications && draft.certifications.length > 0) {
        draft.certifications.forEach(cert => {
          this.addCertificationEntry(cert);
        });
      }

      // Restore theme and apply preview
      if (draft.theme) {
        const themeInput = document.querySelector(`input[name="theme"][value="${draft.theme}"]`);
        if (themeInput) {
          themeInput.checked = true;
          ThemePreviewManager.applyThemePreview(draft.theme);
        }
      }

      // Only show toast if there's meaningful data
      const hasContent = draft.fullName || draft.role || draft.intro || draft.email ||
        (draft.experiences && draft.experiences.some(exp => exp.title || exp.company));
      if (hasContent) {
        ToastManager.show('Draft restored', 'success');
      }
    } else {
      // Add default empty experience
      this.addExperienceEntry();
    }
  },

  addExperienceEntry(data = {}) {
    this.experienceCount++;
    const index = this.experienceCount;

    const entry = document.createElement('div');
    entry.className = 'entry-card';
    entry.dataset.type = 'experience';
    entry.innerHTML = `
      <div class="entry-card__header">
        <span class="entry-card__number">Experience #${index}</span>
        <button type="button" class="entry-card__remove" aria-label="Remove experience">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>
      <div class="form-grid">
        <div class="form-field">
          <label>Job Title <span class="required">*</span></label>
          <input type="text" name="exp_title_${index}" required placeholder="Senior Developer" value="${escapeAttr(data.title || '')}">
          <span class="form-field__error"></span>
        </div>
        <div class="form-field">
          <label>Company <span class="required">*</span></label>
          <input type="text" name="exp_company_${index}" required placeholder="Acme Inc." value="${escapeAttr(data.company || '')}">
          <span class="form-field__error"></span>
        </div>
        <div class="form-field">
          <label>Location</label>
          <input type="text" name="exp_location_${index}" placeholder="Amsterdam, NL" value="${escapeAttr(data.location || '')}">
        </div>
        <div class="form-field">
          <label>Dates <span class="required">*</span></label>
          <input type="text" name="exp_dates_${index}" required placeholder="Jan 2020 - Present" value="${escapeAttr(data.dates || '')}">
          <span class="form-field__error"></span>
        </div>
      </div>
      <div class="form-field form-field--full">
        <label>Key Responsibilities (one per line) <span class="required">*</span></label>
        <textarea name="exp_bullets_${index}" required rows="4" placeholder="Led development of customer-facing features&#10;Improved system performance by 40%&#10;Mentored junior developers">${escapeAttr(data.bullets ? data.bullets.join('\n') : '')}</textarea>
        <span class="form-field__error"></span>
      </div>
    `;

    this.experienceContainer.appendChild(entry);
  },

  addEducationEntry(data = {}) {
    this.educationCount++;
    const index = this.educationCount;

    const entry = document.createElement('div');
    entry.className = 'entry-card';
    entry.dataset.type = 'education';
    entry.innerHTML = `
      <div class="entry-card__header">
        <span class="entry-card__number">Education #${index}</span>
        <button type="button" class="entry-card__remove" aria-label="Remove education">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>
      <div class="form-grid">
        <div class="form-field">
          <label>Degree</label>
          <input type="text" name="edu_degree_${index}" placeholder="Bachelor of Science in Computer Science" value="${escapeAttr(data.degree || '')}">
        </div>
        <div class="form-field">
          <label>School / University</label>
          <input type="text" name="edu_school_${index}" placeholder="University of Amsterdam" value="${escapeAttr(data.school || '')}">
        </div>
        <div class="form-field">
          <label>Graduation Year</label>
          <input type="text" name="edu_year_${index}" placeholder="2020" value="${escapeAttr(data.year || '')}">
        </div>
      </div>
    `;

    this.educationContainer.appendChild(entry);
  },

  addCertificationEntry(data = {}) {
    this.certificationCount++;
    const index = this.certificationCount;

    const entry = document.createElement('div');
    entry.className = 'entry-card';
    entry.dataset.type = 'certification';
    entry.innerHTML = `
      <div class="entry-card__header">
        <span class="entry-card__number">Certification #${index}</span>
        <button type="button" class="entry-card__remove" aria-label="Remove certification">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>
      <div class="form-grid">
        <div class="form-field">
          <label>Certification Name</label>
          <input type="text" name="cert_name_${index}" placeholder="AWS Solutions Architect" value="${escapeAttr(data.name || '')}">
        </div>
        <div class="form-field">
          <label>Issuer</label>
          <input type="text" name="cert_issuer_${index}" placeholder="Amazon Web Services" value="${escapeAttr(data.issuer || '')}">
        </div>
        <div class="form-field">
          <label>Year</label>
          <input type="text" name="cert_year_${index}" placeholder="2023" value="${escapeAttr(data.year || '')}">
        </div>
      </div>
    `;

    this.certificationContainer.appendChild(entry);
  },

  renumberEntries(container, label) {
    const entries = container.querySelectorAll('.entry-card');
    entries.forEach((entry, idx) => {
      const number = idx + 1;
      entry.querySelector('.entry-card__number').textContent = `${label} #${number}`;
    });
  },

  collectFormData() {
    const formData = new FormData(this.form);
    const data = {
      fullName: formData.get('fullName') || '',
      role: formData.get('role') || '',
      location: formData.get('location') || '',
      intro: formData.get('intro') || '',
      email: formData.get('email') || '',
      phone: formData.get('phone') || '',
      website: formData.get('website') || '',
      linkedin: formData.get('linkedin') || '',
      github: formData.get('github') || '',
      skills: formData.get('skills') || '',
      theme: formData.get('theme') || 'minimal-light',
      experiences: [],
      education: [],
      certifications: []
    };

    // Collect experiences
    const expEntries = this.experienceContainer.querySelectorAll('.entry-card');
    expEntries.forEach((entry) => {
      const title = entry.querySelector('[name^="exp_title_"]')?.value || '';
      const company = entry.querySelector('[name^="exp_company_"]')?.value || '';
      const location = entry.querySelector('[name^="exp_location_"]')?.value || '';
      const dates = entry.querySelector('[name^="exp_dates_"]')?.value || '';
      const bulletsText = entry.querySelector('[name^="exp_bullets_"]')?.value || '';

      data.experiences.push({
        title,
        company,
        location,
        dates,
        bullets: bulletsText.split('\n').filter(b => b.trim())
      });
    });

    // Collect education
    const eduEntries = this.educationContainer.querySelectorAll('.entry-card');
    eduEntries.forEach(entry => {
      const degree = entry.querySelector('[name^="edu_degree_"]')?.value || '';
      const school = entry.querySelector('[name^="edu_school_"]')?.value || '';
      const year = entry.querySelector('[name^="edu_year_"]')?.value || '';

      if (degree || school) {
        data.education.push({ degree, school, year });
      }
    });

    // Collect certifications
    const certEntries = this.certificationContainer.querySelectorAll('.entry-card');
    certEntries.forEach(entry => {
      const name = entry.querySelector('[name^="cert_name_"]')?.value || '';
      const issuer = entry.querySelector('[name^="cert_issuer_"]')?.value || '';
      const year = entry.querySelector('[name^="cert_year_"]')?.value || '';

      if (name || issuer) {
        data.certifications.push({ name, issuer, year });
      }
    });

    return data;
  },

  validate() {
    let isValid = true;
    const data = this.collectFormData();

    // Clear previous errors
    this.form.querySelectorAll('.form-field--error').forEach(field => {
      field.classList.remove('form-field--error');
    });

    // Required fields
    const requiredFields = [
      { id: 'fullName', message: 'Full name is required' },
      { id: 'role', message: 'Role/title is required' },
      { id: 'location', message: 'Location is required' },
      { id: 'intro', message: 'Short intro is required' },
      { id: 'email', message: 'Email is required' }
    ];

    requiredFields.forEach(({ id, message }) => {
      const input = document.getElementById(id);
      if (!input.value.trim()) {
        this.showFieldError(input, message);
        isValid = false;
      }
    });

    // Validate email format
    const emailInput = document.getElementById('email');
    if (emailInput.value && !this.isValidEmail(emailInput.value)) {
      this.showFieldError(emailInput, 'Please enter a valid email');
      isValid = false;
    }

    // Validate at least one experience
    if (data.experiences.length === 0 || !data.experiences.some(exp => exp.title && exp.company && exp.dates && exp.bullets.length > 0)) {
      ToastManager.show('Please add at least one complete experience entry', 'error');
      isValid = false;
    }

    // Validate experience entries
    const expEntries = this.experienceContainer.querySelectorAll('.entry-card');
    expEntries.forEach(entry => {
      const titleInput = entry.querySelector('[name^="exp_title_"]');
      const companyInput = entry.querySelector('[name^="exp_company_"]');
      const datesInput = entry.querySelector('[name^="exp_dates_"]');
      const bulletsInput = entry.querySelector('[name^="exp_bullets_"]');

      if (!titleInput.value.trim()) {
        this.showFieldError(titleInput, 'Job title is required');
        isValid = false;
      }
      if (!companyInput.value.trim()) {
        this.showFieldError(companyInput, 'Company is required');
        isValid = false;
      }
      if (!datesInput.value.trim()) {
        this.showFieldError(datesInput, 'Dates are required');
        isValid = false;
      }
      if (!bulletsInput.value.trim()) {
        this.showFieldError(bulletsInput, 'At least one responsibility is required');
        isValid = false;
      }
    });

    return isValid;
  },

  showFieldError(input, message) {
    const field = input.closest('.form-field');
    if (field) {
      field.classList.add('form-field--error');
      const errorEl = field.querySelector('.form-field__error');
      if (errorEl) {
        errorEl.textContent = message;
      }
    }
  },

  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },

  async handleSubmit() {
    if (!this.validate()) {
      ToastManager.show('Please fix the errors above', 'error');
      // Scroll to first error
      const firstError = this.form.querySelector('.form-field--error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    const data = this.collectFormData();

    // Parse skills
    data.skills = data.skills ? data.skills.split(',').map(s => s.trim()).filter(s => s) : [];

    try {
      await ZipBuilder.generate(data);
      ToastManager.show('Portfolio downloaded!', 'success');
      // Clear draft after successful download
      StorageManager.clear();
    } catch (error) {
      console.error('Error generating portfolio:', error);
      ToastManager.show('Error generating portfolio. Please try again.', 'error');
    }
  },

  handlePreview() {
    const data = this.collectFormData();

    // Check if there's at least some basic info to preview
    if (!data.fullName.trim()) {
      ToastManager.show('Please enter your name to preview', 'error');
      document.getElementById('fullName').focus();
      return;
    }

    // Parse skills into array
    data.skills = data.skills ? data.skills.split(',').map(s => s.trim()).filter(s => s) : [];

    // Open preview in new tab
    PreviewManager.open(data);
    ToastManager.show('Preview opened in new tab', 'success');
  }
};

// ============================================
// PREVIEW MANAGER
// ============================================

const PreviewManager = {
  previewWindow: null,

  /**
   * Generate a preview and open it in a new tab
   * @param {Object} data - Form data
   */
  open(data) {
    // Generate HTML with inline CSS (no external stylesheet needed for preview)
    const css = generateCSS(data.theme);
    const html = generateHTMLWithInlineCSS(data, css);

    // Create a blob from the HTML
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    // Open in new tab
    this.previewWindow = window.open(url, '_blank');

    // Clean up the blob URL after a delay (window needs time to load)
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 10000);
  }
};

/**
 * Generate HTML with CSS inlined (for preview)
 * @param {Object} data - Form data
 * @param {string} css - CSS content
 * @returns {string} Complete HTML with inline styles
 */
function generateHTMLWithInlineCSS(data, css) {
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
                <h3 class="timeline-item__title">${escapeHtmlTemplate(exp.title)}</h3>
                <p class="timeline-item__subtitle">${escapeHtmlTemplate(exp.company)}${exp.location ? ` · ${escapeHtmlTemplate(exp.location)}` : ''}</p>
              </div>
              <span class="timeline-item__date">${escapeHtmlTemplate(exp.dates)}</span>
            </div>
            <div class="timeline-item__description">
              <ul class="timeline-item__list">
                ${exp.bullets.filter(b => b.trim()).map(bullet => `
                <li>${escapeHtmlTemplate(bullet)}</li>
                `).join('')}
              </ul>
            </div>
          </article>
  `).join('');

  const skillsHTML = data.skills && data.skills.length > 0 ? `
      <section id="skills" class="resume-section">
        <h2 class="resume-section__title">Skills</h2>
        <div class="skills-list">
          ${data.skills.map(skill => `<span class="skill-pill">${escapeHtmlTemplate(skill.trim())}</span>`).join('')}
        </div>
      </section>
  ` : '';

  const educationHTML = data.education && data.education.length > 0 ? `
      <section id="education" class="resume-section">
        <h2 class="resume-section__title">Education</h2>
        <div class="education-list">
          ${data.education.map(edu => `
          <div class="education-item">
            <h3 class="education-item__title">${escapeHtmlTemplate(edu.degree)}</h3>
            ${edu.school ? `<p class="education-item__subtitle">${escapeHtmlTemplate(edu.school)}</p>` : ''}
            ${edu.year ? `<span class="education-item__date">${escapeHtmlTemplate(edu.year)}</span>` : ''}
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
            <span class="certification-item__title">${escapeHtmlTemplate(cert.name)}</span>
            <span class="certification-item__meta">${escapeHtmlTemplate(cert.issuer)}${cert.year ? ` · ${escapeHtmlTemplate(cert.year)}` : ''}</span>
          </div>
          `).join('')}
        </div>
      </section>
  ` : '';

  // Build contact links with icons
  const contactLinksHTML = [];

  // Email (always shown if provided)
  if (data.email) {
    contactLinksHTML.push(`<a href="mailto:${escapeHtmlTemplate(data.email)}" class="contact-item" title="Email">
      <svg class="contact-item__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2"></rect>
        <path d="M22 7l-10 6L2 7"></path>
      </svg>
      <span>${escapeHtmlTemplate(data.email)}</span>
    </a>`);
  }

  // Phone
  if (data.phone) {
    contactLinksHTML.push(`<a href="tel:${escapeHtmlTemplate(data.phone.replace(/\s/g, ''))}" class="contact-item" title="Phone">
      <svg class="contact-item__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
      </svg>
      <span>${escapeHtmlTemplate(data.phone)}</span>
    </a>`);
  }

  // Website
  if (data.website) {
    const websiteUrl = data.website.startsWith('http') ? data.website : `https://${data.website}`;
    const websiteDisplay = data.website.replace(/^https?:\/\//, '').replace(/\/$/, '');
    contactLinksHTML.push(`<a href="${escapeHtmlTemplate(websiteUrl)}" target="_blank" rel="noopener noreferrer" class="contact-item" title="Website">
      <svg class="contact-item__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="2" y1="12" x2="22" y2="12"></line>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
      </svg>
      <span>${escapeHtmlTemplate(websiteDisplay)}</span>
    </a>`);
  }

  // LinkedIn
  if (data.linkedin) {
    const linkedinUrl = data.linkedin.startsWith('http') ? data.linkedin : `https://${data.linkedin}`;
    contactLinksHTML.push(`<a href="${escapeHtmlTemplate(linkedinUrl)}" target="_blank" rel="noopener noreferrer" class="contact-item" title="LinkedIn">
      <svg class="contact-item__icon" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
      <span>LinkedIn</span>
    </a>`);
  }

  // GitHub
  if (data.github) {
    const githubUrl = data.github.startsWith('http') ? data.github : `https://${data.github}`;
    contactLinksHTML.push(`<a href="${escapeHtmlTemplate(githubUrl)}" target="_blank" rel="noopener noreferrer" class="contact-item" title="GitHub">
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
      var theme = localStorage.getItem('portfolio-preview-theme');
      if (theme) {
        document.documentElement.setAttribute('data-theme', theme);
      }
    })();
  </script>
  <title>${escapeHtmlTemplate(data.fullName)} - ${escapeHtmlTemplate(data.role)} (Preview)</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
${css}

/* Preview banner */
.preview-banner {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  color: white;
  text-align: center;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}
.preview-banner button {
  background: rgba(255,255,255,0.2);
  border: 1px solid rgba(255,255,255,0.3);
  color: white;
  padding: 6px 14px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: background 0.2s;
}
.preview-banner button:hover {
  background: rgba(255,255,255,0.3);
}
.header { top: 44px !important; }
main { padding-top: calc(var(--header-height) + 44px) !important; }

/* Contact items with icons */
.hero__contact {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px 24px;
  margin-top: 8px;
}
.contact-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--color-text-secondary);
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.2s ease;
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
@media (max-width: 600px) {
  .hero__contact {
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }
  .contact-item {
    width: 100%;
    max-width: 280px;
    justify-content: center;
  }
}
  </style>
</head>
<body>
  <div class="preview-banner">
    <span>This is a preview of your portfolio</span>
    <button onclick="window.close()">Close Preview</button>
  </div>

  <a href="#main-content" class="skip-to-content">Skip to main content</a>

  <header class="header">
    <nav class="nav">
      <a href="#" class="nav__brand">
        <span class="brand-badge">${initials}</span>
        <span class="brand-name">${escapeHtmlTemplate(data.fullName)}</span>
      </a>
      <button class="theme-toggle" aria-label="Toggle dark mode">
        <span class="theme-toggle__icon"></span>
      </button>
    </nav>
  </header>

  <main id="main-content">
    <section class="hero">
      <div class="hero__container">
        <p class="hero__greeting">Hi, I'm</p>
        <h1 class="hero__name">${escapeHtmlTemplate(data.fullName)}</h1>
        <p class="hero__role">${escapeHtmlTemplate(data.role)}${data.location ? ` · ${escapeHtmlTemplate(data.location)}` : ''}</p>
        <div class="hero__intro">
          <p>${escapeHtmlTemplate(data.intro)}</p>
        </div>
        ${contactLinksHTML.length > 0 ? `<div class="hero__contact">${contactLinksHTML.join('')}</div>` : ''}
      </div>
    </section>

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
        <p class="footer__text">&copy; ${new Date().getFullYear()} ${escapeHtmlTemplate(data.fullName)}</p>
        <button class="theme-toggle theme-toggle--footer" aria-label="Toggle dark mode">
          <span class="theme-toggle__icon"></span>
        </button>
      </div>
    </div>
  </footer>

  <script>
    document.querySelectorAll('.theme-toggle').forEach(function(toggle) {
      toggle.addEventListener('click', function() {
        var currentTheme = document.documentElement.getAttribute('data-theme');
        var newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        if (newTheme === 'light') {
          document.documentElement.removeAttribute('data-theme');
          localStorage.removeItem('portfolio-preview-theme');
        } else {
          document.documentElement.setAttribute('data-theme', newTheme);
          localStorage.setItem('portfolio-preview-theme', newTheme);
        }
      });
    });
  </script>
</body>
</html>`;
}

/**
 * Escape HTML for template strings (used in preview)
 */
function escapeHtmlTemplate(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ============================================
// ZIP BUILDER
// ============================================

const ZipBuilder = {
  async generate(data) {
    const zip = new JSZip();
    const folder = zip.folder('portfolio');

    // Generate files
    const html = generateHTML(data);
    const css = generateCSS(data.theme);
    const readme = generateREADME(data);

    // Add files to ZIP
    folder.file('index.html', html);
    folder.folder('css').file('style.css', css);
    folder.file('README.md', readme);

    // Generate and download ZIP
    const content = await zip.generateAsync({ type: 'blob' });
    const filename = `${slugify(data.fullName)}-portfolio.zip`;
    saveAs(content, filename);
  }
};

// ============================================
// THEME TOGGLE
// ============================================

function initThemeToggle() {
  const toggle = document.querySelector('.theme-toggle');
  if (!toggle) return;

  toggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    if (newTheme === 'light') {
      document.documentElement.removeAttribute('data-theme');
      localStorage.removeItem('theme');
    } else {
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    }

    // Re-apply the selected portfolio theme preview for the new mode
    const selectedTheme = document.querySelector('input[name="theme"]:checked');
    if (selectedTheme) {
      ThemePreviewManager.applyThemePreview(selectedTheme.value);
    }
  });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function escapeAttr(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  ToastManager.init();
  ThemePreviewManager.init();
  FormManager.init();
  initThemeToggle();
});
