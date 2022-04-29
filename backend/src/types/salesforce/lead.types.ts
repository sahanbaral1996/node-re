export interface ICreateLead extends ILeadAdditionalDetails {
  email: string;
  firstName?: string;
  lastName?: string;
  state?: string;
}

interface ILeadAdditionalDetails {
  dob?: string;
  state?: string;
  phone?: string;
  newsletter?: boolean;
  noppToa?: boolean;
  status?: LeadStatus;
}

export interface ILeadDetails {
  id: string;
  firstName: string;
  lastName: string;
}

export enum LeadStatus {
  New = 'New',
  Complete = 'Complete',
}

export type IUpdateLead = ICreateLead & ILeadAdditionalDetails;

export type ICreateLeadByAdmin = ICreateLead;
