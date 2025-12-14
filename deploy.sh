#!/bin/bash

# Unified Deployment Script for LIMS SaaS Platform
# This script builds and deploys both the marketing website and main application

set -e  # Exit on any error

echo "🚀 Starting unified deployment for LIMS SaaS Platform..."

# Check if Docker is installed
if ! [ -x "$(command -v docker)" ]; then
  echo "❌ Docker is not installed. Please install Docker before proceeding."
  exit 1
fi

# Check if Docker Compose is installed
if ! [ -x "$(command -v docker-compose)" ]; then
  echo "❌ Docker Compose is not installed. Please install Docker Compose before proceeding."
  exit 1
fi

echo "✅ Docker and Docker Compose are available"

# Build and deploy both applications
echo "📦 Building marketing website..."
cd saas-website
npm install
npm run build
cd ..

echo "📦 Building main LIMS application..."
npm install
npm run build

echo "🐳 Building Docker images..."
docker-compose build

echo "🚀 Starting services..."
docker-compose up -d

echo "✅ Unified deployment completed successfully!"
echo ""
echo "Applications are now running:"
echo "  - Marketing Website: http://localhost:3000"
echo "  - Main Application:  http://localhost:3001"
echo ""
echo "For production deployment, update nginx.conf with your domain names and SSL certificates."

# Wait a few seconds for services to start
sleep 5

# Check if services are running
echo "🔍 Checking service status..."
docker-compose ps

echo ""
echo "📋 Deployment checklist:"
echo "  1. Update nginx.conf with your domain names"
echo "  2. Obtain SSL certificates for your domains"
echo "  3. Update .env files with production environment variables"
echo "  4. Set up automated backup for the database"
echo "  5. Configure monitoring and alerting"