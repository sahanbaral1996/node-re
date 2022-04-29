import { toJson } from 'usecase/reassessment/toJson';
import http from 'utils/http';

import { REASSESSMENT, ACCOUNT_ATTACHMENT } from 'constants/api';

/**
 * Fetch All Goals And Regimens.
 *
 * @param {object} data
 */
export const createReassessment = (data: any): any => {
  const formattedData = toJson(data);

  return http.post(REASSESSMENT, formattedData);
};

export const uploadFaceImage = (formData: any): any => {
  return http.post(ACCOUNT_ATTACHMENT, formData);
};
