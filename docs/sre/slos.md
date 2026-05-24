# OpsCore — Service Level Objectives

## API SLOs

| Metric | Target | Measurement |
|--------|--------|-------------|
| API p95 latency (non-AI) | < 250 ms | Measured via OpenTelemetry spans on all REST/tRPC endpoints |
| API p95 latency (list endpoints, 1k rows) | < 400 ms | Measured with cursor-based pagination on largest tables |
| AI streaming TTFB | < 1500 ms | Time from request to first SSE token |
| API availability | 99.9% | Uptime probe on `/health` endpoint, 30s interval |
| Error rate | < 1% | 5xx responses / total responses, measured per 5-min window |

## Web SLOs

| Metric | Target | Measurement |
|--------|--------|-------------|
| LCP on `/app/dashboard` (4G, mid-tier) | < 2.0 s | Lighthouse CI in GitHub Actions |
| INP | < 200 ms | Core Web Vitals via RUM |
| Initial JS bundle (gzipped) | < 180 KB | Measured on `/app/dashboard` route |

## Database SLOs

| Metric | Target | Measurement |
|--------|--------|-------------|
| Query p95 latency | < 50 ms | Postgres `pg_stat_statements`, excluding AI-related queries |
| Connection pool utilization | < 80% | Monitored via Prometheus metrics from the API |

## Alerting Rules (recommended)

1. API p95 > 500ms for > 5 minutes → page on-call
2. Error rate > 5% for > 2 minutes → page on-call
3. DB connection pool > 90% → warn
4. AI streaming TTFB > 3s for > 3 minutes → warn
