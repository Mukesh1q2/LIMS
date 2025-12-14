// Complete Authentication System for LIMS SaaS Platform
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Types
export interface JWTPayload {
  userId: string;
  organizationId: string;
  email: string;
  role: string;
  permissions: string[];
  iat: number;
  exp: number;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  organizationId: string;
  isActive: boolean;
  lastLoginAt?: Date;
  permissions: string[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// Environment variables validation
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

// Validation schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  organizationId: z.string().uuid('Invalid organization ID'),
  role: z.enum(['admin', 'teacher', 'student', 'parent']),
});

// Password utilities
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// JWT utilities
export function generateToken(user: User): string {
  const payload: Omit<JWTPayload, 'iat' | 'exp'> = {
    userId: user.id,
    organizationId: user.organizationId,
    email: user.email,
    role: user.role,
    permissions: user.permissions,
  };

  return jwt.sign(payload, JWT_SECRET!, { 
    expiresIn: JWT_EXPIRES_IN,
    issuer: 'lims-saas',
    audience: 'lims-saas-users'
  });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET!, {
      issuer: 'lims-saas',
      audience: 'lims-saas-users'
    }) as JWTPayload;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

// Authentication middleware
export async function authenticateRequest(request: NextRequest): Promise<{ 
  user?: JWTPayload; 
  error?: string; 
  status?: number;
}> {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader) {
    return { error: 'Authorization header missing', status: 401 };
  }

  if (!authHeader.startsWith('Bearer ')) {
    return { error: 'Invalid authorization format', status: 401 };
  }

  const token = authHeader.substring(7);
  
  const payload = verifyToken(token);
  if (!payload) {
    return { error: 'Invalid or expired token', status: 401 };
  }

  // Check if user is still active and has valid permissions
  // In a real implementation, you would check the database here
  const isValidUser = await validateUserSession(payload.userId, payload.organizationId);
  
  if (!isValidUser) {
    return { error: 'User session invalid', status: 401 };
  }

  return { user: payload };
}

// Role-based access control
export function requireRole(allowedRoles: string[]) {
  return (user: JWTPayload): boolean => {
    return allowedRoles.includes(user.role);
  };
}

export function requirePermission(permission: string) {
  return (user: JWTPayload): boolean => {
    return user.permissions.includes(permission);
  };
}

// Permission definitions
export const PERMISSIONS = {
  // Organization management
  'org:read': 'Read organization data',
  'org:write': 'Modify organization data',
  'org:admin': 'Administer organization',
  
  // User management
  'users:read': 'Read user data',
  'users:write': 'Modify user data',
  'users:delete': 'Delete users',
  'users:invite': 'Invite users',
  
  // Student management
  'students:read': 'Read student data',
  'students:write': 'Modify student data',
  'students:delete': 'Delete students',
  
  // Attendance
  'attendance:read': 'Read attendance data',
  'attendance:write': 'Mark attendance',
  'attendance:export': 'Export attendance reports',
  
  // Fees
  'fees:read': 'Read fee data',
  'fees:write': 'Modify fee structures',
  'fees:collect': 'Process fee collections',
  
  // Library
  'library:read': 'Read library data',
  'library:write': 'Modify library data',
  'library:circulate': 'Manage book circulation',
  
  // Reports
  'reports:read': 'Read reports',
  'reports:export': 'Export reports',
  'reports:analytics': 'View analytics',
  
  // System
  'system:config': 'Configure system settings',
  'system:backup': 'Manage backups',
  'system:audit': 'View audit logs',
} as const;

// Role permission mapping
export const ROLE_PERMISSIONS: Record<string, string[]> = {
  admin: Object.keys(PERMISSIONS), // Admin gets all permissions
  teacher: [
    'students:read', 'students:write',
    'attendance:read', 'attendance:write', 'attendance:export',
    'library:read', 'library:circulate',
    'reports:read', 'reports:export',
  ],
  student: [
    'students:read', // Can only read their own data
    'attendance:read', // Can only read their own attendance
    'library:read', 'library:circulate',
    'reports:read', // Can read their own reports
  ],
  parent: [
    'students:read', // Can read their children's data
    'attendance:read', // Can view their children's attendance
    'library:read', // Can view library activity
    'fees:read', // Can view fee information
  ],
};

