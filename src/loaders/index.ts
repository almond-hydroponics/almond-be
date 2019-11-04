import expressLoader from './express';
import dependencyInjectorLoader from './dependencyInjector';
import jobsLoader from './jobs';
import mongooseLoader from './mongoose';
import Logger from './logger';
//We have to import at least all the events once so they can be triggered
import './events';

export default async ({expressApp}) => {
  const mongoConnection = await mongooseLoader();
  Logger.info('✌️ Database loaded and connected!');

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

  // It returns the agenda instance because it's needed in the subsequent loaders
  const { agenda } = await dependencyInjectorLoader({
    mongoConnection,
    models: [
      scheduleModel,
      userModel,
      scheduleOverrideModel,
      // whateverModel
    ],
  });
  Logger.info('✌️ Dependency Injector loaded');

  await jobsLoader({ agenda });
  Logger.info('✌️ Jobs loaded');

  await expressLoader({app: expressApp});
  Logger.info('✌️ Express loaded');
};
