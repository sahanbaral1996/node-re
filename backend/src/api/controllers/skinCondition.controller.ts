import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { findSingleOrder } from 'services/salesforce/order.service';

import APIError from 'api/exceptions/Error';

/**
 * Fetch Skin Condition Details
 *
 * @param {Object} req Request
 * @param {Object} res Response
 */
export const getDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.currentUser) {
      const { salesforceReferenceId: accountId } = req.currentUser;

      const data = await findSingleOrder(accountId);

      return res.json({
        code: StatusCodes.OK,
        data: {
          details: data.aTPWhatarewetreating,
        },
      });
    } else {
      throw new APIError('Unauthorized', StatusCodes.UNAUTHORIZED);
    }
  } catch (error) {
    next(error);
  }
};
