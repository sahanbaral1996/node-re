import { IPhotos } from './plan';

export interface IAddonOrder {
  name: string;
  description: string;
  isActive: boolean;
  id: string;
  standardPrice: number;
  trialPrice: number;
  standardAddOnId: string;
  trialAddOnId: string;
  productCategory: string;
  isSelected: boolean;
  photos?: IPhotos;
  addOnConfiguration: string;
}

export type productCategory = 'Wash' | 'Moisturizer' | 'Boost' | 'SpotTreatment';
