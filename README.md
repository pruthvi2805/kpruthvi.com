# Portfolio

Personal portfolio website for a senior Pega system architect. Built with vanilla HTML, CSS, and JavaScript - no frameworks or build tools.

## Stack

- HTML5, CSS3, vanilla JavaScript
- Cloudflare Pages (hosting)
- Cloudflare Workers (contact form backend)
- Resend (email delivery)
- Turnstile (spam protection)

## Features

- Responsive design (mobile bottom nav on small screens)
- Contact form with email integration
- Print-optimized resume (resume-print.html)
- Scroll animations and section navigation
- SEO optimized (sitemap, meta tags, robots.txt)

## Structure

```
├── index.html              # landing page
├── resume.html             # web resume with section nav
├── resume-print.html       # print-friendly version
├── projects.html           # professional impact highlights
├── contact.html            # contact form
├── colophon.html           # how this site was built
├── worker.js               # cloudflare worker for contact form
├── sitemap.xml
├── robots.txt
├── css/
│   ├── main.css           # global styles, header, nav
│   ├── components.css     # buttons, cards, tags
│   └── pages.css          # page-specific layouts
└── js/
    └── main.js            # scroll, nav, form handler
```

## Local Development

Open `index.html` in a browser, or use:

```bash
python -m http.server 8000
```

Then go to `http://localhost:8000`

For the contact form to work locally, you'll need the Cloudflare Worker deployed (see below).

## Contact Form Setup

The contact form uses Cloudflare Workers and Resend for email delivery.

### Required Environment Variables (Worker)

- `TURNSTILE_SECRET` - Cloudflare Turnstile secret key
- `RESEND_API_KEY` - Resend API key

### DNS Setup

If using a custom domain with Resend, add their verification records in Cloudflare DNS.

### Deploy Worker

```bash
npx wrangler deploy
```

Update the form action URL in `contact.html` to match your worker URL.

## Deployment

Currently live on Cloudflare Pages at `kpruthvi.com`

To deploy your own:

1. Push to GitHub
2. Create new site in Cloudflare Pages
3. Connect repository
4. Build settings: None (static site)
5. Deploy
6. Add custom domain if needed

## Customization

Colors and theme variables are in `css/main.css`:

```css
:root {
  --color-primary: #2563eb;
  --color-bg: #ffffff;
  --color-text: #0f172a;
}
```

## License

Built by Pruthvi Kauticwar, 2026
