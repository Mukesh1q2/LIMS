// GDPR Compliance & Data Privacy Implementation
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { authenticateRequest } from '@/lib/auth';
import { validateInput, secureApiRoute } from '@/lib/security';

// GDPR Data Types
export interface PersonalDataRequest {
  id: string;
  userId: string;
  organizationId: string;
  requestType: 'access' | 'portability' | 'rectification' | 'erasure' | 'restriction' | 'objection';
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  requestedAt: Date;
  processedAt?: Date;
  completedAt?: Date;
  rejectionReason?: string;
  dataExportUrl?: string;
  metadata: Record<string, any>;
}

export interface DataCategory {
  category: string;
  dataTypes: string[];
  retentionPeriod: number; // in days
  legalBasis: string;
  purposes: string[];
  thirdParties: string[];
}

// Data Categories Configuration
export const DATA_CATEGORIES: Record<string, DataCategory> = {
  identification: {
    category: 'Identification Data',
    dataTypes: ['name', 'email', 'phone', 'date_of_birth', 'address'],
    retentionPeriod: 2555, // 7 years after account closure
    legalBasis: 'Contract performance',
    purposes: ['account_management', 'communication', 'verification'],
    thirdParties: ['email_service_provider', 'sms_provider']
  },
  academic: {
    category: 'Academic Data',
    dataTypes: ['student_id', 'enrollment_date', 'grades', 'attendance', 'courses'],
    retentionPeriod: 1825, // 5 years after graduation
    legalBasis: 'Legitimate interest',
    purposes: ['education_delivery', 'academic_record_keeping'],
    thirdParties: ['learning_management_system']
  },
  financial: {
    category: 'Financial Data',
    dataTypes: ['payment_history', 'fee_structure', 'billing_info'],
    retentionPeriod: 2555, // 7 years for tax compliance
    legalBasis: 'Legal obligation',
    purposes: ['payment_processing', 'financial_reporting'],
    thirdParties: ['payment_processor', 'accounting_software']
  },
  behavioral: {
    category: 'Behavioral Data',
    dataTypes: ['login_logs', 'feature_usage', 'session_data', 'preferences'],
    retentionPeriod: 730, // 2 years
    legalBasis: 'Legitimate interest',
    purposes: ['service_improvement', 'security', 'analytics'],
    thirdParties: ['analytics_provider']
  },
  communications: {
    category: 'Communication Data',
    dataTypes: ['emails', 'messages', 'notifications', 'support_tickets'],
    retentionPeriod: 1095, // 3 years
    legalBasis: 'Contract performance',
    purposes: ['customer_support', 'service_communication'],
    thirdParties: ['email_service', 'support_platform']
  }
};

// Consent Management
export interface ConsentRecord {
  id: string;
  userId: string;
  organizationId: string;
  consentType: 'cookies' | 'marketing' | 'analytics' | 'necessary' | 'third_party';
  granted: boolean;
  grantedAt?: Date;
  revokedAt?: Date;
  ipAddress: string;
  userAgent: string;
  metadata: Record<string, any>;
}

// Validation schemas
export const dataRequestSchema = z.object({
  requestType: z.enum(['access', 'portability', 'rectification', 'erasure', 'restriction', 'objection']),
  additionalInfo: z.string().max(1000).optional(),
});

export const consentUpdateSchema = z.object({
  consentType: z.enum(['cookies', 'marketing', 'analytics', 'third_party']),
  granted: z.boolean(),
  reason: z.string().max(500).optional(),
});

// Data Export Functions
export async function exportUserData(userId: string, organizationId: string): Promise<{
  personalData: Record<string, any>;
  metadata: {
    exportDate: Date;
    dataCategories: string[];
    totalRecords: number;
  };
}> {
  const exportData: Record<string, any> = {};
  let totalRecords = 0;

  // Export identification data
  const identificationData = await exportIdentificationData(userId, organizationId);
  exportData.identification = identificationData;
  totalRecords += Object.keys(identificationData).length;

  // Export academic data
  const academicData = await exportAcademicData(userId, organizationId);
  exportData.academic = academicData;
  totalRecords += Object.keys(academicData).length;

  // Export financial data
  const financialData = await exportFinancialData(userId, organizationId);
  exportData.financial = financialData;
  totalRecords += Object.keys(financialData).length;

  // Export behavioral data
  const behavioralData = await exportBehavioralData(userId, organizationId);
  exportData.behavioral = behavioralData;
  totalRecords += Object.keys(behavioralData).length;

  // Export communications data
  const communicationsData = await exportCommunicationsData(userId, organizationId);
  exportData.communications = communicationsData;
  totalRecords += Object.keys(communicationsData).length;

  return {
    personalData: exportData,
    metadata: {
      exportDate: new Date(),
      dataCategories: Object.keys(DATA_CATEGORIES),
      totalRecords,
    },
  };
}

