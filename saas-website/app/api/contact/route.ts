// API Route for contact form submission
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, institute, students, message } = body;

    // Validate required fields
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'Required fields missing' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Here you would integrate with your email service
    // For now, we'll simulate a successful submission
    console.log('Contact form submission:', {
      name,
      email,
      phone,
      institute,
      students,
      message,
      timestamp: new Date().toISOString(),
    });

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In a real implementation, you would:
    // 1. Send email to sales team
    // 2. Send confirmation email to user
    // 3. Store in database
    // 4. Integrate with CRM (HubSpot, Salesforce, etc.)

    return NextResponse.json({
      success: true,
      message: 'Thank you for your interest! Our team will contact you within 2 hours.',
      leadId: `LIMS_${Date.now()}`,
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}