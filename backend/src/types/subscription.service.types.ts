import { IAddress } from './chargebee/common.types';

export interface ISetupSubscription extends IProductAddOnDetails {
  token: string;
  shippingAddress: IAddress;
  billingAddress: IAddress;
  couponIds?: string[];
  phone?: string;
  isSameAsShippingAddress: boolean;
  addOnConfigurationIds?: string[];
}

export interface IProductAddOnDetails {
  addOnConfigurationIds?: string[];
  trialAddOnIds?: string[];
  activeAddOnIds?: string[];
}
