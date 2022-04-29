import { BillingAddress } from 'chargebee-typescript/lib/resources/customer';
import { ShippingAddress } from 'chargebee-typescript/lib/resources/subscription';

export interface IcreateInvoice {
  billing_address: BillingAddress;
  shipping_address: ShippingAddress;
  sub_total: number;
  paid_at: number;
  customer_id: string;
}
