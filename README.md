# FestiveMotion Storefront MVP

FestiveMotion is a modern Next.js storefront for SkullTronix and related animatronic products. It keeps the storytelling and product configuration ideas from the current WooCommerce site, but restructures them into an Apple-style buying flow with server-authoritative pricing, Neon-backed catalog data, and hosted Stripe Checkout.

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS
- Neon Postgres
- Drizzle ORM + generated SQL migrations
- Stripe Checkout + webhook reconciliation
- Vitest for pricing tests

## Current MVP Scope

- `/` marketing landing page
- `/products` catalog listing
- `/products/[slug]` configurable product detail pages
- `POST /api/price` for authoritative pricing validation
- `POST /api/checkout` for Stripe Checkout session creation
- `POST /api/webhooks/stripe` for payment reconciliation
- `/success` and `/cancel` for post-checkout states

The UI can browse a local fallback catalog when `DATABASE_URL` is missing, but checkout requires a seeded Neon database and Stripe credentials.

## Local Setup

1. Use a current Node LTS release.
2. Install dependencies:

```bash
npm install
```

3. Copy the example env file and fill in values:

```bash
cp .env.example .env.local
```

4. Generate and run migrations:

```bash
npm run db:migrate
```

5. Seed the catalog:

```bash
npm run db:seed
```

6. Start the app:

```bash
npm run dev
```

## Environment Variables

- `DATABASE_URL`: Neon Postgres connection string
- `STRIPE_SECRET_KEY`: Stripe secret API key
- `STRIPE_WEBHOOK_SECRET`: Stripe CLI or dashboard webhook signing secret
- `NEXT_PUBLIC_SITE_URL`: app base URL, for example `http://localhost:3000`

## Database Workflow

Generate a new migration after schema changes:

```bash
npm run db:generate
```

Apply migrations:

```bash
npm run db:migrate
```

Seed or reseed the catalog:

```bash
npm run db:seed
```

## Test and Verification

Run lint:

```bash
npm run lint
```

Run unit tests:

```bash
npm run test
```

Run a production build:

```bash
npm run build
```

## Stripe Local Testing

1. Start the Next app with `npm run dev`.
2. Start Stripe webhook forwarding:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

3. Put the reported webhook secret into `STRIPE_WEBHOOK_SECRET`.
4. Seed the database and open any product page under `/products`.
5. Configure a build and use Stripe test card `4242 4242 4242 4242`.
6. After payment, confirm:
   - `/success?session_id=...` resolves
   - `configurations` contains the snapshot
   - `orders` contains the Stripe ids and paid status
   - `order_events` contains the webhook audit trail

## Deployment Notes

- Deploy to Vercel with the same environment variables from `.env.example`
- Set `NEXT_PUBLIC_SITE_URL` to the production domain
- Point the Stripe webhook endpoint to `/api/webhooks/stripe`
- Seed production Neon after running migrations

## Project Layout

- `app/`: pages and route handlers
- `components/Configurator/`: product configurator UI
- `lib/`: schema, DB access, pricing, catalog, orders, Stripe, validators
- `scripts/seed.ts`: idempotent catalog seed
- `drizzle/`: generated SQL migrations
