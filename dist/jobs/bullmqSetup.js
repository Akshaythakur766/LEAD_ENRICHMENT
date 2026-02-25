"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enrichmentWorker = exports.enrichmentQueue = void 0;
const bullmq_1 = require("bullmq");
const logger_1 = require("../utils/logger");
// Create a new queue
// We use the same redis connection strings but BullMQ needs ioredis, which uses standard redis URLs
const connection = {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || undefined,
};
exports.enrichmentQueue = new bullmq_1.Queue('enrichment', { connection });
// Setup a worker
exports.enrichmentWorker = new bullmq_1.Worker('enrichment', async (job) => {
    logger_1.logger.info(`Processing job ${job.id} of type ${job.name}`);
    if (job.name === 'negativeEmailFilter') {
        // Logic for filtering generic emails
        const { email } = job.data;
        if (email) {
            const domain = email.split('@')[1];
            const genericDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com'];
            if (genericDomains.includes(domain)) {
                logger_1.logger.info(`Job ${job.id}: Negative filter hit for ${domain}. Skipping company enrichment.`);
                // Note: Real implementation would trigger webhooks or DB updates here
            }
        }
    }
    // Simulate work
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
}, { connection });
exports.enrichmentWorker.on('completed', (job) => {
    logger_1.logger.debug(`Job ${job.id} has completed!`);
});
exports.enrichmentWorker.on('failed', (job, err) => {
    if (job) {
        logger_1.logger.error(`Job ${job.id} has failed with ${err.message}`);
    }
});
