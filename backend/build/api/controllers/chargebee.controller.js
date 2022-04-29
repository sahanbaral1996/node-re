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
exports.customerPortal = exports.hostedPage = exports.register = void 0;
const http_status_codes_1 = require("http-status-codes");
const chargebeeCustomerService = __importStar(require("services/chargebee/customer.service"));
/**
 * Customer Register on chargebee.
 *
 * @param {Object} req Request
 * @param {Object} res Response
 */
const register = async (req, res) => {
    try {
        const { customer } = await chargebeeCustomerService.create(req.body);
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            code: http_status_codes_1.StatusCodes.OK,
            data: { ...customer },
        });
    }
    catch (err) {
        return res.status(err.http_status_code || http_status_codes_1.StatusCodes.BAD_REQUEST).send(err.message);
    }
};
exports.register = register;
/**
 * Request chargebee hosted page.
 *
 * @param {Object} req Request
 * @param {Object} res Response
 */
const hostedPage = async (req, res, next) => {
    try {
        const { planId, customerId } = req.body;
        const { hosted_page } = await chargebeeCustomerService.getHostedPage(planId, customerId);
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            code: http_status_codes_1.StatusCodes.OK,
            data: { ...hosted_page },
        });
    }
    catch (err) {
        err.status = err.http_status_code || http_status_codes_1.StatusCodes.BAD_REQUEST;
        next(err);
    }
};
exports.hostedPage = hostedPage;
/**
 * Request chargebee hosted customer portal.
 *
 * @param {Object} req Request
 * @param {Object} res Response
 */
const customerPortal = async (req, res, next) => {
    try {
        const { chargebeeReferenceId: customerId } = req.currentUser;
        const { portal_session } = await chargebeeCustomerService.getHostedPortal(customerId);
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            code: http_status_codes_1.StatusCodes.OK,
            data: { ...portal_session },
        });
    }
    catch (err) {
        err.status = err.http_status_code || http_status_codes_1.StatusCodes.BAD_REQUEST;
        next(err);
    }
};
exports.customerPortal = customerPortal;
