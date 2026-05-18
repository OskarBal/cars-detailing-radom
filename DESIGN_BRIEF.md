# Cars Detailing Radom — Design Brief

Single source of truth for the v2 site. Lock decisions here, not in commit messages.

## Stack

- **Vite 7+** · **React 19** · **JSX (no TS)** · **Tailwind CSS v4** (`@tailwindcss/vite`, CSS-first `@theme`) · **React Router v6** · **Vercel** hosting
- Deferred backend: Vercel Serverless Function → **Resend** (form email) + **Supabase Storage** (photo uploads when cennik form expands)
- No shadcn/ui, no React Query — direct fetch / direct supabase-js when needed (matches Balagency convention)

## Brand

- **Name:** Cars Detailing Radom
- **Owner:** Tomasz (family business, 4-person team)
- **Address:** ul. Opolska 46A, 26-606 Radom (Godów / Prędocinek, ~5 km S of city centre)
- **Phone:** +48 690 426 050
- **Logo:** `/logo.webp` cursive script — uses `mix-blend-mode: screen` to drop the black background on noir surfaces
- **Voice (PL):** informal "Ty", confident, restrained, never gamey. No GTA jargon, no exclamation marks, no slogans.

## Visual identity

### Palette (defined in `src/index.css` via `@theme`)

| Token              | Hex / RGBA           | Use                                       |
| ------------------ | -------------------- | ----------------------------------------- |
| `noir-deep`        | `#08090A`            | Page ground                                |
| `noir-surface`     | `#111214`            | Section panels, footer                     |
| `noir-elevated`    | `#1A1B1E`            | Cards on surface                           |
| `noir-bright`      | `#F6F6F7`            | Primary text, headings                     |
| `noir-muted`       | `rgba(246,246,247,.72)` | Body text                               |
| `noir-faint`       | `rgba(246,246,247,.45)` | Captions, kickers, faint hairlines      |
| `hairline`         | `rgba(246,246,247,.10)` | Borders, dividers                       |
| `hairline-hi`      | `rgba(246,246,247,.20)` | Borders on hover                        |
| `accent`           | `#B82119`            | Deep crimson — CTAs, active states, icons |
| `accent-hi`        | `#D02D24`            | Hover/active accent                        |
| `accent-deep`      | `#6E120D`            | Inner shadows, deep gradient stops         |

Title gradients live inline on `<Hero>` (chrome silver for line 1, deep red for line 2). If reused elsewhere, promote them to utilities in `index.css`.

### Typography

| Family               | Source         | Use                                              |
| -------------------- | -------------- | ------------------------------------------------ |
| **Plus Jakarta Sans** | Google Fonts | UI / body / navigation / buttons (400/500/700/800) |
| **Barlow Condensed**  | Google Fonts | Impact display — H1, H2, statistics. **Italic 800/900** used heavily. |
| **JetBrains Mono**    | Google Fonts | Phone numbers, technical accents (400/500)         |

Saira Condensed was tried and **rejected** (Google Fonts ships no italic for it → silently falls back).

### Motion

- Default easing: `cubic-bezier(0.32, 0.72, 0, 1)` (Apple-ish, ~340–420ms)
- Back-easing for icons / nested CTAs: `cubic-bezier(0.34, 1.56, 0.64, 1)`
- Animate **transform + opacity only** (GPU-safe). Avoid `top/left/width/height`.
- Respect `prefers-reduced-motion: reduce` everywhere — kill keyframe + transition durations.

### Spacing / layout

- Max content width: **1600px** (`max-w-[1600px] mx-auto`)
- Section padding: `py-20 md:py-32 px-6 md:px-10`
- Breakpoints (Tailwind defaults): sm `640`, md `768`, lg `1024`, xl `1280` — drawer/desktop nav split at **`lg` (1024px)**

## Site map

```
/                  ← scroll page: Hero → About → Services → Realizacje → Kontakt
/cennik            ← (port pending) full configurator + quote form
/regulamin         ← legal (later, Markdown render or static)
```

Section IDs (anchor targets for nav):
- `#hero`, `#o-nas`, `#uslugi`, `#realizacje`, `#kontakt`

## Components

