/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  
  // Security configurations
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Security headers
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'off',
          },
          {
            key: 'X-Download-Options',
            value: 'noopen',
          },
          {
            key: 'X-Permitted-Cross-Domain-Policies',
            value: 'none',
          },
          // Content Security Policy
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https: blob:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://www.google-analytics.com; frame-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self';",
          },
        ],
      },
      // API routes specific headers
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.NODE_ENV === 'development' ? '*' : 'https://lims.com',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, X-CSRF-Token, X-Request-ID',
          },
        ],
      },
      // Static files caching
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Image optimization
      {
        source: '/_next/image(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Monitoring endpoints (no cache)
      {
        source: '/api/monitoring/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate',
          },
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow',
          },
        ],
      },
    ];
  },
  
  // Image optimization
  images: {
    domains: ['localhost', 'lims.com', 'via.placeholder.com'],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Compression
  compress: true,
  
  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Bundle analyzer in development
    if (dev && process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'server',
          analyzerPort: 8888,
          openAnalyzer: true,
        })
      );
    }
    
    // Optimize bundle size
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              priority: 10,
            },
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 5,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }
    
    // Security: Prevent exposure of sensitive information
    if (!dev) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'fs': false,
        'net': false,
        'tls': false,
      };
    }
    
    // Add environment variables to build
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.BUILD_TIME': JSON.stringify(new Date().toISOString()),
        'process.env.BUILD_SHA': JSON.stringify(process.env.VERCEL_GIT_COMMIT_SHA || 'unknown'),
      })
    );
    
    return config;
  },
  
  // Environment variables validation
  env: {
    NODE_ENV: process.env.NODE_ENV,
  },
  
  // Redirects for SEO
  async redirects() {
    return [
      {
        source: '/contact',
        destination: '/#contact',
        permanent: true,
      },
      {
        source: '/pricing',
        destination: '/#pricing',
        permanent: true,
      },
      {
        source: '/features',
        destination: '/#features',
        permanent: true,
      },
      {
        source: '/login',
        destination: '/auth/login',
        permanent: true,
      },
      {
        source: '/signup',
        destination: '/auth/register',
        permanent: true,
      },
    ];
  },
  
  // Rewrites for clean URLs
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/sitemap.xml',
      },
      {
        source: '/robots.txt',
        destination: '/robots.txt',
      },
      {
        source: '/health',
        destination: '/api/monitoring/health',
      },
      {
        source: '/status',
        destination: '/api/monitoring/status',
      },
      // API versioning
      {
        source: '/api/v1/(.*)',
        destination: '/api/$1',
      },
      // Admin routes protection
      {
        source: '/admin/(.*)',
        destination: '/api/auth/verify', // This would be handled by middleware
        has: [
          {
            type: 'header',
            key: 'authorization',
          },
        ],
      },
    ];
  },
  
  // Trailing slash configuration
  trailingSlash: false,
  
  // PoweredBy header
  poweredByHeader: false,
  
  // Output configuration
  output: 'standalone',
  
  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: false,
    dirs: ['pages', 'utils'],
  },
  
  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // Generate a static export if needed (for CDN deployment)
  // output: 'export',
  
  // Static page generation
  experimental: {
    outputFileTracingIncludes: {
      '/app/*': ['./public/*'],
    },
    serverActions: true,
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  
  // SWC optimizations
  swcMinify: true,
  
  // Experimental features
  experimental: {
    ...nextConfig.experimental,
    ppr: true, // Partial Prerendering (experimental)
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  
  // Server components configuration
  experimental: {
    ...nextConfig.experimental,
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs', 'jsonwebtoken'],
  },
  
  // Headers for specific routes
  async redirects() {
    return [
      ...nextConfig.redirects,
      // Security redirects
      {
        source: '/.well-known/security.txt',
        destination: '/security.txt',
        permanent: false,
      },
      {
        source: '/.well-known/change-password',
        destination: '/auth/change-password',
        permanent: false,
      },
    ];
  },
  
  // Generate security.txt
  async generateBuildId() {
    return process.env.VERCEL_GIT_COMMIT_SHA || 'development-build';
  },
  
  // Disable server actions in edge runtime for security
  experimental: {
    ...nextConfig.experimental,
    serverComponentsExternalPackages: [
      ...(nextConfig.experimental.serverComponentsExternalPackages || []),
      'bcryptjs',
      'jsonwebtoken',
      'nodemailer',
    ],
  },
};

module.exports = nextConfig;