import {
  NotFoundError,
  ConflictError,
  ForbiddenError,
  type Role,
} from '@opscore/domain';
import type {
  OrganizationRepository,
  MembershipRepository,
  InvitationRepository,
  UserRepository,
} from '../domain/types.js';
import { assertCan } from '../../../lib/rbac.js';

export class OrgService {
  constructor(
    private readonly orgs: OrganizationRepository,
    private readonly memberships: MembershipRepository,
    private readonly invitations: InvitationRepository,
    private readonly users: UserRepository,
  ) {}

  async getOrg(orgId: string) {
    const org = await this.orgs.findById(orgId);
    if (!org) throw new NotFoundError('Organization', orgId);
    return org;
  }

  async updateOrg(orgId: string, role: Role, data: { name?: string; slug?: string }) {
    assertCan(role, 'org:update');

    if (data.slug) {
      const existing = await this.orgs.findBySlug(data.slug);
      if (existing && existing.id !== orgId) {
        throw new ConflictError('An organization with this slug already exists');
      }
    }

    return this.orgs.update(orgId, data);
  }

  async getMembers(orgId: string) {
    return this.memberships.findByOrg(orgId);
  }

  async updateMemberRole(orgId: string, memberId: string, role: Role, actorRole: Role) {
    assertCan(actorRole, 'org:manage_roles');

    const membership = await this.memberships.findByUserAndOrg(memberId, orgId);
    if (!membership) throw new NotFoundError('Membership', memberId);

    await this.memberships.updateRole(membership.id, role);
  }

  async invite(orgId: string, email: string, role: Role, invitedBy: string, actorRole: Role) {
    assertCan(actorRole, 'org:invite');

    const existing = await this.invitations.findByEmail(orgId, email);
    if (existing && !existing.acceptedAt) {
      throw new ConflictError('An invitation for this email already exists');
    }

    const existingUser = await this.users.findByEmail(email);
    if (existingUser) {
      const membership = await this.memberships.findByUserAndOrg(existingUser.id, orgId);
      if (membership) {
        throw new ConflictError('User is already a member of this organization');
      }
    }

    return this.invitations.create({
      tenantId: orgId,
      email,
      role,
      invitedBy,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
  }

  async acceptInvitation(invitationId: string, userId: string) {
    const invitation = await this.invitations.findById(invitationId);
    if (!invitation) throw new NotFoundError('Invitation', invitationId);
    if (invitation.acceptedAt) throw new ConflictError('Invitation already accepted');
    if (invitation.expiresAt < new Date()) throw new ForbiddenError('Invitation has expired');

    const user = await this.users.findById(userId);
    if (!user || user.email !== invitation.email) {
      throw new ForbiddenError('This invitation is not for your account');
    }

    await this.memberships.create({
      userId,
      orgId: invitation.tenantId,
      role: invitation.role as Role,
    });

    await this.invitations.accept(invitationId);
  }
}
