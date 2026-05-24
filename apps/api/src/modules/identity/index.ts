import type { FastifyInstance } from 'fastify';
import type { Database } from '../../lib/db.js';
import { AuthService } from './application/auth-service.js';
import { OrgService } from './application/org-service.js';
import { DrizzleUserRepository } from './infrastructure/user-repo.js';
import { DrizzleOrganizationRepository } from './infrastructure/org-repo.js';
import { DrizzleMembershipRepository } from './infrastructure/membership-repo.js';
import { DrizzleInvitationRepository } from './infrastructure/invitation-repo.js';
import { DrizzleRefreshTokenRepository } from './infrastructure/refresh-token-repo.js';
import { registerIdentityRoutes } from './http/routes.js';

export function registerIdentityModule(app: FastifyInstance, db: Database) {
  const userRepo = new DrizzleUserRepository(db);
  const orgRepo = new DrizzleOrganizationRepository(db);
  const membershipRepo = new DrizzleMembershipRepository(db);
  const invitationRepo = new DrizzleInvitationRepository(db);
  const refreshTokenRepo = new DrizzleRefreshTokenRepository(db);

  const authService = new AuthService(userRepo, orgRepo, membershipRepo, refreshTokenRepo);
  const orgService = new OrgService(orgRepo, membershipRepo, invitationRepo, userRepo);

  registerIdentityRoutes(app, authService, orgService);
}
