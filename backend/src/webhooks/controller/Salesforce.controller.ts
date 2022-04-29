import * as customerService from 'services/customer.service';
import * as salesforceBillingService from 'services/salesforce/billingorder.service';
import { StatusCodes } from 'http-status-codes';

/**
 * Update Billing and Shipping Info.
 *
 * @param {Object} req Request
 * @param {Object} res Response
 */
export const updateBillingAndShippingInfo = async (req, res, next) => {
  try {
    const customer = await customerService.updateBillingAndShippingAddress(req.body);
    res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      customer,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Update Billing Order Info.
 *
 * @param {Object} req Request
 * @param {Object} res Response
 */
export const createBillingOrder = async (req, res, next) => {
  try {
    const billingData = await salesforceBillingService.createBillingOrder(req.body.content.invoice);

    res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      billingData,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Update Billing Order Info.
 *
 * @param {Object} req Request
 * @param {Object} res Response
 */
export const updatePaymentStatus = async (req, res, next) => {
  try {
    const billingData = await salesforceBillingService.updatePaymentStatus(req.body.content);

    res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      billingData,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Update Subscription paused or cancelled.
 *
 * @param {Object} req Request
 * @param {Object} res Response
 */
export const subscriptionChanged = async (req, res, next) => {
  try {
    const billingData = await salesforceBillingService.subcriptionChanged(req.body.content, req.body.event_type);

    res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      billingData,
    });
  } catch (err) {
    next(err);
  }
};
