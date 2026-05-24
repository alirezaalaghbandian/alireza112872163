import argon2 from 'argon2';
import { createHash, randomUUID } from 'crypto';
import {
  UnauthorizedError,
  ConflictError,
  NotFoundError,
  type Role,
} from '@opscore/domain';
import { signAccessToken, signRefreshToken, verifyToken } from '../../../lib/auth.js';
import type {
  UserRepository,
  OrganizationRepository,
  MembershipRepository,
  RefreshTokenRepository,
} from '../domain/types.js';

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000;

interface AuthResult {
  accessToken: string;
  refreshToken: string;
  user: { id: string; email: string; name: string };
  org: { id: string; name: string; slug: string };
  role: Role;
}

export class AuthService {
  constructor(
    private readonly users: UserRepository,
    private readonly orgs: OrganizationRepository,
    private readonly memberships: MembershipRepository,
    private readonly refreshTokens: RefreshTokenRepository,
  ) {}

  async signup(email: string, password: string, name: string, orgName: string): Promise<AuthResult> {
    const existing = await this.users.findByEmail(email);
    if (existing) {
      throw new ConflictError('A user with this email already exists');
    }

    const passwordHash = await argon2.hash(password, { type: argon2.argon2id });
    const slug = orgName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    const existingOrg = await this.orgs.findBySlug(slug);
    if (existingOrg) {
      throw new ConflictError('An organization with this slug already exists');
    }

    const user = await this.users.create({ email, name, passwordHash });
    const org = await this.orgs.create({ name: orgName, slug });
    await this.memberships.create({ userId: user.id, orgId: org.id, role: 'org_owner' });

    const accessToken = await signAccessToken({ sub: user.id, tenantId: org.id, role: 'org_owner' });
    const refreshToken = await this.createRefreshToken(user.id, org.id, 'org_owner');

    return {
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, name: user.name },
      org: { id: org.id, name: org.name, slug: org.slug },
      role: 'org_owner',
    };
  }

  async login(email: string, password: string): Promise<AuthResult> {
    const user = await this.users.findByEmail(email);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      throw new UnauthorizedError('Account is temporarily locked. Please try again later.');
    }

    const valid = await argon2.verify(user.passwordHash, password);
    if (!valid) {
      const attempts = user.failedLoginAttempts + 1;
      const lockedUntil = attempts >= MAX_FAILED_ATTEMPTS
        ? new Date(Date.now() + LOCKOUT_DURATION_MS)
        : null;
      await this.users.updateFailedAttempts(user.id, attempts, lockedUntil);
      throw new UnauthorizedError('Invalid email or password');
    }

    await this.users.updateFailedAttempts(user.id, 0, null);

    const userMemberships = await this.memberships.findByUser(user.id);
    const firstMembership = userMemberships[0];
    if (!firstMembership) {
      throw new UnauthorizedError('User does not belong to any organization');
    }

    const role = firstMembership.role as Role;
    const tenantId = firstMembership.orgId;

    const accessToken = await signAccessToken({ sub: user.id, tenantId, role });
    const refreshToken = await this.createRefreshToken(user.id, tenantId, role);

    return {
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, name: user.name },
      org: { id: firstMembership.org.id, name: firstMembership.org.name, slug: firstMembership.org.slug },
      role,
    };
  }

  async refresh(refreshTokenValue: string): Promise<{ accessToken: string; refreshToken: string }> {
    const tokenHash = this.hashToken(refreshTokenValue);
    const stored = await this.refreshTokens.findByHash(tokenHash);

    if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }

    await this.refreshTokens.revoke(stored.id);

    const payload = await verifyToken(refreshTokenValue);

    const accessToken = await signAccessToken({
      sub: payload.sub,
      tenantId: payload.tenantId,
      role: payload.role,
    });
    const newRefreshToken = await this.createRefreshToken(
      payload.sub,
      payload.tenantId,
      payload.role,
    );

    return { accessToken, refreshToken: newRefreshToken };
  }

  async logout(userId: string): Promise<void> {
    await this.refreshTokens.revokeAllForUser(userId);
  }

  private async createRefreshToken(userId: string, tenantId: string, role: Role): Promise<string> {
    const token = await signRefreshToken({ sub: userId, tenantId, role });
    const tokenHash = this.hashToken(token);
    const expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    await this.refreshTokens.create(userId, tokenHash, expiresAt);
    return token;
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
