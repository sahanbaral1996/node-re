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
exports.reactivateSubscription = exports.retreive = exports.estimate = exports.create = void 0;
const http_status_codes_1 = require("http-status-codes");
const subscriptionService = __importStar(require("services/subscription.service"));
const lang_1 = __importDefault(require("lang"));
const create = async (req, res, next) => {
    try {
        const { salesforceReferenceId: accountReferenceId, chargebeeReferenceId: customerReferenceId } = req.currentUser;
        await subscriptionService.setupSubscription(req.body, accountReferenceId, customerReferenceId);
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            code: http_status_codes_1.StatusCodes.OK,
            message: lang_1.default.setupSubscriptionSuccessfully,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.create = create;
const estimate = async (req, res, next) => {
    try {
        const data = await subscriptionService.estimateSubscription(req.body);
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            code: http_status_codes_1.StatusCodes.OK,
            data,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.estimate = estimate;
const retreive = async (req, res, next) => {
    try {
        const { chargebeeReferenceId: customerReferenceId } = req.currentUser;
        const data = await subscriptionService.retreiveSubscription(customerReferenceId);
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            code: http_status_codes_1.StatusCodes.OK,
            data,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.retreive = retreive;
const reactivateSubscription = async (req, res, next) => {
    try {
        const { chargebeeReferenceId: customerReferenceId } = req.currentUser;
        const data = await subscriptionService.reactivateSubscription(customerReferenceId);
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            code: http_status_codes_1.StatusCodes.OK,
            data,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.reactivateSubscription = reactivateSubscription;
