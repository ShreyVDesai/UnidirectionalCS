"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const router = (0, express_1.Router)();
// Register
router.post('/register', async (req, res) => {
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
        const existing = await User_1.default.findOne({ $or: [{ email }, { username }] });
        if (existing) {
            console.log('[REGISTER] User already exists:', existing.email);
            return res.status(400).json({ error: 'username or email already exists' });
        }
        console.log('[REGISTER] Creating new user');
        const hashed = await bcryptjs_1.default.hash(password, 10);
        const user = new User_1.default({ username, email, password: hashed, type });
        await user.save();
        console.log('[REGISTER] User created successfully:', user._id);
        return res.status(201).json({ message: 'User registered' });
    }
    catch (err) {
        console.error('[REGISTER] Registration error:', err);
        return res.status(500).json({ error: 'Server error' });
    }
});
// Login
router.post('/login', async (req, res) => {
    console.log('[LOGIN] Login attempt:', { email: req.body.email });
    const { email, password } = req.body;
    if (!email || !password) {
        console.log('[LOGIN] Missing email or password');
        return res.status(400).json({ error: 'email and password required' });
    }
    try {
        console.log('[LOGIN] Looking up user by email');
        const user = await User_1.default.findOne({ email });
        if (!user) {
            console.log('[LOGIN] User not found');
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        console.log('[LOGIN] User found:', { id: user._id, type: user.type, username: user.username });
        const ok = await bcryptjs_1.default.compare(password, user.password);
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
        const token = jsonwebtoken_1.default.sign({ userId: user._id.toString(), type: user.type }, secret, { expiresIn: '2h' });
        console.log('[LOGIN] Login successful for user:', user._id);
        return res.json({ token, type: user.type });
    }
    catch (err) {
        console.error('[LOGIN] Login error:', err);
        return res.status(500).json({ error: 'Server error' });
    }
});
exports.default = router;
