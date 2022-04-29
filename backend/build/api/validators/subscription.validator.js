"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.estimateSubscriptionValidator = exports.createSubscriptionValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const addressSchema = {
    city: joi_1.default.string().required(),
    country: joi_1.default.string().required(),
    lineOne: joi_1.default.string().required(),
    lineTwo: joi_1.default.string().optional().allow(''),
    state: joi_1.default.string().required(),
    zip: joi_1.default.string().required(),
};
const productAddonSchema = joi_1.default.object({
    trialAddOnIds: joi_1.default.array().items(joi_1.default.string()).optional(),
    activeAddOnIds: joi_1.default.array().items(joi_1.default.string()).optional(),
});
exports.createSubscriptionValidator = joi_1.default.object({
    billingAddress: joi_1.default.object(addressSchema),
    shippingAddress: joi_1.default.object({
        ...addressSchema,
        country: joi_1.default.string().required().valid('US'),
    }),
    token: joi_1.default.string().required(),
    couponIds: joi_1.default.array().items(joi_1.default.string()).optional(),
    phone: joi_1.default.string().allow('').min(10).optional(),
    isSameAsShippingAddress: joi_1.default.boolean().required(),
    addOnConfigurationIds: joi_1.default.array().items(joi_1.default.string()).optional(),
}).concat(productAddonSchema);
exports.estimateSubscriptionValidator = joi_1.default.object({
    couponIds: joi_1.default.array().items(joi_1.default.string()).optional(),
    trialAddOnIds: joi_1.default.array().items(joi_1.default.string()).optional(),
    activeAddOnIds: joi_1.default.array().items(joi_1.default.string()).optional(),
    zip: joi_1.default.string().allow('').optional(),
});
