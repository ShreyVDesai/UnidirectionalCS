# Environment Setup Commands

Quick reference for creating .env files on your EC2 instance via SSH.

## 🚀 Quick Setup Commands

### 1. Connect to Your EC2 Instance

```bash
ssh -i your-key.pem ubuntu@your-ec2-public-ip
```

### 2. Navigate to Your Application

```bash
cd /home/ubuntu/UnidirectionalCS
```

### 3. Create Backend .env File

```bash
cd backend
nano .env
```

**Copy and paste this content:**

```env
PORT=3000
MONGO_URI=mongodb+srv://systemcommunication883_db_user:kmo2cKEaOtvxQRxn@cluster0.rx7lz1p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=jwt_random_string
GMAIL_USER=systemcommunication883
GMAIL_APP_PASSWORD=hegkwbzstgnwfaon
NODE_ENV=development
```

**Save and exit:** `Ctrl+X`, then `Y`, then `Enter`

### 4. Create Frontend .env File

```bash
cd ../frontend
nano .env
```

**Copy and paste this content:**

```env
PORT=3001
```

**Save and exit:** `Ctrl+X`, then `Y`, then `Enter`

### 5. Verify Files Created

```bash
# Check backend .env
cat ../backend/.env

# Check frontend .env
cat .env
```

## 🔧 Alternative: One-Line Commands

### Create Backend .env (One Command)

```bash
cd /home/ubuntu/UnidirectionalCS/backend && cat > .env << 'EOF'
PORT=3000
MONGO_URI=mongodb+srv://systemcommunication883_db_user:kmo2cKEaOtvxQRxn@cluster0.rx7lz1p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=jwt_random_string
GMAIL_USER=systemcommunication883
GMAIL_APP_PASSWORD=hegkwbzstgnwfaon
NODE_ENV=development
EOF
```

### Create Frontend .env (One Command)

```bash
cd /home/ubuntu/UnidirectionalCS/frontend && cat > .env << 'EOF'
PORT=3001
EOF
```

## ✅ Verification Commands

### Check Backend Environment

```bash
cd /home/ubuntu/UnidirectionalCS/backend
cat .env
```

### Check Frontend Environment

```bash
cd /home/ubuntu/UnidirectionalCS/frontend
cat .env
```

### Test Backend Connection

```bash
cd /home/ubuntu/UnidirectionalCS/backend
npm run build
pm2 start dist/index.js --name "backend"
pm2 logs backend
```

## 🚨 Troubleshooting

### If nano doesn't work:

```bash
# Use vi instead
vi .env
# Press 'i' to insert, paste content, press 'Esc', type ':wq', press 'Enter'
```

### If files don't exist:

```bash
# Create directories first
mkdir -p /home/ubuntu/UnidirectionalCS/backend
mkdir -p /home/ubuntu/UnidirectionalCS/frontend
```

### If permissions are wrong:

```bash
# Fix ownership
sudo chown -R ubuntu:ubuntu /home/ubuntu/UnidirectionalCS
```

## 📝 Notes

- **Backend PORT=3000**: This is where your API runs
- **Frontend PORT=3001**: This is for development (production uses Nginx on port 80)
- **NODE_ENV=development**: Change to 'production' for live deployment
- **No HOST needed**: Express defaults to 0.0.0.0 (all interfaces)

---

**Ready to deploy?** After creating these .env files, continue with the deployment steps! 🚀
