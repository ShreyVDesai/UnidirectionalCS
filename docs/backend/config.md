# Configuration Documentation

## ⚙️ **Configuration Overview**

The configuration system manages database connections, environment variables, and application settings.

## 📁 **Configuration Structure**

```
config/
└── db.ts        # Database connection configuration
```

## 🗄️ **Database Configuration**

**File**: `src/config/db.ts`

### **Purpose**

Handles MongoDB connection setup with comprehensive logging and error handling.

### **Dependencies**

```typescript
import mongoose from "mongoose";
```

### **Main Function**

```typescript
const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  console.log("[DB] Attempting to connect to MongoDB...");
  console.log("[DB] MONGO_URI:", uri ? "configured" : "not configured");

  if (!uri) {
    console.error("[DB] MONGO_URI is not defined in environment");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log("[DB] MongoDB connected successfully");
    console.log("[DB] Database name:", mongoose.connection.db?.databaseName);
  } catch (err) {
    console.error("[DB] Failed to connect to MongoDB:", err);
    process.exit(1);
  }
};

export default connectDB;
```

### **Features**

- **Environment Validation**: Checks for required environment variables
- **Comprehensive Logging**: Detailed connection status logging
- **Error Handling**: Graceful error handling with process exit
- **Connection Verification**: Confirms successful connection
- **Database Name Logging**: Logs the connected database name

### **Usage**

```typescript
// In src/index.ts
import connectDB from "./config/db";

// Connect to MongoDB
connectDB();
```

### **Environment Variables**

```env
# MongoDB Connection

### **Script Content**

```javascript
const fs = require("fs");
const path = require("path");

const envPath = path.join(__dirname, ".env");

if (!fs.existsSync(envPath)) {
  console.log("❌ .env file not found!");
  console.log("📝 Creating .env file with default values...");

  const defaultEnv = `MONGO_URI=mongodb://localhost:27017/unidirectional-comm
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Email Configuration (Gmail for development)
GMAIL_USER=your-gmail@gmail.com
GMAIL_APP_PASSWORD=your-gmail-app-password

# AWS Configuration (for production)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
SES_EMAIL=your-verified-email@example.com

PORT=3000
NODE_ENV=development`;

  fs.writeFileSync(envPath, defaultEnv);
  console.log("✅ .env file created with default values");
} else {
  console.log("✅ .env file exists");
}
```

### **Usage**

```bash
# Run setup script
npm run setup

# Or directly
node setup-env.js
```

## 📋 **Environment Variables Reference**

### **Required Variables**

```env
# Database
MONGO_URI=mongodb://localhost:27017/unidirectional-comm

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server
PORT=3000
NODE_ENV=development
```

### **Optional Variables**

```env
# Email Service (Gmail)
GMAIL_USER=your-gmail@gmail.com
GMAIL_APP_PASSWORD=your-gmail-app-password

# Email Service (AWS SES)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
SES_EMAIL=your-verified-email@example.com
```

### **Variable Descriptions**

#### **MONGO_URI**

- **Purpose**: MongoDB connection string
- **Format**: `mongodb://[username:password@]host[:port]/database`
- **Examples**:
  - Local: `mongodb://localhost:27017/unidirectional-comm`
  - Atlas: `mongodb+srv://user:pass@cluster.mongodb.net/unidirectional-comm`

#### **JWT_SECRET**

- **Purpose**: Secret key for JWT token signing
- **Security**: Must be kept secret and changed in production
- **Length**: Recommended minimum 32 characters

#### **PORT**

- **Purpose**: Server port number
- **Default**: 3000
- **Range**: 1-65535

#### **NODE_ENV**

- **Purpose**: Environment mode
- **Values**: `development`, `production`, `test`
- **Impact**: Affects logging, error handling, and email service selection

#### **GMAIL_USER**

- **Purpose**: Gmail address for sending emails
- **Format**: `username@gmail.com`
- **Requirement**: Must have 2FA enabled

#### **GMAIL_APP_PASSWORD**

- **Purpose**: Gmail App Password (not regular password)
- **Format**: 16-character password
- **Generation**: Generated in Google Account settings

#### **AWS_REGION**

