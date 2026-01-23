<div align="center">

# kpruthvi.com

**A warm, editorial personal hub showcasing privacy-first browser tools**

[Live Site](https://www.kpruthvi.com) · [Portfolio](https://portfolio.kpruthvi.com) · [Contact](https://www.kpruthvi.com/contact.html)

---

<img src="https://img.shields.io/badge/Vanilla-HTML%20%7C%20CSS%20%7C%20JS-f4e9c8?style=for-the-badge" alt="Vanilla Stack" />
<img src="https://img.shields.io/badge/Cloudflare-Pages%20%2B%20Workers-F38020?style=for-the-badge&logo=cloudflare&logoColor=white" alt="Cloudflare" />
<img src="https://img.shields.io/badge/Privacy-First-c9a227?style=for-the-badge" alt="Privacy First" />

</div>

---

## Overview

A meticulously crafted personal hub that serves as the central gateway to my web presence and browser tools. Built with intentional design choices—warm cream tones, editorial typography, and subtle animations—creating a space that feels both professional and inviting.

**No frameworks. No build steps. Just clean, purposeful code.**

---

## Featured Tools

| Tool | Description | Link |
|------|-------------|------|
| **Portfolio Builder** | Build developer portfolios in minutes. Fill details, pick theme, download ZIP. | [Visit](https://portfolio-builder.kpruthvi.com) |
| **Resume Builder** | ATS-friendly resumes with real-time scoring and job matching. | [Visit](https://resume.kpruthvi.com) |
| **Converter** | 100+ unit conversions. Length, weight, temperature, currency. | [Visit](https://convert.kpruthvi.com) |
| **Textsy** | Swiss Army knife for text—case conversion, encoding, formatting. | [Visit](https://text.kpruthvi.com) |
| **Expense Tracker** | Track expenses privately. All data stays in your browser. | [Visit](https://expense.kpruthvi.com) |

---

## Design Philosophy

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   01  SIMPLE OVER CLEVER                                    │
│       Complexity is easy. Simplicity requires discipline.   │
│                                                             │
│   02  PRIVACY BY DEFAULT                                    │
│       Your data stays on your device. No tracking.          │
│                                                             │
│   03  INSTANT & OFFLINE                                     │
│       No loading spinners. Works without internet.          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Features

<table>
<tr>
<td width="50%">

### Visual Design
- Warm editorial aesthetic with cream/gold palette
- Playfair Display + Inter typography pairing
- Custom PK monogram logo
- Storyset illustrations with embedded animations
- Smooth AOS scroll animations

</td>
<td width="50%">

### User Experience
- Seamless light/dark theme switching
- Section-based header color transitions
- Dot navigation with animated trail
- Full-viewport section scrolling
- Mobile-first responsive design

</td>
</tr>
<tr>
<td width="50%">

### Technical
- Zero dependencies (except AOS)
- Cloudflare Workers contact form
- Turnstile captcha integration
- Fisher-Yates tool rotation
- IntersectionObserver for scroll tracking

</td>
<td width="50%">

### Mobile Optimizations
- Bento grid layout for tools
- Horizontally scrollable principles
- Touch-optimized targets (44px min)
- Staggered navigation animations
- No tap highlight artifacts

</td>
</tr>
</table>

---

## Tech Stack

```
Frontend        Vanilla HTML, CSS, JavaScript
Typography      Playfair Display, Inter (Google Fonts)
Animations      AOS (Animate on Scroll)
Hosting         Cloudflare Pages
Backend         Cloudflare Workers
Email           Resend API
Captcha         Cloudflare Turnstile
```

---

## Project Structure

```
kpruthvi.com/
├── index.html            # Main hub page
├── contact.html          # Contact form page
├── hero-illustration.svg # Animated hero artwork
├── worker.js             # Cloudflare Worker (contact form handler)
├── sitemap.xml           # SEO sitemap
├── robots.txt            # Crawler directives
└── LICENSE               # MIT License
```

---

## Color System

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--color-bg` | `#faf8f5` | `#1a1612` | Page background |
| `--color-bg-alt` | `#f7f4ef` | `#211c16` | Alternate sections |
| `--color-accent` | `#c9a227` | `#d4af37` | Gold highlights |
| `--color-text` | `#1a1612` | `#faf8f5` | Primary text |
| `--color-text-secondary` | `#5c534a` | `#c4bdb4` | Supporting text |

---

## Local Development

```bash
# Clone the repository
git clone https://github.com/pruthvi2805/kpruthvi.com.git

# Navigate to project
cd kpruthvi.com

# Start a local server (Python)
python -m http.server 8000

# Or use any static server
npx serve .
```

Then open [http://localhost:8000](http://localhost:8000)

---

## Deployment

Push to `main` → Cloudflare Pages auto-deploys

The Worker (`worker.js`) handles contact form submissions via Cloudflare Workers, routing emails through Resend.

---

## Related Repositories

Each tool lives in its own repository:

- [portfolio-builder](https://github.com/pruthvi2805/portfolio-builder) — Portfolio generator
- [resume-builder](https://github.com/pruthvi2805/resume-builder) — Resume generator
- [converter](https://github.com/pruthvi2805/converter) — Unit converter
- [textsy](https://github.com/pruthvi2805/textsy) — Text manipulation
- [expense-tracker](https://github.com/pruthvi2805/expense-tracker) — Expense tracking

---

## Credits

- Illustrations by [Storyset](https://storyset.com/technology)
- Fonts by [Google Fonts](https://fonts.google.com)

---

<div align="center">

**Built with intention. No trackers.**

MIT License · © 2026 Pruthvi Kauticwar

</div>
