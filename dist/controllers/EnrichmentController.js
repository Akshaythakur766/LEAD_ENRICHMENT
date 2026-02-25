"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.enrichLead = void 0;
const object_hash_1 = __importDefault(require("object-hash"));
const WaterfallStrategy_1 = require("../strategies/WaterfallStrategy");
const ClearbitProvider_1 = require("../providers/ClearbitProvider");
const HunterProvider_1 = require("../providers/HunterProvider");
const ApolloProvider_1 = require("../providers/ApolloProvider");
const RedisCache_1 = require("../cache/RedisCache");
const bullmqSetup_1 = require("../jobs/bullmqSetup");
const logger_1 = require("../utils/logger");
// Initialize Strategy and Providers
const providers = [
    new ClearbitProvider_1.ClearbitFreeProvider(), // Cost 0
    new HunterProvider_1.HunterProvider(), // Cost 0.01
    new ApolloProvider_1.ApolloProvider(), // Cost 0.05
];
const strategy = new WaterfallStrategy_1.WaterfallStrategy(providers, 0.85);
const enrichLead = async (req, res) => {
    try {
        const input = req.body;
        // Create deterministic hash for cache key
        const cacheKey = `enrich:${(0, object_hash_1.default)(input)}`;
        // Check Cache
        const cachedResult = await (0, RedisCache_1.getCache)(cacheKey);
        if (cachedResult) {
            logger_1.logger.info('Cache hit for enrichment request');
            return res.status(200).json({
                ...cachedResult,
                cache_hit: true
            });
        }
        // Execute Strategy
        logger_1.logger.info('Cache miss, running waterfall strategy');
        const result = await strategy.execute(input);
        // Save to Cache (7 days as requested)
        await (0, RedisCache_1.setCache)(cacheKey, result, 7);
        // Dispatch async background jobs
        if (input.email) {
            await bullmqSetup_1.enrichmentQueue.add('negativeEmailFilter', { email: input.email });
        }
        return res.status(200).json(result);
    }
    catch (error) {
        logger_1.logger.error('Error in enrichLead controller', error);
        res.status(500).json({ error: 'Internal Server Error processing enrichment.' });
    }
};
exports.enrichLead = enrichLead;
