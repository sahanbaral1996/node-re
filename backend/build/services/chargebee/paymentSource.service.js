"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePaymentSource = exports.createPaymentSource = void 0;
const SubscriptionException_1 = __importDefault(require("api/exceptions/SubscriptionException"));
const app_constants_1 = require("constants/app.constants");
const container_1 = __importDefault(require("container"));
const callback_1 = require("utils/callback");
const object_1 = require("utils/object");
const createPaymentSource = async (customerId, tokenId) => {
    try {
        const chargebee = container_1.default.resolve(app_constants_1.CHARGEBEE_TOKEN);
        const params = {
            customer_id: customerId,
            token_id: tokenId,
        };
        const requestWrapper = chargebee.payment_source.create_using_token(params);
        const response = await requestWrapper.request(callback_1.noop);
        return object_1.toCamelKeys(JSON.parse(response.toString()));
    }
    catch (error) {
        throw new SubscriptionException_1.default(error.message, error.http_status_code, error);
    }
};
exports.createPaymentSource = createPaymentSource;
const deletePaymentSource = async (paymentSourceId) => {
    try {
        const chargebee = container_1.default.resolve(app_constants_1.CHARGEBEE_TOKEN);
        const requestWrapper = chargebee.payment_source.delete(paymentSourceId);
        const response = await requestWrapper.request(callback_1.noop);
        return JSON.parse(response.toString());
    }
    catch (error) {
        throw new SubscriptionException_1.default(error.message, error.http_status_code, error);
    }
};
exports.deletePaymentSource = deletePaymentSource;
