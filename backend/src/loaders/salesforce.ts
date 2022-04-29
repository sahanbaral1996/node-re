import { Connection } from 'jsforce';

import config from 'config';

export default async () => {
  try {
    const salesforceConection = new Connection({
      oauth2: {
        loginUrl: config.salesforce.loginUrl,
        clientId: config.salesforce.clientId,
        clientSecret: config.salesforce.clientSecret,
      },
    });

    await salesforceConection.login(config.salesforce.username, config.salesforce.password);

    return salesforceConection;
  } catch (error) {
    throw new Error(error);
  }
};
