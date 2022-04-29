import container from 'container';

import { ChargeBee, _subscription } from 'chargebee-typescript';
import * as salesforceService from 'services/salesforce/account.service';
import { head } from 'ramda';
import * as dt from 'date-fns';
import { ICreateSubscription } from 'types/chargebee/customer.type';
import config from 'config';
import {
  ICreateSubscriptionForCustomerResponse,
  IDeleteSubscriptionResponse,
  IRetrieveSubscriptionForCustomer,
  IUpdateSubscriptionParams,
  IUpdateSubscriptionResponse,
} from 'types/chargebee/subscription.types';
import { toCamelKeys } from 'utils/object';
import { CHARGEBEE_TOKEN } from 'constants/app.constants';
import { noop } from 'utils/callback';
import SubscriptionException from 'api/exceptions/SubscriptionException';
import { IContactRecord } from 'types/salesforce/contact.types';
import { IAccountRecord } from 'types/salesforce/account.types';
import { getChargbeeAddOns, getEventBasedAddOns } from 'helpers/chargebee.helpers';

export const reactivateSubscription = async accountId => {
  try {
    const chargebee: ChargeBee = container.resolve(CHARGEBEE_TOKEN);
    const accountData = await salesforceService.findAccountByAccountId(accountId);
    const trail_end_data = accountData.trialEndDateFormula;
    const customerEmail = accountData.email;
    const customers = await new Promise<{ list: Record<any, any>[] }>((resolve, reject) => {
      chargebee.customer.list({ email: { is: customerEmail } }).request((err, succ) => {
        if (err) {
          reject(err);
        } else {
          resolve(succ);
        }
      });
    });
    const listHead = head(customers.list);
    if (!listHead) {
      return {};
    }
    const customerId = listHead.customer.id;
    const subList = await new Promise<{ list: Record<any, any>[] }>((resolve, reject) => {
      chargebee.subscription.list({ customer_id: { is: customerId } }).request((err, result) => {
        if (err) {
          reject(result);
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
      chargebee.subscription
        .update(subscriptionId, { trial_end: dt.getUnixTime(new Date(trail_end_data)) })
        .request((err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
    });
    return { responseSubs };
  } catch (err) {
    throw new Error(err);
  }
};

export const createSubscription = async (
  details: ICreateSubscription,
  accountDetail: IAccountRecord & IContactRecord
): Promise<ICreateSubscriptionForCustomerResponse> => {
  try {
    const firstName = accountDetail.firstName;
    const lastName = accountDetail.lastName;

    const chargebee: ChargeBee = container.resolve(CHARGEBEE_TOKEN);

    const { activeAddOnIds = [], trialAddOnIds = [] } = details;

    const addons = getChargbeeAddOns(activeAddOnIds);

    const eventAddOns = getEventBasedAddOns([...trialAddOnIds, config.chargebee.addonId]);

    const params: _subscription.create_params = {
      plan_id: config.chargebee.subscriptionPlanId,
      shipping_address: {
        line1: details.shippingAddress.lineOne,
        line2: details.shippingAddress.lineTwo,
        city: details.shippingAddress.city,
        state: details.shippingAddress.state,
        zip: details.shippingAddress.zip,
        country: details.shippingAddress.country,
      },
      billing_address: {
        line1: details.billingAddress.lineOne,
        line2: details.billingAddress.lineTwo,
        city: details.billingAddress.city,
        state: details.billingAddress.state,
        zip: details.billingAddress.zip,
        country: details.billingAddress.country,
      },
      customer: {
        first_name: firstName,
        last_name: lastName,
        email: accountDetail.email,
        phone: details.phone,
      },
      token_id: details.token,
      coupon_ids: details.couponIds,
      addons,
      event_based_addons: eventAddOns,
    };
    const requestWrapper = chargebee.subscription.create(params);

    const response = await requestWrapper.request(noop);

    return toCamelKeys<ICreateSubscriptionForCustomerResponse>(JSON.parse(response.toString()));
  } catch (error) {
    throw new SubscriptionException(error.message, error.http_status_code, error);
  }
};

export const deleteSubscription = async (subscriptionId: string): Promise<IDeleteSubscriptionResponse> => {
  try {
    const chargebee: ChargeBee = container.resolve(CHARGEBEE_TOKEN);
    const requestWrapper = chargebee.subscription.delete(subscriptionId);
    const response = await requestWrapper.request(noop);
    return toCamelKeys<IDeleteSubscriptionResponse>(JSON.parse(response.toString()));
  } catch (error) {
    throw new SubscriptionException(error.message, error.http_status_code, error);
  }
};

export const retrieveSubscriptionForCustomer = async (customerId: string) => {
  try {
    const chargebee: ChargeBee = container.resolve(CHARGEBEE_TOKEN);
    const params: _subscription.subscription_list_params = {
      limit: 1,
      customer_id: { is: customerId },
      plan_id: { is: config.chargebee.subscriptionPlanId },
    };
    const requestWrapper = chargebee.subscription.list(params);
    const response = await requestWrapper.request(noop);
    const [result] = response.list;
    if (result) {
      const subscription = toCamelKeys<IRetrieveSubscriptionForCustomer>(JSON.parse(result.toString()));
      return subscription;
    }
    return result;
  } catch (error) {
    throw new SubscriptionException(error.message, error.http_status_code, error);
  }
};

export const listSubscription = async (offset?: string) => {
  try {
    const chargebee: ChargeBee = container.resolve(CHARGEBEE_TOKEN);
    const params: _subscription.subscription_list_params = {
      limit: 100,
      offset,
      plan_id: { is: config.chargebee.subscriptionPlanId },
    };
    const requestWrapper = chargebee.subscription.list(params);
    const response = await requestWrapper.request(noop);
    const subscriptions = toCamelKeys<IRetrieveSubscriptionForCustomer[]>(JSON.parse(`[${response.list.toString()}]`));
    const nextOffset: string = response.next_offset;
    return {
      subscriptions,
      nextOffset,
    };
  } catch (error) {
    throw new SubscriptionException(error.message, error.http_status_code, error);
  }
};

export const updateSubscription = async (id: string, details: IUpdateSubscriptionParams) => {
  try {
    const chargebee: ChargeBee = container.resolve(CHARGEBEE_TOKEN);
    const params: _subscription.update_params = {
      plan_unit_price: details.price,
      addons: details.addons,
    };
    const requestWrapper = chargebee.subscription.update(id, params);
    const response = await requestWrapper.request(noop);
    const result = toCamelKeys<IUpdateSubscriptionResponse>(JSON.parse(response.toString()));
    return result;
  } catch (error) {
    throw new SubscriptionException(error.message, error.http_status_code, error);
  }
};

export const deleteScheduledChanges = async (id: string) => {
  try {
    const chargebee: ChargeBee = container.resolve(CHARGEBEE_TOKEN);
    const requestWrapper = chargebee.subscription.remove_scheduled_changes(id);
    const response = await requestWrapper.request(noop);
    const result = toCamelKeys<IUpdateSubscriptionResponse>(JSON.parse(response.toString()));
    return result;
  } catch (error) {
    throw new SubscriptionException(error.message, error.http_status_code, error);
  }
};

export const updateAddonOnSubscription = async (id: string, params: _subscription.update_params) => {
  try {
    const chargebee: ChargeBee = container.resolve(CHARGEBEE_TOKEN);
    const requestWrapper = chargebee.subscription.update(id, params);
    const response = await requestWrapper.request(noop);
    const result = toCamelKeys<IUpdateSubscriptionResponse>(JSON.parse(response.toString()));
    return result;
  } catch (error) {
    throw new SubscriptionException(error.message, error.http_status_code, error);
  }
};

export const incurChargeOnSubscription = async (customerId: string, orderType: string) => {
  try {
    const sub = await retrieveSubscriptionForCustomer(customerId);
    const chargebee: ChargeBee = container.resolve(CHARGEBEE_TOKEN);
    const addonType =
      orderType == 'Trial' ? 'oral-meds-trial' : orderType == '' ? 'docent-wash_active' : 'oral-meds-active';
    const params: _subscription.update_params = {
      addons: [
        {
          id: addonType,
          quantity: 1,
        },
      ],
    };
    const responseSubs = await new Promise<{ list: Record<any, any>[] }>((resolve, reject) => {
      chargebee.subscription.update(sub.subscription.id, params).request((err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
    return responseSubs;
    console.log(responseSubs);
  } catch (error) {
    throw new SubscriptionException(error.message, error.http_status_code, error);
  }
};
