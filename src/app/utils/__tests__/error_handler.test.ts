import { BaseError, errorHandler, HttpStatusCode } from '../errorHandler';

describe('test error handlers util', () => {
	const error: Error = new Error('Error');
	beforeEach(() => {}, 2000);

	it('should test the handle error function ', () => {
		const exec = errorHandler.handleError(error);
		expect(exec).toBeDefined();
	}, 3000);

	it('should test the handle is Trusted Error function ', () => {
		const exec = errorHandler.isTrustedError(error);
		expect(exec).toBeDefined();
		const execInstanceOfBaseError = errorHandler.isTrustedError(
			new BaseError(
				'BASE',
				HttpStatusCode.INTERNAL_SERVER,
				true,
				'internal server error',
			),
		);
		expect(execInstanceOfBaseError).toBeDefined();
	}, 3000);
});
