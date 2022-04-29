import * as React from 'react';

import { RouteComponentProps, Route, RouteProps, Redirect, useHistory } from 'react-router';

import * as routes from 'constants/routes';

import { checkAuthentication } from 'services/auth';

interface IPrivateRouteProps extends RouteProps {
  component: React.ComponentType<RouteComponentProps>;
}

const PrivateRoute: React.FC<IPrivateRouteProps> = ({ component: Component, ...restProps }) => {
  const history = useHistory();

  return (
    <Route
      {...restProps}
      render={(routeProps: RouteComponentProps) =>
        checkAuthentication() ? (
          <Component {...routeProps} />
        ) : (
          <Redirect to={{ pathname: routes.LOGIN, state: { from: history.location } }} />
        )
      }
    />
  );
};

export default PrivateRoute;
