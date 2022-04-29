export interface IFbPixelConversionPayload {
  eventName: string;
  customData?: {
    currency: string;
    value: number;
  };
  eventSourceUrl: string;
}
