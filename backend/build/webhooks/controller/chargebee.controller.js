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
exports.incurAddonChargeOnSubscription = exports.updatePlanForSubscription = exports.reactivateSubscription = void 0;
const chargeBeeSubscriptionService = __importStar(require("services/chargebee/subscription.service"));
const http_status_codes_1 = require("http-status-codes");
const webhook_constants_1 = require("constants/webhook.constants");
const ramda_1 = require("ramda");
const subscriptionService = __importStar(require("services/subscription.service"));
const lang_1 = __importDefault(require("lang"));
const logger_1 = require("loaders/logger");
const config_1 = __importDefault(require("config"));
const reactivateSubscription = async (req, res) => {
    const soapBody = ramda_1.head(req.body['soapenv:Envelope']['soapenv:Body']);
    const notification = ramda_1.head(soapBody['notifications']);
    const innerNotify = ramda_1.head(notification['Notification']);
    const sobject = ramda_1.head(innerNotify['sObject']);
    const accountId = ramda_1.head(sobject['sf:AccountId']);
    try {
        await chargeBeeSubscriptionService.reactivateSubscription(accountId);
        res.set('Content-Type', 'application/xml');
        res.send(webhook_constants_1.OUTBOUND_ACK_XML);
    }
    catch (err) {
        return res.status(err.http_status_code || http_status_codes_1.StatusCodes.BAD_REQUEST).send(err.message);
    }
};
exports.reactivateSubscription = reactivateSubscription;
const updatePlanForSubscription = (req, res) => {
    const { price, id } = req.body.content.plan;
    if (id === config_1.default.chargebee.subscriptionPlanId) {
        subscriptionService.updateSubscriptionPrice(price).catch(error => {
            logger_1.sentryCaptureExceptions(error);
        });
    }
    return res.json({
        message: lang_1.default.updatePriceWebhook,
    });
};
exports.updatePlanForSubscription = updatePlanForSubscription;
const incurAddonChargeOnSubscription = async (req, res) => {
    const soapBody = ramda_1.head(req.body['soapenv:Envelope']['soapenv:Body']);
    const notification = ramda_1.head(soapBody['notifications']);
    const innerNotify = ramda_1.head(notification['Notification']);
    const sobject = ramda_1.head(innerNotify['sObject']);
    const email = ramda_1.head(sobject['sf:Email__c']);
    const orderType = ramda_1.head(sobject['sf:Type']);
    try {
        await subscriptionService.addAddonChargeOnSubscription(email, orderType);
        res.set('Content-Type', 'application/xml');
        res.send(webhook_constants_1.OUTBOUND_ACK_XML);
    }
    catch (err) {
        return res.status(err.http_status_code || http_status_codes_1.StatusCodes.BAD_REQUEST).send(err.message);
    }
};
exports.incurAddonChargeOnSubscription = incurAddonChargeOnSubscription;
