import * as React from 'react';

import { CardComponentProps } from 'types/personalizedSolution';
import { OrderIllustration } from 'assets/images';

const Card: React.FunctionComponent<CardComponentProps> = ({ title, children }) => (
  <div className="card bg-white card__container card_wrapper">
    <div className="card__detail">
      <div className="pr-md-5">
        <h3 className="card__title order-review__title">{title}</h3>
      </div>
      {children}
    </div>
    <img src={OrderIllustration} className="order-illustration" />
  </div>
);

export default Card;
