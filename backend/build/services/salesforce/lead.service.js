"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findLeadById = exports.deleteLead = exports.updateLead = exports.findLeadByEmail = exports.createLead = void 0;
const jsforce_1 = require("jsforce");
const container_1 = __importDefault(require("container"));
const common_constants_1 = require("constants/salesforce/common.constants");
const app_constants_1 = require("constants/app.constants");
const OperationException_1 = __importDefault(require("api/exceptions/OperationException"));
const salesforce_helpers_1 = require("helpers/salesforce.helpers");
async function createLead(createLeadDetails) {
    const salesforceConnection = container_1.default.resolve(app_constants_1.SALESFORCE_TOKEN);
    const response = await salesforceConnection.sobject(common_constants_1.LEAD).create({
        Email: createLeadDetails.email,
        Phone: createLeadDetails.phone,
        FirstName: createLeadDetails.firstName,
        LastName: createLeadDetails.lastName,
        DOB__c: createLeadDetails.dob ? jsforce_1.SfDate.toDateLiteral(createLeadDetails.dob) : undefined,
        I_agree_to_NoPP_and_TOA__c: createLeadDetails.noppToa,
        I_agree_to_receive_frequent_marketing__c: createLeadDetails.newsletter,
        Home_State__c: createLeadDetails.state,
    });
    if (!response.success) {
        throw new OperationException_1.default(response.errors, common_constants_1.LEAD, common_constants_1.CREATE_OPERATION);
    }
    return response;
}
exports.createLead = createLead;
async function findLeadByEmail(email) {
    const salesforceConnection = container_1.default.resolve(app_constants_1.SALESFORCE_TOKEN);
    const response = await salesforceConnection.sobject(common_constants_1.LEAD).findOne({
        Email: email,
    });
    return salesforce_helpers_1.getCamelCasedObject(response);
}
exports.findLeadByEmail = findLeadByEmail;
async function updateLead({ id, leadDetails }) {
    const salesforceConnection = container_1.default.resolve(app_constants_1.SALESFORCE_TOKEN);
    const response = await salesforceConnection.sobject(common_constants_1.LEAD).update({
        Id: id,
        Email: leadDetails.email,
        Phone: leadDetails.phone,
        FirstName: leadDetails.firstName,
        LastName: leadDetails.lastName,
        DOB__c: leadDetails.dob ? jsforce_1.SfDate.toDateLiteral(leadDetails.dob) : undefined,
        I_agree_to_NoPP_and_TOA__c: leadDetails.noppToa,
        I_agree_to_receive_frequent_marketing__c: leadDetails.newsletter,
        Home_State__c: leadDetails.state,
        Status: leadDetails.status,
    });
    if (!response.success) {
        throw new OperationException_1.default(response.errors, common_constants_1.LEAD, common_constants_1.UPDATE_OPERATION);
    }
    return response;
}
exports.updateLead = updateLead;
async function deleteLead(id) {
    const salesforceConnection = container_1.default.resolve(app_constants_1.SALESFORCE_TOKEN);
    const response = await salesforceConnection.sobject(common_constants_1.LEAD).delete(id);
    if (!response.success) {
        throw new OperationException_1.default(response.errors, common_constants_1.LEAD, common_constants_1.DELETE_OPERATION);
    }
    return response;
}
exports.deleteLead = deleteLead;
async function findLeadById(id) {
    const salesforceConnection = container_1.default.resolve(app_constants_1.SALESFORCE_TOKEN);
    const response = await salesforceConnection.sobject(common_constants_1.LEAD).findOne({
        Id: id,
    }, {
        Id: true,
        Name: true,
        Email: true,
        DOB__c: true,
        Status: true,
        Phone: true,
        FirstName: true,
        LastName: true,
        I_agree_to_NoPP_and_TOA__c: true,
        I_agree_to_receive_frequent_marketing__c: true,
        Home_State__c: true,
    });
    return salesforce_helpers_1.getCamelCasedObject(response);
}
exports.findLeadById = findLeadById;
