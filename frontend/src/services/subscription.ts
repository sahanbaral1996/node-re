import http from 'utils/http';

import config from 'config';

import {
  CHARGE_BEE_ESTIMATE_SUBSCRIPTION,
  CHARGE_BEE_CREATE_SUBSCRIPTION,
  CHARGE_BEE_HOSTED_PORTAL_SESSSION,
  CHARGE_BEE_RETREIVE_SUBSCRIPTION,
  CHARGEBEE_REACTIVATE_SUBSCRIPTION,
  CHARGE_BEE_HOSTED_SITE,
  ADMIN_CREATE_PERSON,
} from 'constants/api';
import { handleError } from 'utils/errorHandler';

import { interpolate } from 'utils/string';
import { IPortalOptions, ISubscriptionDetails } from 'types/subscription';

/**
 * Create customer in chargebee.
 *
 * @param {{ string, string }} { CustomerId, planId }.
 * @param {function} success
 * @param {function} close
 * @param {function} error
 */
export function getHostedPage(
  { customerId, planId }: { customerId: string; planId: string },
  success?: (hostedPageId: string) => void,
  close?: () => void,
  error?: (error: string) => void
): void {
  let cbInstance: any;

  if (window.Chargebee.inited) {
    cbInstance = window.Chargebee.getInstance();
  } else {
    cbInstance = window.Chargebee.init({
      site: config.chargebee.site,
    });
  }

  return cbInstance.openCheckout({
    hostedPage: () => {
      const data = {
        customerId,
        planId: planId,
      };

      return http
        .post(CHARGE_BEE_HOSTED_SITE, data)
        .then(response => {
          return response?.data?.data;
        })
        .catch(handleError);
    },
    success,
    close,
    error,
  });
}

/**
 * Create Portal Instance.
 *
 */
export function setPortalSession(): void {
  let cbInstance: any;

  if (window.Chargebee.inited) {
    cbInstance = window.Chargebee.getInstance();
  } else {
    cbInstance = window.Chargebee.init({
      site: config.chargebee.site,
    });
  }

  cbInstance.setPortalSession(() => {
    return http
      .post(CHARGE_BEE_HOSTED_PORTAL_SESSSION)
      .then(response => response?.data?.data)
      .catch(handleError);
  });
}

/**
 * Open Portal Instance.
 *
 * @param {Object} options
 */
export function openPortal(options: IPortalOptions = {}): void {
  let cbInstance: any;

  if (window.Chargebee.inited) {
    cbInstance = window.Chargebee.getInstance();
  } else {
    cbInstance = window.Chargebee.init({
      site: config.chargebee.site,
    });
  }

  cbInstance.createChargebeePortal().open(options);
}

export function createSubscription(customerId: string, details: ISubscriptionDetails) {
  const url = interpolate(CHARGE_BEE_CREATE_SUBSCRIPTION, { customerId });

  return http.post(url, details);
}

export function adminCreatePerson(details: ISubscriptionDetails, leadId: string) {
  return http.post(ADMIN_CREATE_PERSON, { ...details, leadId });
}

export function estimateSubscription(
  customerId: string,
  details: { couponIds: string[]; trialAddOnIds: string[]; activeAddOnIds: string[] }
) {
  const url = interpolate(CHARGE_BEE_ESTIMATE_SUBSCRIPTION, { customerId });

  return http.post(url, details);
}

export function retreiveSubscription() {
  return http.get(CHARGE_BEE_RETREIVE_SUBSCRIPTION);
}
export function reactivateSubscription() {
  return http.post(CHARGEBEE_REACTIVATE_SUBSCRIPTION);
}
