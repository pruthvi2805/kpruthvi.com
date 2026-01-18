# Personal Portfolio

Professional portfolio website built with vanilla HTML, CSS, and JavaScript. No frameworks, no build tools - just clean, performant code.

## Tech Stack

- HTML5
- CSS3 (Custom Properties, Flexbox, Grid)
- Vanilla JavaScript (ES6+)

## Features

- Responsive design
- Dark mode with localStorage persistence
- Mobile navigation
- Scroll animations
- Print-optimized resume page
- SEO meta tags

## Project Structure

```
├── index.html
├── resume.html
├── projects.html
├── contact.html
├── css/
│   ├── main.css
│   ├── components.css
│   └── pages.css
├── js/
│   └── main.js
└── assets/
    └── images/
```

## Local Development

### Using Live Server (VS Code)

1. Install the Live Server extension
2. Right-click `index.html` and select "Open with Live Server"
3. Site opens at `http://localhost:5500`

### Using Python

```bash
python -m http.server 8000
```

Then navigate to `http://localhost:8000`

### Direct File Access

Open `index.html` directly in your browser. Note that some features may not work without a proper server.

## Customization

### Theme Colors

Edit CSS variables in `css/main.css`:

```css
:root {
  --color-primary: #2563eb;
  --color-bg: #ffffff;
  --color-text: #0f172a;
}
```

### Adding Projects

Duplicate the project card structure in `projects.html`:

```html
<article class="card project-card fade-in">
  <div class="project-card__image">🚀</div>
  <div class="project-card__content">
    <h2 class="project-card__title">Project Name</h2>
    <p class="project-card__description">Description</p>
    <div class="project-card__tech">
      <span class="tag tag-primary">Tech</span>
    </div>
    <a href="#" class="btn btn-primary btn-sm">View Details</a>
  </div>
</article>
```

## Deployment

### Cloudflare Pages

1. Push to GitHub
2. Connect repository in Cloudflare Pages dashboard
3. Leave build settings empty (static site)
4. Deploy

### GitHub Pages

1. Repository Settings → Pages
2. Source: Deploy from branch
3. Branch: main
4. Save

### Netlify

Drag and drop the project folder onto the Netlify dashboard.

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Performance

- No external dependencies
- Minimal JavaScript
- Optimized CSS
- Fast initial load

## License

© 2026 Pruthvi Kautikwar

---

Built with vanilla JavaScript - no frameworks required.
