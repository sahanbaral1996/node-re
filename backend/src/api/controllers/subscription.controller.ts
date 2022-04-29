import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as subscriptionService from 'services/subscription.service';
import lang from 'lang';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { salesforceReferenceId: accountReferenceId, chargebeeReferenceId: customerReferenceId } = req.currentUser;

    await subscriptionService.setupSubscription(req.body, accountReferenceId, customerReferenceId);
    return res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      message: lang.setupSubscriptionSuccessfully,
    });
  } catch (error) {
    next(error);
  }
};

export const estimate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await subscriptionService.estimateSubscription(req.body);
    return res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const retreive = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { chargebeeReferenceId: customerReferenceId } = req.currentUser;
    const data = await subscriptionService.retreiveSubscription(customerReferenceId);
    return res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const reactivateSubscription = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { chargebeeReferenceId: customerReferenceId } = req.currentUser;
    const data = await subscriptionService.reactivateSubscription(customerReferenceId);
    return res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      data,
    });
  } catch (error) {
    next(error);
  }
};
