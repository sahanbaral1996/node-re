import { EventEmitter } from 'events';

import { customerEvents } from './events';
import { cognitoUserServiceFactory } from 'services/cognito/user.service';
import { ICognitoUserAttributes } from 'types/cognito/user.types';
import { CUSTOM_ACCOUNT_REFERENCE_ID, CUSTOM_CUSTOMER_REFERENCE_ID } from 'constants/cognito.constants';
import { INameValuePairs, toCamelCaseObjectFromNameValuePairs } from 'utils/object';
import { sentryCaptureExceptions } from 'loaders/logger';
import { IUser } from 'types/app.types';

export function initializeCustomerEvents({ eventEmitter }: { eventEmitter: EventEmitter }) {
  eventEmitter.on(customerEvents.getCustomerInformation, async ({ user }: { user: IUser }) => {
    try {
      const userService = cognitoUserServiceFactory();
      const existingUser = await userService.getCognitoUserInPoolByEmail(user.email);
      if (existingUser && existingUser.UserAttributes) {
        const existingUserAttributes = toCamelCaseObjectFromNameValuePairs<ICognitoUserAttributes>(
          existingUser.UserAttributes as INameValuePairs[]
        );
        if (
          !existingUserAttributes[CUSTOM_ACCOUNT_REFERENCE_ID] &&
          !existingUserAttributes[CUSTOM_CUSTOMER_REFERENCE_ID]
        ) {
          const attributes = [
            {
              Name: CUSTOM_ACCOUNT_REFERENCE_ID,
              Value: user.salesforceReferenceId,
            },
            {
              Name: CUSTOM_CUSTOMER_REFERENCE_ID,
              Value: user.chargebeeReferenceId,
            },
          ];
          userService.updateCognitoUserInPool(user.email, attributes);
        }
      }
    } catch (error) {
      sentryCaptureExceptions(error);
    }
  });
}
