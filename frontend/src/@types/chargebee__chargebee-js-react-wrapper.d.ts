declare module '@chargebee/chargebee-js-react-wrapper' {
  import { ComponentType, RefObject } from 'react';

  interface IBillingAddress {
    firstName?: string;
    lastName?: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    zip: string;
    countryCode: string;
  }

  export interface IAdditionalData {
    billingAddress: IBillingAddress;
  }

  interface IError {
    errorCode: string;
    message: string;
  }

  export interface IEvent {
    type: 'change';
    complete: boolean;
    field: 'number' | 'expiry' | 'cvv';
    error?: IError;
    cardType: string;
  }

  export interface IField {
    id: string;
    name: string;
  }

  interface ICommonProps {
    placeholder?: string;
    className?: string;
    onChange?: (value: IEvent) => void;
    onReady?: (value: IField) => void;
  }

  export interface ICard {
    tokenize: (additionalData?: IAdditionalData) => Promise<{ token: string }>;
  }

  export type CardRef = RefObject<ICard>;

  interface ICardComponentProps extends ICommonProps {
    ref: CardRef;
  }

  export const CardComponent: ComponentType<ICardComponentProps>;
  export const CardNumber: ComponentType<ICommonProps>;
  export const CardExpiry: ComponentType<ICommonProps>;
  export const CardCVV: ComponentType<ICommonProps>;
}
