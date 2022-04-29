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
exports.getSalesforceFile = exports.uploadAttachment = exports.getAccountDetails = exports.uploadAttachments = void 0;
const ramda_1 = require("ramda");
const ServerError_1 = __importDefault(require("../api/exceptions/ServerError"));
const salesforce_helpers_1 = require("../helpers/salesforce.helpers");
const salesforceAccountService = __importStar(require("./salesforce/account.service"));
const salesforceDocumentService = __importStar(require("./salesforce/document.service"));
const document_constants_1 = require("constants/salesforce/document.constants");
const uploadAttachments = async ({ selfies, shelfies, customerId }) => {
    try {
        const contentVersionForSelfies = ramda_1.map(salesforce_helpers_1.addPrefixToFiles(document_constants_1.SELFIE_PREFIX), selfies);
        const contentVersionForShelfies = ramda_1.map(salesforce_helpers_1.addPrefixToFiles(document_constants_1.SHELFIE_PREFIX), shelfies);
        const contentVersionPayload = [...contentVersionForSelfies, ...contentVersionForShelfies];
        const accountResult = await salesforceAccountService.findAccountIdByCustomerId(customerId);
        const { Id: accountId } = ramda_1.compose(ramda_1.head, salesforce_helpers_1.getRecords)(accountResult);
        const contentVersionRecords = await salesforceDocumentService.createContentVersions(contentVersionPayload);
        const contentVersionIds = ramda_1.map(ramda_1.prop('id'), contentVersionRecords);
        const contentVersions = await salesforceDocumentService.findContentVersionsByIds(contentVersionIds);
        try {
            return await salesforceDocumentService.createContentDocumentLinks({ accountId, documents: contentVersions });
        }
        catch (error) {
            const contentVersionIds = contentVersions.map(({ id }) => id);
            await salesforceDocumentService.removeContentVersions(contentVersionIds);
            throw new Error('Failed at creating Content Document Links');
        }
    }
    catch (err) {
        throw new ServerError_1.default();
    }
};
exports.uploadAttachments = uploadAttachments;
/**
 * get AccountDetails
 *
 * @param {Object} req Request
 * @param {String} accountId id from salesforce
 */
const getAccountDetails = async (accountId) => {
    try {
        const accountDetails = await salesforceAccountService.getAccAssessment(accountId);
        const personAccount = ramda_1.compose(ramda_1.head, salesforce_helpers_1.getRecords)(accountDetails);
        const skinConditions = salesforce_helpers_1.getIndividualSkinConditions(personAccount.Chief_Complaints__pc);
        if (!personAccount) {
            return {};
        }
        return {
            ...ramda_1.compose(salesforce_helpers_1.getCamelCasedObject, ramda_1.dissoc('attributes'))(personAccount),
            skinConditions,
        };
    }
    catch (err) {
        throw new ServerError_1.default(err);
    }
};
exports.getAccountDetails = getAccountDetails;
const uploadAttachment = async ({ prefix, file, accountId }) => {
    try {
        const prefixedFile = salesforce_helpers_1.addPrefixToFiles(prefix, { originalname: file.originalname, buffer: file.buffer });
        const contentVersionRecord = await salesforceDocumentService.createContentVersion(prefixedFile);
        const contentVersion = await salesforceDocumentService.findContentVersionById(contentVersionRecord.id);
        try {
            await salesforceDocumentService.createContentDocumentLink({ accountId, document: contentVersion });
            // check if user uploaded shelfie
            if (prefix === document_constants_1.SHELFIE_PREFIX) {
                await salesforceAccountService.updateAccount({ accountId: accountId, hasUploadedShelfie: true });
            }
        }
        catch (error) {
            salesforceDocumentService.removeContentVersion(contentVersion.id);
            throw new Error('Failed at creating Content Document Link');
        }
    }
    catch (error) {
        throw new ServerError_1.default();
    }
};
exports.uploadAttachment = uploadAttachment;
const getSalesforceFile = async ({ prefix, file }) => {
    try {
        const prefixedFile = salesforce_helpers_1.addPrefixToFiles(prefix, file);
        const contentVersionRecord = await salesforceDocumentService.createContentVersion(prefixedFile);
        const contentVersion = await salesforceDocumentService.findContentVersionById(contentVersionRecord.id);
        return contentVersion;
    }
    catch (error) {
        throw new ServerError_1.default();
    }
};
exports.getSalesforceFile = getSalesforceFile;
