"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReview = void 0;
const OperationException_1 = __importDefault(require("api/exceptions/OperationException"));
const app_constants_1 = require("constants/app.constants");
const common_constants_1 = require("constants/salesforce/common.constants");
const container_1 = __importDefault(require("container"));
const REVIEW = 'Review__c';
const createReview = async (accountId, review) => {
    const salesforceConnection = container_1.default.resolve(app_constants_1.SALESFORCE_TOKEN);
    const reviewObject = {
        Person__c: accountId,
        Rating__c: review.rating,
        Recommend__c: review.recommend,
        Your_Experience__c: review.yourExperience,
    };
    const response = await salesforceConnection.sobject(REVIEW).create(reviewObject);
    if (response && !response.success) {
        throw new OperationException_1.default(response.errors, REVIEW, common_constants_1.CREATE_OPERATION);
    }
    return response;
};
exports.createReview = createReview;
