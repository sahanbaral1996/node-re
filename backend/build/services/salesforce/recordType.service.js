"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findRecordTypeFromDeveloperName = void 0;
const container_1 = __importDefault(require("container"));
const NotFoundException_1 = __importDefault(require("api/exceptions/NotFoundException"));
const app_constants_1 = require("constants/app.constants");
const common_constants_1 = require("constants/salesforce/common.constants");
const findRecordTypeFromDeveloperName = async (developerName) => {
    const salesforceConnection = container_1.default.resolve(app_constants_1.SALESFORCE_TOKEN);
    const response = await salesforceConnection.sobject(common_constants_1.RECORD_TYPE).findOne({
        DeveloperName: developerName,
    });
    if (!response.Id) {
        throw new NotFoundException_1.default(`Record Type not found for ${developerName}`);
    }
    return response;
};
exports.findRecordTypeFromDeveloperName = findRecordTypeFromDeveloperName;