// Session management
interface SessionData {
  userId: string;
  organizationId: string;
  loginTime: Date;
  lastActivity: Date;
  ipAddress: string;
  userAgent: string;
}

const activeSessions = new Map<string, SessionData>();

export async function createSession(
  userId: string,
  organizationId: string,
  request: NextRequest
): Promise<string> {
  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  
  const sessionData: SessionData = {
    userId,
    organizationId,
    loginTime: new Date(),
    lastActivity: new Date(),
    ipAddress: request.headers.get('x-forwarded-for') || 
                request.headers.get('x-real-ip') || 
                'unknown',
    userAgent: request.headers.get('user-agent') || 'unknown',
  };
  
  activeSessions.set(sessionId, sessionData);
  
  // In production, store session in Redis with expiration
  // await redis.setex(`session:${sessionId}`, 24 * 60 * 60, JSON.stringify(sessionData));
  
  return sessionId;
}

export async function validateUserSession(userId: string, organizationId: string): Promise<boolean> {
  // In production, check database for user status
  // For now, return true as placeholder
  return true;
}

export async function invalidateSession(sessionId: string): Promise<void> {
  activeSessions.delete(sessionId);
  // In production: await redis.del(`session:${sessionId}`);
}

// Security utilities
export function generateSecurePassword(): string {
  const length = 12;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  
  // Ensure password has at least one character from each required category
  password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)]; // lowercase
  password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]; // uppercase
  password += '0123456789'[Math.floor(Math.random() * 10)]; // number
  password += '!@#$%^&*'[Math.floor(Math.random() * 8)]; // special
  
  // Fill the rest randomly
  for (let i = 4; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

export function validateEmailDomain(email: string, allowedDomains: string[] = []): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  
  if (allowedDomains.length === 0) {
    return true; // Allow all domains if none specified
  }
  
  return allowedDomains.some(allowedDomain => 
    domain?.endsWith(allowedDomain.toLowerCase())
  );
}

// Two-factor authentication utilities (for future implementation)
export function generateTOTP(): string {
  // Implement TOTP generation for 2FA
  // This would use libraries like 'otplib' in production
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Login attempt tracking
interface LoginAttempt {
  email: string;
  attempts: number;
  lastAttempt: Date;
  lockedUntil?: Date;
}

const loginAttempts = new Map<string, LoginAttempt>();

export function trackLoginAttempt(email: string): { 
  allowed: boolean; 
  remaining: number; 
  lockedUntil?: Date;
} {
  const now = new Date();
  const attempt = loginAttempts.get(email);
  
  if (!attempt) {
    loginAttempts.set(email, { email, attempts: 1, lastAttempt: now });
    return { allowed: true, remaining: 4 };
  }
  
  // Reset attempts if enough time has passed (15 minutes)
  if (now.getTime() - attempt.lastAttempt.getTime() > 15 * 60 * 1000) {
    attempt.attempts = 1;
  } else {
    attempt.attempts++;
  }
  
  attempt.lastAttempt = now;
  
  // Lock account after 5 failed attempts for 30 minutes
  if (attempt.attempts >= 5) {
    attempt.lockedUntil = new Date(now.getTime() + 30 * 60 * 1000);
  }
  
  const remaining = Math.max(0, 5 - attempt.attempts);
  const allowed = !attempt.lockedUntil || attempt.lockedUntil <= now;
  
  return { 
    allowed, 
    remaining, 
    lockedUntil: attempt.lockedUntil 
  };
}

export function resetLoginAttempts(email: string): void {
  loginAttempts.delete(email);
}

// Export authentication utilities
export const authUtils = {
  hashPassword,
  verifyPassword,
  generateToken,
  verifyToken,
  createSession,
  invalidateSession,
  trackLoginAttempt,
  resetLoginAttempts,
  generateSecurePassword,
  PERMISSIONS,
  ROLE_PERMISSIONS,
};