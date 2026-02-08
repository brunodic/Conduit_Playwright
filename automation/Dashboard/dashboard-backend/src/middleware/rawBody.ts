import { Request, Response, NextFunction } from 'express';

// Middleware to capture raw body for webhook signature verification
export const rawBodyMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  if (req.headers['content-type']?.includes('application/json')) {
    let data = '';
    req.setEncoding('utf8');
    req.on('data', (chunk: string) => {
      data += chunk;
    });
    req.on('end', () => {
      (req as any).rawBody = data;
      try {
        req.body = JSON.parse(data);
      } catch (e) {
        req.body = {};
      }
      next();
    });
  } else {
    next();
  }
};

