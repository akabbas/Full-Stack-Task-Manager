# Deployment Guide

This document provides instructions for deploying the Task Manager application to various environments.

## Prerequisites

Before deploying, ensure you have:

- A server with Node.js and PostgreSQL installed
- Domain name (for production)
- SSL certificate (for HTTPS)
- Deployment platform account (if using a platform)

## Deployment Options

### 1. Traditional Server Deployment

#### Server Requirements

- Ubuntu 20.04 LTS or higher
- Node.js v14 or higher
- PostgreSQL v12 or higher
- Nginx
- PM2 (for process management)

#### Setup Steps

1. **Server Preparation**

   ```bash
   # Update system
   sudo apt update
   sudo apt upgrade

   # Install required packages
   sudo apt install nginx postgresql postgresql-contrib
   ```

2. **Database Setup**

   ```bash
   # Create database and user
   sudo -u postgres psql
   CREATE DATABASE taskmanager;
   CREATE USER deploy_user WITH PASSWORD 'secure_password';
   GRANT ALL PRIVILEGES ON DATABASE taskmanager TO deploy_user;
   ```

3. **Application Setup**

   ```bash
   # Clone repository
   git clone https://github.com/yourusername/task-manager.git
   cd task-manager

   # Install dependencies
   cd server
   npm install --production
   cd ../client
   npm install --production
   npm run build
   ```

4. **Environment Configuration**

   Create `.env` files with production values:

   ```bash
   # server/.env
   PORT=5000
   NODE_ENV=production
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=taskmanager
   DB_USER=deploy_user
   DB_PASSWORD=secure_password
   JWT_SECRET=production_secret
   CLIENT_URL=https://your-domain.com
   ```

5. **Nginx Configuration**

   ```nginx
   # /etc/nginx/sites-available/task-manager
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           root /path/to/client/build;
           try_files $uri $uri/ /index.html;
       }

       location /api {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

6. **SSL Configuration**

   ```bash
   # Install Certbot
   sudo apt install certbot python3-certbot-nginx

   # Obtain SSL certificate
   sudo certbot --nginx -d your-domain.com
   ```

7. **Process Management**

   ```bash
   # Install PM2
   npm install -g pm2

   # Start application
   cd server
   pm2 start npm --name "task-manager" -- start
   ```

### 2. Docker Deployment

1. **Build Docker Images**

   ```bash
   # Build backend image
   cd server
   docker build -t task-manager-server .

   # Build frontend image
   cd ../client
   docker build -t task-manager-client .
   ```

2. **Docker Compose**

   Create `docker-compose.yml`:

   ```yaml
   version: '3'
   services:
     db:
       image: postgres:12
       environment:
         POSTGRES_DB: taskmanager
         POSTGRES_USER: deploy_user
         POSTGRES_PASSWORD: secure_password
       volumes:
         - postgres_data:/var/lib/postgresql/data

     server:
       image: task-manager-server
       environment:
         - NODE_ENV=production
         - DB_HOST=db
         - DB_PORT=5432
         - DB_NAME=taskmanager
         - DB_USER=deploy_user
         - DB_PASSWORD=secure_password
       depends_on:
         - db

     client:
       image: task-manager-client
       ports:
         - "80:80"
       depends_on:
         - server

   volumes:
     postgres_data:
   ```

3. **Deploy with Docker Compose**

   ```bash
   docker-compose up -d
   ```

### 3. Platform as a Service (PaaS)

#### Heroku Deployment

1. **Install Heroku CLI**

   ```bash
   curl https://cli-assets.heroku.com/install.sh | sh
   ```

2. **Login to Heroku**

   ```bash
   heroku login
   ```

3. **Create Heroku App**

   ```bash
   heroku create your-app-name
   ```

4. **Add PostgreSQL**

   ```bash
   heroku addons:create heroku-postgresql:hobby-dev
   ```

5. **Configure Environment Variables**

   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=your_secret
   ```

6. **Deploy Application**

   ```bash
   git push heroku main
   ```

## Post-Deployment Tasks

1. **Database Migrations**

   ```bash
   # For traditional deployment
   cd server
   npm run migrate

   # For Docker
   docker-compose exec server npm run migrate

   # For Heroku
   heroku run npm run migrate
   ```

2. **SSL Certificate Renewal**

   ```bash
   # Set up automatic renewal
   sudo certbot renew --dry-run
   ```

3. **Monitoring Setup**

   - Set up error tracking (e.g., Sentry)
   - Configure logging
   - Set up performance monitoring

## Backup Strategy

1. **Database Backups**

   ```bash
   # Create backup
   pg_dump -U deploy_user taskmanager > backup.sql

   # Restore from backup
   psql -U deploy_user taskmanager < backup.sql
   ```

2. **Automated Backups**

   Set up cron job for regular backups:

   ```bash
   # Add to crontab
   0 0 * * * pg_dump -U deploy_user taskmanager > /backups/taskmanager_$(date +\%Y\%m\%d).sql
   ```

## Scaling Considerations

1. **Horizontal Scaling**
   - Use load balancer
   - Implement session management
   - Configure database replication

2. **Vertical Scaling**
   - Optimize database queries
   - Implement caching
   - Use CDN for static assets

## Security Checklist

- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] Rate limiting implemented
- [ ] Input validation in place
- [ ] Regular security updates
- [ ] Backup strategy implemented
- [ ] Monitoring and alerting set up

## Maintenance

1. **Regular Updates**

   ```bash
   # Update dependencies
   npm update

   # Update system packages
   sudo apt update
   sudo apt upgrade
   ```

2. **Log Rotation**

   Configure log rotation in `/etc/logrotate.d/`:

   ```
   /var/log/task-manager/*.log {
       daily
       missingok
       rotate 14
       compress
       delaycompress
       notifempty
       create 0640 www-data www-data
   }
   ```

## Troubleshooting

See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for common deployment issues and solutions. 