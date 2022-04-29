import { CONTENT_VERSION_VISIBILITY } from 'constants/salesforce/document.constants';

export interface IContentDocumentLink {
  id: string;
  contentDocumentId: string;
}

export interface IContentVersion {
  id: string;
  srcUrl: string;
  contentDocumentId: string;
  createdDate: string;
}

export interface IContentVersionPayload {
  prefixedFileName: string;
  body: string;
}

export interface IContentVersionRecord {
  ContentLocation: 'S';
  PathOnClient: string;
  Title: string;
  Re_Assessment__c?: boolean;
  Assessment__c?: boolean;
  VersionData: string;
}

export interface IContentDocumentLinkDetail {
  ContentDocumentId: string;
  LinkedEntityId: string;
  Re_Assessment__c?: boolean;
  Visibility: typeof CONTENT_VERSION_VISIBILITY;
}
