import express from 'express';
import * as x from '../device';
import { AppLogger } from '../../../app.logger';
import { Container } from 'typedi';
import mongoose from 'mongoose';
import { fakeTimers } from './_common';

const app = express();

describe('this tests the device route', () => {
	beforeEach(() => {
		fakeTimers();
		const logger = new AppLogger('Loaders');
		Container.set('logger', logger);
	});

	afterAll(() => {
		mongoose.connection.close();
	});
	it('test /pump route', async () => {
		/*
    #### THIS MODULE REQUIRES REFACTORING FROM THE device.ts (ENDPOINTS NEEDS TO BE EXPOSED TO OTHER INTERFACES)
    #### HAVING EXPORTED ENDPOINTS INDEPENDENTLY WOULD MANAGED TESTING EASILY.
     */
		//const req = mockRequest();
		//const resp = mockResponse();

		//#### TEMPORARILY INVOKE THE MAIN FUNCTION
		expect(app).toBeDefined();
		x.default(app);
	});
});
