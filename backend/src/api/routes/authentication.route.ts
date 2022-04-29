import { Router } from 'express';
import { celebrate, Segments } from 'celebrate';

import * as authController from 'api/controllers/authentication.controller';
import { authenticationIssueValidator } from 'api/validators/authentication.validator';

const publicAuthenticationRouter = Router();

export default (app: Router) => {
  app.use('/authentication', publicAuthenticationRouter);

  publicAuthenticationRouter.get(
    '/error',
    celebrate({ [Segments.QUERY]: authenticationIssueValidator }),
    authController.checkAuthIssue
  );
};
