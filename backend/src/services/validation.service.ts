import AlreadyExistsException from 'api/exceptions/AlreadyExistsException';
import ConstraintViolationException from 'api/exceptions/ConstraintViolationException';
import { COGNITO_USER } from 'constants/cognito.constants';

import { CUTOFF_YEARS } from 'constants/customer.constants';
import { ACCOUNT } from 'constants/salesforce/common.constants';
import { getUnixTime, subYears } from 'date-fns';

import userServiceFactory from './cognito/user.service';

export const validateCustomer = async (input: { dob?: string; email?: string }) => {
  if (input.dob) {
    const dob = getUnixTime(new Date(input.dob));
    const cutoffDate = getUnixTime(subYears(new Date(), CUTOFF_YEARS));

    if (dob > cutoffDate) {
      throw new ConstraintViolationException(ACCOUNT, 'Date of Birth is not eligible');
    }
  }
  if (input.email) {
    const email = input.email;
    const userService = userServiceFactory();
    const cognitoUser = await userService.getCognitoUserInPoolByEmail(email);

    if (cognitoUser) {
      throw new AlreadyExistsException(COGNITO_USER, 'Email already exists');
    }
  }
  return;
};
