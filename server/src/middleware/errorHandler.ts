import { NextFunction, Request, Response } from 'express';

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
  const status = (res.statusCode && res.statusCode !== 200) ? res.statusCode : 500;
  res.status(status).json({
    message: err.message || 'Server Error',
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
}
