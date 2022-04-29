"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAddonImages = exports.linkMultipleDocuments = exports.removeContentVersions = exports.removeContentVersion = exports.createContentDocumentLink = exports.createContentVersion = exports.findContentVersionsByIds = exports.findContentVersionsInRange = exports.findAllContentVersions = exports.createContentDocumentLinks = exports.findContentVersionById = exports.createContentVersions = void 0;
const ramda_1 = require("ramda");
const date_fns_1 = require("date-fns");
const salesforce_helpers_1 = require("helpers/salesforce.helpers");
const container_1 = __importDefault(require("container"));
const document_constants_1 = require("constants/salesforce/document.constants");
const OperationException_1 = __importDefault(require("api/exceptions/OperationException"));
const app_constants_1 = require("constants/app.constants");
const common_constants_1 = require("constants/salesforce/common.constants");
const createContentVersions = async (contentVersionDetailList) => {
    const salesforceConnection = container_1.default.resolve(app_constants_1.SALESFORCE_TOKEN);
    const contentVersionObjects = ramda_1.map(({ prefixedFileName, body }) => ({
        ContentLocation: 'S',
        PathOnClient: prefixedFileName,
        Assessment__c: true,
        Title: prefixedFileName,
        VersionData: body,
    }), contentVersionDetailList);
    const recordResults = await salesforceConnection
        .sobject(common_constants_1.CONTENT_VERSION)
        .create(contentVersionObjects, { allOrNone: true });
    const firstResult = ramda_1.head(recordResults);
    if (!firstResult || !firstResult.success) {
        throw new OperationException_1.default(firstResult?.errors, common_constants_1.CONTENT_VERSION, common_constants_1.CREATE_OPERATION);
    }
    return recordResults;
};
exports.createContentVersions = createContentVersions;
/**
 * Get Content Version
 *
 * @param {String} id
 */
const findContentVersionById = async (id) => {
    const salesforceConnection = container_1.default.resolve(app_constants_1.SALESFORCE_TOKEN);
    const contentVersion = await salesforceConnection.sobject(common_constants_1.CONTENT_VERSION).retrieve(id);
    return salesforce_helpers_1.getCamelCasedObject(contentVersion);
};
exports.findContentVersionById = findContentVersionById;
const createContentDocumentLinks = async ({ accountId, documents, }) => {
    const salesforceConnection = container_1.default.resolve(app_constants_1.SALESFORCE_TOKEN);
    const contentDocumentLinkDetailList = documents.map(({ contentDocumentId }) => ({
        ContentDocumentId: contentDocumentId,
        LinkedEntityId: accountId,
        Visibility: document_constants_1.CONTENT_VERSION_VISIBILITY,
    }));
    const contentDocumentLink = await salesforceConnection
        .sobject(common_constants_1.CONTENT_DOCUMENT_LINK)
        .create(contentDocumentLinkDetailList);
    if (!contentDocumentLink.success) {
        throw new OperationException_1.default(contentDocumentLink.errors, common_constants_1.CONTENT_DOCUMENT_LINK, common_constants_1.CREATE_OPERATION);
    }
    return contentDocumentLink;
};
exports.createContentDocumentLinks = createContentDocumentLinks;
/**
 *
 * @param {String} accountId
 */
const findContentDocumentLinkByLinkedEntityId = async (accountId) => {
    const salesforceConnection = container_1.default.resolve(app_constants_1.SALESFORCE_TOKEN);
    const response = await salesforceConnection.sobject(common_constants_1.CONTENT_DOCUMENT_LINK).find({
        LinkedEntityId: accountId,
    });
    return ramda_1.map(salesforce_helpers_1.getCamelCasedObject, response);
};
/**
 *
 * @param {Object} params
 * @param {String} accountId
 * @param {String} prefix
 */
const findAllContentVersions = async ({ accountId, prefix }) => {
    const salesforceConnection = container_1.default.resolve(app_constants_1.SALESFORCE_TOKEN);
    const contentDocumentLinks = await findContentDocumentLinkByLinkedEntityId(accountId);
    const contentDocumentIds = ramda_1.map(({ contentDocumentId }) => contentDocumentId, contentDocumentLinks);
    if (contentDocumentIds.length) {
        const contentVersions = await salesforceConnection
            .sobject(common_constants_1.CONTENT_VERSION)
            .find({
            ContentDocumentId: { $in: contentDocumentIds },
            Title: { $like: `${prefix}-%` },
        })
            .sort({
            CreatedDate: 1,
        });
        return ramda_1.map(salesforce_helpers_1.getCamelCasedObject, contentVersions);
    }
    return [];
};
exports.findAllContentVersions = findAllContentVersions;
/**
 * @param {String} arg.accountId
 * @param {Number} arg.startDate
 * @param {Number} arg.endDate
 */
