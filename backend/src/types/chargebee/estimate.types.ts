export interface ICreateSubscriptionEstimate {
  couponIds?: string[];
  isAddonExcluded?: boolean;
  trialAddOnIds?: string[];
  activeAddOnIds?: string[];
  zip?: string;
}

export interface ICreateSubscriptionEstimateResponse {
  estimate: Estimate;
}

export interface Estimate {
  createdAt: number;
  object: string;
  subscriptionEstimate: SubscriptionEstimate;
  invoiceEstimate?: InvoiceEstimate;
  nextInvoiceEstimate?: InvoiceEstimate;
}

export interface ITax {
  name: string;
  description: string;
  amount: number;
}

export interface InvoiceEstimate {
  recurring: boolean;
  date: number;
  priceType: string;
  subTotal: number;
  total: number;
  creditsApplied: number;
  amountPaid: number;
  amountDue: number;
  object: string;
  customerId: string;
  lineItems: LineItem[];
  discounts?: Discount[];
  taxes: ITax[];
  lineItemTaxes: any[];
  currencyCode: string;
  roundOffAmount: number;
  lineItemDiscounts: LineItemDiscount[];
}

export interface Discount {
  object: string;
  entityType: string;
  description: string;
  amount: number;
  entityId: string;
}

export interface LineItemDiscount {
  object: string;
  lineItemId: string;
  discountType: string;
  discountAmount: number;
  couponId: string;
  entityId: string;
}

export interface LineItem {
  id: string;
  dateFrom: number;
  dateTo: number;
  unitAmount: number;
  quantity: number;
  amount: number;
  pricingModel: string;
  isTaxed: boolean;
  taxAmount: number;
  object: string;
  customerId: string;
  description: string;
  entityType: LineItemEntityTypes;
  entityId: string;
  entityDescription?: string;
  discountAmount: number;
  itemLevelDiscountAmount: number;
}

export interface SubscriptionEstimate {
  status: string;
  nextBillingAt: number;
  object: string;
  currencyCode: string;
}

export enum AddOnChargeEvents {
  SubscriptionCreation = 'subscription_creation',
  SubscriptionTrialStart = 'subscription_trial_start',
}

export enum ChargeOnTypes {
  Immediately = 'immediately',
  OnEvent = 'on_event',
}

export enum LineItemEntityTypes {
  Plan = 'plan',
  AddOn = 'addon',
}
