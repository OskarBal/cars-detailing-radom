# Cars Detailing Radom

Premium auto detailing studio website. Vite + React + Tailwind v4 + React Router.

See **[DESIGN_BRIEF.md](./DESIGN_BRIEF.md)** for the design system, sections, and decision log.

## Run

```sh
npm install
npm run dev          # http://localhost:5173
npm run build        # build to ./dist
npm run preview      # preview built site
```

## Structure

```
src/
  layouts/   site shell (header + footer + outlet)
  components/ Navbar, Footer
  sections/  Hero, About, Services, Realizacje, Kontakt
  pages/     Home, Cennik, NotFound
  lib/       NAV_ITEMS + BRAND constants
public/      logo.webp, hero-bg.webp
```

## Deploy

Vercel auto-deploys `main`. Preview deploys per branch / PR.
