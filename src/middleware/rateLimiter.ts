import rateLimit from 'express-rate-limit';

export const enrichRateLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 100, // Limit each IP to 100 requests per `window` (here, per 1 minute)
    message: {
        error: 'Too many enrichment requests from this IP, please try again after a minute'
    },
    standardHeaders: true,
    legacyHeaders: false,
});
