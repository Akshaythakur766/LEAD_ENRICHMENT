import { EnrichmentInput, ProviderResult, EnrichedData } from '../types';

// Simple mock implementation of the merging logic to share across engine
export const calculateConfidence = (
    input: EnrichmentInput,
    currentData: Partial<EnrichedData>
): number => {
    let score = 0;

    if (currentData.email) score += 0.4;
    if (currentData.linkedin_url) score += 0.3;
    if (currentData.name || (currentData.firstName && currentData.lastName)) score += 0.1;
    if (currentData.company) score += 0.1;
    if (currentData.domain) score += 0.1;

    // Additional mock scoring for better simulation
    if (currentData.job_title) score += 0.1;
    if (currentData.location) score += 0.05;

    return Math.min(score, 1.0);
};

export const mergeData = (
    existingData: Partial<EnrichedData>,
    newData: ProviderResult,
    existingReliability: number,
    newReliability: number
): Partial<EnrichedData> => {
    const merged: Partial<EnrichedData> = { ...existingData };

    // Prioritize new data if reliability is higher or if the field is empty
    for (const [key, value] of Object.entries(newData.data)) {
        const k = key as keyof EnrichedData;

        if (!merged[k] && value) {
            merged[k] = value;
        } else if (merged[k] && value && merged[k] !== value) {
            if (newReliability > existingReliability) {
                // @ts-ignore
                merged[k] = value;
            }
        }
    }

    return merged;
};
