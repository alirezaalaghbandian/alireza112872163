import { pgTable, uuid, varchar, timestamp, text, jsonb, index } from 'drizzle-orm/pg-core';
import { organizations, users } from './identity.js';

export const incidents = pgTable(
  'incidents',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => organizations.id),
    title: varchar('title', { length: 500 }).notNull(),
    summary: text('summary'),
    status: varchar('status', { length: 30 }).notNull().default('open'),
    priority: varchar('priority', { length: 20 }).notNull().default('medium'),
    openedAt: timestamp('opened_at', { withTimezone: true }).notNull().defaultNow(),
    acknowledgedAt: timestamp('acknowledged_at', { withTimezone: true }),
    resolvedAt: timestamp('resolved_at', { withTimezone: true }),
    closedAt: timestamp('closed_at', { withTimezone: true }),
    assigneeId: uuid('assignee_id').references(() => users.id),
    createdBy: uuid('created_by')
      .notNull()
      .references(() => users.id),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    tenantIdx: index('incidents_tenant_idx').on(table.tenantId),
    tenantStatusIdx: index('incidents_tenant_status_idx').on(table.tenantId, table.status),
    assigneeIdx: index('incidents_assignee_idx').on(table.assigneeId),
  }),
);

export const incidentEvents = pgTable(
  'incident_events',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => organizations.id),
    incidentId: uuid('incident_id')
      .notNull()
      .references(() => incidents.id),
    kind: varchar('kind', { length: 50 }).notNull(),
    payload: jsonb('payload').$type<Record<string, unknown>>(),
    actorId: uuid('actor_id')
      .notNull()
      .references(() => users.id),
    occurredAt: timestamp('occurred_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    incidentIdx: index('incident_events_incident_idx').on(table.incidentId),
    tenantIdx: index('incident_events_tenant_idx').on(table.tenantId),
  }),
);

export const comments = pgTable(
  'comments',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => organizations.id),
    incidentId: uuid('incident_id')
      .notNull()
      .references(() => incidents.id),
    authorId: uuid('author_id')
      .notNull()
      .references(() => users.id),
    body: text('body').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    incidentIdx: index('comments_incident_idx').on(table.incidentId),
    tenantIdx: index('comments_tenant_idx').on(table.tenantId),
  }),
);
