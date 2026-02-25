import { EnrichmentInput, ProviderResult } from '../types';
import { BaseProvider } from './EnrichmentProvider';

export class HunterProvider extends BaseProvider {
    name = 'hunter_io';
    cost = 0.01;
    reliabilityScore = 0.8; // Great for emails and basic titles

    async lookup(input: EnrichmentInput): Promise<ProviderResult | null> {
        await new Promise(resolve => setTimeout(resolve, 400));

        if (input.email) {
            const emailDomain = input.email.split('@')[1];

            // Hunter is primarily email-based
            return this.createResult({
                email: input.email,
                firstName: 'John',
                lastName: 'Doe',
                job_title: 'Software Engineer',
                domain: emailDomain || 'example.com',
                company: input.company || 'Unknown Inc.'
            }, 0.6, 'email_lookup');
        }

        if (input.domain) {
            return this.createResult({
                domain: input.domain,
                company: input.domain.split('.')[0] + ' Corp'
            }, 0.3, 'domain_search')
        }

        return null;
    }
}
