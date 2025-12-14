// API Route for newsletter subscription
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Simulate newsletter subscription
    console.log('Newsletter subscription:', {
      email,
      timestamp: new Date().toISOString(),
    });

    // In real implementation, add to mailing list
    // (Mailchimp, ConvertKit, etc.)

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to our newsletter!',
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}