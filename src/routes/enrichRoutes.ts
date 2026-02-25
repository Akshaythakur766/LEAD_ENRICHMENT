import { Router } from 'express';
import { enrichLead } from '../controllers/EnrichmentController';
import { validateEnrichInput } from '../validators/enrichValidator';
import { enrichRateLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/enrich', enrichRateLimiter, validateEnrichInput, enrichLead);

export default router;
