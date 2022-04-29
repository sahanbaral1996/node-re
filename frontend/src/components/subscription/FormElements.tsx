import * as React from 'react';

import Address from './Address';

import { US_STATE_OPTIONS } from 'constants/appConstants';
import Card from './Card';
import { ISubscriptionFormElementsProps } from 'types/subscription';
import ReveaCheckbox from 'components/common/ReveaCheckbox';

import { en } from 'constants/lang';
import ReveaInput from 'components/common/ReveaInput';

const { ADDRESS, BILLING_ADDRESS_HEADER, SHIPPING_ADDRESS_HEADER, CREDIT_CARD_HEADER, PHONE } = en.subscription.FORM;

const SHIPPING_STATE_OPTIONS = US_STATE_OPTIONS.filter(state => state.isAvailable);

const FormElements: React.FC<ISubscriptionFormElementsProps> = ({ formik, cardRef, handleCardLoaded }) => {
  return (
    <>
      <h3 className="mb-4x form-element-header">{SHIPPING_ADDRESS_HEADER}</h3>
      <Address
        handleChange={formik.handleChange}
        values={formik.values.shippingAddress}
        stateOptions={SHIPPING_STATE_OPTIONS}
        prefix="shippingAddress"
        errors={formik.errors.shippingAddress}
        touched={formik.touched.shippingAddress}
      />
      <ReveaCheckbox
        name="isSameAsShippingAddress"
        onChange={formik.handleChange}
        checked={formik.values.isSameAsShippingAddress}
        label={ADDRESS.BILLING_SAME_AS_BILLING.LABEL}
      />
      {!formik.values.isSameAsShippingAddress ? (
        <>
          <h3 className="mb-4x form-element-header">{BILLING_ADDRESS_HEADER}</h3>
          <Address
            handleChange={formik.handleChange}
            values={formik.values.billingAddress}
            stateOptions={US_STATE_OPTIONS}
            prefix="billingAddress"
            errors={formik.errors.billingAddress}
            touched={formik.touched.billingAddress}
          />
        </>
      ) : null}
      <div className="mb-4x">
        <h3 className="mb-4x form-element-header">{PHONE.HEADER}</h3>
        <ReveaInput
          value={formik.values.phone}
          onChange={formik.handleChange}
          label={PHONE.LABEL}
          placeholder={PHONE.PLACEHOLDER}
          name="phone"
          errorMessage={formik.errors.phone && formik.touched.phone ? formik.errors.phone : ''}
          tooltip={PHONE.TOOLTIP}
        />
      </div>
      <div className="mb-4x">
        <h3 className="mb-4x form-element-header">{CREDIT_CARD_HEADER}</h3>
        <Card cardRef={cardRef} formik={formik} handleCardLoaded={handleCardLoaded} />
      </div>
    </>
  );
};

export default FormElements;
