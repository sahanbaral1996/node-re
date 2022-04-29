import APIError from 'api/exceptions/Error';
import { Connection } from 'jsforce';
import * as salService from 'services/salesforce/account.service';
import { getCamelCasedObject } from 'helpers/salesforce.helpers';
import { hasLineItemWithEntityId } from 'helpers/chargebee.helpers';
import container from 'container';
import { head } from 'ramda';
import config from 'config';
import { STATUS_TRIAL_PAID, STATUS_SUBS_PAID, STATUS_CC_ERROR } from 'constants/salesforce/status';
import { IcreateInvoice } from 'types/chargebee/invoice.type';

export const createBillingOrder = async (attributes: IcreateInvoice) => {
  try {
    const account = await salService.findAccountIdByChargeBeeId(attributes.customer_id);
    const accountId = account.records[0].Id;
    const salesforceConnection: Connection = container.resolve('salesforceConnection');
    const billingObj = {
      Account__c: accountId,
      Billing_City__c: attributes.billing_address.city || '',
      Billing_Country__c: attributes.billing_address.country || '',
      Billing_State__c: attributes.billing_address.state || '',
      Billing_Street1__c: attributes.billing_address.line1 || '',
      Billing_Street2__c: attributes.billing_address.line2 || '',
      Shipping_City__c: attributes.shipping_address.city || '',
      Shipping_Country__c: attributes.shipping_address.country || '',
      Shipping_State__c: attributes.shipping_address.state || '',
      Shipping_Street1__c: attributes.shipping_address.line1 || '',
      Shipping_Street2__c: attributes.shipping_address.line2 || '',
      Total_Price__c: attributes.sub_total,
      Processed_At__c: attributes.paid_at,
    };
    const data = await salesforceConnection.sobject('Billing_Order__c').create(billingObj);
    return data;
  } catch (err) {
    throw new APIError(err);
  }
};

export const updatePaymentStatus = async attributes => {
  try {
    const account = await salService.findAccountIdByChargeBeeId(attributes.transaction.customer_id);
    const salesforceConnection: Connection = container.resolve('salesforceConnection');
    const accountId = head(account.records);
    if (!accountId) {
      return {};
    }
    const contactData = await salesforceConnection.sobject('Contact').find({ AccountId: accountId.Id });
    let status;
    if (
      attributes.transaction.status == 'success' &&
      hasLineItemWithEntityId(attributes.invoice.line_items, config.chargebee.addonId)
    ) {
      status = STATUS_TRIAL_PAID;
    } else if (
      attributes.transaction.status == 'success' &&
      hasLineItemWithEntityId(attributes.invoice.line_items, config.chargebee.subscriptionPlanId)
    ) {
      status = STATUS_SUBS_PAID;
    } else if (attributes.transaction.status === 'failure') {
      status = STATUS_CC_ERROR;
    }
    const data = await salesforceConnection.sobject('Contact').update({
      Id: contactData[0].Id,
      Payment_Status__c: status,
    });
    return data;
  } catch (err) {
    throw new APIError(err.message);
  }
};

export const subcriptionChanged = async (attributes, eventType) => {
  try {
    const account = await salService.findAccountIdByChargeBeeId(attributes.customer.id);
    const salesforceConnection: Connection = container.resolve('salesforceConnection');
    const accountId = head(account.records);
    if (!accountId) {
      return {};
    }
    const contactData = await salesforceConnection.sobject('Contact').find({ AccountId: accountId.Id });
    const contact = getCamelCasedObject(contactData);
    let status;
    if (attributes.subscription.status == 'cancelled') {
      status = 'Subscription Cancelled';
    } else if (attributes.subscription.status == 'paused') {
      status = 'Paused';
    } else if (eventType == 'subscription_cancellation_scheduled') {
      status = 'Cancellation - Impending';
    } else if (attributes.subscription.status == 'active' || attributes.subscription.status == 'in_trial') {
      status = contact.lastPaymentStatus;
    }
    const data = await salesforceConnection.sobject('Contact').update({
      Id: contactData[0].Id,
      Payment_Status__c: status,
    });
    return data;
  } catch (err) {
    throw new APIError(err.message);
  }
};
