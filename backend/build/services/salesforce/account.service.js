"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAccount = exports.updateBillingAndShipping = exports.findByEmail = exports.updateChargebeeId = exports.updateAccount = exports.getRecordType = exports.createAccount = exports.findAccountByAccountId = exports.findPhysicianDetail = exports.getAccAssessment = exports.findAccountIdByChargeBeeId = exports.findAccountIdByCustomerId = exports.findRecordIdByEmail = void 0;
const http_status_codes_1 = require("http-status-codes");
const Error_1 = __importDefault(require("api/exceptions/Error"));
const OperationException_1 = __importDefault(require("api/exceptions/OperationException"));
const ServerError_1 = __importDefault(require("api/exceptions/ServerError"));
const salesforce_helpers_1 = require("helpers/salesforce.helpers");
const container_1 = __importDefault(require("container"));
const customer_constants_1 = require("constants/customer.constants");
const app_constants_1 = require("constants/app.constants");
const common_constants_1 = require("constants/salesforce/common.constants");
/**
 * Find account Id by email.
 *
 * @param {*} email
 */
const findRecordIdByEmail = async (email) => {
    try {
        const salesforceConnection = container_1.default.resolve(app_constants_1.SALESFORCE_TOKEN);
        const accountRecordResponse = await salesforceConnection.query(`SELECT ID FROM Account WHERE email__c = ${salesforce_helpers_1.getInQuotes(email)}`);
        return accountRecordResponse;
    }
    catch (error) {
        throw new Error_1.default(error.message);
    }
};
exports.findRecordIdByEmail = findRecordIdByEmail;
/**
 *
 * @param {Number} customerId
 */
const findAccountIdByCustomerId = async (customerId) => {
    try {
        const salesforceConnection = container_1.default.resolve(app_constants_1.SALESFORCE_TOKEN);
        const accountRecordResponse = await salesforceConnection.query(`SELECT ID FROM Account WHERE Customer_ID__pc = ${salesforce_helpers_1.getInQuotes(customerId)}`);
        if (accountRecordResponse.totalSize !== 1) {
            throw new Error_1.default(`Account Id not found for customer ${customerId}`, http_status_codes_1.StatusCodes.NOT_FOUND);
        }
        return accountRecordResponse;
    }
    catch (error) {
        throw new Error_1.default(error.message);
    }
};
exports.findAccountIdByCustomerId = findAccountIdByCustomerId;
/**
 *
 * @param {Number} customerId
 */
const findAccountIdByChargeBeeId = async (customerId) => {
    try {
        const salesforceConnection = container_1.default.resolve(app_constants_1.SALESFORCE_TOKEN);
        const accountRecordResponse = await salesforceConnection.query(`SELECT ID FROM Account WHERE chargebeeapps__CB_Id__c = ${salesforce_helpers_1.getInQuotes(customerId)}`);
        if (accountRecordResponse.totalSize !== 1) {
            throw new Error_1.default(`Account Id not found for customer ${customerId}`, http_status_codes_1.StatusCodes.NOT_FOUND);
        }
        return accountRecordResponse;
    }
    catch (error) {
        throw new Error_1.default(error.message);
    }
};
exports.findAccountIdByChargeBeeId = findAccountIdByChargeBeeId;
/**
 * Get account details by salesforce account Id.
 * @param {*} req
 * @param {String} accountId
 */
