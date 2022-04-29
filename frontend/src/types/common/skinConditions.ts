import { ESkinCondition } from 'types/personalizedSolution';

export interface ISkinCoditionProps {
  isLoading?: boolean;
  skinConditions: ESkinCondition[];
  setShowConditionDetails?: () => void;
  goals: string[];
  isFeedbackSend: boolean;
}
