import { AppLogger } from '../../app.logger';
import { Container } from 'typedi';
import DashboardService from '../dashboard';
import User from '../../models/user';
import Device from '../../models/device';
import anything = jasmine.anything;

const service = new DashboardService(User, Device);
describe('test dashboard service', () => {
	beforeEach(() => {
		const logger = new AppLogger('Loaders');
		Container.set('logger', logger);
		Container.set('DashboardService', service);
	});
	it('should test get device summary function', () => {
		expect(service.GetDeviceSummary()).toBeTruthy();
	});

	it('should test get user summary function', () => {
		expect(service.GetUsersSummary()).toBeTruthy();
		expect(service.GetUsersSummary().catch(anything)).rejects.toThrow(
			expect.any(Error),
		);
	});
});
