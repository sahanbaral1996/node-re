import * as React from 'react';

import { Auth } from 'aws-amplify';
import { Switch, Route, useHistory } from 'react-router-dom';

import Home from './Home';
import Header from 'components/header/Header';
import Footer from 'components/footer/Footer';
import OnBoard from 'components/onboard/Onboard';
import OrderReview from 'components/orderReview';
import CancelledPaused from './CancelledPaused/CancelledPaused';
import Reassessment from 'components/reassessment';
import GlobalLoader from 'components/common/GlobalLoader';
import HeaderContentLoader from 'components/common/contentLoaders/HeaderContentLoader';
import { OrderStatus } from 'components/orderReview/OrderReview';
import OrderConfirmed from 'components/OrderConfirmed';
import ReUploadPhoto from 'components/reUploadPhoto';
import MyAccount from 'components/myAccount';

import * as routes from 'constants/routes';
import { handleError } from 'utils/errorHandler';
import { IUserProfile, UserStatus } from 'types/profile';

import * as FS from 'services/fullstory';
import { fetchProfile } from 'services/profile';
import OrderOnHold from './OrderOnHold/OrderOnHold';
import AdminRouter from './admin';

export const HomeRouterContext = React.createContext<{
  state: IUserProfile | null;
  dispatch: React.Dispatch<IUserProfileAction>;
}>({
  state: null,
  dispatch: () => {},
});

export enum IUserProfileActionType {
  isLoading,
  isLoaded,
  isUpdated,
}

type IUserProfileAction =
  | {
      type: IUserProfileActionType.isLoaded;
      payload: IUserProfile;
    }
  | {
      type: IUserProfileActionType.isLoading;
    };

export function authReducer(state: IUserProfile | null, action: IUserProfileAction) {
  switch (action.type) {
    case IUserProfileActionType.isLoaded:
      return action.payload;
    case IUserProfileActionType.isLoading:
      return null;
  }
}

const AddFooterHOC = (WrappedComponent: React.FunctionComponent) => (
  <div className="d-flex flex-column justify-content-between content-footer-wrapper">
    <div>
      <WrappedComponent />
    </div>
    <Footer />
  </div>
);

const hasCompletedOnboarding = (status: UserStatus) =>
  status === UserStatus.ImageUploads ||
  status === UserStatus.TrialCreated ||
  status === UserStatus.Active ||
  status === UserStatus.InActive;

const isCancelled = (status: UserStatus) =>
  status === UserStatus.TrialCancelled || status === UserStatus.SubscriptionCancelled;

const isPaused = (status: UserStatus) => status === UserStatus.Paused;

const isCancellationImpending = (status: UserStatus) => status === UserStatus.CancellationImpending;

const ALLOW_BYPASS = [routes.REUPLOAD];
const FORWARD_ROUTE = [
  routes.MY_ACCOUNT,
  routes.MY_ACCOUNT_EMAIL,
  routes.MY_ACCOUNT_PASSWORD,
  routes.REASSESSMENT,
  routes.ORDER_CONFIRMED,
];

const ADMIN_FORWARD_ROUTES = [
  routes.ADMIN_USER_PRODUCT_PAYMENT_INFORMATION,
  routes.ADMIN_USER_PRODUCT_SELECTION_PRESCRIPTIONS,
  routes.ADMIN_USER_REGISTRATION,
];

