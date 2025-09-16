# Deployment Guide

## 🚀 **Overview**

This guide covers deploying the Unidirectional Communication System to production, specifically focusing on AWS EC2 deployment as mentioned in the requirements.

## ☁️ **AWS EC2 Deployment**

### **Prerequisites**

- AWS Account
- EC2 Instance (Ubuntu t3.micro recommended)
- Domain name (optional)
- SSL certificate (optional)

### **Step 1: Launch EC2 Instance**

#### **Instance Configuration**

- **Instance Type**: t3.micro (free tier eligible)
- **OS**: Ubuntu Server 20.04 LTS
- **Storage**: 8 GB (free tier)
- **Security Group**: Allow ports 22 (SSH), 80 (HTTP), 443 (HTTPS)

#### **Security Group Rules**

```
Type        Protocol    Port Range    Source
SSH         TCP         22            Your IP
HTTP        TCP         80            0.0.0.0/0
HTTPS       TCP         443           0.0.0.0/0
Custom      TCP         3000          0.0.0.0/0 (for testing)
```

### **Step 2: Connect to EC2 Instance**

```bash
# Download your key pair
# Make it executable
chmod 400 your-key.pem

# Connect to instance
ssh -i your-key.pem ubuntu@your-ec2-public-ip
```

### **Step 3: System Setup**

#### **Update System**

```bash
sudo apt update
sudo apt upgrade -y
```

#### **Install Node.js**

```bash
# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

#### **Install MongoDB**

```bash
# Import MongoDB public key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### **Install PM2**

```bash
sudo npm install -g pm2
```

#### **Install Nginx**

```bash
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

### **Step 4: Deploy Application**

#### **Clone Repository**

```bash
# Clone your repository
git clone https://github.com/yourusername/UnidirectionalCS.git
cd UnidirectionalCS
```

#### **Backend Setup**

```bash
cd backend
npm install
npm run build

