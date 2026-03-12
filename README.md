# Ben Macha Ali - Portfolio

Personal portfolio website built with **Nuxt 3**, featuring a modern dark/neon design, multilingual support, and smooth scroll animations.

**Live:** [benmacha.tn](https://benmacha.tn)

## Tech Stack

- **Framework:** [Nuxt 3](https://nuxt.com) (Static Site Generation)
- **Styling:** [Tailwind CSS](https://tailwindcss.com) with custom dark/neon design system
- **i18n:** [@nuxtjs/i18n](https://i18n.nuxtjs.org) — French (default), English, Arabic (RTL)
- **Icons:** [Lucide Vue Next](https://lucide.dev)
- **Fonts:** Inter + Space Grotesk via [@nuxtjs/google-fonts](https://google-fonts.nuxtjs.org)
- **Dark Mode:** [@nuxtjs/color-mode](https://color-mode.nuxtjs.org) (dark by default)
- **Deployment:** GitHub Pages via GitHub Actions

## Features

- Dark/light mode with neon green accent theme
- Trilingual support (FR / EN / AR) with full RTL layout for Arabic
- Scroll-reveal animations using Intersection Observer
- Particle canvas background on hero section
- Responsive design with mobile navigation
- Page transitions between routes
- SEO optimized with meta tags, sitemap, and canonical URLs
- Static site generation for fast loading

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home — Hero, experience preview, skills, projects, education highlights |
| `/experience` | Full work experience timeline |
| `/skills` | Technical skills organized by category |
| `/projects` | Open source projects showcase |
| `/education` | Education, internships, and interests |

## Prerequisites

- **Node.js >= 20.12** (required — `node:util.styleText` is used by dependencies)
- npm or pnpm

## Setup

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:3000)
npm run dev

# Generate static site
npm run generate

# Preview the generated site
npm run preview
```

## Project Structure

```
├── assets/css/          # Global styles and CSS variables
├── components/          # Vue components (header, footer, sections, UI)
├── composables/         # Reusable composition functions (scroll reveal)
├── data/                # Static data (skills, social links)
├── i18n/locales/        # Translation files (en.json, fr.json, ar.json)
├── layouts/             # Nuxt layouts (default with header/footer)
├── pages/               # File-based routing
├── public/              # Static assets (CV.pdf, logo.jpeg)
├── nuxt.config.ts       # Nuxt configuration
└── tailwind.config.ts   # Tailwind theme customization
```

## Deployment

The site auto-deploys to GitHub Pages on push to `main` via the workflow in `.github/workflows/deploy.yml`. It uses `nuxt generate` to produce static HTML files.

## License

MIT
