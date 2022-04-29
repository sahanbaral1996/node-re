import AlreadyExistsException from 'api/exceptions/AlreadyExistsException';
import ConstraintViolationException from 'api/exceptions/ConstraintViolationException';
import APIError from 'api/exceptions/Error';
import { Request } from 'express';

import { StatusCodes } from 'http-status-codes';
import * as validationService from 'services/validation.service';

export const validateCustomer = async (req: Request, res, next) => {
  try {
    await validationService.validateCustomer(req.query);

    return res.status(StatusCodes.OK).send();
  } catch (error) {
    if (error instanceof ConstraintViolationException) {
      next(new APIError(error.message, StatusCodes.NOT_ACCEPTABLE));
    } else if (error instanceof AlreadyExistsException) {
      next(new APIError(error.message, StatusCodes.CONFLICT));
    }
    next(error);
  }
};
