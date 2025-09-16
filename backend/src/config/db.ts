import mongoose from 'mongoose';

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  console.log('[DB] Attempting to connect to MongoDB...');
  console.log('[DB] MONGO_URI:', uri ? 'configured' : 'not configured');
  
  if (!uri) {
    console.error('[DB] MONGO_URI is not defined in environment');
    process.exit(1);
  }
  
  try {
    await mongoose.connect(uri);
    console.log('[DB] MongoDB connected successfully');
    console.log('[DB] Database name:', mongoose.connection.db?.databaseName);
  } catch (err) {
    console.error('[DB] Failed to connect to MongoDB:', err);
    process.exit(1);
  }
};

export default connectDB;
