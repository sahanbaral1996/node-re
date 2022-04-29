"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCase = void 0;
const container_1 = __importDefault(require("container"));
const config_1 = __importDefault(require("config"));
const OperationException_1 = __importDefault(require("api/exceptions/OperationException"));
const app_constants_1 = require("constants/app.constants");
const common_constants_1 = require("constants/salesforce/common.constants");
const createCase = async (createCase) => {
    const salesforceConnection = container_1.default.resolve(app_constants_1.SALESFORCE_TOKEN);
    const result = await salesforceConnection.sobject(common_constants_1.CASE).create({
        Description: createCase.description,
        AccountId: createCase.accountId,
        OwnerId: config_1.default.salesforce.webtocaseQuequeId,
    });
    if (!result.success) {
        throw new OperationException_1.default(result.errors, common_constants_1.CASE, common_constants_1.CREATE_OPERATION);
    }
    return result;
};
exports.createCase = createCase;
