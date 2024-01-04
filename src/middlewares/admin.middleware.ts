import { NextFunction, Response } from 'express';

export const protectAdminRoutes = (req: any, res: Response, next: NextFunction) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error('You are not authorized as an admin');
  }
};
