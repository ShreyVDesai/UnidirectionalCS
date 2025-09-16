#!/bin/bash

# AWS EC2 Server Setup Script for Unidirectional Communication System
# Run this script on your Ubuntu EC2 instance after connecting via SSH

set -e  # Exit on any error

echo "🚀 Starting server setup for Unidirectional Communication System..."

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
echo "📦 Installing Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify Node.js installation
echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"

# Install PM2 globally
echo "📦 Installing PM2..."
sudo npm install -g pm2

# Install Nginx
echo "📦 Installing Nginx..."
sudo apt install nginx -y

# Install Git
echo "📦 Installing Git..."
sudo apt install git -y

# Install Certbot for SSL
echo "📦 Installing Certbot..."
sudo apt install certbot python3-certbot-nginx -y

# Install additional useful tools
echo "📦 Installing additional tools..."
sudo apt install htop curl wget unzip -y

# Start and enable Nginx
echo "🔧 Starting Nginx..."
sudo systemctl start nginx
sudo systemctl enable nginx

# Create application directory
echo "📁 Creating application directory..."
mkdir -p /home/ubuntu/apps
cd /home/ubuntu/apps

# Set up firewall (if ufw is available)
echo "🔒 Configuring firewall..."
if command -v ufw &> /dev/null; then
    sudo ufw allow ssh
    sudo ufw allow 'Nginx Full'
    sudo ufw --force enable
fi

# Create PM2 ecosystem file
echo "📝 Creating PM2 ecosystem file..."
cat > /home/ubuntu/apps/ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'unidirectional-comm-backend',
    script: './backend/dist/index.js',
    cwd: '/home/ubuntu/apps/UnidirectionalCS/backend',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/home/ubuntu/logs/backend-error.log',
    out_file: '/home/ubuntu/logs/backend-out.log',
    log_file: '/home/ubuntu/logs/backend-combined.log',
    time: true
  }]
};
EOF

# Create logs directory
echo "📁 Creating logs directory..."
mkdir -p /home/ubuntu/logs

# Create Nginx configuration
echo "📝 Creating Nginx configuration..."
sudo tee /etc/nginx/sites-available/unidirectional-comm > /dev/null << 'EOF'
server {
    listen 80;
    server_name _;
    
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
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}
EOF

# Enable the site
echo "🔧 Enabling Nginx site..."
sudo ln -sf /etc/nginx/sites-available/unidirectional-comm /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
echo "🧪 Testing Nginx configuration..."
sudo nginx -t

# Restart Nginx
echo "🔄 Restarting Nginx..."
sudo systemctl restart nginx

# Create deployment script
echo "📝 Creating deployment script..."
cat > /home/ubuntu/apps/deploy.sh << 'EOF'
#!/bin/bash

set -e

echo "🚀 Deploying Unidirectional Communication System..."

# Navigate to app directory
cd /home/ubuntu/apps/UnidirectionalCS

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin main

# Backend deployment
echo "🔧 Deploying backend..."
cd backend
npm install --production
npm run build

# Frontend deployment
echo "🔧 Deploying frontend..."
cd ../frontend
npm install --production
npm run build

# Copy frontend build to Nginx
echo "📁 Copying frontend build..."
sudo cp -r build/* /var/www/html/

# Restart backend with PM2
echo "🔄 Restarting backend..."
cd ../backend
pm2 restart ecosystem.config.js

echo "✅ Deployment completed successfully!"
echo "🌐 Your application should be available at: http://$(curl -s ifconfig.me)"
EOF

chmod +x /home/ubuntu/apps/deploy.sh

# Create environment setup script
echo "📝 Creating environment setup script..."
cat > /home/ubuntu/apps/setup-env.sh << 'EOF'
#!/bin/bash

echo "🔧 Setting up environment variables..."

# Create backend .env file
cat > /home/ubuntu/apps/UnidirectionalCS/backend/.env << 'ENVEOF'
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/unidirectional-comm
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Gmail SMTP Configuration (for Nodemailer)
GMAIL_USER=your-gmail@gmail.com
GMAIL_APP_PASSWORD=your-gmail-app-password

PORT=3000
NODE_ENV=production
ENVEOF

echo "✅ Environment file created at: /home/ubuntu/apps/UnidirectionalCS/backend/.env"
echo "📝 Please edit this file with your actual values:"
echo "   - MongoDB connection string"
echo "   - JWT secret"
echo "   - Gmail credentials (user + app password)"
echo ""
echo "To edit: nano /home/ubuntu/apps/UnidirectionalCS/backend/.env"
echo ""
echo "📧 Gmail Setup Instructions:"
echo "   1. Enable 2-Factor Authentication on your Gmail account"
echo "   2. Generate an App Password:"
echo "      - Go to Google Account > Security > App passwords"
echo "      - Select 'Mail' and generate password"
echo "      - Use this password in GMAIL_APP_PASSWORD"
EOF

chmod +x /home/ubuntu/apps/setup-env.sh

# Create monitoring script
echo "📝 Creating monitoring script..."
cat > /home/ubuntu/apps/monitor.sh << 'EOF'
#!/bin/bash

echo "📊 System Status Report"
echo "======================"

echo ""
echo "🖥️  System Resources:"
echo "CPU Usage: $(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)%"
echo "Memory Usage: $(free | grep Mem | awk '{printf("%.1f%%", $3/$2 * 100.0)}')"
echo "Disk Usage: $(df -h / | awk 'NR==2{printf "%s", $5}')"

echo ""
echo "🌐 Nginx Status:"
sudo systemctl is-active nginx

echo ""
echo "⚙️  PM2 Status:"
pm2 status

echo ""
echo "📝 Recent Backend Logs:"
pm2 logs --lines 10

echo ""
echo "🌍 Application URL:"
echo "http://$(curl -s ifconfig.me)"
EOF

chmod +x /home/ubuntu/apps/monitor.sh

# Set up log rotation
echo "📝 Setting up log rotation..."
sudo tee /etc/logrotate.d/unidirectional-comm > /dev/null << 'EOF'
/home/ubuntu/logs/*.log {
    daily
    missingok
    rotate 7
    compress
    delaycompress
    notifempty
    create 644 ubuntu ubuntu
    postrotate
        pm2 reloadLogs
    endscript
}
EOF

echo ""
echo "✅ Server setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Clone your repository:"
echo "   cd /home/ubuntu/apps"
echo "   git clone https://github.com/ShreyVDesai/UnidirectionalCS.git"
echo ""
echo "2. Set up environment variables:"
echo "   ./setup-env.sh"
echo "   nano /home/ubuntu/apps/UnidirectionalCS/backend/.env"
echo ""
echo "3. Deploy the application:"
echo "   ./deploy.sh"
echo ""
echo "4. Monitor the system:"
echo "   ./monitor.sh"
echo ""
echo "🌐 Your application will be available at: http://$(curl -s ifconfig.me)"
echo ""
echo "📚 Useful commands:"
echo "   pm2 status          - Check PM2 processes"
echo "   pm2 logs            - View application logs"
echo "   sudo systemctl status nginx - Check Nginx status"
echo "   htop                - Monitor system resources"
echo ""
echo "🎉 Setup complete! Happy deploying!"
