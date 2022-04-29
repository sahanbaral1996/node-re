export enum ContactStatus {
  Assessment = 'Assessment Done',
  BillingInformation = 'Billing Done',
  ImageUpload = 'Images Uploaded',
  TrialCreated = 'Trial Created',
  Active = 'Active',
  InPersonDone = 'In-Person Done',
}

export interface ICreateContact {
  dob: string;
  lastName: string;
  firstName?: string;
  accountId: string;
  status: ContactStatus;
}
export interface IContactRecord {
  Status__c: ContactStatus;
}
