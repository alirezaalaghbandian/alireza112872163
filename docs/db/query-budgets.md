# OpsCore — Database Query Budgets

## Hot Query Paths

| Query | Table | Index Used | Expected p95 | Notes |
|-------|-------|-----------|-------------|-------|
| List signals by tenant + time range | `signals` | `signals_tenant_observed_idx` | < 20ms | BRIN-like behavior on `observed_at` |
| Get signal by idempotency key | `signals` | `signals_idempotency_idx` | < 5ms | Unique lookup |
| List KPI snapshots by KPI + window | `kpi_snapshots` | `kpi_snapshots_kpi_computed_idx` | < 10ms | Ordered by `computed_at` |
| List incidents by tenant + status | `incidents` | `incidents_tenant_status_idx` | < 10ms | Filtered pagination |
| Get incident with events + comments | `incidents`, `incident_events`, `comments` | Primary keys + foreign key indexes | < 15ms | 3 queries in parallel |
| List audit entries with filters | `audit_entries` | `audit_entries_occurred_idx` | < 15ms | Cursor-based, time-ordered |
| List copilot messages by conversation | `copilot_messages` | `copilot_messages_conversation_idx` | < 5ms | Ordered by `created_at` |

## Index Strategy

- **B-tree** indexes for equality and range lookups (most queries)
- **GIN** index on `signals.payload` for JSONB containment queries
- **BRIN** considered for `signals.observed_at` if table exceeds 10M rows
- All `tenant_id` columns indexed for RLS policy efficiency

## RLS Impact

RLS adds a filter predicate to every query. The `tenant_id` B-tree index ensures this predicate is evaluated via index scan, not sequential scan. Expected overhead: < 1ms per query.
