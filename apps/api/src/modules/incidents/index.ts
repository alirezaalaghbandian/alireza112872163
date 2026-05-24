import type { FastifyInstance } from 'fastify';
import { eq, and, desc, lt } from 'drizzle-orm';
import { incidents, incidentEvents, comments } from '@opscore/db/schema';
import {
  CreateIncidentSchema,
  UpdateIncidentSchema,
  CreateCommentSchema,
  VALID_INCIDENT_TRANSITIONS,
  InvalidTransitionError,
  NotFoundError,
  type IncidentStatus,
} from '@opscore/domain';
import type { Database } from '../../lib/db.js';
import { sendError } from '../../lib/errors.js';
import { assertCan } from '../../lib/rbac.js';
import { eventBus } from '../../lib/event-bus.js';
import '../../types.js';

export function registerIncidentsModule(app: FastifyInstance, db: Database) {
  app.get('/api/v1/incidents', async (request, reply) => {
    try {
      const ctx = request.ctx;
      assertCan(ctx.role, 'incidents:read');
      const query = request.query as { status?: string; cursor?: string; limit?: string };

      const conditions = [eq(incidents.tenantId, ctx.tenantId)];
      if (query.status) conditions.push(eq(incidents.status, query.status));
      if (query.cursor) conditions.push(lt(incidents.id, query.cursor));

      const limit = Math.min(parseInt(query.limit ?? '50', 10), 100);
      const rows = await db
        .select()
        .from(incidents)
        .where(and(...conditions))
        .orderBy(desc(incidents.createdAt))
        .limit(limit + 1);

      const hasMore = rows.length > limit;
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

  app.post('/api/v1/incidents', async (request, reply) => {
    try {
      const ctx = request.ctx;
      assertCan(ctx.role, 'incidents:write');
      const body = CreateIncidentSchema.parse(request.body);

      const rows = await db
        .insert(incidents)
        .values({
          tenantId: ctx.tenantId,
          title: body.title,
          summary: body.summary,
          priority: body.priority,
          status: 'open',
          createdBy: ctx.userId,
        })
        .returning();

      const incident = rows[0]!;

      await db.insert(incidentEvents).values({
        tenantId: ctx.tenantId,
        incidentId: incident.id,
        kind: 'created',
        payload: { priority: body.priority },
        actorId: ctx.userId,
      });

      eventBus.publish({
        type: 'incident.created',
        tenantId: ctx.tenantId,
        entityId: incident.id,
        entityType: 'incident',
        occurredAt: new Date(),
        payload: { title: body.title, priority: body.priority },
        actorId: ctx.userId,
      });

      return reply.status(201).send(incident);
    } catch (error) {
      sendError(reply, error, request.url);
    }
  });

  app.get('/api/v1/incidents/:id', async (request, reply) => {
    try {
      const ctx = request.ctx;
      assertCan(ctx.role, 'incidents:read');
      const params = request.params as { id: string };

      const rows = await db
        .select()
        .from(incidents)
        .where(and(eq(incidents.id, params.id), eq(incidents.tenantId, ctx.tenantId)))
        .limit(1);

      const incident = rows[0];
      if (!incident) throw new NotFoundError('Incident', params.id);

      const eventRows = await db
        .select()
        .from(incidentEvents)
        .where(eq(incidentEvents.incidentId, params.id))
        .orderBy(desc(incidentEvents.occurredAt));

      const commentRows = await db
        .select()
        .from(comments)
        .where(eq(comments.incidentId, params.id))
        .orderBy(desc(comments.createdAt));

      return reply.send({
        ...incident,
        events: eventRows,
        comments: commentRows,
      });
    } catch (error) {
      sendError(reply, error, request.url);
    }
  });

  app.patch('/api/v1/incidents/:id', async (request, reply) => {
    try {
      const ctx = request.ctx;
      assertCan(ctx.role, 'incidents:write');
      const params = request.params as { id: string };
      const body = UpdateIncidentSchema.parse(request.body);

      const existing = await db
        .select()
        .from(incidents)
        .where(and(eq(incidents.id, params.id), eq(incidents.tenantId, ctx.tenantId)))
        .limit(1);

      const incident = existing[0];
      if (!incident) throw new NotFoundError('Incident', params.id);

      if (body.status) {
        const currentStatus = incident.status as IncidentStatus;
        const allowed = VALID_INCIDENT_TRANSITIONS[currentStatus];
        if (!allowed?.includes(body.status)) {
          throw new InvalidTransitionError(currentStatus, body.status);
        }
      }

      const updates: Record<string, unknown> = { updatedAt: new Date() };
      if (body.status) {
        updates['status'] = body.status;
        if (body.status === 'acknowledged') updates['acknowledgedAt'] = new Date();
        if (body.status === 'resolved') updates['resolvedAt'] = new Date();
        if (body.status === 'closed') updates['closedAt'] = new Date();
      }
      if (body.priority) updates['priority'] = body.priority;
      if (body.assigneeId !== undefined) updates['assigneeId'] = body.assigneeId;
      if (body.title) updates['title'] = body.title;
      if (body.summary !== undefined) updates['summary'] = body.summary;

      const updated = await db
        .update(incidents)
        .set(updates)
        .where(eq(incidents.id, params.id))
        .returning();

      if (body.status) {
        await db.insert(incidentEvents).values({
          tenantId: ctx.tenantId,
          incidentId: params.id,
          kind: 'status_changed',
          payload: { from: incident.status, to: body.status },
          actorId: ctx.userId,
        });

        eventBus.publish({
          type: 'incident.status_changed',
          tenantId: ctx.tenantId,
          entityId: params.id,
          entityType: 'incident',
          occurredAt: new Date(),
          payload: { from: incident.status, to: body.status },
          actorId: ctx.userId,
        });
      }

      return reply.send(updated[0]);
    } catch (error) {
      sendError(reply, error, request.url);
    }
  });

  app.post('/api/v1/incidents/:id/comments', async (request, reply) => {
    try {
      const ctx = request.ctx;
      assertCan(ctx.role, 'incidents:comment');
      const params = request.params as { id: string };
      const body = CreateCommentSchema.parse(request.body);

      const existing = await db
        .select()
        .from(incidents)
        .where(and(eq(incidents.id, params.id), eq(incidents.tenantId, ctx.tenantId)))
        .limit(1);
      if (!existing[0]) throw new NotFoundError('Incident', params.id);

      const rows = await db
        .insert(comments)
        .values({
          tenantId: ctx.tenantId,
          incidentId: params.id,
          authorId: ctx.userId,
          body: body.body,
        })
        .returning();

      eventBus.publish({
        type: 'comment.added',
        tenantId: ctx.tenantId,
        entityId: rows[0]!.id,
        entityType: 'comment',
        occurredAt: new Date(),
        payload: { incidentId: params.id },
        actorId: ctx.userId,
      });

      return reply.status(201).send(rows[0]);
    } catch (error) {
      sendError(reply, error, request.url);
    }
  });
}
