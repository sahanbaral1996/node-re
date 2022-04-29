import Joi from 'joi';

const addressSchema = {
  city: Joi.string().required(),
  country: Joi.string().required(),
  lineOne: Joi.string().required(),
  lineTwo: Joi.string().optional().allow(''),
  state: Joi.string().required(),
  zip: Joi.string().required(),
};

const productAddonSchema = Joi.object({
  trialAddOnIds: Joi.array().items(Joi.string()).optional(),
  activeAddOnIds: Joi.array().items(Joi.string()).optional(),
});

export const createSubscriptionValidator = Joi.object({
  billingAddress: Joi.object(addressSchema),
  shippingAddress: Joi.object({
    ...addressSchema,
    country: Joi.string().required().valid('US'),
  }),
  token: Joi.string().required(),
  couponIds: Joi.array().items(Joi.string()).optional(),
  phone: Joi.string().allow('').min(10).optional(),
  isSameAsShippingAddress: Joi.boolean().required(),
  addOnConfigurationIds: Joi.array().items(Joi.string()).optional(),
}).concat(productAddonSchema);

export const estimateSubscriptionValidator = Joi.object({
  couponIds: Joi.array().items(Joi.string()).optional(),
  trialAddOnIds: Joi.array().items(Joi.string()).optional(),
  activeAddOnIds: Joi.array().items(Joi.string()).optional(),
  zip: Joi.string().allow('').optional(),
});