// Data Export Implementations
async function exportIdentificationData(userId: string, organizationId: string) {
  // In production, query database for user identification data
  const user = await getUserById(userId);
  const student = await getStudentByUserId(userId, organizationId);
  
  return {
    user: {
      email: user?.email,
      firstName: user?.firstName,
      lastName: user?.lastName,
      role: user?.role,
      createdAt: user?.createdAt,
    },
    student: student ? {
      studentId: student.studentId,
      enrollmentNumber: student.enrollmentNumber,
      program: student.program,
      department: student.department,
      admissionDate: student.admissionDate,
    } : null,
  };
}

async function exportAcademicData(userId: string, organizationId: string) {
  // Export academic records, attendance, grades
  const enrollments = await getStudentEnrollments(userId, organizationId);
  const attendance = await getStudentAttendance(userId, organizationId);
  
  return {
    enrollments,
    attendance,
  };
}

async function exportFinancialData(userId: string, organizationId: string) {
  // Export payment history, fee records
  const payments = await getStudentPayments(userId, organizationId);
  const feeStructures = await getFeeStructures(organizationId);
  
  return {
    payments,
    feeStructures,
  };
}

async function exportBehavioralData(userId: string, organizationId: string) {
  // Export login logs, usage data
  const loginLogs = await getLoginLogs(userId, organizationId);
  const usageStats = await getUsageStatistics(userId, organizationId);
  
  return {
    loginLogs,
    usageStatistics: usageStats,
  };
}

async function exportCommunicationsData(userId: string, organizationId: string) {
  // Export emails, messages, notifications
  const notifications = await getUserNotifications(userId, organizationId);
  const supportTickets = await getSupportTickets(userId, organizationId);
  
  return {
    notifications,
    supportTickets,
  };
}

// Data Erasure Functions
export async function eraseUserData(userId: string, organizationId: string, requestType: string): Promise<{
  success: boolean;
  erasedCategories: string[];
  retainedCategories: string[];
  message: string;
}> {
  const erasedCategories: string[] = [];
  const retainedCategories: string[] = [];

  // Always retain data required by law (financial records for 7 years)
  retainedCategories.push('financial');

  try {
    // Erase identification data
    await eraseIdentificationData(userId, organizationId);
    erasedCategories.push('identification');

    // Erase academic data
    await eraseAcademicData(userId, organizationId);
    erasedCategories.push('academic');

    // Erase behavioral data
    await eraseBehavioralData(userId, organizationId);
    erasedCategories.push('behavioral');

    // Erase communications data
    await eraseCommunicationsData(userId, organizationId);
    erasedCategories.push('communications');

    // Note: Financial data retained for legal compliance
    // In production, you might anonymize instead of delete

    return {
      success: true,
      erasedCategories,
      retainedCategories,
      message: 'Data erasure completed successfully',
    };
  } catch (error) {
    return {
      success: false,
      erasedCategories,
      retainedCategories,
      message: 'Data erasure partially completed',
    };
  }
}

// Data Erasure Implementations
async function eraseIdentificationData(userId: string, organizationId: string) {
  // Anonymize user data instead of complete deletion
  await updateUser(userId, {
    email: `deleted_${Date.now()}@deleted.local`,
    firstName: 'Deleted',
    lastName: 'User',
    hashedPassword: null,
    isActive: false,
    deletedAt: new Date(),
  });
}

async function eraseAcademicData(userId: string, organizationId: string) {
  // Anonymize academic records
  await anonymizeStudentData(userId, organizationId);
}

async function eraseBehavioralData(userId: string, organizationId: string) {
  // Delete behavioral data (login logs, usage stats)
  await deleteLoginLogs(userId, organizationId);
  await deleteUsageStatistics(userId, organizationId);
}

async function eraseCommunicationsData(userId: string, organizationId: string) {
  // Delete or anonymize communication records
  await deleteUserNotifications(userId, organizationId);
  await deleteSupportTickets(userId, organizationId);
}

// Consent Management Functions
export async function recordConsent(
  userId: string,
  organizationId: string,
  consentType: string,
  granted: boolean,
  request: NextRequest
): Promise<void> {
  const consentRecord: ConsentRecord = {
    id: `consent_${Date.now()}_${Math.random().toString(36).substring(2)}`,
    userId,
    organizationId,
    consentType: consentType as any,
    granted,
    grantedAt: granted ? new Date() : undefined,
    revokedAt: !granted ? new Date() : undefined,
    ipAddress: request.headers.get('x-forwarded-for') || 
                request.headers.get('x-real-ip') || 
                'unknown',
    userAgent: request.headers.get('user-agent') || 'unknown',
    metadata: {
      userAgent: request.headers.get('user-agent'),
      referer: request.headers.get('referer'),
      timestamp: new Date(),
    },
  };

  // Store consent record
  await storeConsentRecord(consentRecord);

  // Update user preferences
  await updateUserConsentPreferences(userId, organizationId, consentType, granted);
}

