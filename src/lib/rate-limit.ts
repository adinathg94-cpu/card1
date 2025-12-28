// Simple in-memory rate limiter for API routes
// For production, consider using Redis or a dedicated service like Upstash

interface RateLimitEntry {
    count: number;
    resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up old entries every 5 minutes
setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
        if (now > entry.resetTime) {
            rateLimitStore.delete(key);
        }
    }
}, 5 * 60 * 1000);

export interface RateLimitOptions {
    /**
     * Maximum number of requests allowed in the time window
     */
    maxRequests: number;

    /**
     * Time window in seconds
     */
    windowSeconds: number;

    /**
     * Custom identifier function (defaults to IP address)
     */
    identifier?: (request: Request) => string;
}

export interface RateLimitResult {
    success: boolean;
    limit: number;
    remaining: number;
    reset: number;
}

/**
 * Check if a request should be rate limited
 * 
 * @param request - The incoming request
 * @param options - Rate limiting options
 * @returns Rate limit result
 */
export function checkRateLimit(
    request: Request,
    options: RateLimitOptions
): RateLimitResult {
    const { maxRequests, windowSeconds, identifier } = options;

    // Get identifier (default to IP address)
    const key = identifier
        ? identifier(request)
        : getClientIP(request);

    const now = Date.now();
    const windowMs = windowSeconds * 1000;

    // Get or create rate limit entry
    let entry = rateLimitStore.get(key);

    if (!entry || now > entry.resetTime) {
        // Create new entry
        entry = {
            count: 0,
            resetTime: now + windowMs
        };
        rateLimitStore.set(key, entry);
    }

    // Increment count
    entry.count++;

    // Check if limit exceeded
    const success = entry.count <= maxRequests;
    const remaining = Math.max(0, maxRequests - entry.count);

    return {
        success,
        limit: maxRequests,
        remaining,
        reset: Math.floor(entry.resetTime / 1000)
    };
}

/**
 * Get client IP address from request headers
 */
function getClientIP(request: Request): string {
    // Try common headers first
    const forwarded = request.headers.get('x-forwarded-for');
    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }

    const realIP = request.headers.get('x-real-ip');
    if (realIP) {
        return realIP;
    }

    // Fallback to a generic identifier
    return 'unknown';
}

/**
 * Create rate limit headers for response
 */
export function createRateLimitHeaders(result: RateLimitResult): HeadersInit {
    return {
        'X-RateLimit-Limit': result.limit.toString(),
        'X-RateLimit-Remaining': result.remaining.toString(),
        'X-RateLimit-Reset': result.reset.toString(),
    };
}
