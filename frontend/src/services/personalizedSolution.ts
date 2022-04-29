import http from 'utils/http';

import { AxiosPromise } from 'axios';

import { ACCOUNT_DETAIL } from 'constants/api';

/**
 * Fetch treatment summary for logged in user.
 *
 * @returns {Promise}
 */
export function fetchByDetails(): Promise<AxiosPromise> {
  return http.get(ACCOUNT_DETAIL);
}
