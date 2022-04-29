import Joi from 'joi';

export const authenticationIssueValidator = Joi.object({
  email: Joi.string().optional().email(),
});
