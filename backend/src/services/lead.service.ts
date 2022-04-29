import { ICreateLead, ICreateLeadByAdmin, IUpdateLead } from 'types/salesforce/lead.types';

import * as salesforceLeadService from 'services/salesforce/lead.service';
import userServiceFactory from 'services/cognito/user.service';

import AlreadyExistsException from 'api/exceptions/AlreadyExistsException';

import { LEAD } from 'constants/salesforce/common.constants';
import { ANONYMOUS_LAST_NAME_PLACEHOLDER } from 'constants/app.constants';
import { COGNITO_USER } from 'constants/cognito.constants';

export const createLead = async (createLeadDetails: ICreateLead) => {
  const userService = userServiceFactory();

  const [existingUser, existingLead] = await Promise.all([
    userService.getCognitoUserInPoolByEmail(createLeadDetails.email),
    salesforceLeadService.findLeadByEmail(createLeadDetails.email),
  ]);

  if (existingUser) {
    throw new AlreadyExistsException(COGNITO_USER, 'User already exists');
  }

  if (existingLead) {
    throw new AlreadyExistsException(LEAD, 'Lead already exists');
  }

  const { email, lastName = ANONYMOUS_LAST_NAME_PLACEHOLDER, firstName, state } = createLeadDetails;
  return salesforceLeadService.createLead({ email, lastName, firstName, state });
};

export const updateLead = (id: string, updateLeadDetails: IUpdateLead) => {
  return salesforceLeadService.updateLead({ id, leadDetails: updateLeadDetails });
};

export const createLeadByAdmin = async (details: ICreateLeadByAdmin) => {
  const { email, ...rest } = details;
  const userService = userServiceFactory();

  const [existingUser, existingLead] = await Promise.all([
    userService.getCognitoUserInPoolByEmail(details.email),
    salesforceLeadService.findLeadByEmail(details.email),
  ]);

  if (existingUser) {
    throw new AlreadyExistsException(COGNITO_USER, 'User already exists');
  }

  if (existingLead) {
    return salesforceLeadService.updateLead({ id: existingLead.id, leadDetails: details });
  }

  return salesforceLeadService.createLead({ email, ...rest });
};

export const findLeadById = (id: string) => {
  return salesforceLeadService.findLeadById(id);
};