const getAccAssessment = async (accountId) => {
    try {
        const salesforceConnection = container_1.default.resolve(app_constants_1.SALESFORCE_TOKEN);
        const query = await salesforceConnection.query(`SELECT
        Assmt_Days_Until_Due__pc, Assmt_Next_Due_Date__pc, Assmt_Last_Completed__pc, Assmt_Active__pc,
        Chief_Complaints__pc,
        id, Name
        FROM Account WHERE ID = '${accountId}'`);
        return query;
    }
    catch (err) {
        console.log(err);
        throw new ServerError_1.default();
    }
};
exports.getAccAssessment = getAccAssessment;
const findPhysicianDetail = async (contactId) => {
    try {
        const salesforceConnection = container_1.default.resolve(app_constants_1.SALESFORCE_TOKEN);
        const response = await salesforceConnection
            .sobject(common_constants_1.ACCOUNT)
            .findOne({
            Id: contactId,
        }, {
            Id: true,
            Name: true,
        })
            .execute();
        return salesforce_helpers_1.getCamelCasedObject(response);
    }
    catch (error) {
        throw new Error_1.default(error.message);
    }
};
exports.findPhysicianDetail = findPhysicianDetail;
const findAccountByAccountId = async (accountId) => {
    try {
        const salesforceConnection = container_1.default.resolve(app_constants_1.SALESFORCE_TOKEN);
        const response = await salesforceConnection
            .sobject(common_constants_1.ACCOUNT)
            .findOne({
            Id: accountId,
        }, {
            Id: true,
            Name: true,
            FirstName: true,
            LastName: true,
            Email__c: true,
            DOB__pc: true,
            Trial_End_Date_Formula__pc: true,
            Hyperpigmentation__pc: true,
            Status__pc: true,
            Lead_Id__c: true,
            Phone: true,
            Assmt_Active__pc: true,
        })
            .execute();
        return salesforce_helpers_1.getCamelCasedObject(response);
    }
    catch (error) {
        throw new Error_1.default(error.message);
    }
};
exports.findAccountByAccountId = findAccountByAccountId;
const createAccount = async (account) => {
    const salesforceConnection = container_1.default.resolve(app_constants_1.SALESFORCE_TOKEN);
    const response = await salesforceConnection.sobject(common_constants_1.ACCOUNT).create({
        FirstName: account.firstName,
        LastName: account.lastName,
        Email__c: account.email,
        Phone: account.phone,
        DOB__pc: account.dob,
        RecordTypeId: account.recordTypeId,
        Type: customer_constants_1.CUSTOMER_RECORD_TYPE,
        Lead_Id__c: account.leadId,
        I_agree_to_NoPP_and_TOA__pc: account.noppToa,
        I_agree_to_receive_frequent_marketing__pc: account.newsletter,
        Is_In_Allowed_State__c: salesforce_helpers_1.checkIfAllowedState(account.state),
        Home_State__pc: account.state,
        Status__pc: account.status,
        In_Person_Signup__c: account.isInPersonSignUp,
    });
    if (!response.success) {
        throw new OperationException_1.default(response.errors, common_constants_1.ACCOUNT, common_constants_1.CREATE_OPERATION);
    }
    return response.id;
};
exports.createAccount = createAccount;
const getRecordType = async (recordType) => {
    try {
        const salesforceConnection = container_1.default.resolve(app_constants_1.SALESFORCE_TOKEN);
        const result = await salesforceConnection.query(`select Id,Name from RecordType where sObjectType='Assessment__c' and DeveloperName='${recordType}'`);
        return result;
    }
    catch (error) {
        throw new Error_1.default(error.message);
    }
};
exports.getRecordType = getRecordType;
const updateAccount = async (updateAccount) => {
    const salesforceConnection = container_1.default.resolve(app_constants_1.SALESFORCE_TOKEN);
    const response = await salesforceConnection.sobject(common_constants_1.ACCOUNT).update({
        Id: updateAccount.accountId,
        Status__pc: updateAccount.status,
        Email__c: updateAccount.email,
        chargebeeapps__CB_Id__c: updateAccount.chargebeeCustomerId,
        Phone: updateAccount.phone,
        Is_shipping_billing_same__c: updateAccount.isSameAsShippingAddress,
        Has_Uploaded_Shelfie__c: updateAccount.hasUploadedShelfie,
    });
    if (!response.success) {
        throw new OperationException_1.default(response.errors, common_constants_1.ACCOUNT, common_constants_1.UPDATE_OPERATION);
    }
    return response;
};
exports.updateAccount = updateAccount;
const updateChargebeeId = async (updateChargebeeId) => {
    const salesforceConnection = container_1.default.resolve(app_constants_1.SALESFORCE_TOKEN);
    const response = await salesforceConnection.sobject(common_constants_1.ACCOUNT).update({
        Id: updateChargebeeId.Id,
        chargebeeapps__CB_Id__c: updateChargebeeId.chargeBeeId,
    });
    if (!response.success) {
        throw new OperationException_1.default(response.errors, common_constants_1.ACCOUNT, common_constants_1.UPDATE_OPERATION);
    }
    return response;
};
exports.updateChargebeeId = updateChargebeeId;
const findByEmail = async (email) => {
    const salesforceConnection = container_1.default.resolve(app_constants_1.SALESFORCE_TOKEN);
    const response = await salesforceConnection.sobject(common_constants_1.ACCOUNT).findOne({
        Email__c: email,
    });
    return response;
};
exports.findByEmail = findByEmail;
const updateBillingAndShipping = async (accountId, customerData) => {
    const { shippingAddress, billingAddress } = customerData;
    const salesforceConnection = container_1.default.resolve(app_constants_1.SALESFORCE_TOKEN);
    const billingAddressInformation = salesforce_helpers_1.getAddressInformation(billingAddress);
    const shippingAddressInformation = salesforce_helpers_1.getAddressInformation(shippingAddress);
    const response = await salesforceConnection.sobject(common_constants_1.ACCOUNT).update({
        Id: accountId,
        BillingStreet: billingAddressInformation.street,
        BillingCity: billingAddressInformation.city,
        BillingState: billingAddressInformation.state,
        BillingPostalCode: billingAddressInformation.postalCode,
        BillingCountry: billingAddressInformation.country,
        ShippingStreet: shippingAddressInformation.street,
        ShippingState: shippingAddressInformation.state,
        ShippingCity: shippingAddressInformation.city,
        ShippingPostalCode: shippingAddressInformation.postalCode,
        ShippingCountry: shippingAddressInformation.country,
    });
    if (!response.success) {
        throw new OperationException_1.default(response.errors, common_constants_1.ACCOUNT, common_constants_1.UPDATE_OPERATION);
    }
    return response;
};
exports.updateBillingAndShipping = updateBillingAndShipping;
const deleteAccount = async (accountId) => {
    const salesforceConnection = container_1.default.resolve(app_constants_1.SALESFORCE_TOKEN);
    const response = await salesforceConnection.sobject(common_constants_1.ACCOUNT).destroy(accountId);
    if (!response.success) {
        throw new OperationException_1.default(response.errors, common_constants_1.ACCOUNT, common_constants_1.DESTROY_OPERATION);
    }
    return response;
};
exports.deleteAccount = deleteAccount;
