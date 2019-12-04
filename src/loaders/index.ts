import expressLoader from './express';
import dependencyInjectorLoader from './dependencyInjector';
import jobsLoader from './jobs';
import { AppLogger } from './logger';
import mongooseLoader from './mongoose';
//We have to import at least all the events once so they can be triggered
import './events';
import MailerService from '../services/mailer';

export default async ({expressApp}) => {
  const logger = new AppLogger('Loaders');
  const mongoConnection = await mongooseLoader();
  logger.log('✌️ Database loaded and connected!');

  /**
   * We are injecting the mongoose models into the DI container.
   * I know this is controversial but will provide a lot of flexibility at the time
   * of writing unit tests, just go and check how beautiful they are!
   */

  const scheduleModel = {
    name: 'scheduleModel',
    // Notice the require syntax and the '.default'
    model: require('../models/schedule').default,
  };

  const userModel = {
    name: 'userModel',
    model: require('../models/user').default,
  };

  const scheduleOverrideModel = {
    name: 'scheduleOverrideModel',
    model: require('../models/scheduleOverride').default,
  };
  const activityLogModel = {
    name: 'activityLogModel',
    model: require('../models/activityLog').default,
  };

  // It returns the agenda instance because it's needed in the subsequent loaders
  const { agenda } = await dependencyInjectorLoader({
    mongoConnection,
    models: [
      scheduleModel,
      userModel,
      scheduleOverrideModel,
      activityLogModel,
      // whateverModel
    ],
  });
  logger.log('✌️ Dependency Injector loaded');

  await jobsLoader({ agenda });
  logger.log('✌️ Jobs loaded');

  await expressLoader({ app: expressApp, agendaInstance: agenda });
  logger.log('✌️ Express loaded');
};
