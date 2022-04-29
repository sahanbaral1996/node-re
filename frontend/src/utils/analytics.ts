import { IFbPixelConversionApi } from 'types/analytics';
import { PIXEL } from 'constants/lang/facebook';
import { fbPixelApiConversion } from 'services/analytics';
import * as routes from 'constants/routes';

export const fbConversionApiPayloadGenerator = (eventName: string) => {
  switch (eventName) {
    case PIXEL.ADD_TO_CART:
      return {
        eventName: PIXEL.ADD_TO_CART,
        eventSourceUrl: routes.SETUP_SUBSCRIPTION,
      };
    case PIXEL.CUSTOMIZE_PRODUCT:
      return {
        eventName: PIXEL.CUSTOMIZE_PRODUCT,
        eventSourceUrl: routes.CLINICAL_ASSESSMENT,
      };
    case PIXEL.LEAD:
      return {
        eventName: PIXEL.LEAD,
        eventSourceUrl: routes.ACCOUNT_CREATION,
      };
    case PIXEL.PURCHASE:
      return {
        eventName: PIXEL.PURCHASE,
        eventSourceUrl: routes.FACE_PHOTO,
        customData: {
          currency: 'USD',
          value: 4.95,
        },
      };
    case PIXEL.START_TRIAL:
      return {
        eventName: PIXEL.START_TRIAL,
        eventSourceUrl: routes.STANDALONE_ORDER_CONFIRMED,
      };
    case PIXEL.SUBSCRIBE:
      return {
        eventName: PIXEL.SUBSCRIBE,
        eventSourceUrl: routes.NAME,
      };
    default:
      return {
        eventName: '',
        eventSourceUrl: '',
      };
  }
};
