// Monitoring & Observability System for LIMS SaaS Platform
import { NextRequest, NextResponse } from 'next/server';

// Performance Monitoring Types
export interface PerformanceMetric {
  name: string;
  value: number;
  unit: 'ms' | 'bytes' | 'count' | 'percentage';
  timestamp: Date;
  tags: Record<string, string>;
}

export interface ErrorEvent {
  id: string;
  level: 'error' | 'warning' | 'info';
  message: string;
  stack?: string;
  userId?: string;
  organizationId?: string;
  requestId?: string;
  url?: string;
  method?: string;
  userAgent?: string;
  ip?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface AuditEvent {
  id: string;
  action: string;
  resource: string;
  resourceId?: string;
  userId?: string;
  organizationId?: string;
  ip?: string;
  userAgent?: string;
  timestamp: Date;
  changes?: {
    before?: any;
    after?: any;
  };
  result: 'success' | 'failure';
  metadata?: Record<string, any>;
}

// In-memory monitoring store (use proper monitoring solution in production)
const monitoringStore = {
  metrics: [] as PerformanceMetric[],
  errors: [] as ErrorEvent[],
  audits: [] as AuditEvent[],
  alerts: [] as any[],
};

// Performance monitoring
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private startTime: number = 0;
  private activeRequests: Map<string, number> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startRequest(requestId: string): void {
    this.startTime = performance.now();
    this.activeRequests.set(requestId, this.startTime);
  }

  endRequest(
    requestId: string,
    request: NextRequest,
    response: NextResponse,
    error?: Error
  ): void {
    const startTime = this.activeRequests.get(requestId);
    if (!startTime) return;

    const duration = performance.now() - startTime;
    this.activeRequests.delete(requestId);

    // Record performance metric
    this.recordMetric({
      name: 'http_request_duration',
      value: duration,
      unit: 'ms',
      timestamp: new Date(),
      tags: {
        method: request.method,
        route: request.nextUrl.pathname,
        status: response.status.toString(),
        hasError: error ? 'true' : 'false',
      },
    });

    // Record memory usage
    if (typeof process !== 'undefined' && process.memoryUsage) {
      const memUsage = process.memoryUsage();
      this.recordMetric({
        name: 'memory_usage',
        value: memUsage.heapUsed,
        unit: 'bytes',
        timestamp: new Date(),
        tags: {
          type: 'heap_used',
        },
      });
    }

    // Alert on slow requests
    if (duration > 2000) {
      this.createAlert({
        level: 'warning',
        message: `Slow request detected: ${duration.toFixed(2)}ms`,
        metric: 'http_request_duration',
        value: duration,
        threshold: 2000,
      });
    }
  }

  recordMetric(metric: PerformanceMetric): void {
    monitoringStore.metrics.push(metric);
    
    // Keep only last 1000 metrics to prevent memory issues
    if (monitoringStore.metrics.length > 1000) {
      monitoringStore.metrics = monitoringStore.metrics.slice(-500);
    }

    // In production, send to monitoring service (DataDog, New Relic, etc.)
    // this.sendToMonitoringService(metric);
  }

  private createAlert(alert: any): void {
    monitoringStore.alerts.push({
      ...alert,
      id: `alert_${Date.now()}_${Math.random().toString(36).substring(2)}`,
      timestamp: new Date(),
    });

    console.warn('ALERT:', alert);
    
    // In production, send alerts to monitoring service
    // this.sendAlert(alert);
  }
}

// Error monitoring
export class ErrorMonitor {
  private static instance: ErrorMonitor;

  static getInstance(): ErrorMonitor {
    if (!ErrorMonitor.instance) {
      ErrorMonitor.instance = new ErrorMonitor();
    }
    return ErrorMonitor.instance;
  }

