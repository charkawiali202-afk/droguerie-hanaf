# Droguerie Quincaillerie Hanaf (demo)

Demo website for a hardware/paint store in Guéliz, Marrakech. French, mobile-first.

- Public: home, catalogue (category filter + search), product pages.
- Admin: `/admin` to add/edit/delete categories and products.

Stack: Next.js 16 (App Router) + TypeScript + Tailwind CSS 4 + Motion.

## Run

```bash
npm install
cp .env.example .env.local   # then set NEXT_PUBLIC_ADMIN_PASSWORD
npm run dev                  # http://localhost:3000
```

## Data

Demo data is seeded from `src/lib/seed.ts` and saved in each visitor's browser (localStorage).
Admin changes are visible only in the browser that made them. Use a real database (e.g. Supabase) before using it for actual stock.

The admin password is a simple client-side gate (`NEXT_PUBLIC_ADMIN_PASSWORD`), fine for a demo, not real security.

## Before going live

Fill the placeholders in `src/lib/business.ts` (phone, WhatsApp, hours, domain) and set `robots.index` to `true` in `src/app/layout.tsx`.
