export enum Routine {
  Morning = 'Morning',
  Evening = 'Evening',
  Anytime = 'Anytime',
}

interface IATP {
  aTPWhatarewetreating: string;
  aTPYourRX: string;
  aTPLetsgetstarted: string;
  aTPLifestylefactorstoconsider: string;
  aTPWhentouseyourDocentRich: string;
  aTPApplication: string;
  aTPDosandDonts: string;
  aTPGoodtoKnows: string;
  aTPYourWash: string;
  aTPYourOralMedication: string;
  aTPYourSpotTreatment: string;
}

export interface IPlan extends IATP {
  goals: string[];
  startDate: string;
  endDate: string;
  aTPApplication: string;
  orderItems: IOrderItem[];
  photos: IPhotos[];
}

export interface IPhotos {
  srcUrl: string;
  createdDate: string;
  contentDocumentId: string;
  id: string;
}

export enum ProductFamilies {
  SpotTreatment = 'Spot Treatment',
  Wash = 'Washes',
  FullFace = 'Full Face',
  OralMedication = 'Oral Medication',
}

export interface IOrderItem {
  applicationInstructions: string;
  morningEvening: Routine;
  fullName: Routine;
  productFamily: ProductFamilies;
}

export interface IMappedOrderItems {
  startDate: string;
  endDate: string;
  productFamily: string;
  products: IOrderItem[];
}

export enum PlanStatus {
  COMPLETED = 'Completed',
  ACTIVE = 'Active',
  UPCOMMING = 'Upcomming',
}
