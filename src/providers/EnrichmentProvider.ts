import { EnrichmentInput, ProviderResult } from '../types';

export interface EnrichmentProvider {
    name: string;
    cost: number;
    reliabilityScore: number;
    lookup(input: EnrichmentInput): Promise<ProviderResult | null>;
}

export abstract class BaseProvider implements EnrichmentProvider {
    abstract name: string;
    abstract cost: number;
    abstract reliabilityScore: number;

    abstract lookup(input: EnrichmentInput): Promise<ProviderResult | null>;

    protected createResult(
        data: ProviderResult['data'],
        confidence_score: number,
        source?: string
    ): ProviderResult {
        return {
            data,
            confidence_score,
            metadata: {
                provider: this.name,
                cost: this.cost,
                source: source || 'api_search'
            }
        };
    }
}
