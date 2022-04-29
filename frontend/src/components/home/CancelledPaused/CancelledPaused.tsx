import * as React from 'react';
import Button from 'components/common/button';
import { HomeRouterContext, IUserProfileActionType } from 'components/home/Router';
import { IUserProfile, UserStatus } from 'types/profile';
import { Link } from 'react-router-dom';

import { checkAuthentication } from 'services/auth';
import * as subscriptionService from 'services/subscription';
import PersonalizedSolution from 'components/home/PersonalizedSolution';
import { reactivateSubscription } from 'services/subscription';
import { useHistory } from 'react-router-dom';
import ContentLoader from 'react-content-loader';
import { handleError } from 'utils/errorHandler';
import * as routes from 'constants/routes';

import { en } from 'constants/lang';

const CancelledPaused: React.FunctionComponent = () => {
  const history = useHistory();
  const { state: userProfile, dispatch } = React.useContext(HomeRouterContext);
  const isAuthenticated = checkAuthentication();

  const [reactivated, setReactivated] = React.useState(false);

  React.useEffect(() => {
    if (isAuthenticated) {
      subscriptionService.setPortalSession();
    }
  }, [isAuthenticated]);

  const handleReactivateClick = () => {
    setReactivated(true);
    (async () => {
      try {
        const data = await reactivateSubscription();

        setReactivated(false);
        history.push(routes.HOME);
      } catch (err) {
        handleError(err);
      }
    })();
  };

  const handleResumeClick = () => {
    subscriptionService.openPortal();
  };

  return (
    <React.Fragment>
      <PersonalizedSolution disableSkinDetails />
      <div className="container">
        <div className="order-confirmed__container mx-auto text-center">
          {userProfile && userProfile.status === UserStatus.Paused ? (
            <>
              <p className="order-confirmed__title">{en.subscription.ORDER_SUMMARY.SUBSCRIPTION_PAUSED.TITLE}</p>
              <p className="order-confirmed__description">
                {en.subscription.ORDER_SUMMARY.SUBSCRIPTION_PAUSED.DESCRIPTION}
              </p>
              <p className="order-confirmed__description1 mt-5x">
                {en.subscription.ORDER_SUMMARY.SUBSCRIPTION_PAUSED.DESCRIPTION1}
                <span className="order-confirmed__email"> support@docentrx.com</span>
                {en.subscription.ORDER_SUMMARY.SUBSCRIPTION_PAUSED.DESCRIPTION2}
              </p>
              <p className="order-confirmed__description mt-5x">
                {en.subscription.ORDER_SUMMARY.SUBSCRIPTION_PAUSED.EMAIL_DESC}
                <a href="mailto:support@docentrx.com">support@docentrx.com</a>
              </p>
            </>
          ) : null}
          {userProfile &&
          (userProfile.status === UserStatus.SubscriptionCancelled ||
            userProfile.status === UserStatus.CancellationImpending) ? (
            <>
              <p className="order-confirmed__title">{en.subscription.ORDER_SUMMARY.SUBSCRIPTION_CANCELLED.TITLE}</p>
              <p className="order-confirmed__description">
                {en.subscription.ORDER_SUMMARY.SUBSCRIPTION_CANCELLED.DESCRIPTION}
              </p>
              <p className="order-confirmed__description1 mt-5x">
                {en.subscription.ORDER_SUMMARY.SUBSCRIPTION_CANCELLED.DESCRIPTION1}
                <span className="order-confirmed__email"> support@docentrx.com</span>
                {en.subscription.ORDER_SUMMARY.SUBSCRIPTION_CANCELLED.DESCRIPTION2}
              </p>
              <p className="order-confirmed__description mt-5x">
                {en.subscription.ORDER_SUMMARY.SUBSCRIPTION_CANCELLED.EMAIL_DESC}
                <a href="mailto:support@docentrx.com">support@docentrx.com</a>
              </p>
            </>
          ) : null}
        </div>
      </div>
    </React.Fragment>
  );
};

export default CancelledPaused;
