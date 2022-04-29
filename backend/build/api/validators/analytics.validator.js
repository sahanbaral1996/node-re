"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fbConversionAPIValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const analytics_constants_1 = require("constants/analytics.constants");
exports.fbConversionAPIValidator = joi_1.default.object({
    eventName: joi_1.default.string()
        .required()
        .valid(...analytics_constants_1.FB_PIXEL_EVENTS),
    customData: joi_1.default.when('eventName', {
        is: analytics_constants_1.FB_PIXEL_PURCHASE,
        then: joi_1.default.object({
            currency: joi_1.default.string().required(),
            value: joi_1.default.number().required(),
        }).required(),
        otherwise: joi_1.default.optional(),
    }),
    eventSourceUrl: joi_1.default.string().required(),
});
