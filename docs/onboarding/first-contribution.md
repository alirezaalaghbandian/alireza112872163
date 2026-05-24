# OpsCore — First Contribution Guide (30 minutes)

## Prerequisites

- Node.js 20 LTS
- pnpm 9+
- Docker & Docker Compose

## Setup (5 minutes)

```bash
git clone <repo-url>
cd opscore
pnpm install
docker compose up -d
pnpm db:migrate && pnpm db:seed
pnpm dev
```

Open `http://localhost:3000` — you should see the landing page.
Sign in with `owner@acme.test` / `Password1!`.

## Understanding the codebase (10 minutes)

```
opscore/
  apps/
    web/      → Next.js 14 frontend (pages, components, styles)
    api/      → Fastify backend (modules with Clean Architecture)
    worker/   → BullMQ background job consumer
  packages/
    db/       → Drizzle schema, migrations, seeds
    domain/   → Shared types, Zod schemas, domain events
    config/   → Shared TypeScript, ESLint, Prettier configs
```

Each API module follows Clean Architecture:
- `domain/` — Types, interfaces (zero framework imports)
- `application/` — Business logic services
- `infrastructure/` — Database repositories (Drizzle)
- `http/` — Fastify route handlers (< 30 lines each)

## Your first change (15 minutes)

**Task:** Add a `description` field to KPIs.

1. **Schema** (`packages/db/src/schema/observability.ts`):
   Add `description: text('description')` to the `kpis` table.

2. **Zod schema** (`packages/domain/src/schemas.ts`):
   Add `description: z.string().max(1000).optional()` to `CreateKpiSchema`.

3. **API** (`apps/api/src/modules/observability/index.ts`):
   Pass `body.description` in the insert values.

4. **UI** (`apps/web/src/app/(app)/kpis/page.tsx`):
   Display the description in the KPI card.

5. **Migration**: `cd packages/db && pnpm generate`

6. **Test**: `pnpm typecheck && pnpm lint`

7. **Commit**: `git commit -m "feat(observability): add KPI description field"`

You've made a full vertical-slice change in < 15 minutes.
