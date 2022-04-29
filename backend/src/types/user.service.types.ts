import { ContactStatus } from './salesforce/contact.types';

export interface ICreateUserByAdmin {
  email: string;
  firstName: string;
  lastName: string;
}

export interface IAdminUser {
  email: string;
  isAdmin: true;
  status: ContactStatus;
}
