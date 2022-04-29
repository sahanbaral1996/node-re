import { en } from 'constants/lang';
import {
  retinoidSchema,
  hydroquinoneSchema,
  newMedicationSchema,
  lifestyleChangesSchema,
  pregnancyInThreeMonthsSchema,
  skinResponseToCurrentRegimenSchema,
  rednessIrritationPeelingSchema,
  rednessIrritationPeelingRadio,
  currentConditionSchema,
} from 'schemas/reassessmentSchema';

import { Option } from 'types/reassessment';

export enum ReassessmentOptionType {
  Radio = 'radio',
  Scale = 'scale',
  Checkbox = 'checkbox',
  PeelingScale = 'peelingScale',
  RadioWithDetail = 'radioWithDetail',
  CurrentCondition = 'currentCondtion',
}

export enum ExtendedReassessmentOptionType {
  DynamicPeeling = 'dynamicPeelingScale',
}

export const reassessmentInitialFormValue = {
  skinResponseToCurrentRegimen: {
    rating: null,
  },

  hydroquinone: [],
  retinoidsSideEffects: [],
  pregnancyInThreeMonths: '',
  rednessIrritationPeeling: '',
  rednessIrritationScale: {
    status: '',
    rating: '',
    description: '',
  },
  newMedication: {
    value: '',
    description: '',
  },
  lifestyleChanges: {
    value: '',
    description: '',
  },
  currentCondition: '',
};

export type ReassessmentFormValues = typeof reassessmentInitialFormValue;

interface BaseReassessmentOption {
  sequence: number;
  question: string;
  description?: string;
  options: Option[];
  label?: string;
  placeholder?: string;
  textarea?: string;
  validation?: (state: any) => Promise<any>;
  skipNext?: (state: any, currentStep: number) => number;
  skipPrev?: (state: any, currentStep: number) => number;
  name: keyof typeof reassessmentInitialFormValue;
}
export interface RessessmentOption extends BaseReassessmentOption {
  optionType: ReassessmentOptionType;
}
export interface DynamicScaleOption extends BaseReassessmentOption {
  optionType: ExtendedReassessmentOptionType.DynamicPeeling;
  ratingName: string;
  secondaryFieldName?: string;
  secondaryFieldCondition: (state: any) => boolean;
  minLabel: string;
  maxLabel: string;
  secondaryLabel: string;
  placeholder?: string;
  secondaryTitle?: string;
}

export const REASSESSMENT_STEPS = [
  {
    sequence: 1,
    question: 'Is your skin improving with your current docent regimen?',
    name: 'skinResponseToCurrentRegimen',
    optionType: ExtendedReassessmentOptionType.DynamicPeeling,
    validation: (state: any) => skinResponseToCurrentRegimenSchema.validate(state),
    ratingName: 'rating',
    secondaryFieldCondition: (state: any) => {
      if (!state.skinResponseToCurrentRegimen?.rating) {
        return false;
      }

      return state.skinResponseToCurrentRegimen.rating <= 5;
    },
    secondaryFieldName: 'experience',
    minLabel: 'I see no change',
    maxLabel: 'I see vast improvements',
    secondaryLabel: 'Please specify what problems are you experiencing',
    placeholder: 'eg. Skin irriation...',
    secondaryTitle: 'Oh, no! What specifically are you experiencing?',
    skipNext: (state: any, currentStep: number): number =>
      state.skinResponseToCurrentRegimen.rating <= 5 ? currentStep + 1 : currentStep + 2,
  },
  {
    sequence: 2,
    question: '',
    name: 'currentCondition',
    optionType: ReassessmentOptionType.CurrentCondition,
    validation: (state: any) => currentConditionSchema.validate(state),
  },

  {
    sequence: 3,
    name: 'rednessIrritationPeeling',
    optionType: ReassessmentOptionType.Radio,
    question: 'Are you experiencing any redness, irritation or peeling?',
    options: [
      { value: 'Yes', label: 'Yes' },
      { value: 'No', label: 'No' },
    ],
    validation: (state: any) => rednessIrritationPeelingRadio.validate(state),
    skipNext: (state: any, currentStep: number): number =>
      state.rednessIrritationPeeling === 'No' ? currentStep + 2 : currentStep + 1,
    skipPrev: (state: any, currentStep: number): number =>
      state.skinResponseToCurrentRegimen.rating === 5 ? currentStep - 1 : currentStep - 2,
  },
  {
    sequence: 4,
    question: '',
    name: 'rednessIrritationScale',
    optionType: ReassessmentOptionType.PeelingScale,
    validation: (state: any) => rednessIrritationPeelingSchema.validate(state),
  },
  {
    sequence: 5,
    question: 'Have you started any new prescription medications, dermatologist or otherwise, oral or topical?',
    name: 'newMedication',
    optionType: ReassessmentOptionType.RadioWithDetail,
    options: [
      { value: 'Yes', label: 'Yes' },
      { value: 'No', label: 'No' },
    ],
    textarea: {
      question: en.reassessment.MEDICATION.QUESTION,
      description: en.reassessment.MEDICATION.DESCRIPTION,
    },
    validation: (state: any) => newMedicationSchema.validate(state),
    skipPrev: (state: any, currentStep: number): number =>
      state.rednessIrritationPeeling === 'No' ? currentStep - 2 : currentStep - 1,
  },
  {
    sequence: 6,
    question: 'Are you pregnant or planning to get pregnant in the next 3 months?',
    name: 'pregnancyInThreeMonths',
    optionType: 'radio',
    options: [
      {
        value: 'Yes',
        label: 'Yes',
      },
      { value: 'No', label: 'No' },
    ],
    validation: (state: any) => pregnancyInThreeMonthsSchema.validate(state),
  },
  {
    sequence: 7,
    question: `If your regimen includes hydroquinone,
    please indicate if you are experiencing any of the following:`,
    name: 'hydroquinone',
    optionType: ReassessmentOptionType.Checkbox,
    options: [
      { value: 'darkeningOfSpots', label: 'Darkening of spots' },
      { value: 'fishyTasteOrSmell', label: 'Fishy taste or smell' },
      { value: 'orangeDiscoloration', label: 'Orange discoloration' },
      { value: 'noneOfTheAbove', label: 'None of the above' },
      { value: 'notCurrentlyPrescribed', label: 'I am not currently prescribed hydroquinone', labelClassName: 'mt-5x' },
    ],
    validation: (state: any) => hydroquinoneSchema.validate(state),
  },
];
