# Droguerie Quincaillerie Hanaf (demo)

Demo website for a hardware/paint store in Guéliz, Marrakech. French, mobile-first.

- Public: logo intro animation, home, catalogue (category filter + search), product pages, cart and
  checkout with cash on delivery (paiement à la livraison).
- Admin: `/admin` with tabs for orders (statuses nouvelle / confirmée / livrée / annulée), products and categories.

Stack: Next.js 16 (App Router) + TypeScript + Tailwind CSS 4 + GSAP (ScrollTrigger) for the intro and scroll animations.
Brand blue `#01357c` is sampled from `public/logo.webp`. Product photos come from Unsplash (Unsplash License).

## Run

```bash
npm install
cp .env.example .env.local   # then set NEXT_PUBLIC_ADMIN_PASSWORD
npm run dev                  # http://localhost:3000
```

## Data

Demo data is seeded from `src/lib/seed.ts`. Catalogue edits, the cart and orders are saved in each visitor's browser (localStorage),
so orders only show in the admin of the same browser that placed them, and stock is not decremented. Use a real database (e.g. Supabase) before using it for actual stock.

The admin password is a simple client-side gate (`NEXT_PUBLIC_ADMIN_PASSWORD`), fine for a demo, not real security.

## Before going live

Fill the placeholders in `src/lib/business.ts` (phone, WhatsApp, hours, domain) and set `robots.index` to `true` in `src/app/layout.tsx`.
