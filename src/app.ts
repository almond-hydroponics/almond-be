import 'reflect-metadata';
import * as express from 'express';
import { AppLogger } from './loaders/logger';
const logger = new AppLogger('Start');
async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 5000;
  await require('./loaders').default({ expressApp: app });

  // @ts-ignore
  app.listen(PORT, (err: any) => {
    if (err) {
      logger.error(err.message, err.stack);
      // process.exit(1);
      return;
    }
    logger.log(`
      ########################################
      😎  Server listening on port: ${PORT} 😎
      ########################################
    `);
  })
}

startServer().catch(err => logger.error(err.message, err.stack));
