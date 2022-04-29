import config from 'config';

import { IAssignCognitoUserToGroup, ICreateCognitoUser, ILoginUserCredentials } from 'types/cognito/user.types';

import {
  AdminCreateUserCommandInput,
  AdminCreateUserCommand,
  CognitoIdentityProvider,
  AdminAddUserToGroupCommandInput,
  AdminAddUserToGroupCommand,
  AdminInitiateAuthCommand,
  AdminInitiateAuthCommandInput,
  AdminRespondToAuthChallengeCommand,
  AuthFlowType,
  ChallengeNameType,
  AdminDeleteUserCommandInput,
  AdminDeleteUserCommand,
  AdminUpdateUserAttributesCommand,
  AdminUpdateUserAttributesCommandInput,
  ChangePasswordCommandInput,
  ChangePasswordCommand,
  AdminGetUserCommand,
  AdminGetUserCommandInput,
} from '@aws-sdk/client-cognito-identity-provider';

import { generate } from 'generate-password';

import container from 'container';

import {
  COGNITO_USER_FIRST_NAME,
  COGNITO_USER_LAST_NAME,
  CUSTOMER_EMAIL_VERIFIED_ATTRIBUTE,
  CUSTOM_ACCOUNT_REFERENCE_ID,
} from 'constants/cognito.constants';

import { COGNITO_TOKEN } from 'constants/app.constants';
import { INameValuePairs } from 'utils/object';

export function cognitoUserServiceFactory() {
  const cognitoClient: CognitoIdentityProvider = container.resolve(COGNITO_TOKEN);
  const userPoolId = config.cognito.userPoolId;
  const clientId = config.cognito.userPoolClientId;

  const temporaryPassword = generate({
    length: 16,
    numbers: true,
    uppercase: true,
    lowercase: true,
    symbols: true,
    strict: true,
  });

  const createCognitoUserInPool = async (cognitoUserDetails: ICreateCognitoUser) => {
    const {
      email,
      accountReferenceId,
      firstName = '',
      lastName = '',
      haveMessageActionSuppressed = true,
    } = cognitoUserDetails;
    const adminCreateUserCommandInput: AdminCreateUserCommandInput = {
      UserPoolId: userPoolId,
      Username: email,
      ...(haveMessageActionSuppressed ? { MessageAction: 'SUPPRESS' } : null),
      TemporaryPassword: temporaryPassword,
      UserAttributes: [
        {
          Name: COGNITO_USER_LAST_NAME,
          Value: lastName,
        },
        {
          Name: COGNITO_USER_FIRST_NAME,
          Value: firstName,
        },
        {
          Name: CUSTOM_ACCOUNT_REFERENCE_ID,
          Value: accountReferenceId,
        },
      ],
    };

    const adminCreateUserCommand = new AdminCreateUserCommand(adminCreateUserCommandInput);

    const response = await cognitoClient.send(adminCreateUserCommand);

    return {
      ...response,
      temporaryPassword,
    };
  };

  const assignCognitoUserToGroup = (cognitoAssignUserGroupDetails: IAssignCognitoUserToGroup) => {
    const { email, groupName } = cognitoAssignUserGroupDetails;

    const adminAdduserToGroupCommandInput: AdminAddUserToGroupCommandInput = {
      UserPoolId: userPoolId,
      GroupName: groupName,
      Username: email,
    };

    const adminAddUserToGroupCommand = new AdminAddUserToGroupCommand(adminAdduserToGroupCommandInput);

    return cognitoClient.send(adminAddUserToGroupCommand);
  };

  const loginCognitoUser = async (credentials: ILoginUserCredentials) => {
    const { email, password, temporaryPassword } = credentials;

    const adminInitiateAuthCommandInput: AdminInitiateAuthCommandInput = {
      AuthFlow: AuthFlowType.ADMIN_USER_PASSWORD_AUTH,
      ClientId: clientId,
      UserPoolId: userPoolId,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: temporaryPassword,
      },
    };

    const adminInitiateAuthCommand = new AdminInitiateAuthCommand(adminInitiateAuthCommandInput);

    const initialAuthResponse = await cognitoClient.send(adminInitiateAuthCommand);

    const adminRespondToAuthChallengeCommand = new AdminRespondToAuthChallengeCommand({
      ChallengeName: ChallengeNameType.NEW_PASSWORD_REQUIRED,
      ClientId: clientId,
      UserPoolId: userPoolId,
      ChallengeResponses: {
        USERNAME: email,
        NEW_PASSWORD: password,
      },
      Session: initialAuthResponse.Session,
    });

    const adminRespondToAuthChallengeResponse = await cognitoClient.send(adminRespondToAuthChallengeCommand);

    return {
      accessToken: adminRespondToAuthChallengeResponse.AuthenticationResult?.AccessToken,
      expiresIn: adminRespondToAuthChallengeResponse.AuthenticationResult?.ExpiresIn,
      idToken: adminRespondToAuthChallengeResponse.AuthenticationResult?.IdToken,
      refreshToken: adminRespondToAuthChallengeResponse.AuthenticationResult?.RefreshToken,
    };
  };

  const deleteCognitoUser = (username: string) => {
    const adminDeleteUserCommandInput: AdminDeleteUserCommandInput = {
      UserPoolId: userPoolId,
      Username: username,
    };

    const adminDeleteUserCommand = new AdminDeleteUserCommand(adminDeleteUserCommandInput);

    return cognitoClient.send(adminDeleteUserCommand);
  };

  const verifyUserEmail = (email: string) => {
    const adminVerifyEmail: AdminUpdateUserAttributesCommandInput = {
      UserPoolId: userPoolId,
      Username: email,
      UserAttributes: [
        {
          Name: CUSTOMER_EMAIL_VERIFIED_ATTRIBUTE,
          Value: 'true',
        },
      ],
    };

    const adminVerifyEmailCommand = new AdminUpdateUserAttributesCommand(adminVerifyEmail);

    return cognitoClient.send(adminVerifyEmailCommand);
  };

  const updateCognitoUserInPool = (email: string, attributes: INameValuePairs[]) => {
    const input: AdminUpdateUserAttributesCommandInput = {
      UserPoolId: userPoolId,
      Username: email,
      UserAttributes: attributes,
    };
    const command = new AdminUpdateUserAttributesCommand(input);

    return cognitoClient.send(command);
  };

  const changePassword = details => {
    const input: ChangePasswordCommandInput = {
      AccessToken: details.accessToken,
      PreviousPassword: details.previousPassword,
      ProposedPassword: details.proposedPassword,
    };
    const command = new ChangePasswordCommand(input);

    return cognitoClient.send(command);
  };

  const getCognitoUserInPoolByEmail = async (email: string) => {
    try {
      const adminGetUserCommandInput: AdminGetUserCommandInput = {
        Username: email,
        UserPoolId: userPoolId,
      };
      const command = new AdminGetUserCommand(adminGetUserCommandInput);
      return await cognitoClient.send(command);
    } catch (error) {
      if (error.name === 'UserNotFoundException') {
        return null;
      } else {
        throw error;
      }
    }
  };

  return {
    createCognitoUserInPool,
    assignCognitoUserToGroup,
    loginCognitoUser,
    deleteCognitoUser,
    verifyUserEmail,
    updateCognitoUserInPool,
    changePassword,
    getCognitoUserInPoolByEmail,
  };
}

export default cognitoUserServiceFactory;
