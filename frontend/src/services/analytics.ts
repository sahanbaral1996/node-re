import http from 'utils/http';

import { FB_PIXEL_CONVERSION_API } from 'constants/api';
import { IFbPixelConversionApi } from 'types/analytics';
import { fbConversionApiPayloadGenerator } from 'utils/analytics';

export const fbPixelApiConversion = async (eventName: string) => {
  try {
    const payload: IFbPixelConversionApi = fbConversionApiPayloadGenerator(eventName);

    await http.post(FB_PIXEL_CONVERSION_API, payload);
  } catch (error) {
    // No need to show fb pixel conversion api error message to user.

    return;
  }
};
