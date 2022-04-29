import http from 'utils/http';
import { interpolate } from 'utils/string';

import { PERSON, USER_VALIDATION, RETRIEVE_ASSESSMENT, CREATE_ASSESSMENT } from 'constants/api';

/**
 * Fetch All Goals And Regimens.
 *
 * @param {object} data
 */
export const createUserClinicalAssessment = (data: any): Promise<any> => {
  return http.post(PERSON, data);
};

export const userRegistrationValidation = (data: { email?: string; dob?: string }): Promise<any> => {
  return http.get(USER_VALIDATION, { params: data });
};

export const getUserAssessment = (): Promise<any> => {
  return http.get(RETRIEVE_ASSESSMENT);
};

export const createInPersonAssessment = (data: any, customerId: string): Promise<any> => {
  const url = interpolate(CREATE_ASSESSMENT, { customerId });

  return http.post(url, data);
};
