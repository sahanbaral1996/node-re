import React from 'react';
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';

import Customize from 'components/CustomizeOrder';
import ShoppingCart from 'components/shoppingCart';
import { IAddonOrder, productCategory } from 'types/shoppingCart';
import * as routes from 'constants/routes';

import { handleError } from 'utils/errorHandler';
import { getAddonOrders } from 'services/shoppingcart';
import { HomeRouterContext } from 'components/home/Router';
import useMountedRef from 'hooks/useMountedRef';

export const INITIAL_ADDON_CONFIGURATIONS = {
  Wash: [],
  Moisturizer: [],
  SpotTreatment: [],
  Boost: [],
};
const INITIAL_CONTEXT_CONFIG = {
  orders: [],
  addonConfig: INITIAL_ADDON_CONFIGURATIONS,
  setAddonConfig: () => {
    return;
  },
  removeAddon: () => {
    return;
  },
  hasWash: () => {
    return true;
  },
};

export const cartContext = React.createContext<{
  orders: IAddonOrder[] | null;
  addonConfig: Record<productCategory, IAddonOrder[]> | null;
  setAddonConfig: () => void;
  removeAddon: () => void;
  hasWash: () => boolean;
}>(INITIAL_CONTEXT_CONFIG);

const ProductRouter: React.FC<{
  setProducts: (orders: IAddonOrder[]) => void;
  products: IAddonOrder[];
  setAddons: (activeAddonId: string[], trialAddonId: string[]) => void;
}> = ({ setProducts, products, setAddons }) => {
  const { state: userProfile } = React.useContext(HomeRouterContext);
  const history = useHistory();
  const [cartOrders, setCartOrders] = React.useState<IAddonOrder[]>(products);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [addonorders, setAddonOrders] = React.useState<Record<productCategory, IAddonOrder[]>>(
    INITIAL_ADDON_CONFIGURATIONS
  );
  const [groupedAddonConfigurations, setAddonConfigurations] = React.useState<Record<productCategory, IAddonOrder[]>>(
    INITIAL_ADDON_CONFIGURATIONS
  );
  const mountRef = useMountedRef();

  const removeWash = () => {
    setAddonConfigurations(INITIAL_ADDON_CONFIGURATIONS);
    setCartOrders([]);
    isWashSelected();
  };

  const addAddonConfig = () => {
    setAddonConfigurations(addonorders);
    setCartOrders([addonorders.Wash[0]]);
    isWashSelected();
  };

  const isWashSelected = () => {
    return groupedAddonConfigurations.Wash.length > 0 ? true : false;
  };

  const cartConfig = {
    orders: cartOrders,
    addonConfig: groupedAddonConfigurations,
    setAddonConfig: addAddonConfig,
    removeAddon: removeWash,
    hasWash: isWashSelected,
  };

  React.useEffect(() => {
    (async () => {
      try {
        const orderData = await getAddonOrders();

        if (mountRef.current) {
          setAddonConfigurations(orderData.data.orders);
          setAddonOrders(orderData.data.orders);
          if (userProfile && !isSpotTreatmentAdded(orderData.data.orders)) {
            addSpotTreatmentToCart(orderData.data.orders, userProfile.hyperpigmentation);
          }
          setCartOrders([orderData.data.orders.Wash[0]]);
          setIsLoaded(true);
        }
      } catch (err) {
        handleError(err);
      }
    })();
  }, []);

  const isSpotTreatmentAdded = (addonOrders: Record<productCategory, IAddonOrder[]>) => {
    if (!addonOrders.SpotTreatment) {
      return true;
    }
    const spotTreatmentAddon = addonOrders.SpotTreatment[0];

    const spotCream = cartOrders.find(item => item.name === spotTreatmentAddon.name);

    return !!spotCream;
  };

  const addSpotTreatmentToCart = (data: Record<productCategory, IAddonOrder[]>, isSelected: boolean) => {
    const spotTreatment = data.SpotTreatment[0];

    spotTreatment.isSelected = isSelected;
    setCartOrders([...cartOrders, spotTreatment]);
  };

  const handleContinue = (addons: { activeAddonId: string[]; trialAddonId: string[] }) => {
    setProducts(cartOrders);
    setAddons(addons.activeAddonId, addons.trialAddonId);
    // select route for different location

    return history.push(routes.SETUP_SUBSCRIPTION);
  };

  return (
    <>
      <cartContext.Provider value={cartConfig}>
        <Switch>
          <Route
            exact
            path={routes.PRODUCT_SELECTION}
            component={() => (
              <Customize
                isLoaded={isLoaded}
                orders={cartOrders}
                groupedAddonConfigurations={groupedAddonConfigurations}
                setAddonConfigurations={setAddonConfigurations}
                onContinue={(activeAddonId, trialAddonId) => {
                  handleContinue({ activeAddonId, trialAddonId });
                }}
                setOrders={setCartOrders}
              />
            )}
          />

          <Redirect to={routes.PRODUCT_SELECTION_PRESCRIPTIONS} />
        </Switch>
      </cartContext.Provider>
    </>
  );
};

export default ProductRouter;
