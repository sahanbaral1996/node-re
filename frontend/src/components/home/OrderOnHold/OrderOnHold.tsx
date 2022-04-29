import * as React from 'react';

import PersonalizedSolution from 'components/home/PersonalizedSolution';

import { en } from 'constants/lang';

const OrderOnHold: React.FunctionComponent = () => (
  <React.Fragment>
    <PersonalizedSolution disableSkinDetails />
    <div className="container">
      <div className="order-confirmed__container mx-auto text-center">
        <p className="order-confirmed__title">{en.orderOnHold.TITLE}</p>
        <p className="order-confirmed__description">{en.orderOnHold.DESCRIPTION}</p>
      </div>
    </div>
  </React.Fragment>
);

export default OrderOnHold;
