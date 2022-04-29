export enum OrderTypes {
  Standard = 'Standard',
  Trial = 'Trial',
}

export enum OrderStatus {
  Draft = 'Draft',
  Published = 'Published',
  ShipmentsScheduled = 'Shipments Scheduled',
  Complete = 'Complete',
  Cancelled = 'Cancelled',
  OnHold = 'On Hold',
  PendingApproval = 'Pending Approval',
}

interface IOrderATP {
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

export interface IOrder extends IOrderATP {
  id: string;
  goal1: string | null;
  goal2: string | null;
  goal3: string | null;
  effectiveDate: string;
  physician: string;
  endDate: string;
  status: OrderStatus;
}

export interface IDetailedPlan extends IOrderATP {
  effectiveDate: string;
  endDate: string;
  status: string;
}

export interface IOrderDetails {
  id: string;
  status: OrderStatus;
}
