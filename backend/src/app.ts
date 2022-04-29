import express from 'express';
import loaders from 'loaders';

import container from 'container';

import Logger from './loaders/logger';

import config from 'config';

async function startServer() {
  const app = express();

  await loaders({ expressApp: app });
  const { salesforceConnection } = container.cradle;
  // TODO: Remove when dependent modules use container
  app.locals.sfConn = salesforceConnection;

  return app
    .listen(config.port, () => {
      Logger.info(`
      ################################################
      🛡️  Server listening on port: ${config.port} 🛡️
      ################################################
    `);
    })
    .on('error', err => {
      Logger.error(err);
      process.exit(1);
    });
}

export default startServer();
