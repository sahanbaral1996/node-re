import { ADMIN_USER } from 'constants/routes';
import React from 'react';
import ContentLoader from 'react-content-loader';
import { Link } from 'react-router-dom';
import { IAdminLead } from 'types/admin';

interface UserDetailsCardProps {
  isReady: boolean;
  lead: IAdminLead;
  resetSpotTreatmentSelection: () => void;
}

const UserDetailsCard: React.FunctionComponent<UserDetailsCardProps> = ({
  isReady,
  lead,
  resetSpotTreatmentSelection,
}) => {
  return (
    <div className="container">
      <div className="row justify-content-end">
        <div className="col-12">
          <div className="user-details-card">
            <div className="user-details-card-wrapper">
              <div className="title row justify-content-end">Creating User</div>
              <div className="name row justify-content-end">
                {isReady ? (
                  lead?.name
                ) : (
                  <div className="col-4 loader">
                    <ContentLoader viewBox="0 0 100 5">
                      <rect x="0" y="0" width="100" height="5" />
                    </ContentLoader>
                  </div>
                )}
              </div>
              <div className="email row justify-content-end">
                {isReady ? (
                  lead?.email
                ) : (
                  <div className="col-4 loader">
                    <ContentLoader viewBox="0 0 100 5">
                      <rect x="0" y="0" width="100" height="5" />
                    </ContentLoader>
                  </div>
                )}
              </div>
              <div className="restart row justify-content-end">
                Want to start over?&nbsp;
                <span className="create-new-user">
                  <Link to={ADMIN_USER} onClick={resetSpotTreatmentSelection}>
                    Create new user
                  </Link>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsCard;
