# AWS Deployment Guide

This guide provides step-by-step instructions for deploying the Unidirectional Communication System to AWS using cost-effective services.

## 🏗️ Architecture Overview

**Services Used:**

- **EC2** (t3.micro) - Hosts both frontend and backend
- **MongoDB Atlas** (Free tier) - Database
- **Route 53** (Optional) - Domain management
- **Nodemailer with Gmail SMTP** - Email service
- **Nginx** - Reverse proxy and static file serving

**Estimated Cost:** ~$2-3/month for a week-long demo

## 📋 Prerequisites

1. AWS Account with billing enabled
2. Domain name (optional, can use EC2 public IP)
3. MongoDB Atlas account (free)
4. Local development environment ready

## 🚀 Step-by-Step Deployment

### Step 1: Set Up MongoDB Atlas (Free)

1. **Create MongoDB Atlas Account:**

   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for free
   - Create a new cluster (M0 Sandbox - Free)

2. **Configure Database:**

   - Create database user with read/write permissions
   - Whitelist your IP address (use `0.0.0.0/0` for EC2)
   - Get connection string (format: `mongodb+srv://username:password@cluster.mongodb.net/database`)

3. **Note the connection string** - you'll need it for the EC2 instance

### Step 2: Launch EC2 Instance

1. **Launch Instance:**

   - Go to AWS EC2 Console
   - Click "Launch Instance"
   - Choose "Ubuntu Server 22.04 LTS"
   - Select "t3.micro" (Free tier eligible)
   - Create or select a key pair
   - Configure security group:
     ```
     SSH (22) - Your IP
     HTTP (80) - 0.0.0.0/0
     HTTPS (443) - 0.0.0.0/0
     Custom TCP (3000) - 0.0.0.0/0 (for backend)
     ```

2. **Network Configuration Details:**

   **Security Group Rules:**

   - **SSH (Port 22):** Allow only your IP for security
   - **HTTP (Port 80):** Allow all traffic (0.0.0.0/0) for web access
   - **HTTPS (Port 443):** Allow all traffic for SSL
   - **Custom TCP (Port 3000):** Allow all traffic for backend API

   **Important Network Notes:**

   - Your EC2 instance will get a **Public IP** automatically
   - The **Public IP** is your live application URL
   - Security groups act as a firewall for your instance
   - All ports except 22 should be open to the world (0.0.0.0/0)

3. **Connect to Instance:**

   ```bash
   ssh -i your-key.pem ubuntu@your-ec2-public-ip
   ```

4. **Find Your Public IP:**
   - In EC2 Console, select your instance
   - Look for "Public IPv4 address" in the details
   - This is your live application URL: `http://your-public-ip`

### Step 3: Install Dependencies on EC2

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y

# Install Git
sudo apt install git -y

