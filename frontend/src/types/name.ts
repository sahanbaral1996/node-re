import { OnboardSteps } from './onboard';

export interface INameFormValues {
  firstName: string;
  lastName: string;
}

export interface INameProps {
  onContinue: (step: OnboardSteps) => void;
}
