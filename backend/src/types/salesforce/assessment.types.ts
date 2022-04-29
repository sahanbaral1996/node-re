interface IAttributes {
  type: string;
  url: string;
}

export interface IAccAssessmentRecord {
  attributes: IAttributes;
  Assmt_Days_Until_Due__pc: number | null;
  Assmt_Next_Due_Date__pc: number | null;
  Assmt_Last_Completed__pc: string;
  Assmt_Active__pc: boolean;
  Id: string;
  Name: string;
  Chief_Complaints__pc: string;
}

export enum ISkinConditions {
  'Acne' = 'acne',
  'Maskne' = 'maskne',
  'Melasma' = 'melasma',
  'Rosacea' = 'rosacea',
  'Skin Texture or Firmness' = 'skinTextureorFirmness',
  'Fine Lines and Wrinkles' = 'fineLinesandWrinkles',
  'Hyperpigmentation' = 'hyperpigmentation',
}

export interface IContactInformation {
  accountId: string;
  dob: string;
  email: string;
}

export interface IMenstrualPeriod {
  doesOccur: string;
  whyNot: string;
  explanation: string;
}

interface ITopicalRetinoid {
  hasUsed: string;
  stillUsing: string;
  specificProduct: string;
  skinToleration: string;
  dosage: string;
}

export interface IGender {
  gender: string;
  otherExplanation?: string;
}

export interface IHasExplanation {
  has: string;
  explanation: string;
}
export interface ICreateAssessment {
  genderIdentity: IGender;
  primarySkinConcernChoice1?: boolean;
  primarySkinConcernChoice2?: boolean;
  primarySkinConcernChoice3?: boolean;
  primarySkinConcernChoice4?: boolean;
  primarySkinConcernChoice5?: boolean;
  primarySkinConcernChoice6?: boolean;
  primarySkinConcernChoice7?: boolean;
  skinType?: string;
  skinSensitivity?: string;
  menstrualPeriod?: IMenstrualPeriod;
  prescriptionDuringPregnancy?: string;
  topicalRetinoid?: ITopicalRetinoid;
  otherMedication: IHasExplanation;
  medicationAllergy: IHasExplanation;
  mushroomAllergy: IHasExplanation;
  healthCondition: IHasExplanation;
  specificMedication: IHasExplanation;
  opposedToAnyMedication: IHasExplanation;
  oralMedication: IHasExplanation;
  treatmentHistory: string;
  otcMedication1?: string;
  otcMedication2?: string;
  otcMedication3?: string;
  otcMedication5?: string;
  otcMedication6?: string;
}
export interface IAssessmentRecordType {
  Id: string;
  Name: string;
}

export interface IAssessmentHyperpigmentationType {
  hyperpigmentation?: boolean;
}
