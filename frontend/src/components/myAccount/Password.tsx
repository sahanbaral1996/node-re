import * as React from 'react';

import { useFormik } from 'formik';

import Button from 'components/common/button';
import PasswordInput from 'components/common/PasswordInput';

import * as toast from 'utils/toast';
import useMountedRef from 'hooks/useMountedRef';
import { handleError } from 'utils/errorHandler';
import { changePassword } from 'services/changePassword';

import { en } from 'constants/lang';
import { changePasswordSchema } from 'schemas/changePassword';

const Password: React.FunctionComponent = () => {
  const [isLoading, setIsLoading] = React.useState(false);

  const mountedRef = useMountedRef();

  const changePasswordFormik = useFormik({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: changePasswordSchema,
    onSubmit: async ({ oldPassword, newPassword }, { resetForm }) => {
      setIsLoading(true);
      try {
        const { data } = await changePassword({ oldPassword, newPassword });

        if (!mountedRef.current) {
          return;
        }
        toast.success({
          message: data?.message || en.account.password.CHANGE_PASSWORD_SUCCESSFUL,
        });

        resetForm();
      } catch (error) {
        handleError(error);
      } finally {
        if (mountedRef.current) {
          setIsLoading(false);
        }
      }
    },
  });

  return (
    <div>
      <h5>{en.account.password.CHANGE_PASSWORD}</h5>
      <form className="mt-6x" onSubmit={changePasswordFormik.handleSubmit}>
        <div className="account-form__wrapper">
          <div className="account-form__input-wrapper">
            <PasswordInput
              name="oldPassword"
              type="password"
              label={en.account.password.CURRENT_PASSWORD_LABEL}
              value={changePasswordFormik.values.oldPassword}
              onChange={changePasswordFormik.handleChange}
              placeholder={en.account.password.CURRENT_PASSWORD_PLACEHOLDER}
              errorMessage={
                changePasswordFormik.errors.oldPassword && changePasswordFormik.touched.oldPassword
                  ? changePasswordFormik.errors.oldPassword
                  : ''
              }
            />
          </div>
          <div className="account-form__input-wrapper">
            <PasswordInput
              name="newPassword"
              type="password"
              label={en.account.password.NEW_PASSWORD_LABEL}
              value={changePasswordFormik.values.newPassword}
              onChange={changePasswordFormik.handleChange}
              placeholder={en.account.password.NEW_PASSWORD_PLACEHOLDER}
              errorMessage={
                changePasswordFormik.errors.newPassword && changePasswordFormik.touched.newPassword
                  ? changePasswordFormik.errors.newPassword
                  : ''
              }
            />
          </div>
          <div className="account-form__input-wrapper">
            <PasswordInput
              name="confirmPassword"
              type="password"
              label={en.account.password.CONFIRM_PASSWORD_LABEL}
              value={changePasswordFormik.values.confirmPassword}
              onChange={changePasswordFormik.handleChange}
              placeholder={en.account.password.CONFIRM_PASSWORD_PLACEHOLDER}
              errorMessage={
                changePasswordFormik.errors.confirmPassword && changePasswordFormik.touched.confirmPassword
                  ? changePasswordFormik.errors.confirmPassword
                  : ''
              }
            />
          </div>
        </div>
        <Button className="mt-4x" loading={isLoading} disabled={isLoading}>
          {en.account.password.CHANGE_BTN}
        </Button>
      </form>
    </div>
  );
};

export default Password;
