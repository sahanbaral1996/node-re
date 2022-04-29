import { PROFILE } from 'constants/api';
import http from 'utils/http';

export const fetchProfile = () => {
  return http.get(PROFILE);
};
