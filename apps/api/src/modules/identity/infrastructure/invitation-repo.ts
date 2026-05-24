import { eq, and } from 'drizzle-orm';
import { invitations } from '@opscore/db/schema';
import type { Database } from '../../../lib/db.js';
import type { InvitationEntity, InvitationRepository } from '../domain/types.js';
import type { Role } from '@opscore/domain';

export class DrizzleInvitationRepository implements InvitationRepository {
  constructor(private readonly db: Database) {}

  async findById(id: string): Promise<InvitationEntity | null> {
    const rows = await this.db.select().from(invitations).where(eq(invitations.id, id)).limit(1);
    const row = rows[0];
    return row ? { ...row, role: row.role as Role } : null;
  }

  async findByEmail(tenantId: string, email: string): Promise<InvitationEntity | null> {
    const rows = await this.db
      .select()
      .from(invitations)
      .where(and(eq(invitations.tenantId, tenantId), eq(invitations.email, email)))
      .limit(1);
    const row = rows[0];
    return row ? { ...row, role: row.role as Role } : null;
  }

  async findByTenant(tenantId: string): Promise<InvitationEntity[]> {
    const rows = await this.db
      .select()
      .from(invitations)
      .where(eq(invitations.tenantId, tenantId));
    return rows.map((row) => ({ ...row, role: row.role as Role }));
  }

  async create(invitation: Omit<InvitationEntity, 'id' | 'createdAt' | 'acceptedAt'>): Promise<InvitationEntity> {
    const rows = await this.db.insert(invitations).values(invitation).returning();
    const row = rows[0];
    if (!row) throw new Error('Failed to create invitation');
    return { ...row, role: row.role as Role };
  }

  async accept(id: string): Promise<void> {
    await this.db
      .update(invitations)
      .set({ acceptedAt: new Date() })
      .where(eq(invitations.id, id));
  }
}
