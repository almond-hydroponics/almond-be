require('newrelic');
import 'reflect-metadata';
import * as express from 'express';
import { config } from './config';
import { AppLogger } from './loaders/logger';
const logger = new AppLogger('Start');

async function startServer() {
  const app = express();
  const PORT = config.port || 8080;
  await require('./loaders').default({ expressApp: app });

  app.listen(PORT, (err: any) => {
    if (err) {
      logger.error(err.message, err.stack);
      process.exit(1);
      return;
    }
    process.on('unhandledRejection', (reason, p) => {
      logger.error(`Unhandled Rejection at: ${p}`, `reason:, ${reason}`);
      process.exit(1)
    });
    logger.log(`
      ########################################
      😎  Server listening on port: ${PORT} 😎
      ########################################
    `);
  })
}

startServer().catch(err => logger.error(err.message, err.stack));
