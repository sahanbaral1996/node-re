export interface QuestionnaireProps {
  question: string;
  name: string;
  description?: string;
  skipLink?: string;
  onBackClick: (step?: number) => void;
  onContinueClick: (step?: number) => void;
  skipNext?: (state: any, currentStep: number) => number;
  skipPrev?: (state: any, currentStep: number) => number;
  currentState: any;
  showBackButton?: boolean;
  currentStep: number;
  validation?: (state: any) => Promise<any>;
}
