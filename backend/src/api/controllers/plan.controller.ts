import { NextFunction, Request, Response } from 'express';

import * as planService from 'services/plan.service';

export const get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const currentUser = req.currentUser;
    const salesforceId = currentUser.salesforceReferenceId;
    const data = await planService.findAll(salesforceId);
    return res.json({ data });
  } catch (error) {
    next(error);
  }
};
