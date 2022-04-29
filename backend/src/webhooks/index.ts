import { Router } from 'express';
import chargebee from './routes/chargebee.route';
import salesforce from './routes/salesforce.route';

// guaranteed to get dependencies
export default () => {
  const webhooks = Router();

  chargebee(webhooks);
  salesforce(webhooks);

  return webhooks;
};
