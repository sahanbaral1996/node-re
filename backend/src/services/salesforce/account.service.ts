import { StatusCodes } from 'http-status-codes';
import APIError from 'api/exceptions/Error';
import OperationException from 'api/exceptions/OperationException';
import ServerError from 'api/exceptions/ServerError';
import {
  getAddressInformation,
  getCamelCasedObject,
  getInQuotes,
  checkIfAllowedState,
} from 'helpers/salesforce.helpers';
import container from 'container';
import { Connection } from 'jsforce';
import { IAccAssessmentRecord, IAssessmentRecordType } from 'types/salesforce/assessment.types';
import {
  IAccountRecord,
  ICreateAccount,
  IUpdateAccountDetails,
  IUpdateBillingAdnShippingAddress,
  IUpdateChargbeeIdInAccount,
} from 'types/salesforce/account.types';

import { IContactRecord } from 'types/salesforce/contact.types';
import { CUSTOMER_RECORD_TYPE } from 'constants/customer.constants';
import { SALESFORCE_TOKEN } from 'constants/app.constants';
import { ACCOUNT, CREATE_OPERATION, DESTROY_OPERATION, UPDATE_OPERATION } from 'constants/salesforce/common.constants';

/**
 * Find account Id by email.
 *
 * @param {*} email
 */
export const findRecordIdByEmail = async (email: string) => {
  try {
    const salesforceConnection: Connection = container.resolve(SALESFORCE_TOKEN);
    const accountRecordResponse = await salesforceConnection.query<{ Id: string }>(
      `SELECT ID FROM Account WHERE email__c = ${getInQuotes(email)}`
    );
    return accountRecordResponse;
  } catch (error) {
    throw new APIError(error.message);
  }
};

/**
 *
 * @param {Number} customerId
 */
export const findAccountIdByCustomerId = async customerId => {
  try {
    const salesforceConnection: Connection = container.resolve(SALESFORCE_TOKEN);
    const accountRecordResponse = await salesforceConnection.query<{ Id: string }>(
      `SELECT ID FROM Account WHERE Customer_ID__pc = ${getInQuotes(customerId)}`
    );
    if (accountRecordResponse.totalSize !== 1) {
      throw new APIError(`Account Id not found for customer ${customerId}`, StatusCodes.NOT_FOUND);
    }
    return accountRecordResponse;
  } catch (error) {
    throw new APIError(error.message);
  }
};

/**
 *
 * @param {Number} customerId
 */
export const findAccountIdByChargeBeeId = async (customerId: string) => {
  try {
    const salesforceConnection: Connection = container.resolve(SALESFORCE_TOKEN);
    const accountRecordResponse = await salesforceConnection.query<{ Id: string }>(
      `SELECT ID FROM Account WHERE chargebeeapps__CB_Id__c = ${getInQuotes(customerId)}`
    );
    if (accountRecordResponse.totalSize !== 1) {
      throw new APIError(`Account Id not found for customer ${customerId}`, StatusCodes.NOT_FOUND);
    }
    return accountRecordResponse;
  } catch (error) {
    throw new APIError(error.message);
  }
};

/**
 * Get account details by salesforce account Id.
 * @param {*} req
 * @param {String} accountId
 */
export const getAccAssessment = async accountId => {
  try {
    const salesforceConnection: Connection = container.resolve(SALESFORCE_TOKEN);
    const query = await salesforceConnection.query<IAccAssessmentRecord>(
      `SELECT
        Assmt_Days_Until_Due__pc, Assmt_Next_Due_Date__pc, Assmt_Last_Completed__pc, Assmt_Active__pc,
        Chief_Complaints__pc,
        id, Name
        FROM Account WHERE ID = '${accountId}'`
    );
    return query;
  } catch (err) {
    console.log(err);
    throw new ServerError();
  }
};

export const findPhysicianDetail = async contactId => {
  try {
    const salesforceConnection: Connection = container.resolve(SALESFORCE_TOKEN);
    const response = await salesforceConnection
      .sobject(ACCOUNT)
      .findOne(
        {
          Id: contactId,
        },
        {
          Id: true,
          Name: true,
        }
      )
      .execute();

    return getCamelCasedObject(response);
  } catch (error) {
    throw new APIError(error.message);
  }
};

export const findAccountByAccountId = async (accountId: string): Promise<IAccountRecord & IContactRecord> => {
  try {
    const salesforceConnection: Connection = container.resolve(SALESFORCE_TOKEN);
    const response = await salesforceConnection
      .sobject(ACCOUNT)
      .findOne(
        {
          Id: accountId,
        },
        {
          Id: true,
          Name: true,
          FirstName: true,
          LastName: true,
          Email__c: true,
          DOB__pc: true,
          Trial_End_Date_Formula__pc: true,
          Hyperpigmentation__pc: true,
          Status__pc: true,
          Lead_Id__c: true,
          Phone: true,
          Assmt_Active__pc: true,
        }
      )
      .execute();

    return getCamelCasedObject(response);
  } catch (error) {
    throw new APIError(error.message);
  }
};

