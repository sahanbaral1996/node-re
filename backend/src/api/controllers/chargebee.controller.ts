import { StatusCodes } from 'http-status-codes';

import * as chargebeeCustomerService from 'services/chargebee/customer.service';

import { Request } from 'express';

/**
 * Customer Register on chargebee.
 *
 * @param {Object} req Request
 * @param {Object} res Response
 */
export const register = async (req: Request, res) => {
  try {
    const { customer } = await chargebeeCustomerService.create(req.body);

    return res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      data: { ...customer },
    });
  } catch (err) {
    return res.status(err.http_status_code || StatusCodes.BAD_REQUEST).send(err.message);
  }
};

/**
 * Request chargebee hosted page.
 *
 * @param {Object} req Request
 * @param {Object} res Response
 */
export const hostedPage = async (req: Request, res, next) => {
  try {
    const { planId, customerId } = req.body;

    const { hosted_page } = await chargebeeCustomerService.getHostedPage(planId, customerId);

    return res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      data: { ...hosted_page },
    });
  } catch (err) {
    err.status = err.http_status_code || StatusCodes.BAD_REQUEST;
    next(err);
  }
};

/**
 * Request chargebee hosted customer portal.
 *
 * @param {Object} req Request
 * @param {Object} res Response
 */
export const customerPortal = async (req: Request, res, next) => {
  try {
    const { chargebeeReferenceId: customerId } = req.currentUser;

    const { portal_session } = await chargebeeCustomerService.getHostedPortal(customerId);

    return res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      data: { ...portal_session },
    });
  } catch (err) {
    err.status = err.http_status_code || StatusCodes.BAD_REQUEST;
    next(err);
  }
};
