import { format } from 'date-fns';

import { Connection, SfDate } from 'jsforce';

import container from 'container';

import { IOrder, IOrderDetails, OrderStatus, OrderTypes } from 'types/salesforce/order.types';

import { getCamelCasedObject } from 'helpers/salesforce.helpers';
import { head, map } from 'ramda';
import { SALESFORCE_TOKEN } from 'constants/app.constants';
import { ORDER, UPDATE_OPERATION } from 'constants/salesforce/common.constants';
import OperationException from 'api/exceptions/OperationException';

/**
 *
 * @param {Number} arg.accountId
 * @param {Number} arg.startDate
 * @param {Number} arg.endDate
 */
export const findOrdersInRange = async ({ accountId, startDate, endDate }): Promise<IOrder[]> => {
  const salesforceConnection: Connection = container.resolve(SALESFORCE_TOKEN);

  const formattedStartDate = format(Number.parseInt(startDate, 10), 'yyyy-MM-dd');
  const formattedEndDate = format(Number.parseInt(endDate, 10), 'yyyy-MM-dd');

  const response = await salesforceConnection
    .sobject(ORDER)
    .find<IOrder>({
      'Account.ID': accountId,
      $or: [
        {
          $and: [
            {
              EffectiveDate: {
                $gte: SfDate.toDateLiteral(formattedStartDate),
              },
            },
            {
              EffectiveDate: {
                $lte: SfDate.toDateLiteral(formattedEndDate),
              },
            },
          ],
        },
        {
          $and: [
            {
              EndDate: {
                $gte: SfDate.toDateLiteral(formattedStartDate),
              },
            },
            {
              EndDate: {
                $lte: SfDate.toDateLiteral(formattedEndDate),
              },
            },
          ],
        },
      ],
      Published_to_Docent__c: true,
    })
    .sort({ EffectiveDate: 1 })
    .execute();
  return map(getCamelCasedObject, response);
};

/**
 *
 * @param {Number} accountId
 */
export const findAllOrders = async (accountId): Promise<IOrder[]> => {
  const salesforceConnection: Connection = container.resolve(SALESFORCE_TOKEN);

  const response = await salesforceConnection
    .sobject(ORDER)
    .find({
      'Account.ID': accountId,
      Published_to_Docent__c: true,
    })
    .sort({ EffectiveDate: 1 })
    .execute();
  return map(getCamelCasedObject, response);
};

/**
 *
 * @param {Number} accountId
 */
export const findAllOrdersTillDate = async (accountId): Promise<IOrder[]> => {
  const salesforceConnection: Connection = container.resolve(SALESFORCE_TOKEN);

  const today = format(new Date(), 'yyyy-MM-dd');

  const response = await salesforceConnection
    .sobject('Order')
    .find<IOrder>({
      'Account.ID': accountId,
      Published_to_Docent__c: true,
      EffectiveDate: { $lte: SfDate.toDateLiteral(today) },
    })
    .sort({ EffectiveDate: -1 })
    .execute();
  return map(getCamelCasedObject, response);
};

/**
 *
 * @param {String} accountId
 */
export const findTrailOrder = async (accountId: string, apiName: string[]): Promise<IOrder> => {
  const salesforceConnection: Connection = container.resolve(SALESFORCE_TOKEN);

  const response = await salesforceConnection
    .sobject(ORDER)
    .findOne({
      'Account.ID': accountId,
      Status: { $in: apiName },
      Type: OrderTypes.Trial,
    })
    .execute();
  return getCamelCasedObject(response);
};

export const findOrderById = async (orderId: string): Promise<IOrder> => {
  try {
    const salesforceConnection: Connection = container.resolve(SALESFORCE_TOKEN);
    const response = await salesforceConnection.sobject(ORDER).retrieve(orderId);
    return getCamelCasedObject(response);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateOrder = async (orderDetails: Partial<IOrderDetails>) => {
  const salesforceConnection: Connection = container.resolve(SALESFORCE_TOKEN);
  const response = await salesforceConnection.sobject(ORDER).update({
    Id: orderDetails.id,
    Status: orderDetails.status,
  });

  if (!response.success) {
    throw new OperationException(response.errors, ORDER, UPDATE_OPERATION);
  }
  return response;
};

export const findPublishedOrderNearTodayForAccountId = async (accountId: string): Promise<IOrder[]> => {
  const salesforceConnection: Connection = container.resolve(SALESFORCE_TOKEN);

  const today = format(new Date(), 'yyyy-MM-dd');

  const response = await salesforceConnection
    .sobject(ORDER)
    .find({
      'Account.ID': accountId,
      Published_to_Docent__c: true,
      EffectiveDate: { $gte: SfDate.toDateLiteral(today) },
      Status: OrderStatus.ShipmentsScheduled,
    })
    .sort({ EffectiveDate: 1 })
    .limit(1);
  return map(getCamelCasedObject, response);
};

export const approveOrder = async (orderId: string) => {
  const salesforceConnection: Connection = container.resolve(SALESFORCE_TOKEN);
  const response = await salesforceConnection.sobject(ORDER).update({
    Id: orderId,
    Patient_Approved__c: true,
  });

  if (!response.success) {
    throw new OperationException(response.errors, ORDER, UPDATE_OPERATION);
  }

  return response;
};

/**
 *
 * @param {String} accountId
 */
export const findSingleOrder = async (accountId: string): Promise<IOrder> => {
  const salesforceConnection: Connection = container.resolve(SALESFORCE_TOKEN);

  const order = await salesforceConnection
    .sobject(ORDER)
    .find({
      'Account.ID': accountId,
      Published_to_Docent__c: true,
    })
    .sort({ EffectiveDate: -1 })
    .limit(1);
  return getCamelCasedObject(head(order));
};
