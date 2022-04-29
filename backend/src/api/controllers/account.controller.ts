import { Request } from 'express';
import { StatusCodes } from 'http-status-codes';

import lang from 'lang';

import * as accountService from 'services/account.service';
import { updateAccount } from 'services/salesforce/account.service';
import * as salesforceDocumentService from 'services/salesforce/document.service';

import APIError from 'api/exceptions/Error';

/**
 * Upload Attachments
 *
 * @param {Object} req Request
 * @param {Object} res Response
 */
export const uploadAttachments = async (req, res, next) => {
  try {
    const { selfies = [], shelfies = [] } = req.files;

    const { id: customerId } = req.params;

    await accountService.uploadAttachments({ shelfies, selfies, customerId });

    res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      message: lang.uploadedSuccessfully,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get accountDetails.
 *
 * @param {*} req
 * @param {*} res
 * @param {Function} next
 */
export const getAccountDetails = async (req: Request, res, next) => {
  try {
    if (req.currentUser) {
      const { salesforceReferenceId: accountId } = req.currentUser;

      const person = await accountService.getAccountDetails(accountId);

      return res.status(StatusCodes.OK).json({
        code: StatusCodes.OK,
        data: person,
      });
    } else {
      throw new APIError('Not authorized');
    }
  } catch (err) {
    next(err);
  }
};

// @TODO: deprecate in favor of attachmentUpload
export const uploadAttachment = async (req: Request, res, next) => {
  try {
    if (req.currentUser) {
      const {
        body: { prefix },
        file,
      } = req;
      const { salesforceReferenceId: accountId } = req.currentUser;
      await accountService.uploadAttachment({ prefix, accountId: accountId, file });

      return res.status(StatusCodes.OK).json({
        code: StatusCodes.OK,
        message: lang.uploadedSuccessfully,
      });
    }
    throw new APIError(StatusCodes.UNAUTHORIZED);
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req: Request, res, next) => {
  try {
    if (req.currentUser) {
      const {
        body: { status },
      } = req;
      const { salesforceReferenceId: accountId } = req.currentUser;

      await updateAccount({ accountId, status });

      return res.status(StatusCodes.OK).json({
        code: StatusCodes.OK,
        message: lang.updateStatus,
      });
    }
    throw new APIError(StatusCodes.UNAUTHORIZED);
  } catch (error) {
    next(error);
  }
};

/**
 * Upload Attachment
 *
 * @param {Object} req Request
 * @param {Object} res Response
 */

export const attachmentUpload = async (req: Request, res, next) => {
  try {
    if (req.currentUser) {
      const {
        body: { prefix },
        file,
      } = req;
      const { salesforceReferenceId: accountId } = req.currentUser;

      const { contentDocumentId } = await accountService.getSalesforceFile({
        prefix,
        accountId,
        file,
      });

      return res.status(StatusCodes.OK).json({
        code: StatusCodes.OK,
        message: lang.uploadedSuccessfully,
        salesForceContentDocumentId: contentDocumentId,
      });
    }
    throw new APIError(StatusCodes.UNAUTHORIZED);
  } catch (error) {
    next(error);
  }
};

/**
 * Attach Photo
 *
 * @param {Object} req Request
 * @param {Object} res Response
 */

export const attachImages = async (req: Request, res, next) => {
  try {
    if (req.currentUser) {
      const {
        body: { selfies },
      } = req;
      const { salesforceReferenceId: accountId } = req.currentUser;

      await salesforceDocumentService.linkMultipleDocuments({
        accountId,
        documentIds: selfies,
      });

      return res.json({
        code: StatusCodes.OK,
        message: lang.photoAttachmentSuccess,
      });
    }
    throw new APIError(StatusCodes.UNAUTHORIZED);
  } catch (error) {
    next(error);
  }
};
