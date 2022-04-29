import * as React from 'react';
import { ESkinCondition } from 'types/personalizedSolution';

export interface SkinConditionImageLayoutProps {
  loading: boolean;
  skinConditions: ESkinCondition[];
  title: string;
  content: React.ReactNode;
  subtitle?: string;
  goals: string[];
  isFeedbackSend: boolean;
  setShowConditionDetails?: () => void;
}
