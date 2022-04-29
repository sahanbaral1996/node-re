import * as assessmentService from 'services/assessment.service';
import { StatusCodes } from 'http-status-codes';

import { Request } from 'express';

export const createAssessment = async (req: Request, res, next) => {
  try {
    const { salesforceReferenceId: accountId } = req.currentUser;
    const assessment = req.body;
    const response = await assessmentService.createAssessment(accountId, assessment);
    res.json({
      code: StatusCodes.OK,
      response,
    });
  } catch (error) {
    next(error);
  }
};
