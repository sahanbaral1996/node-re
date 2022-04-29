import * as React from 'react';

import { CardComponent, CardNumber, CardExpiry, CardCVV, IEvent } from '@chargebee/chargebee-js-react-wrapper';
import { ICardProps } from 'types/subscription';

import { en } from 'constants/lang';
import ErrorMessage from 'components/common/ErrorMessage';
import classNames from 'classnames';

const { CARD, EXPIRATION_DATE, CVV } = en.subscription.FORM.CREDIT_CARD;
const { ERRORS } = en.subscription.FORM;

const CardError: React.FC<{ error?: string }> = ({ error }) =>
  error ? (
    <div className="row">
      <div className="col-12-md mb-4x d-flex justify-content-center">
        <div>
          <div className="card-error p-6x mb-4x">{ERRORS.TITLE}</div>
          <div>{ERRORS.SUB_TITLE}</div>
          <ul className="pl-8x">
            {ERRORS.REASONS.map(reason => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
          <div className="error-message">{ERRORS.MESSAGE}</div>
        </div>
      </div>
    </div>
  ) : null;

const Card: React.FC<ICardProps> = ({ cardRef, formik, handleCardLoaded }) => {
  const handleChange = (value: IEvent) => {
    if (value.complete) {
      const { error, cardType = '' } = value;

      if (value.field === 'number') {
        formik.setFieldValue('card.type', cardType);
      }

      if (!error) {
        formik.setFieldValue(`card.${value.field}`, 'complete');
      }
    }
    const { error = { message: '' } } = value;

    return formik.setFieldError(`card.${value.field}`, error.message);
  };

  const handleReady = () => handleCardLoaded();

  const hasCardNumberError = !!(formik.touched.card?.number && formik.errors.card?.number);
  const hasExpiryError = !!(formik.touched.card?.expiry && formik.errors.card?.expiry);
  const hasCVVError = !!(formik.touched.card?.cvv && formik.errors.card?.cvv);

  return (
    <>
      <CardComponent ref={cardRef} onReady={handleReady}>
        <div className="row">
          <div className="col-12-md mb-4x">
            <div
              className={classNames('revea-input__wrapper', {
                'input-error': hasCardNumberError,
              })}
            >
              <label className={classNames('revea-input__label', { red: hasCardNumberError })}>
                {CARD.LABEL}
                <CardNumber placeholder={CARD.PLACEHOLDER} className="revea-input" onChange={handleChange} />
              </label>
            </div>
            {hasCardNumberError ? <ErrorMessage message={formik.errors.card?.number} /> : null}
          </div>
        </div>
        <div className="row mb-5x">
          <div className="col-6-md mb-4x mb-0x-md">
            <div
              className={classNames('revea-input__wrapper', {
                'input-error': hasExpiryError,
              })}
            >
              <label className={classNames('revea-input__label', { red: hasExpiryError })}>
                {EXPIRATION_DATE.LABEL}
                <CardExpiry placeholder={EXPIRATION_DATE.PLACEHOLDER} className="revea-input" onChange={handleChange} />
              </label>
            </div>
            {hasExpiryError ? <ErrorMessage message={formik.errors.card?.expiry} /> : null}
          </div>
          <div className="col-6-md">
            <div
              className={classNames('revea-input__wrapper', {
                'input-error': hasCVVError,
              })}
            >
              <label className={classNames('revea-input__label', { red: hasCVVError })}>
                {CVV.LABEL}
                <CardCVV placeholder={CVV.PLACEHOLDER} className="revea-input" onChange={handleChange} />
              </label>
            </div>
            {hasCVVError ? <ErrorMessage message={formik.errors.card?.cvv} /> : null}
          </div>
        </div>
      </CardComponent>
      <CardError error={formik.errors.card?.transaction} />
    </>
  );
};

export default Card;
