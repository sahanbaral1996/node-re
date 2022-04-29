import winston from 'winston';

import morgan from 'morgan';

import { Application } from 'express';

import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';

import config from '../config';

export const requestLogger = () => {
  if (process.env.NODE_ENV !== 'development') {
    return morgan('combined');
  } else {
    return morgan('dev');
  }
};

const transports: winston.transports.ConsoleTransportInstance[] = [];
if (process.env.NODE_ENV !== 'development') {
  transports.push(new winston.transports.Console());
} else {
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(winston.format.cli(), winston.format.splat()),
    })
  );
}

const LoggerInstance = winston.createLogger({
  level: config.logs.level,
  levels: winston.config.npm.levels,
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  transports,
});

export const sentryLogger = ({ app }: { app: Application }) => {
  Sentry.init({
    dsn: config.sentry.dsn,
    integrations: [
      // enable HTTP calls tracing
      new Sentry.Integrations.Http({ tracing: true }),
      // enable Express.js middleware tracing
      new Tracing.Integrations.Express({ app }),
    ],
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });

  return Sentry;
};

export const sentryCustomLogger = (message: string) => {
  Sentry.captureMessage(message);
};

export const sentryCaptureExceptions = Sentry.captureException;

export default LoggerInstance;
