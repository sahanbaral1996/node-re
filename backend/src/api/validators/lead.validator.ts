import Joi from 'joi';

export const createLeadValidator = Joi.object({
  email: Joi.string().min(6).email().required(),
  state: Joi.string().optional(),
});

export const updateLeadValidator = Joi.object({
  dob: Joi.string().required(),
  phone: Joi.string().allow(''),
  state: Joi.string().required(),
  newsletter: Joi.boolean().required(),
  noppToa: Joi.boolean().optional(),
}).concat(createLeadValidator);

export const createLeadByAdminValidator = Joi.object({
  dob: Joi.date().required(),
  newsletter: Joi.boolean().required(),
  noppToa: Joi.boolean().required(),
  state: Joi.string().required(),
  firstName: Joi.string().min(2).label('First Name').required(),
  lastName: Joi.string().min(2).label('Last Name').required(),
}).concat(createLeadValidator);
