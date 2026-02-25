"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApolloProvider = void 0;
const EnrichmentProvider_1 = require("./EnrichmentProvider");
class ApolloProvider extends EnrichmentProvider_1.BaseProvider {
    name = 'apollo_io';
    cost = 0.05; // Most expensive
    reliabilityScore = 0.95; // Highest reliability
    async lookup(input) {
        await new Promise(resolve => setTimeout(resolve, 600));
        // Apollo has excellent data for LinkedIn URLs and direct searches
        if (input.linkedin_url) {
            return this.createResult({
                name: input.name || 'John Smith',
                firstName: 'John',
                lastName: 'Smith',
                linkedin_url: input.linkedin_url,
                job_title: 'Senior Engineer',
                company: 'Advanced Tech Solutions',
                location: 'San Francisco, CA',
                industry: 'Information Technology'
            }, 0.8, 'social_search');
        }
        if (input.name && input.company) {
            return this.createResult({
                name: input.name,
                firstName: input.name.split(' ')[0],
                lastName: input.name.split(' ')[1] || '',
                company: input.company,
                job_title: 'Director of Engineering',
                location: 'New York, NY',
                domain: `${input.company.toLowerCase().replace(/\s/g, '')}.com`,
                email: `${input.name.split(' ')[0].toLowerCase()}@${input.company.toLowerCase().replace(/\s/g, '')}.com`
            }, 0.9, 'name_company_lookup');
        }
        // Fallback if just email is provided
        if (input.email) {
            return this.createResult({
                email: input.email,
                job_title: 'Staff Engineer', // Conflicts intentionally with Hunter in "Software Engineer"
                company: input.company || 'Unknown',
            }, 0.7, 'email_search');
        }
        return null;
    }
}
exports.ApolloProvider = ApolloProvider;
