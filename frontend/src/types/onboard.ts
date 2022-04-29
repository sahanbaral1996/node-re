import { IUserProfile } from './profile';

export enum OnboardSteps {
  None = 'None',
  Plan = 'Plan',
  Product = 'Product',
  Billing = 'Billing',
  ImageUpload = 'ImageUpload',
  RegimenPhoto = 'RegimenPhoto',
  Complete = 'Complete',
  Assessment = 'Assessment',
}

export interface IOnboardChildProps {
  onContinue: (nextStep: OnboardSteps, updatedProfile?: IUserProfile) => void;
}

export interface IOnboardImageProps extends IOnboardChildProps {
  showHeader?: boolean;
  onSuccess?: () => void;
  activeStep: number;
}

export enum PhotoUploadSteps {
  FacePhoto = 0,
  RegimenPhoto = 1,
}

export enum OnboardStepperSteps {
  ProductSelection = 0,
  PaymentInformation,
  Photos,
  Complete,
}
