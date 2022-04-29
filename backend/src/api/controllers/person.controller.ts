import * as personService from 'services/person.service';

import { Request } from 'express';
import { StatusCodes } from 'http-status-codes';
import lang from 'lang';

export const createPerson = async (req: Request, res, next) => {
  try {
    const { email, salesforceReferenceId: leadId } = req.currentUser;
    const assessment = req.body;
    const userDetails = {
      email,
      leadId,
      assessment,
    };

    const personData = await personService.createPerson(userDetails);

    res.json({ data: personData });
  } catch (error) {
    next(error);
  }
};

export const createPersonByAdmin = async (req: Request, res, next) => {
  try {
    await personService.createPersonByAdmin(req.body);
    res.json({
      code: StatusCodes.OK,
      message: lang.createPersonByAdminSuccess,
    });
  } catch (error) {
    next(error);
  }
};
