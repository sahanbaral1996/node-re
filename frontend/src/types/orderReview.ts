import { ESkinCondition } from './personalizedSolution';
import { IOrderItem, IMappedOrderItems } from './plan';

export interface IOrderReview {
  skinConditions: ESkinCondition[];
  orderReviewDetails: IOrderReviewDetails;
  orderItems: IMappedOrderItems[];
}

export interface IOrderReviewDetails {
  aTPWhatarewetreating: string;
  aTPYourRX: string;
  aTPLetsgetstarted: string;
  aTPLifestylefactorstoconsider: string;
  effectiveDate: string;
  endDate: string;
  id: string;
  status: string;
  productName: string;
  goals: string[];
}
