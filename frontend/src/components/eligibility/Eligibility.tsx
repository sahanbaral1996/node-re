import * as React from 'react';
import { useFormik } from 'formik';
import { useHistory } from 'react-router';

import { US_STATE_OPTIONS } from 'constants/appConstants';

import { en } from 'constants/lang';

import { setValue, readValue } from 'utils/localStorage';
import { LOCAL_STORAGE_ELIGIBILITY } from 'constants/assessment';

import EmailForm from 'components/email';
import Button from 'components/common/button';
import ReveaSelect from 'components/common/ReveaSelect';
import WarningDialog from 'components/common/WarningDialog';
import ReveaDatePicker from 'components/common/ReveaDatePicker';

import { UserEligibility } from 'schemas/userRegistration';
import { userRegistrationValidation } from 'services/assessment';

import { handleError } from 'utils/errorHandler';
import { interpolate } from 'utils/string';
import HeaderLine from 'components/common/HeaderLine';

import useMountedRef from 'hooks/useMountedRef';
import Header from 'components/header/Header';
import { ACCOUNT_CREATION } from 'constants/routes';

export const UserEligibilityInitialValues = {
  dob: '',
  state: '',
};

export type UserEligibilityFormValues = typeof UserEligibilityInitialValues;

const { userRegistration, eligibility } = en;

const underAgedErrorMessage = 'UNDER_AGED';
const unavailableStateErrorMessage = 'UNAVAILABLE_STATE';

const checkAvailableState = (state: string) => {
  const selectedState = US_STATE_OPTIONS.find(option => option.value === state);

  if (!selectedState) {
    return false;
  }

  return selectedState.isAvailable;
};
const Eligibility: React.FC = () => {
  const history = useHistory();
  const initialFormValues: UserEligibilityFormValues =
    readValue(LOCAL_STORAGE_ELIGIBILITY) || UserEligibilityInitialValues;
  const mountedRef = useMountedRef();
  const formik = useFormik({
    initialValues: initialFormValues,
    validationSchema: UserEligibility,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        try {
          await userRegistrationValidation({ dob: values.dob });
        } catch (error) {
          if (error.response?.status === 406) {
            formik.setFieldError('dob', underAgedErrorMessage);

            return;
          }
          throw error;
        }
        if (!checkAvailableState(values.state)) {
          formik.setFieldError('state', unavailableStateErrorMessage);

          return;
        }
        setValue(LOCAL_STORAGE_ELIGIBILITY, formik.values);
        history.push(ACCOUNT_CREATION);
      } catch (error) {
        handleError(error);
      } finally {
        if (mountedRef.current) {
          setSubmitting(false);
        }
      }
    },
  });
  const { errors, handleChange, touched } = formik;

  return (
    <>
      <Header showLogin />
      <HeaderLine />
      <div className="user-registration__wrapper">
        <h3 className="user-registration__header">{eligibility.TITLE}</h3>
        <div className="user-registration__sub-title mb-12x">{eligibility.SUBTITLE}</div>
        <form onSubmit={formik.handleSubmit} className="user-signIn">
          <div className="user-registration__body">
            <div className="user-registration__input-wrapper">
              <ReveaSelect
                options={US_STATE_OPTIONS}
                value={formik.values.state}
                onChange={handleChange}
                name="state"
                label={userRegistration.HOME_STATE.LABEL}
                errorMessage={errors.state && touched.state ? errors.state : ''}
              ></ReveaSelect>
            </div>
            <div className="user-registration__input-wrapper">
              <ReveaDatePicker
                name="dob"
                value={formik.values.dob}
                label={userRegistration.BIRTHDAY.LABEL}
                placeholder=""
                onChange={formik.setFieldValue}
                errorMessage={errors.dob && touched.dob ? errors.dob : ''}
              />
            </div>
          </div>
          <Button loading={formik.isSubmitting} fullWidth title="Continue" type="submit"></Button>
        </form>
        {errors.dob === underAgedErrorMessage ? (
          <WarningDialog
            onSubmitClick={() => formik.setFieldError('dob', '')}
            title={userRegistration.AGE_WARNING.TITLE}
            description={userRegistration.AGE_WARNING.DESCRIPTION}
          >
            <EmailForm state={formik.values.state} onSuccess={() => formik.setFieldError('dob', '')} />
          </WarningDialog>
        ) : null}
        {errors.state === unavailableStateErrorMessage ? (
          <WarningDialog
            title={userRegistration.REGION_WARNING.TITLE}
            onSubmitClick={() => formik.setFieldError('state', '')}
            description={interpolate(userRegistration.REGION_WARNING.DESCRIPTION, { state: formik.values.state })}
          >
            <EmailForm
              state={formik.values.state}
              onSuccess={() => {
                formik.setFieldError('state', '');
              }}
            />
          </WarningDialog>
        ) : null}
      </div>
    </>
  );
};

export default Eligibility;