| File                                 | Role                                         |
| ------------------------------------ | -------------------------------------------- |
| `layouts/SiteLayout.jsx`             | Header + `<Outlet />` + Footer wrapper        |
| `components/Navbar.jsx`              | Scroll-aware top bar + mobile hamburger drawer |
| `components/Footer.jsx`              | 3-column footer + © strip                     |
| `sections/Hero.jsx`                  | BG + headline + lead + CTAs + 4 glass features |
| `sections/About.jsx`                 | Story copy + stat strip + studio shot         |
| `sections/Services.jsx`              | 6-tile services grid → cennik CTA             |
| `sections/Realizacje.jsx`            | 4 lazy-hydrated TikTok phone-frame iframes    |
| `sections/Kontakt.jsx`               | Lead form + tel + address (UI-only v1)        |
| `pages/Home.jsx`                     | Composes the 5 home sections                  |
| `pages/Cennik.jsx`                   | Placeholder until configurator port           |
| `pages/NotFound.jsx`                 | 404                                            |
| `lib/nav.js`                         | Single source for NAV_ITEMS + BRAND constants  |

## Hero pattern (locked)

- Eyebrow: `Detailing & Car Care` (accent red, tracked uppercase)
- H1 line 1: `PERFEKCJA` (Barlow Condensed Black Italic, chrome silver gradient via `background-clip: text`)
- H1 line 2: `W KAŻDYM DETALU` (same font, deep red gradient)
- Lead: 2 short lines, muted on desktop, bright + shadow on mobile
- CTAs differ by viewport:
  - **Desktop:** `Zobacz usługi` (primary → /cennik) + `Nasze realizacje` (ghost → #realizacje)
  - **Mobile:** `Zadzwoń teraz` (primary tel:) + `Umów wizytę` (ghost → /cennik#wycena)
- 4 liquid-glass feature panels (Ethereal Glass + Double-Bezel): `backdrop-blur` + hairline + soft inset highlights

## Realizacje (TikTok IDs)

Ported from legacy: `7592202369799228674`, `7571531853555993879`, `7554467947104898306`, `7623393886597156128`.
Lazy-hydrated via IntersectionObserver on section entry — saves LCP and data.

## "We do not do" — explicit blocklist (from owner steer)

- ❌ GTA / San Andreas theme, Pricedown / Bowlby / blackletter fonts, Vegas-marquee chrome
- ❌ "Wheel of tools", radio-station scroll nav, pause-menu UI, wanted-stars review badge
- ❌ Loading screen with tile fill, custom SVG cursors
- ❌ Dollar-sign / casino visual metaphors anywhere
- ❌ Warm yellow / gold / orange as a UI accent (logo is red — gold is the logo's *outline trim*, not a UI color)
- ❌ Stock photos — only Tomasz's own work or AI-generated noir-aesthetic placeholders
- ❌ Slogan stacking, emoji-laden microcopy, multiple exclamation marks

## Backend (deferred to post-launch / Meeting #2 confirms scope)

- Contact form (`/kontakt`) → Vercel Serverless `/api/lead` → Resend send → `tomasz@...` (email TBD)
- Cennik wycena form → Vercel Serverless `/api/wycena` → Resend + optional Supabase Storage for uploaded car photos
- RODO: 12px disclaimer under submit button, no checkbox in v1 (informational consent on submit). Revisit if needed.

## Open inputs (collect at Meeting #2)

- Owner business email (form recipient)
- Studio opening hours (currently "7 dni w tygodniu" placeholder)
- Tier 2 automations scope (SMS/email reminders) — decides whether contact form gets auto-replies
- Approved Realizacje photos (replace TikTok-only embeds if needed)
- Approved testimonial copy from real clients
- B2B y/n (affects KSeF copy on cennik subpage when ported)

## Deploy

- Vercel project: **new** (don't reuse the legacy `cars-detailing-radom` Vercel project — link this repo as a fresh project; canonical domain swaps when v2 is approved)
- Branch strategy: trunk-based on `main`. PR for anything bigger than a copy tweak.
- Preview deploys per branch.

## Decision log discipline

When a non-trivial visual/structural decision is made, update **this brief** before or alongside the code change. Commit messages capture mechanics; the brief captures intent. If they drift, the brief wins.
