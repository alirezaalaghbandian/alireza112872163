import { Worker, Queue } from 'bullmq';
import Redis from 'ioredis';
import pino from 'pino';

const logger = pino({ level: process.env['LOG_LEVEL'] ?? 'info' });

const connection = new Redis(process.env['REDIS_URL'] ?? 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
});

// Signal ingestion queue
const signalWorker = new Worker(
  'signal-ingest',
  async (job) => {
    logger.info({ jobId: job.id, data: job.data }, 'Processing signal ingestion job');
    // KPI computation and anomaly detection would happen here
  },
  { connection, concurrency: 5 },
);

// AI job queue
const aiWorker = new Worker(
  'ai-jobs',
  async (job) => {
    logger.info({ jobId: job.id, type: job.name }, 'Processing AI job');
    // LLM inference, embedding generation, report generation
  },
  { connection, concurrency: 2 },
);

// Report generation queue
const reportWorker = new Worker(
  'report-generation',
  async (job) => {
    logger.info({ jobId: job.id }, 'Processing report generation job');
    // PDF generation, S3 upload
  },
  { connection, concurrency: 3 },
);

signalWorker.on('completed', (job) => logger.info({ jobId: job.id }, 'Signal job completed'));
signalWorker.on('failed', (job, err) => logger.error({ jobId: job?.id, err }, 'Signal job failed'));

aiWorker.on('completed', (job) => logger.info({ jobId: job.id }, 'AI job completed'));
aiWorker.on('failed', (job, err) => logger.error({ jobId: job?.id, err }, 'AI job failed'));

reportWorker.on('completed', (job) => logger.info({ jobId: job.id }, 'Report job completed'));
reportWorker.on('failed', (job, err) => logger.error({ jobId: job?.id, err }, 'Report job failed'));

logger.info('OpsCore Worker started');

process.on('SIGTERM', async () => {
  logger.info('Shutting down workers...');
  await signalWorker.close();
  await aiWorker.close();
  await reportWorker.close();
  await connection.quit();
  process.exit(0);
});
