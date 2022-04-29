"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const Error_1 = __importDefault(require("./Error"));
/**
 * @class ValidationError
 * @extends {APIError}
 */
class ValidationError extends Error_1.default {
    constructor(errors = [], message = http_status_codes_1.ReasonPhrases.UNPROCESSABLE_ENTITY) {
        super(message, http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY);
        this.errors = errors;
        this.message = message;
    }
}
exports.default = ValidationError;
