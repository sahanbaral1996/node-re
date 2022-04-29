import { Connection, SfDate } from 'jsforce';

import container from 'container';

import { ICreateLead, ILeadDetails, IUpdateLead } from 'types/salesforce/lead.types';

import { CREATE_OPERATION, DELETE_OPERATION, LEAD, UPDATE_OPERATION } from 'constants/salesforce/common.constants';
import { SALESFORCE_TOKEN } from 'constants/app.constants';
import OperationException from 'api/exceptions/OperationException';
import { getCamelCasedObject } from 'helpers/salesforce.helpers';

export async function createLead(createLeadDetails: ICreateLead) {
  const salesforceConnection: Connection = container.resolve(SALESFORCE_TOKEN);

  const response = await salesforceConnection.sobject(LEAD).create({
    Email: createLeadDetails.email,
    Phone: createLeadDetails.phone,
    FirstName: createLeadDetails.firstName,
    LastName: createLeadDetails.lastName,
    DOB__c: createLeadDetails.dob ? SfDate.toDateLiteral(createLeadDetails.dob) : undefined,
    I_agree_to_NoPP_and_TOA__c: createLeadDetails.noppToa,
    I_agree_to_receive_frequent_marketing__c: createLeadDetails.newsletter,
    Home_State__c: createLeadDetails.state,
  });

  if (!response.success) {
    throw new OperationException(response.errors, LEAD, CREATE_OPERATION);
  }
  return response;
}

export async function findLeadByEmail(email: string): Promise<ILeadDetails> {
  const salesforceConnection: Connection = container.resolve(SALESFORCE_TOKEN);

  const response = await salesforceConnection.sobject(LEAD).findOne({
    Email: email,
  });
  return getCamelCasedObject(response);
}

export async function updateLead({ id, leadDetails }: { id: string; leadDetails: Partial<IUpdateLead> }) {
  const salesforceConnection: Connection = container.resolve(SALESFORCE_TOKEN);

  const response = await salesforceConnection.sobject(LEAD).update({
    Id: id,
    Email: leadDetails.email,
    Phone: leadDetails.phone,
    FirstName: leadDetails.firstName,
    LastName: leadDetails.lastName,
    DOB__c: leadDetails.dob ? SfDate.toDateLiteral(leadDetails.dob) : undefined,
    I_agree_to_NoPP_and_TOA__c: leadDetails.noppToa,
    I_agree_to_receive_frequent_marketing__c: leadDetails.newsletter,
    Home_State__c: leadDetails.state,
    Status: leadDetails.status,
  });

  if (!response.success) {
    throw new OperationException(response.errors, LEAD, UPDATE_OPERATION);
  }
  return response;
}

export async function deleteLead(id: string) {
  const salesforceConnection: Connection = container.resolve(SALESFORCE_TOKEN);

  const response = await salesforceConnection.sobject(LEAD).delete(id);

  if (!response.success) {
    throw new OperationException(response.errors, LEAD, DELETE_OPERATION);
  }
  return response;
}

export async function findLeadById(id: string) {
  const salesforceConnection: Connection = container.resolve(SALESFORCE_TOKEN);

  const response = await salesforceConnection.sobject(LEAD).findOne(
    {
      Id: id,
    },
    {
      Id: true,
      Name: true,
      Email: true,
      DOB__c: true,
      Status: true,
      Phone: true,
      FirstName: true,
      LastName: true,
      I_agree_to_NoPP_and_TOA__c: true,
      I_agree_to_receive_frequent_marketing__c: true,
      Home_State__c: true,
    }
  );
  return getCamelCasedObject(response);
}
