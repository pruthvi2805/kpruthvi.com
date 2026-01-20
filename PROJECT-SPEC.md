# Project Specification: kpruthvi.com

A personal hub site with portfolio showcase and interactive tools.

---

## Vision

Transform kpruthvi.com from a single portfolio into a personal hub that:
- Introduces Pruthvi Kauticwar
- Showcases projects and tools he's built
- Provides useful utilities for others (starting with a portfolio generator)

---

## Site Structure

```
kpruthvi.com/
├── index.html              ← Hub (main landing page)
├── portfolio/              ← Personal portfolio (existing)
│   ├── index.html          ← Portfolio home
│   ├── resume.html         ← Resume/CV
│   ├── contact.html        ← Contact page
│   ├── css/
│   └── js/
├── generator/              ← Portfolio Generator tool (new)
│   └── index.html
└── [future projects]
```

---

## Hub Page (kpruthvi.com)

### Layout

```
┌─────────────────────────────────────────┐
│  Header (minimal - logo + theme toggle) │
├─────────────────────────────────────────┤
│                                         │
│  Hero Section                           │
│  - Name                                 │
│  - Short intro (new, hub-specific)      │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  Projects Section                       │
│  - Title: "Things I've Built"           │
│                                         │
│  ┌─────────────┐  ┌─────────────┐       │
│  │ My Portfolio│  │  Expense    │       │
│  │             │  │  Tracker    │       │
│  │ View →      │  │ Try it →    │       │
│  └─────────────┘  └─────────────┘       │
│                                         │
│  ┌─────────────┐                        │
│  │  Portfolio  │  (more projects        │
│  │  Generator  │   can be added)        │
│  │ Try it →    │                        │
│  └─────────────┘                        │
│                                         │
├─────────────────────────────────────────┤
│  Footer (minimal)                       │
└─────────────────────────────────────────┘
```

### Design Notes
- Terminal-themed aesthetic (JetBrains Mono, dark-first)
- Minimal navigation (no full nav bar needed)
- Scroll indicator for discoverability
- Responsive (mobile-first)
- Dark/light mode toggle

---

## Portfolio Generator Tool

### What It Does

Users fill a form → pick a theme → download a ready-to-host portfolio as a ZIP file.

### User Flow

1. Land on generator page
2. Fill form with personal info
3. Select a style/theme preset
4. Click "Generate"
5. Download ZIP containing complete portfolio
6. Follow simple guide to host on GitHub Pages

### Form Fields

**Basic Info:**
- Full name
- Role/title
- Location
- Short intro (2-3 sentences)

**Contact:**
- Email
- LinkedIn URL (optional)
- GitHub URL (optional)

**Experience (1-4 entries):**
- Job title
- Company
- Location
- Start date – End date
- 2-4 bullet points

**Skills:**
- Skill groups with tags
- Or simple comma-separated list

**Optional:**
- Education (degree, school, year)
- Certifications

### Theme Presets (Phase 1)

4 presets using CSS variables:

| Theme | Description |
|-------|-------------|
| Minimal Light | Clean, white background, dark text |
| Minimal Dark | Dark background, light text |
| Warm | Terracotta/earth tones (like current portfolio) |
| Cool | Blue/slate professional tones |

Same HTML structure, different CSS variable values.

### Generated Output

ZIP file containing:
```
portfolio/
├── index.html      ← Single-page portfolio
├── css/
│   └── style.css   ← Theme-specific styles
└── README.md       ← Hosting instructions
```

### Technical Approach

- **No backend** - everything runs client-side
- **Libraries:**
  - JSZip (create ZIP in browser)
  - FileSaver.js (trigger download)
- **Template:** HTML string with placeholders, populated via JavaScript
- **Themes:** CSS variables swapped based on selection

### Hosting Guide (included in ZIP)

The generated ZIP includes a README.md with simple instructions:

1. Create a GitHub account (if needed)
2. Create a new repository
3. Upload the ZIP contents
4. Enable GitHub Pages in repo settings
5. Access site at username.github.io/repo-name

Kept simple - no command line required, all via GitHub web UI.

---

## Design System

### Colors (inherited from portfolio)

**Light Mode:**
- Primary: #C17B5F (terracotta)
- Background: #FAFAF8
- Text: #1A1A1A
- Text Secondary: #6B6B6B

**Dark Mode:**
- Primary: #D4967D
- Background: #1A1A1A
- Text: #F5F4F2
- Text Secondary: #A0A0A0

### Typography
- Font: Inter (Google Fonts)
- Headings: 600 weight
- Body: 400 weight

### Spacing
- Consistent use of 8px grid
- Generous whitespace

---

## Phases

### Phase 1 (Complete)
- [x] Restructure site (portfolio to /portfolio)
- [x] Build hub page (terminal-themed)
- [x] Build generator (single-page output)
- [x] 4 theme presets
- [x] Download ZIP functionality
- [x] Hosting guide (included in generated README)
- [x] Preview functionality
- [x] Hub contact page

### Phase 2 (Future)
- [ ] Multi-page portfolio option (home, resume, contact)
- [ ] Live preview while filling form
- [ ] More theme presets
- [ ] Additional template layouts

### Phase 3 (Maybe)
- [ ] Pega Cheat Sheet / Resource Hub
- [ ] Other utility tools

---

## Existing Projects to Showcase

### Expense Tracker
- **Repo:** github.com/pruthvi2805/ExpenseTracker
- **Live:** pruthvi2805.github.io/ExpenseTracker
- **Description:** A fast, privacy-friendly personal expense tracker that runs entirely in your browser
- **Tech:** React, Vite, IndexedDB, PWA
- **Features:**
  - Monthly budget planning with subcategory tracking
  - Local-only data storage (no backend)
  - Import/export JSON backups
  - Installable PWA (mobile + desktop)
  - Offline capable

---

## File Responsibilities

| File | Purpose |
|------|---------|
| `index.html` | Hub landing page |
| `portfolio/*` | Personal portfolio (existing) |
| `generator/index.html` | Generator tool UI + logic |
| `generator/template.js` | Portfolio HTML template |
| `generator/themes.js` | Theme CSS variable definitions |

---

## Hosting & Deployment

- **Host:** GitHub Pages (via Cloudflare)
- **Domain:** kpruthvi.com
- **Repo:** github.com/pruthvi2805/kpruthvi.com
- **Deploy:** Push to main branch

---

## Notes

- Keep everything simple and maintainable
- No backend, no database
- Prioritize user experience over features
- Mobile-responsive is mandatory
- Accessibility basics (semantic HTML, contrast, focus states)

---

*Last updated: January 2026*
