import http from 'utils/http';

import { CONTACT_STATUS, UPDATE_USER_NAME } from 'constants/api';
import { UserStatus } from 'types/profile';
import { interpolate } from 'utils/string';

/**
 * Fetch All Goals And Regimens.
 *
 * @param {string} status
 */
export const updateUserStatus = (status: UserStatus): Promise<any> => {
  return http.post(CONTACT_STATUS, { status });
};

export const updateUserName = (customerId: string, input: { firstName: string; lastName: string }) => {
  const url = interpolate(UPDATE_USER_NAME, { customerId });

  const { firstName, lastName } = input;

  return http.put(url, {
    firstName,
    lastName,
  });
};
