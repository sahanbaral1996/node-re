import * as React from 'react';
import { useFormik } from 'formik';
import { Auth } from 'aws-amplify';
import { useHistory } from 'react-router';
import { useLocation } from 'react-router-dom';

import { en } from 'constants/lang';
import { LOGIN } from 'constants/routes';
import { resetPasswordSchema } from 'schemas/resetPasswordSchema';

import Button from 'components/common/button';
import ReveaInput from 'components/common/ReveaInput';

import * as toast from 'utils/toast';
import { handleError } from 'utils/errorHandler';
import PasswordInput from 'components/common/PasswordInput';
import Header from 'components/header/Header';
import HeaderLine from 'components/common/HeaderLine';

const ResetPassword: React.FC = () => {
  const [email, setEmail] = React.useState<string>('');
  const history = useHistory();
  const location = useLocation<{ resetEmail: string }>();

  React.useEffect(() => {
    if (!location || !location.state || !location.state.resetEmail) {
      history.push(LOGIN);

      return;
    }

    const resetEmail = location.state.resetEmail;

    setEmail(resetEmail);
  }, [location, history, setEmail]);

  const resetPasswordFormik = useFormik({
    initialValues: {
      code: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: resetPasswordSchema,
    onSubmit: async ({ code, password }) => {
      try {
        await Auth.forgotPasswordSubmit(email, code, password);
        toast.success({
          title: en.resetPassword.SUCCESS_TITLE,
          message: en.resetPassword.SUCCESS_MESSAGE,
        });

        history.push(LOGIN);
      } catch (err) {
        handleError(err);
      }
    },
  });

  return (
    <>
      <Header showLogin />
      <HeaderLine />
      <div className="reset-password__wrapper">
        <form onSubmit={resetPasswordFormik.handleSubmit} className="reset-password">
          <h2 className="reset-password__title">{en.resetPassword.TITLE}</h2>
          <p className="reset-password__description">{en.resetPassword.DESCRIPTION}</p>

          <div className="reset-password__input-wrapper">
            <ReveaInput
              name="code"
              label={en.resetPassword.CODE_LABEL}
              type="text"
              value={resetPasswordFormik.values.code}
              onChange={resetPasswordFormik.handleChange}
              placeholder={en.resetPassword.CODE_PLACEHOLDER}
              errorMessage={
                resetPasswordFormik.errors.code && resetPasswordFormik.touched.code
                  ? resetPasswordFormik.errors.code
                  : ''
              }
            />
          </div>

          <div className="reset-password__input-wrapper">
            <PasswordInput
              name="password"
              label={en.resetPassword.PASSWORD_LABEL}
              type="password"
              value={resetPasswordFormik.values.password}
              onChange={resetPasswordFormik.handleChange}
              placeholder={en.resetPassword.PASSWORD_PLACEHOLDER}
              errorMessage={
                resetPasswordFormik.errors.password && resetPasswordFormik.touched.password
                  ? resetPasswordFormik.errors.password
                  : ''
              }
            />
          </div>
          <div className="reset-password__input-wrapper">
            <PasswordInput
              name="confirmPassword"
              label={en.resetPassword.CONFIRM_PASSWORD_LABEL}
              type="password"
              value={resetPasswordFormik.values.confirmPassword}
              onChange={resetPasswordFormik.handleChange}
              placeholder={en.resetPassword.PASSWORD_PLACEHOLDER}
              errorMessage={
                resetPasswordFormik.errors.confirmPassword && resetPasswordFormik.touched.confirmPassword
                  ? resetPasswordFormik.errors.confirmPassword
                  : ''
              }
            />
          </div>
          <Button
            title={en.resetPassword.RESET_BUTTON_LABEL}
            type="submit"
            className="reset-password__submit"
            fullWidth
            disabled={resetPasswordFormik.isSubmitting}
          />
        </form>
        <Button
          title={en.resetPassword.BACK_BUTTON_LABEL}
          type="button"
          color="transparent"
          className="reset-password__back"
          onClick={() => history.push(LOGIN)}
        />
      </div>
    </>
  );
};

export default ResetPassword;
