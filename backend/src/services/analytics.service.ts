import { IFbPixelConversionPayload } from 'types/analytics.service.type';
import * as PixelService from './facebook/pixel.service';

export const fbPixelConversion = (
  pixelPayload: IFbPixelConversionPayload,
  remoteAddress: string | undefined,
  userAgent: string | undefined
): Promise<any> => {
  return PixelService.createServerEvent(pixelPayload, remoteAddress, userAgent);
};
