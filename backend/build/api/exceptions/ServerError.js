"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const Error_1 = __importDefault(require("./Error"));
/**
 * @class ServerError
 * @extends {APIError}
 */
class ServerError extends Error_1.default {
    constructor(message = 'Something went wrong') {
        super(message, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        this.message = message;
    }
}
exports.default = ServerError;
