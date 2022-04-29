import { head, compose, dissoc, map, prop } from 'ramda';

import { QueryResult, SalesforceId } from 'jsforce';

import ServerError from '../api/exceptions/ServerError';

import {
  addPrefixToFiles,
  getCamelCasedObject,
  getIndividualSkinConditions,
  getRecords,
} from '../helpers/salesforce.helpers';

import * as salesforceAccountService from './salesforce/account.service';
import * as salesforceDocumentService from './salesforce/document.service';

import { SELFIE_PREFIX, SHELFIE_PREFIX } from 'constants/salesforce/document.constants';

import { IAccAssessmentRecord } from 'types/salesforce/assessment.types';
import { IContentVersionPayload } from 'types/salesforce/document.types';

interface IUploadAttachments {
  selfies: Express.Multer.File[];
  shelfies: Express.Multer.File[];
  customerId: number;
}

export const uploadAttachments = async ({ selfies, shelfies, customerId }: IUploadAttachments) => {
  try {
    const contentVersionForSelfies: IContentVersionPayload[] = map(addPrefixToFiles(SELFIE_PREFIX), selfies);
    const contentVersionForShelfies: IContentVersionPayload[] = map(addPrefixToFiles(SHELFIE_PREFIX), shelfies);
    const contentVersionPayload = [...contentVersionForSelfies, ...contentVersionForShelfies];

    const accountResult = await salesforceAccountService.findAccountIdByCustomerId(customerId);
    const { Id: accountId } = compose<typeof accountResult, { Id: string }[], { Id: string }>(
      head,
      getRecords
    )(accountResult);

    const contentVersionRecords = await salesforceDocumentService.createContentVersions(contentVersionPayload);
    const contentVersionIds: SalesforceId[] = map(prop('id'), contentVersionRecords);
    const contentVersions = await salesforceDocumentService.findContentVersionsByIds(contentVersionIds);

    try {
      return await salesforceDocumentService.createContentDocumentLinks({ accountId, documents: contentVersions });
    } catch (error) {
      const contentVersionIds = contentVersions.map(({ id }) => id);
      await salesforceDocumentService.removeContentVersions(contentVersionIds);
      throw new Error('Failed at creating Content Document Links');
    }
  } catch (err) {
    throw new ServerError();
  }
};

/**
 * get AccountDetails
 *
 * @param {Object} req Request
 * @param {String} accountId id from salesforce
 */
export const getAccountDetails = async (accountId: string) => {
  try {
    const accountDetails: QueryResult<IAccAssessmentRecord> = await salesforceAccountService.getAccAssessment(
      accountId
    );

    const personAccount = compose<typeof accountDetails, IAccAssessmentRecord[], IAccAssessmentRecord>(
      head,
      getRecords
    )(accountDetails);

    const skinConditions = getIndividualSkinConditions(personAccount.Chief_Complaints__pc);

    if (!personAccount) {
      return {};
    }

    return {
      ...compose<typeof personAccount, Omit<IAccAssessmentRecord, 'attributes'>, any>(
        getCamelCasedObject,
        dissoc('attributes')
      )(personAccount),
      skinConditions,
    };
  } catch (err) {
    throw new ServerError(err);
  }
};

interface IUploadAttachment {
  prefix: typeof SELFIE_PREFIX | typeof SHELFIE_PREFIX;
  file: Express.Multer.File;
  accountId: string;
}

export const uploadAttachment = async ({ prefix, file, accountId }: IUploadAttachment) => {
  try {
    const prefixedFile = addPrefixToFiles(prefix, { originalname: file.originalname, buffer: file.buffer });
    const contentVersionRecord = await salesforceDocumentService.createContentVersion(prefixedFile);
    const contentVersion = await salesforceDocumentService.findContentVersionById(contentVersionRecord.id);

    try {
      await salesforceDocumentService.createContentDocumentLink({ accountId, document: contentVersion });

      // check if user uploaded shelfie
      if (prefix === SHELFIE_PREFIX) {
        await salesforceAccountService.updateAccount({ accountId: accountId, hasUploadedShelfie: true });
      }
    } catch (error) {
      salesforceDocumentService.removeContentVersion(contentVersion.id);
      throw new Error('Failed at creating Content Document Link');
    }
  } catch (error) {
    throw new ServerError();
  }
};

export const getSalesforceFile = async ({ prefix, file }: IUploadAttachment) => {
  try {
    const prefixedFile = addPrefixToFiles(prefix, file);

    const contentVersionRecord = await salesforceDocumentService.createContentVersion(prefixedFile);
    const contentVersion = await salesforceDocumentService.findContentVersionById(contentVersionRecord.id);

    return contentVersion;
  } catch (error) {
    throw new ServerError();
  }
};
