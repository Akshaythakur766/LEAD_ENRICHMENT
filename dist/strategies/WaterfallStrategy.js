"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WaterfallStrategy = void 0;
const engine_1 = require("../utils/engine");
const logger_1 = require("../utils/logger");
class WaterfallStrategy {
    providers;
    threshold;
    constructor(providers, threshold = 0.85) {
        // Sort providers by cost ascending to ensure cheapest first
        this.providers = providers.sort((a, b) => a.cost - b.cost);
        this.threshold = threshold;
    }
    async execute(input) {
        const startTime = Date.now();
        let currentData = {};
        let currentReliability = 0;
        let confidenceScore = 0;
        const providersUsed = [];
        let totalCost = 0;
        for (const provider of this.providers) {
            if (confidenceScore >= this.threshold) {
                logger_1.logger.info(`Threshold met (${confidenceScore}). Stopping early before provider ${provider.name}`);
                break;
            }
            try {
                logger_1.logger.debug(`Calling provider: ${provider.name}`);
                const result = await provider.lookup(input);
                if (result && result.data && Object.keys(result.data).length > 0) {
                    // Collision resolution & merging
                    currentData = (0, engine_1.mergeData)(currentData, result, currentReliability, provider.reliabilityScore);
                    currentReliability = Math.max(currentReliability, provider.reliabilityScore);
                    providersUsed.push(result.metadata);
                    totalCost += result.metadata.cost;
                    // Recalculate confidence
                    confidenceScore = (0, engine_1.calculateConfidence)(input, currentData);
                    logger_1.logger.info(`Provider ${provider.name} succeeded. Current confidence: ${confidenceScore}`);
                }
                else {
                    logger_1.logger.debug(`Provider ${provider.name} returned NO data.`);
                }
            }
            catch (error) {
                logger_1.logger.error(`Provider error: ${provider.name}`, error);
                // Continue to the next provider even if one fails
            }
        }
        return {
            data: currentData,
            confidence_score: confidenceScore,
            providers_used: providersUsed,
            total_cost: totalCost,
            cache_hit: false,
            processing_time_ms: Date.now() - startTime
        };
    }
}
exports.WaterfallStrategy = WaterfallStrategy;
