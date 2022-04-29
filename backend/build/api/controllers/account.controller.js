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
exports.attachImages = exports.attachmentUpload = exports.updateStatus = exports.uploadAttachment = exports.getAccountDetails = exports.uploadAttachments = void 0;
const http_status_codes_1 = require("http-status-codes");
const lang_1 = __importDefault(require("lang"));
const accountService = __importStar(require("services/account.service"));
const account_service_1 = require("services/salesforce/account.service");
const salesforceDocumentService = __importStar(require("services/salesforce/document.service"));
const Error_1 = __importDefault(require("api/exceptions/Error"));
/**
 * Upload Attachments
 *
 * @param {Object} req Request
 * @param {Object} res Response
 */
const uploadAttachments = async (req, res, next) => {
    try {
        const { selfies = [], shelfies = [] } = req.files;
        const { id: customerId } = req.params;
        await accountService.uploadAttachments({ shelfies, selfies, customerId });
        res.status(http_status_codes_1.StatusCodes.OK).json({
            code: http_status_codes_1.StatusCodes.OK,
            message: lang_1.default.uploadedSuccessfully,
        });
    }
    catch (err) {
        next(err);
    }
};
exports.uploadAttachments = uploadAttachments;
/**
 * Get accountDetails.
 *
 * @param {*} req
 * @param {*} res
 * @param {Function} next
 */
const getAccountDetails = async (req, res, next) => {
    try {
        if (req.currentUser) {
            const { salesforceReferenceId: accountId } = req.currentUser;
            const person = await accountService.getAccountDetails(accountId);
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                code: http_status_codes_1.StatusCodes.OK,
                data: person,
            });
        }
        else {
            throw new Error_1.default('Not authorized');
        }
    }
    catch (err) {
        next(err);
    }
};
exports.getAccountDetails = getAccountDetails;
// @TODO: deprecate in favor of attachmentUpload
const uploadAttachment = async (req, res, next) => {
    try {
        if (req.currentUser) {
            const { body: { prefix }, file, } = req;
            const { salesforceReferenceId: accountId } = req.currentUser;
            await accountService.uploadAttachment({ prefix, accountId: accountId, file });
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                code: http_status_codes_1.StatusCodes.OK,
                message: lang_1.default.uploadedSuccessfully,
            });
        }
        throw new Error_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED);
    }
    catch (error) {
        next(error);
    }
};
exports.uploadAttachment = uploadAttachment;
const updateStatus = async (req, res, next) => {
    try {
        if (req.currentUser) {
            const { body: { status }, } = req;
            const { salesforceReferenceId: accountId } = req.currentUser;
            await account_service_1.updateAccount({ accountId, status });
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                code: http_status_codes_1.StatusCodes.OK,
                message: lang_1.default.updateStatus,
            });
        }
        throw new Error_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED);
    }
    catch (error) {
        next(error);
    }
};
exports.updateStatus = updateStatus;
/**
 * Upload Attachment
 *
 * @param {Object} req Request
 * @param {Object} res Response
 */
const attachmentUpload = async (req, res, next) => {
    try {
        if (req.currentUser) {
            const { body: { prefix }, file, } = req;
            const { salesforceReferenceId: accountId } = req.currentUser;
            const { contentDocumentId } = await accountService.getSalesforceFile({
                prefix,
                accountId,
                file,
            });
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                code: http_status_codes_1.StatusCodes.OK,
                message: lang_1.default.uploadedSuccessfully,
                salesForceContentDocumentId: contentDocumentId,
            });
        }
        throw new Error_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED);
    }
    catch (error) {
        next(error);
    }
};
exports.attachmentUpload = attachmentUpload;
/**
 * Attach Photo
 *
 * @param {Object} req Request
 * @param {Object} res Response
 */
const attachImages = async (req, res, next) => {
    try {
        if (req.currentUser) {
            const { body: { selfies }, } = req;
            const { salesforceReferenceId: accountId } = req.currentUser;
            await salesforceDocumentService.linkMultipleDocuments({
                accountId,
                documentIds: selfies,
            });
            return res.json({
                code: http_status_codes_1.StatusCodes.OK,
                message: lang_1.default.photoAttachmentSuccess,
            });
        }
        throw new Error_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED);
    }
    catch (error) {
        next(error);
    }
};
exports.attachImages = attachImages;
