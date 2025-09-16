import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';

import connectDB from './config/db';
import authRoutes from './routes/auth';
import requestRoutes from './routes/requests';
import messageRoutes from './routes/messages';

// connect to MongoDB
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Test endpoint
app.get('/api/test', (req, res) => {
  console.log('[TEST] Test endpoint called');
  res.json({ message: 'Backend is working!', timestamp: new Date().toISOString() });
});

// Test scheduler endpoint
app.get('/api/test-scheduler', async (req, res) => {
  try {
    console.log('[TEST] Manual scheduler trigger requested');
    const { runScheduledTasks } = await import('./utils/scheduler');
    const result = await runScheduledTasks();
    res.json({ 
      message: 'Scheduler test completed', 
      result,
      timestamp: new Date().toISOString() 
    });
  } catch (err) {
    console.error('[TEST] Scheduler test error:', err);
    res.status(500).json({ error: 'Scheduler test failed', details: err.message });
  }
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/messages', messageRoutes);

// Serve frontend in production (optional)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'frontend', 'build')));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`[SERVER] Backend listening on port ${PORT}`);
  console.log(`[SERVER] Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`[SERVER] JWT_SECRET configured: ${process.env.JWT_SECRET ? 'Yes' : 'No'}`);
  console.log(`[SERVER] MONGO_URI configured: ${process.env.MONGO_URI ? 'Yes' : 'No'}`);
});

// start scheduler (runs the cron tasks)
console.log('[SERVER] Starting scheduler...');
import './utils/scheduler';
