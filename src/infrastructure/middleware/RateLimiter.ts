import rateLimit from 'express-rate-limit';
import type { Request } from 'express';

const extractClientIp = (req: Request): string => {
    const forwarded = req.headers['x-forwarded-for'];
    if (forwarded) {
        const value = Array.isArray(forwarded) ? forwarded[0] : forwarded;
        const firstIp = value.split(',')[0]?.trim();
        if (firstIp) return firstIp;
    }
    return req.ip || req.socket?.remoteAddress || 'unknown';
};

export const createRateLimiter = (
    windowMs: number,
    max: number,
    message: string = 'Too many requests, please try again later.'
) => {
    return rateLimit({
        windowMs,
        max,
        standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers
        message: { error: message, code: 'RATE_LIMIT_EXCEEDED' },
        // Vercel/proxy headers can trigger strict runtime validations in express-rate-limit.
        // Disabling them avoids 500s while preserving effective in-memory limits.
        validate: false,
        keyGenerator: (req) => extractClientIp(req),
    });
};

// General API Limiter: 100 requests per 15 minutes
export const generalLimiter = createRateLimiter(15 * 60 * 1000, 100);

// Strict AI Limiter: 20 requests per hour (expensive operations)
export const aiLimiter = createRateLimiter(60 * 60 * 1000, 20, 'AI quota exceeded. Please try again in an hour.');
