#!/bin/bash
# LIMS SaaS Platform - Backup and Recovery Script
# Generated: 2025-12-14 23:30:58

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
BACKUP_DIR="/workspace/production/backups"
DATE=$(date +%Y%m%d-%H%M%S)
DB_BACKUP_FILE="$BACKUP_DIR/database-backup-$DATE.sql"
VOLUME_BACKUP_FILE="$BACKUP_DIR/volumes-backup-$DATE.tar.gz"
LOG_FILE="$BACKUP_DIR/backup-log-$DATE.txt"

# Create backup directory
mkdir -p "$BACKUP_DIR"

log_message() {
    echo -e "$1" | tee -a "$LOG_FILE"
}

# Function to backup database
backup_database() {
    log_message "${BLUE}📦 Backing up PostgreSQL database...${NC}"
    
    if docker-compose exec -T postgres pg_dump -U lims_user lims_production > "$DB_BACKUP_FILE"; then
        local file_size=$(du -h "$DB_BACKUP_FILE" | cut -f1)
        log_message "${GREEN}✅ Database backup completed: $file_size${NC}"
        return 0
    else
        log_message "${RED}❌ Database backup failed${NC}"
        return 1
    fi
}

# Function to backup Docker volumes
backup_volumes() {
    log_message "${BLUE}📦 Backing up Docker volumes...${NC}"
    
    # Create a temporary container to access volumes
    docker run --rm \
        -v lims-postgres_data:/source:ro \
        -v lims-redis_data:/source2:ro \
        -v prometheus_data:/source3:ro \
        -v grafana_data:/source4:ro \
        -v elasticsearch_data:/source5:ro \
        -v "$BACKUP_DIR":/backup \
        alpine tar czf "/backup/volumes-backup-$DATE.tar.gz" \
        -C /source . \
        -C /source2 . \
        -C /source3 . \
        -C /source4 . \
        -C /source5 .
    
    if [ -f "$VOLUME_BACKUP_FILE" ]; then
        local file_size=$(du -h "$VOLUME_BACKUP_FILE" | cut -f1)
        log_message "${GREEN}✅ Volume backup completed: $file_size${NC}"
        return 0
    else
        log_message "${RED}❌ Volume backup failed${NC}"
        return 1
    fi
}

# Function to backup configuration files
backup_config() {
    log_message "${BLUE}📦 Backing up configuration files...${NC}"
    
    local config_backup="$BACKUP_DIR/config-backup-$DATE.tar.gz"
    
    tar czf "$config_backup" \
        -C /workspace/production \
        .env.production \
        nginx/nginx.conf \
        nginx/ssl \
        database \
        monitoring \
        docker-compose.yml \
        Dockerfile \
        2>/dev/null || true
    
    if [ -f "$config_backup" ]; then
        local file_size=$(du -h "$config_backup" | cut -f1)
        log_message "${GREEN}✅ Configuration backup completed: $file_size${NC}"
        return 0
    else
        log_message "${RED}❌ Configuration backup failed${NC}"
        return 1
    fi
}

# Function to backup logs
backup_logs() {
    log_message "${BLUE}📦 Backing up logs...${NC}"
    
    local logs_backup="$BACKUP_DIR/logs-backup-$DATE.tar.gz"
    
    docker run --rm \
        -v lims-nginx_data:/source:ro \
        -v "$BACKUP_DIR":/backup \
        alpine tar czf "/backup/logs-backup-$DATE.tar.gz" \
        -C /source . \
        2>/dev/null || log_message "${YELLOW}⚠️  No logs volume found or empty${NC}"
}

# Function to create full system backup
create_full_backup() {
    log_message "${BLUE}🚀 Starting full system backup...${NC}"
    log_message "Backup timestamp: $DATE"
    echo ""
    
    # Database backup
    if ! backup_database; then
        log_message "${RED}❌ Backup failed at database step${NC}"
        return 1
    fi
    
    # Configuration backup
    if ! backup_config; then
        log_message "${RED}❌ Backup failed at configuration step${NC}"
        return 1
    fi
    
    # Volume backup (optional - can be large)
    if [ "${BACKUP_VOLUMES:-true}" = "true" ]; then
        backup_volumes
    fi
    
    # Log backup
    backup_logs
    
    echo ""
    log_message "${GREEN}🎉 Full backup completed successfully!${NC}"
    
    # Generate backup summary
    generate_backup_summary
}

# Function to restore database
restore_database() {
    local backup_file=$1
    
    if [ ! -f "$backup_file" ]; then
        log_message "${RED}❌ Backup file not found: $backup_file${NC}"
        return 1
    fi
    
    log_message "${YELLOW}⚠️  Restoring database from: $backup_file${NC}"
    log_message "${YELLOW}⚠️  This will overwrite the current database!${NC}"
    
    read -p "Are you sure you want to continue? (yes/no): " confirm
    if [ "$confirm" != "yes" ]; then
        log_message "${BLUE}Restore cancelled${NC}"
        return 0
    fi
    
    # Stop application to prevent writes
    log_message "${BLUE}🛑 Stopping application...${NC}"
    docker-compose stop lims-app
    
    # Restore database
    if docker-compose exec -T postgres psql -U lims_user -d lims_production < "$backup_file"; then
        log_message "${GREEN}✅ Database restore completed${NC}"
    else
        log_message "${RED}❌ Database restore failed${NC}"
        docker-compose start lims-app
        return 1
    fi
    
    # Restart application
    log_message "${BLUE}🔄 Restarting application...${NC}"
    docker-compose start lims-app
    
    log_message "${GREEN}✅ Database restore completed successfully${NC}"
}

