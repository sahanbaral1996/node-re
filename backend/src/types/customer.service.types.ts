import { ContactStatus } from './salesforce/contact.types';

export interface ICreateCustomerDTO {
  email: string;
  password: string;
  dob: string;
  newsletter: boolean;
  noppToa: boolean;
  phone?: string;
  state: string;
}

export interface IReassesmentDTO {
  currentTreatmentStatus: string;
  currentTreatmentStatusDescription: string;
  rednessIrritationPeelingStatus: string;
  rednessIrritationPeelingRating: string;
  rednessIrritationPeelingLocation: string;
  newMedication: string;
  newMedicationType: string;
  significantLifestyleChanges: string;
  changesExperienced: string;
  pregnancyInThreeMonths: string;
  hydroquinone: HydroQuinone[];
  retinoidsSideEffects: Retinoids[];
  selfies: string[];
}

interface HydroQuinoneKeys {
  darkeningOfSpots: string;
  fishyTasteOrSmell: string;
  orangeDiscoloration: string;
  redSpots: string;
  notCurrentlyPrescribed: string;
}
type HydroQuinone = {
  [key in keyof HydroQuinoneKeys]: string;
};
type Retinoids = {
  [retnoid in keyof RetinoidEnum]: string;
};
interface RetinoidEnum {
  increasedSunSensitivity: string;
  rashRedness: string;
  notCurrentlyPrescribed: string;
}

export interface ICustomerOrderInformation {
  hasOrder: boolean;
  trialOrderStatus: string;
  physician: string;
}

export interface IAddonOrderInformation {
  addons: IAddonOrder[];
}

export interface IAddonOrder {
  id: string;
  addOnConfiguration: string;
}

export interface ICustomerInformation {
  status: ContactStatus;
  email: string;
  name: string;
  id: string;
  dOB: string;
  leadId: string;
  phone: string;
  assmtActive?: boolean;
}
