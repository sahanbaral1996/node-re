import http from 'utils/http';

import { UPDATE_CUSTOMER } from 'constants/api';

/**
 * Change email for current customer.
 *
 * @param {object} data
 */
export const changeEmail = (data: any): Promise<any> => {
  return http.put(UPDATE_CUSTOMER, data);
};
