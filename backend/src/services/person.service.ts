import { compose } from 'ramda';

import userServiceFactory from 'services/cognito/user.service';
import * as leadService from 'services/salesforce/lead.service';
import * as assessmentService from './salesforce/assessment.service';
import * as accountService from 'services/salesforce/account.service';
import * as recordTypeService from 'services/salesforce/recordType.service';
import * as salesforceAssessmentService from './salesforce/assessment.service';
import * as subscriptionService from 'services/subscription.service';

import { ICreatePersonDetailsByAdmin, IPersonDetails } from 'types/person.service.types';
import { ContactStatus } from 'types/salesforce/contact.types';

import { CUSTOMER_RECORD_DEVELOPER_NAME } from 'constants/customer.constants';
import {
  PERSON_USER_GROUP,
  CUSTOM_ACCOUNT_REFERENCE_ID,
  LEAD_USER_GROUP,
  COGNITO_USER,
} from 'constants/cognito.constants';
import { UPDATE_OPERATION } from 'constants/salesforce/common.constants';
import { PROMISE_FULFILLED, PROMISE_REJECTED } from 'constants/app.constants';

import { MetadataBearer } from '@aws-sdk/types/types/response';
import OperationException from 'api/exceptions/OperationException';
import { getCamelCasedObject } from '../helpers/salesforce.helpers';
import AlreadyExistsException from 'api/exceptions/AlreadyExistsException';
import { AdminDeleteUserCommandOutput } from '@aws-sdk/client-cognito-identity-provider';
import { SuccessResult } from 'jsforce';

const checkDuplicateEmail = async (email: string) => {
  try {
    const accountRecordResponse = await accountService.findRecordIdByEmail(email);
    if (accountRecordResponse.totalSize > 0) {
      throw new Error(`Person account for ${email} is already created`);
    }
  } catch (error) {
    throw error;
  }
};

