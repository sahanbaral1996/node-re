import React from 'react';

import { Switch, Route, Redirect } from 'react-router-dom';

import * as routes from 'constants/routes';
import RegistrationForm from './userRegistration';
import ProductSelection from './subscription/productSelection';
import AdminRegistrationCompleted from 'components/RegistrationCompleted';
import PaymentInformation from './subscription/payment';
import { IAddonOrder, productCategory } from 'types/shoppingCart';
import { handleError } from 'utils/errorHandler';
import { getAddonOrders } from 'services/shoppingcart';
import useMountedRef from 'hooks/useMountedRef';

const INITIAL_ADDON_CONFIGURATIONS = {
  Wash: [],
  Moisturizer: [],
  SpotTreatment: [],
  Boost: [],
};

const AdminRouter: React.FC = () => {
  const [orders, setOrders] = React.useState<IAddonOrder[]>([]);
  const [isAddonLoaded, setIsAddonLoaded] = React.useState(false);
  const [addonConfigurations, setAddonConfigurations] = React.useState<Record<productCategory, IAddonOrder[]>>(
    INITIAL_ADDON_CONFIGURATIONS
  );
  const mountRef = useMountedRef();

  const addSpotTreatmentToCart = (data: Record<productCategory, IAddonOrder[]>, isSelected: boolean) => {
    const spotTreatment = data.SpotTreatment[0];

    spotTreatment.isSelected = isSelected;
    setOrders([...orders, spotTreatment]);
  };

  // reset orders for new user
  const resetSpotTreatmentSelection = () => {
    if (isAddonLoaded) {
      const spotTreatmentAddon = addonConfigurations.SpotTreatment[0];

      const newCart = orders.map(item => {
        if (item.name === spotTreatmentAddon.name) {
          return {
            ...item,
            isSelected: false,
          };
        }

        return item;
      });

      setOrders(newCart);
    }
  };

  React.useEffect(() => {
    (async () => {
      try {
        const orderData = await getAddonOrders();

        if (mountRef.current) {
          setAddonConfigurations(orderData.data.orders);
          addSpotTreatmentToCart(orderData.data.orders, false);
          setIsAddonLoaded(true);
        }
      } catch (err) {
        handleError(err);
      }
    })();
  }, []);

  return (
    <Switch>
      <Route
        exact
        path={routes.ADMIN_USER_REGISTERED}
        component={() => <AdminRegistrationCompleted resetSpotTreatmentSelection={resetSpotTreatmentSelection} />}
      />
      <Route
        exact
        path={routes.ADMIN_USER_REGISTRATION}
        render={() => <RegistrationForm resetSpotTreatmentSelection={resetSpotTreatmentSelection} />}
      />
      <Route
        exact
        path={routes.ADMIN_USER_PRODUCT_SELECTION_PRESCRIPTIONS}
        render={() => (
          <ProductSelection
            orders={orders}
            isAddonLoaded={isAddonLoaded}
            addonConfigurations={addonConfigurations}
            setOrders={setOrders}
          />
        )}
      />
      <Route
        exact
        path={routes.ADMIN_USER_PRODUCT_PAYMENT_INFORMATION}
        component={() => (
          <PaymentInformation orders={orders} resetSpotTreatmentSelection={resetSpotTreatmentSelection} />
        )}
      />
      <Redirect to={routes.ADMIN_USER_REGISTRATION} />
    </Switch>
  );
};

export default AdminRouter;
