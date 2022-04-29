import * as React from 'react';

import { CardRef, ICard } from '@chargebee/chargebee-js-react-wrapper';
import { FormikErrors, FormikProps, FormikTouched } from 'formik';
import { OnboardSteps } from 'types/onboard';
import { IAddonOrder } from './shoppingCart';

export type CardReference = ICard;

interface IAddress {
  lineOne: string;
  lineTwo: string;
  city: string;
  state: string;
  country: string;
  zip: string;
}

interface ICardDetails {
  token: string;
  type: string;
  number: string;
  expiry: string;
  cvv: string;
  transaction: string;
}

interface IStateOptions {
  value: string;
  label: string;
  isAvailable: boolean;
}

export interface ICouponFormValuesProps {
  formik: FormikProps<ISubscriptionFormValues>;
  isLoaded: boolean;
  isAdmin?: boolean;
}

export interface IAddressFormValuesProps {
  values: IAddress;
  prefix?: string;
  touched: FormikTouched<IAddress | undefined>;
  errors: FormikErrors<IAddress | undefined>;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  stateOptions: IStateOptions[];
}

export type IAddressFormValues = IAddress;

export interface ISubscriptionFormValues {
  shippingAddress: IAddress;
  billingAddress: IAddress;
  isSameAsShippingAddress: boolean;
  card: ICardDetails;
  phone: string;
  coupon: string;
}
interface ICommonFormProps {
  formik: FormikProps<ISubscriptionFormValues>;
  cardRef: CardRef;
  handleCardLoaded: () => void;
}

export type ICardProps = ICommonFormProps;
export interface ISubscriptionDetails
  extends Omit<ISubscriptionFormValues, 'card' | 'isSameAsShippingAddress' | 'coupon'> {
  token: string;
  couponIds?: string[];
  trialAddOnIds: string[];
  activeAddOnIds: string[];
  addOnConfigurationIds: string[];
  isSameAsShippingAddress: boolean;
}

export type ISubscriptionFormElementsProps = ICommonFormProps;

export interface ISubscriptionFormProps extends ICommonFormProps {
  isInitialized: boolean;
  isCardLoaded: boolean;
  isEstimatesLoaded: boolean;
  onBack: () => void;
}

export interface ISubscriptionProps {
  onContinue: (step: OnboardSteps) => void;
  orders: IAddonOrder[];
  onBack: () => void;
  addons?: { activeAddonId: string[]; trialAddonId: string[] };
}

export enum SubscriptionAPIErrors {
  PAYMENT_PROCESSING_FAILED = 'payment_processing_failed',
  CHARGE_BEE_CLIENT_ERROR = 'ChargebeeClientError',
  COUPON_CODE_RESOURCE_ERROR = 'resource_not_found',
}
interface IEstimate {
  amountDue: number;
  subTotal: number;
  total: number;
  description: string;
  discountAmount: number;
  discountDescription: string;
  lineItems: ILineItem[];
}
export interface ISubscriptionEstimate {
  invoiceEstimate: IEstimate;
  nextInvoiceEstimate: IEstimate;
}
interface ILineItem {
  amount: number;
  description: string;
  entityId: string;
  discountAmount: number;
  id: string;
}
export type SubscriptionEstimateState =
  | {
      isLoaded: false;
      data: null;
    }
  | {
      isLoaded: true;
      data: ISubscriptionEstimate;
    };
export interface IOrderProps {
  isLoaded: boolean;
  estimate: ISubscriptionEstimate | null;
  orders: IAddonOrder[];
}
export interface IOrderItemProps {
  description: string;
  cost: string;
  totalCost?: string;
  oneTime?: boolean;
  descriptionClass?: string;
  subheader?: string;
  subheaderClass?: string;
  costClass?: string;
  isLoaded: boolean;
}

export interface IManageSubscriptionProps {
  handleChange: () => void;
}

export interface ISubscription {
  nextBillingAt: number;
  trialEnd: number;
  status: string;
  shippingAddress: {
    line1: string;
    line2: string;
    city: string;
    stateCode: string;
    zip: number;
  };
}

export interface IPortalOptions {
  subscriptionCancelled?: () => void;
}

export interface IPaymentInformationProps {
  orders: IAddonOrder[];
}
