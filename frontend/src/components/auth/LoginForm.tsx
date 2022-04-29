import * as React from 'react';

import { useFormik } from 'formik';
import { useHistory } from 'react-router';

import { Auth } from 'aws-amplify';

import { en } from 'constants/lang';
import { FORGOT_PASSWORD } from 'constants/routes';

import Button from 'components/common/button';
import ReveaInput from 'components/common/ReveaInput';
import ErrorMessage from 'components/common/ErrorMessage';
import PasswordInput from 'components/common/PasswordInput';

import { userSignInSchema } from 'schemas/userSign';

import { authIssueChecker } from 'services/auth';

import { ICognitoUserDetails } from 'types/signIn';

import { parse } from 'utils/queryParam';

const LoginForm: React.FC<{ onSetupPassword: (user: ICognitoUserDetails) => void }> = ({ onSetupPassword }) => {
  const history = useHistory();
  const [emailPasswordIncorrectMessage, setEmailPasswordIncorrectMessage] = React.useState('');

  const parsedQuery = parse(history.location.search);
  const isInvite = parsedQuery && parsedQuery.invite === 'true';

  const loginFormik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: userSignInSchema,
    onSubmit: async ({ email, password }) => {
      try {
        const user = await Auth.signIn(email, password);

        if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
          const {
            email,
            email_verified: isEmailVerified,
            family_name: lastName,
            given_name: firstName,
          } = user.challengeParam.userAttributes;

          return onSetupPassword({ user, attributes: { email, firstName, lastName, isEmailVerified } });
        }

        setEmailPasswordIncorrectMessage('');

        return user;
      } catch (error) {
        try {
          const { data } = await authIssueChecker(email);

          setEmailPasswordIncorrectMessage(data.message);
        } catch (error) {
          setEmailPasswordIncorrectMessage(error.message);
        }
      }
    },
  });

  const showLink = () => emailPasswordIncorrectMessage === en.loginIssues.NEW_LEAD;

  return (
    <>
      <form onSubmit={loginFormik.handleSubmit} className="user-signIn">
        <h2 className="user-signIn__header">{!isInvite ? en.signIn.TITLE : en.login.WELCOME}</h2>
        {isInvite && <p className="mb-10x">{en.login.DESCRIPTION}</p>}
        <div className="user-signIn__body">
          <div className="user-signIn__input-wrapper">
            <ReveaInput
              name="email"
              label="Email Address"
              value={loginFormik.values.email}
              onChange={loginFormik.handleChange}
              placeholder={en.signIn.EMAIL_PLACEHOLDER}
              isError={emailPasswordIncorrectMessage ? true : false}
              errorMessage={loginFormik.errors.email && loginFormik.touched.email ? loginFormik.errors.email : ''}
            />
          </div>
          <div className="user-signIn__input-wrapper mb-8x">
            <PasswordInput
              name="password"
              label="Password"
              type="password"
              value={loginFormik.values.password}
              onChange={loginFormik.handleChange}
              placeholder={en.signIn.PASSWORD_PLACEHOLDER}
              isError={emailPasswordIncorrectMessage ? true : false}
              errorMessage={
                loginFormik.errors.password && loginFormik.touched.password ? loginFormik.errors.password : ''
              }
            />
          </div>
          {emailPasswordIncorrectMessage ? (
            <ErrorMessage message={emailPasswordIncorrectMessage} showLink={showLink()} />
          ) : (
            ''
          )}
          <Button
            title="Sign In"
            type="submit"
            fullWidth
            disabled={loginFormik.isSubmitting}
            loading={loginFormik.isSubmitting}
          />
        </div>
      </form>
      <Button
        title={en.signIn.FORGOT_PASSWORD}
        type="button"
        color="transparent"
        className="user-signIn__redirect"
        onClick={() => history.push(FORGOT_PASSWORD)}
      />
    </>
  );
};

export default LoginForm;
