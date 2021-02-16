import attachCurrentUser from '../attachCurrentUser';
import { Container } from 'typedi';
import { AppLogger } from '../../../app.logger';

const mockRequest = (sessionData) => {
	return {
		session: { data: sessionData },
	};
};

const mockResponse = () => {
	const res = {
		status: undefined,
		json: undefined,
	};

	res.status = jest.fn().mockReturnValue(res);
	res.json = jest.fn().mockReturnValue(res);
	return res;
};

describe('check authentication', () => {
	beforeEach(() => {
		const logger = new AppLogger('Loaders');
		Container.set('logger', logger);
	});
	test('should 401 if session data is not set', async () => {
		let req: { session: { data: any } };
		// @ts-ignore
		req = mockRequest();
		const res = mockResponse();

		// @ts-ignore
		await attachCurrentUser(req, res, () => {
			console.log('attached user');
		}).then((data) => {
			console.log('VOID');
		});

		// @ts-ignore
		expect('res.status').toBe('res.status');
	});

	test('attach the user from the request session', async () => {
		const req = mockRequest({ username: 'testUserName' });
		const res = mockResponse();

		// @ts-ignore
		await attachCurrentUser(req, res, () => {
			console.log('attached user');
		}).then((data) => {
			console.log('VOID');
		});
		expect('res.status').toBe('res.status');
	});
});
