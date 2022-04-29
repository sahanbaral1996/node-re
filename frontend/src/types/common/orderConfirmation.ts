import React from 'react';
import { IOrderReview } from 'types/orderReview';
import { EditDialogForm } from 'types/orderReviews';

export interface IOrderConfirmation {
  approveOrder: () => Promise<void>;
  approveLoading: boolean;
  setIsEditDialogOpen: (value: React.SetStateAction<boolean>) => void;
  isOrderReviewEditAllowed: boolean;
  isEditDialogOpen: boolean;
  review: IOrderReview;
  isUpdatingOrder: boolean;
  sendToRevea: (values: EditDialogForm) => Promise<void>;
}
