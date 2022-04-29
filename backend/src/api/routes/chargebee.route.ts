import { Router } from 'express';

import Validate from 'api/middlewares/Validate';

import authentication from 'api/middlewares/authentication';
import * as chargebeeController from 'api/controllers/chargebee.controller';
import * as chargbeeSubscriptionController from 'api/controllers/subscription.controller';
import { customerValidator, hostedPageValidator } from 'api/validators/chargebee.validator';

const route = Router();

export default (app: Router) => {
  app.use('/chargebee', route);

  route.post('/customer', Validate(customerValidator), chargebeeController.register);

  route.post('/generate-url', authentication, Validate(hostedPageValidator), chargebeeController.hostedPage);

  route.post('/customer-portal-session', authentication, chargebeeController.customerPortal);

  route.post('/reactivate-subscription', authentication, chargbeeSubscriptionController.reactivateSubscription);
};
