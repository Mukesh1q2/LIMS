// GDPR Compliance API Routes
import { NextRequest, NextResponse } from 'next/server';
import { 
  dataRequestSchema, 
  consentUpdateSchema, 
  exportUserData, 
  eraseUserData, 
  recordConsent,
  DATA_CATEGORIES 
} from '@/lib/gdpr-compliance';
import { validateInput, secureApiRoute } from '@/lib/security';
import { authenticateRequest } from '@/lib/auth';

// Data Request API Route
const dataRequestHandler = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const authResult = await authenticateRequest(request);
    if (authResult.error) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = authResult.user!;
    const body = await request.json();

    // Validate request
    const validation = validateInput(body, dataRequestSchema);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: 'Invalid request', details: validation.errors },
        { status: 400 }
      );
    }

    const { requestType, additionalInfo } = validation.data!;

    // Create data request record
    const dataRequest = {
      id: `request_${Date.now()}_${Math.random().toString(36).substring(2)}`,
      userId: user.userId,
      organizationId: user.organizationId,
      requestType,
      status: 'pending' as const,
      requestedAt: new Date(),
      metadata: {
        userAgent: request.headers.get('user-agent'),
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        additionalInfo,
      },
    };

    // Process request based on type
    if (requestType === 'access' || requestType === 'portability') {
      try {
        const exportData = await exportUserData(user.userId, user.organizationId);
        
        // Generate secure download URL (in production, store in secure cloud storage)
        const downloadUrl = `data:application/json;base64,${Buffer.from(JSON.stringify(exportData, null, 2)).toString('base64')}`;
        
        // Log the request
        console.log('Data export completed:', {
          requestId: dataRequest.id,
          userId: user.userId,
          requestType,
          timestamp: new Date().toISOString(),
        });

        return NextResponse.json({
          success: true,
          message: 'Data export completed',
          downloadUrl,
          dataSummary: {
            categoriesExported: exportData.metadata.dataCategories,
            totalRecords: exportData.metadata.totalRecords,
            exportDate: exportData.metadata.exportDate,
          },
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        });
      } catch (exportError) {
        console.error('Data export failed:', exportError);
        return NextResponse.json(
          { error: 'Failed to export data. Please try again later.' },
          { status: 500 }
        );
      }
    }

    if (requestType === 'erasure') {
      try {
        const erasureResult = await eraseUserData(user.userId, user.organizationId, requestType);
        
        return NextResponse.json({
          success: true,
          message: erasureResult.message,
          erasureDetails: {
            erasedCategories: erasureResult.erasedCategories,
            retainedCategories: erasureResult.retainedCategories,
            retentionReasons: {
              financial: 'Retained for legal compliance (7 years)',
            },
          },
        });
      } catch (erasureError) {
        console.error('Data erasure failed:', erasureError);
        return NextResponse.json(
          { error: 'Failed to erase data. Please contact support.' },
          { status: 500 }
        );
      }
    }

    // For other request types (rectification, restriction, objection)
    return NextResponse.json({
      success: true,
      message: 'Data request submitted successfully',
      requestId: dataRequest.id,
      requestType,
      status: 'pending',
      estimatedProcessingTime: '30 days',
      nextSteps: getNextStepsForRequestType(requestType),
    });

  } catch (error) {
    console.error('Data request error:', error);
    return NextResponse.json(
      { error: 'Failed to process data request' },
      { status: 500 }
    );
  }
};

export const POST = secureApiRoute(dataRequestHandler);

// Consent Management API Route
const consentHandler = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const authResult = await authenticateRequest(request);
    if (authResult.error) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = authResult.user!;
    const body = await request.json();

    // Validate request
    const validation = validateInput(body, consentUpdateSchema);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: 'Invalid request', details: validation.errors },
        { status: 400 }
      );
    }

    const { consentType, granted, reason } = validation.data!;

    // Record consent
    await recordConsent(
      user.userId,
      user.organizationId,
      consentType,
      granted,
      request
    );

    // Update analytics tracking based on consent
    if (consentType === 'analytics' && !granted) {
      // Disable analytics tracking
      console.log('Analytics tracking disabled for user:', user.userId);
    }

    return NextResponse.json({
      success: true,
      message: 'Consent preferences updated successfully',
      consentType,
      granted,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Consent update error:', error);
    return NextResponse.json(
      { error: 'Failed to update consent preferences' },
      { status: 500 }
    );
  }
};

export const PUT = secureApiRoute(consentHandler);

// Privacy Settings API Route
const privacyHandler = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const authResult = await authenticateRequest(request);
    if (authResult.error) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = authResult.user!;

    if (request.method === 'GET') {
      // Return user's privacy settings and consent records
      const privacySettings = await getUserPrivacySettings(user.userId, user.organizationId);
      const consentRecords = await getUserConsentRecords(user.userId, user.organizationId);

      return NextResponse.json({
        success: true,
        privacySettings,
        consentRecords: consentRecords.map(record => ({
          id: record.id,
          consentType: record.consentType,
          granted: record.granted,
          grantedAt: record.grantedAt,
          revokedAt: record.revokedAt,
        })),
        dataCategories: DATA_CATEGORIES,
        lastUpdated: new Date().toISOString(),
      });
    }

    return NextResponse.json(
      { error: 'Method not allowed' },
      { status: 405 }
    );

  } catch (error) {
    console.error('Privacy settings error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve privacy settings' },
      { status: 500 }
    );
  }
};

export const GET = secureApiRoute(privacyHandler);

// Data Categories Info API Route (public)
const dataCategoriesHandler = async (request: NextRequest): Promise<NextResponse> => {
  if (request.method !== 'GET') {
    return NextResponse.json(
      { error: 'Method not allowed' },
      { status: 405 }
    );
  }

  return NextResponse.json({
    success: true,
    dataCategories: DATA_CATEGORIES,
    lastUpdated: new Date().toISOString(),
  });
};

export const GET as dataCategories = dataCategoriesHandler;

// Helper function to get next steps for different request types
function getNextStepsForRequestType(requestType: string): string[] {
  switch (requestType) {
    case 'rectification':
      return [
        'Our team will review your request within 30 days',
        'We may contact you for additional information',
        'Once processed, you will receive a confirmation',
      ];
    case 'restriction':
      return [
        'We will restrict processing of your data as requested',
        'You will be notified of any changes to this restriction',
        'This restriction will be reviewed annually',
      ];
    case 'objection':
      return [
        'We will cease processing your data for the specified purposes',
        'You may be contacted to discuss alternative solutions',
        'You can withdraw this objection at any time',
      ];
    default:
      return ['Your request is being processed', 'We will contact you within 30 days'];
  }
}

// Database helper functions (placeholder implementations)
async function getUserPrivacySettings(userId: string, organizationId: string): Promise<any> {
  // In production, query database for user's privacy settings
  return {
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: false,
    dataSharing: false,
    analyticsTracking: true,
    profileVisibility: 'private',
  };
}

async function getUserConsentRecords(userId: string, organizationId: string): Promise<any[]> {
  // In production, query database for user's consent records
  return [
    {
      id: 'consent_1',
      consentType: 'cookies',
      granted: true,
      grantedAt: new Date('2024-01-01'),
      revokedAt: null,
    },
    {
      id: 'consent_2',
      consentType: 'analytics',
      granted: false,
      grantedAt: null,
      revokedAt: new Date('2024-01-15'),
    },
  ];
}

// Export all handlers
export const handlers = {
  dataRequest: dataRequestHandler,
  consent: consentHandler,
  privacy: privacyHandler,
  dataCategories: dataCategoriesHandler,
};