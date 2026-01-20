# kpruthvi.com

Personal hub site with portfolio showcase and interactive tools.

Built with vanilla HTML, CSS, and JavaScript — no frameworks, no build tools.

---

## Live Site

👉 **https://kpruthvi.com**

---

## Structure

```
kpruthvi.com/
├── index.html              ← Hub (terminal-themed landing page)
├── contact.html            ← Hub contact page
├── portfolio/              ← Personal portfolio
│   ├── index.html          ← Portfolio home
│   ├── resume.html         ← Resume/CV
│   ├── contact.html        ← Portfolio contact
│   ├── css/
│   └── js/
├── generator/              ← Portfolio Generator tool
│   ├── index.html
│   ├── css/
│   ├── js/
│   └── libs/
├── worker.js               ← Cloudflare Worker (contact form)
└── docs/
    ├── EDITING-GUIDE.md    ← How to update content
    └── PROJECT-SPEC.md     ← Project specification
```

---

## Features

### Hub
- Terminal-themed design (JetBrains Mono, dark-first)
- Project showcase with links
- Scroll indicator for discoverability
- Dark/light mode toggle

### Portfolio
- Responsive design (desktop + mobile)
- Contact form with Cloudflare Worker + Resend
- Web resume with section navigation
- SEO setup (sitemap, meta tags, robots.txt)

### Portfolio Generator
- Fill form with your details
- Pick from 4 theme presets
- Preview before downloading
- Download ready-to-host ZIP file
- Includes GitHub Pages hosting guide

---

## Stack

- HTML5, CSS3, vanilla JavaScript
- Cloudflare Pages (static hosting)
- Cloudflare Workers (contact form backend)
- Resend (email delivery)
- Cloudflare Turnstile (spam protection)
- JSZip + FileSaver.js (generator ZIP creation)

---

## Local Development

Open any HTML file directly in a browser, or run a local server:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`

---

## Deployment

Push to `main` branch → Cloudflare Pages auto-deploys

---

## License

MIT License — feel free to use as a starting point for your own site.

Built by Pruthvi Kauticwar, 2026
