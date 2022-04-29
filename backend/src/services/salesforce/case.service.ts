import { Connection } from 'jsforce';

import { ICreateCase } from 'types/salesforce/case.types';

import container from 'container';

import config from 'config';

import OperationException from 'api/exceptions/OperationException';
import { SALESFORCE_TOKEN } from 'constants/app.constants';
import { CASE, CREATE_OPERATION } from 'constants/salesforce/common.constants';

export const createCase = async (createCase: ICreateCase) => {
  const salesforceConnection: Connection = container.resolve(SALESFORCE_TOKEN);

  const result = await salesforceConnection.sobject(CASE).create({
    Description: createCase.description,
    AccountId: createCase.accountId,
    OwnerId: config.salesforce.webtocaseQuequeId,
  });

  if (!result.success) {
    throw new OperationException(result.errors, CASE, CREATE_OPERATION);
  }

  return result;
};
