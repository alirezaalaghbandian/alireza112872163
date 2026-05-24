import { eq } from 'drizzle-orm';
import { organizations } from '@opscore/db/schema';
import type { Database } from '../../../lib/db.js';
import type { OrganizationEntity, OrganizationRepository } from '../domain/types.js';

export class DrizzleOrganizationRepository implements OrganizationRepository {
  constructor(private readonly db: Database) {}

  async findById(id: string): Promise<OrganizationEntity | null> {
    const rows = await this.db.select().from(organizations).where(eq(organizations.id, id)).limit(1);
    return rows[0] ?? null;
  }

  async findBySlug(slug: string): Promise<OrganizationEntity | null> {
    const rows = await this.db.select().from(organizations).where(eq(organizations.slug, slug)).limit(1);
    return rows[0] ?? null;
  }

  async create(org: Omit<OrganizationEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<OrganizationEntity> {
    const rows = await this.db.insert(organizations).values(org).returning();
    const row = rows[0];
    if (!row) throw new Error('Failed to create organization');
    return row;
  }

  async update(id: string, data: Partial<Pick<OrganizationEntity, 'name' | 'slug'>>): Promise<OrganizationEntity> {
    const rows = await this.db
      .update(organizations)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(organizations.id, id))
      .returning();
    const row = rows[0];
    if (!row) throw new Error('Failed to update organization');
    return row;
  }
}
