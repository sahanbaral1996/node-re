import AlreadyExistsException from 'api/exceptions/AlreadyExistsException';
import OperationException from 'api/exceptions/OperationException';
import { PROMISE_REJECTED } from 'constants/app.constants';
import { ADMIN_USER_GROUP, COGNITO_USER } from 'constants/cognito.constants';
import { UPDATE_OPERATION } from 'constants/salesforce/common.constants';

import userServiceFactory from 'services/cognito/user.service';

import { ICreateUserByAdmin } from 'types/user.service.types';

export const createUserByAdmin = async (details: ICreateUserByAdmin) => {
  const { email, firstName, lastName } = details;
  try {
    const userService = userServiceFactory();

    const existingUser = await userService.getCognitoUserInPoolByEmail(email);

    if (existingUser) {
      throw new AlreadyExistsException(COGNITO_USER, 'User already exists');
    }

    const user = await userService.createCognitoUserInPool({
      email,
      accountReferenceId: '',
      firstName,
      lastName,
      haveMessageActionSuppressed: false,
    });

    const results = await Promise.allSettled([
      userService.assignCognitoUserToGroup({ email, groupName: ADMIN_USER_GROUP }),
      userService.verifyUserEmail(email),
    ]);

    const hasFailed = !!results.filter(result => result.status === PROMISE_REJECTED).length;

    if (hasFailed) {
      await userService.deleteCognitoUser(email);
      const [assignCognitoUserToGroupResult, verifyUserEmailResult] = results;
      if (assignCognitoUserToGroupResult.status === PROMISE_REJECTED) {
        throw new OperationException(assignCognitoUserToGroupResult.reason, COGNITO_USER, UPDATE_OPERATION);
      }
      if (verifyUserEmailResult.status === PROMISE_REJECTED) {
        throw new OperationException(verifyUserEmailResult.reason, COGNITO_USER, UPDATE_OPERATION);
      }
    }

    return user;
  } catch (error) {
    throw error;
  }
};
