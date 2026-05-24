import { SignJWT, jwtVerify } from 'jose';
import type { Role } from '@opscore/domain';

const JWT_SECRET = new TextEncoder().encode(
  process.env['JWT_SECRET'] ?? 'dev-secret-change-in-production-min-32-chars',
);

const ACCESS_EXPIRY = process.env['JWT_ACCESS_EXPIRY'] ?? '15m';
const REFRESH_EXPIRY = process.env['JWT_REFRESH_EXPIRY'] ?? '14d';

export interface TokenPayload {
  sub: string;
  tenantId: string;
  role: Role;
  type: 'access' | 'refresh';
}

export async function signAccessToken(payload: Omit<TokenPayload, 'type'>): Promise<string> {
  return new SignJWT({ ...payload, type: 'access' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(ACCESS_EXPIRY)
    .sign(JWT_SECRET);
}

export async function signRefreshToken(payload: Omit<TokenPayload, 'type'>): Promise<string> {
  return new SignJWT({ ...payload, type: 'refresh' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(REFRESH_EXPIRY)
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<TokenPayload> {
  const { payload } = await jwtVerify(token, JWT_SECRET);
  return payload as unknown as TokenPayload;
}
