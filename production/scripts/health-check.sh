#!/bin/bash
# LIMS SaaS Platform - System Health Check Script
# Generated: 2025-12-14 23:30:58

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
HEALTH_FILE="/tmp/lims-health-check-$(date +%Y%m%d-%H%M%S).log"

log_message() {
    echo -e "$1" | tee -a "$HEALTH_FILE"
}

# Function to check if service is running
check_service() {
    local service_name=$1
    local container_name=$2
    
    if docker-compose ps | grep -q "$container_name.*Up"; then
        log_message "${GREEN}✅ $service_name is running${NC}"
        return 0
    else
        log_message "${RED}❌ $service_name is not running${NC}"
        return 1
    fi
}

# Function to check HTTP endpoint
check_http_endpoint() {
    local url=$1
    local service_name=$2
    local timeout=${3:-10}
    
    if curl -f -s --max-time "$timeout" "$url" > /dev/null; then
        log_message "${GREEN}✅ $service_name endpoint is responding${NC}"
        return 0
    else
        log_message "${RED}❌ $service_name endpoint is not responding${NC}"
        return 1
    fi
}

# Function to check database connection
check_database() {
    if docker-compose exec -T postgres pg_isready -U lims_user -d lims_production > /dev/null 2>&1; then
        log_message "${GREEN}✅ Database is accepting connections${NC}"
        
        # Check connection count
        local connections=$(docker-compose exec -T postgres psql -U lims_user -d lims_production -t -c "SELECT count(*) FROM pg_stat_activity;" | tr -d ' ')
        log_message "${BLUE}📊 Active database connections: $connections${NC}"
        
        return 0
    else
        log_message "${RED}❌ Database is not accepting connections${NC}"
        return 1
    fi
}

# Function to check Redis
check_redis() {
    if docker-compose exec -T redis redis-cli ping > /dev/null 2>&1; then
        log_message "${GREEN}✅ Redis is responding${NC}"
        
        # Get Redis info
        local redis_info=$(docker-compose exec -T redis redis-cli info memory | grep used_memory_human | cut -d: -f2 | tr -d '\r')
        log_message "${BLUE}🧠 Redis memory usage: $redis_info${NC}"
        
        return 0
    else
        log_message "${RED}❌ Redis is not responding${NC}"
        return 1
    fi
}

# Function to check disk space
check_disk_space() {
    local usage=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
    
    if [ "$usage" -lt 80 ]; then
        log_message "${GREEN}✅ Disk usage is healthy: ${usage}%${NC}"
    elif [ "$usage" -lt 90 ]; then
        log_message "${YELLOW}⚠️  Disk usage is high: ${usage}%${NC}"
    else
        log_message "${RED}❌ Disk usage is critical: ${usage}%${NC}"
    fi
}

# Function to check memory usage
check_memory() {
    local mem_usage=$(free | grep Mem | awk '{printf "%.1f", $3/$2 * 100.0}')
    
    if (( $(echo "$mem_usage < 80" | bc -l) )); then
        log_message "${GREEN}✅ Memory usage is healthy: ${mem_usage}%${NC}"
    elif (( $(echo "$mem_usage < 90" | bc -l) )); then
        log_message "${YELLOW}⚠️  Memory usage is high: ${mem_usage}%${NC}"
    else
        log_message "${RED}❌ Memory usage is critical: ${mem_usage}%${NC}"
    fi
}

# Function to check SSL certificate
check_ssl_certificate() {
    local domain=${1:-yourlims.com}
    local cert_file="/etc/letsencrypt/live/$domain/fullchain.pem"
    
    if [ -f "$cert_file" ]; then
        local expiry_date=$(openssl x509 -in "$cert_file" -noout -enddate | cut -d= -f2)
        local expiry_timestamp=$(date -d "$expiry_date" +%s)
        local current_timestamp=$(date +%s)
        local days_left=$(( (expiry_timestamp - current_timestamp) / 86400 ))
        
        if [ "$days_left" -gt 30 ]; then
            log_message "${GREEN}✅ SSL certificate is valid ($days_left days left)${NC}"
        elif [ "$days_left" -gt 7 ]; then
            log_message "${YELLOW}⚠️  SSL certificate expires soon ($days_left days left)${NC}"
        else
            log_message "${RED}❌ SSL certificate expires very soon ($days_left days left)${NC}"
        fi
    else
        log_message "${RED}❌ SSL certificate file not found${NC}"
    fi
}

