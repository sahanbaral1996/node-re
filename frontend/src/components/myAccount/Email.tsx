import * as React from 'react';

import { useFormik } from 'formik';
import Auth from '@aws-amplify/auth';

import Button from 'components/common/button';
import ReveaInput from 'components/common/ReveaInput';
import ErrorMessage from 'components/common/ErrorMessage';
import PasswordInput from 'components/common/PasswordInput';
import { HomeRouterContext, IUserProfileActionType } from 'components/home/Router';

import * as toast from 'utils/toast';
import useMountedRef from 'hooks/useMountedRef';
import { handleError } from 'utils/errorHandler';

import { changeEmail } from 'services/changeEmail';
import { fetchProfile } from 'services/profile';
import { anonymize } from 'services/fullstory';

import { en } from 'constants/lang';
import { changeEmailSchema } from 'schemas/changeEmail';

const INITIAL_VALUES = {
  email: '',
  password: '',
};

const Email: React.FunctionComponent = () => {
  const [emailPasswordIncorrectMessage, setEmailPasswordIncorrectMessage] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const mountedRef = useMountedRef();

  const { state: userProfile, dispatch } = React.useContext(HomeRouterContext);

  const fetchUserData = () => {
    (async () => {
      try {
        const {
          data: { data: profile },
        } = await fetchProfile();

        dispatch({ type: IUserProfileActionType.isLoaded, payload: profile });
      } catch (error) {
        handleError(error);
        await Auth.signOut();
        anonymize();
      }
    })();
  };

  const submitHandler = async (email: string, password: string, reset: () => void) => {
    if (!userProfile) {
      return;
    }
    const oldEmail = userProfile.email;

    setIsLoading(true);
    try {
      setEmailPasswordIncorrectMessage('');
      await Auth.signIn(oldEmail, password);
      const { data } = await changeEmail({ email });

      fetchUserData();
      if (mountedRef.current) {
        toast.success({
          message: data?.message || en.account.email.CHANGE_EMAIL_SUCCESSFUL,
        });
        reset();
      }
    } catch (error) {
      if (error.code === 'NotAuthorizedException') {
        if (mountedRef.current) {
          setEmailPasswordIncorrectMessage(en.loginIssues.INVALID_EMAIL_PASSWORD);
        }
      } else {
        handleError(error);
      }
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  };

  const changeEmailFormik = useFormik({
    initialValues: INITIAL_VALUES,
    validationSchema: changeEmailSchema,
    onSubmit: async ({ email, password }, { resetForm }) => {
      await submitHandler(email, password, resetForm);
    },
  });

  return (
    <div>
      <h3 className="account-form__header">{en.account.email.CHANGE_EMAIL}</h3>
      <form className="mt-6x" onSubmit={changeEmailFormik.handleSubmit}>
        <div className="account-form__wrapper">
          <div className="account-form__input-wrapper">
            <ReveaInput
              name="email"
              label={en.account.email.LABEL}
              value={changeEmailFormik.values.email}
              onChange={changeEmailFormik.handleChange}
              placeholder={en.account.email.PLACEHOLDER}
              errorMessage={
                changeEmailFormik.errors.email && changeEmailFormik.touched.email ? changeEmailFormik.errors.email : ''
              }
            />
          </div>
          <div className="account-form__input-wrapper">
            <PasswordInput
              name="password"
              label={en.account.email.PASSWORD_LABEL}
              type="password"
              value={changeEmailFormik.values.password}
              onChange={changeEmailFormik.handleChange}
              placeholder={en.account.email.PASSWORD_PLACEHOLDER}
              isError={emailPasswordIncorrectMessage ? true : false}
              errorMessage={
                changeEmailFormik.errors.password && changeEmailFormik.touched.password
                  ? changeEmailFormik.errors.password
                  : ''
              }
            />
            <div>{emailPasswordIncorrectMessage ? <ErrorMessage message={emailPasswordIncorrectMessage} /> : ''}</div>
          </div>
        </div>
        <Button className="mt-4x" loading={isLoading} disabled={isLoading}>
          {en.account.email.UPDATE_BTN}
        </Button>
      </form>
    </div>
  );
};

export default Email;
