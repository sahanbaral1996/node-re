import APIError from 'api/exceptions/Error';
import OperationException from 'api/exceptions/OperationException';
import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import winston from 'winston';
import container from 'container';
import { LOGGER_TOKEN } from 'constants/app.constants';
import SubscriptionException from 'api/exceptions/SubscriptionException';
import AlreadyExistsException from 'api/exceptions/AlreadyExistsException';

/*eslint-disable */
const errorHandler: ErrorRequestHandler = (err: APIError, req: Request, res: Response, next: NextFunction) => {
  const logger: winston.Logger = container.resolve(LOGGER_TOKEN);
  logger.error(err.stack);
  if (err instanceof OperationException) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      message: `${err.message}`,
      operation: {
        object: err.object,
        type: err.operation,
      },
    });
  } else if (err instanceof SubscriptionException) {
    return res.status(err.code || StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: err.code || StatusCodes.INTERNAL_SERVER_ERROR,
      message: err.message,
      operation: err.operation,
    });
  } else if (err instanceof AlreadyExistsException) {
    return res.status(StatusCodes.CONFLICT).json({
      code: StatusCodes.CONFLICT,
      message: err.message,
      object: err.object,
    });
  }

  return res
    .status(err.code || StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ code: err.code || StatusCodes.INTERNAL_SERVER_ERROR, message: err.message });
};

export default errorHandler;
