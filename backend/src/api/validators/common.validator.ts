import Joi from 'joi';

export const dateRangeValidator = Joi.object({
  startDate: Joi.number(),
  endDate: Joi.number(),
});
