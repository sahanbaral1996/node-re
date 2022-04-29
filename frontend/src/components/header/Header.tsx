import * as React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Auth } from 'aws-amplify';

import { anonymize } from 'services/fullstory';
import { checkAuthentication } from 'services/auth';

import logo from 'assets/images/logo.svg';
import { HomeRouterContext, IUserProfileActionType } from 'components/home/Router';
import { en } from 'constants/lang';
import { handleError } from 'utils/errorHandler';

import { IUserProfile, UserStatus } from 'types/profile';

import * as routes from 'constants/routes';
import classNames from 'classnames';
import Button from 'components/common/button';

interface HeaderProps {
  showGetStarted?: boolean;
  showLogin?: boolean;
  className?: string;
}

const isMyAccountVisible = (userProfile: IUserProfile) => {
  return (
    (userProfile.status === UserStatus.Active || userProfile.status === UserStatus.InactiveCCDeclined) &&
    !userProfile.isAdmin
  );
};

const Header: React.FC<HeaderProps> = ({ showGetStarted = false, showLogin = false, className = '' }) => {
  const { state: userProfile, dispatch } = React.useContext(HomeRouterContext);

  const isAuthenticated = checkAuthentication();
  const history = useHistory();

  const handleLogOutClick = async () => {
    try {
      await Auth.signOut();
      anonymize();

      history.push(routes.LOGIN);
    } catch (err) {
      handleError(err);
    }
  };

  const handleHomeClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    if (userProfile) {
      dispatch({ type: IUserProfileActionType.isLoaded, payload: { ...userProfile } });
    }
    history.push(routes.INITIAL);
  };

  const showUserMenu = (): boolean => {
    return !!isAuthenticated && !!userProfile;
  };

  return (
    <header className={classNames(className, 'site-header small--hide app-header')}>
      <div className="header-layout">
        <a href={routes.REVEA_LANDING}>
          <img src={logo} alt="Docent logo" className="app-logo" />
        </a>
        {showUserMenu() && userProfile ? (
          isMyAccountVisible(userProfile) ? (
            history.location.pathname !== routes.MY_ACCOUNT ? (
              <Link to={routes.MY_ACCOUNT} className="header__link">
                {en.header.ACCOUNT_MENU_TEXT}
              </Link>
            ) : (
              <a href={routes.INITIAL} onClick={handleHomeClick} className="header__link">
                {en.header.HOME}
              </a>
            )
          ) : (
            <Button type="button" color="transparent" onClick={handleLogOutClick} className="header__link">
              {en.header.LOG_OUT_TEXT}
            </Button>
          )
        ) : null}

        {!isAuthenticated && showGetStarted && (
          <Link to={routes.ELIGIBILITY} className="header__link">
            {en.header.GET_STARTED}
          </Link>
        )}

        {!isAuthenticated && showLogin && (
          <Link to={routes.LOGIN} className="header__link">
            {en.header.LOGIN}
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
