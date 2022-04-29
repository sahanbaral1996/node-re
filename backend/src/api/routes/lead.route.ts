import { Router } from 'express';

import * as leadController from 'api/controllers/lead.controller';

import { celebrate, Segments } from 'celebrate';

import { createLeadValidator } from 'api/validators/lead.validator';

const publicLeadsRouter = Router();

export default (app: Router) => {
  app.use('/leads', publicLeadsRouter);

  publicLeadsRouter.post('/', celebrate({ [Segments.BODY]: createLeadValidator }), leadController.createLead);
};
