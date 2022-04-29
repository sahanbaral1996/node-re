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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAssessment = void 0;
const assessmentService = __importStar(require("services/salesforce/assessment.service"));
const accountService = __importStar(require("services/salesforce/account.service"));
const contact_types_1 = require("types/salesforce/contact.types");
const salesforce_helpers_1 = require("../helpers/salesforce.helpers");
const ramda_1 = require("ramda");
const createAssessment = async (accountId, assessment) => {
    let assessmentId;
    try {
        const accountDetails = await accountService.findAccountByAccountId(accountId);
        const { dOB: dob } = ramda_1.compose(salesforce_helpers_1.getCamelCasedObject)(accountDetails);
        assessmentId = await assessmentService.createAssessment({
            email: accountDetails.email,
            dob,
            accountId: accountDetails.id,
            ...assessment,
        });
        const response = await accountService.updateAccount({
            accountId: accountDetails.id,
            status: contact_types_1.ContactStatus.BillingInformation,
        });
        return { response, assessmentId };
    }
    catch (error) {
        if (assessmentId) {
            assessmentService.deleteAssessment(assessmentId);
        }
        throw new Error(error);
    }
};
exports.createAssessment = createAssessment;
