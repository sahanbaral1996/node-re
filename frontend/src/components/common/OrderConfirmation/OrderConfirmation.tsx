import React from 'react';

import { en } from 'constants/lang';
import Button from 'components/common/button';
import { IOrderConfirmation } from 'types/common/orderConfirmation';

const OrderConfirmation: React.FC<IOrderConfirmation> = ({
  approveOrder,
  approveLoading,
  review,
  setIsEditDialogOpen,
  isOrderReviewEditAllowed,
}) => {
  return (
    <div className={'container'}>
      <div className={'confirmation__wrapper row'}>
        <div className={'confirmation__body col-12-sm col-6-md'}>
          <h3 className="confirmation__title">{en.orderReview.CONFIRMATION_TITLE}</h3>
          <div className="confirmation__detail">{en.orderReview.CONFIRMATION_DETAIL}</div>
        </div>

        <div className={'confirmation__bottom col-12-sm col-6-md'}>
          <div className="order-review__bottom-wrapper d-flex flex-column flex-row-xl">
            <Button
              onClick={() => {
                approveOrder();
              }}
              loading={approveLoading}
              color="quaternary"
              className="btn-primary"
            >
              <span>{en.orderReview.ACCEPT}</span>
            </Button>
            <Button
              onClick={() => {
                setIsEditDialogOpen(true);
              }}
              disabled={!isOrderReviewEditAllowed}
              color="secondary"
              className="ml-2x-xl mt-2x mt-0x-xl"
            >
              <span>{en.orderReview.MAKE_EDITS}</span>
            </Button>
          </div>
          {isOrderReviewEditAllowed || review.orderReviewDetails.status === '' ? null : (
            <div className="order-review-status__on-hold">
              {`${en.orderReview.NO_EDIT_MSG1} ${review.orderReviewDetails.status.toLowerCase()}. ${
                en.orderReview.NO_EDIT_MSG2
              }`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
