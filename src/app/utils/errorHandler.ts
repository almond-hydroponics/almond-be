import { AppLogger } from '../app.logger';

const logger = new AppLogger('ErrorHandler');

export enum HttpStatusCode {
	OK = 200,
	CREATED = 201,
	BAD_REQUEST = 400,
	NOT_FOUND = 404,
	INTERNAL_SERVER = 500,
}

export class BaseError extends Error {
	public readonly name: string;
	public readonly httpCode: HttpStatusCode;
	public readonly isOperational: boolean;
	public readonly description: string;

	constructor(
		name: string,
		httpCode: HttpStatusCode,
		isOperational: boolean,
		description: string,
	) {
		super(description);
		Object.setPrototypeOf(this, new.target.prototype);

		this.name = name;
		this.httpCode = httpCode;
		this.isOperational = isOperational;

		Error.captureStackTrace(this);
	}
}

class ErrorHandler {
	public async handleError(err: Error): Promise<void> {
		logger.error(
			'Error message from the centralized error-handling component',
			err,
		);
		// await sendMailToAdminIfCritical();
		// await sendEventsToSentry();
	}

	public isTrustedError(error: Error) {
		if (error instanceof BaseError) {
			return error.isOperational;
		}
		return false;
	}
}

export const errorHandler = new ErrorHandler();
