import Joi from 'joi';

/**
 * customer validator
 */
export const customerValidator = Joi.object({
  firstName: Joi.string().min(2).label('First Name').required(),
  lastName: Joi.string().min(2).label('Last Name').required(),
  email: Joi.string().min(6).label('Email').required().email(),
  phone: Joi.string().allow(''),
});

/**
 * hosted page validator
 */
export const hostedPageValidator = Joi.object({
  planId: Joi.string().min(2).label('Plan').required(),
  customerId: Joi.string().min(2).label('Customer').required(),
});
