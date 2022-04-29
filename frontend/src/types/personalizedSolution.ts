export interface TreatmentSummary {
  assmtDaysUntilDue: number;
  assmtLastCompleted: string;
  assmtNextDueDate: string;
  assmtActive: boolean;
  id: string;
  name: string;
  skinConditions: ESkinCondition[];
}

export enum ESkinCondition {
  acne = 'acne',
  maskne = 'maskne',
  melasma = 'melasma',
  rosacea = 'rosacea',
  skinTextureorFirmness = 'skinTextureorFirmness',
  fineLinesandWrinkles = 'fineLinesandWrinkles',
  hyperpigmentation = 'hyperpigmentation',
}

export interface CardComponentProps {
  title: string;
}
