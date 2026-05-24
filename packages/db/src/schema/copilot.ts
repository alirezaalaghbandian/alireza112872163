import { pgTable, uuid, varchar, timestamp, text, jsonb, integer, index } from 'drizzle-orm/pg-core';
import { organizations, users } from './identity.js';

export const copilotConversations = pgTable(
  'copilot_conversations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => organizations.id),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id),
    title: varchar('title', { length: 255 }).notNull().default('New conversation'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    tenantIdx: index('copilot_conversations_tenant_idx').on(table.tenantId),
    userIdx: index('copilot_conversations_user_idx').on(table.userId),
  }),
);

export const copilotMessages = pgTable(
  'copilot_messages',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => organizations.id),
    conversationId: uuid('conversation_id')
      .notNull()
      .references(() => copilotConversations.id),
    role: varchar('role', { length: 20 }).notNull(),
    content: text('content').notNull(),
    citations: jsonb('citations').$type<Array<{ type: string; id: string }>>(),
    tokensIn: integer('tokens_in').notNull().default(0),
    tokensOut: integer('tokens_out').notNull().default(0),
    model: varchar('model', { length: 100 }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    conversationIdx: index('copilot_messages_conversation_idx').on(table.conversationId),
    tenantIdx: index('copilot_messages_tenant_idx').on(table.tenantId),
  }),
);