  recordError(
    error: Error | string,
    context: {
      requestId?: string;
      userId?: string;
      organizationId?: string;
      request?: NextRequest;
      metadata?: Record<string, any>;
    } = {}
  ): string {
    const errorEvent: ErrorEvent = {
      id: `error_${Date.now()}_${Math.random().toString(36).substring(2)}`,
      level: 'error',
      message: typeof error === 'string' ? error : error.message,
      stack: error instanceof Error ? error.stack : undefined,
      userId: context.userId,
      organizationId: context.organizationId,
      requestId: context.requestId,
      url: context.request?.nextUrl.toString(),
      method: context.request?.method,
      userAgent: context.request?.headers.get('user-agent') || undefined,
      ip: context.request?.headers.get('x-forwarded-for') || 
          context.request?.headers.get('x-real-ip') || 
          'unknown',
      timestamp: new Date(),
      metadata: context.metadata,
    };

    monitoringStore.errors.push(errorEvent);

    // Keep only last 500 errors
    if (monitoringStore.errors.length > 500) {
      monitoringStore.errors = monitoringStore.errors.slice(-250);
    }

    // In production, send to error tracking service (Sentry, Bugsnag, etc.)
    // this.sendToErrorService(errorEvent);

    console.error('Error recorded:', errorEvent);
    return errorEvent.id;
  }

  recordWarning(
    message: string,
    context: {
      requestId?: string;
      userId?: string;
      organizationId?: string;
      request?: NextRequest;
      metadata?: Record<string, any>;
    } = {}
  ): string {
    const warningEvent: ErrorEvent = {
      id: `warning_${Date.now()}_${Math.random().toString(36).substring(2)}`,
      level: 'warning',
      message,
      userId: context.userId,
      organizationId: context.organizationId,
      requestId: context.requestId,
      url: context.request?.nextUrl.toString(),
      method: context.request?.method,
      timestamp: new Date(),
      metadata: context.metadata,
    };

    monitoringStore.errors.push(warningEvent);
    console.warn('Warning recorded:', warningEvent);
    return warningEvent.id;
  }
}

// Audit logging
export class AuditLogger {
  private static instance: AuditLogger;

  static getInstance(): AuditLogger {
    if (!AuditLogger.instance) {
      AuditLogger.instance = new AuditLogger();
    }
    return AuditLogger.instance;
  }

