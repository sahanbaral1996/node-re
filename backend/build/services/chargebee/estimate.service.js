"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.estimate = void 0;
const config_1 = __importDefault(require("config"));
const app_constants_1 = require("constants/app.constants");
const chargebee_constants_1 = require("constants/chargebee.constants");
const container_1 = __importDefault(require("container"));
const chargebee_helpers_1 = require("helpers/chargebee.helpers");
const callback_1 = require("utils/callback");
const object_1 = require("utils/object");
const estimate = async (input) => {
    const chargebee = container_1.default.resolve(app_constants_1.CHARGEBEE_TOKEN);
    const { couponIds, isAddonExcluded = false, trialAddOnIds = [], activeAddOnIds = [], zip = '' } = input;
    const addons = chargebee_helpers_1.getChargbeeAddOns(activeAddOnIds);
    const eventAddons = chargebee_helpers_1.getEventBasedAddOns([...trialAddOnIds, config_1.default.chargebee.addonId]);
    const params = {
        subscription: {
            plan_id: config_1.default.chargebee.subscriptionPlanId,
        },
        billing_address: {
            country: chargebee_constants_1.ALLOWED_COUNTRY,
            state_code: chargebee_constants_1.ALLOWED_STATE_CODE,
            zip,
        },
        coupon_ids: couponIds,
        addons: addons,
        event_based_addons: isAddonExcluded ? [] : eventAddons,
    };
    const requestWrapper = chargebee.estimate.create_subscription(params);
    const result = await requestWrapper.request(callback_1.noop);
    return object_1.toCamelKeys(JSON.parse(result.toString()));
};
exports.estimate = estimate;
