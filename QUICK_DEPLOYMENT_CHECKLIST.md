# Quick Deployment Checklist

## ✅ Pre-Deployment Checklist

### 1. AWS Account Setup

- [ ] AWS account created and billing enabled
- [ ] AWS CLI configured (optional)
- [ ] IAM user with EC2 permissions created

### 2. MongoDB Atlas Setup

- [ ] MongoDB Atlas account created
- [ ] Free cluster (M0) created
- [ ] Database user created with read/write permissions
- [ ] IP address whitelisted (`0.0.0.0/0` for EC2)
- [ ] Connection string copied

### 3. Gmail Setup

- [ ] Gmail account with 2-Factor Authentication enabled
- [ ] App Password generated for "Mail"
- [ ] Gmail credentials ready for .env file

### 4. Domain Setup (Optional)

- [ ] Domain purchased (if using custom domain)
- [ ] Domain pointed to EC2 public IP (if using Route 53)

## 🚀 Deployment Steps

### Step 1: Launch EC2 Instance

- [ ] Launch Ubuntu 22.04 LTS t3.micro instance
- [ ] Create/select key pair
- [ ] Configure security group:
  - [ ] SSH (22) - Your IP
  - [ ] HTTP (80) - 0.0.0.0/0
  - [ ] HTTPS (443) - 0.0.0.0/0
  - [ ] Custom TCP (3000) - 0.0.0.0/0
- [ ] Connect via SSH: `ssh -i key.pem ubuntu@public-ip`

### Step 2: Install Dependencies

- [ ] Update system: `sudo apt update && sudo apt upgrade -y`
- [ ] Install Node.js 18: `curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && sudo apt-get install -y nodejs`
- [ ] Install PM2: `sudo npm install -g pm2`
- [ ] Install Nginx: `sudo apt install nginx -y`
- [ ] Install Git: `sudo apt install git -y`
- [ ] Install Certbot: `sudo apt install certbot python3-certbot-nginx -y`

### Step 3: Deploy Application

- [ ] Clone repository: `git clone https://github.com/ShreyVDesai/UnidirectionalCS.git`
- [ ] Navigate to backend: `cd UnidirectionalCS/backend`
- [ ] Install dependencies: `npm install`
- [ ] Create production .env file with MongoDB connection string and Gmail credentials
- [ ] Build backend: `npm run build`
- [ ] Start with PM2: `pm2 start dist/index.js --name "backend"`
- [ ] Save PM2 config: `pm2 save && pm2 startup`

### Step 4: Deploy Frontend

- [ ] Navigate to frontend: `cd ../frontend`
- [ ] Install dependencies: `npm install`
- [ ] Build frontend: `npm run build`
- [ ] Copy to Nginx: `sudo cp -r build/* /var/www/html/`

### Step 5: Configure Nginx

- [ ] Create Nginx config: `sudo nano /etc/nginx/sites-available/unidirectional-comm`
- [ ] Copy Nginx configuration from deployment guide
- [ ] Enable site: `sudo ln -s /etc/nginx/sites-available/unidirectional-comm /etc/nginx/sites-enabled/`
- [ ] Remove default: `sudo rm /etc/nginx/sites-enabled/default`
- [ ] Test config: `sudo nginx -t`
- [ ] Restart Nginx: `sudo systemctl restart nginx`

### Step 6: SSL Setup (Optional)

- [ ] Get SSL certificate: `sudo certbot --nginx -d your-domain.com`
- [ ] Test renewal: `sudo certbot renew --dry-run`

### Step 7: Gmail SMTP Setup

- [ ] Configure Gmail App Password in backend .env
- [ ] Test email functionality
- [ ] Verify email sending works

## 🧪 Testing Checklist

### Backend Testing

- [ ] Test API endpoint: `curl http://your-domain.com/api/test`
- [ ] Test scheduler: `curl http://your-domain.com/api/test-scheduler`
- [ ] Check PM2 status: `pm2 status`
- [ ] Check logs: `pm2 logs backend`

### Frontend Testing

- [ ] Visit website: `http://your-domain.com`
- [ ] Test user registration (Type A and B)
- [ ] Test login functionality
- [ ] Test request creation (Type A)
- [ ] Test request acceptance (Type B)
- [ ] Test messaging system
- [ ] Test email notifications
- [ ] Test message deletion after 1 hour

### System Testing

- [ ] Check Nginx status: `sudo systemctl status nginx`
- [ ] Check SSL certificate (if applicable)
- [ ] Monitor system resources: `htop`
- [ ] Check disk space: `df -h`

### Access Your Live Application

- [ ] **Primary URL:** `http://your-ec2-public-ip`
- [ ] **Domain URL:** `http://your-domain.com` (if configured)
- [ ] **HTTPS URL:** `https://your-domain.com` (if SSL is set up)
- [ ] **Find Public IP:** Check EC2 Console > Instance Details > Public IPv4 address
- [ ] **Test from different devices:** Mobile, tablet, different networks
- [ ] **Share with others:** Send them the public IP URL

## 🔧 Troubleshooting Checklist

### If Backend Won't Start

- [ ] Check PM2 logs: `pm2 logs backend`
- [ ] Verify .env file configuration
- [ ] Check MongoDB connection
- [ ] Verify JWT_SECRET is set
- [ ] Check port 3000 is available

### If Frontend Won't Load

- [ ] Check Nginx status: `sudo systemctl status nginx`
- [ ] Verify Nginx configuration: `sudo nginx -t`
- [ ] Check if files exist in `/var/www/html/`
- [ ] Verify security group allows HTTP/HTTPS traffic

### If Database Connection Fails

- [ ] Verify MongoDB Atlas connection string
- [ ] Check IP whitelist in MongoDB Atlas
- [ ] Verify database user permissions
- [ ] Test connection from EC2: `telnet cluster.mongodb.net 27017`

### If Emails Don't Send

- [ ] Verify AWS SES email addresses are verified
- [ ] Check AWS credentials in .env
- [ ] Review SES sending limits
- [ ] Check AWS SES sandbox mode status

## 📊 Monitoring Checklist

### Daily Checks

- [ ] PM2 process status: `pm2 status`
- [ ] System resources: `htop`
- [ ] Nginx logs: `sudo tail -f /var/log/nginx/access.log`
- [ ] Application logs: `pm2 logs backend`

### Weekly Checks

- [ ] System updates: `sudo apt update && sudo apt upgrade`
- [ ] SSL certificate expiry: `sudo certbot certificates`
- [ ] Database backup status
- [ ] AWS billing dashboard

## 🧹 Cleanup Checklist (When Demo Ends)

### Application Cleanup

- [ ] Stop PM2 processes: `pm2 stop all && pm2 delete all`
- [ ] Remove application files: `rm -rf /home/ubuntu/UnidirectionalCS`
- [ ] Remove Nginx configuration: `sudo rm /etc/nginx/sites-enabled/unidirectional-comm`

### AWS Resource Cleanup

- [ ] Terminate EC2 instance
- [ ] Delete security groups (if not used elsewhere)
- [ ] Remove Route 53 records (if applicable)
- [ ] Clean up SES verified emails (if not needed)

### MongoDB Atlas Cleanup

- [ ] Delete database (if no longer needed)
- [ ] Remove database user
- [ ] Delete cluster (if not used elsewhere)

---

**Total Estimated Time:** 2-3 hours for complete deployment
**Total Estimated Cost:** $2-3 for a week-long demo

🎉 **Ready to deploy!** Follow this checklist step by step for a smooth deployment experience.