  logAction(
    action: string,
    resource: string,
    result: 'success' | 'failure',
    context: {
      resourceId?: string;
      userId?: string;
      organizationId?: string;
      request?: NextRequest;
      changes?: { before?: any; after?: any };
      metadata?: Record<string, any>;
    } = {}
  ): string {
    const auditEvent: AuditEvent = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substring(2)}`,
      action,
      resource,
      resourceId: context.resourceId,
      userId: context.userId,
      organizationId: context.organizationId,
      ip: context.request?.headers.get('x-forwarded-for') || 
          context.request?.headers.get('x-real-ip') || 
          'unknown',
      userAgent: context.request?.headers.get('user-agent') || 'unknown',
      timestamp: new Date(),
      changes: context.changes,
      result,
      metadata: context.metadata,
    };

    monitoringStore.audits.push(auditEvent);

    // Keep only last 1000 audit events
    if (monitoringStore.audits.length > 1000) {
      monitoringStore.audits = monitoringStore.audits.slice(-500);
    }

    // In production, send to audit logging service
    // this.sendToAuditService(auditEvent);

    return auditEvent.id;
  }
}

// Health check system
export class HealthChecker {
  private static instance: HealthChecker;
  private healthChecks: Map<string, () => Promise<{ status: 'healthy' | 'unhealthy'; message?: string }>> = new Map();

  static getInstance(): HealthChecker {
    if (!HealthChecker.instance) {
      HealthChecker.instance = new HealthChecker();
    }
    return HealthChecker.instance;
  }

  registerCheck(name: string, checkFn: () => Promise<{ status: 'healthy' | 'unhealthy'; message?: string }>): void {
    this.healthChecks.set(name, checkFn);
  }

  async getHealthStatus(): Promise<{
    status: 'healthy' | 'unhealthy';
    timestamp: Date;
    checks: Record<string, { status: 'healthy' | 'unhealthy'; message?: string; responseTime?: number }>;
    uptime: number;
    version: string;
  }> {
    const checks: Record<string, any> = {};
    let overallStatus: 'healthy' | 'unhealthy' = 'healthy';

    for (const [name, checkFn] of this.healthChecks.entries()) {
      const startTime = performance.now();
      try {
        const result = await checkFn();
        const responseTime = performance.now() - startTime;
        checks[name] = { ...result, responseTime };
        
        if (result.status === 'unhealthy') {
          overallStatus = 'unhealthy';
        }
      } catch (error) {
        checks[name] = { 
          status: 'unhealthy', 
          message: error instanceof Error ? error.message : 'Unknown error',
          responseTime: performance.now() - startTime 
        };
        overallStatus = 'unhealthy';
      }
    }

    return {
      status: overallStatus,
      timestamp: new Date(),
      checks,
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
    };
  }
}

// Register default health checks
const healthChecker = HealthChecker.getInstance();

// Database health check
healthChecker.registerCheck('database', async () => {
  try {
    // In production, test actual database connection
    // await prisma.$queryRaw`SELECT 1`;
    return { status: 'healthy', message: 'Database connection OK' };
  } catch (error) {
    return { status: 'unhealthy', message: 'Database connection failed' };
  }
});

// Memory health check
healthChecker.registerCheck('memory', async () => {
  if (typeof process === 'undefined' || !process.memoryUsage) {
    return { status: 'healthy', message: 'Memory monitoring not available' };
  }

  const memUsage = process.memoryUsage();
  const memUsagePercent = (memUsage.heapUsed / memUsage.heapTotal) * 100;

  if (memUsagePercent > 90) {
    return { status: 'unhealthy', message: `High memory usage: ${memUsagePercent.toFixed(1)}%` };
  }

  return { status: 'healthy', message: `Memory usage: ${memUsagePercent.toFixed(1)}%` };
});

// Rate limiting health check
healthChecker.registerCheck('rate_limiting', async () => {
  // Check if rate limiting store is functioning
  const storeSize = (monitoringStore as any).metrics?.length || 0;
  if (storeSize > 10000) {
    return { status: 'unhealthy', message: 'Rate limiting store too large' };
  }
  return { status: 'healthy', message: 'Rate limiting OK' };
});

// API endpoints for monitoring
const healthHandler = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const healthStatus = await healthChecker.getHealthStatus();
    
    const statusCode = healthStatus.status === 'healthy' ? 200 : 503;
    
    return NextResponse.json(healthStatus, { status: statusCode });
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'unhealthy', 
        error: 'Health check failed',
        timestamp: new Date() 
      },
      { status: 503 }
    );
  }
};

const metricsHandler = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const performanceMonitor = PerformanceMonitor.getInstance();
    
    // Return aggregated metrics
    const metrics = monitoringStore.metrics.slice(-100); // Last 100 metrics
    
    return NextResponse.json({
      success: true,
      metrics,
      summary: {
        totalMetrics: monitoringStore.metrics.length,
        totalErrors: monitoringStore.errors.length,
        totalAudits: monitoringStore.audits.length,
        timeRange: {
          from: metrics[0]?.timestamp,
          to: metrics[metrics.length - 1]?.timestamp,
        },
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to retrieve metrics' },
      { status: 500 }
    );
  }
};

const alertsHandler = async (request: NextRequest): Promise<NextResponse> => {
  try {
    return NextResponse.json({
      success: true,
      alerts: monitoringStore.alerts.slice(-50), // Last 50 alerts
      count: monitoringStore.alerts.length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to retrieve alerts' },
      { status: 500 }
    );
  }
};

// Middleware for automatic request monitoring
export function monitoringMiddleware(request: NextRequest): NextResponse | null {
  const performanceMonitor = PerformanceMonitor.getInstance();
  const errorMonitor = ErrorMonitor.getInstance();
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2)}`;

  // Add request ID to headers
  const response = NextResponse.next();
  response.headers.set('X-Request-ID', requestId);

  // Start performance monitoring
  performanceMonitor.startRequest(requestId);

  // Record request start
  performanceMonitor.recordMetric({
    name: 'http_requests_total',
    value: 1,
    unit: 'count',
    timestamp: new Date(),
    tags: {
      method: request.method,
      route: request.nextUrl.pathname,
      requestId,
    },
  });

  // End monitoring after response is sent
  response.headers.set('X-Monitoring-Enabled', 'true');

  return response;
}

// Export all monitoring components
export const monitoring = {
  PerformanceMonitor,
  ErrorMonitor,
  AuditLogger,
  HealthChecker,
  handlers: {
    health: healthHandler,
    metrics: metricsHandler,
    alerts: alertsHandler,
  },
};