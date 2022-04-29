import { SELFIE_PREFIX, SHELFIE_PREFIX } from 'constants/salesforce/document.constants';
import Joi from 'joi';

/**
 * Attachment Validator
 */
export const attachmentValidator = Joi.object({
  selfies: Joi.any().label('selfies').required(),
  shelfies: Joi.any().label('shelfies').required(),
});

export const uploadAttachmentBodyValidator = Joi.object({
  prefix: Joi.string().valid(SELFIE_PREFIX, SHELFIE_PREFIX).required(),
});

export const uploadAttachmentParamValidator = Joi.object({
  id: Joi.number().required(),
});

export const attachImageValidator = Joi.object({
  selfies: Joi.array().min(1).items(Joi.string()),
});
