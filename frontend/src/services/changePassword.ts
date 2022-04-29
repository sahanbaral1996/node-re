import http from 'utils/http';

import { UPDATE_PASSWORD } from 'constants/api';

/**
 * Change email for current customer.
 *
 * @param {object} data
 */
export const changePassword = (data: any): Promise<any> => {
  return http.put(UPDATE_PASSWORD, data);
};
