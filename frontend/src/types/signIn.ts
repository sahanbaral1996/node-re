import { CognitoUser } from 'amazon-cognito-identity-js';

interface IUserAttributes {
  email: string;
  firstName: string;
  lastName: string;
  isEmailVerified: boolean;
}
export interface ICognitoUserDetails {
  user: CognitoUser;
  attributes: IUserAttributes;
}

export enum SignInForms {
  Login = 'Login',
  SetupPassword = 'SetupPassword',
}

interface ILoginState {
  current: SignInForms.Login;
  user: null;
}

interface ISetupPasswordState {
  current: SignInForms.SetupPassword;
  cognitoUserDetails: ICognitoUserDetails;
}

export type ISignInState = ILoginState | ISetupPasswordState;
