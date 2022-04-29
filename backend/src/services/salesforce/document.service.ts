import { head, map } from 'ramda';

import { format } from 'date-fns';

import { Connection, ErrorResult, RecordResult, SalesforceId, SuccessResult } from 'jsforce';

import { getCamelCasedObject } from 'helpers/salesforce.helpers';

import {
  IContentDocumentLink,
  IContentVersion,
  IContentVersionPayload,
  IContentVersionRecord,
  IContentDocumentLinkDetail,
} from 'types/salesforce/document.types';

import container from 'container';

import { CONTENT_VERSION_VISIBILITY } from 'constants/salesforce/document.constants';
import OperationException from 'api/exceptions/OperationException';
import { SALESFORCE_TOKEN } from 'constants/app.constants';
import {
  CONTENT_DOCUMENT_LINK,
  CONTENT_VERSION,
  CREATE_OPERATION,
  DELETE_OPERATION,
} from 'constants/salesforce/common.constants';

export const createContentVersions = async (contentVersionDetailList: IContentVersionPayload[]) => {
  const salesforceConnection: Connection = container.resolve(SALESFORCE_TOKEN);

  const contentVersionObjects: IContentVersionRecord[] = map(
    ({ prefixedFileName, body }) => ({
      ContentLocation: 'S',
      PathOnClient: prefixedFileName,
      Assessment__c: true,
      Title: prefixedFileName,
      VersionData: body,
    }),
    contentVersionDetailList
  );

  const recordResults: RecordResult[] = await salesforceConnection
    .sobject<IContentVersionRecord>(CONTENT_VERSION)
    .create(contentVersionObjects, { allOrNone: true });

  const firstResult = head(recordResults);

  if (!firstResult || !firstResult.success) {
    throw new OperationException(firstResult?.errors, CONTENT_VERSION, CREATE_OPERATION);
  }

  return recordResults as SuccessResult[];
};

/**
 * Get Content Version
 *
 * @param {String} id
 */
export const findContentVersionById = async (id: string): Promise<IContentVersion> => {
  const salesforceConnection: Connection = container.resolve(SALESFORCE_TOKEN);

  const contentVersion = await salesforceConnection.sobject(CONTENT_VERSION).retrieve(id);

  return getCamelCasedObject(contentVersion);
};

export const createContentDocumentLinks = async ({
  accountId,
  documents,
}: {
  accountId: string;
  documents: IContentVersion[];
}) => {
  const salesforceConnection: Connection = container.resolve(SALESFORCE_TOKEN);

  const contentDocumentLinkDetailList: IContentDocumentLinkDetail[] = documents.map(({ contentDocumentId }) => ({
    ContentDocumentId: contentDocumentId,
    LinkedEntityId: accountId,
    Visibility: CONTENT_VERSION_VISIBILITY,
  }));

  const contentDocumentLink = await salesforceConnection
    .sobject(CONTENT_DOCUMENT_LINK)
    .create(contentDocumentLinkDetailList);

  if (!contentDocumentLink.success) {
    throw new OperationException(contentDocumentLink.errors, CONTENT_DOCUMENT_LINK, CREATE_OPERATION);
  }

  return contentDocumentLink;
};

/**
 *
 * @param {String} accountId
 */
const findContentDocumentLinkByLinkedEntityId = async (accountId): Promise<IContentDocumentLink[]> => {
  const salesforceConnection: Connection = container.resolve(SALESFORCE_TOKEN);

  const response = await salesforceConnection.sobject(CONTENT_DOCUMENT_LINK).find({
    LinkedEntityId: accountId,
  });

  return map(getCamelCasedObject, response);
};

/**
 *
 * @param {Object} params
 * @param {String} accountId
 * @param {String} prefix
 */
export const findAllContentVersions = async ({ accountId, prefix }): Promise<IContentVersion[]> => {
  const salesforceConnection: Connection = container.resolve(SALESFORCE_TOKEN);

  const contentDocumentLinks = await findContentDocumentLinkByLinkedEntityId(accountId);

  const contentDocumentIds = map(({ contentDocumentId }) => contentDocumentId, contentDocumentLinks);

  if (contentDocumentIds.length) {
    const contentVersions = await salesforceConnection
      .sobject(CONTENT_VERSION)
      .find({
        ContentDocumentId: { $in: contentDocumentIds },
        Title: { $like: `${prefix}-%` },
      })
      .sort({
        CreatedDate: 1,
      });

    return map(getCamelCasedObject, contentVersions);
  }

  return [];
};

/**
 * @param {String} arg.accountId
 * @param {Number} arg.startDate
 * @param {Number} arg.endDate
 */
