import React from 'react';

import ReveaInput from 'components/common/ReveaInput';
import Button from 'components/common/button';

import { en } from 'constants/lang';
import { ICouponFormValuesProps } from 'types/subscription';

const { subscription } = en;

const Coupon: React.FC<ICouponFormValuesProps> = ({ formik, isLoaded, isAdmin }) => {
  const [coupon, setCoupon] = React.useState<string>('');

  const handleCouponApply = () => {
    if (formik.values.coupon !== coupon) {
      formik.setFieldValue('coupon', coupon);
      formik.setFieldTouched('coupon', true);
    }
  };

  const handleCouponCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const couponId = event.currentTarget.value;

    setCoupon(couponId);
  };

  const handleRemoveCoupon = () => {
    setCoupon('');
    formik.setFieldValue('coupon', '');
  };

  return (
    <div className={isAdmin ? 'mb-8x' : 'mb-4x'}>
      {formik.values.coupon && isLoaded && !formik.errors.coupon ? (
        <div>
          <span>{subscription.FORM.COUPON.APPLIED_COUPON_HEADER} </span>
          <b>{coupon}</b>
          <button className="btn-link ml-2x" onClick={handleRemoveCoupon}>
            {subscription.FORM.COUPON.REMOVE_BUTTON_LABEL}
          </button>
        </div>
      ) : (
        <>
          <div className="coupon-header mb-4x">
            <b>{subscription.FORM.COUPON.HEADER}</b>
          </div>
          <div className="mb-4x">
            <ReveaInput
              disabled={!isLoaded}
              name="coupon"
              label={subscription.FORM.COUPON.LABEL}
              onChange={handleCouponCodeChange}
              value={coupon}
              errorMessage={formik.errors.coupon && formik.touched.coupon ? formik.errors.coupon : ''}
              placeholder={subscription.FORM.COUPON.PLACEHOLDER}
            />
          </div>
          <Button
            loading={!isLoaded && !!formik.values.coupon}
            disabled={!isLoaded}
            type="button"
            color="quinary"
            onClick={handleCouponApply}
            title={subscription.FORM.COUPON.BUTTON_LABEL}
          />
        </>
      )}
    </div>
  );
};

export default Coupon;
