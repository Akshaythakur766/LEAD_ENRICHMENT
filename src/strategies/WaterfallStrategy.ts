import { EnrichmentInput, EnrichmentResponse, ProviderMetadata, EnrichedData } from '../types';
import { EnrichmentProvider } from '../providers/EnrichmentProvider';
import { calculateConfidence, mergeData } from '../utils/engine';
import { logger } from '../utils/logger';

export class WaterfallStrategy {
    private providers: EnrichmentProvider[];
    private threshold: number;

    constructor(providers: EnrichmentProvider[], threshold: number = 0.85) {
        // Sort providers by cost ascending to ensure cheapest first
        this.providers = providers.sort((a, b) => a.cost - b.cost);
        this.threshold = threshold;
    }

    public async execute(input: EnrichmentInput): Promise<EnrichmentResponse> {
        const startTime = Date.now();
        let currentData: Partial<EnrichedData> = {};
        let currentReliability = 0;
        let confidenceScore = 0;
        const providersUsed: ProviderMetadata[] = [];
        let totalCost = 0;

        for (const provider of this.providers) {
            if (confidenceScore >= this.threshold) {
                logger.info(`Threshold met (${confidenceScore}). Stopping early before provider ${provider.name}`);
                break;
            }

            try {
                logger.debug(`Calling provider: ${provider.name}`);
                const result = await provider.lookup(input);

                if (result && result.data && Object.keys(result.data).length > 0) {
                    // Collision resolution & merging
                    currentData = mergeData(currentData, result, currentReliability, provider.reliabilityScore);
                    currentReliability = Math.max(currentReliability, provider.reliabilityScore);

                    providersUsed.push(result.metadata);
                    totalCost += result.metadata.cost;

                    // Recalculate confidence
                    confidenceScore = calculateConfidence(input, currentData);

                    logger.info(`Provider ${provider.name} succeeded. Current confidence: ${confidenceScore}`);
                } else {
                    logger.debug(`Provider ${provider.name} returned NO data.`);
                }
            } catch (error) {
                logger.error(`Provider error: ${provider.name}`, error);
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
