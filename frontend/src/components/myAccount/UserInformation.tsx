import { HomeRouterContext, IUserProfileActionType } from 'components/home/Router';
import * as React from 'react';
import * as routes from 'constants/routes';
import { NavLink } from 'react-router-dom';
import { en } from 'constants/lang/lang';

const UserInformation: React.FunctionComponent = () => {
  const { state: userProfile } = React.useContext(HomeRouterContext);

  return (
    <>
      <h3 className="account-form__header mb-6x">{en.account.USER_INFORMATION}</h3>
      <div className="account-info__wrapper mb-6x">
        <h5 className="account-form__header">Basic Info</h5>
        <div className="mt-1x account-setting__table">
          <div className="row">
            <div className="user-information-table-data mb-1x mb-0x-sm col-3-sm">Full Name</div>
            <div className="user-information-table-value col-9-sm">
              <div className="table-value">{userProfile ? userProfile.name : ''}</div>
            </div>
          </div>
          <div className="row">
            <div className="user-information-table-data mb-1x mb-0x-sm col-3-sm">Email</div>
            <div className="user-information-table-value col-9-sm">
              <div className="table-value email">{userProfile ? userProfile.email : ''}</div>
            </div>
          </div>
          <div className="row">
            <div className="user-information-table-data mb-1x mb-0x-sm col-3-sm">Birth Date</div>
            <div className="user-information-table-value col-9-sm">
              <div className="table-value">{userProfile ? userProfile.dOB : ''}</div>
            </div>
          </div>
          <div className="row">
            <div className="user-information-table-data mb-1x mb-0x-sm col-3-sm">Physician</div>
            <div className="user-information-table-value col-7-sm">
              <div className="table-value">{userProfile ? `Dr.${userProfile.physician}` : ''}</div>
            </div>
          </div>
          <div className="row">
            <div className="user-information-table-data mb-1x mb-0x-sm col-3-sm">State</div>
            <div className="user-information-table-value col-9-sm">
              <div className="table-value">California</div>
            </div>
          </div>
          <div className="row">
            <div className="user-information-table-data mb-1x mb-0x-sm col-3-sm">Password</div>
            <div className="user-information-table-value col-9-sm">
              <div className="table-value d-flex justify-content-between">
                ********
                <NavLink to={routes.MY_ACCOUNT_PASSWORD} className="btn-link btn-link--secondary">
                  {' '}
                  Change{' '}
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserInformation;
