# Deployment Scripts

This folder contains scripts and tools to help you deploy the Unidirectional Communication System to AWS.

## 📁 Files Overview

### `setup-server.sh`

**Purpose:** Automated server setup script for Ubuntu EC2 instances
**Usage:** Run this script on your EC2 instance after connecting via SSH
**What it does:**

- Installs Node.js 18, PM2, Nginx, Git, Certbot
- Creates PM2 ecosystem configuration
- Sets up Nginx reverse proxy
- Creates deployment and monitoring scripts
- Configures log rotation

### `deploy-to-aws.bat`

**Purpose:** Windows batch script to prepare deployment package
**Usage:** Run this script on your Windows machine before deployment
**What it does:**

- Checks for required tools (AWS CLI, Git, Node.js)
- Creates a deployment package with all necessary files
- Generates production-ready package.json files
- Creates environment variable templates
- Provides deployment instructions

## 🚀 Quick Deployment Process

### Step 1: Prepare Deployment Package (Windows)

```bash
# Run the Windows batch script
DEPLOYMENT_SCRIPTS\deploy-to-aws.bat
```

### Step 2: Launch EC2 Instance

1. Go to AWS EC2 Console
2. Launch Ubuntu 22.04 LTS t3.micro instance
3. Configure security group (SSH, HTTP, HTTPS, Custom TCP 3000)
4. Connect via SSH

### Step 3: Setup Server (EC2)

```bash
# Upload and run the setup script
chmod +x setup-server.sh
./setup-server.sh
```

### Step 4: Deploy Application

```bash
# Upload deployment package to EC2
# Then run deployment
./deploy.sh
```

## 📋 Manual Steps (Alternative)

If you prefer manual setup, follow these guides:

- **Detailed Guide:** `AWS_DEPLOYMENT_GUIDE.md`
- **Quick Checklist:** `QUICK_DEPLOYMENT_CHECKLIST.md`

## 🔧 Script Details

### setup-server.sh Features

- **System Updates:** Updates all packages
- **Node.js 18:** Installs latest LTS version
- **PM2:** Process manager for Node.js applications
- **Nginx:** Web server and reverse proxy
- **SSL Support:** Certbot for Let's Encrypt certificates
- **Security:** Firewall configuration
- **Monitoring:** System monitoring scripts
- **Log Rotation:** Automatic log management

### deploy-to-aws.bat Features

- **Dependency Check:** Verifies AWS CLI, Git, Node.js
- **Package Creation:** Creates deployment-ready package
- **Production Config:** Generates production package.json files
- **Environment Template:** Creates .env template
- **Documentation:** Includes deployment guides

## 🛠️ Customization

### Environment Variables

Edit the `.env.template` file with your actual values:

- MongoDB connection string
- JWT secret
- AWS SES credentials

### Nginx Configuration

The setup script creates a basic Nginx configuration. You can customize:

- Server name (domain)
- SSL settings
- Security headers
- Proxy settings

### PM2 Configuration

The ecosystem.config.js file includes:

- Process name and script path
- Memory limits
- Log file locations
- Environment variables

## 📊 Monitoring

### Available Monitoring Scripts

- `monitor.sh` - System status report
- `pm2 status` - Process status
- `pm2 logs` - Application logs
- `htop` - System resources

### Log Locations

- **Application Logs:** `/home/ubuntu/logs/`
- **Nginx Logs:** `/var/log/nginx/`
- **System Logs:** `/var/log/`

## 🔒 Security Considerations

### Firewall Rules

The setup script configures:

- SSH access (port 22)
- HTTP/HTTPS access (ports 80/443)
- Backend API access (port 3000)

### SSL/TLS

- Certbot installed for Let's Encrypt certificates
- Automatic renewal configured
- HTTPS redirect available

### Security Headers

Nginx configuration includes:

- X-Frame-Options
- X-XSS-Protection
- X-Content-Type-Options
- Content-Security-Policy

## 🚨 Troubleshooting

### Common Issues

1. **Permission Denied:** Make sure scripts are executable (`chmod +x`)
2. **Port Conflicts:** Check if ports 80, 443, 3000 are available
3. **Service Failures:** Check logs with `pm2 logs` and `sudo systemctl status nginx`
4. **SSL Issues:** Verify domain DNS settings

### Debug Commands

```bash
# Check PM2 status
pm2 status

# View application logs
pm2 logs

# Check Nginx status
sudo systemctl status nginx

# Test Nginx configuration
sudo nginx -t

# Check system resources
htop

# View recent logs
pm2 logs --lines 50
```

## 💰 Cost Optimization

### EC2 Instance

- **t3.micro:** Free tier eligible
- **t3.small:** ~$15/month if free tier exhausted

### Other Services

- **MongoDB Atlas:** Free tier (M0)
- **AWS SES:** Pay per email sent
- **Route 53:** $0.50/month per hosted zone

### Total Estimated Cost

- **Week-long demo:** $2-3
- **Month-long demo:** $8-15

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section
2. Review the detailed deployment guide
3. Check AWS service status
4. Verify all environment variables

---

**Ready to deploy?** Start with the `deploy-to-aws.bat` script on Windows, then follow the EC2 setup process! 🚀
