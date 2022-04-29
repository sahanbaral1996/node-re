import * as React from 'react';
import { HomeRouterContext, IUserProfileActionType } from 'components/home/Router';
import { essentialCleanser, infoIcon } from 'assets/images';
import { useHistory } from 'react-router-dom';
import { en } from 'constants/lang';
import Auth from '@aws-amplify/auth';
import { getAddonOrders } from 'services/shoppingcart';
import { IAddonOrder } from 'types/shoppingCart';
import { map } from 'lodash';
import parse from 'html-react-parser';
import { fetchProfile } from 'services/profile';
import { handleError } from 'utils/errorHandler';
import { addAddonOrder, removeAddonOrder } from 'services/shoppingcart';
import ContentLoader from 'react-content-loader';
import Loader from 'react-spinners/ClipLoader';
import * as routes from 'constants/routes';
import iziToast from 'izitoast';
import { anonymize } from 'services/fullstory';
import { UserStatus } from 'types/profile';

type ProductProps = {
  product: IAddonOrder;
  actualUserAddons: IAddonOrder[];
  setActualUserAddons: (actualUserAddons: IAddonOrder[]) => void;
};

const Product: React.FC<ProductProps> = ({ product, actualUserAddons, setActualUserAddons }) => {
  const history = useHistory();
  const { state: userProfile, dispatch } = React.useContext(HomeRouterContext);

  const { CUSTOMIZE_ORDER } = en.addon;
  const generateStars = (iteration: number) => Array(iteration).fill(<span>{CUSTOMIZE_ORDER.RATING_STAR}</span>);

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const replace = (domNode: any) => {
    domNode.attribs = {};

    return domNode;
  };

  const addProduct = async () => {
    try {
      setIsLoading(true);

      const response = await addAddonOrder({ addonIds: [product.id] }, userProfile?.id || '');

      const {
        data: {
          data: {
            addOrderResult: {
              value: [addon],
            },
          },
        },
      } = response;

      if (response.status === 200) {
        setActualUserAddons([...actualUserAddons, { ...product, addOnConfiguration: product.id, id: addon.id }]);

        iziToast.success({ message: 'Success! Addon added.' });
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeProduct = async () => {
    setIsLoading(true);

    const addonIds: string[] = [];

    actualUserAddons.forEach(addon => {
      addonIds.push(addon.id);
    });

    try {
      const data = await removeAddonOrder({ addonIds: addonIds }, userProfile?.id || '');

      if (data.status === 200) {
        setActualUserAddons([
          ...actualUserAddons.filter(addon => {
            return addon.addOnConfiguration !== product.id;
          }),
        ]);
        iziToast.success({ message: 'Success! Addon removed.' });
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const hasAddon = (addon: IAddonOrder) => {
    const array = actualUserAddons.filter(userAddon => {
      return userAddon.addOnConfiguration === addon.id;
    });

    return array.length;
  };

  return (
    <div className="product mb-6x">
      <div className="row">
        <div className="image col-3">
          <img src={essentialCleanser} alt="Essential Cleanser" />
        </div>
        <div className="details col-9">
          <div className="header d-flex justify-content-between">
            <div className="title">{parse(product.name || '', { replace })}</div>
            <div className="cost">$9/month</div>
          </div>

          {/* rating */}
          <div className="rating mb-2x d-flex">
            <div className="stars">
              <div className="upper" style={{ width: '100%' }}>
                {generateStars(CUSTOMIZE_ORDER.RATING_CAP)}
              </div>
              <div className="lower">{generateStars(CUSTOMIZE_ORDER.RATING_CAP)}</div>
            </div>
            <div className="value mt-2x ml-3x">5 out of 5</div>
          </div>

          <div className="description mb-4x">{parse(product.description || '', { replace })}</div>
          {isLoading ? (
            <Loader />
          ) : hasAddon(product) ? (
            <div className="add-remove-control d-flex">
              <div className="product-added-text mr-2x py-2x">Product added</div>
              {userProfile?.status === UserStatus.Active && (
                <button className="btn p-0x py-2x" color="#dddddd" style={{ color: '#495057' }} onClick={removeProduct}>
                  Remove
                </button>
              )}
            </div>
          ) : (
            userProfile?.status === UserStatus.Active && (
              <button className="btn btn-primary p-0x py-2x" onClick={addProduct}>
                Add
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

const ManageProductSelection: React.FC = () => {
  const [{ addons, isLoading }, setAddons] = React.useState<{
    isLoading: boolean;
    addons: IAddonOrder[];
  }>({
    isLoading: true,
    addons: [],
  });
  const [actualUserAddons, setActualUserAddons] = React.useState<IAddonOrder[]>([]);
  const [isProfileLoading, setIsProfileLoading] = React.useState<boolean>(true);

  const fetchUserData = async () => {
    try {
      setIsProfileLoading(true);
      const {
        data: { data: profile },
      } = await fetchProfile();

      setActualUserAddons([...profile.addons]);
    } catch (error) {
      handleError(error);
    } finally {
      setIsProfileLoading(false);
    }
  };

  React.useEffect(() => {
    {
      (async () => {
        try {
          const {
            data: { orders },
          } = await getAddonOrders();

          const fetchedAddons: IAddonOrder[] = [];

          map(orders, (category: IAddonOrder[]) => {
            category.map(addon => {
              fetchedAddons.push(addon);
            });
          });

          setAddons({ addons: fetchedAddons, isLoading: false });
        } catch (error) {
          handleError(error);
        }
      })();
    }
  }, []);

  React.useEffect(() => {
    fetchUserData();
  }, []);

  const getOngoingMonthlyCost = (addons: IAddonOrder[]) => {
    let total = 0;

    addons.forEach(addon => {
      total = total + addon.trialPrice;
    });

    return total;
  };

  return (
    <div className="manage-product-selection">
      <h3 className="account-form__header mb-6x">My Products</h3>
      <h5 className="account-form__header mb-6x">Product add-ons</h5>
      <div className="disclaimer d-flex p-2x mb-7x">
        <div className="icon mr-2x pt-1x">
          <img src={infoIcon} alt="info_icon" />
        </div>
        <div className="text">
          Changes to product selection will be reflected in your next shipment and billing cycle.
        </div>
      </div>
      {isLoading && isProfileLoading ? (
        <div className="mb-6x">
          <ContentLoader viewBox="0 0 100 5">
            <rect x="0" y="0" width="100" height="5" />
          </ContentLoader>
          <ContentLoader viewBox="0 0 100 5">
            <rect x="0" y="0" width="100" height="5" />
          </ContentLoader>
        </div>
      ) : (
        <>
          {actualUserAddons &&
            addons.map(addon => {
              return (
                <Product
                  key={addon.id}
                  product={addon}
                  actualUserAddons={actualUserAddons}
                  setActualUserAddons={setActualUserAddons}
                />
              );
            })}
          <div className="order-estimate p-6x">
            <div className="ongoing-monthly-fee">
              <div className="lineItem d-flex justify-content-between">
                <div className="description">Ongoing Monthly Fee</div>
                <div className="cost">${getOngoingMonthlyCost(actualUserAddons ?? [])}.00</div>
              </div>
              <div className="disclaimer">
                Bills and ships every 2 months at ${getOngoingMonthlyCost(actualUserAddons ?? []) * 2}
              </div>
              <hr className="seperator my-3x" />
              <div className="total d-flex justify-content-between">
                <div className="description">Total</div>
                <div className="cost">${getOngoingMonthlyCost(actualUserAddons ?? []) * 2}.00</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ManageProductSelection;
