export interface EnrichmentInput {
    email?: string;
    linkedin_url?: string;
    name?: string;
    company?: string;
    domain?: string;
}

export interface EnrichedData {
    name: string;
    firstName: string;
    lastName: string;
    email: string;
    company: string;
    domain: string;
    linkedin_url: string;
    job_title: string;
    location: string;
    company_size: string;
    industry: string;
}

export interface ProviderMetadata {
    provider: string;
    cost: number;
    source?: string;
}

export interface ProviderResult {
    data: Partial<EnrichedData>;
    confidence_score: number;
    metadata: ProviderMetadata;
}

export interface EnrichmentResponse {
    data: Partial<EnrichedData>;
    confidence_score: number;
    providers_used: ProviderMetadata[];
    total_cost: number;
    cache_hit: boolean;
    processing_time_ms: number;
}
