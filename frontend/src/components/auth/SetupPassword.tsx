import React from 'react';

import { en } from 'constants/lang';

import PasswordInput from 'components/common/PasswordInput';
import Button from 'components/common/button';
import { handleError } from 'utils/errorHandler';
import { useFormik } from 'formik';

import { setupPasswordSchema } from 'schemas/setupPasswordSchema';
import { Auth } from 'aws-amplify';
import { ICognitoUserDetails } from 'types/signIn';

import { success } from 'utils/toast';

const SetupPassword: React.FC<{ cognitoUserDetails: ICognitoUserDetails; onBack: () => void }> = ({
  cognitoUserDetails,
  onBack,
}) => {
  const setupPasswordFormik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema: setupPasswordSchema,
    onSubmit: async ({ password }) => {
      try {
        const response = await Auth.completeNewPassword(cognitoUserDetails.user, password);

        success({ title: en.setupPassword.TOAST_SUCCESS_TITLE, message: en.setupPassword.TOAST_SUCCESS_MESSAGE });

        return response;
      } catch (err) {
        handleError(err);
      }
    },
  });

  return (
    <>
      <form onSubmit={setupPasswordFormik.handleSubmit} className="user-signIn">
        <h2 className="user-signIn__header">
          {en.setupPassword.TITLE}
          {cognitoUserDetails.attributes.firstName}!
        </h2>
        <div className="mb-8x">
          <p className="mb-4x">
            {en.setupPassword.DESCRIPTION_FIRST_SECTION}
            <strong>{cognitoUserDetails.attributes.email}</strong>
            {en.setupPassword.DESCRIPTION_END_SECTION}
          </p>
        </div>
        <div className="user-signIn__body">
          <div className="user-signIn__input-wrapper">
            <PasswordInput
              name="password"
              label={en.setupPassword.PASSWORD_LABEL}
              type="password"
              value={setupPasswordFormik.values.password}
              onChange={setupPasswordFormik.handleChange}
              placeholder={en.setupPassword.PASSWORD_PLACEHOLDER}
              errorMessage={
                setupPasswordFormik.errors.password && setupPasswordFormik.touched.password
                  ? setupPasswordFormik.errors.password
                  : ''
              }
            />
          </div>
          <div className="user-signIn__input-wrapper mb-8x">
            <PasswordInput
              name="confirmPassword"
              label={en.setupPassword.CONFIRM_PASSWORD_LABEL}
              type="password"
              value={setupPasswordFormik.values.confirmPassword}
              onChange={setupPasswordFormik.handleChange}
              placeholder={en.setupPassword.PASSWORD_PLACEHOLDER}
              errorMessage={
                setupPasswordFormik.errors.confirmPassword && setupPasswordFormik.touched.confirmPassword
                  ? setupPasswordFormik.errors.confirmPassword
                  : ''
              }
            />
          </div>
          <Button
            title={en.setupPassword.SETUP_PASSWORD_BUTTON_LABEL}
            type="submit"
            fullWidth
            loading={setupPasswordFormik.isSubmitting}
            disabled={setupPasswordFormik.isSubmitting}
          />
        </div>
      </form>
      <Button
        title={en.setupPassword.BACK_BUTTON_LABEL}
        type="button"
        color="transparent"
        className="reset-password__back"
        onClick={onBack}
        loading={setupPasswordFormik.isSubmitting}
        disabled={setupPasswordFormik.isSubmitting}
      />
    </>
  );
};

export default SetupPassword;
