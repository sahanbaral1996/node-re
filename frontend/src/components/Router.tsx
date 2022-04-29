import * as React from 'react';
import { Router as BrowserRouter, Switch } from 'react-router-dom';

import history from 'utils/history';

import * as routes from 'constants/routes';

import config from 'config';

import Home from './home';
import Design from './design';

import CognitoAuth from './auth/CognitoAuth';
import PublicRoute from './auth/PublicRoute';
import PrivateRoute from './auth/PrivateRoute';
import ResetPassword from './auth/ResetPassword';
import ForgotPassword from './auth/ForgotPassword';
import Eligibility from './eligibility';
import AccountCreation from './accountCreation';

// Top level application router.
const Router: React.FC = () => {
  return (
    <BrowserRouter history={history}>
      <Switch>
        <PublicRoute exact path={routes.ELIGIBILITY} component={Eligibility} />
        <PublicRoute exact path={routes.FORGOT_PASSWORD} component={ForgotPassword} />
        <PublicRoute exact path={routes.ACCOUNT_CREATION} component={AccountCreation} />
        <PublicRoute exact path={routes.RESET_PASSWORD} component={ResetPassword} />
        <PublicRoute exact path={routes.LOGIN} component={CognitoAuth} />
        {config.env !== 'production' ? <PublicRoute path={routes.DESIGN} component={Design} /> : null}
        <PrivateRoute path={routes.INITIAL} component={Home} />
      </Switch>
    </BrowserRouter>
  );
};

export default Router;
