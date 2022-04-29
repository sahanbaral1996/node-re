import * as React from 'react';

import { RouteComponentProps, Route, RouteProps, Redirect } from 'react-router';

import * as routes from 'constants/routes';

import { checkAuthentication } from 'services/auth';

interface IPublicRouteProps extends RouteProps {
  component: React.ComponentType<RouteComponentProps>;
}

const PublicRoute: React.FC<IPublicRouteProps> = ({ component: Component, ...restProps }) => {
  return (
    <Route
      {...restProps}
      render={(routeProps: RouteComponentProps) =>
        checkAuthentication() ? <Redirect to={routes.HOME} /> : <Component {...routeProps} />
      }
    />
  );
};

export default PublicRoute;
