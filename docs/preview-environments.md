# Preview Environments: Vercel + Neon

A reference for setting up per-PR preview environments across Vercel + Neon projects.

## What It Is

Every time you push a branch or open a PR, Vercel automatically creates a **preview deployment** — a live instance of your app at a unique URL. Paired with **Neon database branching**, each preview gets its own isolated copy of the production database. No changes touch prod until you merge.

This is called the **preview environment** (or **ephemeral environment**) pattern.

## The Flow

```
Push branch / open PR
    │
    ├── Vercel builds a preview deployment
    │   (e.g., myapp-git-feature-xyz.vercel.app)
    │
    ├── Neon auto-creates a database branch
    │   (instant copy-on-write fork of prod)
    │
    ├── Preview deployment gets its own DATABASE_URL
    │   pointing to the Neon branch
    │
    ├── Seed script runs against branch DB (if configured)
    │
    ├── You validate at the preview URL
    │   - Visual QA
    │   - Test with real data
    │   - Share link with reviewers
    │
Merge PR to main
    │
    ├── Vercel deploys to production (uses prod DATABASE_URL)
    ├── Re-seed prod if catalog data changed
    └── Neon branch DB auto-cleaned up
```

## Terminology

| Term | Meaning |
|------|---------|
| **Preview deployment** | Per-PR live environment, auto-created by Vercel |
| **Ephemeral environment** | Same concept, more formal DevOps term |
| **Review app** | Heroku/GitLab's term for the same thing |
| **Branch deployment** | Emphasizes one deployment per git branch |
| **Staging** | Traditional single shared pre-prod environment (different concept) |

In conversation:

- "Let me check the preview deployment before we merge"
- "The preview looks good, merging to main"
- "Can you review the preview link on the PR?"

## Setup Steps

### 1. Connect Neon to Vercel (~5 min, UI only)

In the Neon console, connect your Vercel project. This makes Neon automatically:

- Create a database branch for every Vercel preview deployment
- Inject the branch's `DATABASE_URL` into that deployment's environment
- Clean up the branch when the preview deployment is deleted

No code changes required for this step.

### 2. Auto-seed preview databases (one script change)

Preview branch databases start as a copy of prod, but if your PR changes seed data, you need the preview to reflect that. Add a preview build script:

```json
{
  "scripts": {
    "build": "next build",
    "build:preview": "tsx scripts/seed.ts && next build"
  }
}
```

Then in Vercel project settings, set the **Preview** build command to `npm run build:preview`. Production keeps `npm run build`.

### 3. Auto-seed prod on merge (optional GitHub Action)

If your project has a seed script and catalog data changes over time, automate production seeding when the seed file changes:

```yaml
# .github/workflows/seed-prod.yml
name: Seed production database
on:
  push:
    branches: [main]
    paths: [lib/catalog-seed.ts]
jobs:
  seed:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run db:seed
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

## Example: FestiveMotion

This project (festivemotion) uses the following stack:

- **Framework:** Next.js (App Router, SSG + dynamic pages)
- **Database:** Neon (PostgreSQL, via `@neondatabase/serverless` + Drizzle ORM)
- **Hosting:** Vercel
- **Seed script:** `scripts/seed.ts` — upserts catalog data from `lib/catalog-seed.ts`

The product page (`app/products/[slug]/page.tsx`) loads data from the database first, falling back to the in-memory seed if the DB is unavailable. This means seed data changes (like adding `displayPriceDeltaCents` metadata to options) only appear on the live site after the database is re-seeded.

Without preview environments, the only way to validate seed changes against a live database was to merge to main, deploy to production, and re-seed prod. Preview environments eliminate that risk.

## Requirements

- Vercel project (any plan — previews are available on all tiers)
- Neon database (branching is available on all plans including free)
- A seed script that reads `DATABASE_URL` from the environment
