import { pgTable, uuid, varchar, timestamp, text, jsonb, inet, index } from 'drizzle-orm/pg-core';
import { organizations, users } from './identity.js';

export const auditEntries = pgTable(
  'audit_entries',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => organizations.id),
    actorId: uuid('actor_id')
      .notNull()
      .references(() => users.id),
    action: varchar('action', { length: 100 }).notNull(),
    entityType: varchar('entity_type', { length: 100 }).notNull(),
    entityId: uuid('entity_id').notNull(),
    before: jsonb('before').$type<Record<string, unknown>>(),
    after: jsonb('after').$type<Record<string, unknown>>(),
    ipAddress: inet('ip_address').notNull(),
    userAgent: text('user_agent').notNull(),
    occurredAt: timestamp('occurred_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    tenantIdx: index('audit_entries_tenant_idx').on(table.tenantId),
    actorIdx: index('audit_entries_actor_idx').on(table.actorId),
    entityIdx: index('audit_entries_entity_idx').on(table.entityType, table.entityId),
    occurredIdx: index('audit_entries_occurred_idx').on(table.tenantId, table.occurredAt),
  }),
);