export const createAccount = async (account: ICreateAccount) => {
  const salesforceConnection: Connection = container.resolve(SALESFORCE_TOKEN);

  const response = await salesforceConnection.sobject(ACCOUNT).create({
    FirstName: account.firstName,
    LastName: account.lastName,
    Email__c: account.email,
    Phone: account.phone,
    DOB__pc: account.dob,
    RecordTypeId: account.recordTypeId,
    Type: CUSTOMER_RECORD_TYPE,
    Lead_Id__c: account.leadId,
    I_agree_to_NoPP_and_TOA__pc: account.noppToa,
    I_agree_to_receive_frequent_marketing__pc: account.newsletter,
    Is_In_Allowed_State__c: checkIfAllowedState(account.state),
    Home_State__pc: account.state,
    Status__pc: account.status,
    In_Person_Signup__c: account.isInPersonSignUp,
  });

  if (!response.success) {
    throw new OperationException(response.errors, ACCOUNT, CREATE_OPERATION);
  }

  return response.id;
};

export const getRecordType = async (recordType: string) => {
  try {
    const salesforceConnection: Connection = container.resolve(SALESFORCE_TOKEN);
    const result = await salesforceConnection.query<IAssessmentRecordType>(
      `select Id,Name from RecordType where sObjectType='Assessment__c' and DeveloperName='${recordType}'`
    );
    return result;
  } catch (error) {
    throw new APIError(error.message);
  }
};

export const updateAccount = async (updateAccount: IUpdateAccountDetails) => {
  const salesforceConnection: Connection = container.resolve(SALESFORCE_TOKEN);
  const response = await salesforceConnection.sobject(ACCOUNT).update({
    Id: updateAccount.accountId,
    Status__pc: updateAccount.status,
    Email__c: updateAccount.email,
    chargebeeapps__CB_Id__c: updateAccount.chargebeeCustomerId,
    Phone: updateAccount.phone,
    Is_shipping_billing_same__c: updateAccount.isSameAsShippingAddress,
    Has_Uploaded_Shelfie__c: updateAccount.hasUploadedShelfie,
  });
  if (!response.success) {
    throw new OperationException(response.errors, ACCOUNT, UPDATE_OPERATION);
  }
  return response;
};

export const updateChargebeeId = async (updateChargebeeId: IUpdateChargbeeIdInAccount) => {
  const salesforceConnection: Connection = container.resolve(SALESFORCE_TOKEN);
  const response = await salesforceConnection.sobject(ACCOUNT).update({
    Id: updateChargebeeId.Id,
    chargebeeapps__CB_Id__c: updateChargebeeId.chargeBeeId,
  });
  if (!response.success) {
    throw new OperationException(response.errors, ACCOUNT, UPDATE_OPERATION);
  }
  return response;
};

export const findByEmail = async (email: string) => {
  const salesforceConnection: Connection = container.resolve(SALESFORCE_TOKEN);
  const response = await salesforceConnection.sobject(ACCOUNT).findOne({
    Email__c: email,
  });

  return response;
};

export const updateBillingAndShipping = async (accountId: string, customerData: IUpdateBillingAdnShippingAddress) => {
  const { shippingAddress, billingAddress } = customerData;
  const salesforceConnection: Connection = container.resolve(SALESFORCE_TOKEN);
  const billingAddressInformation = getAddressInformation(billingAddress);
  const shippingAddressInformation = getAddressInformation(shippingAddress);

  const response = await salesforceConnection.sobject(ACCOUNT).update({
    Id: accountId,
    BillingStreet: billingAddressInformation.street,
    BillingCity: billingAddressInformation.city,
    BillingState: billingAddressInformation.state,
    BillingPostalCode: billingAddressInformation.postalCode,
    BillingCountry: billingAddressInformation.country,
    ShippingStreet: shippingAddressInformation.street,
    ShippingState: shippingAddressInformation.state,
    ShippingCity: shippingAddressInformation.city,
    ShippingPostalCode: shippingAddressInformation.postalCode,
    ShippingCountry: shippingAddressInformation.country,
  });

  if (!response.success) {
    throw new OperationException(response.errors, ACCOUNT, UPDATE_OPERATION);
  }

  return response;
};

export const deleteAccount = async (accountId: string) => {
  const salesforceConnection: Connection = container.resolve(SALESFORCE_TOKEN);

  const response = await salesforceConnection.sobject(ACCOUNT).destroy(accountId);

  if (!response.success) {
    throw new OperationException(response.errors, ACCOUNT, DESTROY_OPERATION);
  }
  return response;
};
