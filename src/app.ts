require('newrelic');
import 'reflect-metadata';
import express from 'express';
import { config } from './config';
import { AppLogger } from './loaders/logger';

const logger = new AppLogger('Start');

async function startServer() {
  const app = express();
  const { port = 8080 } = config;
  await require('./loaders').default({ expressApp: app });

  process.on('uncaughtException', e => {
    logger.error(`Uncaught Exception: ${e.stack}`, `Error: ${e}`);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason, p) => {
    logger.error(`Unhandled Rejection at: ${JSON.stringify(p)}`, `reason:, ${reason}`);
    process.exit(1);
  });

  app.listen(port, (err: any) => {
    if (err) {
      logger.error(err.message, err.stack);
      process.exit(1);
      return;
    }

    logger.log(`
      ########################################
      😎  Server listening on port: ${port} 😎
      ########################################
    `);
  });
}

startServer().catch(err => logger.error(err.message, err.stack));
