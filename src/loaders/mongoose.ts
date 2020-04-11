import * as mongoose from 'mongoose';
import { Db } from 'mongodb';
import { config } from '../config';
import { AppLogger } from './logger';

const logger = new AppLogger('Mongo');

export default async (): Promise<Db> => {
  const connection = await mongoose.connect(config.databaseURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  });
  connection.set('debug', function (collectionName, method, query, doc, options) {
    logger.log(`mongo collection: ${collectionName} - method: ${method}}`)
  });
  return connection.connection.db;
};
