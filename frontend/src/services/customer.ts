/* eslint-disable camelcase */
import http from 'utils/http';

import { CUSTOMER } from 'constants/api';

export interface ICreateCustomer {
  email: string;
  password: string;
  dob: string;
  newsletter: boolean;
  noppToa: boolean;
  phone?: string;
  state: string;
}

export const createCustomer = (data: ICreateCustomer): Promise<any> => {
  return http.post(CUSTOMER, data);
};
