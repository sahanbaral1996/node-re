import Joi from 'joi';

export const caseValidator = Joi.object({
  description: Joi.string().required(),
});

export const webToCaseValidator = Joi.object({
  description: Joi.string().required(),
  selfies: Joi.array().items(Joi.string()).optional(),
});
