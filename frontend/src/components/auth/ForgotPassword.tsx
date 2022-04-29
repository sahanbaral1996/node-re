import * as React from 'react';
import { useFormik } from 'formik';
import { Auth } from 'aws-amplify';
import { useHistory } from 'react-router';

import { en } from 'constants/lang';
import { handleError } from 'utils/errorHandler';
import { LOGIN, RESET_PASSWORD } from 'constants/routes';
import { forgotPasswordSchema } from 'schemas/forgotPasswordSchema';

import Button from 'components/common/button';
import ReveaInput from 'components/common/ReveaInput';
import ErrorMessage from 'components/common/ErrorMessage';
import HeaderLine from 'components/common/HeaderLine';
import Header from 'components/header/Header';

const ForgotPassword: React.FC = () => {
  const history = useHistory();

  const forgotPasswordFormik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: forgotPasswordSchema,
    onSubmit: async ({ email }) => {
      try {
        await Auth.forgotPassword(email);
        history.push(RESET_PASSWORD, {
          resetEmail: email,
        });
      } catch (err) {
        handleError(err);
      }
    },
  });

  return (
    <>
      <Header showLogin />
      <HeaderLine />
      <div className="forgot-password__wrapper">
        <form onSubmit={forgotPasswordFormik.handleSubmit} className="forgot-password">
          <h2 className="forgot-password__title">{en.forgotPassword.TITLE}</h2>
          <p className="forgot-password__description">{en.forgotPassword.DESCRIPTION}</p>

          <ReveaInput
            name="email"
            label="Email Address"
            value={forgotPasswordFormik.values.email}
            onChange={forgotPasswordFormik.handleChange}
            placeholder="you@example.com"
          />
          {forgotPasswordFormik.errors.email && <ErrorMessage message={forgotPasswordFormik.errors.email} />}
          <Button
            title="Request Verification Code"
            type="submit"
            className="mt-8x mb-3x"
            fullWidth
            disabled={forgotPasswordFormik.isSubmitting}
          />
        </form>
        <Button
          title={en.forgotPassword.BACK_BUTTON_LABEL}
          type="button"
          color="transparent"
          className="forgot-password__back"
          onClick={() => history.push(LOGIN)}
        />
      </div>
    </>
  );
};

export default ForgotPassword;
