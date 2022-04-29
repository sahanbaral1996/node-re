"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reassessmentValidator = exports.otcMedication = exports.assessment = exports.topicalRetinoid = void 0;
const joi_1 = __importDefault(require("joi"));
const assessment_constants_1 = require("constants/salesforce/assessment.constants");
const menstrualPeriod = joi_1.default.when('genderIdentity', {
    is: 'Female',
    then: joi_1.default.object({
        doesOccur: joi_1.default.string().required(),
        whyNot: joi_1.default.when('menstrualPeriod.doesOccur', {
            is: 'No',
            then: joi_1.default.string().required(),
            otherwise: joi_1.default.string().allow('').optional(),
        }),
        explanation: joi_1.default.when('menstrualPeriod.whyNot', {
            is: 'Other',
            then: joi_1.default.string().allow('').required().max(assessment_constants_1.MAX_CHARACTERS),
            otherwise: joi_1.default.string().allow('').optional().max(assessment_constants_1.MAX_CHARACTERS),
        }),
    }),
    otherwise: joi_1.default.optional(),
});
exports.topicalRetinoid = joi_1.default.object({
    hasUsed: joi_1.default.string().required(),
    stillUsing: joi_1.default.string().optional().allow(''),
    specificProduct: joi_1.default.string().optional().allow('').max(assessment_constants_1.MAX_CHARACTERS),
    skinToleration: joi_1.default.string().optional().allow('').max(assessment_constants_1.MAX_CHARACTERS),
    dosage: joi_1.default.string().optional().allow('').max(assessment_constants_1.MAX_CHARACTERS),
});
const hasExplanationSchema = joi_1.default.object({
    has: joi_1.default.string().required(),
    explanation: joi_1.default.string().allow('').optional().max(assessment_constants_1.MAX_CHARACTERS),
});
exports.assessment = joi_1.default.object({
    genderIdentity: joi_1.default.object({
        gender: joi_1.default.string().required(),
        otherExplanation: joi_1.default.when('gender', {
            is: 'Other',
            then: joi_1.default.string().required().max(assessment_constants_1.GENDER_IDENTITY_OTHER_EXPLANATION_MAX_CHARACTERS),
            otherwise: joi_1.default.allow(''),
        }),
    }),
    primarySkinConcernChoice1: joi_1.default.boolean().optional(),
    primarySkinConcernChoice2: joi_1.default.boolean().optional(),
    primarySkinConcernChoice3: joi_1.default.boolean().optional(),
    primarySkinConcernChoice4: joi_1.default.boolean().optional(),
    primarySkinConcernChoice5: joi_1.default.boolean().optional(),
    primarySkinConcernChoice6: joi_1.default.boolean().optional(),
    primarySkinConcernChoice7: joi_1.default.boolean().optional(),
    skinType: joi_1.default.string().required(),
    skinSensitivity: joi_1.default.string().required(),
    menstrualPeriod,
    prescriptionDuringPregnancy: joi_1.default.when('genderIdentity.gender', {
        is: 'Female',
        then: joi_1.default.string().required(),
        otherwise: joi_1.default.allow(''),
    }),
    topicalRetinoid: exports.topicalRetinoid,
    otherMedication: hasExplanationSchema,
    medicationAllergy: hasExplanationSchema,
    mushroomAllergy: hasExplanationSchema,
    healthCondition: hasExplanationSchema,
    specificMedication: hasExplanationSchema,
    opposedToAnyMedication: hasExplanationSchema,
    oralMedication: joi_1.default.string().required(),
    treatmentHistory: joi_1.default.string().optional().allow('').max(assessment_constants_1.MAX_CHARACTERS),
});
exports.otcMedication = joi_1.default.object({
    otcMedication1: joi_1.default.string().optional().allow('').max(assessment_constants_1.MAX_CHARACTERS),
    otcMedication2: joi_1.default.string().optional().allow('').max(assessment_constants_1.MAX_CHARACTERS),
    otcMedication3: joi_1.default.string().optional().allow('').max(assessment_constants_1.MAX_CHARACTERS),
    otcMedication5: joi_1.default.string().optional().allow('').max(assessment_constants_1.MAX_CHARACTERS),
    otcMedication6: joi_1.default.string().optional().allow('').max(assessment_constants_1.MAX_CHARACTERS),
    otcMedication7: joi_1.default.string().optional().allow('').max(assessment_constants_1.MAX_CHARACTERS),
}).or('otcMedication1', 'otcMedication2', 'otcMedication3', 'otcMedication5', 'otcMedication6', 'otcMedication7');
exports.reassessmentValidator = joi_1.default.object({
    skinResponseToCurrentRegimen: joi_1.default.string().required(),
    currentCondition: joi_1.default.string().optional().allow(''),
    rednessIrritationPeelingStatus: joi_1.default.string().optional().valid(assessment_constants_1.YES, assessment_constants_1.NO),
    rednessIrritationPeelingRating: joi_1.default.string().optional().allow(''),
    rednessIrritationPeelingLocation: joi_1.default.string().optional().allow('').max(assessment_constants_1.MAX_CHARACTERS),
    newMedication: joi_1.default.string().valid(assessment_constants_1.YES, assessment_constants_1.NO).required(),
    newMedicationType: joi_1.default.when('newMedication', {
        is: assessment_constants_1.YES,
        then: joi_1.default.string().optional().allow('').max(assessment_constants_1.MAX_CHARACTERS),
    }),
    pregnancyInThreeMonths: joi_1.default.string().valid(assessment_constants_1.YES, assessment_constants_1.NO).required(),
    hydroquinone: joi_1.default.object({
        darkeningOfSpots: joi_1.default.string().valid(assessment_constants_1.YES, assessment_constants_1.NO, assessment_constants_1.NA).required(),
        fishyTasteOrSmell: joi_1.default.string().valid(assessment_constants_1.YES, assessment_constants_1.NO, assessment_constants_1.NA).required(),
        orangeDiscoloration: joi_1.default.string().valid(assessment_constants_1.YES, assessment_constants_1.NO, assessment_constants_1.NA).required(),
        notCurrentlyPrescribed: joi_1.default.string().valid(assessment_constants_1.YES, assessment_constants_1.NO, assessment_constants_1.NA).required(),
    }),
    retinoidsSideEffects: joi_1.default.object({
        increasedSunSensitivity: joi_1.default.string().valid(assessment_constants_1.YES, assessment_constants_1.NO, assessment_constants_1.NA).required(),
        rashRedness: joi_1.default.string().valid(assessment_constants_1.YES, assessment_constants_1.NO, assessment_constants_1.NA).required(),
        notCurrentlyPrescribed: joi_1.default.string().valid(assessment_constants_1.YES, assessment_constants_1.NO, assessment_constants_1.NA).required(),
    }),
    selfies: joi_1.default.array().min(1).items(joi_1.default.string()),
});
