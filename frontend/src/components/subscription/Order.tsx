import * as React from 'react';

import classNames from 'classnames';

import ContentLoader from 'react-content-loader';

import { en } from 'constants/lang';

import { IOrderItemProps, IOrderProps } from 'types/subscription';
import { centsToDollar, calculatePaymentDueToday } from 'utils/price';
import { washIconPink } from 'assets/images';
const { GUARANTEE_BLOCK } = en.subscription.FORM;

const { ORDER_SUMMARY } = en.subscription;
const { CUSTOMIZE_ORDER } = en.addon;

export const OrderItem: React.FC<IOrderItemProps> = ({
  isLoaded,
  description,
  subheader = '',
  cost,
  totalCost = '',
  oneTime = false,
  descriptionClass = '',
  costClass = '',
  subheaderClass = '',
}) => {
  return (
    <div className="row">
      <div className={subheader === '' ? (isLoaded ? (totalCost === '' ? 'col-9' : 'col-7') : 'col-5') : 'col-5'}>
        <div>
          <div className={oneTime ? '' : descriptionClass}>{description}</div>
        </div>
      </div>

      {isLoaded ? (
        <div
          className={classNames(
            subheader === '' ? (totalCost === '' ? 'col-3' : 'col-5') : 'col-8',
            'text-right',
            costClass
          )}
        >
          {totalCost !== '' ? <span className="payment-due-cost light mr-2x">{totalCost}</span> : null}
          <span className="cost-text">{cost}</span>{' '}
          {subheader !== '' && <span className={classNames('free-text ml-4x', subheaderClass)}>{subheader}</span>}
          {description === ORDER_SUMMARY.PAYMENT_DUE.DESCRIPTION ? (
            <div className="first-month-free">{CUSTOMIZE_ORDER.FIRST_MONTH_FREE}</div>
          ) : null}
        </div>
      ) : (
        <div className={subheader === '' ? (isLoaded ? 'col-3' : 'col-7') : 'col-7'}>
          <ContentLoader viewBox="0 0 100 10">
            <rect x="0" y="0" width="100" height="10" />
          </ContentLoader>
        </div>
      )}
    </div>
  );
};

