import { AxiosRequestConfig, AxiosResponse } from 'axios';

import { Auth } from 'aws-amplify';

import history from 'utils/history';

import * as routes from 'constants/routes';

import { anonymize } from 'services/fullstory';

const AUTHORIZATION_HEADER = 'Authorization' as const;
const ID_HEADER = 'X-With-ID-Token' as const;
const AUTHORIZATION_VALUE_PREFIX = 'Bearer' as const;
const ID_VALUE_PREFIX = 'ID' as const;
const REFRESH_TOKEN_EXPIRED = 'Refresh Token has expired' as const;
const UNAUTHORIZED_EXCEPTION_CODE = 'NotAuthorizedException' as const;

function buildHeaderValue(prefix: typeof AUTHORIZATION_VALUE_PREFIX | typeof ID_VALUE_PREFIX, token: string) {
  return `${prefix} ${token}`;
}

/**
 * Interceptor to add Access Token header for all requests.
 *
 * @param {object} request
 * @returns {object}
 */
export async function requestInterceptor(request: AxiosRequestConfig): Promise<AxiosRequestConfig> {
  // Add code for request interceptor.
  try {
    const currentSession = await Auth.currentSession();
    const accessToken = currentSession.getAccessToken().getJwtToken();
    const idToken = currentSession.getIdToken().getJwtToken();

    request.headers[AUTHORIZATION_HEADER] = buildHeaderValue(AUTHORIZATION_VALUE_PREFIX, accessToken);
    request.headers[ID_HEADER] = buildHeaderValue(ID_VALUE_PREFIX, idToken);

    return request;
  } catch (error) {
    if (error === 'No current user') {
      return request;
    } else if (error.code === UNAUTHORIZED_EXCEPTION_CODE && error.message === REFRESH_TOKEN_EXPIRED) {
      await Auth.signOut();
      anonymize();

      history.push(routes.LOGIN);
    }
    throw error;
  }
}

/**
 * Interceptor to refresh Authorization header.
 *
 * @param {object} response
 * @returns {object}
 */
export function responseInterceptor(response: AxiosResponse): AxiosResponse {
  return response;
}

interface IErrorResponse {
  response: AxiosResponse;
  config: AxiosRequestConfig;
}

export async function errorResponseInterceptor(error: IErrorResponse): Promise<AxiosResponse> {
  if (error.response.data === 401) {
    await Auth.signOut();
    anonymize();

    history.push(routes.LOGIN);
  }

  return Promise.reject(error);
}
