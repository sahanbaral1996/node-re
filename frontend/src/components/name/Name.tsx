import React, { useEffect } from 'react';

import ReveaInput from 'components/common/ReveaInput';
import { useFormik } from 'formik';

import { en } from 'constants/lang';

import Button from 'components/common/button';
import { INameFormValues, INameProps } from 'types/name';
import { updateUserName } from 'services/account';
import { HomeRouterContext } from 'components/home/Router';
import { handleError } from 'utils/errorHandler';
import useMountedRef from 'hooks/useMountedRef';
import { OnboardSteps } from 'types/onboard';
import { nameRegistration } from 'schemas/nameRegistration';

import { PIXEL } from 'constants/lang/facebook';
import { fbPixelApiConversion } from 'services/analytics';

const {
  name: { FORM },
} = en;

const INITIAL_NAME_VALUES: INameFormValues = {
  firstName: '',
  lastName: '',
};

const Name: React.FC<INameProps> = ({ onContinue }) => {
  const { state: userProfile } = React.useContext(HomeRouterContext);
  const mountRef = useMountedRef();

  const formik = useFormik({
    initialValues: INITIAL_NAME_VALUES,
    validationSchema: nameRegistration,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        if (userProfile) {
          await updateUserName(userProfile.id, values);
          onContinue(OnboardSteps.Assessment);
        }
      } catch (error) {
        handleError(error);
      } finally {
        if (mountRef.current) {
          setSubmitting(false);
        }
      }
    },
  });

  useEffect(() => {
    fbPixelApiConversion(PIXEL.SUBSCRIBE);
  }, []);

  return (
    <div className="user-registration__wrapper">
      <h2 className="user-registration__header">{FORM.HEADER}</h2>
      <div className="user-registration__sub-header mb-12x">{FORM.SUBHEADER}</div>
      <form onSubmit={formik.handleSubmit}>
        <div className="user-registration__body">
          <div className="user-registration__input-wrapper">
            <ReveaInput
              name="firstName"
              label={FORM.FIRST_NAME.LABEL}
              value={formik.values.firstName}
              onChange={formik.handleChange}
              placeholder={FORM.FIRST_NAME.PLACEHOLDER}
              errorMessage={formik.errors.firstName && formik.touched.firstName ? formik.errors.firstName : ''}
            />
          </div>
          <div className="user-registration__input-wrapper">
            <ReveaInput
              name="lastName"
              label={FORM.LAST_NAME.LABEL}
              value={formik.values.lastName}
              onChange={formik.handleChange}
              placeholder={FORM.LAST_NAME.PLACEHOLDER}
              errorMessage={formik.errors.lastName && formik.touched.lastName ? formik.errors.lastName : ''}
            />
          </div>
        </div>
        <Button loading={formik.isSubmitting} title="Continue" type="submit" fullWidth></Button>
      </form>
    </div>
  );
};

export default Name;
