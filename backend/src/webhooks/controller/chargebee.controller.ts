import * as chargeBeeSubscriptionService from 'services/chargebee/subscription.service';
import { StatusCodes } from 'http-status-codes';
import { OUTBOUND_ACK_XML } from 'constants/webhook.constants';
import { head } from 'ramda';
import { Request, Response } from 'express';

import * as subscriptionService from 'services/subscription.service';

import lang from 'lang';
import { sentryCaptureExceptions } from 'loaders/logger';

import config from 'config';

export const reactivateSubscription = async (req, res) => {
  const soapBody = head(req.body['soapenv:Envelope']['soapenv:Body']);
  const notification = head(soapBody['notifications']);
  const innerNotify = head(notification['Notification']);
  const sobject = head(innerNotify['sObject']);
  const accountId = head(sobject['sf:AccountId']);
  try {
    await chargeBeeSubscriptionService.reactivateSubscription(accountId);
    res.set('Content-Type', 'application/xml');
    res.send(OUTBOUND_ACK_XML);
  } catch (err) {
    return res.status(err.http_status_code || StatusCodes.BAD_REQUEST).send(err.message);
  }
};

export const updatePlanForSubscription = (req: Request, res: Response) => {
  const { price, id } = req.body.content.plan;

  if (id === config.chargebee.subscriptionPlanId) {
    subscriptionService.updateSubscriptionPrice(price).catch(error => {
      sentryCaptureExceptions(error);
    });
  }
  return res.json({
    message: lang.updatePriceWebhook,
  });
};

export const incurAddonChargeOnSubscription = async (req, res) => {
  const soapBody = head(req.body['soapenv:Envelope']['soapenv:Body']);
  const notification = head(soapBody['notifications']);
  const innerNotify = head(notification['Notification']);
  const sobject = head(innerNotify['sObject']);
  const email = head(sobject['sf:Email__c']);
  const orderType = head(sobject['sf:Type']);
  try {
    await subscriptionService.addAddonChargeOnSubscription(email, orderType);
    res.set('Content-Type', 'application/xml');
    res.send(OUTBOUND_ACK_XML);
  } catch (err) {
    return res.status(err.http_status_code || StatusCodes.BAD_REQUEST).send(err.message);
  }
};