export const createPerson = async (userDetails: IPersonDetails) => {
  try {
    const { email, leadId, assessment } = userDetails;
    const userService = userServiceFactory();

    await checkDuplicateEmail(email);

    const lead = await leadService.findLeadById(leadId);
    const {
      firstName,
      lastName,
      iagreetoNoPPandTOA: noppToa,
      iagreetoreceivefrequentmarketing: newsletter,
      dOB: dob,
      phone,
      homeState: state,
    } = compose(getCamelCasedObject)(lead);

    const { Id: recordTypeId } = await recordTypeService.findRecordTypeFromDeveloperName(
      CUSTOMER_RECORD_DEVELOPER_NAME
    );

    const accountId: string = await accountService.createAccount({
      firstName,
      lastName,
      email,
      phone,
      recordTypeId: recordTypeId || '',
      leadId,
      status: ContactStatus.Assessment,
      noppToa,
      newsletter,
      state,
    });

    let assessmentId: string;

    try {
      assessmentId = await assessmentService.createAssessment({
        email,
        dob,
        accountId,
        ...assessment,
      });
    } catch (error) {
      await accountService.deleteAccount(accountId);
      throw new Error(error.message);
    }

    const attributes = [
      {
        Name: CUSTOM_ACCOUNT_REFERENCE_ID,
        Value: accountId,
      },
    ];
    const results = await Promise.allSettled([
      userService.assignCognitoUserToGroup({
        email,
        groupName: PERSON_USER_GROUP,
      }),
      userService.updateCognitoUserInPool(email, attributes),
    ]);

    const rollbacks: Promise<MetadataBearer | SuccessResult | string>[] = [];
    const hasRejected = !!results.filter(result => result.status === PROMISE_REJECTED).length;

    if (hasRejected) {
      const [assignCognitoUserToGroup, updateCognitoUserInPool] = results;

      if (assignCognitoUserToGroup.status === PROMISE_FULFILLED) {
        const previousValues = {
          email,
          groupName: LEAD_USER_GROUP,
        };
        rollbacks.push(userService.assignCognitoUserToGroup(previousValues));
      }

      if (updateCognitoUserInPool.status === PROMISE_FULFILLED) {
        const prevAttributes = [
          {
            Name: CUSTOM_ACCOUNT_REFERENCE_ID,
            Value: leadId,
          },
        ];
        rollbacks.push(userService.updateCognitoUserInPool(email, prevAttributes));
      }

      rollbacks.push(
        ...[salesforceAssessmentService.deleteAssessment(assessmentId), accountService.deleteAccount(accountId)]
      );

      await Promise.all(rollbacks);

      if (assignCognitoUserToGroup.status === PROMISE_REJECTED) {
        throw new OperationException([assignCognitoUserToGroup.reason.message], COGNITO_USER, UPDATE_OPERATION);
      }

      if (updateCognitoUserInPool.status === PROMISE_REJECTED) {
        throw new OperationException([updateCognitoUserInPool.reason.message], COGNITO_USER, UPDATE_OPERATION);
      }
    }

    return {
      accountId,
      assessmentId,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const createPersonByAdmin = async (details: ICreatePersonDetailsByAdmin) => {
  const { leadId, ...rest } = details;

  const userService = userServiceFactory();

  const { email, firstName, lastName, dOB, id: existingLeadId, ...leadDetails } = await leadService.findLeadById(
    leadId
  );

  const existingCognitoUser = await userService.getCognitoUserInPoolByEmail(email);

  if (existingCognitoUser) {
    throw new AlreadyExistsException(COGNITO_USER, 'User already exists');
  }

  let accountId;
  let cognitoUser;

  try {
    const { Id: recordTypeId } = await recordTypeService.findRecordTypeFromDeveloperName(
      CUSTOMER_RECORD_DEVELOPER_NAME
    );

    const createdAccountId: string = await accountService.createAccount({
      firstName: firstName,
      lastName: lastName,
      email,
      dob: dOB,
      phone: '',
      recordTypeId: recordTypeId || '',
      leadId: existingLeadId,
      noppToa: leadDetails.iagreetoNoPPandTOA,
      newsletter: leadDetails.iagreetoreceivefrequentmarketing,
      state: rest.billingAddress.state,
      isInPersonSignUp: true,
    });

    accountId = createdAccountId;

    cognitoUser = await userService.createCognitoUserInPool({
      email,
      firstName: firstName,
      lastName: lastName,
      accountReferenceId: createdAccountId,
      haveMessageActionSuppressed: false,
    });

    const results = await Promise.allSettled([
      userService.assignCognitoUserToGroup({
        email,
        groupName: PERSON_USER_GROUP,
      }),
      userService.assignCognitoUserToGroup({
        email,
        groupName: LEAD_USER_GROUP,
      }),
      userService.verifyUserEmail(email),
    ]);

    const hasFailed = !!results.filter(result => result.status === PROMISE_REJECTED).length;

    if (hasFailed) {
      const [assignCognitoUserToPersonGroupResult, assignCognitoUserToLeadGroupResult, verifyUserEmailResult] = results;

      if (assignCognitoUserToPersonGroupResult.status === PROMISE_REJECTED) {
        throw assignCognitoUserToPersonGroupResult.reason;
      }

      if (assignCognitoUserToLeadGroupResult.status === PROMISE_REJECTED) {
        throw assignCognitoUserToLeadGroupResult.reason;
      }

      if (verifyUserEmailResult.status === PROMISE_REJECTED) {
        throw verifyUserEmailResult.reason;
      }
    }

    await subscriptionService.setupSubscription(rest, createdAccountId, '');

    await accountService.updateAccount({ accountId, status: ContactStatus.InPersonDone });

    return {
      accountId,
    };
  } catch (error) {
    const rollbacks: Promise<AdminDeleteUserCommandOutput | SuccessResult>[] = [];

    if (cognitoUser) {
      rollbacks.push(userService.deleteCognitoUser(email));
    }

    if (accountId) {
      rollbacks.push(accountService.deleteAccount(accountId));
    }

    await Promise.all(rollbacks);
    throw error;
  }
};
