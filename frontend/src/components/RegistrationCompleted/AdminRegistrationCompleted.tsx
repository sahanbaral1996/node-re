import * as React from 'react';
import HeaderLine from 'components/common/HeaderLine';
import Button from 'components/common/button';
import { Check } from 'assets/images';
import { en } from 'constants/lang';
import { useHistory, useLocation } from 'react-router-dom';
import { handleError } from 'utils/errorHandler';
import ContentLoader from 'react-content-loader';
import { IAdminLead } from 'types/admin';
import * as routes from 'constants/routes';

import { getLeadFromId } from 'services/users';

const INITIAL_IADMINLEAD: IAdminLead = {
  email: '',
  name: '',
  attributes: { type: '', url: '' },
  dOB: '',
  firstName: '',
  homeState: '',
  iagreetoNoPPandTOA: false,
  iagreetoreceivefrequentmarketing: false,
  id: '',
  lastName: '',
  phone: '',
  status: '',
};

const { userRegistration } = en;

/**
 * Props for AdminRegistrationCompleted.
 *
 * @param { () => void } resetSpotTreatmentSelection - Callback to clear order state.
 *
 */
type AdminRegistrationCompletedProps = {
  resetSpotTreatmentSelection: () => void;
};

const AdminRegistrationCompleted = ({ resetSpotTreatmentSelection }: AdminRegistrationCompletedProps) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [lead, setLead] = React.useState<IAdminLead>(INITIAL_IADMINLEAD);
  const history = useHistory();
  // fetch query from url
  const useQueryString = () => {
    const location = useLocation();

    return new URLSearchParams(location.search);
  };

  const queryString = useQueryString();
  const leadId = queryString.get('id') as string;

  // redirect if no id query parameter
  if (!leadId) {
    history.push(`${routes.ADMIN_USER_REGISTRATION}`);
  }

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getLeadFromId(leadId);
        const { data } = response;

        const leadData: IAdminLead = data.data;

        setLead(leadData);
        setIsLoading(false);
      } catch (error) {
        handleError(error, { title: 'Invalid user', message: 'Please start over' });
        history.push(routes.ADMIN_USER_REGISTRATION);
      }
    };

    fetchData();
  }, []);
  const handleClick = () => {
    resetSpotTreatmentSelection();
    history.push(routes.ADMIN_USER_REGISTRATION);
  };

  return (
    <div>
      <HeaderLine />
      <div className="user-registration__wrapper">
        <div className="text-center">
          <div className="mt-10x mb-3x">
            <img src={Check} alt="img" />
          </div>
          <h3 className="admin-registration-Completed-header mb-2x">
            {userRegistration.REGISTRATION_COMPLETED.HEADER}
          </h3>
          <p className="admin-registration-Completed-description">{userRegistration.REGISTRATION_COMPLETED.DESC}</p>

          {!isLoading && lead ? (
            <div className="my-6x">
              <p className="admin-registration-Completed-username">{lead.name}</p>
              <p className="admin-registration-Completed-email">{lead.email}</p>
            </div>
          ) : (
            <>
              <ContentLoader viewBox="0 0 100 10">
                <rect x="0" y="0" width="100" height="4" />
              </ContentLoader>
            </>
          )}
          <Button onClick={handleClick}>Create new user</Button>
        </div>
      </div>
    </div>
  );
};

export default AdminRegistrationCompleted;
