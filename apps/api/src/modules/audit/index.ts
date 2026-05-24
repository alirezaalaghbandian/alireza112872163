import type { FastifyInstance } from 'fastify';
import { eq, and, desc, lt, gte, lte } from 'drizzle-orm';
import { auditEntries } from '@opscore/db/schema';
import { ListAuditSchema, type Role } from '@opscore/domain';
import type { Database } from '../../lib/db.js';
import { sendError } from '../../lib/errors.js';
import { assertCan } from '../../lib/rbac.js';

interface RequestCtx {
  tenantId: string;
  userId: string;
  role: Role;
}

export function registerAuditModule(app: FastifyInstance, db: Database) {
  app.get('/api/v1/audit', async (request, reply) => {
    try {
      const ctx = (request as Record<string, unknown>)['ctx'] as RequestCtx;
      assertCan(ctx.role, 'audit:read');
      const query = ListAuditSchema.parse(request.query);

      const conditions = [eq(auditEntries.tenantId, ctx.tenantId)];
      if (query.actor) conditions.push(eq(auditEntries.actorId, query.actor));
      if (query.entityType) conditions.push(eq(auditEntries.entityType, query.entityType));
      if (query.entityId) conditions.push(eq(auditEntries.entityId, query.entityId));
      if (query.from) conditions.push(gte(auditEntries.occurredAt, new Date(query.from)));
      if (query.to) conditions.push(lte(auditEntries.occurredAt, new Date(query.to)));
      if (query.cursor) conditions.push(lt(auditEntries.id, query.cursor));

      const rows = await db
        .select()
        .from(auditEntries)
        .where(and(...conditions))
        .orderBy(desc(auditEntries.occurredAt))
        .limit(query.limit + 1);

      const hasMore = rows.length > query.limit;
      const items = hasMore ? rows.slice(0, -1) : rows;
      const lastItem = items[items.length - 1];

      return reply.send({
        items,
        nextCursor: hasMore && lastItem ? lastItem.id : null,
      });
    } catch (error) {
      sendError(reply, error, request.url);
    }
  });
}

export async function logAuditEntry(
  db: Database,
  entry: {
    tenantId: string;
    actorId: string;
    action: string;
    entityType: string;
    entityId: string;
    before?: Record<string, unknown> | null;
    after?: Record<string, unknown> | null;
    ipAddress: string;
    userAgent: string;
  },
) {
  await db.insert(auditEntries).values({
    tenantId: entry.tenantId,
    actorId: entry.actorId,
    action: entry.action,
    entityType: entry.entityType,
    entityId: entry.entityId,
    before: entry.before ?? null,
    after: entry.after ?? null,
    ipAddress: entry.ipAddress,
    userAgent: entry.userAgent,
  });
}
