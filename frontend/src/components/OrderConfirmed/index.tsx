import * as React from 'react';

import PersonalizedSolution from 'components/home/PersonalizedSolution';
import { useHistory } from 'react-router-dom';

import { en } from 'constants/lang';
import { HomeRouterContext, IUserProfileActionType } from 'components/home/Router';
import * as routes from 'constants/routes';
import { UserStatus } from 'types/profile';

const OrderConfirmed: React.FunctionComponent = () => {
  const { state: userProfile } = React.useContext(HomeRouterContext);
  const history = useHistory();

  if (userProfile?.status === UserStatus.Active) {
    history.push(routes.HOME);
  }

  return (
    <React.Fragment>
      <PersonalizedSolution disableSkinDetails />
      <div className="container">
        <div className="order-confirmed__container mx-auto text-center">
          <p className="order-confirmed__title">{en.orderConfirmed.TITLE}</p>
          <p className="order-confirmed__description">{en.orderConfirmed.DESCRIPTION}</p>
        </div>
      </div>
    </React.Fragment>
  );
};

export default OrderConfirmed;
