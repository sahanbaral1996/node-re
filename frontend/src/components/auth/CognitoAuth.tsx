import * as React from 'react';

import { useHistory } from 'react-router-dom';

import Amplify from 'aws-amplify';

import awsconfig from './aws-exports';

import * as routes from 'constants/routes';

import SignIn from './SignIn';

import { Authenticator } from 'aws-amplify-react';
import useMountedRef from 'hooks/useMountedRef';

Amplify.configure(awsconfig);

enum IUserAttributeNames {
  SUB = 'sub',
  SALESFORCEID = 'custom:salesforceId',
  CHARGEBEEID = 'custom:chargeBeeId',
  EMAIL = 'email',
}

interface IUserAttribute {
  Name: IUserAttributeNames;
  Value: string;
}

export interface IUserData {
  UserAttributes: IUserAttribute[];
  Username: string;
}

export type IAuthState = { isSignedIn: true; user: IUserData } | { isSignedIn: false; user: null };

export const initialAuthState: IAuthState = {
  isSignedIn: false,
  user: null,
};

const CognitoAuth: React.FC = () => {
  const history = useHistory();

  const [authState, setAuthState] = React.useState<IAuthState>({ isSignedIn: false, user: null });
  const mountedRef = useMountedRef();

  const handleAuthStateChange = (authState: string, data?: any | IUserData) => {
    if (authState === 'signedIn' && data) {
      const user = data as IUserData;

      if (mountedRef.current) {
        setAuthState({ isSignedIn: true, user });
      }
    }
  };

  React.useEffect(() => {
    if (authState.isSignedIn) {
      const state = history.location.state as { from?: Location };

      if (state && state.from) {
        return history.push(state.from.pathname);
      }

      return history.push(routes.HOME);
    }
  }, [authState, history]);

  return (
    <Authenticator hideDefault={true} onStateChange={handleAuthStateChange}>
      <SignIn />
    </Authenticator>
  );
};

export default CognitoAuth;
