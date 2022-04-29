import { RecordResult, SuccessResult } from 'jsforce';

import {
  AdminAddUserToGroupCommandOutput,
  AdminUpdateUserAttributesCommandOutput,
} from '@aws-sdk/client-cognito-identity-provider';

import { UPDATE_OPERATION } from 'constants/salesforce/common.constants';
import { PROMISE_FULFILLED, PROMISE_REJECTED } from 'constants/app.constants';
import {
  CUSTOMER_USER_GROUP,
  CUSTOM_CUSTOMER_REFERENCE_ID,
  PERSON_USER_GROUP,
  COGNITO_USER,
} from 'constants/cognito.constants';
import { head } from 'ramda';

import { ISetupSubscription } from 'types/subscription.service.types';
import { ChargeBee } from 'chargebee-typescript';
import { CHARGEBEE_TOKEN } from 'constants/app.constants';
import container from 'container';

import userServiceFactory from './cognito/user.service';
import * as salesforceService from 'services/salesforce/account.service';
import * as chargebeeSubscriptionService from './chargebee/subscription.service';
import * as chargebeeCustomerService from './chargebee/customer.service';
import * as chargbeeEstimateService from './chargebee/estimate.service';
import * as salesforceAddOnOrderService from './salesforce/addOnOrder.service';

import OperationException from 'api/exceptions/OperationException';
import { filterLineItemsByEntityId, filterLineItemsByEntityType, formatEstimate } from 'helpers/subscription.helper';
import AlreadyExistsException from 'api/exceptions/AlreadyExistsException';
import { IRetrieveSubscriptionForCustomer } from 'types/chargebee/subscription.types';
import { CHARGBEE_CUSTOMER, CHARGEBEE_SUBSCRIPTION } from 'constants/chargebee.constants';
import { ContactStatus } from 'types/salesforce/contact.types';
import { IEstimateSubscriptionDetails } from 'types/chargebee/subscription.types';
import ConstraintViolationException from 'api/exceptions/ConstraintViolationException';
import { LineItemEntityTypes } from 'types/chargebee/estimate.types';
import config from 'config';

export async function setupSubscription(details: ISetupSubscription, accountId: string, customerId?: string) {
  const accountDetail = await salesforceService.findAccountByAccountId(accountId);

  let existingCustomerId = customerId;

  if (!existingCustomerId) {
    const existingCustomer = await chargebeeCustomerService.retrieveCustomerByEmail(accountDetail.email);
    if (existingCustomer) {
      existingCustomerId = existingCustomer.customer.id;
    }
  }

  if (existingCustomerId) {
    const subscription = await chargebeeSubscriptionService.retrieveSubscriptionForCustomer(existingCustomerId);
    if (subscription) {
      throw new AlreadyExistsException(CHARGBEE_CUSTOMER, 'Customer Already Exists');
    } else {
      await chargebeeCustomerService.deleteCustomer(existingCustomerId);
    }
  }

  const { addOnConfigurationIds = [], activeAddOnIds = [] } = details;

  if (addOnConfigurationIds.length !== activeAddOnIds.length) {
    throw new ConstraintViolationException(CHARGEBEE_SUBSCRIPTION, 'Product Configurations and Addons should be equal');
  }

  const subscriptionResponse = await chargebeeSubscriptionService.createSubscription(details, accountDetail);

  const subscription = subscriptionResponse.subscription;
  const customer = subscriptionResponse.customer;

  const email: string = accountDetail.email;
  try {
    const userService = userServiceFactory();
    const results = await Promise.allSettled([
      userService.assignCognitoUserToGroup({
        email,
        groupName: CUSTOMER_USER_GROUP,
      }),
      userService.updateCognitoUserInPool(email, [
        {
          Name: CUSTOM_CUSTOMER_REFERENCE_ID,
          Value: customer.id,
        },
      ]),
      salesforceService.updateAccount({
        accountId,
        chargebeeCustomerId: subscriptionResponse.customer.id,
        phone: subscriptionResponse.customer.phone,
        isSameAsShippingAddress: details.isSameAsShippingAddress,
        status: ContactStatus.BillingInformation,
      }),
      salesforceAddOnOrderService.createAddOnOrders(accountId, addOnConfigurationIds),
    ]);
    const hasError = !!results.filter(result => result.status === PROMISE_REJECTED).length;

    if (hasError) {
      const [
        assignCognitoUserToGroupResult,
        updateCognitoUserInPoolResult,
        updateAccountResult,
        createAddOnOrdersResult,
      ] = results;

      const rollbacks: Promise<
        AdminUpdateUserAttributesCommandOutput | AdminAddUserToGroupCommandOutput | SuccessResult | RecordResult[]
      >[] = [];

      if (assignCognitoUserToGroupResult.status === PROMISE_FULFILLED) {
        rollbacks.push(userService.assignCognitoUserToGroup({ email, groupName: PERSON_USER_GROUP }));
      }

      if (updateCognitoUserInPoolResult.status === PROMISE_FULFILLED) {
        rollbacks.push(
          userService.updateCognitoUserInPool(email, [
            {
              Name: CUSTOM_CUSTOMER_REFERENCE_ID,
              Value: customer.id,
            },
          ])
        );
      }

      if (updateAccountResult.status === PROMISE_FULFILLED) {
        rollbacks.push(salesforceService.updateAccount({ accountId, chargebeeCustomerId: '', phone: '' }));
      }

      if (createAddOnOrdersResult.status === PROMISE_FULFILLED) {
        const recordIds = createAddOnOrdersResult.value.map(({ id }) => id);
        rollbacks.push(salesforceAddOnOrderService.deleteAddOnOrders(recordIds));
      }

      await Promise.all(rollbacks);

      if (assignCognitoUserToGroupResult.status === PROMISE_REJECTED) {
        throw new OperationException([assignCognitoUserToGroupResult.reason.message], COGNITO_USER, UPDATE_OPERATION);
      }

      if (updateCognitoUserInPoolResult.status === PROMISE_REJECTED) {
        throw new OperationException([updateCognitoUserInPoolResult.reason.message], COGNITO_USER, UPDATE_OPERATION);
      }

      if (updateAccountResult.status === PROMISE_REJECTED) {
        throw updateAccountResult.reason;
      }
    }
  } catch (error) {
    await Promise.all([
      chargebeeSubscriptionService.deleteSubscription(subscription.id),
      chargebeeCustomerService.deleteCustomer(customer.id),
    ]);
    throw error;
  }
}

