import * as React from 'react';
import { essentialTreatment, essentialCleanser } from 'assets/images';
import Button from 'components/common/button';
import parse from 'html-react-parser';
import ContentLoader from 'react-content-loader';
import { cartContext } from 'components/product/Router';

import { en } from 'constants/lang';
import { IAddonOrder, productCategory } from 'types/shoppingCart';
import Order, { OrderItem } from 'components/subscription/Order';
import { SubscriptionEstimateState } from 'types/subscription';
import { HomeRouterContext } from 'components/home/Router';
import { estimateSubscription } from 'services/subscription';
import { handleError } from 'utils/errorHandler';
import { centsToDollar } from 'utils/price';
import classNames from 'classnames';
import { map } from 'lodash';
import { INITIAL_ADDON_CONFIGURATIONS } from 'components/product/Router';
import { ORDER_REVIEW } from 'constants/routes';

const { CUSTOMIZE_ORDER } = en.addon;
const { ORDER_SUMMARY } = en.subscription;

interface ICustomizeProps {
  onContinue: (activeAddonId: string[], trialAddonId: string[]) => void;
  setOrders: (order: IAddonOrder[]) => void;
  orders: IAddonOrder[];
  isLoaded: boolean;
  groupedAddonConfigurations: Record<productCategory, IAddonOrder[]>;
  setAddonConfigurations: (configs: Record<productCategory, IAddonOrder[]>) => void;
}

type BannerProps = {
  pricing: string;
  disclaimers: string[];
};

type EssentialProductProps = {
  product: {
    HEADER: string;
    DESCRIPTION: string;
    RATING: number;
    LEARN_MORE_LINK?: string;
  };
  image: string;
  isLoaded?: boolean;
};

const PricingBanner: React.FC<BannerProps> = ({ pricing, disclaimers }) => {
  return (
    <div className="pricing-banner py-3x mb-6x">
      <div className="pricing mb-1x">{pricing}</div>
      <div className="disclaimer">
        {disclaimers.map((disclaimer, index) => (
          <div key={index} className="mb-1x">
            {disclaimer}
          </div>
        ))}
      </div>
    </div>
  );
};

const generateStars = (iteration: number) => Array(iteration).fill(<span>{CUSTOMIZE_ORDER.RATING_STAR}</span>);

