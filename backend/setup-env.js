// Environment setup verification script
const fs = require('fs');
const path = require('path');

console.log('🔧 Checking environment setup...\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env file not found!');
  console.log('📝 Creating .env file with default values...');
  
  const defaultEnv = `MONGO_URI=mongodb://localhost:27017/unidirectional-comm
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
AWS_REGION=us-east-1
SES_EMAIL=your-verified-email@example.com
PORT=3000
NODE_ENV=development`;

  fs.writeFileSync(envPath, defaultEnv);
  console.log('✅ .env file created with default values');
} else {
  console.log('✅ .env file exists');
}

// Check environment variables
require('dotenv').config();

const requiredVars = ['MONGO_URI', 'JWT_SECRET'];
const missingVars = [];

requiredVars.forEach(varName => {
  if (!process.env[varName]) {
    missingVars.push(varName);
  } else {
    console.log(`✅ ${varName}: configured`);
  }
});

if (missingVars.length > 0) {
  console.log(`❌ Missing required environment variables: ${missingVars.join(', ')}`);
  console.log('📝 Please update your .env file with the missing variables');
} else {
  console.log('✅ All required environment variables are configured');
}

console.log('\n🚀 Environment setup complete!');
console.log('📋 Next steps:');
console.log('1. Make sure MongoDB is running on your system');
console.log('2. Run: npm run dev');
console.log('3. Check the logs for any connection issues');
