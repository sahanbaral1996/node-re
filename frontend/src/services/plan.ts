import http from 'utils/http';

import * as api from 'constants/api';
import { interpolate } from 'utils/string';

export const fetchPlan = (customerId: string) => {
  const endpoint = interpolate(api.PLAN, { customerId });

  return http.get(endpoint);
};
