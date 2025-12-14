// Comprehensive Security Middleware & Rate Limiting
import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { z } from 'zod';

// Rate Limiting Configuration
interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  keyGenerator?: (request: NextRequest) => string;
  message?: string;
  standardHeaders?: boolean; // Return rate limit info in `RateLimit-*` headers
  legacyHeaders?: boolean; // Enable the deprecated `RateLimit-*` headers
}

// In-memory rate limiting store (use Redis in production)
const rateLimitStore = new Map<string, {
  requests: number;
  resetTime: number;
}>();

// IP-based rate limiting configurations
export const RATE_LIMITS = {
  // Very strict limits for sensitive endpoints
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
    message: 'Too many authentication attempts. Please try again later.',
  },
  contact: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 3,
    message: 'Too many contact form submissions. Please try again later.',
  },
  newsletter: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 2,
    message: 'Too many newsletter requests. Please try again later.',
  },
  general: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
    message: 'Too many requests. Please try again later.',
  },
  strict: {
    windowMs: 5 * 60 * 1000, // 5 minutes
    maxRequests: 10,
    message: 'Rate limit exceeded. Please slow down.',
  },
};

// IP extraction function
function getClientIP(request: NextRequest): string {
  // Check various headers for the real client IP
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    // x-forwarded-for: client, proxy1, proxy2
    return forwarded.split(',')[0].trim();
  }
  
  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }
  
  // Fallback to connection remote address (if available)
  return 'unknown';
}

// Generate rate limit key
function generateRateLimitKey(request: NextRequest, endpoint: string): string {
  const ip = getClientIP(request);
  const userAgent = request.headers.get('user-agent') || '';
  const endpointKey = endpoint || 'general';
  
  // Create a hash to avoid storing actual IP addresses
  const keyData = `${ip}:${userAgent}:${endpointKey}`;
  return createHash('sha256').update(keyData).digest('hex').substring(0, 16);
}

// Rate limiting middleware
export function rateLimit(
  config: RateLimitConfig
) {
  return (request: NextRequest): NextResponse | null => {
    const endpoint = request.nextUrl.pathname;
    const key = generateRateLimitKey(request, endpoint);
    const now = Date.now();
    
    // Clean up expired entries periodically
    if (Math.random() < 0.01) { // 1% chance
      cleanupExpiredEntries();
    }
    
    const record = rateLimitStore.get(key);
    
    if (!record) {
      // First request from this key
      rateLimitStore.set(key, {
        requests: 1,
        resetTime: now + config.windowMs,
      });
      return null; // Allow request
    }
    
    // Check if window has reset
    if (now > record.resetTime) {
      rateLimitStore.set(key, {
        requests: 1,
        resetTime: now + config.windowMs,
      });
      return null; // Allow request
    }
    
    // Check if limit exceeded
    if (record.requests >= config.maxRequests) {
      const remaining = Math.max(0, record.resetTime - now);
      const resetTime = new Date(record.resetTime).toISOString();
      
      return createRateLimitResponse(config.message || 'Rate limit exceeded', {
        limit: config.maxRequests,
        remaining: 0,
        reset: resetTime,
        windowMs: config.windowMs,
      });
    }
    
    // Increment request count
    record.requests++;
    rateLimitStore.set(key, record);
    
    // Return response with rate limit headers
    const remaining = config.maxRequests - record.requests;
    return createRateLimitResponse(null, {
      limit: config.maxRequests,
      remaining,
      reset: new Date(record.resetTime).toISOString(),
      windowMs: config.windowMs,
    });
  };
}

// Create rate limit response
function createRateLimitResponse(
  message: string | null,
  rateLimitInfo: {
    limit: number;
    remaining: number;
    reset: string;
    windowMs: number;
  }
): NextResponse | null {
  const response = message 
    ? NextResponse.json(
        { 
          error: message,
          retryAfter: Math.ceil(rateLimitInfo.windowMs / 1000),
        },
        { 
          status: 429,
          headers: getRateLimitHeaders(rateLimitInfo),
        }
      )
    : NextResponse.next({
        headers: getRateLimitHeaders(rateLimitInfo),
      });
  
  return response;
}

// Get rate limit headers
function getRateLimitHeaders(rateLimitInfo: {
  limit: number;
  remaining: number;
  reset: string;
  windowMs: number;
}) {
  const headers: Record<string, string> = {
    'X-RateLimit-Limit': rateLimitInfo.limit.toString(),
    'X-RateLimit-Remaining': rateLimitInfo.remaining.toString(),
    'X-RateLimit-Reset': rateLimitInfo.reset,
  };
  
  // Add legacy headers for backward compatibility
  headers['Retry-After'] = Math.ceil(rateLimitInfo.windowMs / 1000).toString();
  
  return headers;
}

// Clean up expired rate limit entries
function cleanupExpiredEntries(): void {
  const now = Date.now();
  const expiredKeys: string[] = [];
  
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      expiredKeys.push(key);
    }
  }
  
  expiredKeys.forEach(key => rateLimitStore.delete(key));
}

