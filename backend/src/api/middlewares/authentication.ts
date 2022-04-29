import jwt from 'jsonwebtoken';

import jwksClient from 'jwks-rsa';

import container from 'container';

import { AUTHORIZATION_HEADER, ID_TOKEN_HEADER } from 'constants/authentication.constants';
import APIError from 'api/exceptions/Error';
import { StatusCodes } from 'http-status-codes';
import lang from 'lang';
import { ICognitoUserInfo } from 'types/cognito/user.types';
import { Request } from 'express';
import {
  CUSTOMER_COGNITO_GROUP,
  CUSTOMER_COGNITO_USER_NAME,
  CUSTOM_ACCOUNT_REFERENCE_ID,
  CUSTOM_CHARGEBEE_ID_ATTRIBUTE,
  CUSTOM_CUSTOMER_REFERENCE_ID,
  CUSTOM_SALESFORCE_ID_ATTRIBUTE,
} from 'constants/cognito.constants';

const validateToken = async (req: Request, res, next) => {
  try {
    const jwksClient: jwksClient.JwksClient = container.resolve('jwksClient');

    function getKey(header, callback) {
      jwksClient.getSigningKey(header.kid as string, function (err, key) {
        const signingKey = key as jwksClient.RsaSigningKey;
        const signingPublicKey = signingKey.rsaPublicKey;
        callback(null, signingPublicKey);
      });
    }

    const authorization = req.header(AUTHORIZATION_HEADER);
    const idTokenHeader = req.header(ID_TOKEN_HEADER);

    if (!!authorization && !!idTokenHeader) {
      const [, accessToken] = authorization.split('Bearer ');
      const [, idToken] = idTokenHeader.split('ID ');

      await new Promise((resolve, reject) => {
        jwt.verify(accessToken, getKey, function (err, decodedAccessToken) {
          if (!err) {
            resolve(decodedAccessToken);
          } else {
            reject(err);
          }
        });
      });

      const decodedIdToken: ICognitoUserInfo = await new Promise((resolve, reject) => {
        jwt.verify(idToken, getKey, function (err, decodedIdToken) {
          if (!err) {
            resolve(decodedIdToken as ICognitoUserInfo);
          } else {
            reject(err);
          }
        });
      });

      const salesforceReferenceId = decodedIdToken[CUSTOM_ACCOUNT_REFERENCE_ID]
        ? decodedIdToken[CUSTOM_ACCOUNT_REFERENCE_ID]
        : decodedIdToken[CUSTOM_SALESFORCE_ID_ATTRIBUTE];
      const chargebeeReferenceId = decodedIdToken[CUSTOM_CUSTOMER_REFERENCE_ID]
        ? decodedIdToken[CUSTOM_CUSTOMER_REFERENCE_ID]
        : decodedIdToken[CUSTOM_CHARGEBEE_ID_ATTRIBUTE];

      req.currentUser = {
        id: decodedIdToken[CUSTOMER_COGNITO_USER_NAME],
        email: decodedIdToken.email,
        salesforceReferenceId,
        chargebeeReferenceId,
        groups: decodedIdToken[CUSTOMER_COGNITO_GROUP],
        shouldMigrate: !!decodedIdToken[CUSTOM_SALESFORCE_ID_ATTRIBUTE] && !decodedIdToken[CUSTOM_ACCOUNT_REFERENCE_ID],
      };

      return next();
    }
    throw new Error('Custom Headers are undefined');
  } catch (error) {
    next(new APIError(lang.tokenExpired, StatusCodes.UNAUTHORIZED));
  }
};

export default validateToken;
