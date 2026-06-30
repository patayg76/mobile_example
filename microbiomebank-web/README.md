# MicrobiomeBank — website redesign

A fresh, professional, **fast** marketing site for MicrobiomeBank with a clean
clinical design language: a forest-green + cream brand palette (taken from the
company's own medical infographics), cellular shapes, breathing motion, and lots
of small, quick animated elements that stay cheap on the GPU.

## Stack

- **Next.js 16** (App Router) + **React 19** — statically prerendered (`○ Static`)
- **Tailwind CSS v4** — tokens defined in `app/globals.css`
- **next/font** — Plus Jakarta Sans (display) + Roboto Mono (data/labels), self-hosted, zero render-blocking requests
- Animations are **pure CSS** (transform/opacity only). The only client JS is a
  ~1KB `IntersectionObserver` reveal wrapper and a count-up `Counter` — no
  animation library. `prefers-reduced-motion` is fully respected.

## Run it

```bash
cd microbiomebank-web
npm install      # already installed in this repo
npm run dev      # http://localhost:3000
npm run build    # production build (fully static)
npm run start    # serve the production build
```

## Where to edit the content

**All copy, stats, links and section data live in one file:**
[`lib/content.ts`](./lib/content.ts).

The text there is **placeholder copy** — replace it with the real content from
microbiomebank.com (tagline, services, stats, testimonials, nav, footer). No
component code needs to change for a content swap.

To match the real brand exactly, also update the color tokens at the top of
[`app/globals.css`](./app/globals.css) (`--color-primary`, `--color-accent`, …)
and the fonts in [`app/layout.tsx`](./app/layout.tsx).

## Structure

```
app/
  layout.tsx        fonts + metadata
  page.tsx          assembles the sections
  globals.css       design tokens + keyframes/animation utilities
components/
  Header.tsx        sticky nav + animated logo + mobile menu  (client)
  Hero.tsx          deep gradient hero, orbiting cells, gradient headline
  LogoMarquee.tsx   infinite partner marquee
  Stats.tsx         count-up metrics
  Services.tsx      service cards
  Process.tsx       4-step timeline
  Platform.tsx      product split with animated mock dashboard
  Bento.tsx         "why us" bento grid
  Testimonials.tsx  social proof
  CTA.tsx           closing call-to-action band
  Footer.tsx
  Reveal.tsx        IntersectionObserver scroll-reveal       (client)
  Counter.tsx       count-up number                          (client)
  MicrobeField.tsx  decorative floating "microbe" orbs
  icons.tsx         inline SVG icon set (no emoji)
lib/
  content.ts        ← edit this for all copy/data
```
