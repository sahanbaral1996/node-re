import Joi from 'joi';
import {
  YES,
  NO,
  MAX_CHARACTERS,
  GENDER_IDENTITY_OTHER_EXPLANATION_MAX_CHARACTERS,
  NA,
} from 'constants/salesforce/assessment.constants';

const menstrualPeriod = Joi.when('genderIdentity', {
  is: 'Female',
  then: Joi.object({
    doesOccur: Joi.string().required(),
    whyNot: Joi.when('menstrualPeriod.doesOccur', {
      is: 'No',
      then: Joi.string().required(),
      otherwise: Joi.string().allow('').optional(),
    }),
    explanation: Joi.when('menstrualPeriod.whyNot', {
      is: 'Other',
      then: Joi.string().allow('').required().max(MAX_CHARACTERS),
      otherwise: Joi.string().allow('').optional().max(MAX_CHARACTERS),
    }),
  }),
  otherwise: Joi.optional(),
});

export const topicalRetinoid = Joi.object({
  hasUsed: Joi.string().required(),
  stillUsing: Joi.string().optional().allow(''),
  specificProduct: Joi.string().optional().allow('').max(MAX_CHARACTERS),
  skinToleration: Joi.string().optional().allow('').max(MAX_CHARACTERS),
  dosage: Joi.string().optional().allow('').max(MAX_CHARACTERS),
});

const hasExplanationSchema = Joi.object({
  has: Joi.string().required(),
  explanation: Joi.string().allow('').optional().max(MAX_CHARACTERS),
});

export const assessment = Joi.object({
  genderIdentity: Joi.object({
    gender: Joi.string().required(),
    otherExplanation: Joi.when('gender', {
      is: 'Other',
      then: Joi.string().required().max(GENDER_IDENTITY_OTHER_EXPLANATION_MAX_CHARACTERS),
      otherwise: Joi.allow(''),
    }),
  }),
  primarySkinConcernChoice1: Joi.boolean().optional(),
  primarySkinConcernChoice2: Joi.boolean().optional(),
  primarySkinConcernChoice3: Joi.boolean().optional(),
  primarySkinConcernChoice4: Joi.boolean().optional(),
  primarySkinConcernChoice5: Joi.boolean().optional(),
  primarySkinConcernChoice6: Joi.boolean().optional(),
  primarySkinConcernChoice7: Joi.boolean().optional(),
  skinType: Joi.string().required(),
  skinSensitivity: Joi.string().required(),
  menstrualPeriod,
  prescriptionDuringPregnancy: Joi.when('genderIdentity.gender', {
    is: 'Female',
    then: Joi.string().required(),
    otherwise: Joi.allow(''),
  }),
  topicalRetinoid,
  otherMedication: hasExplanationSchema,
  medicationAllergy: hasExplanationSchema,
  mushroomAllergy: hasExplanationSchema,
  healthCondition: hasExplanationSchema,
  specificMedication: hasExplanationSchema,
  opposedToAnyMedication: hasExplanationSchema,
  oralMedication: Joi.string().required(),
  treatmentHistory: Joi.string().optional().allow('').max(MAX_CHARACTERS),
});

export const otcMedication = Joi.object({
  otcMedication1: Joi.string().optional().allow('').max(MAX_CHARACTERS),
  otcMedication2: Joi.string().optional().allow('').max(MAX_CHARACTERS),
  otcMedication3: Joi.string().optional().allow('').max(MAX_CHARACTERS),
  otcMedication5: Joi.string().optional().allow('').max(MAX_CHARACTERS),
  otcMedication6: Joi.string().optional().allow('').max(MAX_CHARACTERS),
  otcMedication7: Joi.string().optional().allow('').max(MAX_CHARACTERS),
}).or('otcMedication1', 'otcMedication2', 'otcMedication3', 'otcMedication5', 'otcMedication6', 'otcMedication7');

export const reassessmentValidator = Joi.object({
  skinResponseToCurrentRegimen: Joi.string().required(),
  currentCondition: Joi.string().optional().allow(''),
  rednessIrritationPeelingStatus: Joi.string().optional().valid(YES, NO),
  rednessIrritationPeelingRating: Joi.string().optional().allow(''),
  rednessIrritationPeelingLocation: Joi.string().optional().allow('').max(MAX_CHARACTERS),
  newMedication: Joi.string().valid(YES, NO).required(),
  newMedicationType: Joi.when('newMedication', {
    is: YES,
    then: Joi.string().optional().allow('').max(MAX_CHARACTERS),
  }),
  pregnancyInThreeMonths: Joi.string().valid(YES, NO).required(),
  hydroquinone: Joi.object({
    darkeningOfSpots: Joi.string().valid(YES, NO, NA).required(),
    fishyTasteOrSmell: Joi.string().valid(YES, NO, NA).required(),
    orangeDiscoloration: Joi.string().valid(YES, NO, NA).required(),
    notCurrentlyPrescribed: Joi.string().valid(YES, NO, NA).required(),
  }),
  retinoidsSideEffects: Joi.object({
    increasedSunSensitivity: Joi.string().valid(YES, NO, NA).required(),
    rashRedness: Joi.string().valid(YES, NO, NA).required(),
    notCurrentlyPrescribed: Joi.string().valid(YES, NO, NA).required(),
  }),
  selfies: Joi.array().min(1).items(Joi.string()),
});
