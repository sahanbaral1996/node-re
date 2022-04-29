import APIError from 'api/exceptions/Error';
import { NextFunction, Request, Response } from 'express';

import { StatusCodes } from 'http-status-codes';

import * as analyticsService from 'services/analytics.service';

export const fbPixelConversion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { remoteAddress } = req.connection;
    const { ['user-agent']: userAgent } = req.headers;
    const pixelPayload = req.body;

    if (!remoteAddress && !userAgent) {
      throw new APIError('Bad request', StatusCodes.BAD_REQUEST);
    }

    const data = await analyticsService.fbPixelConversion(pixelPayload, remoteAddress, userAgent);

    return res.status(StatusCodes.OK).json({
      data,
    });
  } catch (error) {
    next(error);
  }
};
