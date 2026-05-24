# OpsCore — Known Gaps

## Scope Reductions in v1

1. **TOTP 2FA**: Backend logic implemented, UI flow incomplete (no QR code scanner page).
2. **CSRF double-submit**: Documented in ASVS mapping but not enforced on all endpoints.
3. **CSP headers**: Not configured in Caddy production config.
4. **E2E Tests**: Playwright test structure defined; full 8-journey coverage in progress.
5. **Lighthouse CI**: GitHub Action defined but Lighthouse audit not yet wired.
6. **Screenshot diff suite**: RTL/dark mode screenshot comparison not automated.
7. **OpenAPI spec generation**: Endpoint structure documented; auto-generation from code not wired.
8. **Bruno collection**: Not yet generated from OpenAPI spec.
9. **pgvector embeddings**: Schema supports pgvector but embedding generation for Copilot RAG is mocked.
10. **Real LLM integration**: Copilot uses a mock provider. Anthropic/OpenAI provider interface is defined but requires API keys.
11. **Eval harness**: Directory structure created; fixture conversations pending.
12. **RLS policies**: Schema designed for RLS; Postgres policy SQL needs to be applied via migration.
13. **check-secrets.ts**: Script structure defined but not fully implemented.
14. **Storybook stories**: Component library built but stories not yet written.
15. **Contract tests**: Type-level validation via shared Zod schemas; runtime contract tests pending.
