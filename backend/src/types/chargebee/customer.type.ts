import { IProductAddOnDetails } from 'types/subscription.service.types';
import { IAddress } from './common.types';

export interface IUpdateCustomer {
  email?: string;
}

export interface ICreateSubscription extends IProductAddOnDetails {
  shippingAddress: IAddress;
  billingAddress: IAddress;
  token: string;
  couponIds?: string[];
  phone?: string;
}

interface ICustomer {
  id: string;
  email: string;
}

export interface ICustomerResponse {
  customer: ICustomer;
}
