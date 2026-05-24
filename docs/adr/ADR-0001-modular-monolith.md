# ADR-0001: Modular Monolith Over Microservices
Date: 2026-05-24
Status: Accepted

## Context
OpsCore needs a production-grade architecture that balances deployment simplicity with future extractability. The team is small (initially AI-generated, then onboarded engineers), and the system handles < 10k signals/minute at launch.

## Decision
Build OpsCore as a **modular monolith** deployed as two services (web + API) plus workers. Each module (identity, observability, incidents, copilot, reports, audit) has strict boundaries with a single barrel export. Cross-module imports only via the barrel.

## Consequences
- Positive: Single deployment unit simplifies ops. Transactional integrity within a single DB. Faster development velocity.
- Positive: Module boundaries enforce future extractability — any module can become a service by replacing in-process calls with network calls.
- Negative: Vertical scaling only until a module is extracted. Shared database may become a bottleneck at very high scale.
- Neutral: Requires discipline to maintain module boundaries (enforced by eslint and barrel-only imports).

## Alternatives considered
- **Microservices from day one:** Rejected. Premature distribution adds deployment complexity, eventual consistency headaches, and network latency without commensurate benefits at this scale.
- **Serverless functions:** Rejected. Cold starts unacceptable for real-time operational intelligence. Long-running SSE connections for Copilot require persistent processes.
