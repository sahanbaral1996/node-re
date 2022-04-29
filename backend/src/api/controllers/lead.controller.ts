import { NextFunction, Request, Response } from 'express';

import { StatusCodes } from 'http-status-codes';

import lang from 'lang';

import * as leadService from 'services/lead.service';

export const createLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const leadDetails = req.body;

    const data = await leadService.createLead(leadDetails);

    return res.status(StatusCodes.OK).json({
      message: lang.leadCreated,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const createLeadByAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const leadDetails = req.body;

    const data = await leadService.createLeadByAdmin(leadDetails);

    return res.json({
      code: StatusCodes.OK,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const updateLeadByAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const leadDetails = req.body;
    const { leadId } = req.params;

    const data = await leadService.updateLead(leadId, leadDetails);

    return res.json({
      code: StatusCodes.OK,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const fetchLeadByAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { leadId } = req.params;

    const data = await leadService.findLeadById(leadId);

    return res.json({
      code: StatusCodes.OK,
      data,
    });
  } catch (error) {
    next(error);
  }
};
