import React from 'react';

import classNames from 'classnames';
import parse from 'html-react-parser';

import GuidanceItem from './GuidanceItem';
import GuidanceDetails from './GuidanceDetails';

import { IOrderItem, Routine, ProductFamilies } from 'types/plan';

import { iconEvening, iconAnytime, iconMorning, iconFormula } from 'assets/images';

import { en } from 'constants/lang';
import { head } from 'lodash';

interface IIconDetails {
  src: string;
  class: string;
}

const ICON_MAP = new Map<Routine, IIconDetails>([
  [Routine.Evening, { src: iconEvening, class: 'icon-evening' }],
  [Routine.Anytime, { src: iconAnytime, class: '' }],
  [Routine.Morning, { src: iconMorning, class: 'icon-evening' }],
]);

const getIconDetailFor = (routine: Routine, key: keyof IIconDetails) => {
  const iconDetails = ICON_MAP.get(routine);

  return iconDetails ? iconDetails[key] : '';
};

const Regimen: React.FC<{
  orderItems: IOrderItem[];
  disabled?: boolean;
  showDetails: (productFamily: ProductFamilies) => void;
}> = ({ orderItems, showDetails, disabled }) => {
  const orderData: { [key in Routine]: IOrderItem[] } = { Morning: [], Evening: [], Anytime: [] };

  orderItems.forEach((orderItem, index) => {
    if (orderItem.morningEvening in orderData) {
      orderData[orderItem.morningEvening].push(orderItem);
    }
  });

  return (
    <div className="user-plan-regimen mb-6x pr-8x">
      <div className="regimen__header">
        <div className="row">
          <div className="col-2-md"></div>
          <div className="col-5-md">
            <h3 className="d-none d-sm-block">{en.yourPlan.REGIMEN_TITLE}</h3>
          </div>
          <div className="col-5-md">
            <h3 className="d-none d-sm-block">{en.yourPlan.GUIDANCE_TITLE}</h3>
          </div>
        </div>
      </div>
      {Object.keys(orderData).map(
        (key, index) =>
          head(orderData[key as Routine]) && (
            <div key={index} className="regimen__item">
              <div className="row">
                <div className="col-2-md">
                  <h5 className="mb-2x d-flex">
                    <img
                      src={getIconDetailFor(key as Routine, 'src')}
                      className={classNames('mr-2x', 'mt-1x', getIconDetailFor(key as Routine, 'class'))}
                    />
                    {key}
                  </h5>
                </div>
                <div className="col-10-md">
                  {orderData[key as Routine].map((orderItem, index) => (
                    <div key={index} className="row regimen__row">
                      <div className="col-6-md">
                        <h6 className="regimen__title d-block d-sm-none mb-2x mt-4x">Regimen</h6>
                        <ol className="list-style-none pl-2x regimen__list">
                          <li key={index}>
                            <button
                              disabled={disabled}
                              className="btn-link d-flex align-items-start"
                              onClick={() => showDetails(orderItem.productFamily)}
                            >
                              <img src={iconFormula} className="mr-2x mt-1x" />
                              {orderItem.fullName}
                            </button>
                          </li>
                        </ol>
                      </div>
                      <div className="col-6-md">
                        {orderItem.applicationInstructions ? (
                          <>
                            <h6 className="regimen__title d-block d-sm-none mb-2x mt-6x">Guidance</h6>
                            <ul className="pl-6x">
                              <li>{orderItem.applicationInstructions}</li>
                            </ul>
                          </>
                        ) : (
                          ''
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
      )}
    </div>
  );
};

export default Regimen;
