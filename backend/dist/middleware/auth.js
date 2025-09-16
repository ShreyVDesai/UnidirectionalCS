"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = auth;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function auth(req, res, next) {
    console.log('[AUTH] Starting authentication check');
    const header = req.headers.authorization;
    console.log('[AUTH] Authorization header:', header);
    if (!header) {
        console.log('[AUTH] No authorization header found');
        return res.status(401).json({ error: 'No authorization header' });
    }
    const parts = header.split(' ');
    if (parts.length !== 2) {
        console.log('[AUTH] Invalid authorization header format:', parts);
        return res.status(401).json({ error: 'Invalid authorization header format' });
    }
    const token = parts[1];
    console.log('[AUTH] Token extracted:', token ? 'present' : 'missing');
    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            console.log('[AUTH] JWT_SECRET not configured');
            return res.status(500).json({ error: 'JWT_SECRET not configured' });
        }
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        console.log('[AUTH] Token decoded successfully:', decoded);
        req.user = { id: decoded.userId, type: decoded.type };
        console.log('[AUTH] User set on request:', req.user);
        next();
    }
    catch (err) {
        console.log('[AUTH] Token verification failed:', err);
        return res.status(403).json({ error: 'Invalid token' });
    }
}
