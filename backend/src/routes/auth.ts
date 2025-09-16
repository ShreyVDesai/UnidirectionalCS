import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const router = Router();

// Register
router.post('/register', async (req: Request, res: Response) => {
  console.log('[REGISTER] Registration attempt:', { username: req.body.username, email: req.body.email, type: req.body.type });
  
  const { username, email, password, type } = req.body;
  if (!username || !email || !password || !type) {
    console.log('[REGISTER] Missing required fields');
    return res.status(400).json({ error: 'username,email,password,type required' });
  }
  
  if (!['A', 'B'].includes(type)) {
    console.log('[REGISTER] Invalid type:', type);
    return res.status(400).json({ error: 'type must be A or B' });
  }

  try {
    console.log('[REGISTER] Checking for existing user');
    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      console.log('[REGISTER] User already exists:', existing.email);
      return res.status(400).json({ error: 'username or email already exists' });
    }

    console.log('[REGISTER] Creating new user');
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashed, type });
    await user.save();
    console.log('[REGISTER] User created successfully:', user._id);
    return res.status(201).json({ message: 'User registered' });
  } catch (err) {
    console.error('[REGISTER] Registration error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Login
router.post('/login', async (req: Request, res: Response) => {
  console.log('[LOGIN] Login attempt:', { email: req.body.email });
  
  const { email, password } = req.body;
  if (!email || !password) {
    console.log('[LOGIN] Missing email or password');
    return res.status(400).json({ error: 'email and password required' });
  }

  try {
    console.log('[LOGIN] Looking up user by email');
    const user = await User.findOne({ email });
    if (!user) {
      console.log('[LOGIN] User not found');
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    console.log('[LOGIN] User found:', { id: user._id, type: user.type, username: user.username });
    
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      console.log('[LOGIN] Password mismatch');
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.log('[LOGIN] JWT_SECRET not configured');
      return res.status(500).json({ error: 'JWT_SECRET not configured' });
    }

    console.log('[LOGIN] Generating JWT token');
    const token = jwt.sign({ userId: user._id.toString(), type: user.type }, secret, { expiresIn: '2h' });
    console.log('[LOGIN] Login successful for user:', user._id);
    return res.json({ token, type: user.type });
  } catch (err) {
    console.error('[LOGIN] Login error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

export default router;
