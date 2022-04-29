import SubscriptionException from 'api/exceptions/SubscriptionException';
import { ChargeBee, _payment_source } from 'chargebee-typescript';
import { CHARGEBEE_TOKEN } from 'constants/app.constants';

import container from 'container';
import { ICreatePaymentSourceResponse } from 'types/chargebee/paymentSource.types';
import { noop } from 'utils/callback';
import { toCamelKeys } from 'utils/object';

export const createPaymentSource = async (
  customerId: string,
  tokenId: string
): Promise<ICreatePaymentSourceResponse> => {
  try {
    const chargebee: ChargeBee = container.resolve(CHARGEBEE_TOKEN);
    const params: _payment_source.create_using_token_params = {
      customer_id: customerId,
      token_id: tokenId,
    };
    const requestWrapper = chargebee.payment_source.create_using_token(params);

    const response = await requestWrapper.request(noop);
    return toCamelKeys<ICreatePaymentSourceResponse>(JSON.parse(response.toString()));
  } catch (error) {
    throw new SubscriptionException(error.message, error.http_status_code, error);
  }
};

export const deletePaymentSource = async (paymentSourceId: string) => {
  try {
    const chargebee: ChargeBee = container.resolve(CHARGEBEE_TOKEN);

    const requestWrapper = chargebee.payment_source.delete(paymentSourceId);

    const response = await requestWrapper.request(noop);

    return JSON.parse(response.toString());
  } catch (error) {
    throw new SubscriptionException(error.message, error.http_status_code, error);
  }
};
