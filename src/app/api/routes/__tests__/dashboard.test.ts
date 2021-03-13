import express from 'express';
import { Container } from 'typedi';
import { AppLogger } from '../../../app.logger';
import * as x from '../dashboard';

const app = express();

describe('this tests the device route', () => {
	beforeEach(() => {
		const logger = new AppLogger('Loaders');
		Container.set('logger', logger);
	});

	it('test /pump route', async () => {
		expect(app).toBeDefined();
		x.default(app);
	});
});
