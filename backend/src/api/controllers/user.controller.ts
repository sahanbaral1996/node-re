import { Request } from 'express';
import { StatusCodes } from 'http-status-codes';

import * as userService from 'services/user.service';

export const createUserByAdmin = async (req: Request, res, next) => {
  try {
    const data = await userService.createUserByAdmin(req.body);
    return res.json({
      code: StatusCodes.OK,
      data,
    });
  } catch (error) {
    next(error);
  }
};
