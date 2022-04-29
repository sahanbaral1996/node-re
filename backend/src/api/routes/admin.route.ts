import { celebrate, Segments } from 'celebrate';
import { Router } from 'express';

import authentication from 'api/middlewares/authentication';

import * as personController from 'api/controllers/person.controller';
import * as leadController from 'api/controllers/lead.controller';
import * as userController from 'api/controllers/user.controller';

import { createPersonByAdminValidator } from 'api/validators/person.validator';
import { createLeadByAdminValidator } from 'api/validators/lead.validator';
import { createUserValidator } from 'api/validators/user.validator';
import { isAuthorizedAdmin } from 'api/middlewares/authorization';

const privateAuthenticationRouter = Router();
const publicRouter = Router();

export default (app: Router) => {
  app.use('/admin', publicRouter);

  app.use('/admin', authentication, isAuthorizedAdmin, privateAuthenticationRouter);

  privateAuthenticationRouter.post(
    '/person',
    celebrate({ [Segments.BODY]: createPersonByAdminValidator }),
    personController.createPersonByAdmin
  );

  privateAuthenticationRouter.post(
    '/lead',
    celebrate({ [Segments.BODY]: createLeadByAdminValidator }),
    leadController.createLeadByAdmin
  );

  privateAuthenticationRouter.put(
    '/lead/:leadId',
    celebrate({ [Segments.BODY]: createLeadByAdminValidator }),
    leadController.updateLeadByAdmin
  );

  privateAuthenticationRouter.get('/lead/:leadId', leadController.fetchLeadByAdmin);
  // do not push this public api to production
  publicRouter.post('/user', celebrate({ [Segments.BODY]: createUserValidator }), userController.createUserByAdmin);
};
