import { Router } from 'express';
import * as chargebeeController from 'webhooks/controller/chargebee.controller';

const route = Router();

export default (webhook: Router) => {
  webhook.use('/chargebee', route);

  route.post('/customer/Order/reactivate', chargebeeController.reactivateSubscription);

  /**
   * add this to chargebee webhook to migrate price for existing subscriptions
   * remove from chargebee webhook when migration is complete
   *  */
  route.post('/customer/subscription/price', chargebeeController.updatePlanForSubscription);

  /**
   * This webhook incurs a addon for oral meds if prescribed by dermatologists
   */
  route.post('/customer/subscription/adddon', chargebeeController.incurAddonChargeOnSubscription);
};
