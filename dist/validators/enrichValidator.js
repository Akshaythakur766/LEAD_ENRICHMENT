"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEnrichInput = exports.enrichInputSchema = void 0;
const zod_1 = require("zod");
exports.enrichInputSchema = zod_1.z.object({
    email: zod_1.z.string().email().optional(),
    linkedin_url: zod_1.z.string().url().optional(),
    name: zod_1.z.string().optional(),
    company: zod_1.z.string().optional(),
    domain: zod_1.z.string().optional(),
}).refine(data => {
    // At least one identifier must exist
    return data.email || data.linkedin_url || (data.name && data.company) || data.domain;
}, {
    message: "At least one identifier (email, linkedin_url, name + company, or domain) must be provided."
});
const validateEnrichInput = (req, res, next) => {
    try {
        const validatedData = exports.enrichInputSchema.parse(req.body);
        req.body = validatedData;
        next();
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({
                error: 'Invalid Input',
                details: error.issues
            });
            return;
        }
        next(error);
    }
};
exports.validateEnrichInput = validateEnrichInput;
