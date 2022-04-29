import * as assessmentService from 'services/salesforce/assessment.service';
import * as accountService from 'services/salesforce/account.service';
import { ContactStatus } from 'types/salesforce/contact.types';
import { getCamelCasedObject } from '../helpers/salesforce.helpers';

import { compose } from 'ramda';

export const createAssessment = async (accountId: string, assessment) => {
  let assessmentId;
  try {
    const accountDetails = await accountService.findAccountByAccountId(accountId);
    const { dOB: dob } = compose(getCamelCasedObject)(accountDetails);

    assessmentId = await assessmentService.createAssessment({
      email: accountDetails.email,
      dob,
      accountId: accountDetails.id,
      ...assessment,
    });

    const response = await accountService.updateAccount({
      accountId: accountDetails.id,
      status: ContactStatus.BillingInformation,
    });

    return { response, assessmentId };
  } catch (error) {
    if (assessmentId) {
      assessmentService.deleteAssessment(assessmentId);
    }
    throw new Error(error);
  }
};
