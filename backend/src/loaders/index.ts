import expressLoader from './express';

import salesforceLoader from './salesforce';

import chargeBeeLoader from './chargebee';

import cognitoLoader from './cognito';

import dependencyInjectorLoader from './dependencyInjectors';

import Logger from './logger';

import jwksLoader from './jwks';

import customEventEmitterLoader from './events';

export default async ({ expressApp }) => {
  const salesforceConnection = await salesforceLoader();
  Logger.info('✌️  Salesforce connection loaded');

  const cognitoClient = cognitoLoader();
  Logger.info('✌️  Cognito client loaded');

  const jwksClientInstance = jwksLoader();
  Logger.info('✌️  JWKS client loaded');

  const chargeBeeConnection = await chargeBeeLoader();
  Logger.info('✌️  Chargebee client loaded');

  const customEventEmitter = customEventEmitterLoader();
  Logger.info('✌️  Custom Event Emitter loaded');

  dependencyInjectorLoader({
    salesforceConnection,
    cognitoClient,
    chargeBeeConnection,
    jwksClientInstance,
    customEventEmitter,
  });
  Logger.info('✌️  Dependency Injector loaded');

  await expressLoader({ app: expressApp });
  Logger.info('✌️  Express loaded');
};
