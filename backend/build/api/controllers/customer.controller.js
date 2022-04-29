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
exports.addReview = exports.addAddon = exports.deleteAddon = exports.updateName = exports.updatePassword = exports.updateUser = exports.getAllAddonOrder = exports.approveOrder = exports.declineOrder = exports.orderReviewDetails = exports.createCase = exports.getUserAssessment = exports.userReassessment = exports.getCustomerInformation = exports.createCustomer = void 0;
const http_status_codes_1 = require("http-status-codes");
const customerService = __importStar(require("services/customer.service"));
const Error_1 = __importDefault(require("api/exceptions/Error"));
const lang_1 = __importDefault(require("lang"));
const authentication_constants_1 = require("constants/authentication.constants");
const auth_1 = require("utils/auth");
const AlreadyExistsException_1 = __importDefault(require("api/exceptions/AlreadyExistsException"));
const createCustomer = async (req, res, next) => {
    try {
        const session = await customerService.createCustomer(req.body);
        return res.status(http_status_codes_1.StatusCodes.OK).json(session);
    }
    catch (error) {
        next(error);
    }
};
exports.createCustomer = createCustomer;
const getCustomerInformation = async (req, res, next) => {
    try {
        const { salesforceReferenceId: accountId, chargebeeReferenceId: chargebeeId, id, groups } = req.currentUser;
        const customerInformation = await customerService.getCustomerInformation(accountId, groups, req.currentUser);
        return res.json({
            code: http_status_codes_1.StatusCodes.OK,
            data: {
                ...customerInformation,
                chargebeeId,
                salesforceId: accountId,
                id,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getCustomerInformation = getCustomerInformation;
const userReassessment = async (req, res, next) => {
    try {
        if (req.currentUser) {
            const { salesforceReferenceId: accountId } = req.currentUser;
            const customerInformation = await customerService.saveReassessment(accountId, req.body);
            return res.json({
                code: http_status_codes_1.StatusCodes.OK,
                data: {
                    ...customerInformation,
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
exports.userReassessment = userReassessment;
const getUserAssessment = async (req, res, next) => {
    try {
        const { salesforceReferenceId: accountId } = req.currentUser;
        const customerInformation = await customerService.getAssessment(accountId);
        return res.json({
            code: http_status_codes_1.StatusCodes.OK,
            data: {
                ...customerInformation,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getUserAssessment = getUserAssessment;
const createCase = async (req, res, next) => {
    try {
        if (req.currentUser) {
            const { salesforceReferenceId: accountId } = req.currentUser;
            const { description, selfies } = req.body;
            await customerService.createCustomerCase({ description, selfies, accountId });
            return res.json({
                code: http_status_codes_1.StatusCodes.OK,
                data: {
                    message: lang_1.default.caseCreated,
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
exports.createCase = createCase;
/**
 * Get Order Review details
 *
 * @param {Object} req Request
 * @param {Object} res Response
 */
const orderReviewDetails = async (req, res, next) => {
    try {
        if (req.currentUser) {
            const { salesforceReferenceId: accountId } = req.currentUser;
            const orderReviewDetails = await customerService.getOrderReviewDetails(accountId);
            return res.json({
                code: http_status_codes_1.StatusCodes.OK,
                data: orderReviewDetails,
            });
        }
        throw new Error_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED);
    }
    catch (error) {
        next(error);
    }
};
exports.orderReviewDetails = orderReviewDetails;
const declineOrder = async (req, res, next) => {
    try {
        if (req.currentUser) {
            const { description } = req.body;
            const { orderId } = req.params;
            const { salesforceReferenceId: accountId } = req.currentUser;
            await customerService.declineOrder({ orderId, description, accountId });
            return res.json({
                code: http_status_codes_1.StatusCodes.OK,
                data: {
                    message: lang_1.default.declinedOrder,
                },
            });
        }
        throw new Error_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED);
    }
    catch (error) {
        next(error);
    }
};
exports.declineOrder = declineOrder;
/**
 * Approve Order Review
 *
 * @param {Object} req Request
 * @param {Object} res Response
 */
const approveOrder = async (req, res, next) => {
    try {
        const { orderId } = req.params;
        await customerService.approveOrder(orderId);
        return res.json({
            code: http_status_codes_1.StatusCodes.OK,
            data: {
                message: lang_1.default.approvedOrder,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.approveOrder = approveOrder;
const getAllAddonOrder = async (req, res, next) => {
    try {
        const orders = await customerService.getAllAddonOrder();
        return res.json({
            code: http_status_codes_1.StatusCodes.OK,
            orders,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllAddonOrder = getAllAddonOrder;
const updateUser = async (req, res, next) => {
    try {
        const currentUser = req.currentUser;
        const data = await customerService.update(currentUser, req.body);
        return res.json({
            data: {
                ...data,
                message: lang_1.default.emailChangeSuccess,
            },
        });
    }
    catch (error) {
        if (error instanceof AlreadyExistsException_1.default) {
            return next(new Error_1.default(error.message, http_status_codes_1.StatusCodes.CONFLICT));
        }
        return next(error);
    }
};
exports.updateUser = updateUser;
const updatePassword = async (req, res, next) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const authorization = req.header(authentication_constants_1.AUTHORIZATION_HEADER);
        const accessToken = auth_1.getToken(authentication_constants_1.AUTHORIZATION_VALUE_PREFIX, authorization);
        const data = await customerService.changePassword({ accessToken, oldPassword, newPassword });
        return res.json({
            data: {
                ...data,
                message: lang_1.default.passwordChangeSuccess,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updatePassword = updatePassword;
const updateName = async (req, res, next) => {
    try {
        const { email, salesforceReferenceId } = req.currentUser;
        const data = await customerService.updateName(email, salesforceReferenceId, req.body);
        return res.json({
            data,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateName = updateName;
const deleteAddon = async (req, res, next) => {
    try {
        const { chargebeeReferenceId, salesforceReferenceId } = req.currentUser;
        const addonId = req.body.addonIds;
        const data = await customerService.deleteAddon(addonId, chargebeeReferenceId, salesforceReferenceId);
        return res.json({ data });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteAddon = deleteAddon;
const addAddon = async (req, res, next) => {
    try {
        const { salesforceReferenceId, chargebeeReferenceId } = req.currentUser;
        const addonId = req.body.addonIds;
        const data = await customerService.addAddon(addonId, salesforceReferenceId, chargebeeReferenceId);
        return res.json({ data });
    }
    catch (error) {
        next(error);
    }
};
exports.addAddon = addAddon;
const addReview = async (req, res, next) => {
    try {
        const { salesforceReferenceId } = req.currentUser;
        const { yourExperience, rating, recommend, picture } = req.body;
        const data = await customerService.addReview(salesforceReferenceId, { yourExperience, rating, recommend, picture });
        return res.json({ data });
    }
    catch (error) {
        next(error);
    }
};
exports.addReview = addReview;
