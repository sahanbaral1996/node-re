import { Router } from 'express';
import * as salController from 'webhooks/controller/Salesforce.controller';

const route = Router();

export default (webhook: Router) => {
  webhook.use('/salesforce', route);
  webhook.post('/salesforce/createBillingOrder', salController.createBillingOrder);
  webhook.post('/salesforce/updateAddress', salController.updateBillingAndShippingInfo);
  webhook.post('/salesforce/updatePaymentStatus', salController.updatePaymentStatus);
  webhook.post('/salesforce/subscriptionChanged', salController.subscriptionChanged);
};
