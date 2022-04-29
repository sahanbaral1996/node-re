import * as React from 'react';

import parse from 'html-react-parser';

import Button from 'components/common/button';
import ContentLoader from 'react-content-loader';

import { IAddonOrder, productCategory } from 'types/shoppingCart';
import { en } from 'constants/lang';

interface IShoppingCartProps {
  onContinue: () => void;
  setOrders: (order: IAddonOrder[]) => void;
  orders: IAddonOrder[];
  addonConfigurations: Record<productCategory, IAddonOrder[]>;
  isAddonLoaded: boolean;
  onBack: () => void;
}

const typeText = {
  Boost: {
    type: 'Boost',
    heading: 'Boost your base with our action ingredients: ',
    subHeading:
      'Each of our compounded prescriptions are blended in a silky foundation carefully selected to enhance skin health, appearance and the texture.  Add any of the following ingredients to “boost” further customize your formula.',
    learnMoreURL: 'https://faq.docentrx.com/prescription-compounds',
  },
  Wash: {
    type: 'Wash',
    heading: 'Prep your skin with one of our priority cleansers: ',
    subHeading:
      'Docents prioritary cleansers are designed to complement your prescribed evening treatments. By using a wash in the morning, we can deliver more therapy, without the risk of irritation! ',
    learnMoreURL: 'https://faq.docentrx.com/medicated-washes',
  },
  Moisturizer: {
    type: 'Moisturizer',
    heading: 'TODO: add Moisturizer heading ',
    subHeading: 'TODO: add Moisturizer subHeading',
    leanMoreURL: 'https://faq.docentrx.com/prescription-compounds',
  },
};

// TODO: Refactor state management as CustomizeOrder component ✅ now using higher level state

const ShoppingCart: React.FC<IShoppingCartProps> = ({
  onContinue,
  setOrders,
  orders,
  isAddonLoaded,
  addonConfigurations,
  onBack,
}) => {
  /**
   *  Check if product is marked as selected in cart.
   *
   * @param {IAddonOrder} product - Product to check.
   * @returns - Boolean.
   */
  const isAddonSelected = (product: IAddonOrder) => {
    const orderIndex = orders.findIndex(order => order.id === product.id && order.isSelected);

    if (orderIndex > -1) {
      return true;
    }

    return false;
  };

  /**
   *  Toggle selection/deselection of product in cart.
   *
   * @param {IAddonOrder} product - Product to toggle.
   */
  const toggleAddonSelection = (product: IAddonOrder) => {
    /**
     * Check if Addon is added to cart.
     *
     * @param {IAddonOrder} product - Product to check.
     * @returns - Boolean.
     */
    const isAddonAdded = (product: IAddonOrder) => {
      const orderIndex = orders.findIndex(order => order.id === product.id);

      if (orderIndex > -1) {
        return true;
      }

      return false;
    };
    const isAdded = isAddonAdded(product);

    const addOrderInCart = (order: IAddonOrder) => {
      setOrders([...orders, order]);
    };

    if (isAdded) {
      const newCart = orders.map(item => {
        if (item.id === product.id) {
          return {
            ...item,
            isSelected: !item.isSelected,
          };
        }

        return item;
      });

      setOrders(newCart);
    } else {
      addOrderInCart({
        ...product,
        isSelected: !product.isSelected,
      });
    }
  };

  const replace = (domNode: any) => {
    domNode.attribs = {};

    return domNode;
  };

  return (
    <>
      <div className="addon-order-wrapper user-registration__wrapper container p-0x my-4x mt-10x">
        <div className="cart_products">
          {isAddonLoaded ? (
            Object.keys(addonConfigurations)
              .slice(0)
              .reverse()
              .map((item, index) =>
                item !== 'SpotTreatment' ? (
                  <div className="subscription-item-wrapper mt-5x" key={index}>
                    <h3 className="mb-4x">
                      {item === typeText.Wash.type ? typeText.Wash.heading : typeText.Boost.heading}
                    </h3>

                    <div className="container mb-10x">
                      <div className="header-description row d-flex justify-content-between">
                        <div className="header-description-content col-10 pl-0x">
                          {item === typeText.Wash.type ? typeText.Wash.subHeading : typeText.Boost.subHeading}
                        </div>
                        <div className="price col-2 pr-0x">{item === typeText.Wash.type ? '$5' : '$4'} each</div>
                      </div>
                      {addonConfigurations[item as productCategory].map(product => {
                        return (
                          <div
                            className="row trial-adddon-order-product mt-5x d-flex justify-content-between"
                            key={product.name}
                          >
                            <div className="col-3 trial-addon-order-product-image pl-0x">
                              <img src={product.photos?.srcUrl} alt="product image" />
                            </div>
                            <div className="col-9 trial-addon-order-product-detail py-5x px-6x">
                              <div className="row">
                                <div className="trial-addon-order-title col-8">
                                  <b>{product.name}</b>
                                </div>
                              </div>
                              <div className="trial-addon-order-description">
                                {parse(product.description || '', { replace })}
                              </div>
                              <div className="row d-flex mt-3x">
                                <div className="col-4 trial-addon-order-learn-more">
                                  <a
                                    href={
                                      product.productCategory === typeText.Boost.type
                                        ? typeText.Boost.learnMoreURL
                                        : typeText.Wash.learnMoreURL
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    Learn more
                                  </a>
                                </div>
                                <div className="col-8 trial-addon-order-add-remove">
                                  {isAddonSelected(product) ? (
                                    <>
                                      <div className="trial-addon-order-button">
                                        <span className="trial-addon-product-added pr-3x">Product added</span>
                                        <span className="remove" onClick={() => toggleAddonSelection(product)}>
                                          REMOVE
                                        </span>
                                      </div>
                                    </>
                                  ) : (
                                    <div className="trial-addon-order-button">
                                      <span
                                        className="add"
                                        onClick={() => {
                                          toggleAddonSelection(product);
                                        }}
                                      >
                                        ADD
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      {item === typeText.Boost.type ? (
                        <div className="trial-addon-order-disclaimer row mt-3x p-3x pt-2x">
                          {en.shoppingCart.DISCLAIMER}
                        </div>
                      ) : null}
                    </div>
                  </div>
                ) : null
              )
          ) : (
            <ContentLoader viewBox="0 0 100 10">
              <rect x="0" y="0" width="100" height="10" />
            </ContentLoader>
          )}
        </div>

        <div className="row mt-10x">
          <div className="col-12-md mb-4x">
            <Button title="Confirm and continue payment" onClick={onContinue} fullWidth />
          </div>
        </div>
        <div className="row">
          <div className="d-flex justify-content-center col-12-md mb-4x">
            <Button type="button" color="transparent" title="Back to product selection" onClick={onBack} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ShoppingCart;
