import { eq, and } from 'drizzle-orm';
import { memberships, users, organizations } from '@opscore/db/schema';
import type { Database } from '../../../lib/db.js';
import type { MembershipEntity, MembershipRepository, UserEntity, OrganizationEntity } from '../domain/types.js';
import type { Role } from '@opscore/domain';

export class DrizzleMembershipRepository implements MembershipRepository {
  constructor(private readonly db: Database) {}

  async findByUserAndOrg(userId: string, orgId: string): Promise<MembershipEntity | null> {
    const rows = await this.db
      .select()
      .from(memberships)
      .where(and(eq(memberships.userId, userId), eq(memberships.orgId, orgId)))
      .limit(1);
    const row = rows[0];
    return row ? { ...row, role: row.role as Role } : null;
  }

  async findByOrg(orgId: string): Promise<(MembershipEntity & { user: Pick<UserEntity, 'id' | 'email' | 'name'> })[]> {
    const rows = await this.db
      .select({
        id: memberships.id,
        userId: memberships.userId,
        orgId: memberships.orgId,
        role: memberships.role,
        createdAt: memberships.createdAt,
        userName: users.name,
        userEmail: users.email,
      })
      .from(memberships)
      .innerJoin(users, eq(memberships.userId, users.id))
      .where(eq(memberships.orgId, orgId));

    return rows.map((row) => ({
      id: row.id,
      userId: row.userId,
      orgId: row.orgId,
      role: row.role as Role,
      createdAt: row.createdAt,
      user: {
        id: row.userId,
        email: row.userEmail,
        name: row.userName,
      },
    }));
  }

  async findByUser(userId: string): Promise<(MembershipEntity & { org: Pick<OrganizationEntity, 'id' | 'name' | 'slug'> })[]> {
    const rows = await this.db
      .select({
        id: memberships.id,
        userId: memberships.userId,
        orgId: memberships.orgId,
        role: memberships.role,
        createdAt: memberships.createdAt,
        orgName: organizations.name,
        orgSlug: organizations.slug,
      })
      .from(memberships)
      .innerJoin(organizations, eq(memberships.orgId, organizations.id))
      .where(eq(memberships.userId, userId));

    return rows.map((row) => ({
      id: row.id,
      userId: row.userId,
      orgId: row.orgId,
      role: row.role as Role,
      createdAt: row.createdAt,
      org: {
        id: row.orgId,
        name: row.orgName,
        slug: row.orgSlug,
      },
    }));
  }

  async create(membership: Omit<MembershipEntity, 'id' | 'createdAt'>): Promise<MembershipEntity> {
    const rows = await this.db.insert(memberships).values(membership).returning();
    const row = rows[0];
    if (!row) throw new Error('Failed to create membership');
    return { ...row, role: row.role as Role };
  }

  async updateRole(id: string, role: Role): Promise<void> {
    await this.db.update(memberships).set({ role }).where(eq(memberships.id, id));
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(memberships).where(eq(memberships.id, id));
  }
}
