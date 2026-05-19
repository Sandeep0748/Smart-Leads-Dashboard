import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET || 'secret';

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const authorization = req.headers.authorization;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Authorization token missing' });
    return;
  }

  const token = authorization.split(' ')[1];
  try {
    const payload = jwt.verify(token, jwtSecret) as { id: string; role: 'admin' | 'sales' };
    req.user = { id: payload.id, role: payload.role };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export function authorize(...roles: Array<'admin' | 'sales'>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }
    next();
  };
}
