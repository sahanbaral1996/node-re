import { StatusCodes, ReasonPhrases } from 'http-status-codes';

import { compose, map, pathOr } from 'ramda';

/**
 * A middleware to validate schema.
 *
 * @param {Joi.Schema} params
 */
const Validate = schema => {
  return async (req, res, next) => {
    const data = req.body;
    if (typeof req.file !== 'undefined') {
      data[req.file.fieldname] = req.file;
    }

    const validate = schema.validate(data);

    if (validate.error) {
      res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
        code: StatusCodes.UNPROCESSABLE_ENTITY,
        message: ReasonPhrases.UNPROCESSABLE_ENTITY,
        data:
          validate.error.details &&
          validate.error.details.map(error => ({
            param: error.path.join('.'),
            message: error.message,
          })),
      });
    } else {
      next();
    }
  };
};

/**
 *
 * @param {Joi.Schema} schema
 */
export const validateQuery = schema => {
  return async (req, res, next) => {
    const validated = schema.validate(req.query, { abortEarly: false });

    if (validated.error) {
      res.status(StatusCodes.BAD_REQUEST).json({
        code: StatusCodes.BAD_REQUEST,
        message: ReasonPhrases.BAD_REQUEST,
        data: compose(
          map(({ message, context: { key: param } }) => ({
            param,
            message,
          })),
          pathOr([], ['error', 'details'])
        )(validated),
      });
    } else {
      next();
    }
  };
};

export default Validate;
