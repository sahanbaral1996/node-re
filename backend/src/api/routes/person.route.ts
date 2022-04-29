import { celebrate, Segments } from 'celebrate';
import { Router } from 'express';

import authentication from 'api/middlewares/authentication';
import * as personController from 'api/controllers/person.controller';
import { createPersonValidator } from 'api/validators/person.validator';

const privateAuthenticationRouter = Router();

export default (app: Router) => {
  app.use('/person', authentication, privateAuthenticationRouter);

  privateAuthenticationRouter.post(
    '/',
    celebrate({ [Segments.BODY]: createPersonValidator }),
    personController.createPerson
  );
};
