import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { en } from 'constants/lang/lang';
import * as routes from 'constants/routes';
import { HomeRouterContext } from 'components/home/Router';
import { handleError } from 'utils/errorHandler';
import { interpolate } from 'utils/string';

import ContentLoader from 'react-content-loader';

import { differenceInDays, startOfDay, format } from 'date-fns';

import { retreiveSubscription } from 'services/subscription';

import { IManageSubscriptionProps, ISubscription } from 'types/subscription';
import { getDurationInDaysBetweenDates } from 'utils/date';
import { capitalize } from 'utils/string';

const ManageSubscription: React.FC<IManageSubscriptionProps> = ({ handleChange }) => {
  const { state: userProfile, dispatch } = React.useContext(HomeRouterContext);

  const [subscription, setSubscription] = React.useState<ISubscription>({
    nextBillingAt: 0,
    trialEnd: 0,
    status: '',
    shippingAddress: {
      line1: '',
      line2: '',
      city: '',
      stateCode: '',
      zip: 0,
    },
  });

  const [customer, setCustomer] = React.useState<{
    billingAddress: {
      line1: string;
      line2: string;
      city: string;
      stateCode: string;
      zip: number;
    };
  }>({
    billingAddress: {
      line1: '',
      line2: '',
      city: '',
      stateCode: '',
      zip: 0,
    },
  });

  const [card, setCard] = React.useState<{ maskedNumber: string }>({ maskedNumber: '' });
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      if (userProfile) {
        try {
          const data = (await retreiveSubscription()).data.data;

          setCard(data.card);
          setSubscription(data.subscription);
          setCustomer(data.customer);
          setIsLoaded(true);
        } catch (err) {
          handleError(err);
        }
      }
    })();
  }, [userProfile]);

  const getTrialRemainingDays = (trialEnd: number) => {
    return getDurationInDaysBetweenDates({ startDate: new Date(), endDate: new Date(trialEnd * 1000) });
  };

  const formattedDate = (date: number) => {
    return format(new Date(date * 1000), 'do MMMM yyyy');
  };

  const DataLoader: React.FC = () => (
    <>
      <ContentLoader viewBox="0 0 100 10">
        <rect x="0" y="0" width="100" height="4" />
      </ContentLoader>
    </>
  );

  return (
    <>
      <h3 className="account-form__header mb-6x">Manage Subscription</h3>
      <div className="account-info__wrapper mb-6x">
        <h5 className="account-form__header">Subscription Detail</h5>
        <div className="mt-1x account-setting__table">
          <div className="row">
            <div className="user-information-table-data mb-1x mb-0x-sm col-3-sm">Current Plan</div>
            <div className="user-information-table-value col-9-sm">
              <div className="table-value">
                {isLoaded ? (
                  subscription.status === 'in_trial' ? (
                    interpolate(en.subscription.ORDER_SUMMARY.TRIAL_REMAINING.DAYS, {
                      getTrialRemainingDays: getTrialRemainingDays(subscription.trialEnd),
                    })
                  ) : (
                    capitalize(subscription.status)
                  )
                ) : (
                  <DataLoader />
                )}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="user-information-table-data mb-1x mb-0x-sm col-3-sm">Next Billing date</div>
            <div className="user-information-table-value col-9-sm">
              <div className="table-value">
                {isLoaded ? (
                  subscription.nextBillingAt ? (
                    formattedDate(subscription.nextBillingAt)
                  ) : (
                    ''
                  )
                ) : (
                  <DataLoader />
                )}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="user-information-table-data mb-1x mb-0x-sm col-3-sm">Shipping Address</div>
            <div className="user-information-table-value col-9-sm">
              <div className="table-value">
                {isLoaded ? (
                  <>
                    {' '}
                    {subscription.shippingAddress.line1 || ''} {subscription.shippingAddress.line2 || ''}
                    <br />
                    {subscription.shippingAddress.city} {subscription.shippingAddress.stateCode}{' '}
                    {subscription.shippingAddress.zip}
                  </>
                ) : (
                  <DataLoader />
                )}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="user-information-table-data mb-1x mb-0x-sm col-3-sm">Billing Address </div>
            <div className="user-information-table-value col-9-sm">
              <div className="table-value">
                {isLoaded ? (
                  <>
                    {customer.billingAddress.line1 || ''} {customer.billingAddress.line2 || ''}
                    <br />
                    {customer.billingAddress.city} {customer.billingAddress.stateCode}
                    {customer.billingAddress.zip}
                  </>
                ) : (
                  <DataLoader />
                )}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="user-information-table-data mb-1x mb-0x-sm col-3-sm">Billing Information </div>
            <div className="user-information-table-value col-9-sm">
              <div className="table-value">
                {isLoaded ? (
                  `Card ending with ${card.maskedNumber.slice(card.maskedNumber.lastIndexOf('*') + 1)}`
                ) : (
                  <DataLoader />
                )}
              </div>
            </div>
          </div>
          <div className="row mt-5x">
            <div className="user-information-table-data mb-1x mb-0x-sm col-3-sm">
              <a href="#" onClick={handleChange} style={{ color: '#B91F56', textDecoration: 'underline' }}>
                Change
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageSubscription;
