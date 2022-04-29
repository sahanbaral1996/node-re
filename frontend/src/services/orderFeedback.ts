import http from 'utils/http';

import { FEEDBACK_URL } from 'constants/api';

interface IPostFeedback {
  description: string;
  selfies: string[];
}

export const postFeedback = (data: IPostFeedback): Promise<any> => {
  return http.post(FEEDBACK_URL, data);
};
