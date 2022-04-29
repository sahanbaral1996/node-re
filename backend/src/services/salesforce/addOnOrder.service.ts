import OperationException from 'api/exceptions/OperationException';
import { SALESFORCE_TOKEN } from 'constants/app.constants';
import { ADD_ON_ORDER, CREATE_OPERATION, ADDON_RECORD_TYPE_DOCENT } from 'constants/salesforce/common.constants';
import container from 'container';
import { Connection, SuccessResult } from 'jsforce';
import { IAddonOrderConfig } from 'types/salesforce/addOnOrder.types';
import { IAddonOrder } from 'types/salesforce/addOnOrder.types';
import * as recordTypeService from './recordType.service';

import { getCamelCasedObject } from 'helpers/salesforce.helpers';
import { map } from 'ramda';
import { ADDON_ORDER } from 'constants/salesforce/common.constants';

export const createAddOnOrders = async (accountId: string, productConfigurationIds: string[]) => {
  const salesforceConnection: Connection = container.resolve(SALESFORCE_TOKEN);

  const addOnOrders = productConfigurationIds.map(productConfigurationId => ({
    Add_On_Configuration__c: productConfigurationId,
    Person__c: accountId,
  }));

  const response = await salesforceConnection
    .sobject<IAddonOrderConfig>(ADD_ON_ORDER)
    .create(addOnOrders, { allOrNone: true });

  const [firstRecordResult] = response;
  if (firstRecordResult && !firstRecordResult.success) {
    throw new OperationException(firstRecordResult.errors, ADD_ON_ORDER, CREATE_OPERATION);
  }

  return response as SuccessResult[];
};

export const deleteAddOnOrders = async (recordIds: string[]) => {
  const salesforceConnection: Connection = container.resolve(SALESFORCE_TOKEN);

  const response = await salesforceConnection.sobject<IAddonOrderConfig>(ADD_ON_ORDER).delete(recordIds);
  return response as SuccessResult[];
};

export const findAddonOrders = async () => {
  const salesforceConnection: Connection = container.resolve(SALESFORCE_TOKEN);
  const { Id: recordTypeId } = await recordTypeService.findRecordTypeFromDeveloperName(ADDON_RECORD_TYPE_DOCENT);
  const response = await salesforceConnection
    .sobject(ADDON_ORDER)
    .find<IAddonOrder>({
      Is_Active__c: true,
      RecordTypeId: recordTypeId,
    })
    .execute();

  return map(getCamelCasedObject, response);
};

export const findUserAddonOrders = async (accountId: string) => {
  const salesforceConnection: Connection = container.resolve(SALESFORCE_TOKEN);
  const response = await salesforceConnection
    .sobject(ADD_ON_ORDER)
    .find<IAddonOrderConfig>({
      Person__c: accountId,
    })
    .execute();

  return map(getCamelCasedObject, response);
};
