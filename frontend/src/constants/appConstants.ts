import colors from './colors';
import { productGreen, productRed, productPink, facePink, faceRed, faceGreen } from 'assets/images';

export enum HomePageEnum {
  TREATMENT_SUMMARY = 0,
  DETAILED_TREATMENT_PLAN = 1,
}

export const planGrid = {
  PLAN_GRID_SELFIE_START_OFFSET: 28,
};

export const assessmentUploadImage = {
  STEPS: [
    {
      index: 0,
      label: 'Your face',
      imageSource: facePink,
      activeImage: faceRed,
      completeImage: faceGreen,
    },
    {
      index: 1,
      label: 'Your skincare products',
      activeImage: productRed,
      completeImage: productGreen,
      imageSource: productPink,
    },
  ],
};

export const USER_ATTRIBUTES = {
  SUB: 'sub',
  SALESFORCEID: 'custom:salesforceId',
  CHARGEBEEID: 'custom:chargeBeeId',
  EMAIL: 'email',
};

export const US_STATE_OPTIONS = [
  { value: 'Alabama', label: 'Alabama', isAvailable: false },
  { value: 'Alaska', label: 'Alaska', isAvailable: false },
  { value: 'Arizona', label: 'Arizona', isAvailable: true },
  { value: 'Arkansas', label: 'Arkansas', isAvailable: false },
  { value: 'California', label: 'California', isAvailable: true },
  { value: 'Colorado', label: 'Colorado', isAvailable: true },
  { value: 'Connecticut', label: 'Connecticut', isAvailable: false },
  { value: 'Delaware', label: 'Delaware', isAvailable: false },
  { value: 'Florida', label: 'Florida', isAvailable: true },
  { value: 'Georgia', label: 'Georgia', isAvailable: true },
  { value: 'Hawaii', label: 'Hawaii', isAvailable: true },
  { value: 'Idaho', label: 'Idaho', isAvailable: true },
  { value: 'Illinois', label: 'Illinois', isAvailable: false },
  { value: 'Indiana', label: 'Indiana', isAvailable: false },
  { value: 'Iowa', label: 'Iowa', isAvailable: false },
  { value: 'Kansas', label: 'Kansas', isAvailable: false },
  { value: 'Kentucky', label: 'Kentucky', isAvailable: false },
  { value: 'Louisiana', label: 'Louisiana', isAvailable: false },
  { value: 'Maine', label: 'Maine', isAvailable: false },
  { value: 'Maryland', label: 'Maryland', isAvailable: false },
  { value: 'Massachusetts', label: 'Massachusetts', isAvailable: false },
  { value: 'Michigan', label: 'Michigan', isAvailable: true },
  { value: 'Minnesota', label: 'Minnesota', isAvailable: true },
  { value: 'Mississippi', label: 'Mississippi', isAvailable: false },
  { value: 'Missouri', label: 'Missouri', isAvailable: false },
  { value: 'Montana', label: 'Montana', isAvailable: true },
  { value: 'Nebraska', label: 'Nebraska', isAvailable: false },
  { value: 'Nevada', label: 'Nevada', isAvailable: true },
  { value: 'New Hampshire', label: 'New Hampshire', isAvailable: false },
  { value: 'New Jersey', label: 'New Jersey', isAvailable: true },
  { value: 'New Mexico', label: 'New Mexico', isAvailable: false },
  { value: 'New York', label: 'New York', isAvailable: true },
  { value: 'North Carolina', label: 'North Carolina', isAvailable: true },
  { value: 'North Dakota', label: 'North Dakota', isAvailable: false },
  { value: 'Ohio', label: 'Ohio', isAvailable: true },
  { value: 'Oklahoma', label: 'Oklahoma', isAvailable: false },
  { value: 'Oregon', label: 'Oregon', isAvailable: false },
  { value: 'Pennsylvania', label: 'Pennsylvania', isAvailable: true },
  { value: 'Rhode Island', label: 'Rhode Island', isAvailable: false },
  { value: 'South Carolina', label: 'South Carolina', isAvailable: false },
  { value: 'South Dakota', label: 'South Dakota', isAvailable: false },
  { value: 'Tennessee', label: 'Tennessee', isAvailable: false },
  { value: 'Texas', label: 'Texas', isAvailable: true },
  { value: 'Utah', label: 'Utah', isAvailable: true },
  { value: 'Vermont', label: 'Vermont', isAvailable: false },
  { value: 'Virginia', label: 'Virginia', isAvailable: true },
  { value: 'Washington', label: 'Washington', isAvailable: true },
  { value: 'West Virginia', label: 'West Virginia', isAvailable: false },
  { value: 'Wisconsin', label: 'Wisconsin', isAvailable: false },
  { value: 'Wyoming', label: 'Wyoming', isAvailable: false },
];
