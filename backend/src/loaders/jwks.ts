import jwksClient from 'jwks-rsa';

import config from 'config';

export default () => {
  const jwksClientInstance = jwksClient({
    strictSsl: true, // Default value
    jwksUri: `https://cognito-idp.${config.cognito.region}.amazonaws.com/${config.cognito.userPoolId}/.well-known/jwks.json`,
    requestHeaders: {}, // Optional
    timeout: 30000, // Defaults to 30s
  });

  return jwksClientInstance;
};
