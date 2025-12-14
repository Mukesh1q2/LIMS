// Enhanced API Routes with Security Measures
import { NextRequest, NextResponse } from 'next/server';
import { 
  loginSchema, 
  registerSchema, 
  authUtils, 
  authenticateRequest,
  requireRole,
  PERMISSIONS
} from '@/lib/auth';
import { validateInput, secureApiRoute, logSecurityEvent } from '@/lib/security';

// Login API Route
const loginHandler = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const body = await request.json();
    
    // Validate input
    const validation = validateInput(body, loginSchema);
    if (!validation.isValid) {
      logSecurityEvent({
        type: 'auth_failure',
        message: 'Invalid login attempt',
        ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        userAgent: request.headers.get('user-agent'),
        path: '/api/auth/login',
      });
      
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 400 }
      );
    }
    
    const { email, password } = validation.data!;
    
    // Track login attempts
    const attemptResult = authUtils.trackLoginAttempt(email);
    if (!attemptResult.allowed) {
      logSecurityEvent({
        type: 'auth_failure',
        message: `Account locked for ${email}`,
        ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        userAgent: request.headers.get('user-agent'),
        path: '/api/auth/login',
      });
      
      return NextResponse.json(
        { 
          error: 'Account temporarily locked due to too many failed attempts',
          lockedUntil: attemptResult.lockedUntil?.toISOString()
        },
        { status: 429 }
      );
    }
    
    // In production, retrieve user from database
    const user = await getUserByEmail(email);
    if (!user || !user.isActive) {
      // Don't reveal whether user exists or not
      logSecurityEvent({
        type: 'auth_failure',
        message: 'Failed login attempt for non-existent or inactive user',
        ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        userAgent: request.headers.get('user-agent'),
        path: '/api/auth/login',
      });
      
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Verify password
    const isValidPassword = await authUtils.verifyPassword(password, user.hashedPassword);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Check organization status
    const organization = await getOrganizationById(user.organizationId);
    if (!organization || !organization.isActive) {
      return NextResponse.json(
        { error: 'Organization is inactive' },
        { status: 403 }
      );
    }
    
    // Generate token
    const token = authUtils.generateToken({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      organizationId: user.organizationId,
      isActive: user.isActive,
      lastLoginAt: new Date(),
      permissions: getUserPermissions(user.role),
    });
    
    // Create session
    const sessionId = await authUtils.createSession(
      user.id, 
      user.organizationId, 
      request
    );
    
    // Reset login attempts on successful login
    authUtils.resetLoginAttempts(email);
    
    // Log successful login
    logSecurityEvent({
      type: 'auth_success',
      message: `Successful login for ${email}`,
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      userAgent: request.headers.get('user-agent'),
      userId: user.id,
      path: '/api/auth/login',
    });
    
    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        organizationId: user.organizationId,
        permissions: getUserPermissions(user.role),
      },
      sessionId,
    });
    
  } catch (error) {
    logSecurityEvent({
      type: 'error',
      message: 'Login error occurred',
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      userAgent: request.headers.get('user-agent'),
      path: '/api/auth/login',
    });
    
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
};

export const POST = secureApiRoute(loginHandler);

// Register API Route
const registerHandler = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const body = await request.json();
    
    // Validate input
    const validation = validateInput(body, registerSchema);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.errors },
        { status: 400 }
      );
    }
    
    const { email, password, firstName, lastName, organizationId, role } = validation.data!;
    
    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      );
    }
    
    // Verify organization exists and user has permission to invite
    const organization = await getOrganizationById(organizationId);
    if (!organization) {
      return NextResponse.json(
        { error: 'Invalid organization' },
        { status: 400 }
      );
    }
    
    // Hash password
    const hashedPassword = await authUtils.hashPassword(password);
    
    // Create user
    const user = await createUser({
      email,
      hashedPassword,
      firstName,
      lastName,
      role,
      organizationId,
      isActive: true,
      permissions: getUserPermissions(role),
    });
    
    // Log registration
    logSecurityEvent({
      type: 'auth_success',
      message: `New user registered: ${email}`,
      userId: user.id,
      path: '/api/auth/register',
    });
    
    return NextResponse.json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        organizationId: user.organizationId,
      },
    });
    
  } catch (error) {
    logSecurityEvent({
      type: 'error',
      message: 'Registration error occurred',
      path: '/api/auth/register',
    });
    
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
};

export const POST as register = secureApiRoute(registerHandler);

// Profile API Route
const profileHandler = async (request: NextRequest): Promise<NextResponse> => {
  try {
    // Authenticate user
    const authResult = await authenticateRequest(request);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status || 401 }
      );
    }
    
    const user = authResult.user!;
    
    if (request.method === 'GET') {
      // Get user profile
      const userData = await getUserById(user.userId);
      if (!userData) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        success: true,
        user: {
          id: userData.id,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: userData.role,
          organizationId: userData.organizationId,
          permissions: user.permissions,
          lastLoginAt: userData.lastLoginAt,
        },
      });
    }
    
    if (request.method === 'PUT') {
      // Update user profile
      const body = await request.json();
      
      // Validate permissions
      if (!requireRole(['admin', 'teacher'])(user)) {
        return NextResponse.json(
          { error: 'Insufficient permissions' },
          { status: 403 }
        );
      }
      
      // Update user
      const updatedUser = await updateUser(user.userId, body);
      
      return NextResponse.json({
        success: true,
        user: updatedUser,
      });
    }
    
    return NextResponse.json(
      { error: 'Method not allowed' },
      { status: 405 }
    );
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Profile operation failed' },
      { status: 500 }
    );
  }
};

export const GET = secureApiRoute(profileHandler);
export const PUT = secureApiRoute(profileHandler);

// Logout API Route
const logoutHandler = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const authHeader = request.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const payload = authUtils.verifyToken(token);
      
      if (payload) {
        // Invalidate session
        await authUtils.invalidateSession(`session_${payload.userId}`);
        
        logSecurityEvent({
          type: 'auth_success',
          message: 'User logged out',
          userId: payload.userId,
          path: '/api/auth/logout',
        });
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
};

export const POST as logout = secureApiRoute(logoutHandler);

// Verify Token API Route
const verifyHandler = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const authResult = await authenticateRequest(request);
    
    if (authResult.error) {
      return NextResponse.json(
        { valid: false, error: authResult.error },
        { status: 401 }
      );
    }
    
    return NextResponse.json({
      valid: true,
      user: authResult.user,
    });
    
  } catch (error) {
    return NextResponse.json(
      { valid: false, error: 'Token verification failed' },
      { status: 500 }
    );
  }
};

export const GET as verify = secureApiRoute(verifyHandler);

// Database helper functions (placeholders for real implementation)
async function getUserByEmail(email: string): Promise<any | null> {
  // In production, query database
  // return await prisma.user.findUnique({ where: { email } });
  return null;
}

async function getUserById(userId: string): Promise<any | null> {
  // In production, query database
  return null;
}

async function createUser(userData: any): Promise<any> {
  // In production, create user in database
  // return await prisma.user.create({ data: userData });
  return { id: 'temp-id', ...userData };
}

async function updateUser(userId: string, updates: any): Promise<any> {
  // In production, update user in database
  // return await prisma.user.update({ where: { id: userId }, data: updates });
  return { id: userId, ...updates };
}

async function getOrganizationById(orgId: string): Promise<any | null> {
  // In production, query database
  return null;
}

function getUserPermissions(role: string): string[] {
  return authUtils.ROLE_PERMISSIONS[role] || [];
}