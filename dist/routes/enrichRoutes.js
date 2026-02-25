"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const EnrichmentController_1 = require("../controllers/EnrichmentController");
const enrichValidator_1 = require("../validators/enrichValidator");
const rateLimiter_1 = require("../middleware/rateLimiter");
const router = (0, express_1.Router)();
router.post('/enrich', rateLimiter_1.enrichRateLimiter, enrichValidator_1.validateEnrichInput, EnrichmentController_1.enrichLead);
exports.default = router;
