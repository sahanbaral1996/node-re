import { AssessmentFormValues } from 'components/clinicalAssessment/Assessment/assessment.config';
import * as React from 'react';

export enum SkinTypes {
  VeryDry = 'Very Dry',
  Dry = 'Dry',
  Combination = 'Combination',
  Oily = 'Oily',
  VeryOily = 'Very Oily',
}
export interface SkinType {
  type: string;
  sensitivity: string;
}
export interface HasExplanation {
  has: string;
  explanation: string;
}
export interface Medication {
  specificMedication: HasExplanation;
  opposedToAnyMedication: HasExplanation;
  oralMedication: HasExplanation;
}

type ChangeCallback = (...args: any[]) => void;

export enum AssessmentOptionType {
  Checkbox = 'checkbox',
  Radio = 'radio',
  CheckWithDetail = 'check-with-detail',
  TopicalRetinoid = 'topical-retinoid',
  TextArea = 'textarea-with-option',
  Medication = 'medication',
  MenstrualPeriod = 'menstrual-period',
  RadioWithOtherExplanation = 'radio-with-other-explanation',
  Allergy = 'allergy',
  RadioWithDetail = 'radio-with-detail',
  SkinType = 'skin-type',
}
export interface Option {
  label: React.ReactNode;
  labelClassName?: string;
  value: string;
  field?: string;
}
export interface CheckboxGroupProps {
  options: Option[];
  values: string[];
  name: string;
  handleChange: ChangeCallback;
}
export interface SelectedOptions {
  value: string;
  explanation: string;
}
export interface CheckWithDetailProps {
  options: Option[];
  values: { [key: string]: any };
  name: string;
  handleChange: ChangeCallback;
}
export interface RadioGroupProps {
  handleChange: ChangeCallback;
  value?: any;
  options: Option[];
  name: string;
}
export interface MenstrualPeriodsProps {
  doesOccur: string | null;
  whyNot: string;
  explanation: string;
  handleChange: ChangeCallback;
  name: string;
  setFieldValue: ChangeCallback;
}
export interface TopicalRetinoidProps {
  hasUsed: string | null;
  specificProduct: string;
  stillUsing: string;
  skinToleration: string;
  dosage: string;
  handleChange: ChangeCallback;
  name: string;
  setFieldValue: ChangeCallback;
}

export interface CreatePasswordFormValues {
  password: string;
}
export interface CreatePasswordProps {
  onSubmitCreatePassword: (values: CreatePasswordFormValues) => void;
}

export interface AssessmentLocalStorage {
  step: number;
  formValue: AssessmentFormValues;
  offset: number;
}

export interface RadioWithOtherExplanationProps {
  handleChange: ChangeCallback;
  name: string;
  options: Option[];
  gender?: string | null;
  otherExplanation?: string | null;
  radioName: string;
  textBoxName: string;
}
export interface AllergyProps {
  name: string;
  yesMedication: string | null;
  yesMushroom: string | null;
  explanation: string | null;
  onChange: ChangeCallback;
  setFieldValue: ChangeCallback;
}

export interface RadioWithDetailProps {
  name: string;
  values: HasExplanation;
  handleChange: ChangeCallback;
  label: string;
  placeholder?: string;
  setFieldValue: ChangeCallback;
}

export interface SkinTypeProps {
  name: string;
  values: {
    type: string;
    sensitivity: string;
  };
  handleSensitivityChange: ChangeCallback;
  handleSkinTypeChange: ChangeCallback;
}
export interface MedicationProps {
  name: string;
  values: Medication;
  handleChange: ChangeCallback;
  setFieldValue: ChangeCallback;
}

export enum AssessmentFlow {
  QUESTIONS = 0,
  SUCCESS = 1,
}
