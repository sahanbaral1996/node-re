import * as React from 'react';
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Option, AssessmentOptionType, CreatePasswordFormValues } from 'types/assessment';
import {
  genderSchema,
  primaryConcernsSchema,
  menstrualPeriodSchema,
  prescriptionDuringPregnancySchema,
  topicalProductsSchema,
  topicalRetinoidSchema,
  healthConditionSchema,
  otherMedicationSchema,
  oralMedicationSchema,
  allergySchema,
  medicationSchema,
  treatmentHistorySchema,
  skinTypeSchema,
} from 'schemas/assessmentSchemas';

export type AssessmentFormValues = typeof assessmentInitialFormValue;

type AssessmentValue = string | string[] | null | { [key: string]: any };
export interface AssessmentOption {
  question: string;
  description?: string;
  skipLink?: string;
  name: keyof AssessmentFormValues;
  optionType: AssessmentOptionType;
  options: Option[];
  label?: string;
  placeholder?: string;
  showBackButton?: boolean;
  validation?: (state: AssessmentValue) => Promise<any>;
  skipNext?: (state: AssessmentValue, currentStep: number) => number;
  skipPrev?: (state: AssessmentValue, currentStep: number) => number;
}

export interface AssessmentProps {
  onSubmit: (values: AssessmentFormValues) => void;
  initialFormValue: AssessmentFormValues;
  onBack: (values: AssessmentFormValues) => void;
  initialStep: number;
  loader?: boolean;
  showProgress?: boolean;
  currentFlow: number;
  setCurrentFlow: React.Dispatch<React.SetStateAction<number>>;
}

export type Category = 'personal' | 'hormones' | 'routine' | 'health' | 'preferences';

const QUESTIONS = new Map<Category, AssessmentOption[]>();

const categoryDiff = new Map<Category, number>();

const QUESTION_STEP = new Map<number, any>();

export const NONE_VALUE = 'None of the above';

QUESTIONS.set('personal', [
  {
    question: '',
    description: 'Which of the following best describes your gender identity:',
    name: 'genderIdentity',
    optionType: AssessmentOptionType.RadioWithOtherExplanation,
    options: [
      { value: 'Male', label: 'Male' },
      { value: 'Female', label: 'Female' },
      { value: 'Trans-Male', label: 'Trans-Male' },
      { value: 'Trans-Female', label: 'Trans-Female' },
      { value: 'Other', label: 'Other' },
    ],
    skipNext: (state: any, currentStep: number) => {
      return state.genderIdentity.gender && state.genderIdentity.gender !== 'Female' ? 2 : currentStep + 1;
    },
    validation: state => genderSchema.validate(state),
    showBackButton: false,
  },
  {
    question:
      'In order to provide you with a treatment that is safe to use, we need to know if you are or could become pregnant, or are nursing.',
    description: 'Which of the following best describes your situation:',
    name: 'prescriptionDuringPregnancy',
    optionType: AssessmentOptionType.Radio,
    options: [
      {
        value: 'I am trying to get pregnant',
        label: 'I am trying to get pregnant',
      },
      { value: 'Pregnant', label: 'I am currently pregnant' },
      { value: 'Nursing', label: 'I am currently nursing' },
      { value: 'None of the above apply to me', label: 'None of the above apply to me' },
    ],
    validation: state => prescriptionDuringPregnancySchema.validate(state),
  },
  {
    question:
      'Our dermatologists will be looking at all aspects of your skin, but we’d like to know what is top of mind for you.',
    description: 'What are the primary concerns that brought you to us?',
    name: 'primaryConcerns',
    optionType: AssessmentOptionType.Checkbox,
    options: [
      { value: 'Acne', label: 'Acne' },
      { value: 'Maskne', label: '"Maskne"' },
      { value: 'Hyperpigmentation', label: 'Hyperpigmentation (dark spots or sun damage)' },
      { value: 'Melasma', label: 'Melasma' },
      { value: 'Rosacea', label: 'Rosacea (redness or excessive flushing)' },
      { value: 'Fine lines and wrinkles', label: 'Fine lines and wrinkles' },
      { value: 'Skin texture and firmness', label: 'Skin texture and firmness' },
    ],
    skipPrev: (state: any, currentStep: number) => (state.genderIdentity.gender === 'Female' ? currentStep - 1 : 0),
    validation: state => primaryConcernsSchema.validate(state),
  },
  {
    question: 'We’d like to learn more about your skin’s characteristics.',
    name: 'skinType',
    optionType: AssessmentOptionType.SkinType,
    options: [],
    skipNext: (state: any, currentStep: number) => {
      return state.genderIdentity.gender &&
        (state.genderIdentity.gender === 'Male' || state.genderIdentity.gender === 'Trans-Male')
        ? 5
        : currentStep + 1;
    },
    validation: state => skinTypeSchema.validate(state),
  },
]);

