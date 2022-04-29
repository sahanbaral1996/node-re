import { Router } from 'express';

import account from './routes/account.route';
import customer from './routes/customer.route';
import chargebee from './routes/chargebee.route';
import lead from './routes/lead.route';
import authentication from './routes/authentication.route';
import person from './routes/person.route';
import analytics from './routes/analytics.route';
import admin from './routes/admin.route';

// guaranteed to get dependencies
export default () => {
  const app = Router();
  account(app);
  customer(app);
  chargebee(app);
  lead(app);
  authentication(app);
  person(app);
  analytics(app);
  admin(app);

  return app;
};
