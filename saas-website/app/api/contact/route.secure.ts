// Enhanced Contact API Route with Security Improvements
import { NextRequest, NextResponse } from 'next/server';
import { contactFormSchema, sanitizeInput, validateInput, secureApiRoute, logSecurityEvent } from '@/lib/security';

const handler = async (request: NextRequest): Promise<NextResponse> => {
  try {
    // Parse request body
    const body = await request.json();
    
    // Input validation and sanitization
    const sanitizedBody = {
      name: sanitizeInput(body.name),
      email: sanitizeInput(body.email),
      phone: sanitizeInput(body.phone),
      institute: body.institute ? sanitizeInput(body.institute) : '',
      students: body.students ? sanitizeInput(body.students) : '',
      message: sanitizeInput(body.message),
    };
    
    // Validate against schema
    const validation = validateInput(sanitizedBody, contactFormSchema);
    
    if (!validation.isValid) {
      logSecurityEvent({
        type: 'suspicious_request',
        message: 'Invalid contact form submission',
        ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        userAgent: request.headers.get('user-agent'),
        path: '/api/contact',
      });
      
      return NextResponse.json(
        { 
          error: 'Invalid input provided',
          details: validation.errors 
        },
        { status: 400 }
      );
    }
    
    const { name, email, phone, institute, students, message } = validation.data!;
    
    // Additional business logic validation
    if (students && parseInt(students) > 100000) {
      return NextResponse.json(
        { error: 'Student count seems unrealistic' },
        { status: 400 }
      );
    }
    
    // Check for spam indicators
    const spamIndicators = [
      /(.)\1{4,}/, // Repeated characters
      /http[s]?:\/\//, // URLs in form
      /viagra|casino|lottery/i, // Common spam keywords
    ];
    
    const isSpam = spamIndicators.some(pattern => 
      pattern.test(name) || pattern.test(message) || pattern.test(institute)
    );
    
    if (isSpam) {
      logSecurityEvent({
        type: 'suspicious_request',
        message: 'Spam detected in contact form',
        ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        userAgent: request.headers.get('user-agent'),
        path: '/api/contact',
      });
      
      return NextResponse.json(
        { error: 'Your submission appears to be spam' },
        { status: 400 }
      );
    }
    
    // Log successful submission (for analytics and debugging)
    console.log('Contact form submission:', {
      name,
      email,
      phone,
      institute,
      students,
      message: message.substring(0, 100) + (message.length > 100 ? '...' : ''), // Truncate for privacy
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent'),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
    });
    
    // In production, implement:
    // 1. Send email to sales team using a secure email service
    // 2. Send confirmation email to user
    // 3. Store in database for lead management
    // 4. Integrate with CRM (HubSpot, Salesforce, etc.)
    // 5. Add to marketing automation platform
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate unique lead ID
    const leadId = `LIMS_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    
    // Success response
    return NextResponse.json({
      success: true,
      message: 'Thank you for your interest! Our team will contact you within 2 hours.',
      leadId,
    });
    
  } catch (error) {
    // Log error securely
    logSecurityEvent({
      type: 'error',
      message: 'Contact form error',
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      userAgent: request.headers.get('user-agent'),
      path: '/api/contact',
    });
    
    // Return generic error message to avoid information disclosure
    return NextResponse.json(
      { error: 'An error occurred while processing your request. Please try again later.' },
      { status: 500 }
    );
  }
};

// Apply security wrapper and rate limiting
export const POST = secureApiRoute(handler);

// Handle other HTTP methods
export async function GET(request: NextRequest) {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}