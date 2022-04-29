import http from 'utils/http';

import { CREATE_LEAD } from 'constants/api';
import { GET_LEAD } from 'constants/api';
import { interpolate } from 'utils/string';

export interface ICreateLead {
  firstName: string;
  lastName: string;
  dob: string;
  email: string;
  newsletter: boolean;
  noppToa: boolean;
  state: string;
}

export const createLead = (data: ICreateLead): Promise<any> => {
  return http.post(CREATE_LEAD, data);
};

export const updateLead = (leadId: string, data: ICreateLead): Promise<any> => {
  return http.put(interpolate(GET_LEAD, { leadId }), data);
};
