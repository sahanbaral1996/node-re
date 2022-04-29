import { Auth } from 'aws-amplify';
import { CognitoUser, CognitoUserSession } from 'amazon-cognito-identity-js';

import config from 'config';

import { IUserData } from 'components/auth/CognitoAuth';

import http from 'utils/http';
import { AUTH_ISSUE_CHECKER } from 'constants/api';

interface ISetupAuthentication {
  accessToken: string;
  lastAuthUser: string;
  refreshToken: string;
  idToken: string;
}

export const setupAuthentication = async function ({
  accessToken,
  lastAuthUser,
  refreshToken,
  idToken,
}: ISetupAuthentication): Promise<IUserData> {
  const userPoolWebClientId = config.cognito.userPoolWebClientId;

  window.localStorage.setItem(`CognitoIdentityServiceProvider.${userPoolWebClientId}.LastAuthUser`, lastAuthUser);
  window.localStorage.setItem(
    `CognitoIdentityServiceProvider.${userPoolWebClientId}.${lastAuthUser}.accessToken`,
    accessToken
  );
  window.localStorage.setItem(`CognitoIdentityServiceProvider.${userPoolWebClientId}.${lastAuthUser}.idToken`, idToken);
  window.localStorage.setItem(
    `CognitoIdentityServiceProvider.${userPoolWebClientId}.${lastAuthUser}.refreshToken`,
    refreshToken
  );

  await Auth.currentAuthenticatedUser();

  const userDataString = window.localStorage.getItem(
    `CognitoIdentityServiceProvider.${userPoolWebClientId}.${lastAuthUser}.userData`
  );

  const userData: IUserData = JSON.parse(userDataString as string);

  return userData;
};

export const getAuthenticationInformation = function () {
  const userPoolWebClientId = config.cognito.userPoolWebClientId;

  const lastAuthUser = window.localStorage.getItem(
    `CognitoIdentityServiceProvider.${userPoolWebClientId}.LastAuthUser`
  );
  const accessToken = window.localStorage.getItem(
    `CognitoIdentityServiceProvider.${userPoolWebClientId}.${lastAuthUser}.accessToken`
  );
  const idToken = window.localStorage.getItem(
    `CognitoIdentityServiceProvider.${userPoolWebClientId}.${lastAuthUser}.idToken`
  );
  const userData = window.localStorage.getItem(
    `CognitoIdentityServiceProvider.${userPoolWebClientId}.${lastAuthUser}.userData`
  );

  return {
    lastAuthUser,
    accessToken,
    idToken,
    userData,
  };
};

export const checkAuthentication = function () {
  const { accessToken, idToken } = getAuthenticationInformation();

  return accessToken && idToken;
};

/**
 * Check login issue.
 *
 * @param {string} email
 */
export const authIssueChecker = (email: string): Promise<any> => {
  return http.get(AUTH_ISSUE_CHECKER, { params: { email } });
};

export const refreshCurrentSession = async () => {
  const [currentSession, currentAuthenticatedUser] = await Promise.all<CognitoUserSession, CognitoUser>([
    Auth.currentSession(),
    Auth.currentAuthenticatedUser(),
  ]);

  return new Promise((resolve, reject) => {
    currentAuthenticatedUser.refreshSession(currentSession.getRefreshToken(), (error, session) => {
      if (error) {
        reject(error);
      }
      resolve(session);
    });
  });
};
