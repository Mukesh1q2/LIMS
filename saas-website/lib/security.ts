// Security fixes for LIMS SaaS Platform
// This file implements critical security improvements

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';

// Security headers configuration
export const securityHeaders = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'origin-when-cross-origin',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self'",
};

// Rate limiting configurations
export const rateLimiters = {
  contact: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: 'Too many contact form submissions, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  }),
  newsletter: rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 3, // limit each IP to 3 requests per minute
    message: 'Too many newsletter requests, please try again later.',
  }),
  general: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests, please try again later.',
  }),
};

// Input validation schemas
export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long').regex(/^[a-zA-Z\s]+$/, 'Name contains invalid characters'),
  email: z.string().email('Invalid email format').max(254, 'Email too long'),
  phone: z.string().regex(/^[\+]?[1-9][\d]{0,15}$/, 'Invalid phone number format'),
  institute: z.string().max(200, 'Institute name too long').optional(),
  students: z.string().regex(/^[1-9]\d*$/, 'Invalid student count format').optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000, 'Message too long'),
});

export const newsletterSchema = z.object({
  email: z.string().email('Invalid email format').max(254, 'Email too long'),
});

// Input sanitization functions
export function sanitizeInput(input: string): string {
  // Remove HTML tags and dangerous characters
  return input
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[<>&"']/g, (match) => {
      const escapeMap: Record<string, string> = {
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        '"': '&quot;',
        "'": '&#x27;',
      };
      return escapeMap[match];
    })
    .trim();
}

export function sanitizePhone(phone: string): string {
  // Remove all non-digit characters except + and -
  return phone.replace(/[^\d\+\-]/g, '');
}

export function validateInput(data: any, schema: z.ZodSchema): { isValid: boolean; data?: any; errors?: string[] } {
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

// Enhanced API route with security measures
export function secureApiRoute(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      // Add security headers
      const response = await handler(req);
      
      // Add security headers to response
      Object.entries(securityHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      
      return response;
    } catch (error) {
      console.error('API Error:', error);
      
      // Return generic error message to avoid information disclosure
      return NextResponse.json(
        { error: 'An error occurred while processing your request' },
        { 
          status: 500,
          headers: securityHeaders,
        }
      );
    }
  };
}

// Authentication middleware (for future implementation)
export async function authenticateRequest(req: NextRequest): Promise<{ userId?: string; organizationId?: string; error?: string }> {
  const authHeader = req.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'Missing or invalid authorization header' };
  }
  
  const token = authHeader.substring(7);
  
  try {
    // Verify JWT token (implement JWT verification logic)
    // const payload = verifyJWT(token);
    // return { userId: payload.userId, organizationId: payload.organizationId };
    
    // For now, return a placeholder
    return { userId: 'temp-user', organizationId: 'temp-org' };
  } catch (error) {
    return { error: 'Invalid or expired token' };
  }
}

// File upload security
export function validateFileUpload(file: File): { isValid: boolean; error?: string } {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'File type not allowed' };
  }
  
  if (file.size > maxSize) {
    return { isValid: false, error: 'File too large' };
  }
  
  return { isValid: true };
}

// Error logging function
export function logSecurityEvent(event: {
  type: 'auth_failure' | 'rate_limit' | 'suspicious_request' | 'error';
  message: string;
  ip?: string;
  userAgent?: string;
  path?: string;
  userId?: string;
}) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    ...event,
  };
  
  // Log to secure logging system (implement with proper log aggregation)
  console.log('Security Event:', logEntry);
}

// Content Security Policy violations handler
export function handleCSPViolation(violation: any) {
  logSecurityEvent({
    type: 'suspicious_request',
    message: 'CSP violation detected',
    path: violation['document-uri'],
    userAgent: violation['user-agent'],
  });
}

// Export security utilities
export const securityUtils = {
  sanitizeInput,
  sanitizePhone,
  validateInput,
  validateFileUpload,
  logSecurityEvent,
  securityHeaders,
  rateLimiters,
};