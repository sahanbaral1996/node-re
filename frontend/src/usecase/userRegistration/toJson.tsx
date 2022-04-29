import { ICreateLead } from 'services/leads';

export const toJson = (value: any): ICreateLead => {
  const { email, firstName, lastName } = value;

  return {
    email,
    firstName,
    lastName,
  };
};
