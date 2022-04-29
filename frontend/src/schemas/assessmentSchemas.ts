import * as yup from 'yup';
import { GENDER_IDENTITY_EXPLANATION_MAX_CHARACTER, MAX_CHARACTERS, STRING_MAX_MESSAGE } from 'constants/assessment';

const assessmentSchema = yup.object({
  genderIdentity: yup.object({
    gender: yup.string().required('Please select your gender.'),
    otherExplanation: yup.string().when('gender', (val: string) => {
      if (val === 'Other') {
        return yup
          .string()
          .required('Other explanation required.')
          .max(250, `Explanation must be at most ${GENDER_IDENTITY_EXPLANATION_MAX_CHARACTER} characters.`);
      }

      return yup.string().notRequired();
    }),
  }),
  primaryConcerns: yup.array().of(yup.string()).min(1, 'Please select at least one'),
  skinType: yup.object({
    type: yup.string().required('Please select at least one'),
    sensitivity: yup.string().required('Please select at least one'),
  }),
  menstrualPeriod: yup.object({
    doesOccur: yup.string().required('Please select one'),
    whyNot: yup.string().when('doesOccur', {
      is: 'No',
      then: yup.string().required('Please select reason'),
      otherwise: yup.string(),
    }),
    explanation: yup.string().max(MAX_CHARACTERS, `Explanation ${STRING_MAX_MESSAGE}`),
  }),
  prescriptionDuringPregnancy: yup.string().required('Please select one'),
  topicalProducts: yup.object({
    otcMedication1: yup.array().of(yup.string()),
    otcMedication1Description: yup.string().max(MAX_CHARACTERS, `Medicated washes ${STRING_MAX_MESSAGE}`),
    otcMedication2: yup.array().of(yup.string()),
    otcMedication2Description: yup.string().max(MAX_CHARACTERS, `Acids  ${STRING_MAX_MESSAGE}`),
    otcMedication3: yup.array().of(yup.string()),
    otcMedication3Description: yup.string().max(MAX_CHARACTERS, `Antibiotics creams ${STRING_MAX_MESSAGE}`),
    otcMedication5: yup.array().of(yup.string()),
    otcMedication5Description: yup.string().max(MAX_CHARACTERS, `Hydroquinone ${STRING_MAX_MESSAGE}`),
    otcMedication6: yup.array().of(yup.string()),
    otcMedication6Description: yup.string().max(MAX_CHARACTERS, `Other ${STRING_MAX_MESSAGE}`),
    none: yup.array().when(['otcMedication1', 'otcMedication2', 'otcMedication3', 'otcMedication5', 'otcMedication6'], {
      is: (
        otcMedication1: string[],
        otcMedication2: string[],
        otcMedication3: string[],
        otcMedication5: string[],
        otcMedication6: string[]
      ) => {
        return (
          otcMedication1.length <= 0 &&
          otcMedication2.length <= 0 &&
          otcMedication3.length <= 0 &&
          otcMedication5.length <= 0 &&
          otcMedication6.length <= 0
        );
      },
      then: yup.array().min(1, 'Please select at least one'),
      otherwise: yup.array(),
    }),
  }),
  topicalRetinoid: yup.object({
    hasUsed: yup.string().required('Please select one'),
    stillUsing: yup.string().when('hasUsed', {
      is: 'Yes',
      then: yup.string().required('Please select one'),
      otherwise: yup.string(),
    }),
    specificProduct: yup.string().max(MAX_CHARACTERS, `Specific retinoid ${STRING_MAX_MESSAGE}`),
    dosage: yup.string().max(MAX_CHARACTERS, `Dosage amount ${STRING_MAX_MESSAGE}`),
    skinToleration: yup.string().max(MAX_CHARACTERS, `Skin retinoids toleration ${STRING_MAX_MESSAGE}`),
  }),
  otherMedication: yup.object({
    has: yup.string().required('Please select one'),
    explanation: yup.string().max(MAX_CHARACTERS, `Other Medications ${STRING_MAX_MESSAGE}`),
  }),
  allergy: yup.object({
    medications: yup.object({
      has: yup.string().required('Please select one'),
      explanation: yup.string().max(MAX_CHARACTERS, `Medication related allergies ${STRING_MAX_MESSAGE}`),
    }),
    mushrooms: yup.object({
      has: yup.string().required('Please select one'),
    }),
  }),
  healthCondition: yup.object({
    has: yup.string().required('Please select one'),
    explanation: yup.string().max(MAX_CHARACTERS, `Health Conditions ${STRING_MAX_MESSAGE}`),
  }),
  oralMedication: yup.string().required('Please select one'),
  medication: yup.object({
    specificMedication: yup.object({
      has: yup.string().required('Please select at lease one'),
      explanation: yup.string().max(MAX_CHARACTERS, `Specific medications ${STRING_MAX_MESSAGE}`),
    }),
    opposedToAnyMedication: yup.object({
      has: yup.string().required('Please select at lease one'),
      explanation: yup.string().max(MAX_CHARACTERS, `Opposed to medications ${STRING_MAX_MESSAGE}`),
    }),
  }),
  treatmentHistory: yup.string().max(MAX_CHARACTERS, `Treatment history ${STRING_MAX_MESSAGE}`),
});

const genderSchema = yup.reach(assessmentSchema, 'genderIdentity');
const primaryConcernsSchema = yup.reach(assessmentSchema, 'primaryConcerns');
const skinTypeSchema = yup.reach(assessmentSchema, 'skinType');
const menstrualPeriodSchema = yup.reach(assessmentSchema, 'menstrualPeriod');
const prescriptionDuringPregnancySchema = yup.reach(assessmentSchema, 'prescriptionDuringPregnancy');
const topicalProductsSchema = yup.reach(assessmentSchema, 'topicalProducts');
const topicalRetinoidSchema = yup.reach(assessmentSchema, 'topicalRetinoid');
const otherMedicationSchema = yup.reach(assessmentSchema, 'otherMedication');
const oralMedicationSchema = yup.reach(assessmentSchema, 'oralMedication');
const healthConditionSchema = yup.reach(assessmentSchema, 'healthCondition');
const allergySchema = yup.reach(assessmentSchema, 'allergy');
const medicationSchema = yup.reach(assessmentSchema, 'medication');
const treatmentHistorySchema = yup.reach(assessmentSchema, 'treatmentHistory');

export {
  assessmentSchema,
  genderSchema,
  primaryConcernsSchema,
  skinTypeSchema,
  menstrualPeriodSchema,
  prescriptionDuringPregnancySchema,
  topicalProductsSchema,
  topicalRetinoidSchema,
  allergySchema,
  otherMedicationSchema,
  oralMedicationSchema,
  healthConditionSchema,
  medicationSchema,
  treatmentHistorySchema,
};
