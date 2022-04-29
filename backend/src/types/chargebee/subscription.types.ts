import { ITax, LineItem } from './estimate.types';

export interface IDeleteSubscriptionResponse {
  subscription: {
    id: string;
  };
  customer: {
    id: string;
    email: string;
    phone?: string;
  };
}

export interface ISubscriptionResponse {
  id: string;
  has_scheduled_changes: boolean;
}

export interface IRetrieveSubscriptionForCustomer {
  subscription: ISubscriptionResponse;
}

export type ICreateSubscriptionForCustomerResponse = IDeleteSubscriptionResponse;

export interface IFormattedEstimate {
  amountDue: number;
  subTotal: number;
  total: number;
  discountAmount?: number;
  description?: string;
  discountDescription?: string;
  taxes: ITax[];
  lineItems: LineItem[];
}

export interface IEstimateSubscriptionDetails {
  couponIds?: string[];
  trialAddOnIds?: string[];
  activeAddOnIds?: string[];
}

export type IUpdateSubscriptionResponse = IRetrieveSubscriptionForCustomer;
export interface IListSubscriptions {
  subscriptions: IRetrieveSubscriptionForCustomer[];
  nextOffset: string;
}

export interface IUpdateSubscriptionParams {
  price?: number;
  addons?: [];
}
