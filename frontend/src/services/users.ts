import { GET_LEAD } from 'constants/api';
import http from 'utils/http';
import { interpolate } from 'utils/string';

/**
 * Fetch Lead from Id as Admin.
 *
 * @param {string} leadId
 */
export const getLeadFromId = (leadId: string) => {
  const uri = interpolate(GET_LEAD, { leadId });

  return http.get(uri);
};
