import Joi from 'joi';

import { dateRangeValidator } from './common.validator';

export const userValidator = Joi.object({
  email: Joi.string().min(2).label('Email').required().email(),
  dob: Joi.string().label('Date of birth').required(),
});

export const selfiesQuery = dateRangeValidator;

export const eligibilityAndAcceptance = Joi.object({
  dob: Joi.date().required(),
  newsletter: Joi.boolean().required(),
  noppToa: Joi.boolean().required(),
  state: Joi.string().required(),
});

export const createCustomer = Joi.object({
  password: Joi.string()
    .pattern(/^(?=.*[a-z])(?=.*[0-9])(?=.*[\^$*.\[\]{}\(\)?\-“!@#%&\/,><\’:;|_~`])\S{8,99}$/)
    .message(
      'Password must contain at least 8 characters, a number, a special character and at least one lowercase letter'
    )
    .required(),
  email: Joi.string().email().min(6).label('Email').required(),
}).concat(eligibilityAndAcceptance);

export const changePassword = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string()
    .pattern(/^(?=.*[a-z])(?=.*[0-9])(?=.*[\^$*.\[\]{}\(\)?\-“!@#%&\/,><\’:;|_~`])\S{8,99}$/)
    .message(
      'Password must contain at least 8 characters, a number, a special character and at least one lowercase letter'
    )
    .required(),
});

export const changeEmail = Joi.object({
  email: Joi.string().min(6).label('Email').required().email(),
});

export const customerValidation = Joi.object({
  email: Joi.string().email().optional(),
  dob: Joi.string().optional(),
});

export const changeName = Joi.object({
  firstName: Joi.string().min(2).label('First Name').required(),
  lastName: Joi.string().min(2).label('Last Name').required(),
});
