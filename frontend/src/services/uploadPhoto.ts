import http from 'utils/http';

import { UPLOAD_PHOTO } from 'constants/api';
import { ImageFile } from 'types/common/uploadImage';
import { GenericResponse } from 'types/common/response';

/**
 * Upload Photos.
 *
 */
export const uploadPhoto = async ({ file, prefix }: { file: ImageFile; prefix: string }): Promise<GenericResponse> => {
  const url = UPLOAD_PHOTO;

  const formData = new FormData();

  formData.append('attachment', file);
  formData.append('prefix', prefix);

  const res = await http.post(url, formData);

  return res.data;
};
