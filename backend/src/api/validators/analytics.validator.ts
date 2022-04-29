import Joi from 'joi';

import { FB_PIXEL_EVENTS, FB_PIXEL_PURCHASE } from 'constants/analytics.constants';

export const fbConversionAPIValidator = Joi.object({
  eventName: Joi.string()
    .required()
    .valid(...FB_PIXEL_EVENTS),
  customData: Joi.when('eventName', {
    is: FB_PIXEL_PURCHASE,
    then: Joi.object({
      currency: Joi.string().required(),
      value: Joi.number().required(),
    }).required(),
    otherwise: Joi.optional(),
  }),
  eventSourceUrl: Joi.string().required(),
});
