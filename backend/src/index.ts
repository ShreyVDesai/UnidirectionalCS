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
  console.log(`Backend listening on port ${PORT}`);
});

// start scheduler (runs the cron tasks)
import './utils/scheduler';
