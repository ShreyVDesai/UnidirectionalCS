declare namespace Express {
  export interface Request {
    user?: { id: string; type: 'A' | 'B' };
  }
}
