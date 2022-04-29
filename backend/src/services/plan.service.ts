import * as salesforceOrderService from './salesforce/order.service';
import * as salesforceOrderItemService from './salesforce/orderItem.service';
import * as salesforceDocumentService from './salesforce/document.service';
import { IOrder } from 'types/salesforce/order.types';
import { IOrderItem } from 'types/salesforce/orderItem.types';

import { getIndividualGoals } from 'helpers/salesforce.helpers';
import { SELFIE_PREFIX } from 'constants/salesforce/document.constants';
import { IContentVersion } from 'types/salesforce/document.types';
import { isBeforeDate, isBetweenDates } from 'utils/date';
import { IPlan } from 'types/plan.service.types';

const groupOrderItemsByOrderId = (orders: IOrder[], orderItems: IOrderItem[], contentVersions: IContentVersion[]) => {
  const orderMap = new Map<string, IPlan>();

  orders.forEach(order => {
    const {
      effectiveDate,
      endDate,
      aTPWhentouseyourDocentRich,
      aTPApplication,
      aTPDosandDonts,
      aTPGoodtoKnows,
      status,
      aTPYourRX,
      aTPLifestylefactorstoconsider,
      aTPYourWash,
      aTPYourOralMedication,
      aTPYourSpotTreatment,
    } = order;

    orderMap.set(order.id, {
      goals: getIndividualGoals(order),
      startDate: effectiveDate,
      endDate: endDate,
      photos: [],
      orderItems: [],
      aTPWhentouseyourDocentRich,
      aTPApplication,
      aTPDosandDonts,
      aTPGoodtoKnows,
      status,
      aTPYourRX,
      aTPLifestylefactorstoconsider,
      aTPYourWash,
      aTPYourOralMedication,
      aTPYourSpotTreatment,
    });
  });

  let contentVersionIndex = 0;

  for (let orderIndex = 0; orderIndex < orders.length; orderIndex++) {
    const currentOrder = orderMap.get(orders[orderIndex].id);

    if (contentVersionIndex === contentVersions.length) {
      break;
    }

    if (currentOrder) {
      while (contentVersionIndex < contentVersions.length) {
        const currentContentVersion = contentVersions[contentVersionIndex];
        const orderStartDate = new Date(currentOrder.startDate);
        const orderEndDate = new Date(currentOrder.endDate);
        const contentVersionCreatedDate = new Date(currentContentVersion.createdDate);
        if (orderIndex === 0 && isBeforeDate(orderEndDate, contentVersionCreatedDate)) {
          currentOrder.photos.push({
            id: currentContentVersion.id,
            srcUrl: currentContentVersion.srcUrl,
            createdDate: currentContentVersion.createdDate,
          });
        } else if (isBetweenDates(orderStartDate, orderEndDate, contentVersionCreatedDate)) {
          currentOrder.photos.push({
            id: currentContentVersion.id,
            srcUrl: currentContentVersion.srcUrl,
            createdDate: currentContentVersion.createdDate,
          });
        } else {
          break;
        }
        contentVersionIndex++;
      }
    }
  }
  orderItems.forEach(orderItem => {
    const order = orderMap.get(orderItem.orderId);
    const { morningEvening, fullName, productFamily, applicationInstructions } = orderItem;

    if (order) {
      order.orderItems.push({
        fullName,
        morningEvening,
        productFamily,
        applicationInstructions,
      });
    }
  });

  return orderMap;
};

export const findAll = async (accountId: string) => {
  try {
    const [orders, orderItems, contentVersions] = await Promise.all([
      salesforceOrderService.findAllOrders(accountId),
      salesforceOrderItemService.findAllOrderItems(accountId),
      salesforceDocumentService.findAllContentVersions({ accountId, prefix: SELFIE_PREFIX }),
    ]);

    return {
      plans: Array.from(groupOrderItemsByOrderId(orders, orderItems, contentVersions).values()),
    };
  } catch (error) {
    throw error;
  }
};
