"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateQuery = void 0;
const http_status_codes_1 = require("http-status-codes");
const ramda_1 = require("ramda");
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
            res.status(http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY).json({
                code: http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY,
                message: http_status_codes_1.ReasonPhrases.UNPROCESSABLE_ENTITY,
                data: validate.error.details &&
                    validate.error.details.map(error => ({
                        param: error.path.join('.'),
                        message: error.message,
                    })),
            });
        }
        else {
            next();
        }
    };
};
/**
 *
 * @param {Joi.Schema} schema
 */
const validateQuery = schema => {
    return async (req, res, next) => {
        const validated = schema.validate(req.query, { abortEarly: false });
        if (validated.error) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                code: http_status_codes_1.StatusCodes.BAD_REQUEST,
                message: http_status_codes_1.ReasonPhrases.BAD_REQUEST,
                data: ramda_1.compose(ramda_1.map(({ message, context: { key: param } }) => ({
                    param,
                    message,
                })), ramda_1.pathOr([], ['error', 'details']))(validated),
            });
        }
        else {
            next();
        }
    };
};
exports.validateQuery = validateQuery;
exports.default = Validate;
