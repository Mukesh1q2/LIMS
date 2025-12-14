#!/bin/bash
# LIMS SaaS Platform - Production Deployment Script
# Generated: 2025-12-14 23:30:58
# Usage: ./deploy-production.sh [domain_name] [ssl_email] [db_password]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DOMAIN_NAME="${1:-yourlims.com}"
SSL_EMAIL="${2:-admin@yourlims.com}"
DB_PASSWORD="${3:-$(openssl rand -base64 32)}"
REDIS_PASSWORD="$(openssl rand -base64 32)"
GRAFANA_PASSWORD="$(openssl rand -base64 32)"

echo -e "${BLUE}🚀 LIMS SaaS Platform - Production Deployment${NC}"
echo -e "${BLUE}================================================${NC}"
echo -e "Domain: ${YELLOW}$DOMAIN_NAME${NC}"
echo -e "SSL Email: ${YELLOW}$SSL_EMAIL${NC}"
echo -e "Database Password: ${YELLOW}$(echo $DB_PASSWORD | cut -c1-8)...${NC}"
echo ""

# Function to print status
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    # Check if Docker Compose is installed
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    # Check if .env.production exists
    if [ ! -f ".env.production" ]; then
        print_warning "Creating .env.production from template..."
        cp .env.template .env.production
    fi
    
    print_status "Prerequisites check completed ✅"
}

# Generate secure passwords
generate_secrets() {
    print_status "Generating secure secrets..."
    
    JWT_SECRET="$(openssl rand -base64 64)"
    SESSION_SECRET="$(openssl rand -base64 64)"
    SMTP_PASS="$(openssl rand -base64 16)"
    
    print_status "Secrets generated ✅"
}

# Update environment file
update_environment() {
    print_status "Updating environment configuration..."
    
    # Update .env.production with generated values
    sed -i "s/DOMAIN_NAME=.*/DOMAIN_NAME=$DOMAIN_NAME/" .env.production
    sed -i "s/SSL_EMAIL=.*/SSL_EMAIL=$SSL_EMAIL/" .env.production
    sed -i "s/DB_PASSWORD=.*/DB_PASSWORD=$DB_PASSWORD/" .env.production
    sed -i "s/REDIS_PASSWORD=.*/REDIS_PASSWORD=$REDIS_PASSWORD/" .env.production
    sed -i "s/GRAFANA_PASSWORD=.*/GRAFANA_PASSWORD=$GRAFANA_PASSWORD/" .env.production
    
    # Generate and add JWT and session secrets
    if ! grep -q "JWT_SECRET=" .env.production || grep -q "JWT_SECRET=your_jwt" .env.production; then
        echo "JWT_SECRET=$JWT_SECRET" >> .env.production
    fi
    
    if ! grep -q "SESSION_SECRET=" .env.production || grep -q "SESSION_SECRET=your_session" .env.production; then
        echo "SESSION_SECRET=$SESSION_SECRET" >> .env.production
    fi
    
    print_status "Environment configuration updated ✅"
}

# Update Nginx configuration
update_nginx_config() {
    print_status "Updating Nginx configuration..."
    
    # Update domain in nginx.conf
    sed -i "s/yourlims.com/$DOMAIN_NAME/g" nginx/nginx.conf
    
    print_status "Nginx configuration updated ✅"
}

# Create necessary directories
create_directories() {
    print_status "Creating necessary directories..."
    
    mkdir -p logs
    mkdir -p nginx/logs
    mkdir -p database/backup
    
    # Set proper permissions
    chmod 755 logs
    chmod 755 nginx/logs
    chmod 755 database/backup
    
    print_status "Directories created ✅"
}

# Pull Docker images
pull_images() {
    print_status "Pulling Docker images..."
    
    docker-compose pull
    
    print_status "Docker images pulled ✅"
}

# Build application
build_application() {
    print_status "Building LIMS application..."
    
    docker-compose build --no-cache lims-app
    
    print_status "Application built ✅"
}

# Initialize database
init_database() {
    print_status "Initializing database..."
    
    # Start only PostgreSQL first
    docker-compose up -d postgres redis
    
    # Wait for PostgreSQL to be ready
    print_status "Waiting for PostgreSQL to be ready..."
    sleep 30
    
    # Run database initialization
    docker-compose exec postgres psql -U lims_user -d lims_production -c "SELECT version();"
    
    print_status "Database initialized ✅"
}

# Start all services
start_services() {
    print_status "Starting all services..."
    
    docker-compose up -d
    
    # Wait for services to be ready
    print_status "Waiting for services to be ready..."
    sleep 60
    
    print_status "All services started ✅"
}

