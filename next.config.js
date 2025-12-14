/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['localhost'],
  },
  typescript: {
    // Ignore build errors for production builds
    ignoreBuildErrors: false,
  },
  eslint: {
    // Ignore build errors for production builds
    ignoreDuringBuilds: false,
  },
  // Page extensions to include
  pageExtensions: ['ts', 'tsx'],
}

module.exports = nextConfig