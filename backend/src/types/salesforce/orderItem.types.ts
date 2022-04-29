import { IOrder } from './order.types';

enum ProductFamilies {
  Prescription = 'Prescriptions',
  Wash = 'Washes',
}

export interface IOrderItem {
  fullName: string;
  morningEvening: string;
  order: Partial<IOrder>;
  applicationInstructions: string;
  orderId: string;
  productFamily: ProductFamilies;
}
