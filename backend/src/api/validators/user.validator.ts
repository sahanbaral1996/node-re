import Joi from 'joi';

export const createUserValidator = Joi.object({
  email: Joi.string().min(2).label('Email').required().email(),
  firstName: Joi.string().min(2).label('First Name').required(),
  lastName: Joi.string().min(2).label('Last Name').required(),
});
