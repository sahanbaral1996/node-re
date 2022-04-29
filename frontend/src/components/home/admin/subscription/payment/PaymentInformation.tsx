import * as React from 'react';

import { useFormik } from 'formik';

import {
  ISubscriptionFormValues,
  CardReference,
  ISubscriptionProps,
  SubscriptionAPIErrors,
  SubscriptionEstimateState,
  IPaymentInformationProps,
} from 'types/subscription';

import config from 'config';

import { HomeRouterContext } from 'components/home/Router';
import { adminCreatePerson, createSubscription } from 'services/subscription';
import { handleError } from 'utils/errorHandler';

import setupSubscriptionSchema from 'schemas/setupSubscription';

import { en } from 'constants/lang';
import * as FS from 'services/fullstory';
import useMountedRef from 'hooks/useMountedRef';

import { estimateSubscription } from 'services/subscription';

import AdminOrder from './AdminOrder';
import Button from 'components/common/button';
import Coupon from 'components/subscription/Coupon';
import UserDetailsCard from '../UserDetailsCard';
import { useHistory, useLocation } from 'react-router-dom';
import { IAdminLead, IAdminProductSelectionProps } from 'types/admin';
import { success } from 'utils/toast';
import {
  ADMIN_USER_REGISTERED,
  ADMIN_USER,
  ADMIN_USER_PRODUCT_SELECTION_PRESCRIPTIONS,
  ADMIN_USER_REGISTRATION,
} from 'constants/routes';
import HeaderLine from 'components/common/HeaderLine';
import { getLeadFromId } from 'services/users';
import FormElements from 'components/subscription/FormElements';
import { IAddonOrder } from 'types/shoppingCart';

const { FORM } = en.subscription;

const INITIAL_SUBSCRIPTION_VALUES: ISubscriptionFormValues = {
  shippingAddress: {
    lineOne: '',
    lineTwo: '',
    city: '',
    state: 'California',
    country: 'US',
    zip: '',
  },
  isSameAsShippingAddress: false,
  billingAddress: {
    lineOne: '',
    lineTwo: '',
    city: '',
    zip: '',
    state: '',
    country: 'US',
  },
  card: {
    token: '',
    type: '',
    number: '',
    expiry: '',
    cvv: '',
    transaction: '',
  },
  phone: '',
  coupon: '',
};

const INITIAL_ESTIMATE_STATE: SubscriptionEstimateState = {
  isLoaded: false,
  data: null,
};

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

/**
 * Props for PaymentInformation.
 *
 * @param { IAddonOrder[] } orders Order state.
 * @param { () => void } resetSpotTreatmentSelection Callback to clear order state.
 *
 */
type PaymentInformationProps = {
  orders: IAddonOrder[];
  resetSpotTreatmentSelection: () => void;
};

/**
 * Main ProductInformation Component.
 *
 * @param { PaymentInformationProps } PaymentInformationProps Orders, resetSpotTreatmentSelection for order state and reset order state.
 *
 */
