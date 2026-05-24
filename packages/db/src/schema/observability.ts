import { pgTable, uuid, varchar, timestamp, text, jsonb, numeric, integer, index } from 'drizzle-orm/pg-core';
import { organizations } from './identity.js';

export const signals = pgTable(
  'signals',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => organizations.id),
    source: varchar('source', { length: 255 }).notNull(),
    kind: varchar('kind', { length: 50 }).notNull(),
    payload: jsonb('payload').notNull().$type<Record<string, unknown>>(),
    observedAt: timestamp('observed_at', { withTimezone: true }).notNull(),
    ingestedAt: timestamp('ingested_at', { withTimezone: true }).notNull().defaultNow(),
    idempotencyKey: varchar('idempotency_key', { length: 255 }),
    summary: text('summary'),
  },
  (table) => ({
    tenantIdx: index('signals_tenant_idx').on(table.tenantId),
    sourceObservedIdx: index('signals_source_observed_idx').on(table.source, table.observedAt),
    tenantObservedIdx: index('signals_tenant_observed_idx').on(table.tenantId, table.observedAt),
    idempotencyIdx: index('signals_idempotency_idx').on(table.tenantId, table.idempotencyKey),
  }),
);

export const kpis = pgTable(
  'kpis',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => organizations.id),
    name: varchar('name', { length: 255 }).notNull(),
    formula: text('formula').notNull(),
    unit: varchar('unit', { length: 50 }).notNull(),
    direction: varchar('direction', { length: 20 }).notNull(),
    thresholds: jsonb('thresholds').notNull().$type<Array<{ label: string; min: number | null; max: number | null; severity: string }>>(),
    windowSeconds: integer('window_seconds').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    tenantIdx: index('kpis_tenant_idx').on(table.tenantId),
  }),
);

export const kpiSnapshots = pgTable(
  'kpi_snapshots',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => organizations.id),
    kpiId: uuid('kpi_id')
      .notNull()
      .references(() => kpis.id),
    value: numeric('value', { precision: 20, scale: 6 }).notNull(),
    computedAt: timestamp('computed_at', { withTimezone: true }).notNull().defaultNow(),
    windowStart: timestamp('window_start', { withTimezone: true }).notNull(),
    windowEnd: timestamp('window_end', { withTimezone: true }).notNull(),
  },
  (table) => ({
    tenantIdx: index('kpi_snapshots_tenant_idx').on(table.tenantId),
    kpiComputedIdx: index('kpi_snapshots_kpi_computed_idx').on(table.kpiId, table.computedAt),
  }),
);

export const anomalies = pgTable(
  'anomalies',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => organizations.id),
    kpiSnapshotId: uuid('kpi_snapshot_id')
      .notNull()
      .references(() => kpiSnapshots.id),
    severity: varchar('severity', { length: 20 }).notNull(),
    detectedAt: timestamp('detected_at', { withTimezone: true }).notNull().defaultNow(),
    resolvedAt: timestamp('resolved_at', { withTimezone: true }),
  },
  (table) => ({
    tenantIdx: index('anomalies_tenant_idx').on(table.tenantId),
    tenantDetectedIdx: index('anomalies_tenant_detected_idx').on(table.tenantId, table.detectedAt),
  }),
);
