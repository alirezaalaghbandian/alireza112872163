# ADR-0002: Drizzle ORM Over Prisma
Date: 2026-05-24
Status: Accepted

## Context
OpsCore requires an ORM that supports TypeScript-first development, complex queries (window functions, JSONB, RLS), and migration management for Postgres 16 with pgvector.

## Decision
Use **Drizzle ORM** for all database access.

## Consequences
- Positive: SQL-like query builder feels natural for complex queries. No query engine runtime — queries compile to SQL directly. Smaller bundle than Prisma Client.
- Positive: First-class support for raw SQL when needed (RLS policies, custom indexes). Migration files are plain SQL, easy to review and customize.
- Positive: Schema-as-code co-located with application code. Excellent TypeScript inference.
- Negative: Smaller ecosystem than Prisma (fewer community plugins). Less mature studio/GUI tooling.
- Neutral: Migration workflow is explicit (generate → review → apply) rather than auto-applied.

## Alternatives considered
- **Prisma:** More mature ecosystem, but the query engine adds runtime overhead, JSONB support is less ergonomic, and raw SQL escapes feel bolted on. RLS support requires manual workarounds.
- **Knex + manual types:** Too much boilerplate for type safety. Migration support is good but lacks schema-as-code benefits.
- **Raw pg/postgres.js:** Maximum control but zero type inference. Maintenance burden too high for this scale.
