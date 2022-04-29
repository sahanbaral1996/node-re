"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const camelcase_keys_1 = __importDefault(require("camelcase-keys"));
const Error_1 = __importDefault(require("./Error"));
class SubscriptionException extends Error_1.default {
    constructor(message, code, operation) {
        super(message, code);
        // eslint-disable-next-line
        const { http_status_code, error_msg, message: operationMessage, ...rest } = operation;
        this.operation = camelcase_keys_1.default(rest, { deep: true });
    }
}
exports.default = SubscriptionException;
