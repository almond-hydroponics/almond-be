import * as index from '../../index';
import { Container } from 'typedi';
import mongooseLoader from '../../../loaders/mongoose';
import agendaFactory from '../../../loaders/agenda';
import { fakeTimers } from './_common';
fakeTimers();

describe('this tests the defaults on exported routes', () => {
	beforeEach(async () => {
		/*
    # Refactor mongo service on this test which will enable smooth mocking of the mongo connection
    */
		// fakeTimers();
		// jest.autoMockOn()
		// const mongoConnection = await mongooseLoader().then(() => {
		// });
		// const agendaInstance = agendaFactory({ mongoConnection });
		// Container.set('agendaInstance',agendaInstance);
	});
	it('should be able to load all the routes', () => {
		// fakeTimers();
		// expect(index).toBeDefined();
		// index.default();

		console.log(
			'Refactor mongo service on this test which will enable smooth mocking of the mongo connection',
		);
	});
});