# Install Certbot for SSL
sudo apt install certbot python3-certbot-nginx -y
```

### Step 4: Deploy Application Code

1. **Clone Repository:**

   ```bash
   cd /home/ubuntu
   git clone https://github.com/ShreyVDesai/UnidirectionalCS.git
   cd UnidirectionalCS
   ```

2. **Set Up Backend:**

   ```bash
   cd backend
   npm install

   # Create production .env file
   sudo nano .env
   ```

   **Backend .env content:**

   ```env
   PORT=3000
   MONGO_URI=mongodb+srv://systemcommunication883_db_user:kmo2cKEaOtvxQRxn@cluster0.rx7lz1p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET=jwt_random_string
   GMAIL_USER=systemcommunication883
   GMAIL_APP_PASSWORD=hegkwbzstgnwfaon
   NODE_ENV=development
   ```

   **Frontend .env content:**

   ```env
   PORT=3001
   ```

3. **Build and Start Backend:**

   ```bash
   npm run build
   pm2 start dist/index.js --name "backend"
   pm2 save
   pm2 startup
   ```

4. **Set Up Frontend:**

   ```bash
   cd ../frontend
   npm install

   # Create frontend .env file
   sudo nano .env
   ```

   **Frontend .env content:**

   ```env
   PORT=3001
   ```

   ```bash
   npm run build

   # Copy build files to nginx directory
   sudo cp -r build/* /var/www/html/
   ```

### Step 5: Configure Nginx

1. **Create Nginx Configuration:**

   ```bash
   sudo nano /etc/nginx/sites-available/unidirectional-comm
   ```

2. **Nginx Configuration Content:**

   ```nginx
   server {
       listen 80;
       server_name your-domain.com your-ec2-public-ip;

       # Serve React app
       location / {
           root /var/www/html;
           index index.html;
           try_files $uri $uri/ /index.html;
       }

       # Proxy API requests to backend
       location /api {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

3. **Enable Site:**
   ```bash
   sudo ln -s /etc/nginx/sites-available/unidirectional-comm /etc/nginx/sites-enabled/
   sudo rm /etc/nginx/sites-enabled/default
   sudo nginx -t
   sudo systemctl restart nginx
   ```

### Step 6: Set Up SSL (Optional but Recommended)

1. **Get SSL Certificate:**

   ```bash
   sudo certbot --nginx -d your-domain.com
   ```

2. **Test SSL:**
   ```bash
   sudo certbot renew --dry-run
   ```

### Step 7: Configure Gmail SMTP

1. **Set Up Gmail App Password:**

   - Go to your Google Account settings
   - Enable 2-Factor Authentication
   - Generate an App Password for "Mail"
   - Use this password in your .env file

2. **Update Backend .env** with your Gmail credentials

### Step 8: Test Deployment

1. **Check Backend:**

   ```bash
   curl http://your-domain.com/api/test
   ```

2. **Check Frontend:**

   - Visit `http://your-domain.com` or `http://your-ec2-public-ip`
   - Register users and test functionality

3. **Access Your Live Application:**

   - **Using EC2 Public IP:** `http://your-ec2-public-ip`
   - **Using Domain:** `http://your-domain.com` (if configured)
   - **Using HTTPS:** `https://your-domain.com` (if SSL is set up)

4. **Monitor Logs:**
   ```bash
   pm2 logs backend
   sudo tail -f /var/log/nginx/error.log
   ```

## 🔧 Environment Variables Summary

### Backend (.env)

```env
PORT=3000
MONGO_URI=mongodb+srv://systemcommunication883_db_user:kmo2cKEaOtvxQRxn@cluster0.rx7lz1p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=jwt_random_string
GMAIL_USER=systemcommunication883
GMAIL_APP_PASSWORD=hegkwbzstgnwfaon
NODE_ENV=development
```

### Frontend (.env)

```env
PORT=3001
```

## 🌐 About HOST Configuration

### Do You Need HOST?

**Short Answer: NO** - You don't need to add a HOST setting for your deployment.

### Why HOST is Not Needed:

1. **Backend (Node.js/Express):**

   - Express defaults to `0.0.0.0` which means "listen on all interfaces"
   - This allows external connections to reach your server
   - Adding `HOST=0.0.0.0` would be redundant

2. **Frontend (React):**

   - React's dev server uses `localhost` by default
   - In production, Nginx serves the static files
   - The frontend doesn't need a HOST setting

3. **Nginx Configuration:**
   - Nginx handles the external connections
   - It proxies requests to your backend on `localhost:3000`
   - No HOST configuration needed

### When You WOULD Need HOST:

- **Docker containers** where you need to specify binding
- **Custom network configurations** with specific interface requirements
- **Development environments** where you want to restrict access

### Your Current Setup is Perfect:

```bash
# Backend listens on all interfaces (0.0.0.0:3000)
# Nginx serves frontend and proxies API calls
# No HOST configuration required
```

## 💰 Cost Estimation

**For 1 week demo:**

- **EC2 t3.micro:** ~$0.50 (Free tier eligible)
- **MongoDB Atlas:** $0 (Free tier)
- **Gmail SMTP:** $0 (free)
- **Route 53:** ~$0.50 (if using custom domain)
- **Data Transfer:** ~$1-2

**Total: ~$2-3 for a week**

## 🚨 Important Notes

1. **Security:**

   - Change default JWT secret
   - Use strong passwords
   - Regularly update system packages

2. **Monitoring:**

   - Set up CloudWatch alarms
   - Monitor EC2 instance health
   - Check PM2 process status

3. **Backup:**

   - MongoDB Atlas provides automatic backups
   - Consider backing up application code

4. **Scaling:**
   - For production, consider using Application Load Balancer
   - Use RDS for database if needed
   - Implement auto-scaling groups

## 🛠️ Troubleshooting

### Common Issues:

1. **Backend not starting:**

   ```bash
   pm2 logs backend
   pm2 restart backend
   ```

2. **Nginx errors:**

   ```bash
   sudo nginx -t
   sudo systemctl status nginx
   ```

3. **Database connection issues:**

   - Check MongoDB Atlas IP whitelist
   - Verify connection string format
   - Check network connectivity

4. **Email not sending:**
   - Verify Gmail App Password is correct
   - Check Gmail credentials in .env
   - Ensure 2FA is enabled on Gmail account

## 📞 Support

If you encounter issues:

1. Check the logs: `pm2 logs backend`
2. Verify all environment variables
3. Test individual components
4. Review AWS service status

## 🎯 Next Steps After Deployment

1. **Test all functionality:**

   - User registration (Type A & B)
   - Request creation and acceptance
   - Messaging system
   - Email notifications
   - Message deletion after 1 hour

2. **Monitor performance:**

   - Check response times
   - Monitor memory usage
   - Watch for errors

3. **Prepare for cleanup:**
   - Document any custom configurations
   - Save important data if needed
   - Plan shutdown process

---

**Ready to deploy?** Follow these steps and your Unidirectional Communication System will be live on AWS! 🚀