# Function to check Docker containers
check_docker_containers() {
    log_message "${BLUE}🐳 Docker Container Status:${NC}"
    docker-compose ps | tee -a "$HEALTH_FILE"
}

# Function to check recent errors
check_recent_errors() {
    log_message "${BLUE}🔍 Recent Error Check:${NC}"
    
    # Check application logs for errors
    local app_errors=$(docker-compose logs --tail=100 lims-app 2>/dev/null | grep -i error | wc -l)
    if [ "$app_errors" -gt 0 ]; then
        log_message "${YELLOW}⚠️  Found $app_errors error(s) in application logs${NC}"
    else
        log_message "${GREEN}✅ No recent errors in application logs${NC}"
    fi
    
    # Check nginx logs for errors
    local nginx_errors=$(docker-compose logs --tail=100 nginx 2>/dev/null | grep -i error | wc -l)
    if [ "$nginx_errors" -gt 0 ]; then
        log_message "${YELLOW}⚠️  Found $nginx_errors error(s) in nginx logs${NC}"
    else
        log_message "${GREEN}✅ No recent errors in nginx logs${NC}"
    fi
}

# Function to check monitoring services
check_monitoring() {
    log_message "${BLUE}📊 Monitoring Services:${NC}"
    
    # Check Prometheus
    if docker-compose ps | grep -q "prometheus.*Up"; then
        log_message "${GREEN}✅ Prometheus is running${NC}"
    else
        log_message "${RED}❌ Prometheus is not running${NC}"
    fi
    
    # Check Grafana
    if docker-compose ps | grep -q "grafana.*Up"; then
        log_message "${GREEN}✅ Grafana is running${NC}"
    else
        log_message "${RED}❌ Grafana is not running${NC}"
    fi
    
    # Check Elasticsearch
    if docker-compose ps | grep -q "elasticsearch.*Up"; then
        log_message "${GREEN}✅ Elasticsearch is running${NC}"
    else
        log_message "${RED}❌ Elasticsearch is not running${NC}"
    fi
}

# Function to generate summary report
generate_summary() {
    log_message "${BLUE}📋 Health Check Summary:${NC}"
    log_message "Timestamp: $(date)"
    log_message "Report saved to: $HEALTH_FILE"
    
    # Check if all critical services are running
    local all_services_ok=true
    
    if ! check_service "LIMS Application" "lims-app" > /dev/null; then
        all_services_ok=false
    fi
    
    if ! check_service "PostgreSQL Database" "lims-postgres" > /dev/null; then
        all_services_ok=false
    fi
    
    if ! check_service "Redis Cache" "lims-redis" > /dev/null; then
        all_services_ok=false
    fi
    
    if ! check_service "Nginx Proxy" "lims-nginx" > /dev/null; then
        all_services_ok=false
    fi
    
    if [ "$all_services_ok" = true ]; then
        log_message "${GREEN}🎉 All critical services are healthy!${NC}"
    else
        log_message "${RED}⚠️  Some services are not healthy. Check the report above.${NC}"
    fi
}

# Main execution
main() {
    log_message "${BLUE}🚀 LIMS SaaS Platform - System Health Check${NC}"
    log_message "================================================"
    log_message "Timestamp: $(date)"
    echo ""
    
    # Check Docker containers
    check_docker_containers
    echo ""
    
    # Check system resources
    check_disk_space
    check_memory
    echo ""
    
    # Check services
    check_service "LIMS Application" "lims-app"
    check_service "PostgreSQL Database" "lims-postgres"
    check_service "Redis Cache" "lims-redis"
    check_service "Nginx Proxy" "lims-nginx"
    echo ""
    
    # Check connectivity
    check_database
    check_redis
    echo ""
    
    # Check HTTP endpoints
    check_http_endpoint "http://localhost/health" "Health Check"
    check_http_endpoint "https://yourdomain.com" "Main Application" 5
    echo ""
    
    # Check SSL certificate
    check_ssl_certificate "yourdomain.com"
    echo ""
    
    # Check monitoring
    check_monitoring
    echo ""
    
    # Check for errors
    check_recent_errors
    echo ""
    
    # Generate summary
    generate_summary
    
    echo ""
    log_message "${BLUE}Health check completed! Report saved to: $HEALTH_FILE${NC}"
}

# Run the health check
main "$@"