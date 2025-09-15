import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface TokenPayload { userId: string; type: 'A' | 'B'; iat?: number; exp?: number; }

export default function auth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'No authorization header' });
  const parts = header.split(' ');
  if (parts.length !== 2) return res.status(401).json({ error: 'Invalid authorization header format' });
  const token = parts[1];
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) return res.status(500).json({ error: 'JWT_SECRET not configured' });
    const decoded = jwt.verify(token, secret) as TokenPayload;
    req.user = { id: decoded.userId, type: decoded.type };
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid token' });
  }
}
