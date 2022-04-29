import { asValue } from 'awilix';

import container from 'container';

import LoggerInstance from './logger';

export default async ({
  salesforceConnection,
  cognitoClient,
  jwksClientInstance,
  chargeBeeConnection,
  customEventEmitter,
}) => {
  container.register({
    salesforceConnection: asValue(salesforceConnection),
  });

  container.register({
    cognitoClient: asValue(cognitoClient),
  });

  container.register({
    logger: asValue(LoggerInstance),
  });

  container.register({
    chargebee: asValue(chargeBeeConnection),
  });

  container.register({
    jwksClient: asValue(jwksClientInstance),
  });

  container.register({
    customEventEmitter: asValue(customEventEmitter),
  });
};
