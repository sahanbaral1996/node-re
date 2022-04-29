"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const Error_1 = __importDefault(require("./Error"));
/**
 * @class BadRequestError
 * @extends {APIError}
 */
class BadRequestError extends Error_1.default {
    /**
     * Creates an instance of BadRequestError.
     *
     * @param {string} message
     * @memberof BadRequestError
     */
    constructor(message = http_status_codes_1.ReasonPhrases.BAD_REQUEST) {
        super(message, http_status_codes_1.StatusCodes.BAD_REQUEST);
        this.message = message;
    }
}
exports.default = BadRequestError;
