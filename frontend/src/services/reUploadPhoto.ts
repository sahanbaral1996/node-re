import http from 'utils/http';

import { ATTACH_IMG } from 'constants/api';

/**
 * Add photos to Account.
 *
 * @param {Array} fileIds
 */
const addPhotosToAccount = (fileIds: string[]): Promise<any> => {
  return http.post(ATTACH_IMG, { selfies: fileIds });
};

export { addPhotosToAccount };
