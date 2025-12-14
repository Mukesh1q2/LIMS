# LIMS SaaS Platform - Unified Deployment

This repository contains a unified SaaS platform with:
- **Main Application**: Library & Institute Management System (LIMS)
- **Marketing Website**: SaaS product marketing site

## Architecture

```
yourdomain.com (Marketing Website)
└── Built with Next.js, Tailwind CSS
└── Handles marketing, signups, and information

app.yourdomain.com (Main Application)
└── LIMS dashboard with full functionality
└── Student management, fees, library, attendance, etc.
```

## Unified Deployment Setup

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)
- SSL certificates (for production)

### Local Development

1. Start both applications separately:
```bash
# Terminal 1 - Marketing website
cd saas-website
npm run dev

# Terminal 2 - Main application
cd ..
npm run dev
```

### Production Deployment

1. **Environment Setup**
   Create `.env` files for both applications with production variables:
   ```bash
   # Root directory (.env for main app)
   DATABASE_URL=postgresql://user:password@db:5432/lims
   JWT_SECRET=your-jwt-secret
   NEXTAUTH_SECRET=your-nextauth-secret
   ```

2. **Update Domain Configuration**
   Edit `nginx.conf` to use your actual domain names:
   ```nginx
   server_name app.yourdomain.com;  # Main application
   server_name www.yourdomain.com;  # Marketing website
   ```

3. **Obtain SSL Certificates**
   Use Let's Encrypt or your preferred SSL provider:
   ```bash
   sudo certbot --nginx -d app.yourdomain.com -d www.yourdomain.com
   ```

4. **Deploy**
   Run the deployment script:
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

## Folder Structure

```
LIMS/
├── saas-website/          # Marketing website (www.yourdomain.com)
│   ├── app/              # Next.js app directory
│   ├── components/       # React components
│   └── Dockerfile        # Marketing site Dockerfile
├── app/                  # Main LIMS application (app.yourdomain.com)
├── components/           # Shared components
├── docker-compose.yml    # Docker orchestration
├── nginx.conf           # Reverse proxy configuration
├── Dockerfile           # Main app Dockerfile
└── deploy.sh            # Deployment script
```

## Reverse Proxy Configuration

The Nginx configuration in `nginx.conf`:
- Routes `www.yourdomain.com` to the marketing website (port 3000)
- Routes `app.yourdomain.com` to the main application (port 3001)
- Handles SSL termination
- Provides security headers

## Environment Variables

### Main Application (.env)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/lims
JWT_SECRET=your-jwt-secret-here
NEXTAUTH_SECRET=your-nextauth-secret
NEXT_PUBLIC_APP_URL=https://app.yourdomain.com
```

### Marketing Website (saas-website/.env)
```env
NEXT_PUBLIC_APP_URL=https://www.yourdomain.com
NEXT_PUBLIC_API_URL=https://app.yourdomain.com/api
```

## Security Considerations

1. **SSL Certificates**: Required for both domains
2. **Environment Variables**: Store secrets securely
3. **Database Security**: Use strong passwords and restrict access
4. **Rate Limiting**: Implemented in the applications
5. **CORS Policy**: Properly configured for cross-origin requests

## Monitoring & Maintenance

1. **Log Management**: Check Docker logs with `docker-compose logs`
2. **Database Backups**: Set up automated database backups
3. **Health Checks**: Applications include health check endpoints
4. **Performance Monitoring**: Implement performance monitoring tools

## Scaling Considerations

- Use multiple instances behind a load balancer for high traffic
- Implement database read replicas for better performance
- Use CDN for static assets
- Consider microservices architecture for complex features