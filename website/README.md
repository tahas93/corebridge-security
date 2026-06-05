# Sentinel — Enterprise Cybersecurity Website

A production-ready, light-mode enterprise cybersecurity website template inspired by leading consulting firms like Optiv. Built with **Next.js 14 (App Router)**, **TypeScript**, and **Tailwind CSS**.

## Highlights

- **Stack**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Design**: "Deep Sea Dream" light premium UI on a soft off-white base (`#F6FBFA`) with deep-navy text (`#001F3F`) and `#004B87` → `#0079B5` → `#0096D6` brand gradients, glassmorphism, gradient borders, and animated glow effects
- **Animations**: Cyber grid background, animated particles, scroll-reveal, marquee logos, testimonial carousel, animated counters, page loader
- **Pages**: Home, Services, Solutions, Case Studies, About, Contact, 404
- **Accessibility**: Semantic landmarks, skip-to-content link, focus-visible rings, `aria-*` for carousels and forms, `prefers-reduced-motion` respected
- **SEO**: Per-page metadata, OpenGraph + Twitter cards, JSON-LD `Organization`, dynamic `robots.txt` and `sitemap.xml`
- **Performance**: `next/font` for Inter + Space Grotesk, Tailwind JIT, lightweight DOM-only animations (canvas particles + IntersectionObserver), no heavy runtime UI libraries
- **DX**: Strict TypeScript, ESLint (`next/core-web-vitals`), modular components, centralized typed content in `src/content/index.ts`

## Project structure

```
src/
  app/
    layout.tsx          # Root layout, fonts, metadata, navbar/footer
    page.tsx            # Home page (composes all home sections)
    services/page.tsx
    solutions/page.tsx
    case-studies/page.tsx
    about/page.tsx
    contact/page.tsx
    not-found.tsx
    robots.ts
    sitemap.ts
    globals.css
  components/
    brand/Logo.tsx
    icons/CyberIcons.tsx
    layout/                # Navbar, Footer, PageLoader, ScrollReveal
    sections/              # Page sections (Hero, ServicesGrid, etc.)
    seo/JsonLd.tsx
    ui/                    # SectionHeading, StatCounter, GlowButton
    visual/                # CyberBackground, Particles, DashboardIllustration
  lib/
    content.ts             # Typed content helpers (getContent/useContent)
    site.ts                # Brand + nav config from content
    data.tsx               # Datasets sourced from content
  content/
    common.json            # Brand, site info, SEO
    header.json            # Navigation
    home.json              # Homepage copy
    pages.json             # Inner pages
    footer.json            # Footer
    forms.json             # Forms
    errors.json            # Error pages
    datasets.json          # Cards, logos, case studies
    tooltips.json          # Small UI symbols
    index.ts               # Assembles JSON into one content object
    README.md              # Non-developer editing guide
scripts/
  validate-content.mjs     # Structural content checks
  check-hardcoded-text.mjs # Detects likely hardcoded UI text
public/
  favicon.svg
  og.svg
```

## Getting started

```bash
npm install
npm run dev
```

The app runs at [http://localhost:3000](http://localhost:3000).

## Scripts

| Script           | Description                              |
| ---------------- | ---------------------------------------- |
| `npm run dev`    | Start the dev server                     |
| `npm run build`  | Production build                         |
| `npm run start`  | Run the production build                 |
| `npm run lint`   | Run `next lint` (eslint-config-next)      |
| `npm run content:validate` | Validate required content groups |
| `npm run content:check-text` | Detect likely hardcoded UI text |

## Customization

- **Single editing surface**: update JSON files in `src/content/` (see `src/content/README.md`).
- **Branding**: edit `src/content/common.json`.
- **Navigation/Footer**: edit `src/content/header.json` and `src/content/footer.json`.
- **Page copy**: edit `src/content/home.json`, `src/content/pages.json`, `src/content/forms.json`, `src/content/errors.json`.
- **Datasets**: edit `src/content/datasets.json` (services, solutions, stats, testimonials, partners, case studies).
- **Safety checks**: run `npm run content:validate && npm run content:check-text` before shipping content updates.
- **Colors**: brand palette is defined in `tailwind.config.ts` under `theme.extend.colors`.
- **Fonts**: swap `Inter` / `Space Grotesk` in `src/app/layout.tsx` for any `next/font/google` family.
- **Logo / OG image**: replace `public/favicon.svg` and `public/og.svg`.

## License

MIT — use it, fork it, ship it.
