import express from 'express';
import basicAuth from 'express-basic-auth';
import { Container } from 'typedi';
import { config } from '../../../../config';
import * as x from '../agendash';
import agendaFactory from '../../../loaders/dependencyInjector';
import mongoConnection from '../../../loaders';
import mongooseLoader from '../../../loaders/mongoose';

const app = express();
let agendaInstance;
describe('this should test agendash /dash route', () => {
	beforeEach(() => {
		basicAuth({
			users: {
				[config.agendash.user]: config.agendash.password,
			},
			challenge: true,
		});
		const con = mongooseLoader();
		//agenda.default({mongoConnection})
		jest.mock('mongoConnection');
		Container.set(
			'agendaInstance',
			agendaFactory({ mongoConnection, models: [] }),
		);
	});

	test('should expect to load the /dash route', async () => {
		x.default(app);
	});
});
