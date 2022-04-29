import { Router } from 'express';

import multer from 'multer';
import { celebrate, Segments } from 'celebrate';

import authentication from 'api/middlewares/authentication';
import * as accountController from 'api/controllers/account.controller';

import {
  attachImageValidator,
  uploadAttachmentBodyValidator,
  uploadAttachmentParamValidator,
} from 'api/validators/account.validator';

const route = Router();

const upload = multer({});

export default (app: Router) => {
  app.use('/account', route);

  route.post(
    '/:id/upload-attachments',
    upload.fields([
      {
        name: 'selfies',
        maxCount: 5,
      },
      {
        name: 'shelfies',
        maxCount: 5,
      },
    ]),
    celebrate({
      [Segments.PARAMS]: uploadAttachmentParamValidator,
    }),
    accountController.uploadAttachments
  );

  route.post(
    '/upload-attachment',
    authentication,
    upload.single('attachment'),
    celebrate({
      [Segments.BODY]: uploadAttachmentBodyValidator,
    }),
    accountController.uploadAttachment
  );

  route.post(
    '/attachment',
    authentication,
    upload.single('attachment'),
    celebrate({
      [Segments.BODY]: uploadAttachmentBodyValidator,
    }),
    accountController.attachmentUpload
  );

  route.post(
    '/attach-photo',
    authentication,
    celebrate({
      [Segments.BODY]: attachImageValidator,
    }),
    accountController.attachImages
  );

  route.get('/detail', authentication, accountController.getAccountDetails);

  route.post('/status', authentication, accountController.updateStatus);
};
