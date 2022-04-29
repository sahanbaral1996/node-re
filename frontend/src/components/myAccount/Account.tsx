import * as React from 'react';

import Auth from '@aws-amplify/auth';
import { NavLink, Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';

import Email from './Email';
import Password from './Password';
import ManageSubscription from './ManageSubscription';
import HeaderLine from 'components/common/HeaderLine';

import { handleError } from 'utils/errorHandler';

import { checkAuthentication } from 'services/auth';
import * as subscriptionService from 'services/subscription';
import { anonymize } from 'services/fullstory';

import { en } from 'constants/lang';
import * as routes from 'constants/routes';
import UserInformation from './UserInformation';
import ContactInfo from './ContactInfo';

import { HomeRouterContext, IUserProfileActionType } from 'components/home/Router';
import { UserStatus } from 'types/profile';
import ManageProductSelection from './ManageProductSelection';
import Footer from 'components/footer/Footer';
import Review from './Review';

const Account: React.FunctionComponent = () => {
  const isAuthenticated = checkAuthentication();
  const history = useHistory();
  const { path } = useRouteMatch();
  const { state: userProfile, dispatch } = React.useContext(HomeRouterContext);

  React.useEffect(() => {
    if (isAuthenticated) {
      subscriptionService.setPortalSession();
    }
  }, [isAuthenticated]);

  const handleMyAccountClick = () => {
    subscriptionService.openPortal({
      subscriptionCancelled: () => {
        if (userProfile) {
          dispatch({
            type: IUserProfileActionType.isLoaded,
            payload: {
              ...userProfile,
              status: UserStatus.CancellationImpending,
            },
          });
        }
      },
    });
  };

  const handleLogOutClick = async () => {
    try {
      await Auth.signOut();
      anonymize();

      history.push(routes.LOGIN);
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <React.Fragment>
      <HeaderLine />
      <div className="account-container">
        <div className="container">
          <div className="col-9-lg mx-auto">
            <div className="row">
              <div className="col-4-md mb-6x mb-0x-md">
                <h3 className="mb-6x">{en.account.SETTINGS}</h3>
                <ul className="account__nav">
                  <li>
                    <button type="button" onClick={handleMyAccountClick}>
                      {en.account.nav.ACCOUNT}
                    </button>
                  </li>
                  <li>
                    <NavLink to={routes.MY_ACCOUNT_SUBSCRIPTION} activeClassName="active">
                      {en.account.nav.SUBSCRIPTION}
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to={routes.MANAGE_PRODUCT_SELECTION} activeClassName="active">
                      {en.account.nav.PRODUCT_SELECTION}
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to={routes.MY_ACCOUNT_EMAIL} activeClassName="active">
                      {en.account.nav.EMAIL}
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to={routes.MY_ACCOUNT_PASSWORD} activeClassName="active">
                      {en.account.nav.PASSWORD}
                    </NavLink>
                  </li>
                  <li>
                    <button type="button" onClick={handleLogOutClick}>
                      {en.account.nav.LOGOUT}
                    </button>
                  </li>
                  <li>
                    <NavLink to={routes.LEAVE_REVIEW} activeClassName="active">
                      {en.account.nav.LEAVE_REVIEW}
                    </NavLink>
                  </li>
                </ul>
              </div>
              <div className="account__body col-8-md">
                <Switch>
                  <Route path={routes.MY_ACCOUNT_EMAIL}>
                    <Email />
                  </Route>
                  <Route path={routes.MY_ACCOUNT_SUBSCRIPTION}>
                    <ManageSubscription handleChange={handleMyAccountClick} />
                  </Route>
                  <Route path={routes.MANAGE_PRODUCT_SELECTION}>
                    <ManageProductSelection />
                  </Route>
                  <Route path={routes.MY_ACCOUNT_PASSWORD}>
                    <Password />
                  </Route>
                  <Route path={routes.LEAVE_REVIEW}>
                    <Review />
                  </Route>
                  <Route exact path={path}>
                    <UserInformation />
                    <ContactInfo />
                  </Route>
                </Switch>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
};

export default Account;
