import { fakeTimers } from '../../api/routes/__tests__/_common';
import APIError from '../apiError';
import { HttpStatusCode } from '../errorHandler';

describe('test utils api errors', () => {
	beforeEach(() => {
		fakeTimers();
	});

	it('should test APIError constructor loading', () => {
		const apiErrorObject = new APIError(
			'Name',
			HttpStatusCode.INTERNAL_SERVER,
			true,
			'internal Server Error',
		);
		expect(apiErrorObject).toBeDefined();
		expect(apiErrorObject.isOperational).toBeTruthy();
		expect(apiErrorObject.httpCode).toBe(HttpStatusCode.INTERNAL_SERVER);
		expect(apiErrorObject.name).toBe('Name');
	});
});