- **Purpose**: AWS region for SES service
- **Examples**: `us-east-1`, `us-west-2`, `eu-west-1`

#### **AWS_ACCESS_KEY_ID**

- **Purpose**: AWS access key for SES
- **Format**: 20-character alphanumeric string

#### **AWS_SECRET_ACCESS_KEY**

- **Purpose**: AWS secret key for SES
- **Format**: 40-character base64 string

#### **SES_EMAIL**

- **Purpose**: Verified email address for SES
- **Requirement**: Must be verified in AWS SES console

## 🔒 **Security Configuration**

### **Production Security**

```env
# Production environment
NODE_ENV=production

# Strong JWT secret (32+ characters)
JWT_SECRET=your-very-long-and-secure-jwt-secret-key-for-production

# Secure MongoDB connection
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/unidirectional-comm

# AWS SES for production
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-production-access-key
AWS_SECRET_ACCESS_KEY=your-production-secret-key
SES_EMAIL=your-production-email@example.com
```

### **Development Security**

```env
# Development environment
NODE_ENV=development

# Development JWT secret
JWT_SECRET=development-jwt-secret

# Local MongoDB
MONGO_URI=mongodb://localhost:27017/unidirectional-comm

# Gmail for development
GMAIL_USER=your-dev-gmail@gmail.com
GMAIL_APP_PASSWORD=your-gmail-app-password
```

## 🧪 **Configuration Testing**

### **Environment Validation**

```typescript
// Test environment variables
const requiredVars = ["MONGO_URI", "JWT_SECRET"];
const missingVars = requiredVars.filter((varName) => !process.env[varName]);

if (missingVars.length > 0) {
  console.error("Missing required environment variables:", missingVars);
  process.exit(1);
}
```

### **Database Connection Test**

```typescript
// Test database connection
import connectDB from "./config/db";

try {
  await connectDB();
  console.log("Database connection successful");
} catch (error) {
  console.error("Database connection failed:", error);
}
```

### **Configuration Validation**

```typescript
// Validate configuration
const config = {
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
};

console.log("Configuration:", {
  mongoUri: config.mongoUri ? "configured" : "missing",
  jwtSecret: config.jwtSecret ? "configured" : "missing",
  port: config.port,
  nodeEnv: config.nodeEnv,
});
```

## 🚀 **Best Practices**

### **Environment Management**

- **Separate Files**: Use different `.env` files for different environments
- **Version Control**: Never commit `.env` files to version control
- **Default Values**: Provide sensible defaults in code
- **Validation**: Validate required environment variables at startup

### **Security**

- **Secret Management**: Use strong, unique secrets for production
- **Access Control**: Limit access to environment files
- **Rotation**: Regularly rotate secrets and keys
- **Monitoring**: Monitor for configuration changes

### **Development**

- **Setup Scripts**: Provide setup scripts for easy configuration
- **Documentation**: Document all environment variables
- **Examples**: Provide example configuration files
- **Validation**: Validate configuration at startup

### **Production**

- **Environment Variables**: Use system environment variables
- **Secret Management**: Use proper secret management services
- **Monitoring**: Monitor configuration and connection status
- **Backup**: Backup configuration (without secrets)

## 📊 **Configuration Monitoring**

### **Startup Logging**

```typescript
// Log configuration status
console.log("[CONFIG] Environment:", process.env.NODE_ENV);
console.log("[CONFIG] Port:", process.env.PORT || 3000);
console.log(
  "[CONFIG] MongoDB:",
  process.env.MONGO_URI ? "configured" : "missing"
);
console.log(
  "[CONFIG] JWT Secret:",
  process.env.JWT_SECRET ? "configured" : "missing"
);
console.log(
  "[CONFIG] Email Service:",
  process.env.GMAIL_USER
    ? "Gmail"
    : process.env.AWS_REGION
    ? "AWS SES"
    : "Console logging"
);
```

### **Health Checks**

```typescript
// Health check endpoint
app.get("/api/health", (req, res) => {
  const health = {
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    email:
      process.env.GMAIL_USER || process.env.AWS_REGION
        ? "configured"
        : "console",
  };

  res.json(health);
});
```

The configuration system provides a robust foundation for managing application settings and environment-specific configurations!
