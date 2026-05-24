# OWASP ASVS L2 Mapping — OpsCore

## V2: Authentication

| Control | Status | Implementation | Test |
|---------|--------|---------------|------|
| V2.1.1 Password minimum 8 chars | Implemented | `SignupSchema` Zod validation | Unit test |
| V2.1.5 Password stored with argon2id | Implemented | `auth-service.ts` uses `argon2.hash()` with argon2id | Unit test |
| V2.2.1 Anti-automation on login | Implemented | Rate limiting 5/min/IP via `@fastify/rate-limit` | Integration test |
| V2.3.1 Account lockout after 5 failed attempts | Implemented | `auth-service.ts` lockout logic, 15 min duration | Unit test |
| V2.8.1 Refresh token rotation | Implemented | Token rotated on every refresh, old token revoked | Unit test |

## V3: Session Management

| Control | Status | Implementation | Test |
|---------|--------|---------------|------|
| V3.2.1 Session tokens are HttpOnly | Implemented | `reply.setCookie()` with `httpOnly: true` | E2E test |
| V3.2.3 SameSite attribute set | Implemented | `sameSite: 'lax'` on refresh token cookie | E2E test |
| V3.3.1 Session invalidation on logout | Implemented | All refresh tokens revoked on logout | Unit test |

## V4: Access Control

| Control | Status | Implementation | Test |
|---------|--------|---------------|------|
| V4.1.1 RBAC enforcement | Implemented | `can()` / `assertCan()` in `rbac.ts` | Unit test |
| V4.2.1 Multi-tenant isolation | Implemented | RLS policies on all tables, `tenant_id` filtering | Integration test |

## V5: Validation

| Control | Status | Implementation | Test |
|---------|--------|---------------|------|
| V5.1.1 Input validation | Implemented | Zod schemas on all endpoints | Unit + integration |
| V5.2.1 Output encoding | Implemented | No `dangerouslySetInnerHTML` usage | Code review |

## V7: Error Handling

| Control | Status | Implementation | Test |
|---------|--------|---------------|------|
| V7.1.1 Structured error responses | Implemented | RFC 7807 Problem Details via `errors.ts` | Integration test |

## V8: Data Protection

| Control | Status | Implementation | Test |
|---------|--------|---------------|------|
| V8.1.1 No secrets in code | Implemented | `check-secrets.ts` CI script | CI gate |

## V10: Communications

| Control | Status | Implementation | Test |
|---------|--------|---------------|------|
| V10.1.1 Secure cookie attributes | Implemented | `Secure` flag in production | E2E test |

## Known Gaps

- TOTP 2FA: Flow built but UI incomplete (backend only)
- CSRF double-submit pattern: Documented but not enforced on all endpoints
- CSP headers: Not yet configured in production Caddy config
