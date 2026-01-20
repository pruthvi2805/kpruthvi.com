# kpruthvi.com - Personal Hub

A terminal-themed landing page serving as the central hub for my web presence.

---

## Live Site

https://www.kpruthvi.com

---

## Related Sites

Each site is its own repository and Cloudflare Pages deployment:

- [Portfolio](https://portfolio.kpruthvi.com) - Professional portfolio
- [Portfolio Builder](https://portfolio-builder.kpruthvi.com) - Portfolio generator tool
- [Expense Tracker](https://expense.kpruthvi.com) - Privacy-first expense tracking

---

## Features

- Terminal-themed design (JetBrains Mono, dark-first)
- Project showcase with links to related sites
- Scroll indicator for discoverability
- Dark/light mode toggle
- Contact form with Cloudflare Worker + Resend

---

## Tech Stack

- Vanilla HTML, CSS, JavaScript
- Cloudflare Pages (static hosting)
- Cloudflare Workers (contact form backend)
- Resend (email delivery)
- Cloudflare Turnstile (spam protection)

---

## Structure

```
my-portfolio/
├── index.html          ← Hub landing page
├── contact.html        ← Contact page
├── css/
├── js/
├── worker.js           ← Cloudflare Worker (contact form)
├── sitemap.xml
├── robots.txt
└── LICENSE
```

---

## Local Development

Open `index.html` directly in a browser, or run a local server:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`

---

## Deployment

Push to `main` branch → Cloudflare Pages auto-deploys

---

## License

MIT License - see [LICENSE](LICENSE)