// Data Request Handler
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
    const dataRequest: PersonalDataRequest = {
      id: `request_${Date.now()}_${Math.random().toString(36).substring(2)}`,
      userId: user.userId,
      organizationId: user.organizationId,
      requestType,
      status: 'pending',
      requestedAt: new Date(),
      metadata: {
        userAgent: request.headers.get('user-agent'),
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        additionalInfo,
      },
    };

    await storeDataRequest(dataRequest);

    // Process request immediately for access/export
    if (requestType === 'access' || requestType === 'portability') {
      const exportData = await exportUserData(user.userId, user.organizationId);
      
      // Generate secure download URL
      const downloadUrl = await generateSecureDownloadUrl(exportData, user.userId);
      
      await updateDataRequest(dataRequest.id, {
        status: 'completed',
        completedAt: new Date(),
        dataExportUrl: downloadUrl,
      });

      return NextResponse.json({
        success: true,
        message: 'Data export completed',
        downloadUrl,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      });
    }

    // For other request types, mark as processing
    await updateDataRequest(dataRequest.id, {
      status: 'processing',
    });

    return NextResponse.json({
      success: true,
      message: 'Data request submitted successfully',
      requestId: dataRequest.id,
      estimatedProcessingTime: '30 days',
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

// Consent Management Handler
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

    return NextResponse.json({
      success: true,
      message: 'Consent preferences updated',
      consentType,
      granted,
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

// Privacy Settings Handler
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
      // Return user's privacy settings
      const privacySettings = await getUserPrivacySettings(user.userId, user.organizationId);
      const consentRecords = await getUserConsentRecords(user.userId, user.organizationId);

      return NextResponse.json({
        success: true,
        privacySettings,
        consentRecords,
        dataCategories: DATA_CATEGORIES,
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

// Database helper functions (placeholders for real implementation)
async function getUserById(userId: string): Promise<any | null> {
  // In production, query database
  return null;
}

async function getStudentByUserId(userId: string, organizationId: string): Promise<any | null> {
  return null;
}

async function getStudentEnrollments(userId: string, organizationId: string): Promise<any[]> {
  return [];
}

async function getStudentAttendance(userId: string, organizationId: string): Promise<any[]> {
  return [];
}

async function getStudentPayments(userId: string, organizationId: string): Promise<any[]> {
  return [];
}

async function getFeeStructures(organizationId: string): Promise<any[]> {
  return [];
}

async function getLoginLogs(userId: string, organizationId: string): Promise<any[]> {
  return [];
}

async function getUsageStatistics(userId: string, organizationId: string): Promise<any> {
  return {};
}

async function getUserNotifications(userId: string, organizationId: string): Promise<any[]> {
  return [];
}

async function getSupportTickets(userId: string, organizationId: string): Promise<any[]> {
  return [];
}

async function updateUser(userId: string, updates: any): Promise<void> {
  // In production, update user in database
}

async function anonymizeStudentData(userId: string, organizationId: string): Promise<void> {
  // Anonymize student records
}

async function deleteLoginLogs(userId: string, organizationId: string): Promise<void> {
  // Delete login logs
}

async function deleteUsageStatistics(userId: string, organizationId: string): Promise<void> {
  // Delete usage statistics
}

async function deleteUserNotifications(userId: string, organizationId: string): Promise<void> {
  // Delete user notifications
}

async function deleteSupportTickets(userId: string, organizationId: string): Promise<void> {
  // Delete support tickets
}

async function storeConsentRecord(consent: ConsentRecord): Promise<void> {
  // Store consent record in database
}

async function updateUserConsentPreferences(userId: string, organizationId: string, consentType: string, granted: boolean): Promise<void> {
  // Update user consent preferences
}

async function storeDataRequest(request: PersonalDataRequest): Promise<void> {
  // Store data request in database
}

async function updateDataRequest(requestId: string, updates: Partial<PersonalDataRequest>): Promise<void> {
  // Update data request in database
}

async function generateSecureDownloadUrl(data: any, userId: string): Promise<string> {
  // Generate secure download URL with expiration
  return `https://secure.example.com/downloads/${requestId}`;
}

async function getUserPrivacySettings(userId: string, organizationId: string): Promise<any> {
  return {};
}

async function getUserConsentRecords(userId: string, organizationId: string): Promise<ConsentRecord[]> {
  return [];
}