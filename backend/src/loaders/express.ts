import express from 'express';

import bodyParser from 'body-parser';
import bodyparserxml from 'body-parser-xml';
bodyparserxml(bodyParser);

import cors from 'cors';

import helmet from 'helmet';

import routes from 'api';

import config from 'config';

import { requestLogger, sentryLogger } from './logger';
import webhooks from 'webhooks';

import errorHandler from 'api/middlewares/errorHandlers';
import { errors } from 'celebrate';

export default ({ app }: { app: express.Application }) => {
  app.use(requestLogger());

  const Sentry = sentryLogger({ app });
  // RequestHandler creates a separate execution context using domains, so that every
  // transaction/span/breadcrumb is attached to its own Hub instance
  app.use(Sentry.Handlers.requestHandler());
  // TracingHandler creates a trace for every incoming request
  app.use(Sentry.Handlers.tracingHandler());

  /**
   * Health Check endpoints
   */
  app.get('/status', (req, res) => {
    return res.status(200).json({ success: true });
  });
  app.head('/status', (req, res) => {
    return res.status(200).end();
  });

  app.use(helmet());

  // The magic package that prevents frontend developers going nuts
  // Alternate description:
  // Enable Cross Origin Resource Sharing to all origins by default
  app.use(cors());

  // Middleware that transforms the raw string of req.body into json

  app.use(bodyParser.json());
  app.use(bodyParser.xml());
  // Load API routes
  app.use(config.api.prefix, routes());

  app.use(config.webhook.prefix, webhooks());

  // The error handler must be before any other error middleware and after all controllers
  app.use(Sentry.Handlers.errorHandler());

  // celebrate error handling
  app.use(errors());

  /// error handlers
  app.use(errorHandler);
};
