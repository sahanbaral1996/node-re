import { ChargeBee } from 'chargebee-typescript';

import config from 'config';

export default async () => {
  try {
    const chargebee = new ChargeBee();
    chargebee.configure({ site: config.chargebee.site, api_key: config.chargebee.apiKey });

    return chargebee;
  } catch (error) {
    throw new Error(error);
  }
};
