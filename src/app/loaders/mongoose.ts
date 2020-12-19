import mongoose from 'mongoose';
import { Db } from 'mongodb';
import { config } from '../../config';
import { AppLogger } from '../app.logger';

const logger = new AppLogger('Mongo');

const { username, password, hostname, port, database } = config.mongo;

const dataBaseUrl = () =>
	process.env.NODE_ENV === 'testing'
		? process.env.MONGODB_URI_TEST
		: 'mongodb://almond:froyogreen@localhost:27017/almond?authSource=admin';

const databaseUrl = `mongodb://${username}:${password}@${hostname}:${port}/${database}?authSource=admin`;
// const databaseUrl = `mongodb://${hostname}:${port}/${database}`;

// TODO: Check on bluebird promise based library with mongoose

export default async (): Promise<Db> => {
	const connection = await mongoose.connect(databaseUrl, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
	});
	connection.set(
		'debug',
		function (collectionName, method, query, doc, options) {
			logger.log(`[mongoCollection] ${collectionName} - method: ${method}`);
		},
	);

	return connection.connection.db;
};
