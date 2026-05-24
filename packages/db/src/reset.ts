import postgres from 'postgres';

const connectionString =
  process.env['DATABASE_URL'] ?? 'postgresql://opscore:opscore@localhost:5432/opscore';

async function main() {
  const client = postgres(connectionString, { max: 1 });

  console.log('Dropping all tables...');
  await client`DROP SCHEMA public CASCADE`;
  await client`CREATE SCHEMA public`;
  await client`GRANT ALL ON SCHEMA public TO public`;
  console.log('Schema reset complete. Run db:migrate and db:seed to restore.');

  await client.end();
  process.exit(0);
}

main().catch((err) => {
  console.error('Reset failed:', err);
  process.exit(1);
});
