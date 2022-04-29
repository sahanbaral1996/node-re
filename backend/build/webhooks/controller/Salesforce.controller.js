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
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriptionChanged = exports.updatePaymentStatus = exports.createBillingOrder = exports.updateBillingAndShippingInfo = void 0;
const customerService = __importStar(require("services/customer.service"));
const salesforceBillingService = __importStar(require("services/salesforce/billingorder.service"));
const http_status_codes_1 = require("http-status-codes");
/**
 * Update Billing and Shipping Info.
 *
 * @param {Object} req Request
 * @param {Object} res Response
 */
const updateBillingAndShippingInfo = async (req, res, next) => {
    try {
        const customer = await customerService.updateBillingAndShippingAddress(req.body);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            code: http_status_codes_1.StatusCodes.OK,
            customer,
        });
    }
    catch (err) {
        next(err);
    }
};
exports.updateBillingAndShippingInfo = updateBillingAndShippingInfo;
/**
 * Update Billing Order Info.
 *
 * @param {Object} req Request
 * @param {Object} res Response
 */
const createBillingOrder = async (req, res, next) => {
    try {
        const billingData = await salesforceBillingService.createBillingOrder(req.body.content.invoice);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            code: http_status_codes_1.StatusCodes.OK,
            billingData,
        });
    }
    catch (err) {
        next(err);
    }
};
exports.createBillingOrder = createBillingOrder;
/**
 * Update Billing Order Info.
 *
 * @param {Object} req Request
 * @param {Object} res Response
 */
const updatePaymentStatus = async (req, res, next) => {
    try {
        const billingData = await salesforceBillingService.updatePaymentStatus(req.body.content);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            code: http_status_codes_1.StatusCodes.OK,
            billingData,
        });
    }
    catch (err) {
        next(err);
    }
};
exports.updatePaymentStatus = updatePaymentStatus;
/**
 * Update Subscription paused or cancelled.
 *
 * @param {Object} req Request
 * @param {Object} res Response
 */
const subscriptionChanged = async (req, res, next) => {
    try {
        const billingData = await salesforceBillingService.subcriptionChanged(req.body.content, req.body.event_type);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            code: http_status_codes_1.StatusCodes.OK,
            billingData,
        });
    }
    catch (err) {
        next(err);
    }
};
exports.subscriptionChanged = subscriptionChanged;
