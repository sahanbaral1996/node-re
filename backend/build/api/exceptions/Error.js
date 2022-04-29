"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
/**
 * Override the default Error interface to throw custom error messages.
 *
 * @class Error
 * @extends {APIError}
 */
class APIError extends Error {
    constructor(message, code = http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, ...params) {
        super(...params);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, APIError);
        }
        this.message = message;
        this.code = code;
    }
}
exports.default = APIError;
