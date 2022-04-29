/* eslint-disable camelcase */
import http from 'utils/http';

import { POST_LEADS, UPDATE_LEAD } from 'constants/api';
import { interpolate } from 'utils/string';

export interface ICreateLead {
  email: string;
  firstName?: string;
  lastName?: string;
  state?: string;
}

export interface IUpdateLead extends ICreateLead {
  state: string;
  noppToa: boolean;
  newsletter: boolean;
  dob: any;
}

export const postLead = (data: ICreateLead) => {
  return http.post(POST_LEADS, data);
};

export const updateLead = (id: string, data: IUpdateLead) => {
  const url = interpolate(UPDATE_LEAD, { leadId: id });

  return http.put(url, data);
};
