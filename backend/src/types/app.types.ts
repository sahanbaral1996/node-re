export interface IUser {
  id: string;
  salesforceReferenceId: string;
  chargebeeReferenceId: string;
  email: string;
  groups: string[];
  shouldMigrate: boolean;
}
