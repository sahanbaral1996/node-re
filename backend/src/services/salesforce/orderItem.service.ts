import { format } from 'date-fns';

import { Connection, SfDate } from 'jsforce';

import container from 'container';

import { IOrderItem } from 'types/salesforce/orderItem.types';

import { getCamelCasedObject } from 'helpers/salesforce.helpers';
import { map } from 'ramda';
import { SALESFORCE_TOKEN } from 'constants/app.constants';
import { ORDER_ITEM } from 'constants/salesforce/common.constants';

/**
 *
 * @param {Number} arg.accountId
 * @param {Number} arg.startDate
 * @param {Number} arg.endDate
 */
export const findOrderItemsInRange = async ({ accountId, startDate, endDate }): Promise<IOrderItem[]> => {
  const salesforceConnection: Connection = container.resolve(SALESFORCE_TOKEN);

  const formattedStartDate = format(Number.parseInt(startDate, 10), 'yyyy-MM-dd');
  const formattedEndDate = format(Number.parseInt(endDate, 10), 'yyyy-MM-dd');

  const response = await salesforceConnection
    .sobject(ORDER_ITEM)
    .find<IOrderItem>(
      {
        'Order.Account.ID': accountId,
        $or: [
          {
            $and: [
              {
                'Order.EffectiveDate': {
                  $gte: SfDate.toDateLiteral(formattedStartDate),
                },
              },
              {
                'Order.EffectiveDate': {
                  $lte: SfDate.toDateLiteral(formattedEndDate),
                },
              },
            ],
          },
          {
            $and: [
              {
                'Order.EndDate': {
                  $gte: SfDate.toDateLiteral(formattedStartDate),
                },
              },
              {
                'Order.EndDate': {
                  $lte: SfDate.toDateLiteral(formattedEndDate),
                },
              },
            ],
          },
        ],
        'Order.Published_to_Docent__c': true,
      },
      { '*': 1, 'Order.EffectiveDate': 1, 'Order.EndDate': 1, 'Order.Status': 1 }
    )
    .sort({ 'Order.EffectiveDate': 1 })
    .execute();
  return map(getCamelCasedObject, response);
};

/**
 *
 * @param {Number} accountId
 */
export const findAllOrderItems = async (accountId: string): Promise<IOrderItem[]> => {
  const salesforceConnection: Connection = container.resolve(SALESFORCE_TOKEN);

  const response = await salesforceConnection
    .sobject(ORDER_ITEM)
    .find(
      {
        'Order.Account.ID': accountId,
        'Order.Published_to_Docent__c': true,
      },
      { '*': 1, 'Order.EffectiveDate': 1, 'Order.EndDate': 1, 'Order.Status': 1 }
    )
    .sort({ 'Order.EffectiveDate': 1 })
    .execute();
  return map(getCamelCasedObject, response);
};

export const findOrderItemsByOrderId = async (orderId: string): Promise<IOrderItem[]> => {
  const salesforceConnection: Connection = container.resolve(SALESFORCE_TOKEN);

  const response = await salesforceConnection
    .sobject(ORDER_ITEM)
    .find<IOrderItem>({
      'Order.ID': orderId,
    })
    .execute();

  return map(getCamelCasedObject, response);
};
