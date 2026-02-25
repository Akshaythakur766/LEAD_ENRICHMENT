"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClearbitFreeProvider = void 0;
const EnrichmentProvider_1 = require("./EnrichmentProvider");
class ClearbitFreeProvider extends EnrichmentProvider_1.BaseProvider {
    name = 'clearbit_free';
    cost = 0;
    reliabilityScore = 0.6; // Decent for company data, limited for personal
    async lookup(input) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        if (input.domain || (input.email && input.email.includes('@'))) {
            const domain = input.domain || input.email?.split('@')[1];
            // Skip generic domains in Clearbit mock
            if (domain && ['gmail.com', 'yahoo.com', 'outlook.com'].includes(domain)) {
                return null; // Free tier might not handle generic emails well
            }
            return this.createResult({
                company: 'Tech Corp Mock',
                domain: domain || 'techcorp.com',
                industry: 'Software',
                company_size: '50-200'
            }, 0.2, 'company_lookup');
        }
        return null;
    }
}
exports.ClearbitFreeProvider = ClearbitFreeProvider;