QUESTIONS.set('hormones', [
  {
    question:
      'Hormones can play a major factor in your skin’s health. Understanding your body’s hormonal state can help us determine the best course of treatment.',
    description: 'Do you get menstrual periods?',
    name: 'menstrualPeriod',
    optionType: AssessmentOptionType.MenstrualPeriod,
    options: [],
    validation: state => menstrualPeriodSchema.validate(state),
  },
]);

QUESTIONS.set('routine', [
  {
    question: 'Your past experiences can help us determine how your skin may respond to prescription treatment.',
    description: 'Have you ever used a topical retinoid such as tretinoin, retin-A, or Differin Gel?',
    name: 'topicalRetinoid',
    optionType: AssessmentOptionType.TopicalRetinoid,
    options: [],
    validation: state => topicalRetinoidSchema.validate(state),
    skipPrev: (state: any, currentStep: number) => {
      return state.genderIdentity.gender &&
        (state.genderIdentity.gender === 'Male' || state.genderIdentity.gender === 'Trans-Male')
        ? 3
        : currentStep - 1;
    },
  },
  {
    question: 'Knowing what is included in your current skincare routine helps us design a complementary regimen.',
    description: 'Which of the following products are currently a part of your skincare routine:',
    name: 'topicalProducts',
    optionType: AssessmentOptionType.CheckWithDetail,
    options: [
      {
        value: 'Medicated washes (e.g. Sulphur, benzoyl peroxide, salicylic acid)',
        label: (
          <>
            <span>Medicated washes</span>
            <span>e.g. Sulphur, benzoyl peroxide, salicylic acid</span>
          </>
        ),
        field: 'otcMedication1',
      },
      {
        value: 'Acids e.g. Alezalic acid, glycolic acid, kojic acid, vitamin C',
        labelClassName: 'mt-3x',
        label: (
          <>
            <span>Acids</span>
            <span>e.g. Alezalic acid, glycolic acid, kojic acid, vitamin C</span>
          </>
        ),
        field: 'otcMedication2',
      },
      {
        value: 'Antibotics creams (e.g. clindamycin, erythromycin)',
        labelClassName: 'mt-3x',
        label: (
          <>
            <span>Antibiotics cream</span>
            <span>e.g. clindamycin, erythromycin</span>
          </>
        ),
        field: 'otcMedication3',
      },
      {
        value: 'Hydroquinone',
        label: 'Hydroquinone',
        field: 'otcMedication5',
      },
      {
        value: 'Other (e.g. peels)',
        label: (
          <>
            <span>Other</span>
            <span>e.g. peels</span>
          </>
        ),
        field: 'otcMedication6',
      },
      {
        value: 'None of the above',
        label: 'I am not using any of the above products',
        field: 'none',
      },
    ],
    validation: state => topicalProductsSchema.validate(state),
  },
]);

