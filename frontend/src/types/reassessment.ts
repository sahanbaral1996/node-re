import { ImageFile } from 'types/common/uploadImage';

type ChangeCallback = (...args: any[]) => void;

export interface RadioGroupWithDetailItem {
  value?: string;
  description?: string;
}

export interface RadioGroupWithDetailProps {
  options: any;
  name: string;
  textArea?: any;
  handleChange: any;
  item: RadioGroupWithDetailItem | any;
}
export interface CurrentConditionProps {
  value: any;
  handleChange: any;
  name: string;
}
export interface PeelingScaleProps {
  value: any;
  handleChange: any;
  name: string;
  onPeelingScaleChange: (value: number) => void;
}

export interface Option {
  label: string;
  value: string;
  field?: string;
}

export interface CheckboxGroupProps {
  options: Option[];
  values: { [key: string]: any };
  name: string;
  handleChange: ChangeCallback;
}

export interface HydroQuinoneKeys {
  darkeningOfSpots: string;
  fishyTasteOrSmell: string;
  orangeDiscoloration: string;
  notCurrentlyPrescribed: string;
}

export interface RetinoidKeys {
  increasedSunSensitivity: string;
  rashRedness: string;
  notCurrentlyPrescribed: string;
}

export interface ImageUploadKeys {
  onSubmit: () => void;
  files: Array<ImageFile>;
  isLoading: boolean;
  handleBackClick: () => void;
  deleteFaceImageFile: (filePreview: string) => void;
  handleImageUploaded: (selectedFiles: Array<ImageFile>) => Promise<void>;
}

export interface RednessIrritationPeelingKeys {
  status: string;
  rating: any;
  description?: string;
}

export interface CheckWithDetailKeys {
  value: string;
  description?: string;
}

export type ReassessmentFormValues = {
  skinResponseToCurrentRegimen: any;
  hydroquinone: Array<HydroQuinoneKeys>;
  retinoidsSideEffects: Array<RetinoidKeys>;
  pregnancyInThreeMonths: string;
  rednessIrritationPeeling: string;
  rednessIrritationScale: RednessIrritationPeelingKeys;
  newMedication: CheckWithDetailKeys;
  lifestyleChanges: CheckWithDetailKeys;
  currentCondition: string;
};

export interface ReassessmentQuestionareProps {
  initialStep: number;
  onSubmit: (values: any) => void;
  reassessment: ReassessmentFormValues;
  reassessmentInitialFormValue: ReassessmentFormValues;
}
