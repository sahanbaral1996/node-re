"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDetails = void 0;
const http_status_codes_1 = require("http-status-codes");
const order_service_1 = require("services/salesforce/order.service");
const Error_1 = __importDefault(require("api/exceptions/Error"));
/**
 * Fetch Skin Condition Details
 *
 * @param {Object} req Request
 * @param {Object} res Response
 */
const getDetails = async (req, res, next) => {
    try {
        if (req.currentUser) {
            const { salesforceReferenceId: accountId } = req.currentUser;
            const data = await order_service_1.findSingleOrder(accountId);
            return res.json({
                code: http_status_codes_1.StatusCodes.OK,
                data: {
                    details: data.aTPWhatarewetreating,
                },
            });
        }
        else {
            throw new Error_1.default('Unauthorized', http_status_codes_1.StatusCodes.UNAUTHORIZED);
        }
    }
    catch (error) {
        next(error);
    }
};
exports.getDetails = getDetails;