export const findContentVersionsInRange = async ({ accountId, startDate, endDate, prefix }) => {
  const salesforceConnection: Connection = container.resolve(SALESFORCE_TOKEN);

  const contentDocumentLinks = await findContentDocumentLinkByLinkedEntityId(accountId);

  const contentDocumentIds = map(({ contentDocumentId }) => contentDocumentId, contentDocumentLinks);

  const startDateTime = format(Number.parseInt(startDate, 10), "yyyy-MM-dd'T'HH:mm:ss");
  const endDateTime = format(Number.parseInt(endDate, 10), "yyyy-MM-dd'T'HH:mm:ss");

  if (contentDocumentIds.length) {
    const contentVersions = await salesforceConnection
      .sobject(CONTENT_VERSION)
      .find({
        ContentDocumentId: { $in: contentDocumentIds },
        Title: { $like: `${prefix}-%` },
        CreatedDate: { $gte: startDateTime, $lte: endDateTime },
      })
      .sort({
        CreatedDate: 1,
      });

    return contentVersions;
  }

  return [];
};

export const findContentVersionsByIds = async function (ids: SalesforceId[]) {
  const salesforceConnection: Connection = container.resolve(SALESFORCE_TOKEN);

  const contentVersions = await salesforceConnection.sobject<IContentVersion>(CONTENT_VERSION).retrieve(ids);

  return map(getCamelCasedObject, contentVersions);
};

export const createContentVersion = async ({ prefixedFileName, body }: IContentVersionPayload) => {
  const salesforceConnection: Connection = container.resolve(SALESFORCE_TOKEN);

  const recordResult: RecordResult = await salesforceConnection.sobject<IContentVersionRecord>(CONTENT_VERSION).create({
    ContentLocation: 'S',
    PathOnClient: prefixedFileName,
    Title: prefixedFileName,
    Re_Assessment__c: true,
    VersionData: body,
  });

  if (!recordResult.success) {
    throw new OperationException(recordResult.errors, CONTENT_VERSION, CREATE_OPERATION);
  }

  return recordResult;
};

export const createContentDocumentLink = async ({
  accountId,
  document,
}: {
  accountId: string;
  document: IContentVersion;
}) => {
  const salesforceConnection: Connection = container.resolve(SALESFORCE_TOKEN);

  const recordResult = await salesforceConnection.sobject(CONTENT_DOCUMENT_LINK).create({
    ContentDocumentId: document.contentDocumentId,
    LinkedEntityId: accountId,
    Visibility: CONTENT_VERSION_VISIBILITY,
  });

  if (!recordResult.success) {
    throw new OperationException(recordResult.errors, CONTENT_DOCUMENT_LINK, CREATE_OPERATION);
  }

  return recordResult;
};

export const removeContentVersion = async (contentVersionId: SalesforceId) => {
  const salesforceConnection: Connection = container.resolve(SALESFORCE_TOKEN);

  const result = await salesforceConnection.sobject(CONTENT_VERSION).delete(contentVersionId);

  if (!result.success) {
    throw new OperationException(result.errors, CONTENT_VERSION, DELETE_OPERATION);
  }

  return result;
};

export const removeContentVersions = async (contentVersionIds: SalesforceId[]) => {
  const salesforceConnection: Connection = container.resolve(SALESFORCE_TOKEN);

  const recordResults = await salesforceConnection.sobject(CONTENT_VERSION).delete(contentVersionIds);

  const successfulResults: SuccessResult[] = [];

  const errorResults: ErrorResult[] = [];

  for (const result of recordResults) {
    if (result.success) {
      successfulResults.push(result);
    } else {
      errorResults.push(result);
    }
  }

  if (errorResults.length) {
    throw new OperationException(errorResults[0].errors, CONTENT_VERSION, DELETE_OPERATION);
  }

  return successfulResults;
};

export const linkMultipleDocuments = async ({
  accountId,
  documentIds,
}: {
  accountId: string;
  documentIds: string[];
}) => {
  const salesforceConnection: Connection = container.resolve(SALESFORCE_TOKEN);

  const linkRequests: IContentDocumentLinkDetail[] = documentIds.map(id => ({
    ContentDocumentId: id,
    LinkedEntityId: accountId,
    Visibility: CONTENT_VERSION_VISIBILITY,
  }));

  const recordResults = await salesforceConnection
    .sobject<IContentDocumentLinkDetail>(CONTENT_DOCUMENT_LINK)
    .create(linkRequests, { allOrNone: true });

  const [firstRecordResult] = recordResults;

  if (firstRecordResult && !firstRecordResult.success) {
    throw new OperationException(firstRecordResult.errors, CONTENT_DOCUMENT_LINK, CREATE_OPERATION);
  }

  return recordResults;
};

/**
 *  Fetch addon images
 * @param {String[]} addonIds
 */
export const findAddonImages = async (addonIds: string[]): Promise<IContentVersion[]> => {
  const salesforceConnection: Connection = container.resolve(SALESFORCE_TOKEN);

  const contentVersions = await salesforceConnection
    .sobject(CONTENT_VERSION)
    .find({
      firstPublishLocationId: { $in: addonIds },
    })
    .sort({
      CreatedDate: 1,
    });

  return map(getCamelCasedObject, contentVersions);
};