const PaymentInformation = ({ orders, resetSpotTreatmentSelection }: PaymentInformationProps) => {
  const history = useHistory();
  const cardRef = React.useRef<CardReference>(null);
  const { state: userProfile } = React.useContext(HomeRouterContext);
  const [isInitialized, setIsInitialized] = React.useState(false);
  const [isCardLoaded, setIsCardLoaded] = React.useState(false);
  const mountRef = useMountedRef();
  const [estimateState, setEstimateState] = React.useState<SubscriptionEstimateState>(INITIAL_ESTIMATE_STATE);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [lead, setLead] = React.useState<IAdminLead>(INITIAL_IADMINLEAD);

  const formik = useFormik({
    initialValues: INITIAL_SUBSCRIPTION_VALUES,
    validationSchema: setupSubscriptionSchema,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        if (cardRef && cardRef.current && userProfile) {
          const { card, isSameAsShippingAddress, coupon, ...rest } = values;
          const { billingAddress, shippingAddress } = rest;
          const actualBillingAddress = isSameAsShippingAddress ? shippingAddress : billingAddress;

          let token;

          try {
            const response = await cardRef.current.tokenize({
              billingAddress: {
                addressLine1: actualBillingAddress.lineOne,
                addressLine2: actualBillingAddress.lineTwo,
                city: actualBillingAddress.city,
                zip: actualBillingAddress.zip,
                state: actualBillingAddress.state,
                countryCode: actualBillingAddress.country,
              },
            });

            token = response.token;
          } catch (error) {
            if (error.code === SubscriptionAPIErrors.CHARGE_BEE_CLIENT_ERROR) {
              return setFieldError('card.transaction', SubscriptionAPIErrors.CHARGE_BEE_CLIENT_ERROR);
            }
            throw error;
          }

          const trialAddOnIds: string[] = [];
          const activeAddOnIds: string[] = [];
          const addOnConfigurationIds: string[] = [];

          orders.forEach(item => {
            if (item.isSelected) {
              trialAddOnIds.push(item.trialAddOnId);
              activeAddOnIds.push(item.standardAddOnId);
              addOnConfigurationIds.push(item.id);
            }
          });

          await adminCreatePerson(
            {
              ...rest,
              billingAddress: actualBillingAddress,
              token,
              couponIds: coupon ? [coupon] : undefined,
              trialAddOnIds,
              activeAddOnIds,
              addOnConfigurationIds,
              isSameAsShippingAddress,
            },
            leadId
          );
          success({ title: 'Success', message: 'User created' });
          history.push(`${ADMIN_USER_REGISTERED}${leadId ? `?id=${leadId}` : null}`);

          // onsubmit ends here
        }
      } catch (error) {
        if (
          error.response?.status === 400 &&
          error.response.data.operation.apiErrorCode === SubscriptionAPIErrors.PAYMENT_PROCESSING_FAILED
        ) {
          return setFieldError('card.transaction', SubscriptionAPIErrors.PAYMENT_PROCESSING_FAILED);
        } else if (
          error.response?.status === 404 &&
          error.response.data.operation.apiErrorCode === SubscriptionAPIErrors.COUPON_CODE_RESOURCE_ERROR
        ) {
          return handleError(error, {
            title: FORM.COUPON.TOAST_TITLE,
            message: FORM.COUPON.INVALID_COUPON_TOAST_MESSAGE,
          });
        }

        return handleError(error);
      } finally {
        if (mountRef.current) {
          setSubmitting(false);
        }
      }
    },
  });

  const handleCardLoaded = () => {
    if (mountRef.current) {
      setIsCardLoaded(true);
    }
  };

  // fetch query from url
  const useQueryString = () => {
    const location = useLocation();

    return new URLSearchParams(location.search);
  };

  const queryString = useQueryString();
  const leadId = queryString.get('id') as string;

  // redirect if no id query parameter
  if (!leadId) {
    history.push(`${ADMIN_USER_REGISTRATION}`);
  }

  React.useEffect(() => {
    window.scrollTo(0, 0);
    if (!window.Chargebee.inited) {
      window.Chargebee.init({
        site: config.chargebee.site,
        publishableKey: config.chargebee.publishableKey,
      });
    }

    return setIsInitialized(true);
  }, []);

  React.useEffect(() => {
    (async () => {
      if (!!userProfile && !!window.Chargebee.inited) {
        const previousEstimate = estimateState;

        if (estimateState.isLoaded) {
          setEstimateState({ isLoaded: false, data: null });
        }

        const couponIds = formik.values.coupon ? [formik.values.coupon] : [];

        const trialAddOnIds: string[] = [];
        const activeAddOnIds: string[] = [];

        orders.forEach(item => {
          if (item.isSelected) {
            trialAddOnIds.push(item.trialAddOnId);
            activeAddOnIds.push(item.standardAddOnId);
          }
        });

        try {
          const estimates = await estimateSubscription(userProfile?.id, { couponIds, trialAddOnIds, activeAddOnIds });

          setEstimateState({ isLoaded: true, data: estimates.data.data });
        } catch (error) {
          handleError(error, { title: FORM.COUPON.TOAST_TITLE, message: FORM.COUPON.INVALID_COUPON_TOAST_MESSAGE });
          formik.setFieldValue('coupon', '');
          formik.setFieldError('coupon', FORM.COUPON.INVALID_COUPON_MESSAGE);
          setEstimateState(previousEstimate);
        }
      }
    })();
  }, [formik.values.coupon]);

  // fetch lead data
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await getLeadFromId(leadId);

        if (mountRef.current) {
          const leadData: IAdminLead = data.data;

          setLead(leadData);
          setIsLoading(false);
        }
      } catch (error) {
        handleError(error, { title: 'Invalid user', message: 'Please start over' });
        history.push(ADMIN_USER_REGISTRATION);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <HeaderLine />
      <div className="product-selection">
        <div className="container m-4x mt-10x product-selection-wrapper">
          <UserDetailsCard isReady={!isLoading} lead={lead} resetSpotTreatmentSelection={resetSpotTreatmentSelection} />

          <h1 className="mb-10x mt-10x">Payment and shipping</h1>
          <div className="row">
            <div className="col-12-md">
              {isInitialized ? (
                <form onSubmit={formik.handleSubmit} className="subscription-form">
                  <div className="row">
                    <div className="col-12-md">
                      <FormElements formik={formik} cardRef={cardRef} handleCardLoaded={handleCardLoaded} />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-6-md">
                      <Coupon isAdmin={true} formik={formik} isLoaded={estimateState.isLoaded} />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12">
                      <AdminOrder
                        isLoaded={estimateState.isLoaded}
                        orders={orders}
                        estimate={estimateState.isLoaded ? estimateState.data : null}
                      />
                    </div>
                  </div>

                  <div className="row mt-10x">
                    <div className="col-12-md mb-4x">
                      <Button
                        type="submit"
                        title={FORM.ADMIN_SUBMIT_BUTTON_LABEL}
                        loading={formik.isSubmitting}
                        fullWidth
                        disabled={!isCardLoaded || !estimateState.isLoaded || formik.isSubmitting}
                      />
                      <Button
                        type="button"
                        title="Back to user registration"
                        loading={formik.isSubmitting}
                        fullWidth
                        color="black-text"
                        onClick={() => {
                          history.push(`${ADMIN_USER_REGISTRATION}${leadId ? `?id=${leadId}` : null}`);
                        }}
                        disabled={!isCardLoaded || !estimateState.isLoaded || formik.isSubmitting}
                      />
                    </div>
                  </div>
                </form>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentInformation;
