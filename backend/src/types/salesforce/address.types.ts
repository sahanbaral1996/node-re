export interface IAddress {
  country: string;
  state: string;
  line1: string;
  line2?: string;
  city: string;
  zip: string;
}

export type BillingAddress = IAddress;

export type ShippingAddress = IAddress;
export interface IAddressInformation {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}