// Input validation schemas
export const securitySchemas = {
  email: z.string().email().max(254),
  phone: z.string().regex(/^[\+]?[1-9][\d]{0,15}$/),
  name: z.string().min(2).max(100).regex(/^[a-zA-Z\s\-']+$/),
  password: z.string().min(8).max(128).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/),
  studentCount: z.string().regex(/^[1-9]\d*$/).transform(val => parseInt(val)).refine(val => val > 0 && val <= 100000),
  message: z.string().min(10).max(2000),
  url: z.string().url().refine(url => {
    const allowedDomains = ['lims.com', 'localhost'];
    try {
      const domain = new URL(url).hostname;
      return allowedDomains.some(allowed => domain.endsWith(allowed));
    } catch {
      return false;
    }
  }),
};

// Security validation function
export function validateSecurityInput(data: any, schema: z.ZodSchema): {
  isValid: boolean;
  data?: any;
  errors?: string[];
} {
  try {
    const validatedData = schema.parse(data);
    return { isValid: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
      return { isValid: false, errors };
    }
    return { isValid: false, errors: ['Validation failed'] };
  }
}

// CSRF protection
export function validateCSRFToken(request: NextRequest): boolean {
  const csrfToken = request.headers.get('x-csrf-token');
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  
  // In production, you would store and validate a CSRF token
  // For now, implement basic origin checking
  const allowedOrigins = ['http://localhost:3000', 'https://lims.com'];
  
  if (origin && !allowedOrigins.includes(origin)) {
    return false;
  }
  
  if (referer && !allowedOrigins.some(origin => referer.startsWith(origin))) {
    return false;
  }
  
  return true;
}

// Request sanitization
export function sanitizeRequestData(data: any): any {
  if (typeof data === 'string') {
    return data
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<[^>]*>/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim();
  }
  
  if (Array.isArray(data)) {
    return data.map(item => sanitizeRequestData(item));
  }
  
  if (typeof data === 'object' && data !== null) {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(data)) {
      // Sanitize keys to prevent prototype pollution
      const sanitizedKey = key.replace(/[^a-zA-Z0-9_\-]/g, '');
      if (sanitizedKey && !['__proto__', 'constructor', 'prototype'].includes(sanitizedKey)) {
        sanitized[sanitizedKey] = sanitizeRequestData(value);
      }
    }
    return sanitized;
  }
  
  return data;
}

// Security headers middleware
export function addSecurityHeaders(response: NextResponse): NextResponse {
  const securityHeaders = {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'X-DNS-Prefetch-Control': 'off',
    'X-Download-Options': 'noopen',
    'X-Permitted-Cross-Domain-Policies': 'none',
  };
  
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  return response;
}

// Content Security Policy
export function addCSPHeaders(response: NextResponse): NextResponse {
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: https: blob:",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://www.google-analytics.com",
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ');
  
  response.headers.set('Content-Security-Policy', csp);
  return response;
}

// Comprehensive security middleware
export function securityMiddleware(request: NextRequest): NextResponse | null {
  const url = request.nextUrl;
  const method = request.method;
  
  // Add security headers
  const response = NextResponse.next();
  addSecurityHeaders(response);
  addCSPHeaders(response);
  
  // Block suspicious requests
  if (isSuspiciousRequest(request)) {
    return NextResponse.json(
      { error: 'Request blocked' },
      { status: 403 }
    );
  }
  
  // Apply rate limiting based on endpoint
  let rateLimitConfig: RateLimitConfig;
  
  if (url.pathname.startsWith('/api/auth')) {
    rateLimitConfig = RATE_LIMITS.auth;
  } else if (url.pathname.startsWith('/api/contact')) {
    rateLimitConfig = RATE_LIMITS.contact;
  } else if (url.pathname.startsWith('/api/newsletter')) {
    rateLimitConfig = RATE_LIMITS.newsletter;
  } else if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
    rateLimitConfig = RATE_LIMITS.strict;
  } else {
    rateLimitConfig = RATE_LIMITS.general;
  }
  
  // Apply rate limiting
  const rateLimitResponse = rateLimit(rateLimitConfig)(request);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }
  
  return response;
}

// Detect suspicious requests
function isSuspiciousRequest(request: NextRequest): boolean {
  const url = request.nextUrl.toString().toLowerCase();
  const userAgent = request.headers.get('user-agent')?.toLowerCase() || '';
  
  // Check for common attack patterns
  const suspiciousPatterns = [
    /(\.\.\/)|(\.\.\\)/, // Path traversal
    /(<script|javascript:|vbscript:)/i, // XSS attempts
    /union\s+select|select\s+\*|drop\s+table/i, // SQL injection
    /\b(etc/passwd|boot\.ini|win\.ini)\b/i, // File inclusion
  ];
  
  // Check URL
  if (suspiciousPatterns.some(pattern => pattern.test(url))) {
    return true;
  }
  
  // Check for missing user agent
  if (!userAgent || userAgent.length < 10) {
    return true;
  }
  
  // Check for bot signatures
  const botSignatures = [
    'bot', 'crawler', 'spider', 'scraper', 'curl', 'wget', 'python', 'java'
  ];
  
  if (botSignatures.some(signature => userAgent.includes(signature))) {
    // Allow legitimate bots for SEO (adjust as needed)
    if (userAgent.includes('googlebot') ||bingbot')) {
 userAgent.includes('      return false;
    }
    return true;
  }
  
  return false;
}

// Export middleware functions
export const middleware = securityMiddleware;