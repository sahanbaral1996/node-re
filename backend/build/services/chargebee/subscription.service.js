"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.incurChargeOnSubscription = exports.updateAddonOnSubscription = exports.deleteScheduledChanges = exports.updateSubscription = exports.listSubscription = exports.retrieveSubscriptionForCustomer = exports.deleteSubscription = exports.createSubscription = exports.reactivateSubscription = void 0;
const container_1 = __importDefault(require("container"));
const salesforceService = __importStar(require("services/salesforce/account.service"));
const ramda_1 = require("ramda");
const dt = __importStar(require("date-fns"));
const config_1 = __importDefault(require("config"));
const object_1 = require("utils/object");
const app_constants_1 = require("constants/app.constants");
const callback_1 = require("utils/callback");
const SubscriptionException_1 = __importDefault(require("api/exceptions/SubscriptionException"));
const chargebee_helpers_1 = require("helpers/chargebee.helpers");
const reactivateSubscription = async (accountId) => {
    try {
        const chargebee = container_1.default.resolve(app_constants_1.CHARGEBEE_TOKEN);
        const accountData = await salesforceService.findAccountByAccountId(accountId);
        const trail_end_data = accountData.trialEndDateFormula;
        const customerEmail = accountData.email;
        const customers = await new Promise((resolve, reject) => {
            chargebee.customer.list({ email: { is: customerEmail } }).request((err, succ) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(succ);
                }
            });
        });
        const listHead = ramda_1.head(customers.list);
        if (!listHead) {
            return {};
        }
        const customerId = listHead.customer.id;
        const subList = await new Promise((resolve, reject) => {
            chargebee.subscription.list({ customer_id: { is: customerId } }).request((err, result) => {
                if (err) {
                    reject(result);
                }
                else {
                    resolve(result);
                }
            });
        });
        const subHead = ramda_1.head(subList.list);
        if (!subHead) {
            return {};
        }
        const subscriptionId = subHead.subscription.id;
        const responseSubs = await new Promise((resolve, reject) => {
            chargebee.subscription
                .update(subscriptionId, { trial_end: dt.getUnixTime(new Date(trail_end_data)) })
                .request((err, result) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        });
        return { responseSubs };
    }
    catch (err) {
        throw new Error(err);
    }
};
exports.reactivateSubscription = reactivateSubscription;
const createSubscription = async (details, accountDetail) => {
    try {
        const firstName = accountDetail.firstName;
        const lastName = accountDetail.lastName;
        const chargebee = container_1.default.resolve(app_constants_1.CHARGEBEE_TOKEN);
        const { activeAddOnIds = [], trialAddOnIds = [] } = details;
        const addons = chargebee_helpers_1.getChargbeeAddOns(activeAddOnIds);
        const eventAddOns = chargebee_helpers_1.getEventBasedAddOns([...trialAddOnIds, config_1.default.chargebee.addonId]);
        const params = {
            plan_id: config_1.default.chargebee.subscriptionPlanId,
            shipping_address: {
                line1: details.shippingAddress.lineOne,
                line2: details.shippingAddress.lineTwo,
                city: details.shippingAddress.city,
                state: details.shippingAddress.state,
                zip: details.shippingAddress.zip,
                country: details.shippingAddress.country,
            },
            billing_address: {
                line1: details.billingAddress.lineOne,
                line2: details.billingAddress.lineTwo,
                city: details.billingAddress.city,
                state: details.billingAddress.state,
                zip: details.billingAddress.zip,
                country: details.billingAddress.country,
            },
            customer: {
                first_name: firstName,
                last_name: lastName,
                email: accountDetail.email,
                phone: details.phone,
            },
            token_id: details.token,
            coupon_ids: details.couponIds,
            addons,
            event_based_addons: eventAddOns,
        };
        const requestWrapper = chargebee.subscription.create(params);
        const response = await requestWrapper.request(callback_1.noop);
        return object_1.toCamelKeys(JSON.parse(response.toString()));
    }
    catch (error) {
        throw new SubscriptionException_1.default(error.message, error.http_status_code, error);
    }
};
exports.createSubscription = createSubscription;
const deleteSubscription = async (subscriptionId) => {
    try {
        const chargebee = container_1.default.resolve(app_constants_1.CHARGEBEE_TOKEN);
        const requestWrapper = chargebee.subscription.delete(subscriptionId);
        const response = await requestWrapper.request(callback_1.noop);
        return object_1.toCamelKeys(JSON.parse(response.toString()));
    }
    catch (error) {
        throw new SubscriptionException_1.default(error.message, error.http_status_code, error);
    }
};
exports.deleteSubscription = deleteSubscription;
const retrieveSubscriptionForCustomer = async (customerId) => {
    try {
        const chargebee = container_1.default.resolve(app_constants_1.CHARGEBEE_TOKEN);
        const params = {
            limit: 1,
            customer_id: { is: customerId },
            plan_id: { is: config_1.default.chargebee.subscriptionPlanId },
        };
        const requestWrapper = chargebee.subscription.list(params);
        const response = await requestWrapper.request(callback_1.noop);
        const [result] = response.list;
        if (result) {
            const subscription = object_1.toCamelKeys(JSON.parse(result.toString()));
            return subscription;
        }
        return result;
    }
    catch (error) {
        throw new SubscriptionException_1.default(error.message, error.http_status_code, error);
    }
};
exports.retrieveSubscriptionForCustomer = retrieveSubscriptionForCustomer;
const listSubscription = async (offset) => {
    try {
        const chargebee = container_1.default.resolve(app_constants_1.CHARGEBEE_TOKEN);
        const params = {
            limit: 100,
            offset,
            plan_id: { is: config_1.default.chargebee.subscriptionPlanId },
        };
        const requestWrapper = chargebee.subscription.list(params);
        const response = await requestWrapper.request(callback_1.noop);
        const subscriptions = object_1.toCamelKeys(JSON.parse(`[${response.list.toString()}]`));
        const nextOffset = response.next_offset;
        return {
            subscriptions,
            nextOffset,
        };
    }
    catch (error) {
        throw new SubscriptionException_1.default(error.message, error.http_status_code, error);
    }
};
exports.listSubscription = listSubscription;
const updateSubscription = async (id, details) => {
    try {
        const chargebee = container_1.default.resolve(app_constants_1.CHARGEBEE_TOKEN);
        const params = {
            plan_unit_price: details.price,
            addons: details.addons,
        };
        const requestWrapper = chargebee.subscription.update(id, params);
        const response = await requestWrapper.request(callback_1.noop);
        const result = object_1.toCamelKeys(JSON.parse(response.toString()));
        return result;
    }
    catch (error) {
        throw new SubscriptionException_1.default(error.message, error.http_status_code, error);
    }
};
exports.updateSubscription = updateSubscription;
const deleteScheduledChanges = async (id) => {
    try {
        const chargebee = container_1.default.resolve(app_constants_1.CHARGEBEE_TOKEN);
        const requestWrapper = chargebee.subscription.remove_scheduled_changes(id);
        const response = await requestWrapper.request(callback_1.noop);
        const result = object_1.toCamelKeys(JSON.parse(response.toString()));
        return result;
    }
    catch (error) {
        throw new SubscriptionException_1.default(error.message, error.http_status_code, error);
    }
};
exports.deleteScheduledChanges = deleteScheduledChanges;
const updateAddonOnSubscription = async (id, params) => {
    try {
        const chargebee = container_1.default.resolve(app_constants_1.CHARGEBEE_TOKEN);
        const requestWrapper = chargebee.subscription.update(id, params);
        const response = await requestWrapper.request(callback_1.noop);
        const result = object_1.toCamelKeys(JSON.parse(response.toString()));
        return result;
    }
    catch (error) {
        throw new SubscriptionException_1.default(error.message, error.http_status_code, error);
    }
};
exports.updateAddonOnSubscription = updateAddonOnSubscription;
const incurChargeOnSubscription = async (customerId, orderType) => {
    try {
        const sub = await exports.retrieveSubscriptionForCustomer(customerId);
        const chargebee = container_1.default.resolve(app_constants_1.CHARGEBEE_TOKEN);
        const addonType = orderType == 'Trial' ? 'oral-meds-trial' : orderType == '' ? 'docent-wash_active' : 'oral-meds-active';
        const params = {
            addons: [
                {
                    id: addonType,
                    quantity: 1,
                },
            ],
        };
        const responseSubs = await new Promise((resolve, reject) => {
            chargebee.subscription.update(sub.subscription.id, params).request((err, result) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        });
        return responseSubs;
        console.log(responseSubs);
    }
    catch (error) {
        throw new SubscriptionException_1.default(error.message, error.http_status_code, error);
    }
};
exports.incurChargeOnSubscription = incurChargeOnSubscription;