# Function to list backups
list_backups() {
    log_message "${BLUE}📋 Available backups:${NC}"
    echo ""
    
    # Database backups
    log_message "${BLUE}Database Backups:${NC}"
    ls -lah "$BACKUP_DIR"/database-backup-*.sql 2>/dev/null | while read line; do
        log_message "  📄 $line"
    done
    
    echo ""
    
    # Configuration backups
    log_message "${BLUE}Configuration Backups:${NC}"
    ls -lah "$BACKUP_DIR"/config-backup-*.tar.gz 2>/dev/null | while read line; do
        log_message "  📄 $line"
    done
    
    echo ""
    
    # Volume backups
    log_message "${BLUE}Volume Backups:${NC}"
    ls -lah "$BACKUP_DIR"/volumes-backup-*.tar.gz 2>/dev/null | while read line; do
        log_message "  📄 $line"
    done
    
    echo ""
    
    # Log backups
    log_message "${BLUE}Log Backups:${NC}"
    ls -lah "$BACKUP_DIR"/logs-backup-*.tar.gz 2>/dev/null | while read line; do
        log_message "  📄 $line"
    done
}

# Function to clean old backups
clean_old_backups() {
    local days=${1:-30}
    
    log_message "${BLUE}🧹 Cleaning backups older than $days days...${NC}"
    
    local deleted_count=0
    
    # Delete old database backups
    find "$BACKUP_DIR" -name "database-backup-*.sql" -mtime +$days -type f | while read file; do
        rm -f "$file"
        log_message "Deleted: $(basename "$file")"
        ((deleted_count++))
    done
    
    # Delete old configuration backups
    find "$BACKUP_DIR" -name "config-backup-*.tar.gz" -mtime +$days -type f | while read file; do
        rm -f "$file"
        log_message "Deleted: $(basename "$file")"
        ((deleted_count++))
    done
    
    # Delete old volume backups
    find "$BACKUP_DIR" -name "volumes-backup-*.tar.gz" -mtime +$days -type f | while read file; do
        rm -f "$file"
        log_message "Deleted: $(basename "$file")"
        ((deleted_count++))
    done
    
    # Delete old log backups
    find "$BACKUP_DIR" -name "logs-backup-*.tar.gz" -mtime +$days -type f | while read file; do
        rm -f "$file"
        log_message "Deleted: $(basename "$file")"
        ((deleted_count++))
    done
    
    log_message "${GREEN}✅ Cleaned up $deleted_count old backup files${NC}"
}

# Function to generate backup summary
generate_backup_summary() {
    local summary_file="$BACKUP_DIR/backup-summary-$DATE.txt"
    
    cat > "$summary_file" << EOF
# LIMS SaaS Platform - Backup Summary

**Backup Date**: $(date)
**Backup ID**: $DATE

## Backup Files Generated

### Database Backup
- File: $(basename "$DB_BACKUP_FILE")
- Size: $(du -h "$DB_BACKUP_FILE" | cut -f1)
- Location: $DB_BACKUP_FILE

### Configuration Backup
- File: config-backup-$DATE.tar.gz
- Size: $(du -h "$BACKUP_DIR/config-backup-$DATE.tar.gz" 2>/dev/null | cut -f1 || echo "N/A")
- Location: $BACKUP_DIR/config-backup-$DATE.tar.gz

### Volume Backup
- File: volumes-backup-$DATE.tar.gz
- Size: $(du -h "$BACKUP_DIR/volumes-backup-$DATE.tar.gz" 2>/dev/null | cut -f1 || echo "N/A")
- Location: $BACKUP_DIR/volumes-backup-$DATE.tar.gz

## Recovery Instructions

### Database Recovery
\`\`\`bash
# Restore database
./backup.sh restore $DB_BACKUP_FILE
\`\`\`

### Full System Recovery
\`\`\`bash
# 1. Stop all services
docker-compose down

# 2. Restore volumes
docker run --rm -v lims-postgres_data:/target alpine tar xzf /path/to/volumes-backup-$DATE.tar.gz -C /target

# 3. Restore database
./backup.sh restore $DB_BACKUP_FILE

# 4. Start services
docker-compose up -d
\`\`\`

## Backup Storage Location
- Directory: $BACKUP_DIR
- This backup includes:
  - PostgreSQL database dump
  - Docker volume data
  - Configuration files
  - System logs

## Notes
- Keep backups in a secure, off-site location
- Test recovery procedures regularly
- Monitor backup disk space usage
- Consider automated backup rotation

Generated: $(date)
EOF
    
    log_message "${BLUE}📋 Backup summary generated: $summary_file${NC}"
}

# Function to show help
show_help() {
    echo "LIMS SaaS Platform - Backup and Recovery Script"
    echo ""
    echo "Usage: $0 [command] [options]"
    echo ""
    echo "Commands:"
    echo "  backup                 Create full system backup"
    echo "  restore <file>         Restore database from backup file"
    echo "  list                   List all available backups"
    echo "  clean [days]           Clean backups older than specified days (default: 30)"
    echo "  help                   Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 backup                    # Create full backup"
    echo "  $0 restore backup.sql        # Restore database"
    echo "  $0 list                      # List all backups"
    echo "  $0 clean 7                   # Delete backups older than 7 days"
    echo ""
}

# Main execution
case "${1:-help}" in
    "backup")
        create_full_backup
        ;;
    "restore")
        if [ -z "$2" ]; then
            log_message "${RED}❌ Please specify backup file to restore${NC}"
            show_help
            exit 1
        fi
        restore_database "$2"
        ;;
    "list")
        list_backups
        ;;
    "clean")
        clean_old_backups "${2:-30}"
        ;;
    "help"|*)
        show_help
        ;;
esac