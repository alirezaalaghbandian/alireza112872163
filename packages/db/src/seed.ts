import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { faker } from '@faker-js/faker';
import { randomUUID } from 'crypto';
import * as schema from './schema/index.js';

faker.seed(42); // deterministic seed

const connectionString =
  process.env['DATABASE_URL'] ?? 'postgresql://opscore:opscore@localhost:5432/opscore';

const TENANT_A_ID = '10000000-0000-0000-0000-000000000001';
const TENANT_B_ID = '10000000-0000-0000-0000-000000000002';

const USER_IDS = {
  ownerA: '20000000-0000-0000-0000-000000000001',
  managerA: '20000000-0000-0000-0000-000000000002',
  analystA: '20000000-0000-0000-0000-000000000003',
  engineerA: '20000000-0000-0000-0000-000000000004',
  ownerB: '20000000-0000-0000-0000-000000000005',
  engineerB: '20000000-0000-0000-0000-000000000006',
};

// argon2id hash of "Password1!" - pre-computed for seed speed
const PASSWORD_HASH =
  '$argon2id$v=19$m=65536,t=3,p=4$c29tZXNhbHR2YWx1ZQ$RdescudvJCsgt3ub+b+daw';

async function main() {
  const client = postgres(connectionString, { max: 1 });
  const db = drizzle(client, { schema });

  console.log('Seeding database...');

  // Organizations
  await db.insert(schema.organizations).values([
    { id: TENANT_A_ID, name: 'Acme Corp', slug: 'acme-corp' },
    { id: TENANT_B_ID, name: 'Globex Inc', slug: 'globex-inc' },
  ]).onConflictDoNothing();

  // Users
  await db.insert(schema.users).values([
    { id: USER_IDS.ownerA, email: 'owner@acme.test', name: 'Alice Owner', passwordHash: PASSWORD_HASH },
    { id: USER_IDS.managerA, email: 'manager@acme.test', name: 'Bob Manager', passwordHash: PASSWORD_HASH },
    { id: USER_IDS.analystA, email: 'analyst@acme.test', name: 'Carol Analyst', passwordHash: PASSWORD_HASH },
    { id: USER_IDS.engineerA, email: 'engineer@acme.test', name: 'Dave Engineer', passwordHash: PASSWORD_HASH },
    { id: USER_IDS.ownerB, email: 'owner@globex.test', name: 'Eve Owner', passwordHash: PASSWORD_HASH },
    { id: USER_IDS.engineerB, email: 'engineer@globex.test', name: 'Frank Engineer', passwordHash: PASSWORD_HASH },
  ]).onConflictDoNothing();

  // Memberships
  await db.insert(schema.memberships).values([
    { userId: USER_IDS.ownerA, orgId: TENANT_A_ID, role: 'org_owner' },
    { userId: USER_IDS.managerA, orgId: TENANT_A_ID, role: 'ops_manager' },
    { userId: USER_IDS.analystA, orgId: TENANT_A_ID, role: 'analyst' },
    { userId: USER_IDS.engineerA, orgId: TENANT_A_ID, role: 'engineer' },
    { userId: USER_IDS.ownerB, orgId: TENANT_B_ID, role: 'org_owner' },
    { userId: USER_IDS.engineerB, orgId: TENANT_B_ID, role: 'engineer' },
  ]).onConflictDoNothing();

  // KPIs for Tenant A
  const kpiIds = {
    responseTime: randomUUID(),
    errorRate: randomUUID(),
    throughput: randomUUID(),
    cpuUsage: randomUUID(),
  };

  await db.insert(schema.kpis).values([
    {
      id: kpiIds.responseTime,
      tenantId: TENANT_A_ID,
      name: 'API Response Time',
      formula: 'avg(signal.payload.duration_ms)',
      unit: 'ms',
      direction: 'lower_is_better',
      thresholds: [
        { label: 'Normal', min: null, max: 200, severity: 'info' },
        { label: 'Warning', min: 200, max: 500, severity: 'warning' },
        { label: 'Critical', min: 500, max: null, severity: 'critical' },
      ],
      windowSeconds: 300,
    },
    {
      id: kpiIds.errorRate,
      tenantId: TENANT_A_ID,
      name: 'Error Rate',
      formula: 'count(signal.payload.status >= 500) / count(*) * 100',
      unit: '%',
      direction: 'lower_is_better',
      thresholds: [
        { label: 'Normal', min: null, max: 1, severity: 'info' },
        { label: 'Warning', min: 1, max: 5, severity: 'warning' },
        { label: 'Critical', min: 5, max: null, severity: 'critical' },
      ],
      windowSeconds: 300,
    },
    {
      id: kpiIds.throughput,
      tenantId: TENANT_A_ID,
      name: 'Request Throughput',
      formula: 'count(*)',
      unit: 'req/min',
      direction: 'higher_is_better',
      thresholds: [
        { label: 'Critical', min: null, max: 100, severity: 'critical' },
        { label: 'Warning', min: 100, max: 500, severity: 'warning' },
        { label: 'Normal', min: 500, max: null, severity: 'info' },
      ],
      windowSeconds: 60,
    },
    {
      id: kpiIds.cpuUsage,
      tenantId: TENANT_A_ID,
      name: 'CPU Usage',
      formula: 'avg(signal.payload.cpu_percent)',
      unit: '%',
      direction: 'lower_is_better',
      thresholds: [
        { label: 'Normal', min: null, max: 70, severity: 'info' },
        { label: 'Warning', min: 70, max: 90, severity: 'warning' },
        { label: 'Critical', min: 90, max: null, severity: 'critical' },
      ],
      windowSeconds: 300,
    },
  ]);

  // Generate 24h of signals (50/min = 72000 total, we'll do a representative subset)
  const now = new Date();
  const signals: Array<{
    id: string;
    tenantId: string;
    source: string;
    kind: string;
    payload: Record<string, unknown>;
    observedAt: Date;
  }> = [];

  const sources = ['api-gateway', 'auth-service', 'payment-service', 'inventory-service'];

  for (let minutesAgo = 1440; minutesAgo >= 0; minutesAgo -= 5) {
    const observedAt = new Date(now.getTime() - minutesAgo * 60 * 1000);
    for (let j = 0; j < 3; j++) {
      const source = sources[j % sources.length]!;
      signals.push({
        id: randomUUID(),
        tenantId: TENANT_A_ID,
        source,
        kind: 'metric',
        payload: {
          duration_ms: faker.number.int({ min: 50, max: minutesAgo < 120 ? 800 : 300 }),
          status: faker.helpers.weightedArrayElement([
            { value: 200, weight: 90 },
            { value: 500, weight: minutesAgo < 120 ? 15 : 3 },
            { value: 404, weight: 5 },
          ]),
          cpu_percent: faker.number.float({ min: 20, max: minutesAgo < 120 ? 95 : 70, fractionDigits: 1 }),
          memory_mb: faker.number.int({ min: 256, max: 1024 }),
        },
        observedAt,
      });
    }
  }

  // Insert signals in batches
  const BATCH_SIZE = 100;
  for (let i = 0; i < signals.length; i += BATCH_SIZE) {
    const batch = signals.slice(i, i + BATCH_SIZE);
    await db.insert(schema.signals).values(batch);
  }
  console.log(`  Inserted ${signals.length} signals`);

  // KPI Snapshots & Anomalies
  const snapshotIds: string[] = [];
  const anomalyValues: Array<{
    id: string;
    tenantId: string;
    kpiSnapshotId: string;
    severity: string;
    detectedAt: Date;
  }> = [];

  for (let minutesAgo = 1440; minutesAgo >= 0; minutesAgo -= 30) {
    const computedAt = new Date(now.getTime() - minutesAgo * 60 * 1000);
    const windowStart = new Date(computedAt.getTime() - 300 * 1000);

    const responseTimeVal = minutesAgo < 120
      ? faker.number.float({ min: 300, max: 700, fractionDigits: 1 })
      : faker.number.float({ min: 80, max: 200, fractionDigits: 1 });

    const snapshotId = randomUUID();
    snapshotIds.push(snapshotId);

    await db.insert(schema.kpiSnapshots).values({
      id: snapshotId,
      tenantId: TENANT_A_ID,
      kpiId: kpiIds.responseTime,
      value: String(responseTimeVal),
      computedAt,
      windowStart,
      windowEnd: computedAt,
    });

    if (responseTimeVal > 500) {
      const anomalyId = randomUUID();
      anomalyValues.push({
        id: anomalyId,
        tenantId: TENANT_A_ID,
        kpiSnapshotId: snapshotId,
        severity: 'critical',
        detectedAt: computedAt,
      });
    } else if (responseTimeVal > 200) {
      const anomalyId = randomUUID();
      anomalyValues.push({
        id: anomalyId,
        tenantId: TENANT_A_ID,
        kpiSnapshotId: snapshotId,
        severity: 'warning',
        detectedAt: computedAt,
      });
    }
  }

  if (anomalyValues.length > 0) {
    await db.insert(schema.anomalies).values(anomalyValues);
  }
  console.log(`  Inserted ${snapshotIds.length} snapshots, ${anomalyValues.length} anomalies`);

  // Incidents
  const incidentIds = {
    open: randomUUID(),
    inProgress: randomUUID(),
    resolved: randomUUID(),
  };

  await db.insert(schema.incidents).values([
    {
      id: incidentIds.open,
      tenantId: TENANT_A_ID,
      title: 'High API response times detected',
      summary: 'Multiple endpoints reporting p95 > 500ms in the last 2 hours',
      status: 'open',
      priority: 'critical',
      createdBy: USER_IDS.managerA,
    },
    {
      id: incidentIds.inProgress,
      tenantId: TENANT_A_ID,
      title: 'Error rate spike on payment-service',
      summary: 'Error rate exceeded 5% threshold at 14:30 UTC',
      status: 'in_progress',
      priority: 'high',
      assigneeId: USER_IDS.engineerA,
      acknowledgedAt: new Date(now.getTime() - 3600 * 1000),
      createdBy: USER_IDS.managerA,
    },
    {
      id: incidentIds.resolved,
      tenantId: TENANT_A_ID,
      title: 'Inventory service CPU saturation',
      summary: 'CPU usage peaked at 98% due to a memory leak in cache layer',
      status: 'resolved',
      priority: 'medium',
      assigneeId: USER_IDS.engineerA,
      acknowledgedAt: new Date(now.getTime() - 86400 * 1000),
      resolvedAt: new Date(now.getTime() - 82800 * 1000),
      createdBy: USER_IDS.ownerA,
    },
  ]);

  // Comments on incidents
  await db.insert(schema.comments).values([
    {
      tenantId: TENANT_A_ID,
      incidentId: incidentIds.inProgress,
      authorId: USER_IDS.engineerA,
      body: 'Investigating the payment-service logs. Seeing timeout errors from the downstream gateway.',
    },
    {
      tenantId: TENANT_A_ID,
      incidentId: incidentIds.inProgress,
      authorId: USER_IDS.managerA,
      body: 'Please escalate if not resolved within the next 30 minutes.',
    },
    {
      tenantId: TENANT_A_ID,
      incidentId: incidentIds.resolved,
      authorId: USER_IDS.engineerA,
      body: 'Root cause identified: unbounded cache growth in the inventory service. Applied a fix with TTL-based eviction.',
    },
  ]);

  // Copilot conversation
  const conversationId = randomUUID();
  await db.insert(schema.copilotConversations).values({
    id: conversationId,
    tenantId: TENANT_A_ID,
    userId: USER_IDS.managerA,
    title: 'Root cause analysis: API latency spike',
  });

  const firstAnomaly = anomalyValues[0];
  const firstSignal = signals[0];
  if (firstAnomaly && firstSignal) {
    await db.insert(schema.copilotMessages).values([
      {
        tenantId: TENANT_A_ID,
        conversationId,
        role: 'user',
        content: 'What is causing the API response time spike in the last 2 hours?',
        tokensIn: 0,
        tokensOut: 0,
      },
      {
        tenantId: TENANT_A_ID,
        conversationId,
        role: 'assistant',
        content:
          'Based on my analysis of recent signals and anomalies, the API response time spike appears to be caused by increased error rates on the payment-service. The error rate exceeded the critical threshold of 5% starting approximately 2 hours ago, correlating with a surge in 500-status responses from the downstream payment gateway. I recommend investigating the payment gateway connectivity and reviewing the recent deployment changes to the payment-service.',
        citations: [
          { type: 'anomaly', id: firstAnomaly.id },
          { type: 'signal', id: firstSignal.id },
        ],
        tokensIn: 150,
        tokensOut: 280,
        model: 'claude-sonnet-4-20250514',
      },
    ]);
  }

  // Audit entries
  await db.insert(schema.auditEntries).values([
    {
      tenantId: TENANT_A_ID,
      actorId: USER_IDS.ownerA,
      action: 'organization.created',
      entityType: 'organization',
      entityId: TENANT_A_ID,
      before: null,
      after: { name: 'Acme Corp', slug: 'acme-corp' },
      ipAddress: '127.0.0.1',
      userAgent: 'seed-script',
    },
    {
      tenantId: TENANT_A_ID,
      actorId: USER_IDS.managerA,
      action: 'incident.created',
      entityType: 'incident',
      entityId: incidentIds.open,
      before: null,
      after: { title: 'High API response times detected', status: 'open' },
      ipAddress: '127.0.0.1',
      userAgent: 'seed-script',
    },
    {
      tenantId: TENANT_A_ID,
      actorId: USER_IDS.managerA,
      action: 'incident.status_changed',
      entityType: 'incident',
      entityId: incidentIds.inProgress,
      before: { status: 'open' },
      after: { status: 'in_progress' },
      ipAddress: '127.0.0.1',
      userAgent: 'seed-script',
    },
  ]);

  console.log('Seeding complete!');
  await client.end();
  process.exit(0);
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
