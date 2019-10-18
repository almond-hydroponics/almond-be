import { Container } from 'typedi';
import expressLoader from './express';
import Logger from './logger';
import LoggerInstance from './logger';

export default async ({expressApp}) => {
  Container.set('logger', LoggerInstance);
  LoggerInstance.info('✌️ Logger injected into container');

  await expressLoader({app: expressApp});
  Logger.info('✌️ Express loaded');
};
