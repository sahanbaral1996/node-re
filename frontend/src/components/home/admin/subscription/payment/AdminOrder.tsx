import * as React from 'react';

import classNames from 'classnames';

import ContentLoader from 'react-content-loader';

import { en } from 'constants/lang';

import { IOrderItemProps, IOrderProps } from 'types/subscription';
import { centsToDollar } from 'utils/price';

const { ORDER_SUMMARY } = en.subscription;

const AdminOrderItem: React.FC<IOrderItemProps> = ({
  isLoaded,
  description,
  subheader,
  cost,
  descriptionClass = '',
  costClass = '',
}) => {
  return (
    <div className="row">
      <div className="col-8">
        <div>
          <div className={classNames(descriptionClass)}>{description}</div>
          {subheader}
        </div>
      </div>

      <div className={classNames('col-4', 'text-right', costClass)}>
        {isLoaded ? (
          <span>{cost}</span>
        ) : (
          <ContentLoader viewBox="0 0 100 10">
            <rect x="0" y="0" width="100" height="10" />
          </ContentLoader>
        )}
      </div>
    </div>
  );
};

const AdminOrder: React.FC<IOrderProps> = ({ estimate, isLoaded, orders }) => {
  return (
    <div className="container p-0x">
      <div className="row">
        <div className="col-6-md mt-4x">
          <div className="subscription-order-summary admin-summary p-7x">
            <h3 className="mb-4x">{ORDER_SUMMARY.TRIAL_ORDER.HEADER}</h3>
            <div>
              <div className="subscription-item-wrapper">
                {ORDER_SUMMARY.SUBSCRIPTION_COST_ITEMS.map(item => (
                  <div className="w-100 py-2x" key={item.COST}>
                    <AdminOrderItem
                      isLoaded={isLoaded}
                      description={item.DESCRIPTION}
                      subheader={item.SUB_HEADER}
                      cost={item.COST}
                      descriptionClass={item.DESCRIPTION_CLASS}
                      costClass={item.COST_CLASS}
                    />
                  </div>
                ))}
              </div>
              <div className="subscription-item-wrapper py-3x">
                {ORDER_SUMMARY.SHIPPING_COST_ITEMS.map(item => (
                  <div key={item.DESCRIPTION} className="mb-2x">
                    <AdminOrderItem isLoaded={isLoaded} description={item.DESCRIPTION} cost={item.COST} />
                  </div>
                ))}
                {estimate?.invoiceEstimate.discountAmount ? (
                  <div className="mt-4x">
                    <AdminOrderItem
                      isLoaded={isLoaded}
                      descriptionClass="subscription-deduction"
                      costClass="subscription-deduction"
                      description={estimate.invoiceEstimate.discountDescription}
                      cost={`-${centsToDollar(estimate.invoiceEstimate.discountAmount)}`}
                    />
                  </div>
                ) : null}
                {estimate?.invoiceEstimate?.lineItems && estimate?.invoiceEstimate?.lineItems.length > 0 ? (
                  <>
                    <div className="subscription-item-wrapper"></div>
                    <p className="subscription-cost-description mt-2x">Additional products</p>
                  </>
                ) : null}
                {estimate?.invoiceEstimate?.lineItems
                  ? estimate.invoiceEstimate?.lineItems.map(item => (
                      <div className="row mt-1x" key={item.id}>
                        <div className={classNames('col-8', 'color-grey-75')}>{item.description}</div>

                        <div className={classNames('col-4', 'text-right')}>
                          <span>{`${centsToDollar(item.amount)}`} </span>
                        </div>
                      </div>
                    ))
                  : null}
              </div>
              <div className="py-2x">
                <AdminOrderItem
                  isLoaded={isLoaded}
                  description={ORDER_SUMMARY.PAYMENT_DUE.DESCRIPTION}
                  cost={centsToDollar(estimate?.invoiceEstimate.amountDue || 0)}
                  descriptionClass="payment-due-cost admin"
                  costClass="payment-due-cost admin"
                />
              </div>
            </div>
            <div className="risk-free-trial">
              {ORDER_SUMMARY.OTHER.RISK}
              <br />
              {ORDER_SUMMARY.OTHER.CANCEL}
              <br />
              {ORDER_SUMMARY.OTHER.ELIGIBLE}
            </div>
          </div>
        </div>
        <div className="col-6-md mt-4x">
          <div className="subscription-order-summary admin-summary p-7x">
            <h3>{ORDER_SUMMARY.ACTIVE_ORDER.HEADER}</h3>
            <div className="subheader3 mt-1x mb-4x">{ORDER_SUMMARY.ACTIVE_ORDER.SUBHEADER3}</div>
            <div className="subscription-item-wrapper"></div>
            <div className="subscription-item-wrapper py-2x">
              <AdminOrderItem
                isLoaded={isLoaded}
                description={ORDER_SUMMARY.ACTIVE_ORDER.DETAILS}
                descriptionClass="subscription-cost-description"
                cost={ORDER_SUMMARY.ACTIVE_ORDER.COST}
              />
              {estimate?.invoiceEstimate?.lineItems && estimate?.invoiceEstimate?.lineItems.length > 0 ? (
                <>
                  <div className="subscription-item-wrapper mt-2x"></div>
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
                  <AdminOrderItem
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
              <AdminOrderItem
                isLoaded={isLoaded}
                description={ORDER_SUMMARY.ACTIVE_ORDER.PAYMENT_DUE.DESCRIPTION}
                cost={centsToDollar(estimate?.nextInvoiceEstimate?.amountDue || 0)}
                descriptionClass="payment-due-cost admin"
                costClass="payment-due-cost admin"
              />
            </div>
            <div className="risk-free-trial">
              {ORDER_SUMMARY.OTHER.RISK}
              <br />
              {ORDER_SUMMARY.OTHER.CANCEL}
              <br />
              {ORDER_SUMMARY.OTHER.ELIGIBLE}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrder;
