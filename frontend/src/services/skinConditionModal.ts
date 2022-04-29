import http from 'utils/http';

import { SKIN_CONDITION_DETAILS } from 'constants/api';

/**
 * Fetch skin condition details.
 *
 */
const fetchSkinConditionDetails = (): Promise<any> => {
  return http.get(SKIN_CONDITION_DETAILS);
};

export { fetchSkinConditionDetails };