const Order: React.FC<IOrderProps> = ({ estimate, isLoaded, orders }) => {
  return (
    <div>
      <div className="subscription-order-summary p-7x mb-8x">
        <h3 className="mb-4x order-summary-header">{ORDER_SUMMARY.TRIAL_ORDER.HEADER}</h3>
        <div className="subscription-item-wrapper"></div>
        <div>
          <div className="subscription-item-wrapper">
            {estimate?.invoiceEstimate?.lineItems
              ? estimate.invoiceEstimate?.lineItems.map(item => (
                  <div className="w-100 py-2x" key={item.id}>
                    <OrderItem
                      isLoaded={isLoaded}
                      description={item.description}
                      subheader={''}
                      cost={`${centsToDollar(item.amount)}`}
                      descriptionClass={'subscription-cost-description'}
                      costClass={'subscription-cost'}
                    />
                  </div>
                ))
              : null}
            <OrderItem
              isLoaded={isLoaded}
              description={ORDER_SUMMARY.SUBSCRIPTION_BASE_ITEM.DESCRIPTION}
              subheader={ORDER_SUMMARY.SUBSCRIPTION_BASE_ITEM.SUB_HEADER}
              cost={ORDER_SUMMARY.SUBSCRIPTION_BASE_ITEM.COST}
              descriptionClass={'subscription-cost-description'}
              costClass={'subscription-cost'}
            />
            {ORDER_SUMMARY.SUBSCRIPTION_COST_ITEMS.map(item => (
              <div className="w-100 py-2x" key={item.COST}>
                <OrderItem
                  isLoaded={isLoaded}
                  description={item.DESCRIPTION}
                  subheader={item.SUB_HEADER}
                  cost={item.COST}
                  oneTime={true}
                  descriptionClass={item.DESCRIPTION_CLASS}
                  costClass={item.COST_CLASS}
                />
              </div>
            ))}
          </div>
          {estimate?.invoiceEstimate.discountAmount && (
            <div className="py-2x">
              <OrderItem
                isLoaded={isLoaded}
                descriptionClass="subscription-deduction"
                costClass="subscription-deduction pl-0x"
                description={estimate.invoiceEstimate.discountDescription}
                cost={`-${centsToDollar(estimate.invoiceEstimate.discountAmount)}`}
              />
            </div>
          )}
          <div className="py-2x">
            <OrderItem
              isLoaded={isLoaded}
              description={ORDER_SUMMARY.PAYMENT_DUE.DESCRIPTION}
              cost={centsToDollar(calculatePaymentDueToday(estimate) || 0)}
              totalCost={centsToDollar(
                parseInt(ORDER_SUMMARY.SUBSCRIPTION_BASE_ITEM.COST.slice(1)) * 100 +
                  (estimate?.invoiceEstimate.amountDue || 0) || 0
              )}
              descriptionClass="payment-due-cost"
              costClass="payment-due-cost"
            />
          </div>
          <div className="py-2x">
            {
              <OrderItem
                isLoaded={isLoaded}
                description={ORDER_SUMMARY.PAYMENT_DUE_MONTHLY.DESCRIPTION}
                cost={centsToDollar((estimate?.nextInvoiceEstimate.amountDue || 0) / 2)}
                totalCost={
                  estimate?.nextInvoiceEstimate.discountAmount
                    ? centsToDollar((estimate?.nextInvoiceEstimate.subTotal || 0) / 2)
                    : ''
                }
                descriptionClass="payment-due-cost"
                costClass="payment-due-cost"
              />
            }

            <div className="bimonthly-charge">
              {ORDER_SUMMARY.OTHER.DESCRIPTION}
              {centsToDollar(estimate?.nextInvoiceEstimate.amountDue || 0)}
            </div>
          </div>
        </div>

        <div className="disclaimer mt-5x">
          <div>{ORDER_SUMMARY.OTHER.RISK}</div>
          <div>{ORDER_SUMMARY.OTHER.CANCEL}</div>
          <div>{ORDER_SUMMARY.OTHER.TAX}</div>
        </div>
      </div>

      <div className="row justify-content-end">
        <div className="block-wrapper mb-7x col-8-md col-12-lg">
          <div className="block-wrapper-container container p-6x">
            <h2 className="title mb-7x">{GUARANTEE_BLOCK.TITLE}</h2>
            <div className="content">
              <p>{GUARANTEE_BLOCK.FIRST_LINE}</p>
              <br />
              <p>{GUARANTEE_BLOCK.SECOND_LINE}</p>
              <br />
              <p>
                {GUARANTEE_BLOCK.THIRD_LINE.PREFIX}
                <span className="faq">
                  {' '}
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://faq.docentrx.com/90-day-money-back-guarantee"
                  >
                    {GUARANTEE_BLOCK.THIRD_LINE.FAQ}
                  </a>
                </span>{' '}
                {GUARANTEE_BLOCK.THIRD_LINE.SUFFIX}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* // subscription order sumamry module commented for backup */}
      {/* <div className="subscription-order-summary p-7x mb-4x">
        <h4>{ORDER_SUMMARY.ACTIVE_ORDER.HEADER}</h4>
        <p className="subheader3 mb-4x">{ORDER_SUMMARY.ACTIVE_ORDER.SUBHEADER3}</p>
        <div className="subscription-item-wrapper mt-5x"></div>
        <div className="subscription-item-wrapper py-2x">
          <div className="mb-2x">
            <OrderItem
              isLoaded={isLoaded}
              description={ORDER_SUMMARY.ACTIVE_ORDER.DETAILS}
              descriptionClass="subscription-cost-description"
              cost={ORDER_SUMMARY.ACTIVE_ORDER.COST}
            />
          </div>
          {estimate?.invoiceEstimate?.lineItems && estimate?.invoiceEstimate?.lineItems.length > 0 ? (
            <>
              <div className="subscription-item-wrapper"></div>
              <p className="subscription-cost-description mt-2x">Additional products</p>
            </>
          ) : null}
          {estimate?.invoiceEstimate?.lineItems
            ? estimate.nextInvoiceEstimate?.lineItems.map(item => (
                <div className="row mt-1x" key={item.id}>
                  <div className={classNames('col-8', 'color-grey-75')}>{item.description}</div>
                  <div className={classNames('col-4', 'text-right')}>
                    <span>{`${centsToDollar(item.amount)}`} </span>
                  </div>
                </div>
              ))
            : null}
          {estimate?.nextInvoiceEstimate?.discountAmount ? (
            <div className="mt-4x">
              <OrderItem
                isLoaded={isLoaded}
                description={estimate.nextInvoiceEstimate?.discountDescription}
                descriptionClass="subscription-deduction"
                costClass="subscription-deduction"
                cost={`-${centsToDollar(estimate.nextInvoiceEstimate?.discountAmount)}`}
              />
            </div>
          ) : null}
        </div>
        <div className="py-2x">
          <OrderItem
            isLoaded={isLoaded}
            description={ORDER_SUMMARY.ACTIVE_ORDER.PAYMENT_DUE.DESCRIPTION}
            cost={centsToDollar(estimate?.nextInvoiceEstimate?.amountDue || 0)}
            descriptionClass="payment-due-cost"
            costClass="payment-due-cost"
          />
        </div>
        <p>
          <small>
            {ORDER_SUMMARY.OTHER.RISK}
            <br />
            {ORDER_SUMMARY.OTHER.CANCEL}
            <br />
            {ORDER_SUMMARY.OTHER.ELIGIBLE}
          </small>
        </p>
      </div> */}
    </div>
  );
};

export default Order;
