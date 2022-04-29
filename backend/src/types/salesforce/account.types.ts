import { IAddress } from './address.types';
import { ContactStatus } from './contact.types';

export interface ICreateAccount {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob?: string;
  chargeBeeId?: string;
  recordTypeId: string;
  leadId: string;
  status?: string;
  noppToa?: boolean;
  newsletter?: boolean;
  state?: string;
  isInPersonSignUp?: boolean;
}

export interface IUpdateAccountDetails {
  accountId: string;
  status?: ContactStatus;
  email?: string;
  chargebeeCustomerId?: string;
  phone?: string;
  isSameAsShippingAddress?: boolean;
  hasUploadedShelfie?: boolean;
}
export interface IUpdateChargbeeIdInAccount {
  chargeBeeId: string;
  Id: string;
}
export interface IAccountRecord {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  status: ContactStatus;
  trialEndDateFormula: Date;
  leadId: string;
  assmtActive?: boolean;
}
export interface IUpdateBillingAdnShippingAddress {
  billingAddress: IAddress | null;
  shippingAddress: IAddress | null;
}