# Create production environment file
cat > .env <<EOF
MONGO_URI=mongodb://localhost:27017/unidirectional-comm
JWT_SECRET=your-super-secret-jwt-key-for-production
GMAIL_USER=your-gmail@gmail.com
GMAIL_APP_PASSWORD=your-gmail-app-password
PORT=3000
NODE_ENV=production
EOF
```

#### **Frontend Setup**

```bash
cd ../frontend
npm install
npm run build
```

### **Step 5: Configure PM2**

#### **Create PM2 Configuration**

```bash
cd backend
cat > ecosystem.config.js <<EOF
module.exports = {
  apps: [{
    name: 'unidirectional-backend',
    script: 'dist/index.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
EOF
```

#### **Start Application**

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### **Step 6: Configure Nginx**

#### **Create Nginx Configuration**

```bash
sudo tee /etc/nginx/sites-available/unidirectional <<EOF
server {
    listen 80;
    server_name your-domain.com;  # Replace with your domain or EC2 public IP

    # Serve frontend static files
    location / {
        root /home/ubuntu/UnidirectionalCS/frontend/build;
        index index.html;
        try_files \$uri \$uri/ /index.html;
    }

    # Proxy API requests to backend
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF
```

#### **Enable Site**

```bash
sudo ln -s /etc/nginx/sites-available/unidirectional /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### **Step 7: SSL Configuration (Optional)**

#### **Install Certbot**

```bash
sudo apt install certbot python3-certbot-nginx -y
```

#### **Get SSL Certificate**

```bash
sudo certbot --nginx -d your-domain.com
```

#### **Auto-renewal**

```bash
sudo crontab -e
# Add this line:
0 12 * * * /usr/bin/certbot renew --quiet
```

## 🔧 **Environment Configuration**

### **Production Environment Variables**

#### **Backend (.env)**

```env
# Database
MONGO_URI=mongodb://localhost:27017/unidirectional-comm

# Authentication
JWT_SECRET=your-super-secret-jwt-key-for-production

# Email Service
GMAIL_USER=your-gmail@gmail.com
GMAIL_APP_PASSWORD=your-gmail-app-password

# AWS Configuration (if using SES)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
SES_EMAIL=your-verified-email@example.com

# Server
PORT=3000
NODE_ENV=production
```

### **Frontend Configuration**

#### **Update API Base URL**

```typescript
// frontend/src/api.ts
const api = axios.create({
  baseURL: "https://your-domain.com/api", // Update this
});
```

## 📊 **Monitoring and Maintenance**

### **PM2 Monitoring**

```bash
# Check application status
pm2 status

# View logs
pm2 logs unidirectional-backend

# Monitor resources
pm2 monit

# Restart application
pm2 restart unidirectional-backend
```

### **System Monitoring**

```bash
# Check system resources
htop

# Check disk usage
df -h

# Check memory usage
free -h

# Check network connections
netstat -tulpn
```

### **Database Monitoring**

```bash
# Connect to MongoDB
mongo

# Check database status
db.stats()

# Check collections
show collections

# Check indexes
db.requests.getIndexes()
```

## 🔄 **Backup Strategy**

### **Database Backup**

```bash
# Create backup script
cat > backup.sh <<EOF
#!/bin/bash
DATE=\$(date +%Y%m%d_%H%M%S)
mongodump --db unidirectional-comm --out /home/ubuntu/backups/\$DATE
tar -czf /home/ubuntu/backups/\$DATE.tar.gz /home/ubuntu/backups/\$DATE
rm -rf /home/ubuntu/backups/\$DATE
EOF

chmod +x backup.sh

# Schedule daily backups
crontab -e
# Add this line:
0 2 * * * /home/ubuntu/UnidirectionalCS/backup.sh
```

### **Application Backup**

```bash
# Backup application code
tar -czf app-backup-$(date +%Y%m%d).tar.gz /home/ubuntu/UnidirectionalCS/
```

## 🚨 **Troubleshooting**

### **Common Issues**

#### **Application Won't Start**

```bash
# Check PM2 logs
pm2 logs unidirectional-backend

# Check if port is in use
sudo netstat -tulpn | grep :3000

# Check environment variables
cat backend/.env
```

#### **Database Connection Issues**

```bash
# Check MongoDB status
sudo systemctl status mongod

# Check MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log

# Test connection
mongo --eval "db.adminCommand('ismaster')"
```

#### **Nginx Issues**

```bash
# Check Nginx status
sudo systemctl status nginx

# Test configuration
sudo nginx -t

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log
```

#### **SSL Issues**

```bash
# Check certificate status
sudo certbot certificates

# Test SSL
openssl s_client -connect your-domain.com:443
```

### **Performance Issues**

#### **High Memory Usage**

```bash
# Check memory usage
free -h

# Check PM2 memory usage
pm2 monit

# Restart application if needed
pm2 restart unidirectional-backend
```

#### **Slow Database Queries**

```bash
# Check slow queries
mongo
db.setProfilingLevel(2, { slowms: 100 })
db.system.profile.find().sort({ ts: -1 }).limit(5)
```

## 📈 **Scaling Considerations**

### **Horizontal Scaling**

- Use multiple EC2 instances
- Implement load balancing
- Use MongoDB replica sets
- Implement session management

### **Vertical Scaling**

- Upgrade to larger instance types
- Optimize database queries
- Implement caching
- Use CDN for static assets

## 🔒 **Security Considerations**

### **Server Security**

- Keep system updated
- Use strong passwords
- Implement fail2ban
- Regular security audits

### **Application Security**

- Use HTTPS
- Implement rate limiting
- Regular dependency updates
- Security headers

### **Database Security**

- Enable authentication
- Use encrypted connections
- Regular backups
- Access control

## 📋 **Deployment Checklist**

### **Pre-deployment**

- [ ] Code tested locally
- [ ] Environment variables configured
- [ ] Database schema updated
- [ ] SSL certificate ready

### **Deployment**

- [ ] EC2 instance launched
- [ ] Dependencies installed
- [ ] Application deployed
- [ ] Nginx configured
- [ ] SSL configured

### **Post-deployment**

- [ ] Application accessible
- [ ] Database connected
- [ ] Email service working
- [ ] Monitoring configured
- [ ] Backups scheduled

### **Testing**

- [ ] All features working
- [ ] Performance acceptable
- [ ] Security measures in place
- [ ] Monitoring alerts configured

This deployment guide ensures a smooth transition from development to production!
