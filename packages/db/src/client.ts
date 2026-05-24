import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema/index.js';

const connectionString =
  process.env['DATABASE_URL'] ?? 'postgresql://opscore:opscore@localhost:5432/opscore';

const queryClient = postgres(connectionString);
export const db = drizzle(queryClient, { schema });

export type Database = typeof db;

export function createDbClient(url: string) {
  const client = postgres(url);
  return drizzle(client, { schema });
}

export async function setTenantContext(client: postgres.Sql, tenantId: string) {
  await client`SELECT set_config('app.current_tenant', ${tenantId}, true)`;
}
