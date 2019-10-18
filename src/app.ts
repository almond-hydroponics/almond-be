import 'reflect-metadata';
import * as express from 'express';

import config from './config';
import Logger from './loaders/logger';

async function startServer() {
  const app = express();

  await require('./loaders').default({ expressApp: app });

  app.listen(config.port, err => {
    if (err) {
      Logger.error(err);
      process.exit(1);
      return;
    }
    Logger.info(`Server listening to port: ${config.port}`);
  })
}

startServer();
