import type { Role } from '@opscore/domain';

export interface UserEntity {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  totpSecret: string | null;
  totpEnabled: boolean;
  failedLoginAttempts: number;
  lockedUntil: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface MembershipEntity {
  id: string;
  userId: string;
  orgId: string;
  role: Role;
  createdAt: Date;
}

export interface OrganizationEntity {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InvitationEntity {
  id: string;
  tenantId: string;
  email: string;
  role: Role;
  invitedBy: string;
  acceptedAt: Date | null;
  expiresAt: Date;
  createdAt: Date;
}

export interface UserRepository {
  findByEmail(email: string): Promise<UserEntity | null>;
  findById(id: string): Promise<UserEntity | null>;
  create(user: Omit<UserEntity, 'id' | 'createdAt' | 'updatedAt' | 'failedLoginAttempts' | 'lockedUntil' | 'totpSecret' | 'totpEnabled'>): Promise<UserEntity>;
  updateFailedAttempts(id: string, attempts: number, lockedUntil: Date | null): Promise<void>;
  updatePassword(id: string, passwordHash: string): Promise<void>;
}

export interface OrganizationRepository {
  findById(id: string): Promise<OrganizationEntity | null>;
  findBySlug(slug: string): Promise<OrganizationEntity | null>;
  create(org: Omit<OrganizationEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<OrganizationEntity>;
  update(id: string, data: Partial<Pick<OrganizationEntity, 'name' | 'slug'>>): Promise<OrganizationEntity>;
}

export interface MembershipRepository {
  findByUserAndOrg(userId: string, orgId: string): Promise<MembershipEntity | null>;
  findByOrg(orgId: string): Promise<(MembershipEntity & { user: Pick<UserEntity, 'id' | 'email' | 'name'> })[]>;
  findByUser(userId: string): Promise<(MembershipEntity & { org: Pick<OrganizationEntity, 'id' | 'name' | 'slug'> })[]>;
  create(membership: Omit<MembershipEntity, 'id' | 'createdAt'>): Promise<MembershipEntity>;
  updateRole(id: string, role: Role): Promise<void>;
  delete(id: string): Promise<void>;
}

export interface InvitationRepository {
  findById(id: string): Promise<InvitationEntity | null>;
  findByEmail(tenantId: string, email: string): Promise<InvitationEntity | null>;
  findByTenant(tenantId: string): Promise<InvitationEntity[]>;
  create(invitation: Omit<InvitationEntity, 'id' | 'createdAt' | 'acceptedAt'>): Promise<InvitationEntity>;
  accept(id: string): Promise<void>;
}

export interface RefreshTokenRepository {
  create(userId: string, tokenHash: string, expiresAt: Date): Promise<string>;
  findByHash(tokenHash: string): Promise<{ id: string; userId: string; expiresAt: Date; revokedAt: Date | null } | null>;
  revoke(id: string): Promise<void>;
  revokeAllForUser(userId: string): Promise<void>;
}
