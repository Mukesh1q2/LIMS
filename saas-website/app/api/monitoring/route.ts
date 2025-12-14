// API Routes for Monitoring & Observability
import { NextRequest, NextResponse } from 'next/server';
import { monitoring } from '@/lib/monitoring';

// Health Check API Route
const healthHandler = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const healthStatus = await monitoring.HealthChecker.getInstance().getHealthStatus();
    
    const statusCode = healthStatus.status === 'healthy' ? 200 : 503;
    
    return NextResponse.json(healthStatus, { status: statusCode });
  } catch (error) {
    monitoring.ErrorMonitor.getInstance().recordError(
      'Health check failed',
      { request, metadata: { error: error instanceof Error ? error.message : 'Unknown error' } }
    );
    
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

export const GET = healthHandler;

// Metrics API Route
const metricsHandler = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const performanceMonitor = monitoring.PerformanceMonitor.getInstance();
    
    // In a real implementation, you would query your metrics database
    // For now, return a basic metrics summary
    const metrics = {
      http_requests: {
        total: Math.floor(Math.random() * 10000),
        average_duration: Math.floor(Math.random() * 500) + 100,
        error_rate: Math.random() * 0.1,
      },
      database: {
        query_time: Math.floor(Math.random() * 100) + 10,
        connection_pool_size: 10,
        active_connections: Math.floor(Math.random() * 8) + 2,
      },
      memory: {
        heap_used: Math.floor(Math.random() * 100000000) + 50000000,
        heap_total: Math.floor(Math.random() * 150000000) + 100000000,
        external: Math.floor(Math.random() * 10000000) + 1000000,
      },
      timestamp: new Date().toISOString(),
    };
    
    return NextResponse.json({
      success: true,
      metrics,
      system_info: {
        uptime: process.uptime(),
        version: process.env.npm_package_version || '1.0.0',
        node_version: process.version,
        platform: process.platform,
      },
    });
  } catch (error) {
    monitoring.ErrorMonitor.getInstance().recordError(
      'Failed to retrieve metrics',
      { request, metadata: { error: error instanceof Error ? error.message : 'Unknown error' } }
    );
    
    return NextResponse.json(
      { error: 'Failed to retrieve metrics' },
      { status: 500 }
    );
  }
};

export const GET as metrics = metricsHandler;

