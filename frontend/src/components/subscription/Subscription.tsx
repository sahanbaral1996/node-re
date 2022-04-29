import * as React from 'react';
import { ZoomIn } from '@material-ui/icons';

import { useFormik } from 'formik';

import {
  ISubscriptionFormValues,
  CardReference,
  ISubscriptionProps,
  SubscriptionAPIErrors,
  SubscriptionEstimateState,
} from 'types/subscription';

import config from 'config';
import { afterImage, afterImageFullRes, beforeImage, beforeImageFullRes } from 'assets/images';

import { HomeRouterContext } from 'components/home/Router';
import { createSubscription } from 'services/subscription';
import { handleError } from 'utils/errorHandler';

import SubscriptionForm from './Form';
import setupSubscriptionSchema from 'schemas/setupSubscription';
import Order from './Order';

import { en } from 'constants/lang';
import { OnboardSteps } from 'types/onboard';
import * as FS from 'services/fullstory';
import * as GTM from 'services/tagManager';
import useMountedRef from 'hooks/useMountedRef';
import { refreshCurrentSession } from 'services/auth';

import { estimateSubscription } from 'services/subscription';

import { PIXEL } from 'constants/lang/facebook';
import { fbPixelApiConversion } from 'services/analytics';
import PhotoViewer from 'components/home/PhotoViewer';
import { SvgIcon } from '@material-ui/core';

const { FORM } = en.subscription;

const INITIAL_SUBSCRIPTION_VALUES: ISubscriptionFormValues = {
  shippingAddress: {
    lineOne: '',
    lineTwo: '',
    city: '',
    state: '',
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

const Subscription: React.FC<ISubscriptionProps> = ({
  onContinue,
  orders,
  onBack,
  addons = { activeAddonId: [], trialAddonId: [] },
}) => {
  const cardRef = React.useRef<CardReference>(null);
  const { state: userProfile } = React.useContext(HomeRouterContext);
  const [isInitialized, setIsInitialized] = React.useState(false);
  const [isCardLoaded, setIsCardLoaded] = React.useState(false);
  const mountRef = useMountedRef();
  const [estimateState, setEstimateState] = React.useState<SubscriptionEstimateState>(INITIAL_ESTIMATE_STATE);
  const [imagePopupVisible, setImagePopupVisible] = React.useState<boolean>(false);
  const [selectedPhoto, setSelectedPhoto] = React.useState<string>('');
  const { BEFORE_AFTER_BLOCK } = en.subscription.FORM;
  const imageId = {
    before: 'before',
    after: 'after',
  };

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
            // trialAddOnIds.push(item.trialAddOnId);
            activeAddOnIds.push(item.standardAddOnId);
            addOnConfigurationIds.push(item.id);
          });

          await createSubscription(userProfile.id, {
            ...rest,
            billingAddress: actualBillingAddress,
            token,
            couponIds: coupon ? [coupon] : undefined,
            trialAddOnIds,
            activeAddOnIds,
            addOnConfigurationIds,
            isSameAsShippingAddress,
          });
          await refreshCurrentSession();
          GTM.customEvent(en.tagManagerCusEvent.SUBSCRIPTION_SETUP);

          onContinue(OnboardSteps.ImageUpload);
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

  React.useEffect(() => {
    window.scrollTo(0, 0);
    if (!window.Chargebee.inited) {
      window.Chargebee.init({
        site: config.chargebee.site,
        publishableKey: config.chargebee.publishableKey,
      });
    }
    FS.customEvent(en.fullStoryCusEvent.SETUP_SUBSCRIPTION);

    fbPixelApiConversion(PIXEL.ADD_TO_CART);

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

        const trialArray: Set<string> = new Set([...addons.trialAddonId]);
        const activeArray: Set<string> = new Set([...addons.activeAddonId]);

        orders.forEach(item => {
          if (item.isSelected) {
            trialArray.add(item.trialAddOnId);
            activeArray.add(item.standardAddOnId);
          }
        });

        const trialAddOnIds: string[] = [...trialArray];
        const activeAddOnIds: string[] = [...activeArray];

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

  const showImagePopup = (event: React.MouseEvent<HTMLElement>, id = '') => {
    setImagePopupVisible(true);
    setSelectedPhoto(id);
  };
  const hideImagePopup = () => {
    setImagePopupVisible(false);
  };

  return (
    <div className="container subscription app-wrapper">
      <div className="row">
        <div className="col-8-lg order-2 order-1-lg ">
          <h2 className="mb-8x">{FORM.HEADER}</h2>

          <SubscriptionForm
            formik={formik}
            cardRef={cardRef}
            isInitialized={isInitialized}
            isCardLoaded={isCardLoaded}
            handleCardLoaded={handleCardLoaded}
            isEstimatesLoaded={estimateState.isLoaded}
            onBack={onBack}
          />
        </div>
        <div className="col-4-lg order-1 order-2-lg order-summary">
          <div className="block-wrapper mb-7x">
            <div className="header mb-7x">{BEFORE_AFTER_BLOCK.HEADER}</div>
            <div className="block-wrapper-container container p-6x">
              <div className="image-row row d-flex mb-1x">
                <div className="image-container-wrapper before col-6">
                  <img
                    src={beforeImage}
                    alt="before image"
                    onClick={(e: React.MouseEvent<HTMLElement>) => showImagePopup(e, imageId.before)}
                  />
                  <div className="zoom-in-text">
                    <ZoomIn fontSize="small" />
                    <span className="text">{BEFORE_AFTER_BLOCK.ZOOM}</span>
                  </div>
                  <div className="caption">{BEFORE_AFTER_BLOCK.CAPTION_BEFORE}</div>
                </div>
                <div className="image-container-wrapper after col-6">
                  <img
                    src={afterImage}
                    alt="after image"
                    onClick={(e: React.MouseEvent<HTMLElement>) => showImagePopup(e, imageId.after)}
                  />
                  <div className="zoom-in-text">
                    <ZoomIn fontSize="small" />
                    <span className="text">{BEFORE_AFTER_BLOCK.ZOOM}</span>
                  </div>
                  <div className="caption">{BEFORE_AFTER_BLOCK.CAPTION_AFTER}</div>
                </div>
              </div>
              <div className="subheading mb-3x">{BEFORE_AFTER_BLOCK.SUBHEADING}</div>
              <div className="review">{BEFORE_AFTER_BLOCK.REVIEW}</div>
            </div>
          </div>
          <Order
            isLoaded={estimateState.isLoaded}
            orders={orders}
            estimate={estimateState.isLoaded ? estimateState.data : null}
          />
        </div>
      </div>
      <div>
        {imagePopupVisible ? (
          <PhotoViewer
            items={[
              { id: imageId.before, url: beforeImageFullRes },
              { id: imageId.after, url: afterImageFullRes },
            ]}
            handleClose={hideImagePopup}
            id={selectedPhoto}
            isBack={false}
          />
        ) : null}
      </div>
    </div>
  );
};

export default Subscription;
