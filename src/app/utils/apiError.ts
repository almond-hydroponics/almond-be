import { BaseError, HttpStatusCode } from './errorHandler';

class APIError extends BaseError {
	constructor(
		name: string,
		httpCode = HttpStatusCode.INTERNAL_SERVER,
		isOperational = true,
		description = 'Internal Server Error',
	) {
		super(name, httpCode, isOperational, description);
	}
}

export default APIError;
