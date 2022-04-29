import { ChargeBee, _estimate } from 'chargebee-typescript';

import config from 'config';

import { CHARGEBEE_TOKEN } from 'constants/app.constants';
import { ALLOWED_COUNTRY, ALLOWED_STATE_CODE } from 'constants/chargebee.constants';

import container from 'container';
import { getChargbeeAddOns, getEventBasedAddOns } from 'helpers/chargebee.helpers';

import { ICreateSubscriptionEstimate, ICreateSubscriptionEstimateResponse } from 'types/chargebee/estimate.types';
import { noop } from 'utils/callback';
import { toCamelKeys } from 'utils/object';

export const estimate = async (input: ICreateSubscriptionEstimate) => {
  const chargebee: ChargeBee = container.resolve(CHARGEBEE_TOKEN);

  const { couponIds, isAddonExcluded = false, trialAddOnIds = [], activeAddOnIds = [], zip = '' } = input;

  const addons = getChargbeeAddOns(activeAddOnIds);

  const eventAddons = getEventBasedAddOns([...trialAddOnIds, config.chargebee.addonId]);

  const params: _estimate.create_subscription_params = {
    subscription: {
      plan_id: config.chargebee.subscriptionPlanId,
    },
    billing_address: {
      country: ALLOWED_COUNTRY,
      state_code: ALLOWED_STATE_CODE,
      zip,
    },
    coupon_ids: couponIds,
    addons: addons,
    event_based_addons: isAddonExcluded ? [] : eventAddons,
  };
  const requestWrapper = chargebee.estimate.create_subscription(params);

  const result = await requestWrapper.request(noop);

  return toCamelKeys<ICreateSubscriptionEstimateResponse>(JSON.parse(result.toString()));
};
