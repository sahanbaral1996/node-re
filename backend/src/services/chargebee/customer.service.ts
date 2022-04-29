import winston from 'winston';
import container from 'container';
import { ChargeBee, _customer } from 'chargebee-typescript';
import { Customer, HostedPage, PortalSession } from 'chargebee-typescript/lib/resources';
import { ICustomerResponse, IUpdateCustomer } from 'types/chargebee/customer.type';
import { toCamelKeys, toSnakeCaseAttrs } from 'utils/object';
import { IAddress } from 'types/chargebee/common.types';
import { CHARGEBEE_TOKEN, LOGGER_TOKEN } from 'constants/app.constants';
import SubscriptionException from 'api/exceptions/SubscriptionException';
import { noop } from 'utils/callback';

/**
 * Create Customer
 *
 * @param {firstName} string
 * @param {lastName} string
 * @param {email} string
 */
export const create = async ({
  firstName,
  lastName,
  email,
}: {
  firstName: string;
  lastName: string;
  email: string;
}): Promise<{ customer: Customer }> => {
  const logger: winston.Logger = container.resolve(LOGGER_TOKEN);
  const chargebee: ChargeBee = container.resolve(CHARGEBEE_TOKEN);
  return new Promise((resolve, reject) => {
    chargebee.customer
      .create({
        first_name: firstName,
        last_name: lastName,
        email: email,
      })
      .request(function (error, result) {
        if (error) {
          logger.error(error);
          reject(error);
        } else {
          logger.info(`Created chargebee customer: ${result.customer.id}`);
          resolve(result);
        }
      });
  });
};

/**
 * Get Customer data from chargebee
 *
 * @param {customerId} string
 */
export const getCustomer = async (customerId: string): Promise<{ customer: Customer }> => {
  const chargebee: ChargeBee = container.resolve(CHARGEBEE_TOKEN);
  return new Promise((resolve, reject) => {
    chargebee.customer.retrieve(customerId).request(function (error, result) {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};
/**
 * Create Customer
 *
 * @param {planId} string
 * @param {customerId} string
 */
export const getHostedPage = async (planId: string, customerId: string): Promise<{ hosted_page: HostedPage }> => {
  const chargebee: ChargeBee = container.resolve(CHARGEBEE_TOKEN);
  return new Promise((resolve, reject) => {
    chargebee.hosted_page
      .checkout_new({
        subscription: {
          plan_id: planId,
        },
        customer: {
          id: customerId,
        },
      })
      .request(function (error, result) {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
  });
};

/**
 * Create Customer
 *
 * @param {customerId} string
 */
export const getHostedPortal = async (customerId: string): Promise<{ portal_session: PortalSession }> => {
  const chargebee: ChargeBee = container.resolve(CHARGEBEE_TOKEN);
  return new Promise((resolve, reject) => {
    chargebee.portal_session
      .create({
        customer: {
          id: customerId,
        },
      })
      .request(function (error, result) {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
  });
};

export const update = async (customerId: string, details: IUpdateCustomer) => {
  const logger: winston.Logger = container.resolve(LOGGER_TOKEN);
  const chargebee: ChargeBee = container.resolve(CHARGEBEE_TOKEN);
  const params = toSnakeCaseAttrs(details);

  return new Promise((resolve, reject) => {
    chargebee.customer.update(customerId, params).request(function (error, result) {
      if (error) {
        logger.error(error);
        reject(error);
      } else {
        logger.info(`Update chargebee customer: ${customerId}`);
        resolve(result);
      }
    });
  });
};
/**
 * Delete Customer
 *
 * @param {customerId} string
 */
export const deleteCustomer = async (customerId: string): Promise<{ customer: Customer }> => {
  const logger: winston.Logger = container.resolve(LOGGER_TOKEN);
  const chargebee: ChargeBee = container.resolve(CHARGEBEE_TOKEN);
  return new Promise((resolve, reject) => {
    chargebee.customer.delete(customerId).request(function (error, result) {
      if (error) {
        logger.error(error);
        reject(error);
      } else {
        logger.info(`Deleted chargebee customer: ${customerId}`);
        resolve(result);
      }
    });
  });
};

export const updateBillingInformation = async (customerId: string, details: IAddress) => {
  try {
    const chargebee: ChargeBee = container.resolve(CHARGEBEE_TOKEN);

    const params: _customer.update_billing_info_params = {
      billing_address: {
        line1: details.lineOne,
        line2: details.lineTwo,
        city: details.city,
        state: details.state,
        zip: details.zip,
        country: details.country,
      },
    };

    const requestWrapper = chargebee.customer.update_billing_info(customerId, params);

    const response = await requestWrapper.request(noop);
    return JSON.parse(response.toString());
  } catch (error) {
    throw new SubscriptionException(error.message, error.http_status_code, error);
  }
};

export const retrieveCustomerByEmail = async (email: string): Promise<ICustomerResponse | undefined> => {
  try {
    const chargebee: ChargeBee = container.resolve(CHARGEBEE_TOKEN);

    const params: _customer.customer_list_params = {
      email: {
        is: email,
      },
    };

    const requestWrapper = chargebee.customer.list(params);

    const response = await requestWrapper.request(noop);

    const [result] = response.list;
    if (result) {
      const customerResponse = toCamelKeys<ICustomerResponse>(JSON.parse(result.toString()));
      return customerResponse;
    }
    return result;
  } catch (error) {
    throw new SubscriptionException(error.message, error.http_status_code, error);
  }
};
