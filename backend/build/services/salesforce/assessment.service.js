"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAsessmentDetail = exports.deleteAssessment = exports.saveReassessment = exports.createAssessment = void 0;
const container_1 = __importDefault(require("container"));
const salesforce_helpers_1 = require("helpers/salesforce.helpers");
const salesforce_helpers_2 = require("helpers/salesforce.helpers");
const OperationException_1 = __importDefault(require("api/exceptions/OperationException"));
const app_constants_1 = require("constants/app.constants");
const common_constants_1 = require("constants/salesforce/common.constants");
const createAssessment = async (assessmentDetails) => {
    const salesforceConnection = container_1.default.resolve(app_constants_1.SALESFORCE_TOKEN);
    const response = await salesforceConnection.sobject(common_constants_1.ASSESSMENT).create({
        Customer_DOB__c: assessmentDetails.dob,
        Customer_Email__c: assessmentDetails.email,
        Gender__c: salesforce_helpers_2.formatGenderIdentity(assessmentDetails.genderIdentity),
        Acne__c: assessmentDetails.primarySkinConcernChoice1,
        Hyperpigmentation__c: assessmentDetails.primarySkinConcernChoice2,
        Skin_Texture_or_Firmness__c: assessmentDetails.primarySkinConcernChoice3,
        Rosacea__c: assessmentDetails.primarySkinConcernChoice4,
        Melasma__c: assessmentDetails.primarySkinConcernChoice5,
        Maskne__c: assessmentDetails.primarySkinConcernChoice6,
        Fine_Lines_and_Wrinkles__c: assessmentDetails.primarySkinConcernChoice7,
        PMH__c: salesforce_helpers_2.formatHasExplanation(assessmentDetails.healthCondition),
        Derm_Treatment_History__c: assessmentDetails.treatmentHistory,
        Drug_Allergies__c: salesforce_helpers_2.formatHasExplanation(assessmentDetails.medicationAllergy),
        Do_you_get_menstrual_periods__c: assessmentDetails.menstrualPeriod?.doesOccur || '',
        Reason_For_Not_Getting_Menstrual_Periods__c: salesforce_helpers_2.formatMenstrualPeriodReason(assessmentDetails.menstrualPeriod),
        Mushroom_Allergy__c: salesforce_helpers_2.formatHasExplanation(assessmentDetails.mushroomAllergy),
        Describe_Your_Skin__c: assessmentDetails.skinType,
        Skin_Sensitive__c: assessmentDetails.skinSensitivity,
        Meds_Desired__c: salesforce_helpers_2.formatHasExplanation(assessmentDetails.specificMedication),
        Meds_Unwanted__c: salesforce_helpers_2.formatHasExplanation(assessmentDetails.opposedToAnyMedication),
        Are_you_ok_with_oral_medication__c: assessmentDetails.oralMedication,
        OTC_Acids__c: assessmentDetails.otcMedication2,
        OTC_Antibiotic_Cream__c: assessmentDetails.otcMedication3,
        OTC_Hydroquinone__c: assessmentDetails.otcMedication5,
        OTC_Medications_Washes__c: assessmentDetails.otcMedication1,
        OTC_Other__c: assessmentDetails.otcMedication6,
        Other_Medications__c: salesforce_helpers_2.formatHasExplanation(assessmentDetails.otherMedication),
        Person_Account__c: assessmentDetails.accountId,
        Pregnancy_Status__c: assessmentDetails.prescriptionDuringPregnancy,
        Total_Retinoid__c: assessmentDetails.topicalRetinoid?.hasUsed,
        Are_you_still_using_a_retinoid__c: assessmentDetails.topicalRetinoid?.stillUsing,
        Total_Retinoid_1__c: assessmentDetails.topicalRetinoid?.specificProduct,
        Total_Retinoid_4__c: assessmentDetails.topicalRetinoid?.skinToleration,
        Total_Retinoid_5__c: assessmentDetails.topicalRetinoid?.dosage,
    });
    if (!response.success) {
        throw new OperationException_1.default(response.errors, common_constants_1.ASSESSMENT, common_constants_1.CREATE_OPERATION);
    }
    return response.id;
};
exports.createAssessment = createAssessment;
const saveReassessment = async (accountId, reassessment, recordTypeId) => {
    const salesforceConnection = container_1.default.resolve(app_constants_1.SALESFORCE_TOKEN);
    const accountRecordResponse = await salesforceConnection.sobject(common_constants_1.ASSESSMENT).create({
        Person_Account__c: accountId,
        RecordTypeId: recordTypeId,
        ...reassessment,
    });
    if (!accountRecordResponse.success) {
        throw new OperationException_1.default(accountRecordResponse.errors, common_constants_1.ASSESSMENT, common_constants_1.CREATE_OPERATION);
    }
    return accountRecordResponse;
};
exports.saveReassessment = saveReassessment;
const deleteAssessment = async (assessmentId) => {
    const salesforceConnection = container_1.default.resolve(app_constants_1.SALESFORCE_TOKEN);
    const accountRecordResponse = await salesforceConnection.sobject(common_constants_1.ASSESSMENT).destroy(assessmentId);
    if (!accountRecordResponse.success) {
        throw new OperationException_1.default(accountRecordResponse.errors, common_constants_1.ASSESSMENT, common_constants_1.DESTROY_OPERATION);
    }
    return accountRecordResponse.id;
};
exports.deleteAssessment = deleteAssessment;
const getAsessmentDetail = async (accountId) => {
    const salesforceConnection = container_1.default.resolve(app_constants_1.SALESFORCE_TOKEN);
    const assessmentResponse = await salesforceConnection
        .sobject(common_constants_1.ASSESSMENT)
        .findOne({ Person_Account__c: accountId })
        .execute();
    return salesforce_helpers_1.getCamelCasedObject(assessmentResponse);
};
exports.getAsessmentDetail = getAsessmentDetail;
