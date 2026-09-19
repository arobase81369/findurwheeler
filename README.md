# FindUrWheeler

India-focused automotive discovery platform — [findurwheeler.com](https://findurwheeler.com).

Built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, and plain CSS with design tokens. No UI or state libraries.

## Requirements

- Node.js **20.9 or newer** (22 LTS recommended)
- npm (bundled with Node)

## Getting started

```bash
npm install
cp .env.example .env.local      # Windows: copy .env.example .env.local
npm run dev                     # http://localhost:3000
```

| Command | What it does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` / `npm start` | Production build / serve it |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript, no emit |
| `npm run inspect:api` | Fetches the cars API and prints its real shape (see below) |

## Connect to GitHub

```bash
git init
git add .
git commit -m "Initial FindUrWheeler scaffold"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo>.git
git push -u origin main
```

## Environment variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL (`https://findurwheeler.com`) — metadata, sitemap, robots |
| `FWY_API_BASE_URL` | WordPress REST base, no trailing slash |

`.env.local` is git-ignored; set the same variables in your hosting dashboard.

## Data source

Cars come from the WordPress REST API:

- `GET {FWY_API_BASE_URL}/cars`
- `GET {FWY_API_BASE_URL}/cars/{id}`

`src/lib/api.ts` is the only place that talks to it (server-side only, cached 5 minutes).
**Car types are deliberately not written yet.** Run `npm run inspect:api`, then define
`src/types/car.ts` from the real response.

## Structure

```
src/
  app/            routes, layout, global CSS (design tokens live in globals.css)
  components/     Header, MobileMenu, Footer, ComingSoon
  lib/            site.ts (name, URL, nav) · api.ts (API client)
scripts/          inspect-api.mjs
```

## Current status

- Done: design tokens, Poppins + Inter via `next/font`, accessible header/mobile menu/footer, home page shell, site-wide metadata (`metadataBase`, Open Graph, `en-IN`), `robots.txt`, `sitemap.xml`, 404 and error pages.
- Placeholder (marked `noindex`): `/cars`, `/upcoming-cars`, `/brands`, `/compare`, `/news`.
- Not built yet: listing, car detail, brand, compare and search — pending the API response shape.
- Not included (needs your content): About, Contact, Privacy Policy, Terms pages and social links.
