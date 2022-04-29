import { REVIEW } from 'constants/api';
import http from 'utils/http';
import { interpolate } from 'utils/string';

export const addReview = (data: any, customerId: string) => {
  const url = interpolate(REVIEW, { customerId });

  return http.post(url, data);
};
