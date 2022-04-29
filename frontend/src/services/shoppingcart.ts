import http from 'utils/http';

import { ADDON_ORDER, MANAGE_ADDON_ORDER, DELETE_ADDON_ORDER } from 'constants/api';
import { interpolate } from 'utils/string';

export const getAddonOrders = () => {
  return http.get(ADDON_ORDER);
};

export const addAddonOrder = (data: any, customerId: string) => {
  const url = interpolate(MANAGE_ADDON_ORDER, { customerId });

  return http.post(url, data);
};

export const removeAddonOrder = (data: any, customerId: string) => {
  const url = interpolate(DELETE_ADDON_ORDER, { customerId });

  return http.post(url, data);
};
