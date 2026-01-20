# Editing Guide

A quick reference for updating your portfolio content.

---

## File Overview

| File | What's in it |
|------|--------------|
| `index.html` | Home page - intro text, tagline |
| `resume.html` | Resume - jobs, skills, education, certifications |
| `contact.html` | Contact page - description, email, social links |

---

## Home Page (`index.html`)

### Update intro text

Find this section (around line 84):

```html
<div class="home__intro">
  <p>
    I enjoy a good challenge. Mostly banks so far, but always curious about what's next.
  </p>
  <p>
    Based in Utrecht, Netherlands. Originally from India.
  </p>
</div>
```

Edit the text inside the `<p>` tags.

### Update job title

Find this line (around line 81):

```html
<p class="home__role">Senior Pega System Architect</p>
```

---

## Resume Page (`resume.html`)

### Add a new job

Find the `<div class="timeline">` section (around line 133). Copy this template and paste it **at the top** (newest job first):

```html
<article class="timeline-item">
  <div class="timeline-item__header">
    <div>
      <h3 class="timeline-item__title">YOUR JOB TITLE</h3>
      <p class="timeline-item__subtitle">COMPANY NAME · COUNTRY</p>
    </div>
    <span class="timeline-item__date">START DATE – END DATE</span>
  </div>
  <div class="timeline-item__description">
    <ul class="timeline-item__list">
      <li>First accomplishment or responsibility</li>
      <li>Second accomplishment or responsibility</li>
      <li>Third accomplishment or responsibility</li>
    </ul>
  </div>
</article>
```

Replace the UPPERCASE text with your details.

### Edit an existing job

Find the job by searching for the company name. Edit the text directly.

### Update professional summary

Find this section (around line 119):

```html
<section id="professional-summary" class="resume-section">
  <h1 class="resume-section__title">Professional Summary</h1>
  <p>
    Your summary text here...
  </p>
</section>
```

---

### Add a new skill

Find the relevant skill group in the `<section id="skills">` section (around line 247).

Add a new skill pill inside the `<div class="skill-group__pills">`:

```html
<span class="skill-pill">New Skill Name</span>
```

### Add a new skill group

Copy this template and paste it inside the `<div class="skills-hierarchy">`:

```html
<div class="skill-group">
  <div class="skill-group__header">
    <h3 class="skill-group__title">GROUP TITLE</h3>
    <p class="skill-group__context">Brief description of this skill area.</p>
  </div>
  <div class="skill-group__pills">
    <span class="skill-pill">Skill 1</span>
    <span class="skill-pill">Skill 2</span>
    <span class="skill-pill">Skill 3</span>
  </div>
</div>
```

---

### Add a new certification

Find `<section id="certifications">` (around line 329). Add inside `<div class="certifications-list">`:

```html
<div class="certification-item">
  <span class="certification-item__title">CERTIFICATION NAME</span>
  <span class="certification-item__meta">ISSUER · YEAR</span>
</div>
```

---

### Update education

Find `<section id="education">` (around line 318). Edit the text directly:

```html
<div class="education-item">
  <h3 class="education-item__title">DEGREE NAME</h3>
  <p class="education-item__subtitle">UNIVERSITY · LOCATION</p>
  <span class="education-item__date">Graduated YEAR</span>
  <p class="education-item__description">Optional description.</p>
</div>
```

---

## Contact Page (`contact.html`)

### Update description

Find this section (around line 79):

```html
<p class="contact-description">
  Open to senior Pega architecture roles, consulting engagements...
</p>
```

### Update email

Find (around line 84):

```html
<p><a href="mailto:me@kpruthvi.com" class="contact-link">me@kpruthvi.com</a></p>
```

Update both the `href="mailto:..."` and the visible text.

### Update location

Find (around line 85):

```html
<p>Utrecht, Netherlands</p>
```

---

## How to Deploy

After making changes:

1. Open terminal in your project folder

2. Run these commands:

```bash
git add .
git commit -m "describe your change"
git push
```

3. Wait ~1 minute for the site to update

---

## Tips

- **Preview locally**: Open the HTML file in your browser to check changes before deploying
- **One change at a time**: Make small updates and deploy, rather than many changes at once
- **Keep backups**: If unsure, copy the file before editing
- **Formatting matters**: Don't delete the HTML tags (`<p>`, `<li>`, etc.) - only edit the text inside them
