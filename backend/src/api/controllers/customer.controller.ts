import { StatusCodes } from 'http-status-codes';

import * as customerService from 'services/customer.service';

import { NextFunction, Request, Response } from 'express';
import APIError from 'api/exceptions/Error';

import lang from 'lang';

import { AUTHORIZATION_HEADER, AUTHORIZATION_VALUE_PREFIX } from 'constants/authentication.constants';
import { getToken } from 'utils/auth';
import AlreadyExistsException from 'api/exceptions/AlreadyExistsException';

export const createCustomer = async (req, res, next) => {
  try {
    const session = await customerService.createCustomer(req.body);
    return res.status(StatusCodes.OK).json(session);
  } catch (error) {
    next(error);
  }
};

export const getCustomerInformation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { salesforceReferenceId: accountId, chargebeeReferenceId: chargebeeId, id, groups } = req.currentUser;

    const customerInformation = await customerService.getCustomerInformation(accountId, groups, req.currentUser);
    return res.json({
      code: StatusCodes.OK,
      data: {
        ...customerInformation,
        chargebeeId,
        salesforceId: accountId,
        id,
      },
    });
  } catch (error) {
    next(error);
  }
};
export const userReassessment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.currentUser) {
      const { salesforceReferenceId: accountId } = req.currentUser;
      const customerInformation = await customerService.saveReassessment(accountId, req.body);

      return res.json({
        code: StatusCodes.OK,
        data: {
          ...customerInformation,
        },
      });
    } else {
      throw new APIError('Unauthorized', StatusCodes.UNAUTHORIZED);
    }
  } catch (error) {
    next(error);
  }
};

export const getUserAssessment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { salesforceReferenceId: accountId } = req.currentUser;
    const customerInformation = await customerService.getAssessment(accountId);

    return res.json({
      code: StatusCodes.OK,
      data: {
        ...customerInformation,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createCase = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.currentUser) {
      const { salesforceReferenceId: accountId } = req.currentUser;

      const { description, selfies } = req.body;

      await customerService.createCustomerCase({ description, selfies, accountId });

      return res.json({
        code: StatusCodes.OK,
        data: {
          message: lang.caseCreated,
        },
      });
    } else {
      throw new APIError('Unauthorized', StatusCodes.UNAUTHORIZED);
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Get Order Review details
 *
 * @param {Object} req Request
 * @param {Object} res Response
 */

export const orderReviewDetails = async (req: Request, res, next) => {
  try {
    if (req.currentUser) {
      const { salesforceReferenceId: accountId } = req.currentUser;

      const orderReviewDetails = await customerService.getOrderReviewDetails(accountId);

      return res.json({
        code: StatusCodes.OK,
        data: orderReviewDetails,
      });
    }
    throw new APIError(StatusCodes.UNAUTHORIZED);
  } catch (error) {
    next(error);
  }
};

export const declineOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.currentUser) {
      const { description } = req.body;
      const { orderId } = req.params;

      const { salesforceReferenceId: accountId } = req.currentUser;

      await customerService.declineOrder({ orderId, description, accountId });

      return res.json({
        code: StatusCodes.OK,
        data: {
          message: lang.declinedOrder,
        },
      });
    }
    throw new APIError(StatusCodes.UNAUTHORIZED);
  } catch (error) {
    next(error);
  }
};

/**
 * Approve Order Review
 *
 * @param {Object} req Request
 * @param {Object} res Response
 */
export const approveOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.params;

    await customerService.approveOrder(orderId);

    return res.json({
      code: StatusCodes.OK,
      data: {
        message: lang.approvedOrder,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllAddonOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await customerService.getAllAddonOrder();

    return res.json({
      code: StatusCodes.OK,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const currentUser = req.currentUser;
    const data = await customerService.update(currentUser, req.body);
    return res.json({
      data: {
        ...data,
        message: lang.emailChangeSuccess,
      },
    });
  } catch (error) {
    if (error instanceof AlreadyExistsException) {
      return next(new APIError(error.message, StatusCodes.CONFLICT));
    }
    return next(error);
  }
};

export const updatePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const authorization = req.header(AUTHORIZATION_HEADER);
    const accessToken = getToken(AUTHORIZATION_VALUE_PREFIX, authorization as string);
    const data = await customerService.changePassword({ accessToken, oldPassword, newPassword });
    return res.json({
      data: {
        ...data,
        message: lang.passwordChangeSuccess,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateName = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, salesforceReferenceId } = req.currentUser;
    const data = await customerService.updateName(email, salesforceReferenceId, req.body);
    return res.json({
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAddon = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { chargebeeReferenceId, salesforceReferenceId } = req.currentUser;
    const addonId = req.body.addonIds;
    const data = await customerService.deleteAddon(addonId, chargebeeReferenceId, salesforceReferenceId);
    return res.json({ data });
  } catch (error) {
    next(error);
  }
};

export const addAddon = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { salesforceReferenceId, chargebeeReferenceId } = req.currentUser;
    const addonId = req.body.addonIds;
    const data = await customerService.addAddon(addonId, salesforceReferenceId, chargebeeReferenceId);
    return res.json({ data });
  } catch (error) {
    next(error);
  }
};

export const addReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { salesforceReferenceId } = req.currentUser;
    const { yourExperience, rating, recommend, picture } = req.body;

    const data = await customerService.addReview(salesforceReferenceId, { yourExperience, rating, recommend, picture });

    return res.json({ data });
  } catch (error) {
    next(error);
  }
};
