import { StatusCodes } from 'http-status-codes';

import APIError from 'api/exceptions/Error';

import { NextFunction, Request, Response } from 'express';

import lang from 'lang';
import { ADMIN_USER_GROUP } from 'constants/cognito.constants';

function isAuthorized(req: Request, res: Response, next: NextFunction) {
  const currentUser = req.currentUser;
  const customerId = currentUser.id;

  if (req.params.customerId === customerId) {
    return next();
  }
  return next(new APIError(lang.invalidToken, StatusCodes.UNAUTHORIZED));
}

export function isAuthorizedAdmin(req: Request, res: Response, next: NextFunction) {
  const currentUser = req.currentUser;

  if (currentUser.groups.length === 1 && currentUser.groups.includes(ADMIN_USER_GROUP)) {
    return next();
  }

  return next(new APIError(lang.invalidToken, StatusCodes.UNAUTHORIZED));
}

export default isAuthorized;
