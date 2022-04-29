import { HomeRouterContext, IUserProfileActionType } from 'components/home/Router';
import * as React from 'react';
import * as routes from 'constants/routes';
import { NavLink } from 'react-router-dom';

const ContactInfo: React.FunctionComponent = () => {
  const { state: userProfile, dispatch } = React.useContext(HomeRouterContext);

  return (
    <div className="account-info__wrapper">
      <h5 className="account-form__header">Contact Info</h5>
      <div className="mt-1x account-setting__table">
        <div className="row">
          <div className="user-information-table-data col-3-md">Phone</div>
          <div className="user-information-table-value col-9-md">
            <div className="table-value">{userProfile ? userProfile.phone : ''}</div>
          </div>
        </div>
        <div className="row">
          <div className="user-information-table-data col-3-md">Email</div>
          <div className="user-information-table-value col-9-md">
            <div className="table-value d-flex justify-content-between">
              <div className="table-value email">{userProfile ? userProfile.email : ''}</div>
              <NavLink to={routes.MY_ACCOUNT_EMAIL} className="btn-link btn-link--secondary">
                {' '}
                Change{' '}
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
