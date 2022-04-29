import container from 'container';

import { Connection } from 'jsforce';

import NotFoundException from 'api/exceptions/NotFoundException';
import { SALESFORCE_TOKEN } from 'constants/app.constants';
import { RECORD_TYPE } from 'constants/salesforce/common.constants';

export const findRecordTypeFromDeveloperName = async (developerName: string) => {
  const salesforceConnection: Connection = container.resolve(SALESFORCE_TOKEN);

  const response = await salesforceConnection.sobject(RECORD_TYPE).findOne({
    DeveloperName: developerName,
  });

  if (!response.Id) {
    throw new NotFoundException(`Record Type not found for ${developerName}`);
  }
  return response;
};