const findContentVersionsInRange = async ({ accountId, startDate, endDate, prefix }) => {
    const salesforceConnection = container_1.default.resolve(app_constants_1.SALESFORCE_TOKEN);
    const contentDocumentLinks = await findContentDocumentLinkByLinkedEntityId(accountId);
    const contentDocumentIds = ramda_1.map(({ contentDocumentId }) => contentDocumentId, contentDocumentLinks);
    const startDateTime = date_fns_1.format(Number.parseInt(startDate, 10), "yyyy-MM-dd'T'HH:mm:ss");
    const endDateTime = date_fns_1.format(Number.parseInt(endDate, 10), "yyyy-MM-dd'T'HH:mm:ss");
    if (contentDocumentIds.length) {
        const contentVersions = await salesforceConnection
            .sobject(common_constants_1.CONTENT_VERSION)
            .find({
            ContentDocumentId: { $in: contentDocumentIds },
            Title: { $like: `${prefix}-%` },
            CreatedDate: { $gte: startDateTime, $lte: endDateTime },
        })
            .sort({
            CreatedDate: 1,
        });
        return contentVersions;
    }
    return [];
};
exports.findContentVersionsInRange = findContentVersionsInRange;
const findContentVersionsByIds = async function (ids) {
    const salesforceConnection = container_1.default.resolve(app_constants_1.SALESFORCE_TOKEN);
    const contentVersions = await salesforceConnection.sobject(common_constants_1.CONTENT_VERSION).retrieve(ids);
    return ramda_1.map(salesforce_helpers_1.getCamelCasedObject, contentVersions);
};
exports.findContentVersionsByIds = findContentVersionsByIds;
const createContentVersion = async ({ prefixedFileName, body }) => {
    const salesforceConnection = container_1.default.resolve(app_constants_1.SALESFORCE_TOKEN);
    const recordResult = await salesforceConnection.sobject(common_constants_1.CONTENT_VERSION).create({
        ContentLocation: 'S',
        PathOnClient: prefixedFileName,
        Title: prefixedFileName,
        Re_Assessment__c: true,
        VersionData: body,
    });
    if (!recordResult.success) {
        throw new OperationException_1.default(recordResult.errors, common_constants_1.CONTENT_VERSION, common_constants_1.CREATE_OPERATION);
    }
    return recordResult;
};
exports.createContentVersion = createContentVersion;
const createContentDocumentLink = async ({ accountId, document, }) => {
    const salesforceConnection = container_1.default.resolve(app_constants_1.SALESFORCE_TOKEN);
    const recordResult = await salesforceConnection.sobject(common_constants_1.CONTENT_DOCUMENT_LINK).create({
        ContentDocumentId: document.contentDocumentId,
        LinkedEntityId: accountId,
        Visibility: document_constants_1.CONTENT_VERSION_VISIBILITY,
    });
    if (!recordResult.success) {
        throw new OperationException_1.default(recordResult.errors, common_constants_1.CONTENT_DOCUMENT_LINK, common_constants_1.CREATE_OPERATION);
    }
    return recordResult;
};
exports.createContentDocumentLink = createContentDocumentLink;
const removeContentVersion = async (contentVersionId) => {
    const salesforceConnection = container_1.default.resolve(app_constants_1.SALESFORCE_TOKEN);
    const result = await salesforceConnection.sobject(common_constants_1.CONTENT_VERSION).delete(contentVersionId);
    if (!result.success) {
        throw new OperationException_1.default(result.errors, common_constants_1.CONTENT_VERSION, common_constants_1.DELETE_OPERATION);
    }
    return result;
};
exports.removeContentVersion = removeContentVersion;
const removeContentVersions = async (contentVersionIds) => {
    const salesforceConnection = container_1.default.resolve(app_constants_1.SALESFORCE_TOKEN);
    const recordResults = await salesforceConnection.sobject(common_constants_1.CONTENT_VERSION).delete(contentVersionIds);
    const successfulResults = [];
    const errorResults = [];
    for (const result of recordResults) {
        if (result.success) {
            successfulResults.push(result);
        }
        else {
            errorResults.push(result);
        }
    }
    if (errorResults.length) {
        throw new OperationException_1.default(errorResults[0].errors, common_constants_1.CONTENT_VERSION, common_constants_1.DELETE_OPERATION);
    }
    return successfulResults;
};
exports.removeContentVersions = removeContentVersions;
const linkMultipleDocuments = async ({ accountId, documentIds, }) => {
    const salesforceConnection = container_1.default.resolve(app_constants_1.SALESFORCE_TOKEN);
    const linkRequests = documentIds.map(id => ({
        ContentDocumentId: id,
        LinkedEntityId: accountId,
        Visibility: document_constants_1.CONTENT_VERSION_VISIBILITY,
    }));
    const recordResults = await salesforceConnection
        .sobject(common_constants_1.CONTENT_DOCUMENT_LINK)
        .create(linkRequests, { allOrNone: true });
    const [firstRecordResult] = recordResults;
    if (firstRecordResult && !firstRecordResult.success) {
        throw new OperationException_1.default(firstRecordResult.errors, common_constants_1.CONTENT_DOCUMENT_LINK, common_constants_1.CREATE_OPERATION);
    }
    return recordResults;
};
exports.linkMultipleDocuments = linkMultipleDocuments;
/**
 *  Fetch addon images
 * @param {String[]} addonIds
 */
const findAddonImages = async (addonIds) => {
    const salesforceConnection = container_1.default.resolve(app_constants_1.SALESFORCE_TOKEN);
    const contentVersions = await salesforceConnection
        .sobject(common_constants_1.CONTENT_VERSION)
        .find({
        firstPublishLocationId: { $in: addonIds },
    })
        .sort({
        CreatedDate: 1,
    });
    return ramda_1.map(salesforce_helpers_1.getCamelCasedObject, contentVersions);
};
exports.findAddonImages = findAddonImages;
