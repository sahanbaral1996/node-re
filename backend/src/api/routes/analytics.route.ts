import { Router } from 'express';
import { celebrate, Segments } from 'celebrate';

import * as analytics from 'api/controllers/analytics.controller';
import { fbConversionAPIValidator } from 'api/validators/analytics.validator';

const publicAnalyticsRouter = Router();

export default (app: Router) => {
  app.use('/docentrx-fb', publicAnalyticsRouter);

  publicAnalyticsRouter.post(
    '/pixel',
    celebrate({ [Segments.BODY]: fbConversionAPIValidator }),
    analytics.fbPixelConversion
  );
};