const EssentialProduct: React.FC<EssentialProductProps> = ({ product, image, isLoaded = true }) => {
  const context = React.useContext(cartContext);

  const getRating = (rating: number) => (rating / CUSTOMIZE_ORDER.RATING_CAP) * 100 + '%';

  return (
    <div className="essential-product row mb-12x">
      <div className="col-12-sm col-3-md image d-flex d-md-block justify-content-center">
        <img src={image} alt={product.HEADER} />
      </div>
      <div className="col-12-sm col-9-md details">
        <div className="header row">
          <div className="col-12-sm col-md my-1x">{product.HEADER}</div>
          {image === essentialCleanser ? (
            isLoaded ? (
              <div className="col-12-sm col-6-md">
                {context?.hasWash() ? (
                  <div className="d-flex justify-content-end-md">
                    <div className="disclaimer p-2x order order-2 order-1-sm" style={{ color: '#A4A4A4' }}>
                      {CUSTOMIZE_ORDER.PRODUCT_ADDED}
                    </div>
                    <button
                      className="btn p-2x order order-1 order-2-sm"
                      color="#dddddd"
                      style={{ color: '#495057' }}
                      onClick={() => {
                        context ? context.removeAddon() : null;
                      }}
                    >
                      {CUSTOMIZE_ORDER.REMOVE}
                    </button>
                  </div>
                ) : (
                  <div className="d-flex justify-content-end-md">
                    <button
                      className="btn btn-primary p-2x"
                      onClick={() => {
                        context ? context.setAddonConfig() : null;
                      }}
                    >
                      {CUSTOMIZE_ORDER.ADD}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="col-12-sm col-6-md mt-1x">
                <ContentLoader viewBox="0 0 100 10">
                  <rect x="0" y="0" width="100" height="10" />
                </ContentLoader>
              </div>
            )
          ) : null}
        </div>

        {/* rating */}
        <div className="rating mb-2x d-flex">
          <div className="stars">
            <div className="upper" style={{ width: getRating(product.RATING) }}>
              {generateStars(CUSTOMIZE_ORDER.RATING_CAP)}
            </div>
            <div className="lower">{generateStars(CUSTOMIZE_ORDER.RATING_CAP)}</div>
          </div>
          <div className="value mt-2x ml-3x">
            {product.RATING} out of {CUSTOMIZE_ORDER.RATING_CAP}
          </div>
        </div>

        <div className="description mb-6x">
          <p className="mb-6x">{product.DESCRIPTION}</p>
        </div>

        {product.LEARN_MORE_LINK && (
          <div className="explore-cleansers">
            <a href={product.LEARN_MORE_LINK} target="_blank" rel="noopener noreferrer">
              {CUSTOMIZE_ORDER.EXPLORE_OUR_CLEANSERS}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

const Customize: React.FC<ICustomizeProps> = ({
  onContinue,
  setOrders,
  orders,
  isLoaded,
  groupedAddonConfigurations,
  setAddonConfigurations,
}) => {
  const context = React.useContext(cartContext);

  const trialAddOnId: string[] = [];
  const activeAddonId: string[] = [];

  const [FIRST_HEADER] = CUSTOMIZE_ORDER.HEADER;
  const [ESSENTIAL_TREATMENT_BANNER, ESSENTIAL_CLEANSER_BANNER] = CUSTOMIZE_ORDER.PRICING_BANNER;

  return (
    <>
      <div className="addon-order-wrapper user-registration__wrapper customize-order-wrapper">
        <h3 className="mb-5x user-registration__header">{FIRST_HEADER}</h3>

        <PricingBanner
          pricing={ESSENTIAL_TREATMENT_BANNER.PRICING}
          disclaimers={ESSENTIAL_TREATMENT_BANNER.DISCLAIMER}
        />
        <EssentialProduct product={CUSTOMIZE_ORDER.ESSENTIAL_CREAM} image={essentialTreatment} />

        <div className="divider primary">
          <div className="line"></div>
          <div className="text">{CUSTOMIZE_ORDER.DIVIDER_TEXT}</div>
        </div>

        <PricingBanner pricing={ESSENTIAL_CLEANSER_BANNER.PRICING} disclaimers={ESSENTIAL_CLEANSER_BANNER.DISCLAIMER} />
        <EssentialProduct product={CUSTOMIZE_ORDER.ESSENTIAL_CLEANSER} image={essentialCleanser} isLoaded={isLoaded} />

        <div className="estimate-order">
          <div className="subscription-order-summary py-5x px-6x mb-4x">
            <h3 className="mb-4x order-summary-header">{ORDER_SUMMARY.TRIAL_ORDER.HEADER}</h3>
            <div className="subscription-item-wrapper"></div>
            <div>
              {/* order items */}
              <div className="subscription-item-wrapper">
                {/* mapped dermatologist evaluation statically */}

                {/* mapped base item subscription statically */}
                <div className="w-100 py-2x">
                  <OrderItem
                    isLoaded={isLoaded}
                    description={ORDER_SUMMARY.SUBSCRIPTION_BASE_ITEM.DESCRIPTION}
                    cost={ORDER_SUMMARY.SUBSCRIPTION_BASE_ITEM.COST}
                    descriptionClass={'subscription-cost-description'}
                    subheader={''}
                    costClass={''}
                  />
                </div>
                {/* mapped other things dynamically */}
                {map(groupedAddonConfigurations, group => {
                  return group.map(addonItem => {
                    trialAddOnId.push(addonItem.trialAddOnId);
                    activeAddonId.push(addonItem.standardAddOnId);

                    return (
                      <div className="w-100 py-2x" key={addonItem.id}>
                        <OrderItem
                          isLoaded={isLoaded}
                          description={addonItem.name}
                          cost={`${centsToDollar(addonItem.trialPrice * 100)}`}
                          descriptionClass={'subscription-cost-description'}
                          subheader={''}
                          costClass={''}
                        />
                      </div>
                    );
                  });
                })}
                {ORDER_SUMMARY.SUBSCRIPTION_COST_ITEMS.map(item => {
                  return (
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
                  );
                })}
              </div>
              {/* order total */}
              <div className="w-100 py-2x">
                <div className="row">
                  <div className="col-5">
                    <div>
                      <div className="payment-due-cost">{ORDER_SUMMARY.PAYMENT_DUE.DESCRIPTION}</div>
                    </div>
                  </div>
                  <div className="col-7 text-right">
                    {isLoaded ? (
                      <>
                        <span className="payment-due-cost crossed mr-2x">
                          {context?.hasWash()
                            ? ORDER_SUMMARY.PAYMENT_DUE.PRICE_WITH_WASH
                            : ORDER_SUMMARY.PAYMENT_DUE.PRICE_WITHOUT_WASH}
                        </span>
                        <span className="payment-due-cost">{ORDER_SUMMARY.PAYMENT_DUE.COST}</span>
                        <div className="first-month-free">{CUSTOMIZE_ORDER.FIRST_MONTH_FREE}</div>
                      </>
                    ) : (
                      <ContentLoader viewBox="0 0 100 10">
                        <rect x="0" y="0" width="100" height="10" />
                      </ContentLoader>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-10x">
          <div className="col-12-md mb-4x">
            <Button
              disabled={!isLoaded}
              title={CUSTOMIZE_ORDER.CONTINUE_BUTTON_TEXT}
              onClick={() => {
                onContinue(activeAddonId, trialAddOnId);
              }}
              fullWidth
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Customize;
