import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';

import config from 'config';

export default () => {
  const client = new CognitoIdentityProvider({
    region: config.cognito.region,
    credentials: {
      accessKeyId: config.cognito.accessKeyId,
      secretAccessKey: config.cognito.secretAccessKey,
    },
  });

  return client;
};
