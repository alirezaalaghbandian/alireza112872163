import { pgTable, uuid, varchar, timestamp, text, jsonb, index } from 'drizzle-orm/pg-core';
import { organizations, users } from './identity.js';

export const reports = pgTable(
  'reports',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => organizations.id),
    title: varchar('title', { length: 255 }).notNull(),
    type: varchar('type', { length: 50 }).notNull(),
    config: jsonb('config').$type<Record<string, unknown>>(),
    createdBy: uuid('created_by')
      .notNull()
      .references(() => users.id),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    tenantIdx: index('reports_tenant_idx').on(table.tenantId),
  }),
);

export const reportRuns = pgTable(
  'report_runs',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => organizations.id),
    reportId: uuid('report_id')
      .notNull()
      .references(() => reports.id),
    status: varchar('status', { length: 20 }).notNull().default('pending'),
    outputUrl: text('output_url'),
    startedAt: timestamp('started_at', { withTimezone: true }),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    reportIdx: index('report_runs_report_idx').on(table.reportId),
    tenantIdx: index('report_runs_tenant_idx').on(table.tenantId),
  }),
);
