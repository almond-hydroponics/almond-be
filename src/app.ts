import 'reflect-metadata';

import config from './config';

import * as express from 'express';

import Logger from './loaders/logger';

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 5000;

  await require('./loaders').default({ expressApp: app });

  // @ts-ignore
  app.listen(PORT, (err: any) => {
    if (err) {
      Logger.error(err);
      process.exit(1);
      return;
    }
    Logger.info(`
      ########################################
      😎  Server listening on port: ${PORT} 😎
      ########################################
    `);
  })
}

startServer().catch(err => Logger.error(err));
