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
exports.findUserAddonOrders = exports.findAddonOrders = exports.deleteAddOnOrders = exports.createAddOnOrders = void 0;
const OperationException_1 = __importDefault(require("api/exceptions/OperationException"));
const app_constants_1 = require("constants/app.constants");
const common_constants_1 = require("constants/salesforce/common.constants");
const container_1 = __importDefault(require("container"));
const recordTypeService = __importStar(require("./recordType.service"));
const salesforce_helpers_1 = require("helpers/salesforce.helpers");
const ramda_1 = require("ramda");
const common_constants_2 = require("constants/salesforce/common.constants");
const createAddOnOrders = async (accountId, productConfigurationIds) => {
    const salesforceConnection = container_1.default.resolve(app_constants_1.SALESFORCE_TOKEN);
    const addOnOrders = productConfigurationIds.map(productConfigurationId => ({
        Add_On_Configuration__c: productConfigurationId,
        Person__c: accountId,
    }));
    const response = await salesforceConnection
        .sobject(common_constants_1.ADD_ON_ORDER)
        .create(addOnOrders, { allOrNone: true });
    const [firstRecordResult] = response;
    if (firstRecordResult && !firstRecordResult.success) {
        throw new OperationException_1.default(firstRecordResult.errors, common_constants_1.ADD_ON_ORDER, common_constants_1.CREATE_OPERATION);
    }
    return response;
};
exports.createAddOnOrders = createAddOnOrders;
const deleteAddOnOrders = async (recordIds) => {
    const salesforceConnection = container_1.default.resolve(app_constants_1.SALESFORCE_TOKEN);
    const response = await salesforceConnection.sobject(common_constants_1.ADD_ON_ORDER).delete(recordIds);
    return response;
};
exports.deleteAddOnOrders = deleteAddOnOrders;
const findAddonOrders = async () => {
    const salesforceConnection = container_1.default.resolve(app_constants_1.SALESFORCE_TOKEN);
    const { Id: recordTypeId } = await recordTypeService.findRecordTypeFromDeveloperName(common_constants_1.ADDON_RECORD_TYPE_DOCENT);
    const response = await salesforceConnection
        .sobject(common_constants_2.ADDON_ORDER)
        .find({
        Is_Active__c: true,
        RecordTypeId: recordTypeId,
    })
        .execute();
    return ramda_1.map(salesforce_helpers_1.getCamelCasedObject, response);
};
exports.findAddonOrders = findAddonOrders;
const findUserAddonOrders = async (accountId) => {
    const salesforceConnection = container_1.default.resolve(app_constants_1.SALESFORCE_TOKEN);
    const response = await salesforceConnection
        .sobject(common_constants_1.ADD_ON_ORDER)
        .find({
        Person__c: accountId,
    })
        .execute();
    return ramda_1.map(salesforce_helpers_1.getCamelCasedObject, response);
};
exports.findUserAddonOrders = findUserAddonOrders;
