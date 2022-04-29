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
exports.subcriptionChanged = exports.updatePaymentStatus = exports.createBillingOrder = void 0;
const Error_1 = __importDefault(require("api/exceptions/Error"));
const salService = __importStar(require("services/salesforce/account.service"));
const salesforce_helpers_1 = require("helpers/salesforce.helpers");
const chargebee_helpers_1 = require("helpers/chargebee.helpers");
const container_1 = __importDefault(require("container"));
const ramda_1 = require("ramda");
const config_1 = __importDefault(require("config"));
const status_1 = require("constants/salesforce/status");
const createBillingOrder = async (attributes) => {
    try {
        const account = await salService.findAccountIdByChargeBeeId(attributes.customer_id);
        const accountId = account.records[0].Id;
        const salesforceConnection = container_1.default.resolve('salesforceConnection');
        const billingObj = {
            Account__c: accountId,
            Billing_City__c: attributes.billing_address.city || '',
            Billing_Country__c: attributes.billing_address.country || '',
            Billing_State__c: attributes.billing_address.state || '',
            Billing_Street1__c: attributes.billing_address.line1 || '',
            Billing_Street2__c: attributes.billing_address.line2 || '',
            Shipping_City__c: attributes.shipping_address.city || '',
            Shipping_Country__c: attributes.shipping_address.country || '',
            Shipping_State__c: attributes.shipping_address.state || '',
            Shipping_Street1__c: attributes.shipping_address.line1 || '',
            Shipping_Street2__c: attributes.shipping_address.line2 || '',
            Total_Price__c: attributes.sub_total,
            Processed_At__c: attributes.paid_at,
        };
        const data = await salesforceConnection.sobject('Billing_Order__c').create(billingObj);
        return data;
    }
    catch (err) {
        throw new Error_1.default(err);
    }
};
exports.createBillingOrder = createBillingOrder;
const updatePaymentStatus = async (attributes) => {
    try {
        const account = await salService.findAccountIdByChargeBeeId(attributes.transaction.customer_id);
        const salesforceConnection = container_1.default.resolve('salesforceConnection');
        const accountId = ramda_1.head(account.records);
        if (!accountId) {
            return {};
        }
        const contactData = await salesforceConnection.sobject('Contact').find({ AccountId: accountId.Id });
        let status;
        if (attributes.transaction.status == 'success' &&
            chargebee_helpers_1.hasLineItemWithEntityId(attributes.invoice.line_items, config_1.default.chargebee.addonId)) {
            status = status_1.STATUS_TRIAL_PAID;
        }
        else if (attributes.transaction.status == 'success' &&
            chargebee_helpers_1.hasLineItemWithEntityId(attributes.invoice.line_items, config_1.default.chargebee.subscriptionPlanId)) {
            status = status_1.STATUS_SUBS_PAID;
        }
        else if (attributes.transaction.status === 'failure') {
            status = status_1.STATUS_CC_ERROR;
        }
        const data = await salesforceConnection.sobject('Contact').update({
            Id: contactData[0].Id,
            Payment_Status__c: status,
        });
        return data;
    }
    catch (err) {
        throw new Error_1.default(err.message);
    }
};
exports.updatePaymentStatus = updatePaymentStatus;
const subcriptionChanged = async (attributes, eventType) => {
    try {
        const account = await salService.findAccountIdByChargeBeeId(attributes.customer.id);
        const salesforceConnection = container_1.default.resolve('salesforceConnection');
        const accountId = ramda_1.head(account.records);
        if (!accountId) {
            return {};
        }
        const contactData = await salesforceConnection.sobject('Contact').find({ AccountId: accountId.Id });
        const contact = salesforce_helpers_1.getCamelCasedObject(contactData);
        let status;
        if (attributes.subscription.status == 'cancelled') {
            status = 'Subscription Cancelled';
        }
        else if (attributes.subscription.status == 'paused') {
            status = 'Paused';
        }
        else if (eventType == 'subscription_cancellation_scheduled') {
            status = 'Cancellation - Impending';
        }
        else if (attributes.subscription.status == 'active' || attributes.subscription.status == 'in_trial') {
            status = contact.lastPaymentStatus;
        }
        const data = await salesforceConnection.sobject('Contact').update({
            Id: contactData[0].Id,
            Payment_Status__c: status,
        });
        return data;
    }
    catch (err) {
        throw new Error_1.default(err.message);
    }
};
exports.subcriptionChanged = subcriptionChanged;
