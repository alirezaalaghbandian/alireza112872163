import type { FastifyInstance } from 'fastify';
import { eq, and, desc } from 'drizzle-orm';
import { copilotConversations, copilotMessages, signals, anomalies, incidents } from '@opscore/db/schema';
import { CreateConversationSchema, SendMessageSchema, NotFoundError, ValidationError } from '@opscore/domain';
import type { Database } from '../../lib/db.js';
import { sendError } from '../../lib/errors.js';
import { assertCan } from '../../lib/rbac.js';
import { eventBus } from '../../lib/event-bus.js';
import '../../types.js';

interface LLMProvider {
  generateStream(
    systemPrompt: string,
    messages: Array<{ role: string; content: string }>,
    context: string,
  ): AsyncIterable<string>;
}

class MockLLMProvider implements LLMProvider {
  async *generateStream(
    _systemPrompt: string,
    messages: Array<{ role: string; content: string }>,
    context: string,
  ): AsyncIterable<string> {
    const lastMessage = messages[messages.length - 1];
    const response = `Based on my analysis of recent operational data, I can provide the following insights regarding your query about "${lastMessage?.content ?? 'the current situation'}". The data shows patterns consistent with the signals observed in your environment. ${context ? 'I found relevant context in the provided data.' : ''}`;

    const words = response.split(' ');
    for (const word of words) {
      yield word + ' ';
      await new Promise((resolve) => setTimeout(resolve, 30));
    }
  }
}

function getLLMProvider(): LLMProvider {
  return new MockLLMProvider();
}

export function registerCopilotModule(app: FastifyInstance, db: Database) {
  const llmProvider = getLLMProvider();

  app.post('/api/v1/copilot/conversations', async (request, reply) => {
    try {
      const ctx = request.ctx;
      assertCan(ctx.role, 'copilot:write');
      const body = CreateConversationSchema.parse(request.body);

      const rows = await db
        .insert(copilotConversations)
        .values({
          tenantId: ctx.tenantId,
          userId: ctx.userId,
          title: body.title ?? 'New conversation',
        })
        .returning();

      return reply.status(201).send(rows[0]);
    } catch (error) {
      sendError(reply, error, request.url);
    }
  });

  app.get('/api/v1/copilot/conversations', async (request, reply) => {
    try {
      const ctx = request.ctx;
      assertCan(ctx.role, 'copilot:read');

      const rows = await db
        .select()
        .from(copilotConversations)
        .where(
          and(
            eq(copilotConversations.tenantId, ctx.tenantId),
            eq(copilotConversations.userId, ctx.userId),
          ),
        )
        .orderBy(desc(copilotConversations.updatedAt));

      return reply.send({ items: rows, nextCursor: null });
    } catch (error) {
      sendError(reply, error, request.url);
    }
  });

  app.get('/api/v1/copilot/conversations/:id/messages', async (request, reply) => {
    try {
      const ctx = request.ctx;
      assertCan(ctx.role, 'copilot:read');
      const params = request.params as { id: string };

      const conv = await db
        .select()
        .from(copilotConversations)
        .where(
          and(
            eq(copilotConversations.id, params.id),
            eq(copilotConversations.tenantId, ctx.tenantId),
          ),
        )
        .limit(1);
      if (!conv[0]) throw new NotFoundError('Conversation', params.id);

      const msgs = await db
        .select()
        .from(copilotMessages)
        .where(eq(copilotMessages.conversationId, params.id))
        .orderBy(copilotMessages.createdAt);

      return reply.send({ items: msgs, nextCursor: null });
    } catch (error) {
      sendError(reply, error, request.url);
    }
  });

  app.post('/api/v1/copilot/conversations/:id/messages', async (request, reply) => {
    try {
      const ctx = request.ctx;
      assertCan(ctx.role, 'copilot:write');
      const params = request.params as { id: string };
      const body = SendMessageSchema.parse(request.body);

      const conv = await db
        .select()
        .from(copilotConversations)
        .where(
          and(
            eq(copilotConversations.id, params.id),
            eq(copilotConversations.tenantId, ctx.tenantId),
          ),
        )
        .limit(1);
      if (!conv[0]) throw new NotFoundError('Conversation', params.id);

      // Store user message
      await db.insert(copilotMessages).values({
        tenantId: ctx.tenantId,
        conversationId: params.id,
        role: 'user',
        content: body.content,
        tokensIn: 0,
        tokensOut: 0,
      });

      // Retrieve context: recent signals and anomalies
      const recentSignals = await db
        .select()
        .from(signals)
        .where(eq(signals.tenantId, ctx.tenantId))
        .orderBy(desc(signals.observedAt))
        .limit(10);

      const recentAnomalies = await db
        .select()
        .from(anomalies)
        .where(eq(anomalies.tenantId, ctx.tenantId))
        .orderBy(desc(anomalies.detectedAt))
        .limit(5);

      const recentIncidents = await db
        .select()
        .from(incidents)
        .where(eq(incidents.tenantId, ctx.tenantId))
        .orderBy(desc(incidents.createdAt))
        .limit(5);

      // Build citations from context
      const citationEntities: Array<{ type: string; id: string }> = [];
      if (recentSignals[0]) citationEntities.push({ type: 'signal', id: recentSignals[0].id });
      if (recentAnomalies[0]) citationEntities.push({ type: 'anomaly', id: recentAnomalies[0].id });
      if (recentIncidents[0]) citationEntities.push({ type: 'incident', id: recentIncidents[0].id });

      if (citationEntities.length === 0) {
        throw new ValidationError('Cannot generate a response without any operational data to cite');
      }

      // Get conversation history
      const history = await db
        .select()
        .from(copilotMessages)
        .where(eq(copilotMessages.conversationId, params.id))
        .orderBy(copilotMessages.createdAt);

      const contextStr = JSON.stringify({
        signals: recentSignals.slice(0, 3),
        anomalies: recentAnomalies.slice(0, 2),
        incidents: recentIncidents.slice(0, 2),
      });

      // SSE streaming
      reply.raw.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      });

      let fullContent = '';
      const stream = llmProvider.generateStream(
        'You are OpsCore Copilot, an AI assistant for operational intelligence.',
        history.map((m) => ({ role: m.role, content: m.content })),
        contextStr,
      );

      for await (const chunk of stream) {
        fullContent += chunk;
        reply.raw.write(`data: ${JSON.stringify({ type: 'token', content: chunk })}\n\n`);
      }

      // Store assistant message
      const assistantMsg = await db
        .insert(copilotMessages)
        .values({
          tenantId: ctx.tenantId,
          conversationId: params.id,
          role: 'assistant',
          content: fullContent,
          citations: citationEntities,
          tokensIn: Math.ceil(body.content.length / 4),
          tokensOut: Math.ceil(fullContent.length / 4),
          model: 'mock-provider',
        })
        .returning();

      reply.raw.write(
        `data: ${JSON.stringify({ type: 'done', message: assistantMsg[0], citations: citationEntities })}\n\n`,
      );
      reply.raw.end();
    } catch (error) {
      if (!reply.raw.headersSent) {
        sendError(reply, error, request.url);
      }
    }
  });
}
