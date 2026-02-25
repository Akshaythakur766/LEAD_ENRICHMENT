import { Queue, Worker, Job } from 'bullmq';
import { redisClient } from '../cache/RedisCache';
import { logger } from '../utils/logger';

// Create a new queue
// We use the same redis connection strings but BullMQ needs ioredis, which uses standard redis URLs
const connection = {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || undefined,
};

export const enrichmentQueue = new Queue('enrichment', { connection });

enrichmentQueue.on('error', (err) => {
    logger.warn('BullMQ Queue Error (Redis missing)', err.message);
});

// Setup a worker
export const enrichmentWorker = new Worker('enrichment', async (job: Job) => {
    logger.info(`Processing job ${job.id} of type ${job.name}`);

    if (job.name === 'negativeEmailFilter') {
        // Logic for filtering generic emails
        const { email } = job.data;
        if (email) {
            const domain = email.split('@')[1];
            const genericDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com'];

            if (genericDomains.includes(domain)) {
                logger.info(`Job ${job.id}: Negative filter hit for ${domain}. Skipping company enrichment.`);
                // Note: Real implementation would trigger webhooks or DB updates here
            }
        }
    }

    // Simulate work
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
}, { connection });

enrichmentWorker.on('completed', (job: Job) => {
    logger.debug(`Job ${job.id} has completed!`);
});

enrichmentWorker.on('failed', (job: Job | undefined, err: Error) => {
    if (job) {
        logger.error(`Job ${job.id} has failed with ${err.message}`);
    }
});

enrichmentWorker.on('error', (err: Error) => {
    logger.warn('BullMQ Worker Error (Redis missing)', err.message);
});
