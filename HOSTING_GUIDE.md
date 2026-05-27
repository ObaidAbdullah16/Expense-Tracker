# 💰 Expense Tracker Hosting Guide: Complete AWS Deployment Options

Complete end-to-end guide covering ALL deployment methods for hosting the Expense Tracker application on AWS: Docker + EC2, Node.js + PM2, and managed alternatives.

---

## 📋 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Deployment Options Comparison](#deployment-options-comparison)
3. [Prerequisites](#prerequisites)
4. **OPTION A:** [Docker + EC2 Deployment](#option-a-docker--ec2-deployment)
5. **OPTION B:** [Node.js + PM2 Deployment](#option-b-nodejs--pm2-deployment)
6. **OPTION C:** [AWS Elastic Beanstalk Deployment](#option-c-aws-elastic-beanstalk-deployment)
7. [DNS Configuration](#dns-configuration)
8. [SSL Certificate Setup](#ssl-certificate-setup)
9. [Monitoring & Maintenance](#monitoring--maintenance)
10. [Cost Analysis](#cost-analysis)
11. [Troubleshooting](#troubleshooting)

---

## 🏗️ Architecture Overview

```
YOUR ACTUAL SETUP:
┌──────────────────────────────────────────────────────────────┐
│                    User Browser                               │
│              (expense.obaidinfo.xyz)                          │
└─────────────────────┬──────────────────────────────────────┘
                      │
                      ↓
          ┌────────────────────────┐
          │    Route 53 DNS        │
          │  (Domain Resolution)   │
          └────────┬───────────────┘
                   │
                   ↓
      ┌────────────────────────────────┐
      │  AWS Certificate Manager       │
      │  (SSL/TLS - HTTPS)             │
      └────────┬───────────────────────┘
               │
               ↓
      ┌────────────────────────────────┐
      │    Security Group              │
      │  (Port 80, 443, 22, 3000)      │
      └────────┬───────────────────────┘
               │
               ↓
      ┌────────────────────────────────┐
      │   EC2 Instance (t2.micro)      │
      │   Ubuntu 22.04 OS              │
      │                                │
      │   OPTION A: Docker             │
      │   ├─ Docker Engine             │
      │   ├─ Docker Compose            │
      │   ├─ Nginx Container           │
      │   ├─ Node.js Container         │
      │   └─ PostgreSQL Container      │
      │                                │
      │   OPTION B: Direct Node.js     │
      │   ├─ Node.js 18.x              │
      │   ├─ PM2 Process Manager       │
      │   ├─ Nginx (Reverse Proxy)     │
      │   └─ PostgreSQL (native)       │
      │                                │
      │   OPTION C: Elastic Beanstalk  │
      │   └─ Managed by AWS            │
      │                                │
      └────────────────────────────────┘

Data Flow:
User → Route 53 → Security Group → EC2 → Container/App → PostgreSQL
```

---

## 📊 Deployment Options Comparison

| Aspect | Docker + EC2 | Node.js + PM2 | Elastic Beanstalk |
|--------|--------------|---------------|-------------------|
| **Complexity** | Medium | Medium | Easy |
| **Control** | Full | Full | Limited |
| **Scalability** | Manual | Manual | Auto-scaling |
| **Cost (Free Tier)** | $0/month* | $0/month* | $0/month* |
| **Cost (After)** | $7-15/mo | $7-15/mo | $15-30/mo |
| **Learning Curve** | Steep | Medium | Easy |
| **Production Ready** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Container Support** | ✅ Native | ❌ No | ✅ Yes |
| **Auto-Deploy from Git** | ⚠️ Manual | ⚠️ Manual | ✅ Yes |
| **Database Management** | ✅ Full | ✅ Full | ⚠️ Limited |
| **CI/CD Integration** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Disaster Recovery** | ⚠️ Manual | ⚠️ Manual | ✅ Auto |

**YOUR ACTUAL SETUP:** Docker + EC2 (Most flexible, best for learning)

---

## 🛠️ Services Used & Why

### Core AWS Services (All Options)

#### 1. **AWS EC2** (Elastic Compute Cloud)
**What it does:**
- Virtual machine running on AWS infrastructure
- Hosts your application (in container or directly)
- Full OS control for configuration

**Why use it:**
- ✅ **t2.micro FREE TIER**: 750 hours/month (12 months)
- ✅ **Full Control**: Install any software needed
- ✅ **Flexible**: Works with Docker, Node.js, or Beanstalk
- ✅ **Cost**: ~$7-15/month after free tier
- ✅ **Persistent**: Data survives reboots

**Instance Specs:**
```
Type:             t2.micro
vCPU:             1 vCPU
Memory:           1 GB RAM
EBS Storage:      20-30 GB
Network:          Up to 5 Gbps
Cost (free tier): $0/month
Cost (after):     ~$7-15/month
```

#### 2. **PostgreSQL** (Relational Database)
**What it does:**
- Stores all expense data permanently
- Manages transactions with ACID compliance
- Provides SQL querying capabilities

**Why use it:**
- ✅ **Free & Open Source** - No licensing
- ✅ **ACID Compliant** - Data integrity guaranteed
- ✅ **Reliable** - Used by millions in production
- ✅ **Scalable** - Handles high transaction volumes
- ✅ **Advanced Features** - Indexes, replication, JSON support

**Deployment Options:**
1. **Local on EC2** (Docker or Native)
   - Cost: Included in EC2
   - Pros: Simple, cheap, full control
   - Cons: Manual backups, no redundancy
   
2. **AWS RDS** (Managed PostgreSQL)
   - Cost: $15-100+/month
   - Pros: Automatic backups, scaling, monitoring
   - Cons: More expensive, less control

**This guide uses:** Local PostgreSQL on EC2 (within Docker or native)

#### 3. **Route 53** (DNS Management)
**What it does:**
- Maps expense.obaidinfo.xyz domain to EC2 IP
- Provides DNS failover and health checks
- Routes traffic to correct server

**Why use it:**
- ✅ **AWS Integration** - Single console management
- ✅ **Health Checks** - Monitor instance availability
- ✅ **Low Latency** - Global DNS infrastructure
- ✅ **Reliability** - 100% uptime SLA
- ✅ **Cost**: $0.50/month (shared with portfolio)

#### 4. **Security Group** (Firewall)
**What it does:**
- Controls which ports are accessible
- Filters inbound/outbound traffic
- Acts as first-layer security

**Why use it:**
- ✅ **Port 80 (HTTP)** - Public HTTP access
- ✅ **Port 443 (HTTPS)** - Public HTTPS access
- ✅ **Port 22 (SSH)** - Admin SSH (restricted to your IP)
- ✅ **Port 3000** - App port (internal only)
- ✅ **Port 5432** - Database (internal only)
- ✅ **Free** - No additional cost

---

### Option-Specific Services

#### **OPTION A: Docker**

**Docker What it does:**
- Containerizes your entire application
- Ensures same environment everywhere (dev → production)
- Easy rollback and deployment

**Why use Docker:**
- ✅ **Consistency** - "Works on my machine" problem solved
- ✅ **Isolation** - App, Nginx, DB each in separate container
- ✅ **Scalability** - Easy to deploy multiple containers
- ✅ **Microservices** - Ready for container orchestration
- ✅ **Version Control** - Git-track your infrastructure
- ✅ **Fast Deployment** - New containers start in seconds
- ✅ **Easy Rollback** - Switch to previous image instantly
- ✅ **Free & Open Source**

**Docker Compose:**
- Defines multi-container setup in YAML
- Single command starts all services
- Network communication between containers
- Volume management for persistent data

**Your Setup:**
```yaml
version: '3.8'
services:
  nginx:
    - Reverse proxy (port 80/443)
    - Forwards to app container
    
  app:
    - Node.js Express server (port 3000)
    - Your expense tracker code
    
  postgres:
    - PostgreSQL database (port 5432)
    - Persistent volume for data
```

---

#### **OPTION B: Node.js + PM2**

**PM2 What it does:**
- Manages Node.js process lifecycle
- Auto-restart on crashes
- Cluster mode for multiple cores
- System integration for auto-start on boot

**Why use PM2:**
- ✅ **Lightweight** - Minimal overhead
- ✅ **Simple** - Easy to learn and setup
- ✅ **Robust** - Battle-tested in production
- ✅ **Auto-Restart** - App survives crashes
- ✅ **Monitoring** - Built-in process monitoring
- ✅ **Logging** - Centralized log management
- ✅ **No Containers** - Direct Node.js execution

**Your Setup:**
```
EC2 Instance (Ubuntu)
├─ Nginx (reverse proxy, SSL termination)
├─ Node.js (Express app running via PM2)
└─ PostgreSQL (database)
```

---

#### **OPTION C: AWS Elastic Beanstalk**

**Elastic Beanstalk What it does:**
- Managed service that auto-scales and deploys
- Abstracts EC2 management from you
- Git-integrated deployment

**Why use Elastic Beanstalk:**
- ✅ **Managed** - AWS handles scaling, monitoring, patching
- ✅ **Easy** - Deploy with `git push` or AWS CLI
- ✅ **Auto-Scaling** - Automatically adds more instances under load
- ✅ **Monitoring** - CloudWatch integration included
- ✅ **Load Balancing** - Built-in elastic load balancer
- ✅ **Less Control** - Trade-off for simplicity

---

## 📋 Prerequisites

### For All Options:
1. **AWS Account** with free tier access
2. **GitHub Repository** (your Expense-Tracker fork)
3. **SSH Client** for connecting to EC2
4. **Git** installed locally
5. **Code Editor** (VS Code, etc.)

### For Docker Option:
6. **Docker Desktop** installed locally (for testing)
7. **Docker Hub account** (free, for pushing images)
8. **Docker Compose** knowledge

### For Node.js + PM2 Option:
6. **Node.js/npm** familiarity
7. **Linux command** line basics
8. **PostgreSQL** basics

### For Elastic Beanstalk Option:
6. **AWS Elastic Beanstalk CLI** installed
7. **Minimal config changes** only

---

## 🚀 OPTION A: Docker + EC2 Deployment

### **PHASE A1: Repository Setup**

#### Step A1.1: Clone Repository

```bash
# On your local machine
git clone https://github.com/ObaidAbdullah16/Expense-Tracker.git
cd Expense-Tracker

# Verify Docker setup
ls -la
# Should show: Dockerfile, docker-compose.yml, package.json, public/, etc.

# Check Dockerfile
cat Dockerfile

# Check docker-compose.yml
cat docker-compose.yml
```

#### Step A1.2: Verify Project Structure

```
Expense-Tracker/
├── Dockerfile              ✅ Docker image definition
├── docker-compose.yml      ✅ Multi-container setup
├── server.js               ✅ Node.js Express server
├── database.sql            ✅ PostgreSQL schema
├── package.json            ✅ Node.js dependencies
├── public/
│   ├── index.html          ✅ Frontend
│   ├── style.css           ✅ Styling
│   └── script.js           ✅ JavaScript
├── nginx/
│   ├── Dockerfile          ✅ Nginx image
│   └── nginx.conf          ✅ Configuration
└── README.md
```

---

### **PHASE A2: Local Testing (Optional but Recommended)**

Test Docker setup locally before deploying:

```bash
# Build Docker images locally
docker-compose build

# Start containers
docker-compose up -d

# Check if services are running
docker-compose ps
# Should show: app (running), postgres (running), nginx (running)

# View logs
docker-compose logs -f app

# Test the app
curl http://localhost

# Stop containers
docker-compose down
```

---

### **PHASE A3: EC2 Instance Setup**

#### Step A3.1: Launch EC2 Instance

1. **AWS Console → EC2 → Instances → Launch Instances**

2. **Choose AMI:**
   - Ubuntu Server 22.04 LTS
   - Free tier eligible
   - Click "Select"

3. **Instance Type:**
   - t2.micro (Free tier)
   - Click "Next"

4. **Instance Details:**
   - Number: 1
   - Network: Default VPC
   - Auto-assign Public IP: **Enable**

5. **Storage:**
   - Size: 30 GB (Free tier)
   - Type: gp3 (General Purpose)
   - Delete on termination: Yes

6. **Security Group:**
   - Name: `expense-tracker-docker-sg`
   - Inbound rules:
   ```
   HTTP       80      0.0.0.0/0
   HTTPS      443     0.0.0.0/0
   SSH        22      Your-IP/32
   Custom TCP 5432    0.0.0.0/0  (PostgreSQL, optional)
   ```

7. **Key Pair:**
   - Create new: `expense-tracker-docker-key`
   - Format: .pem
   - Save securely

8. **Launch** → Get Elastic IP (recommended for static IP)

#### Step A3.2: Connect to EC2

```bash
# Set permissions
chmod 400 expense-tracker-docker-key.pem

# SSH into instance
ssh -i expense-tracker-docker-key.pem ubuntu@<ELASTIC_IP>

# You should see: ubuntu@ip-172-31-XX-XX:~$
```

---

### **PHASE A4: Docker Installation on EC2**

#### Step A4.1: Install Docker & Docker Compose

```bash
# SSH into instance first
ssh -i expense-tracker-docker-key.pem ubuntu@<ELASTIC_IP>

# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add ubuntu user to docker group (no sudo needed)
sudo usermod -aG docker ubuntu

# Logout and log back in
exit
ssh -i expense-tracker-docker-key.pem ubuntu@<ELASTIC_IP>

# Verify Docker
docker --version

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify Docker Compose
docker-compose --version
```

#### Step A4.2: Install Git

```bash
# Install Git
sudo apt install -y git

# Verify
git --version
```

---

### **PHASE A5: Clone and Deploy**

#### Step A5.1: Clone Repository on EC2

```bash
# Create app directory
mkdir -p ~/apps
cd ~/apps

# Clone repository
git clone https://github.com/ObaidAbdullah16/Expense-Tracker.git
cd Expense-Tracker

# Verify files
ls -la
docker-compose --version
```

#### Step A5.2: Configure Environment

```bash
# Create .env file
nano .env

# Add these variables:
NODE_ENV=production
PORT=3000
DB_HOST=postgres
DB_PORT=5432
DB_NAME=expense_tracker
DB_USER=expense_user
DB_PASSWORD=YourStrongPassword123!
POSTGRES_PASSWORD=YourStrongPassword123!
POSTGRES_DB=expense_tracker
POSTGRES_USER=expense_user

# Save (Ctrl+X, Y, Enter)
```

#### Step A5.3: Start Docker Containers

```bash
# Build images
docker-compose build

# Start services in background
docker-compose up -d

# Check status
docker-compose ps
# Should show all containers: running

# View logs
docker-compose logs -f

# Test app
curl http://localhost/
# Should show HTML response
```

#### Step A5.4: Initialize Database

```bash
# Run migrations/setup
docker-compose exec app npm run init-db

# Or manually:
docker-compose exec postgres psql -U expense_user -d expense_tracker -f /docker-entrypoint-initdb.d/init.sql

# Verify database
docker-compose exec postgres psql -U expense_user -d expense_tracker -c "\dt"
# Should show: expenses table
```

---

### **PHASE A6: Nginx Configuration for HTTPS**

#### Step A6.1: Update Nginx Config

```bash
# In your local Expense-Tracker/nginx/nginx.conf

# Replace with:
events {
    worker_connections 1024;
}

http {
    upstream expense_app {
        server app:3000;
    }

    # Redirect HTTP to HTTPS
    server {
        listen 80;
        server_name expense.obaidinfo.xyz;
        return 301 https://$server_name$request_uri;
    }

    # HTTPS server
    server {
        listen 443 ssl http2;
        server_name expense.obaidinfo.xyz;

        # SSL certificates (will update after Certbot setup)
        ssl_certificate /etc/letsencrypt/live/expense.obaidinfo.xyz/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/expense.obaidinfo.xyz/privkey.pem;

        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;

        # Gzip compression
        gzip on;
        gzip_types text/plain text/css text/javascript application/json;

        # Reverse proxy
        location / {
            proxy_pass http://expense_app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            
            # Timeouts
            proxy_connect_timeout 60s;
            proxy_send_timeout 60s;
            proxy_read_timeout 60s;
        }

        # Security headers
        add_header Strict-Transport-Security "max-age=31536000" always;
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
    }
}

# Save and commit
git add nginx/nginx.conf
git commit -m "Update Nginx config for HTTPS"
git push origin main
```

#### Step A6.2: Pull and Rebuild on EC2

```bash
# SSH into EC2
ssh -i expense-tracker-docker-key.pem ubuntu@<ELASTIC_IP>
cd ~/apps/Expense-Tracker

# Pull latest changes
git pull origin main

# Rebuild Nginx container
docker-compose build nginx

# Restart services
docker-compose restart nginx app

# Verify
docker-compose ps
```

---

### **PHASE A7: SSL Certificate (Let's Encrypt)**

#### Step A7.1: Install Certbot

```bash
# SSH into EC2
ssh -i expense-tracker-docker-key.pem ubuntu@<ELASTIC_IP>

# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --standalone -d expense.obaidinfo.xyz \
  --non-interactive \
  --agree-tos \
  -m your-email@example.com

# This creates:
# /etc/letsencrypt/live/expense.obaidinfo.xyz/fullchain.pem
# /etc/letsencrypt/live/expense.obaidinfo.xyz/privkey.pem
```

#### Step A7.2: Mount Certificates in Docker

```bash
# Update docker-compose.yml

# In nginx service, add volumes:
volumes:
  - /etc/letsencrypt:/etc/letsencrypt:ro

# Restart Nginx
docker-compose restart nginx

# Verify SSL
curl -I https://expense.obaidinfo.xyz
```

#### Step A7.3: Auto-Renewal

```bash
# Certbot auto-renewal (automatic via cron)
sudo systemctl enable certbot.timer

# Test renewal
sudo certbot renew --dry-run
```

---

### **PHASE A8: DNS Configuration**

#### Step A8.1: Get Elastic IP

```bash
# From EC2 console, note your Elastic IP
# Or from command line:
curl http://169.254.169.254/latest/meta-data/public-ipv4
```

#### Step A8.2: Update Route 53

1. **AWS Console → Route 53 → Hosted zones → obaidinfo.xyz**

2. **Create Record:**
```
Record name:     expense
Type:            A
Value:           <Your Elastic IP>
TTL:             300
```

3. **Test DNS:**
```bash
nslookup expense.obaidinfo.xyz
curl -I https://expense.obaidinfo.xyz
```

---

### **PHASE A9: Docker Maintenance**

#### Container Management

```bash
# View logs
docker-compose logs app

# View specific number of lines
docker-compose logs --tail 50 app

# Follow logs in real-time
docker-compose logs -f app

# Check resource usage
docker stats

# View container details
docker inspect expense-tracker_app_1

# Execute command in container
docker-compose exec app npm list

# Stop/start containers
docker-compose stop
docker-compose start

# Restart services
docker-compose restart app

# Remove containers (stops them)
docker-compose down

# Remove everything including volumes
docker-compose down -v
```

#### Database Backup

```bash
# Backup PostgreSQL database
docker-compose exec postgres pg_dump -U expense_user expense_tracker > backup_$(date +%Y%m%d).sql

# Backup to S3
aws s3 cp backup_20260526.sql s3://my-backup-bucket/

# Restore from backup
cat backup_20260526.sql | docker-compose exec -T postgres psql -U expense_user -d expense_tracker
```

#### Docker Image Updates

```bash
# Pull latest base images
docker-compose pull

# Rebuild with latest changes
docker-compose build --no-cache

# Restart with new images
docker-compose up -d
```

---

## 🚀 OPTION B: Node.js + PM2 Deployment

### **PHASE B1-B3: EC2 Setup** (Same as Option A, skip to Phase B4)

---

### **PHASE B4: Node.js Installation**

#### Step B4.1: Install Node.js

```bash
# SSH into EC2
ssh -i expense-tracker-pm2-key.pem ubuntu@<ELASTIC_IP>

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify
node --version
npm --version
```

#### Step B4.2: Install PostgreSQL

```bash
# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Start service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Verify
sudo systemctl status postgresql
```

#### Step B4.3: Install PM2 & Nginx

```bash
# Install PM2 globally
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx

# Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Verify
pm2 --version
nginx -v
```

---

### **PHASE B5: Database Setup**

#### Step B5.1: Create Database

```bash
# Connect to PostgreSQL
sudo -u postgres psql

# Create database and user
CREATE DATABASE expense_tracker;
CREATE USER expense_user WITH PASSWORD 'YourStrongPassword123!';
GRANT ALL PRIVILEGES ON DATABASE expense_tracker TO expense_user;

# Connect to database
\c expense_tracker

# Create tables (paste from database.sql)
CREATE TABLE expenses (
    id SERIAL PRIMARY KEY,
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

# Exit
\q
```

---

### **PHASE B6: Application Setup**

#### Step B6.1: Clone & Setup

```bash
# Navigate to apps directory
mkdir -p ~/apps && cd ~/apps

# Clone repository
git clone https://github.com/ObaidAbdullah16/Expense-Tracker.git
cd Expense-Tracker

# Install dependencies
npm install

# Create .env file
nano .env

# Add:
NODE_ENV=production
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=expense_tracker
DB_USER=expense_user
DB_PASSWORD=YourStrongPassword123!
```

#### Step B6.2: Start with PM2

```bash
# Start application
pm2 start server.js --name "expense-app"

# Save process list
pm2 save

# Setup auto-start on boot
sudo pm2 startup

# Verify running
pm2 list
pm2 logs expense-app
```

---

### **PHASE B7: Nginx Configuration**

#### Step B7.1: Configure Nginx

```bash
# Edit Nginx config
sudo nano /etc/nginx/sites-available/expense-app

# Add this config:
server {
    listen 80;
    server_name expense.obaidinfo.xyz;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name expense.obaidinfo.xyz;

    ssl_certificate /etc/letsencrypt/live/expense.obaidinfo.xyz/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/expense.obaidinfo.xyz/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    gzip on;
    gzip_types text/plain text/css application/json;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    add_header Strict-Transport-Security "max-age=31536000" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
}

# Save file
```

#### Step B7.2: Enable Configuration

```bash
# Create symlink
sudo ln -s /etc/nginx/sites-available/expense-app /etc/nginx/sites-enabled/

# Remove default
sudo rm /etc/nginx/sites-enabled/default

# Test config
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

---

### **PHASE B8: SSL Certificate**

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --nginx -d expense.obaidinfo.xyz

# Auto-renewal
sudo systemctl enable certbot.timer

# Reload Nginx
sudo systemctl reload nginx
```

---

### **PHASE B9: PM2 Monitoring**

```bash
# Monitor processes
pm2 monit

# View logs
pm2 logs expense-app

# Restart app
pm2 restart expense-app

# Update app (pull git changes)
cd ~/apps/Expense-Tracker
git pull origin main
npm install
pm2 restart expense-app

# View process list
pm2 list
pm2 show expense-app

# Enable startup on reboot
sudo pm2 startup
```

---

## 🚀 OPTION C: AWS Elastic Beanstalk Deployment

### **PHASE C1: Elastic Beanstalk CLI Setup**

```bash
# Install EB CLI
sudo apt install -y python3-pip
pip3 install awsebcli --upgrade --user

# Add to PATH
echo 'export PATH=~/.local/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# Verify
eb --version
```

### **PHASE C2: Initialize Beanstalk**

```bash
# Clone repository
git clone https://github.com/ObaidAbdullah16/Expense-Tracker.git
cd Expense-Tracker

# Initialize EB
eb init -p "Node.js 18 running on 64bit Amazon Linux 2" \
  --region us-east-1 \
  --application-name expense-tracker

# Create environment
eb create expense-tracker-env

# View status
eb status

# Open in browser
eb open
```

### **PHASE C3: Configure Environment Variables**

```bash
# Set environment variables
eb setenv \
  NODE_ENV=production \
  DB_HOST=<RDS_ENDPOINT> \
  DB_PORT=5432 \
  DB_NAME=expense_tracker \
  DB_USER=expense_user \
  DB_PASSWORD=YourPassword

# For managed database, use AWS RDS:
# 1. Create RDS PostgreSQL instance
# 2. Get endpoint
# 3. Use endpoint in environment variables
```

### **PHASE C4: Deploy**

```bash
# Deploy application
eb deploy

# View logs
eb logs

# Check health
eb health

# SSH into instance
eb ssh
```

---

## 🌐 DNS Configuration (All Options)

### Route 53 Setup

```bash
# AWS Console → Route 53 → Hosted zones → obaidinfo.xyz

# Create A record:
Record name:     expense
Type:            A
Value:           <Elastic IP or Load Balancer>
TTL:             300

# Test:
nslookup expense.obaidinfo.xyz
curl -I https://expense.obaidinfo.xyz
```

---

## 🔒 SSL Certificate Setup (All Options)

### Let's Encrypt with Certbot

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --standalone -d expense.obaidinfo.xyz

# Auto-renewal (automatic)
sudo systemctl enable certbot.timer

# Manual renewal
sudo certbot renew

# View certificates
sudo certbot certificates
```

---

## 📊 Monitoring & Maintenance

### Docker Option

```bash
# Container logs
docker-compose logs -f app

# Resource usage
docker stats

# Database backup
docker-compose exec postgres pg_dump -U expense_user expense_tracker > backup.sql

# Restart services
docker-compose restart

# Update containers
docker-compose pull
docker-compose up -d
```

### PM2 Option

```bash
# Monitor
pm2 monit

# Logs
pm2 logs expense-app

# Restart
pm2 restart expense-app

# Update
cd ~/apps/Expense-Tracker
git pull
npm install
pm2 restart expense-app
```

### Elastic Beanstalk Option

```bash
# Status
eb status

# Logs
eb logs

# Deployments
eb appversion

# Scale
eb scale 2

# Update
git push && eb deploy
```

---

## 💰 Cost Analysis

### All Options - First 12 Months (Free Tier)

| Component | Cost |
|-----------|------|
| EC2 t2.micro | FREE |
| EBS Storage | FREE |
| Data transfer | FREE |
| Route 53 | $0.50 |
| SSL Certificate | FREE |
| **Monthly Total** | **~$0.50** |

### All Options - After Free Tier

| Option | Monthly Cost |
|--------|-------------|
| Docker + EC2 | $7-15 |
| Node.js + PM2 | $7-15 |
| Elastic Beanstalk | $15-50+ |

### Comparison

```
Docker + EC2:           $7-15/month  ✅ Best control & cost
Node.js + PM2:          $7-15/month  ✅ Simpler setup
Elastic Beanstalk:      $15-50+/month ⚠️ More managed, more expensive
```

---

## 🔧 Troubleshooting

### Docker Issues

**Containers won't start:**
```bash
docker-compose logs
docker-compose ps
docker-compose restart

# Rebuild if issues persist
docker-compose build --no-cache
docker-compose up -d
```

**Can't connect to database:**
```bash
# Check if postgres container is running
docker-compose ps postgres

# Check logs
docker-compose logs postgres

# Verify connection string in .env
# Make sure DB_HOST=postgres (not localhost in Docker)
```

---

### PM2 Issues

**App keeps crashing:**
```bash
pm2 logs expense-app
# Look for error messages

pm2 restart expense-app
```

**High memory usage:**
```bash
pm2 monit
# Check if memory leak

pm2 restart expense-app
```

---

### Nginx Issues

**502 Bad Gateway:**
```bash
# Check if app is running
pm2 list
# or
docker-compose ps app

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log

# Restart Nginx
sudo systemctl restart nginx
```

---

### DNS Issues

**Can't reach website:**
```bash
# Check DNS resolution
nslookup expense.obaidinfo.xyz

# Should return Elastic IP

# If not, check Route 53 records
# Wait for TTL (usually 5 minutes)
```

---

### SSL Certificate Issues

**"Not Secure" warning:**
```bash
# Check certificate status
sudo certbot certificates

# Should show: VALID

# Refresh Nginx
sudo systemctl reload nginx

# Clear browser cache
```

---

## 📝 Maintenance Checklist

### Daily
- [ ] Website accessible
- [ ] HTTPS working
- [ ] App running (PM2 list or docker-compose ps)

### Weekly
- [ ] Check application logs
- [ ] Monitor CPU/Memory usage
- [ ] Test adding expenses

### Monthly
- [ ] Review AWS charges
- [ ] Backup database
- [ ] Check certificate expiry
- [ ] Update packages (npm, OS)

### Quarterly
- [ ] Security audit
- [ ] Performance review
- [ ] Disaster recovery test
- [ ] Plan for scaling

---

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Docs](https://docs.docker.com/compose/)
- [Node.js Best Practices](https://nodejs.org/en/docs/)
- [PM2 Documentation](https://pm2.keymetrics.io/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt Guide](https://letsencrypt.org/docs/)
- [AWS EC2 Docs](https://docs.aws.amazon.com/ec2/)
- [AWS Elastic Beanstalk](https://docs.aws.amazon.com/elasticbeanstalk/)

---

## 🎯 Recommendation

**For beginners:** Start with **Option B (Node.js + PM2)**
- Simpler to understand
- Fewer moving parts
- Easier to debug

**For production:** Use **Option A (Docker)**
- Container best practices
- Easy scaling later
- Version control infrastructure
- Easy CI/CD integration

**For teams:** Use **Option C (Elastic Beanstalk)**
- Managed experience
- Auto-scaling
- Less DevOps overhead

---

**Last Updated:** May 26, 2026  
**Status:** ✅ All Options Production Ready  
**Next Review:** August 26, 2026