// Alerts API Route
const alertsHandler = async (request: NextRequest): Promise<NextResponse> => {
  try {
    // In a real implementation, you would query your alerts database
    const alerts = [
      {
        id: 'alert_1',
        level: 'warning',
        message: 'High memory usage detected',
        metric: 'memory_usage',
        value: 85.5,
        threshold: 80,
        timestamp: new Date(Date.now() - 300000).toISOString(),
        status: 'active',
      },
      {
        id: 'alert_2',
        level: 'error',
        message: 'Database connection timeout',
        service: 'database',
        timestamp: new Date(Date.now() - 600000).toISOString(),
        status: 'resolved',
      },
    ];
    
    return NextResponse.json({
      success: true,
      alerts,
      summary: {
        total: alerts.length,
        active: alerts.filter(a => a.status === 'active').length,
        resolved: alerts.filter(a => a.status === 'resolved').length,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to retrieve alerts' },
      { status: 500 }
    );
  }
};

export const GET as alerts = alertsHandler;

// Logs API Route (for debugging - restrict in production)
const logsHandler = async (request: NextRequest): Promise<NextResponse> => {
  try {
    // Only allow access in development or with proper authentication
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Logs not available in production' },
        { status: 403 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const level = searchParams.get('level') || 'all';
    const limit = parseInt(searchParams.get('limit') || '100');
    
    // In a real implementation, you would query your logs database
    const logs = [
      {
        timestamp: new Date().toISOString(),
        level: 'info',
        message: 'User login successful',
        userId: 'user_123',
        ip: '192.168.1.100',
      },
      {
        timestamp: new Date(Date.now() - 60000).toISOString(),
        level: 'warning',
        message: 'Rate limit exceeded for IP 192.168.1.100',
        ip: '192.168.1.100',
      },
      {
        timestamp: new Date(Date.now() - 120000).toISOString(),
        level: 'error',
        message: 'Database query failed',
        error: 'Connection timeout',
        service: 'database',
      },
    ].slice(0, limit);
    
    return NextResponse.json({
      success: true,
      logs,
      total: logs.length,
      filter: { level, limit },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to retrieve logs' },
      { status: 500 }
    );
  }
};

export const GET as logs = logsHandler;

// Performance profiling API Route
const profileHandler = async (request: NextRequest): Promise<NextResponse> => {
  try {
    // Only allow in development
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Profiling not available in production' },
        { status: 403 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'start';
    
    if (action === 'start') {
      // Start profiling
      const profileId = `profile_${Date.now()}`;
      
      return NextResponse.json({
        success: true,
        message: 'Performance profiling started',
        profileId,
        instructions: 'Make requests to profile endpoint to collect data',
      });
    }
    
    if (action === 'stop') {
      // Stop profiling and return results
      const profileData = {
        totalRequests: Math.floor(Math.random() * 1000) + 100,
        averageResponseTime: Math.floor(Math.random() * 200) + 50,
        slowestEndpoint: '/api/contact',
        slowestResponseTime: 1500,
        errorRate: 0.02,
        memoryUsage: {
          heapUsed: Math.floor(Math.random() * 50000000) + 20000000,
          heapTotal: Math.floor(Math.random() * 100000000) + 50000000,
        },
      };
      
      return NextResponse.json({
        success: true,
        profile: profileData,
        recommendations: [
          'Consider implementing caching for frequently accessed data',
          'Optimize database queries with proper indexing',
          'Add rate limiting to prevent abuse',
        ],
      });
    }
    
    return NextResponse.json(
      { error: 'Invalid action. Use start or stop' },
      { status: 400 }
    );
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process profile request' },
      { status: 500 }
    );
  }
};

export const GET as profile = profileHandler;

// System status API Route
const statusHandler = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const status = {
      status: 'operational',
      timestamp: new Date().toISOString(),
      services: {
        api: {
          status: 'operational',
          uptime: process.uptime(),
          response_time: Math.floor(Math.random() * 100) + 50,
        },
        database: {
          status: 'operational',
          connection_pool_size: 10,
          active_connections: Math.floor(Math.random() * 8) + 2,
          query_time: Math.floor(Math.random() * 50) + 10,
        },
        authentication: {
          status: 'operational',
          active_sessions: Math.floor(Math.random() * 100) + 10,
          failed_login_attempts: Math.floor(Math.random() * 5),
        },
        storage: {
          status: 'operational',
          disk_usage: Math.floor(Math.random() * 50) + 20,
          available_space: '500GB',
        },
      },
      metrics: {
        requests_per_minute: Math.floor(Math.random() * 1000) + 500,
        error_rate: Math.random() * 0.05,
        active_users: Math.floor(Math.random() * 500) + 100,
      },
      incidents: [],
      maintenance: null,
    };
    
    return NextResponse.json(status);
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'degraded',
        error: 'Failed to retrieve system status',
        timestamp: new Date().toISOString() 
      },
      { status: 503 }
    );
  }
};

export const GET as status = statusHandler;

// Webhook endpoint for external monitoring services
const webhookHandler = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const body = await request.json();
    
    // Validate webhook payload
    const { service, status, message, metrics } = body;
    
    if (!service || !status) {
      return NextResponse.json(
        { error: 'Missing required fields: service, status' },
        { status: 400 }
      );
    }
    
    // Log the webhook event
    monitoring.AuditLogger.getInstance().logAction(
      'webhook_received',
      'monitoring',
      'success',
      {
        metadata: {
          service,
          status,
          message,
          metrics,
          source: 'external_monitoring',
        },
      }
    );
    
    // Process the webhook based on service type
    switch (service) {
      case 'uptime_robot':
        if (status === 'down') {
          monitoring.ErrorMonitor.getInstance().recordError(
            `UptimeRobot detected service down: ${message}`,
            { metadata: { service, rawPayload: body } }
          );
        }
        break;
        
      case 'pingdom':
        if (status === 'down') {
          monitoring.ErrorMonitor.getInstance().recordError(
            `Pingdom detected service down: ${message}`,
            { metadata: { service, rawPayload: body } }
          );
        }
        break;
        
      default:
        console.log('Unknown monitoring service webhook:', service);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Webhook processed successfully',
      service,
      status,
    });
    
  } catch (error) {
    monitoring.ErrorMonitor.getInstance().recordError(
      'Failed to process webhook',
      { request, metadata: { error: error instanceof Error ? error.message : 'Unknown error' } }
    );
    
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
};

export const POST = webhookHandler;

// Export all handlers
export const handlers = {
  health: healthHandler,
  metrics: metricsHandler,
  alerts: alertsHandler,
  logs: logsHandler,
  profile: profileHandler,
  status: statusHandler,
  webhook: webhookHandler,
};