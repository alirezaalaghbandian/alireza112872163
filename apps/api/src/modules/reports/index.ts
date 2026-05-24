import type { FastifyInstance } from 'fastify';
import { eq, and, desc } from 'drizzle-orm';
import { reports, reportRuns } from '@opscore/db/schema';
import { CreateReportSchema, NotFoundError } from '@opscore/domain';
import type { Database } from '../../lib/db.js';
import { sendError } from '../../lib/errors.js';
import { assertCan } from '../../lib/rbac.js';
import { eventBus } from '../../lib/event-bus.js';
import '../../types.js';

export function registerReportsModule(app: FastifyInstance, db: Database) {
  app.get('/api/v1/reports', async (request, reply) => {
    try {
      const ctx = request.ctx;
      assertCan(ctx.role, 'reports:read');

      const rows = await db
        .select()
        .from(reports)
        .where(eq(reports.tenantId, ctx.tenantId))
        .orderBy(desc(reports.createdAt));

      return reply.send({ items: rows, nextCursor: null });
    } catch (error) {
      sendError(reply, error, request.url);
    }
  });

  app.post('/api/v1/reports', async (request, reply) => {
    try {
      const ctx = request.ctx;
      assertCan(ctx.role, 'reports:write');
      const body = CreateReportSchema.parse(request.body);

      const rows = await db
        .insert(reports)
        .values({
          tenantId: ctx.tenantId,
          title: body.title,
          type: body.type,
          config: body.config ?? {},
          createdBy: ctx.userId,
        })
        .returning();

      return reply.status(201).send(rows[0]);
    } catch (error) {
      sendError(reply, error, request.url);
    }
  });

  app.post('/api/v1/reports/:id/run', async (request, reply) => {
    try {
      const ctx = request.ctx;
      assertCan(ctx.role, 'reports:run');
      const params = request.params as { id: string };

      const existing = await db
        .select()
        .from(reports)
        .where(and(eq(reports.id, params.id), eq(reports.tenantId, ctx.tenantId)))
        .limit(1);
      if (!existing[0]) throw new NotFoundError('Report', params.id);

      const rows = await db
        .insert(reportRuns)
        .values({
          tenantId: ctx.tenantId,
          reportId: params.id,
          status: 'pending',
        })
        .returning();

      const run = rows[0]!;

      // In production, this would dispatch to BullMQ
      // For now, simulate immediate completion
      await db
        .update(reportRuns)
        .set({
          status: 'completed',
          startedAt: new Date(),
          completedAt: new Date(),
          outputUrl: `/exports/${run.id}.pdf`,
        })
        .where(eq(reportRuns.id, run.id));

      eventBus.publish({
        type: 'report.run_completed',
        tenantId: ctx.tenantId,
        entityId: run.id,
        entityType: 'report_run',
        occurredAt: new Date(),
        payload: { reportId: params.id },
        actorId: ctx.userId,
      });

      return reply.status(202).send({ ...run, status: 'completed' });
    } catch (error) {
      sendError(reply, error, request.url);
    }
  });
}