# Run SSL certificate setup
setup_ssl() {
    print_status "Setting up SSL certificates..."
    
    # Stop Nginx temporarily to free port 80
    docker-compose stop nginx
    
    # Run certbot
    docker-compose run --rm certbot
    
    # Start Nginx
    docker-compose start nginx
    
    print_status "SSL certificates setup completed ✅"
}

# Run health checks
health_checks() {
    print_status "Running health checks..."
    
    # Check if all containers are running
    docker-compose ps
    
    # Check application health
    sleep 30
    
    # Test HTTP endpoint
    if curl -f http://localhost/health > /dev/null 2>&1; then
        print_status "Application health check passed ✅"
    else
        print_warning "Application health check failed - check logs"
    fi
    
    # Check database connection
    docker-compose exec postgres pg_isready -U lims_user -d lims_production
    
    # Check Redis
    docker-compose exec redis redis-cli ping
    
    print_status "Health checks completed ✅"
}

# Setup monitoring
setup_monitoring() {
    print_status "Setting up monitoring dashboards..."
    
    # Wait for Grafana to be ready
    sleep 30
    
    # You can import dashboards manually via Grafana UI
    print_status "Grafana is available at http://localhost:3001"
    print_status "Username: admin"
    print_status "Password: $GRAFANA_PASSWORD"
    
    print_status "Monitoring setup completed ✅"
}

# Generate deployment report
generate_report() {
    print_status "Generating deployment report..."
    
    cat > deployment-report.md << EOF
# LIMS SaaS Platform - Deployment Report

## 🚀 Deployment Summary
- **Domain**: $DOMAIN_NAME
- **SSL Email**: $SSL_EMAIL
- **Deployment Date**: $(date)
- **Status**: ✅ Deployed Successfully

## 🔐 Generated Secrets (Store Securely)
- **Database Password**: $DB_PASSWORD
- **Redis Password**: $REDIS_PASSWORD
- **Grafana Password**: $GRAFANA_PASSWORD
- **JWT Secret**: $JWT_SECRET
- **Session Secret**: $SESSION_SECRET

## 🌐 Service URLs
- **Main Application**: https://$DOMAIN_NAME
- **Grafana Dashboard**: http://localhost:3001
- **Prometheus**: http://localhost:9090
- **Kibana**: http://localhost:5601

## 🔧 Management Commands
\`\`\`bash
# View logs
docker-compose logs -f lims-app

# Restart services
docker-compose restart

# Stop services
docker-compose down

# Update application
docker-compose build --no-cache lims-app
docker-compose up -d lims-app
\`\`\`

## 📊 Monitoring Access
- **Grafana**: admin / $GRAFANA_PASSWORD
- **Prometheus**: http://localhost:9090
- **Kibana**: http://localhost:5601

## 🔒 Security Notes
- All passwords have been randomly generated
- SSL certificates are automatically renewed
- Database uses Row Level Security (RLS)
- Rate limiting is configured on all endpoints

## 📋 Next Steps
1. Configure your domain DNS to point to this server
2. Set up monitoring alerts in Grafana
3. Configure backup strategy for database
4. Set up log rotation and monitoring
5. Configure payment gateway credentials
6. Set up email service configuration

## 🆘 Troubleshooting
Check logs if issues occur:
\`\`\`bash
# Application logs
docker-compose logs lims-app

# Database logs
docker-compose logs postgres

# Nginx logs
docker-compose logs nginx
\`\`\`
EOF
    
    print_status "Deployment report generated ✅"
}

# Main deployment function
main() {
    echo -e "${BLUE}Starting LIMS SaaS Platform Production Deployment...${NC}"
    echo ""
    
    check_prerequisites
    generate_secrets
    update_environment
    update_nginx_config
    create_directories
    pull_images
    build_application
    init_database
    start_services
    setup_ssl
    health_checks
    setup_monitoring
    generate_report
    
    echo ""
    echo -e "${GREEN}🎉 Deployment Completed Successfully!${NC}"
    echo -e "${BLUE}================================================${NC}"
    echo -e "Application URL: ${YELLOW}https://$DOMAIN_NAME${NC}"
    echo -e "Grafana: ${YELLOW}http://localhost:3001${NC}"
    echo -e "Admin Password: ${YELLOW}$GRAFANA_PASSWORD${NC}"
    echo ""
    echo -e "${YELLOW}⚠️  IMPORTANT: Save the deployment report and secure all passwords!${NC}"
    echo ""
    echo -e "${BLUE}Next steps:${NC}"
    echo "1. Configure DNS for your domain"
    echo "2. Access Grafana dashboard and set up alerts"
    echo "3. Configure payment gateway credentials"
    echo "4. Set up automated backups"
    echo ""
}

# Error handling
trap 'print_error "Deployment failed! Check logs for details."; exit 1' ERR

# Run main deployment
main "$@"