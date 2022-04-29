import http from 'utils/http';

import { APPROVE_ORDER_REVIEW, ORDER_REVIEW, ORDER_REVIEW_ID } from 'constants/api';
import { interpolate } from 'utils/string';

/**
 * Fetch Order review.
 *
 */
export const getOrderReview = (): Promise<any> => {
  return http.get(ORDER_REVIEW);
};

/**
 * Fetch All Goals And Regimens.
 *
 * @param {string} orderId
 * @param {Object} data
 */
export const updateOrderReview = (orderId: string, data: any): Promise<any> => {
  const url = interpolate(ORDER_REVIEW_ID, { orderId });

  return http.patch(url, data);
};

/**
 * Approve the order in review.
 *
 * @param {string} orderId
 */
export const approveOrderReview = (orderId: string): Promise<any> => {
  const url = interpolate(APPROVE_ORDER_REVIEW, { orderId });

  return http.post(url);
};
