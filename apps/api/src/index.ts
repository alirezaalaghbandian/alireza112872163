import Fastify from 'fastify';
import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import { verifyToken } from './lib/auth.js';
import { db } from './lib/db.js';
import { sql as pgSql } from './lib/db.js';
import { sendError } from './lib/errors.js';
import { registerIdentityModule } from './modules/identity/index.js';
import { registerObservabilityModule } from './modules/observability/index.js';
import { registerIncidentsModule } from './modules/incidents/index.js';
import { registerCopilotModule } from './modules/copilot/index.js';
import { registerReportsModule } from './modules/reports/index.js';
import { registerAuditModule } from './modules/audit/index.js';
import { logAuditEntry } from './modules/audit/index.js';
import { eventBus } from './lib/event-bus.js';
import type { DomainEvent } from '@opscore/domain';

const app = Fastify({
  logger: {
    level: process.env['LOG_LEVEL'] ?? 'info',
    transport:
      process.env['NODE_ENV'] !== 'production'
        ? { target: 'pino-pretty', options: { colorize: true } }
        : undefined,
  },
  genReqId: () => crypto.randomUUID(),
});

// Plugins
await app.register(cookie, {
  secret: process.env['COOKIE_SECRET'] ?? 'dev-cookie-secret',
});

await app.register(cors, {
  origin: process.env['WEB_URL'] ?? 'http://localhost:3000',
  credentials: true,
});

await app.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute',
});

// Public paths that don't require auth
const PUBLIC_PATHS = new Set([
  '/api/v1/auth/login',
  '/api/v1/auth/signup',
  '/api/v1/auth/refresh',
  '/health',
  '/metrics',
]);

// Auth middleware
app.addHook('onRequest', async (request, reply) => {
  if (PUBLIC_PATHS.has(request.url.split('?')[0] ?? '')) return;
  if (request.method === 'OPTIONS') return;

  const authHeader = request.headers['authorization'];
  if (!authHeader?.startsWith('Bearer ')) {
    return reply.status(401).send({
      type: 'https://opscore.dev/errors/unauthorized',
      title: 'Unauthorized',
      status: 401,
      detail: 'Missing or invalid Authorization header',
    });
  }

  try {
    const token = authHeader.slice(7);
    const payload = await verifyToken(token);
    (request as Record<string, unknown>)['ctx'] = {
      userId: payload.sub,
      tenantId: payload.tenantId,
      role: payload.role,
      ipAddress: request.ip,
      userAgent: request.headers['user-agent'] ?? 'unknown',
    };
  } catch {
    return reply.status(401).send({
      type: 'https://opscore.dev/errors/unauthorized',
      title: 'Unauthorized',
      status: 401,
      detail: 'Invalid or expired token',
    });
  }
});

// Request logging
app.addHook('onResponse', async (request, reply) => {
  request.log.info({
    method: request.method,
    url: request.url,
    statusCode: reply.statusCode,
    responseTime: reply.elapsedTime,
    tenant_id: ((request as Record<string, unknown>)['ctx'] as Record<string, unknown> | undefined)?.['tenantId'],
    user_id: ((request as Record<string, unknown>)['ctx'] as Record<string, unknown> | undefined)?.['userId'],
    trace_id: request.id,
  });
});

// Health check
app.get('/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }));

// Metrics endpoint (placeholder)
app.get('/metrics', async () => '# OpsCore metrics placeholder\n');

// Register modules
registerIdentityModule(app, db);
registerObservabilityModule(app, db);
registerIncidentsModule(app, db);
registerCopilotModule(app, db);
registerReportsModule(app, db);
registerAuditModule(app, db);

// Global audit logging via event bus
eventBus.subscribeAll(async (event: DomainEvent) => {
  if (event.actorId) {
    try {
      await logAuditEntry(db, {
        tenantId: event.tenantId,
        actorId: event.actorId,
        action: event.type,
        entityType: event.entityType,
        entityId: event.entityId,
        after: event.payload,
        ipAddress: '0.0.0.0',
        userAgent: 'event-bus',
      });
    } catch (err) {
      app.log.error({ err, event: event.type }, 'Failed to log audit entry');
    }
  }
});

// Error handler
app.setErrorHandler((error, request, reply) => {
  request.log.error(error);
  sendError(reply, error, request.url);
});

// Start
const port = parseInt(process.env['PORT'] ?? '3001', 10);
const host = process.env['HOST'] ?? '0.0.0.0';

try {
  await app.listen({ port, host });
  app.log.info(`OpsCore API running on ${host}:${port}`);
} catch (err) {
  app.log.fatal(err);
  process.exit(1);
}
