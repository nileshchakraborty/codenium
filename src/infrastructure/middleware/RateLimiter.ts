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
        standardHeaders: true,
        legacyHeaders: false,
        message: { error: message, code: 'RATE_LIMIT_EXCEEDED' },
        validate: false,
        keyGenerator: (req) => extractClientIp(req),
    });
};

// General API Limiter: 300 requests per 15 minutes
// Raised from 100 — a single active user generates ~20+ req/min from auto-sync,
// activity queue, recommendations refresh, focus-sync, and consent checks firing together.
export const generalLimiter = createRateLimiter(15 * 60 * 1000, 300);

// Background / internal async routes (sync, activity, stats, recommendations).
// These are fire-and-forget calls that run silently in the background.
// High limit to ensure they never block the user experience.
export const backgroundLimiter = createRateLimiter(15 * 60 * 1000, 1000);

// Strict AI Limiter: 20 requests per hour (expensive operations)
export const aiLimiter = createRateLimiter(60 * 60 * 1000, 20, 'AI quota exceeded. Please try again in an hour.');

