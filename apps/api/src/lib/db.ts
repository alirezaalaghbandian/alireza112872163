import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@opscore/db/schema';

const connectionString =
  process.env['DATABASE_URL'] ?? 'postgresql://opscore:opscore@localhost:5432/opscore';

const queryClient = postgres(connectionString, {
  max: 20,
  idle_timeout: 20,
  connect_timeout: 10,
});

export const db = drizzle(queryClient, { schema });
export const sql = queryClient;

export type Database = typeof db;
