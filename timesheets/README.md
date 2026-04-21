# Time Sheets by Silverback — Prototype

A sendable visual prototype of the time-and-labor SaaS for field-service crews.
First tenant: **Orosco Landscaping** (Oakland, CA).

This is a self-contained Vite + React app that lives alongside the existing
code in this repo without touching it. Real backend (Firebase Auth +
Firestore + compliance engine + Stripe) lands in a separate repo/session.

## What's in the demo

- `/` — Marketing cover + pricing (Foundation / Crew / Operations, monthly/annual)
- `/app` — Employee sign-in (name grid)
- `/app/pin/:id` — PIN pad (demo PIN is **`0000`** for every employee)
- `/app/sites` — Job-site picker
- `/app/clock` — Live clock screen: working timer, breaks (Break 1 / Lunch / Break 2), clock-out
- `/app/week` — "My hours this week" summary with fake weekly data

State lives in React + `localStorage` (per-browser). No backend, no real auth,
no persistence across devices.

## Run locally

```bash
cd timesheets
npm install
npm run dev
# open http://localhost:5173
```

For iPhone testing in Chrome devtools: set viewport to `iPhone 15` (393×852).

## Build a static bundle

```bash
cd timesheets
npm install
npm run build
# output in timesheets/dist/
```

## Three ways to send it to Miguel

1. **Vercel drag-and-drop (fastest).**
   - Run `npm run build`
   - Go to <https://vercel.com/new>
   - Drag the `timesheets/dist/` folder onto the page
   - Vercel gives you a URL like `time-sheets-xyz.vercel.app` in ~30 seconds
   - Send that link

2. **Netlify drop.**
   - Run `npm run build`
   - Go to <https://app.netlify.com/drop>
   - Drag the `timesheets/dist/` folder
   - Same result, different host

3. **Cloudflare Pages via Wrangler.**
   ```bash
   npx wrangler pages deploy timesheets/dist --project-name time-sheets
   ```

No env vars, no secrets, no backend to stand up. It's a static SPA.

> Make sure your host serves `index.html` on any unmatched path (SPA fallback).
> Vercel and Netlify do this by default. Cloudflare Pages needs a
> `_redirects` file with `/*  /index.html  200` — a copy is included in this
> project so it gets copied into `dist/` at build time.

## Design system — quick reference

- Primary green `#036B3A` (QuickBooks-style money-green), dominant
- Navy `#1F3A5F` used only for employee avatars
- Fonts: **Inter** body, **JetBrains Mono** for all tabular numbers (timers, money, hours)
- Hairline borders, no drop shadows, `rounded-lg` cards, `rounded-md` buttons
- Status pills for on-site / on-break / taken

## What's NOT in the prototype (deliberately)

- Real auth — everyone's PIN is `0000`
- Real GPS — the "On site" chip always shows green
- Owner / admin portal — employee-side only
- CA Labor Code compliance flag surfacing — data model and logic ported in Stage 2
- Stripe checkout — pricing "Start free trial" buttons show a friendly "coming soon" alert
- Multi-tenant subdomain resolution — hardcoded to Orosco
- PWA install / offline queue
- Persistence across devices — it's localStorage only

## Stage 2 (new repo)

When the production repo (`time-sheets` under the Silverback GitHub org)
exists, Stage 2 ports this scaffold and adds:

- Firebase Auth (owners) + Cloud Function PIN flow (employees, custom tokens)
- Firestore multi-tenant collections with security rules
- CA Labor Code compliance engine (Cloud Function on shift close)
- Owner / admin portal (dashboard, timesheets grid, compliance center,
  employees + job sites CRUD, billing settings)
- Stripe subscriptions + setup-fee checkout + webhooks
- PWA: `vite-plugin-pwa`, manifest, apple-touch-icon, offline queue
- Cloud Run deploy + wildcard DNS for `*.silverbackai.agency`
- Seeded Orosco tenant with owner account, 4 employees, 4 job sites
