# Portfolio

Personal portfolio website for a senior Pega System Architect, focused on architecture, delivery quality, and practical systems design.

Built with vanilla HTML, CSS, and JavaScript to keep the stack simple, transparent, and dependency-free.

---

## Stack

- HTML5, CSS3, vanilla JavaScript
- Cloudflare Pages (static hosting)
- Cloudflare Workers (contact form backend)
- Resend (email delivery)
- Cloudflare Turnstile (spam protection)

---

## Features

- Responsive design (desktop and mobile)
- Contact form backed by a Cloudflare Worker with Resend email delivery
- Static, downloadable resume PDF
- Web resume with section navigation
- Basic SEO setup (sitemap, meta tags, robots.txt)

---

## Project Structure

```
├── index.html              # landing page
├── resume.html             # web resume with section navigation
├── resume-print.html       # print-friendly resume
├── contact.html            # contact form
├── worker.js               # Cloudflare Worker (Turnstile + Resend)
├── sitemap.xml
├── robots.txt
├── css/
│   ├── main.css            # global styles, header, navigation
│   ├── components.css      # buttons, cards, tags
│   └── pages.css           # page-specific layouts
└── js/
    └── main.js             # navigation, scrolling, form handling
```

---

## Local Development

You can open `index.html` directly in a browser, or run a simple local server:

```bash
python -m http.server 8000
```

Then visit:

```
http://localhost:8000
```

---

## Design Notes

No frontend frameworks or build tools were used intentionally.

The goal was clarity, stability, and ease of maintenance over abstraction.

Secrets (API keys, tokens) are stored as environment variables in Cloudflare and are not committed to the repository.

---

## Live Site

Hosted on Cloudflare Pages:  
👉 https://kpruthvi.com

---

## Customization

Theme variables are defined in `css/main.css`:

```css
:root {
  /* Warm Terracotta Color Palette */
  --color-primary: #C17B5F;
  --color-bg: #FAFAF8;
  --color-text: #1A1A1A;
}
```

---

## License

MIT License  
Feel free to use this as a starting point for your own portfolio.

Built by Pruthvi Kauticwar, 2026
