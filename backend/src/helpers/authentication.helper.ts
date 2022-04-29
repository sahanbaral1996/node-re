import jwt from 'jsonwebtoken';

import jwksClient from 'jwks-rsa';

import container from 'container';

import { ICognitoUserInfo } from 'types/cognito/user.types';
import winston from 'winston';

export const getUserDataFromToken = async (idToken: string): Promise<ICognitoUserInfo> => {
  const jwksClient: jwksClient.JwksClient = container.resolve('jwksClient');
  const logger: winston.Logger = container.resolve('logger');

  function getKey(header, callback) {
    jwksClient.getSigningKey(header.kid as string, function (err, key) {
      const signingKey = key as jwksClient.RsaSigningKey;
      const signingPublicKey = signingKey.rsaPublicKey;
      callback(null, signingPublicKey);
    });
  }
  return await new Promise((resolve, reject) => {
    jwt.verify(idToken, getKey, function (err, decodedIdToken) {
      if (!err) {
        logger.info('decoded id token');
        resolve(decodedIdToken as ICognitoUserInfo);
      } else {
        logger.error(err);
        reject(err);
      }
    });
  });
};
