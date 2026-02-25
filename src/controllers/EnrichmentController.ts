import { Request, Response } from 'express';
import hash from 'object-hash';
import { WaterfallStrategy } from '../strategies/WaterfallStrategy';
import { ClearbitFreeProvider } from '../providers/ClearbitProvider';
import { HunterProvider } from '../providers/HunterProvider';
import { ApolloProvider } from '../providers/ApolloProvider';
import { getCache, setCache } from '../cache/RedisCache';
import { enrichmentQueue } from '../jobs/bullmqSetup';
import { logger } from '../utils/logger';
import { EnrichmentInput } from '../types';

// Initialize Strategy and Providers
const providers = [
    new ClearbitFreeProvider(), // Cost 0
    new HunterProvider(),       // Cost 0.01
    new ApolloProvider(),       // Cost 0.05
];

const strategy = new WaterfallStrategy(providers, 0.85);

export const enrichLead = async (req: Request, res: Response) => {
    try {
        const input: EnrichmentInput = req.body;

        // Create deterministic hash for cache key
        const cacheKey = `enrich:${hash(input)}`;

        // Check Cache
        const cachedResult = await getCache(cacheKey);
        if (cachedResult) {
            logger.info('Cache hit for enrichment request');
            return res.status(200).json({
                ...cachedResult,
                cache_hit: true
            });
        }

        // Execute Strategy
        logger.info('Cache miss, running waterfall strategy');
        const result = await strategy.execute(input);

        // Save to Cache (7 days as requested)
        await setCache(cacheKey, result, 7);

        // Dispatch async background jobs
        if (input.email) {
            await enrichmentQueue.add('negativeEmailFilter', { email: input.email });
        }

        return res.status(200).json(result);

    } catch (error) {
        logger.error('Error in enrichLead controller', error);
        res.status(500).json({ error: 'Internal Server Error processing enrichment.' });
    }
};
