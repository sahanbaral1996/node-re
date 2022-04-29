export interface IAddonOrderConfig {
  Add_On_Configuration__c: string;
  Person__c: string;
}
interface IPhotos {
  srcUrl: string;
  createdDate: string;
  contentDocumentId: string;
  id: string;
}
export interface IAddonOrder {
  name: string;
  description: string;
  isActive: boolean;
  standardPrice: number;
  trialPrice: number;
  productCategory: string;
  photos?: IPhotos;
}
