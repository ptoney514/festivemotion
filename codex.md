# Codex Notes

## Overview

This project is a Next.js storefront rebuild for FestiveMotion and SkullTronix. The catalog is seeded from typed local product definitions, then stored in Neon so the live app can read products, option groups, and options from Postgres. Pricing is always computed server-side from the catalog definition before Stripe Checkout is created.

## Local Development

```bash
npm install
cp .env.example .env.local
npm run db:migrate
npm run db:seed
npm run dev
```

## Neon Setup

1. Create a Neon project.
2. Copy the pooled Postgres connection string into `DATABASE_URL`.
3. Run:

```bash
npm run db:migrate
npm run db:seed
```

## Stripe Setup

1. Create a Stripe account and get a secret key.
2. Set `STRIPE_SECRET_KEY` in `.env.local`.
3. For local webhooks, run:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

4. Copy the emitted webhook secret into `STRIPE_WEBHOOK_SECRET`.

## Migrations and Seed

Generate a migration after schema changes:

```bash
npm run db:generate
```

Apply migrations:

```bash
npm run db:migrate
```

Seed the launch catalog:

```bash
npm run db:seed
```

## End-to-End Local Flow

1. Confirm Neon and Stripe env vars are set.
2. Run `npm run dev`.
3. Open `/products`.
4. Configure any product and continue to checkout.
5. Complete Stripe payment with a test card.
6. Verify:
   - `orders.status` becomes `paid`
   - `configurations.selections` stores the build snapshot
   - `order_events` includes `checkout_session_created` and `checkout.session.completed`
   - `/success?session_id=...` shows the order summary

## Vercel Deploy Checklist

- Add `DATABASE_URL`
- Add `STRIPE_SECRET_KEY`
- Add `STRIPE_WEBHOOK_SECRET`
- Add `NEXT_PUBLIC_SITE_URL`
- Deploy the app
- Run migrations against production Neon
- Seed the production catalog
- Register the Stripe production webhook URL

## Next Enhancements

- Replace local seed authorship with a richer catalog authoring workflow
- Add shipping and tax logic
- Add image storage independent of the legacy WordPress site
- Add quote-only flows for custom builds
- Add an admin interface for products and orders
