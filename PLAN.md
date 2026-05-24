# OpsCore — Implementation Plan

## 1-Page Interpretation

OpsCore is a **multi-tenant SaaS platform** for enterprise operations intelligence. It unifies operational data ingestion, KPI monitoring, AI-assisted root-cause analysis, and incident management into a single, production-grade web application. The system is built as a **modular monolith** with two deployable services (web + API) plus background workers, backed by PostgreSQL (with RLS for tenant isolation) and Redis (for caching and job queues).

The UI must meet the aesthetic bar of Linear/Vercel/Notion — content-first, crisp typography, intentional dark mode, full RTL/i18n support (English + Farsi). The AI Copilot is a first-class feature with mandatory citation traceability.

## Architecture Overview

```
┌─────────────────────────────────────────────┐
│  Web (Next.js 14, App Router, RSC, TS)      │
└─────────────────────────────────────────────┘
                    │ tRPC / REST
┌─────────────────────────────────────────────┐
│  API (Fastify 4 + TypeScript)               │
│  ├── modules/identity    (users, orgs, RBAC)│
│  ├── modules/observability (signals, KPIs)  │
│  ├── modules/incidents   (workflow, SLA)    │
│  ├── modules/copilot     (AI agent, RAG)    │
│  ├── modules/reports     (exports, PDF)     │
│  └── modules/audit       (immutable log)    │
└─────────────────────────────────────────────┘
        │            │              │
   Postgres 16   Redis 7       Worker (BullMQ)
   + pgvector   (cache+queue)  (ingest, AI jobs)
```

## Technology Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| ORM | Drizzle | Type-safe, lightweight, migration-first, better DX than Prisma for raw SQL needs |
| Charts | Recharts | React-native, declarative, good composability with custom design tokens |
| i18n | next-intl | First-class App Router support, type-safe message keys, ICU message format |
| Component base | Radix UI primitives | Accessible by default, unstyled, composable |

## Milestone Breakdown

### M0: Foundation (monorepo, config, Docker)
- pnpm workspace with apps/web, apps/api, apps/worker, packages/db, packages/domain, packages/config, packages/ui
- Shared ESLint, TypeScript, Prettier configs
- Docker Compose with Postgres 16 + pgvector, Redis 7, MinIO, OTel Collector, Mailpit
- Design tokens CSS, base component library

### M1: Identity Module (vertical slice)
- DB: users, organizations, memberships, invitations tables with RLS
- API: auth endpoints (login, logout, refresh), org management, RBAC
- UI: login, signup, settings (general, members, roles)
- Tests: unit + integration for auth, RBAC, multi-tenant isolation

### M2: Observability Module (vertical slice)
- DB: signals, kpis, kpi_snapshots, anomalies with RLS + indexes
- API: signal ingestion (idempotent), KPI CRUD, snapshot computation
- Worker: signal processing, KPI computation, anomaly detection
- UI: signals list, KPI dashboard with sparklines, anomaly highlights

### M3: Incidents Module (vertical slice)
- DB: incidents, incident_events, comments with status machine
- API: incident CRUD, status transitions, comments, SLA tracking
- UI: incidents list, incident detail with timeline, status workflow

### M4: Copilot Module (vertical slice)
- DB: copilot_conversations, copilot_messages with citations
- API: conversation management, SSE streaming, citation validation
- Worker: AI job processing with Anthropic/OpenAI provider interface
- UI: chat interface with streaming, clickable citations, side drawer

### M5: Reports Module (vertical slice)
- DB: reports, report_runs, exports
- API: report generation, PDF export via MinIO
- UI: report builder, run history, download

### M6: Audit Module (vertical slice)
- DB: audit_entries (append-only, UPDATE/DELETE revoked)
- API: audit log query with filters
- UI: audit log viewer in settings

### M7: Polish & Integration
- App shell refinement (⌘K command palette, keyboard shortcuts)
- Dark mode parallel design
- RTL layout with Farsi locale
- E2E Playwright tests (8 journeys)
- Lighthouse CI, Axe-core accessibility checks
- Demo seed data

### M8: Documentation & Deployment
- ADRs (0001–0004+)
- README with architecture diagram, screenshots, quickstart
- OpenAPI spec + Bruno collection
- Helm chart, production docker-compose, Caddy config
- SRE docs (SLOs, runbooks), security docs (ASVS mapping)
- Onboarding guide

## Implementation Order

1. Foundation → 2. Identity → 3. Observability → 4. Incidents → 5. Copilot → 6. Reports → 7. Audit → 8. Polish → 9. Docs/Deploy

Each module is a complete vertical slice: DB schema → migrations → API endpoints → UI pages → tests.
