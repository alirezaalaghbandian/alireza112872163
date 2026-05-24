import { eq } from 'drizzle-orm';
import { refreshTokens } from '@opscore/db/schema';
import type { Database } from '../../../lib/db.js';
import type { RefreshTokenRepository } from '../domain/types.js';

export class DrizzleRefreshTokenRepository implements RefreshTokenRepository {
  constructor(private readonly db: Database) {}

  async create(userId: string, tokenHash: string, expiresAt: Date): Promise<string> {
    const rows = await this.db
      .insert(refreshTokens)
      .values({ userId, tokenHash, expiresAt })
      .returning();
    const row = rows[0];
    if (!row) throw new Error('Failed to create refresh token');
    return row.id;
  }

  async findByHash(tokenHash: string) {
    const rows = await this.db
      .select()
      .from(refreshTokens)
      .where(eq(refreshTokens.tokenHash, tokenHash))
      .limit(1);
    return rows[0] ?? null;
  }

  async revoke(id: string): Promise<void> {
    await this.db
      .update(refreshTokens)
      .set({ revokedAt: new Date() })
      .where(eq(refreshTokens.id, id));
  }

  async revokeAllForUser(userId: string): Promise<void> {
    await this.db
      .update(refreshTokens)
      .set({ revokedAt: new Date() })
      .where(eq(refreshTokens.userId, userId));
  }
}
