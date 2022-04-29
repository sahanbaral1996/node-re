import Joi from 'joi';
import { assessment, otcMedication } from './assessment.validator';
import { createSubscriptionValidator } from './subscription.validator';

export const createPersonValidator = assessment.concat(otcMedication);

export const createPersonByAdminValidator = Joi.object({
  leadId: Joi.string().required(),
}).concat(createSubscriptionValidator);
