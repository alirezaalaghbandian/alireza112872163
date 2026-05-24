import type { FastifyInstance } from 'fastify';
import { eq, and, desc, lt, gte, lte, sql } from 'drizzle-orm';
import { signals, kpis, kpiSnapshots, anomalies } from '@opscore/db/schema';
import { CreateSignalSchema, ListSignalsSchema, CreateKpiSchema, ListSnapshotsSchema } from '@opscore/domain';
import type { Database } from '../../lib/db.js';
import { sendError } from '../../lib/errors.js';
import { assertCan } from '../../lib/rbac.js';
import { eventBus } from '../../lib/event-bus.js';
import type { Role } from '@opscore/domain';

interface RequestCtx {
  tenantId: string;
  userId: string;
  role: Role;
  ipAddress: string;
  userAgent: string;
}

export function registerObservabilityModule(app: FastifyInstance, db: Database) {
  // Signals
  app.get('/api/v1/signals', async (request, reply) => {
    try {
      const ctx = (request as Record<string, unknown>)['ctx'] as RequestCtx;
      assertCan(ctx.role, 'signals:read');
      const query = ListSignalsSchema.parse(request.query);

      const conditions = [eq(signals.tenantId, ctx.tenantId)];
      if (query.cursor) conditions.push(lt(signals.id, query.cursor));
      if (query.from) conditions.push(gte(signals.observedAt, new Date(query.from)));
      if (query.to) conditions.push(lte(signals.observedAt, new Date(query.to)));
      if (query.source) conditions.push(eq(signals.source, query.source));

      const rows = await db
        .select()
        .from(signals)
        .where(and(...conditions))
        .orderBy(desc(signals.observedAt))
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

  app.post('/api/v1/signals', async (request, reply) => {
    try {
      const ctx = (request as Record<string, unknown>)['ctx'] as RequestCtx;
      assertCan(ctx.role, 'signals:write');
      const body = CreateSignalSchema.parse(request.body);
      const idempotencyKey = request.headers['idempotency-key'] as string | undefined;

      if (idempotencyKey) {
        const existing = await db
          .select()
          .from(signals)
          .where(and(eq(signals.tenantId, ctx.tenantId), eq(signals.idempotencyKey, idempotencyKey)))
          .limit(1);
        if (existing[0]) {
          return reply.status(200).send(existing[0]);
        }
      }

      const rows = await db
        .insert(signals)
        .values({
          tenantId: ctx.tenantId,
          source: body.source,
          kind: body.kind,
          payload: body.payload,
          observedAt: new Date(body.observedAt),
          idempotencyKey,
        })
        .returning();

      const signal = rows[0]!;
      eventBus.publish({
        type: 'signal.ingested',
        tenantId: ctx.tenantId,
        entityId: signal.id,
        entityType: 'signal',
        occurredAt: new Date(),
        payload: { source: body.source, kind: body.kind },
        actorId: ctx.userId,
      });

      return reply.status(201).send(signal);
    } catch (error) {
      sendError(reply, error, request.url);
    }
  });

  // KPIs
  app.get('/api/v1/kpis', async (request, reply) => {
    try {
      const ctx = (request as Record<string, unknown>)['ctx'] as RequestCtx;
      assertCan(ctx.role, 'kpis:read');

      const rows = await db
        .select()
        .from(kpis)
        .where(eq(kpis.tenantId, ctx.tenantId))
        .orderBy(desc(kpis.createdAt));

      return reply.send({ items: rows, nextCursor: null });
    } catch (error) {
      sendError(reply, error, request.url);
    }
  });

  app.post('/api/v1/kpis', async (request, reply) => {
    try {
      const ctx = (request as Record<string, unknown>)['ctx'] as RequestCtx;
      assertCan(ctx.role, 'kpis:write');
      const body = CreateKpiSchema.parse(request.body);

      const rows = await db
        .insert(kpis)
        .values({
          tenantId: ctx.tenantId,
          name: body.name,
          formula: body.formula,
          unit: body.unit,
          direction: body.direction,
          thresholds: body.thresholds,
          windowSeconds: body.windowSeconds,
        })
        .returning();

      return reply.status(201).send(rows[0]);
    } catch (error) {
      sendError(reply, error, request.url);
    }
  });

  app.get('/api/v1/kpis/:id/snapshots', async (request, reply) => {
    try {
      const ctx = (request as Record<string, unknown>)['ctx'] as RequestCtx;
      assertCan(ctx.role, 'kpis:read');
      const params = request.params as { id: string };
      const query = ListSnapshotsSchema.parse(request.query);

      const windowMap: Record<string, number> = {
        '1h': 3600, '6h': 21600, '24h': 86400, '7d': 604800, '30d': 2592000,
      };
      const windowSeconds = windowMap[query.window] ?? 86400;
      const since = new Date(Date.now() - windowSeconds * 1000);

      const rows = await db
        .select()
        .from(kpiSnapshots)
        .where(
          and(
            eq(kpiSnapshots.tenantId, ctx.tenantId),
            eq(kpiSnapshots.kpiId, params.id),
            gte(kpiSnapshots.computedAt, since),
          ),
        )
        .orderBy(desc(kpiSnapshots.computedAt));

      return reply.send({ items: rows, nextCursor: null });
    } catch (error) {
      sendError(reply, error, request.url);
    }
  });

  // Anomalies
  app.get('/api/v1/anomalies', async (request, reply) => {
    try {
      const ctx = (request as Record<string, unknown>)['ctx'] as RequestCtx;
      assertCan(ctx.role, 'anomalies:read');

      const rows = await db
        .select()
        .from(anomalies)
        .where(eq(anomalies.tenantId, ctx.tenantId))
        .orderBy(desc(anomalies.detectedAt))
        .limit(100);

      return reply.send({ items: rows, nextCursor: null });
    } catch (error) {
      sendError(reply, error, request.url);
    }
  });
}
