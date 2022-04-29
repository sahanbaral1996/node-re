import { IAddonOrder, productCategory } from './shoppingCart';

export interface IAdminLead {
  email: string;
  name: string;
  attributes: { type: string; url: string };
  dOB: string;
  firstName: string;
  homeState: string;
  iagreetoNoPPandTOA: boolean;
  iagreetoreceivefrequentmarketing: boolean;
  id: string;
  lastName: string;
  phone: string;
  status: string;
}

export interface IAdminProductSelectionProps {
  setOrders: (order: IAddonOrder[]) => void;
  orders: IAddonOrder[];
  isAddonLoaded: boolean;
  addonConfigurations: Record<productCategory, IAddonOrder[]>;
}