const HomeRouter: React.FunctionComponent = () => {
  const [state, dispatch] = React.useReducer(authReducer, null);
  const [isLoading, setIsLoading] = React.useState(true);

  const history = useHistory();

  React.useEffect(() => {
    (async () => {
      try {
        const {
          data: { data: profile },
        } = await fetchProfile();

        dispatch({ type: IUserProfileActionType.isLoaded, payload: profile });
      } catch (error) {
        handleError(error);
        await Auth.signOut();
        FS.anonymize();

        history.push(routes.LOGIN);
      }
    })();
  }, [history]);

  React.useEffect(() => {
    if (state?.status) {
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  }, [state, setIsLoading]);

  React.useEffect(() => {
    if (state && state.isAdmin) {
      if (ADMIN_FORWARD_ROUTES.includes(history.location.pathname)) {
        return;
      }

      return history.push(routes.ADMIN_USER);
    }
    // some routes are not restricted by order status so let them bypass the conditions
    if (!state || ALLOW_BYPASS.includes(window.location.pathname)) {
      return;
    }
    if (window.location.pathname === routes.MY_ACCOUNT_REVIEW) {
      return history.push(routes.MY_ACCOUNT_REVIEW);
    }
    if (isCancelled(state?.status)) {
      return history.push(routes.SUBSCRIPTION_CANCELLED);
    }
    if (isPaused(state?.status)) {
      return history.push(routes.SUBSCRIPTION_PAUSED);
    }
    if (isCancellationImpending(state?.status)) {
      return history.push(routes.SUBSCRIPTION_CANCELLED);
    }
    if (state.trialOrderStatus === OrderStatus.PendingApproval) {
      return history.push(routes.ORDER_REVIEW);
    }
    if (state.trialOrderStatus === OrderStatus.OnHold) {
      history.push(routes.ON_HOLD);

      return;
    }
    if (!hasCompletedOnboarding(state?.status)) {
      history.replace(getOnBoardRoute());

      return;
    }

    if (!state.hasOrder) {
      history.push(routes.ORDER_CONFIRMED);

      return;
    }

    history.push(FORWARD_ROUTE.includes(window.location.pathname) ? window.location.pathname : routes.HOME);
  }, [state, history]);

  React.useEffect(() => {
    if (state) {
      const { leadId, name, email } = state;

      leadId && FS.identify(leadId, { displayName: name, email: email });
    }
  }, [state?.leadId]);

  const getOnBoardRoute = () => {
    const {
      FACE_PHOTO,
      REGIMEN_PHOTO,
      STANDALONE_ORDER_CONFIRMED,
      HOME,
      CLINICAL_ASSESSMENT,
      SETUP_SUBSCRIPTION,
      NAME,
      PRODUCT_SELECTION,
    } = routes;

    if (state?.status === UserStatus.Assessment) {
      return PRODUCT_SELECTION;
    } else if (
      state?.status === UserStatus.PaidButTrialNotInitiated ||
      state?.status === UserStatus.BillingInformation
    ) {
      return FACE_PHOTO;
    } else if (state?.status === UserStatus.FacePhotoUploads) {
      return REGIMEN_PHOTO;
    } else if (state?.status === UserStatus.StandaloneOrderConfirmed) {
      return STANDALONE_ORDER_CONFIRMED;
    } else if (state?.status === UserStatus.Complete || state?.status === UserStatus.InPerson) {
      return CLINICAL_ASSESSMENT;
    } else if (state?.status === UserStatus.New) {
      return NAME;
    } else {
      return HOME;
    }
  };

  return !isLoading ? (
    <HomeRouterContext.Provider value={{ state, dispatch }}>
      <Header />
      <Switch>
        <Route exact path={routes.HOME} component={() => AddFooterHOC(Home)} />
        <Route path={routes.ON_BOARD} component={OnBoard} />
        <Route exact path={routes.REASSESSMENT} component={() => AddFooterHOC(Reassessment)} />
        <Route exact path={routes.ORDER_REVIEW} component={() => AddFooterHOC(OrderReview)} />
        <Route exact path={routes.ORDER_CONFIRMED} component={() => AddFooterHOC(OrderConfirmed)} />
        <Route exact path={routes.ON_HOLD} component={() => AddFooterHOC(OrderOnHold)} />
        <Route exact path={routes.REUPLOAD} component={() => AddFooterHOC(ReUploadPhoto)} />
        <Route exact path={routes.SUBSCRIPTION_PAUSED} component={() => AddFooterHOC(CancelledPaused)} />
        <Route exact path={routes.SUBSCRIPTION_CANCELLED} component={() => AddFooterHOC(CancelledPaused)} />
        <Route path={routes.MY_ACCOUNT} component={() => <MyAccount />} />
        <Route path={routes.ADMIN_USER} component={AdminRouter} />
      </Switch>
    </HomeRouterContext.Provider>
  ) : (
    <React.Fragment>
      <HeaderContentLoader />
      <GlobalLoader />
    </React.Fragment>
  );
};

export default HomeRouter;
