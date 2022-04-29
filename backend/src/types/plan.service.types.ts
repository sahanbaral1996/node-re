import { IContentVersion } from './salesforce/document.types';
import { IOrder } from './salesforce/order.types';
import { IOrderItem } from './salesforce/orderItem.types';

export interface IPlan extends Partial<IOrder> {
  goals: string[];
  photos: Partial<IContentVersion>[];
  startDate: string;
  endDate: string;
  orderItems: Partial<IOrderItem>[];
}
