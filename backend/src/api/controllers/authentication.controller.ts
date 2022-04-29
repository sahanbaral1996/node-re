import { NextFunction, Request, Response } from 'express';
import * as authServices from 'services/authentication.service';

export const checkAuthIssue = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const email = req.query.email;

    const message = await authServices.getAuthIssue(email as string);

    res.json({
      message,
    });
  } catch (error) {
    next(error);
  }
};
