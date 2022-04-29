export interface IFbPixelConversionApi {
  eventName: string;
  eventSourceUrl: string;
  customData?: {
    currency: string;
    value: number;
  };
}
