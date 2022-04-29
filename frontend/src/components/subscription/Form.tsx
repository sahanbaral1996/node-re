import * as React from 'react';

import { ISubscriptionFormProps } from 'types/subscription';

import Button from 'components/common/button';
import FormElements from './FormElements';

import { en } from 'constants/lang';
import Coupon from './Coupon';

const { FORM } = en.subscription;

const SubscriptionForm: React.FC<ISubscriptionFormProps> = ({
  isInitialized,
  formik,
  cardRef,
  handleCardLoaded,
  isCardLoaded,
  isEstimatesLoaded,
  onBack,
}) => {
  return isInitialized ? (
    <form onSubmit={formik.handleSubmit} className="subscription-form">
      <div className="row">
        <div className="col-12-md">
          <FormElements formik={formik} cardRef={cardRef} handleCardLoaded={handleCardLoaded} />
        </div>
      </div>
      <div className="row">
        <div className={formik.values.coupon ? 'col-12-md' : 'col-6-md'}>
          <Coupon formik={formik} isLoaded={isEstimatesLoaded} />
        </div>
      </div>
      <div className="row mt-6x">
        <div className="col-12-md mb-4x">
          <Button
            type="submit"
            title={FORM.SUBMIT_BUTTON_LABEL}
            loading={formik.isSubmitting}
            fullWidth
            disabled={!isCardLoaded || !isEstimatesLoaded || formik.isSubmitting}
          />
          <Button
            type="button"
            title="Back to product customization"
            loading={formik.isSubmitting}
            fullWidth
            color="transparent"
            onClick={onBack}
            disabled={!isCardLoaded || !isEstimatesLoaded || formik.isSubmitting}
          />
        </div>
      </div>
    </form>
  ) : null;
};

export default SubscriptionForm;
