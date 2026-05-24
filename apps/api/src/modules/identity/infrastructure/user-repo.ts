import { eq } from 'drizzle-orm';
import { users } from '@opscore/db/schema';
import type { Database } from '../../../lib/db.js';
import type { UserEntity, UserRepository } from '../domain/types.js';

function toEntity(row: typeof users.$inferSelect): UserEntity {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    passwordHash: row.passwordHash,
    totpSecret: row.totpSecret,
    totpEnabled: row.totpEnabled === 'true',
    failedLoginAttempts: parseInt(row.failedLoginAttempts, 10),
    lockedUntil: row.lockedUntil,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export class DrizzleUserRepository implements UserRepository {
  constructor(private readonly db: Database) {}

  async findByEmail(email: string): Promise<UserEntity | null> {
    const rows = await this.db.select().from(users).where(eq(users.email, email)).limit(1);
    const row = rows[0];
    return row ? toEntity(row) : null;
  }

  async findById(id: string): Promise<UserEntity | null> {
    const rows = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    const row = rows[0];
    return row ? toEntity(row) : null;
  }

  async create(
    user: Omit<UserEntity, 'id' | 'createdAt' | 'updatedAt' | 'failedLoginAttempts' | 'lockedUntil' | 'totpSecret' | 'totpEnabled'>,
  ): Promise<UserEntity> {
    const rows = await this.db.insert(users).values(user).returning();
    const row = rows[0];
    if (!row) throw new Error('Failed to create user');
    return toEntity(row);
  }

  async updateFailedAttempts(id: string, attempts: number, lockedUntil: Date | null): Promise<void> {
    await this.db
      .update(users)
      .set({
        failedLoginAttempts: String(attempts),
        lockedUntil,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id));
  }

  async updatePassword(id: string, passwordHash: string): Promise<void> {
    await this.db
      .update(users)
      .set({ passwordHash, updatedAt: new Date() })
      .where(eq(users.id, id));
  }
}
