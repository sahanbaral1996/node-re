import * as React from 'react';

import HeaderLine from 'components/common/HeaderLine';

import Header from 'components/header/Header';

import LoginForm from './LoginForm';
import { ICognitoUserDetails, ISignInState, SignInForms } from 'types/signIn';
import SetupPassword from './SetupPassword';

const INITIAL_SIGN_IN_STATE: ISignInState = {
  current: SignInForms.Login,
  user: null,
};

const SignIn: React.FC = () => {
  const [currentForm, setCurrentForm] = React.useState<ISignInState>(INITIAL_SIGN_IN_STATE);

  const onSetupPassword = (cognitoUserDetails: ICognitoUserDetails) => {
    setCurrentForm({
      current: SignInForms.SetupPassword,
      cognitoUserDetails,
    });
  };

  const onBack = () => {
    setCurrentForm(INITIAL_SIGN_IN_STATE);
  };

  return (
    <>
      <Header showGetStarted />
      <HeaderLine />
      <div className="user-signIn__wrapper">
        {currentForm.current === SignInForms.Login ? (
          <LoginForm onSetupPassword={onSetupPassword} />
        ) : (
          <SetupPassword cognitoUserDetails={currentForm.cognitoUserDetails} onBack={onBack} />
        )}
      </div>
    </>
  );
};

export default SignIn;