QUESTIONS.set('health', [
  {
    question:
      'It is important to know if you are taking any oral prescription medications. For example, Accutane, antibiotics, or medications for chronic conditions.',
    description: 'Are you currently taking any oral medications?',
    name: 'otherMedication',
    optionType: AssessmentOptionType.RadioWithDetail,
    options: [],
    label: 'Please elaborate...',
    placeholder: 'e.g. oral contraceptives, antidepressants, blood pressure medications',
    validation: state => otherMedicationSchema.validate(state),
  },
  {
    question:
      "As docent products include prescription medications, it is important to know if you have any health conditions that may impact your body's ability to tolerate them.",
    description: 'Do you have any conditions our team should be aware of?',
    name: 'healthCondition',
    optionType: AssessmentOptionType.RadioWithDetail,
    options: [],
    label: 'Please describe your health condition',
    placeholder: 'e.g. high blood pressure',
    validation: state => healthConditionSchema.validate(state),
  },
  {
    question: '',
    name: 'allergy',
    optionType: AssessmentOptionType.Allergy,
    options: [],
    placeholder: 'e.g. penicillin resulting in hives',
    validation: state => allergySchema.validate(state),
  },
]);

QUESTIONS.set('preferences', [
  {
    question: 'Occasionally, oral medications can help  address underlying causes of certain skin conditions.',
    description:
      'Are you open to being prescribed an oral medication if your dermatologist determines it would be beneficial?',
    name: 'oralMedication',
    optionType: AssessmentOptionType.Radio,
    options: [
      { value: 'Yes', label: 'Yes' },
      { value: 'No', label: 'No' },
    ],
    label: 'Please elaborate',
    placeholder: '',
    validation: state => oralMedicationSchema.validate(state),
  },
  {
    question:
      'You know your face better than anyone, so we’d like to factor in any preferences you may have into the creation of your regimen.',
    description: 'Are you seeking any specific medications as a part of your regimen?',
    name: 'medication',
    optionType: AssessmentOptionType.Medication,
    options: [],
    validation: state => medicationSchema.validate(state),
  },
  {
    question:
      'We’ve done all the asking, so as a last step, we’d like to have you tell us anything about your skin journey that hasn’t yet been shared.',
    description: 'Please share anything that you think will help us design the best plan for you!',
    name: 'treatmentHistory',
    optionType: AssessmentOptionType.TextArea,
    options: [],
    label: '',
    placeholder: 'eg. I tried using an over the counter niacinamide but it made my skin burn upon application',
    validation: state => treatmentHistorySchema.validate(state),
  },
]);

const QUESTION_SET: { parentStep: number; questions: number[] }[] = [];

let count = 0;
let parentCount = 0;

QUESTIONS.forEach((_, key, questionMap) => {
  const questions = questionMap.get(key);

  const subQuestions: number[] = [];

  if (questions) {
    questions.forEach(question => {
      QUESTION_STEP.set(count, { category: key, ...question });
      subQuestions.push(count);
      count += 1;
    });
  }

  QUESTION_SET.push({ parentStep: parentCount, questions: subQuestions });
  parentCount += 1;
});

const assessmentInitialFormValue = {
  genderIdentity: {
    gender: '',
    otherExplanation: '',
  },
  primaryConcerns: [],
  skinType: {
    type: '',
    sensitivity: '',
  },
  menstrualPeriod: {
    doesOccur: '',
    whyNot: '',
    explanation: '',
  },
  prescriptionDuringPregnancy: '',
  topicalProducts: {
    otcMedication1: [],
    otcMedication1Description: '',
    otcMedication2: [],
    otcMedication2Description: '',
    otcMedication3: [],
    otcMedication3Description: '',
    otcMedication5: [],
    otcMedication5Description: '',
    otcMedication6: [],
    otcMedication6Description: '',
    none: [],
  },
  topicalRetinoid: {
    hasUsed: '',
    stillUsing: '',
    specificProduct: '',
    skinToleration: '',
    dosage: '',
  },
  otherMedication: {
    has: '',
    explanation: '',
  },
  allergy: {
    medications: {
      has: '',
      explanation: '',
    },
    mushrooms: {
      has: '',
    },
  },
  healthCondition: {
    has: '',
    explanation: '',
  },
  oralMedication: '',
  medication: {
    specificMedication: {
      has: '',
      explanation: '',
    },
    opposedToAnyMedication: {
      has: '',
      explanation: '',
    },
  },
  treatmentHistory: '',
};

export { QUESTION_SET, QUESTIONS, categoryDiff, QUESTION_STEP, assessmentInitialFormValue };
