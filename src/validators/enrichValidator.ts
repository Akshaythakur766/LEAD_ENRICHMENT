import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const enrichInputSchema = z.object({
    email: z.string().email().optional(),
    linkedin_url: z.string().url().optional(),
    name: z.string().optional(),
    company: z.string().optional(),
    domain: z.string().optional(),
}).refine(data => {
    // At least one identifier must exist
    return data.email || data.linkedin_url || (data.name && data.company) || data.domain;
}, {
    message: "At least one identifier (email, linkedin_url, name + company, or domain) must be provided."
});

export const validateEnrichInput = (req: Request, res: Response, next: NextFunction) => {
    try {
        const validatedData = enrichInputSchema.parse(req.body);
        req.body = validatedData;
        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({
                error: 'Invalid Input',
                details: error.issues
            });
            return;
        }
        next(error);
    }
};
