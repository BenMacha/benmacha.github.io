# Ben Macha Ali - Portfolio

Personal portfolio website built with **Nuxt 3**, featuring a retro pixel-art / 8-bit game design, playable mini-games and multilingual support.

**Live:** [benmacha.tn](https://benmacha.tn)

## Tech Stack

- **Framework:** [Nuxt 3](https://nuxt.com) (prerendered static pages)
- **Styling:** plain CSS with design tokens (`assets/css/main.css`) and scoped component styles
- **Animations:** [Motion](https://motion.dev) — scroll reveal, hover/press feedback, scroll progress, score pops
- **i18n:** [@nuxtjs/i18n](https://i18n.nuxtjs.org) — French (default), English, Arabic (RTL)
- **Fonts:** Press Start 2P + Fira Code via [@nuxtjs/google-fonts](https://google-fonts.nuxtjs.org)
- **Themes:** [@nuxtjs/color-mode](https://color-mode.nuxtjs.org) — night (default) and day
- **Deployment:** Cloudflare Pages

## Features

- Pixel / Mario-inspired design with day and night palettes
- Arcade section with Snake, Tetris, Breakout, Pong and Space Invaders (keyboard, mouse and touch)
- Trilingual support (FR / EN / AR) with full RTL layout for Arabic
- Technical blog (PHP, Symfony, Docker, Linux, DevOps) with category filters
- SEO: meta tags, JSON-LD for articles, sitemap, canonical URLs
- Respects `prefers-reduced-motion`

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home — hero, experience, skills, projects, blog, education, arcade, contact |
| `/experience` | Work experience as a level map |
| `/skills` | Skills inventory by category |
| `/projects` | Open source projects ("?" blocks) |
| `/education` | Education, internships and interests |
| `/blog` | Technical blog, `/blog/:slug` for articles |

## Prerequisites

- **Node.js 22** (Nuxt 3.21 requires Node `^20.19` or `>=22.12`)
- **npm 10** — Cloudflare installs with `npm ci` on npm 10; regenerate the lockfile with `npx npm@10.9.4 install` if you use a newer npm

## Setup

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:3000)
npm run dev

# Generate the static site into .output/public
npm run generate

# Preview the generated site
npm run preview
```

## Project Structure

```
├── assets/css/          # Design tokens and shared pixel primitives
├── components/          # Layout, sections and UI components
│   └── arcade/          # Mini-games and their cabinet frame
├── composables/         # Resume data, blog helpers, arcade plumbing, Motion effects
├── data/                # Blog articles, skills, site links
├── i18n/locales/        # Translation files (fr.json, en.json, ar.json)
├── layouts/             # Default layout (header, footer, progress bar)
├── pages/               # File-based routing
├── plugins/             # Motion directives (v-reveal, v-lift, v-wiggle)
├── public/              # Static assets (CV.pdf, images)
└── nuxt.config.ts       # Nuxt configuration
```

## Deployment

Cloudflare Pages builds and deploys `master` automatically (`npm run build`, output `dist`). Other branches get preview deployments.

## License

MIT