export async function estimateSubscription(details: IEstimateSubscriptionDetails) {
  const [addOnEstimate, recurringEstimate] = await Promise.all([
    chargbeeEstimateService.estimate(details),
    chargbeeEstimateService.estimate({ ...details, isAddonExcluded: true }),
  ]);

  const { invoiceEstimate } = addOnEstimate.estimate;
  const { nextInvoiceEstimate } = recurringEstimate.estimate;

  const estimates = {
    invoiceEstimate: invoiceEstimate ? formatEstimate(invoiceEstimate) : undefined,
    nextInvoiceEstimate: nextInvoiceEstimate ? formatEstimate(nextInvoiceEstimate) : undefined,
  };

  if (estimates.invoiceEstimate) {
    estimates.invoiceEstimate.lineItems = filterLineItemsByEntityId(
      estimates.invoiceEstimate.lineItems,
      config.chargebee.addonId
    );
  }

  if (estimates.nextInvoiceEstimate) {
    estimates.nextInvoiceEstimate.lineItems = filterLineItemsByEntityType(
      estimates.nextInvoiceEstimate.lineItems,
      LineItemEntityTypes.Plan
    );
  }

  return estimates;
}

export function retreiveSubscription(customerId: string) {
  return chargebeeSubscriptionService.retrieveSubscriptionForCustomer(customerId);
}

export async function reactivateSubscription(chargebeeCustomerId: string) {
  const chargebee: ChargeBee = container.resolve(CHARGEBEE_TOKEN);
  const account = await salesforceService.findAccountIdByChargeBeeId(chargebeeCustomerId);
  const accountHead = head(account.records);
  if (!accountHead) {
    return {};
  }
  const subList = await new Promise<{ list: Record<any, any>[] }>((resolve, reject) => {
    chargebee.subscription.list({ customer_id: { is: chargebeeCustomerId } }).request((err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
  const subHead = head(subList.list);
  if (!subHead) {
    return {};
  }
  const subscriptionId = subHead.subscription.id;
  const responseSubs = await new Promise<{ list: Record<any, any>[] }>((resolve, reject) => {
    chargebee.subscription.reactivate(subscriptionId).request((err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
  return { responseSubs };
}

export const addAddonChargeOnSubscription = async (email: string, orderType: string) => {
  const existingCustomer = await chargebeeCustomerService.retrieveCustomerByEmail(email);
  if (existingCustomer) {
    const result = chargebeeSubscriptionService.incurChargeOnSubscription(existingCustomer.customer.id, orderType);
    return result;
  } else {
    return {};
  }
};

export async function updateSubscriptionPrice(price: number) {
  let offset: string | undefined = '';
  const allSubscriptions: IRetrieveSubscriptionForCustomer[] = [];
  do {
    const { subscriptions, nextOffset } = await chargebeeSubscriptionService.listSubscription(offset);
    allSubscriptions.push(...subscriptions);
    offset = nextOffset;
  } while (!!offset);
  const subscriptionsToUpdate = allSubscriptions.map(({ subscription }) =>
    chargebeeSubscriptionService.updateSubscription(subscription.id, { price })
  );

  const results = await Promise.allSettled(subscriptionsToUpdate);

  const failedResults = results.filter(result => result.status === PROMISE_REJECTED) as PromiseRejectedResult[];

  const hasFailed = !!failedResults.length;

  if (hasFailed) {
    const errors = failedResults.map(failedResult => failedResult.reason.message);
    throw new OperationException(errors, CHARGEBEE_SUBSCRIPTION, UPDATE_OPERATION);
  }

  return {
    results: results,
    count: allSubscriptions.length,
  };
}
