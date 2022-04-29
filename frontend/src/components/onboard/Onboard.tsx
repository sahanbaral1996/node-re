import * as React from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';

import { IUserProfile, UserStatus } from 'types/profile';
import { OnboardSteps, PhotoUploadSteps, OnboardStepperSteps } from 'types/onboard';

import Name from 'components/name';
import Subscription from 'components/subscription';
import UploadPhoto from 'components/clinicalAssessment/UploadPhoto';
import StandaloneOrderConfirmed from 'components/StandaloneOrderConfirmed';
import ClinicalAssessment from 'components/clinicalAssessment/ClinicalAssesment';
import { HomeRouterContext, IUserProfileActionType } from 'components/home/Router';
import HeaderLine from 'components/common/HeaderLine';

import * as toast from 'utils/toast';

import { steps } from 'constants/stepper';
import * as routes from 'constants/routes';

import { updateUserStatus } from 'services/account';
import { fetchProfile } from 'services/profile';
import { anonymize } from 'services/fullstory';

import { handleError } from 'utils/errorHandler';
import { Auth } from 'aws-amplify';
import OnboardStepper from './OnboardStepper';
import ProductRouter from 'components/product/Router';
import { IAddonOrder } from 'types/shoppingCart';

const { FACE_PHOTO, SETUP_SUBSCRIPTION, REGIMEN_PHOTO, STANDALONE_ORDER_CONFIRMED, NAME, CLINICAL_ASSESSMENT } = routes;

const OnBoard = () => {
  const { state, dispatch } = React.useContext(HomeRouterContext);

  const [products, setProducts] = React.useState<IAddonOrder[]>([]);
  const [addons, setAddons] = React.useState<{ activeAddonId: string[]; trialAddonId: string[] }>();
  const history = useHistory();

  // Api call to disable browser disk cache
  const refetchProfile = async () => {
    try {
      return await fetchProfile();
    } catch (error) {
      handleError(error);
      await Auth.signOut();
      anonymize();

      history.push(routes.LOGIN);
    }
  };

  const handleStepChange = async (nextStep: OnboardSteps, updatedProfile?: IUserProfile) => {
    try {
      if (nextStep === OnboardSteps.ImageUpload && state) {
        dispatch({
          type: IUserProfileActionType.isLoaded,
          payload: { ...state, status: UserStatus.BillingInformation },
        });
      } else if (nextStep === OnboardSteps.Complete && state) {
        dispatch({
          type: IUserProfileActionType.isLoaded,
          payload: {
            ...state,
            status: UserStatus.StandaloneOrderConfirmed,
          },
        });

        await refetchProfile();
      } else if (nextStep === OnboardSteps.RegimenPhoto && state) {
        dispatch({
          type: IUserProfileActionType.isLoaded,
          payload: {
            ...state,
            status: UserStatus.FacePhotoUploads,
          },
        });
        await updateUserStatus(UserStatus.ImageUploads);
      } else if (nextStep === OnboardSteps.Assessment && state) {
        dispatch({
          type: IUserProfileActionType.isLoaded,
          payload: {
            ...state,
            status: UserStatus.Complete,
          },
        });
      } else if (nextStep === OnboardSteps.Billing && state) {
        dispatch({
          type: IUserProfileActionType.isLoaded,
          payload: {
            ...(updatedProfile ? updatedProfile : state),
            status: UserStatus.Assessment,
          },
        });
      }
    } catch (error) {
      toast.error({ title: 'Error', message: 'Error when changing steps' });
    }
  };

  const getStepperState = () => {
    if (history.location.pathname === routes.SETUP_SUBSCRIPTION) {
      return OnboardStepperSteps.PaymentInformation;
    }

    if (state?.status === UserStatus.Assessment) {
      return OnboardStepperSteps.ProductSelection;
    } else if (state?.status === UserStatus.BillingInformation) {
      return OnboardStepperSteps.Photos;
    } else if (state?.status === UserStatus.FacePhotoUploads) {
      return OnboardStepperSteps.Photos;
    }

    return OnboardStepperSteps.Complete;
  };

  const showStepper =
    state &&
    (state.status === UserStatus.Assessment ||
      state.status === UserStatus.BillingInformation ||
      state.status === UserStatus.FacePhotoUploads);

  return (
    <>
      <HeaderLine />
      {showStepper && (
        <div className="assessment container pb-0x">
          <OnboardStepper activeStep={getStepperState()} steps={steps} />
        </div>
      )}

      <Switch>
        <Route
          exact
          path={SETUP_SUBSCRIPTION}
          render={() => (
            <Subscription
              orders={products}
              onContinue={handleStepChange}
              addons={addons}
              onBack={() => {
                // setProducts(products);
                history.push(routes.PRODUCT_SELECTION);
              }}
            />
          )}
        />
        <Route
          path={routes.PRODUCT_SELECTION}
          component={() => (
            <ProductRouter
              products={products}
              setProducts={setProducts}
              setAddons={(activeAddonId: string[], trialAddonId: string[]) =>
                setAddons({ activeAddonId, trialAddonId })
              }
            />
          )}
        />
        <Route
          exact
          path={FACE_PHOTO}
          render={() => <UploadPhoto onContinue={handleStepChange} activeStep={PhotoUploadSteps.FacePhoto} />}
        ></Route>
        <Route
          exact
          path={REGIMEN_PHOTO}
          render={() => <UploadPhoto onContinue={handleStepChange} activeStep={PhotoUploadSteps.RegimenPhoto} />}
        ></Route>
        <Route exact path={STANDALONE_ORDER_CONFIRMED} render={() => <StandaloneOrderConfirmed />} />
        <Route exact path={NAME} render={() => <Name onContinue={handleStepChange} />} />
        <Route exact path={CLINICAL_ASSESSMENT} render={() => <ClinicalAssessment onContinue={handleStepChange} />} />
      </Switch>
    </>
  );
};

export default OnBoard;
