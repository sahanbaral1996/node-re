import {
  CUSTOM_CHARGEBEE_ID_ATTRIBUTE,
  CUSTOM_SALESFORCE_ID_ATTRIBUTE,
  CUSTOMER_COGNITO_USER_NAME,
  CUSTOM_ACCOUNT_REFERENCE_ID,
  CUSTOMER_COGNITO_GROUP,
} from 'constants/cognito.constants';

export interface ICreateCognitoUser {
  email: string;
  accountReferenceId: string;
  firstName?: string;
  lastName?: string;
  haveMessageActionSuppressed?: boolean;
}

export interface IAssignCognitoUserToGroup {
  email: string;
  groupName: string;
}

export interface ILoginUserCredentials {
  email: string;
  password: string;
  temporaryPassword: string;
}

export interface ICognitoUserInfo {
  sub: string;
  [CUSTOMER_COGNITO_GROUP]: string[];
  [CUSTOM_SALESFORCE_ID_ATTRIBUTE]: string;
  iss: string;
  [CUSTOMER_COGNITO_USER_NAME]: string;
  aud: string;
  event_id: string;
  token_use: 'id';
  auth_time: number;
  [CUSTOM_CHARGEBEE_ID_ATTRIBUTE]: string;
  exp: number;
  iat: number;
  email: string;
  [CUSTOM_ACCOUNT_REFERENCE_ID]: string;
}

export interface ICognitoUserAttributes {
  sub: string;
  emailVerified: string;
  [CUSTOM_SALESFORCE_ID_ATTRIBUTE]: string;
  givenName: string;
  familyName: string;
  email: string;
  [CUSTOM_CHARGEBEE_ID_ATTRIBUTE]: string;
  [CUSTOM_ACCOUNT_REFERENCE_ID]: string;
}
